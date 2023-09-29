import { useState, useEffect } from "react";
import "./playerRole.css"
import ButtonLink from "../../components/ButtonLink"
import { database } from "../../firebaseConnection";
import { Link, useNavigate } from "react-router-dom";
import {doc, collection, onSnapshot, updateDoc, deleteField } from "firebase/firestore";
import Popup from 'reactjs-popup';


const PlayerRole = () => {
    const [isManualRandomizerOpen, setIsManualRandomizerOpen] = useState(false);
    const [townRole, setTownRole] = useState([]);
    const [covenRole, setCovenRole] = useState([]);
    const [horsemenRole, setHorsemenRole] = useState([]);
    const [mafiaRole, setMafiaRole] = useState([]);
    const [user, setUser] = useState({});
    const [allRoles, setAllRoles] = useState([]);
    const [playerList, setPlayerList] = useState([]);
    const [neutralRole, setNeutralRole] = useState([]);
    const [checkboxCounter, setCheckboxCounter] = useState(0);
    // information for setting the current information for a player
    const [currentFilliation, setCurrentFilliation] = useState('town');
    const [currentPlayer, setCurrentPlayer] = useState('');
    const [currentRole, setCurrentRole] = useState('');
    const [randomizerChosenRoles, setRandomizerChosenRoles] = useState([]);
    const navigate = useNavigate();
    useEffect(() => {
        async function loadInfo() {
            const userDetail = localStorage.getItem("UserLogin");
            setUser(JSON.parse(userDetail));
            const data = JSON.parse(userDetail);
            const unsub = onSnapshot(collection(database, `playeradmin/players/${data.email}`), (snapshot) => {
                let list = [];
                snapshot.forEach((doc) => {
                    list.push({
                        id: doc.id,
                        key: doc.id,
                        playerName: doc.data().playerName,
                        victoryPoints: doc.data().victoryPoints,
                        role: doc.data().role,
                        filliation: doc.data().filliation,
                        actionForRoleCounter: doc.data()?.actionForRoleCounter,
                        
                    })
                })
                setPlayerList(list);
            })

            const townSnapshot = onSnapshot(collection(database, "gamedata/roles/town"), (snapshot) => {
                let roles = [];
                snapshot.forEach((doc) => {
                    roles.push({
                        filliation: "town",
                        role: doc.data().role,
                        skill: doc.data().skill,
                        special: doc.data().special,
                        wakeOrder: doc.data().wakeOrder,
                        actionforRoleCounter: doc.data()?.actionforRoleCounter,
                        enabledRole: doc.data().enabledRole,
                        multiple: doc.data().multiple
                    })
                })
                setTownRole(roles)

            })
            const mafiaSnapshot = onSnapshot(collection(database, "gamedata/roles/the family"), (snapshot) => {
                let roles = [];
                snapshot.forEach((doc) => {
                    roles.push({
                        filliation: "the family",
                        role: doc.data().role,
                        skill: doc.data().skill,
                        special: doc.data().special,
                        wakeOrder: doc.data().wakeOrder,
                        actionforRoleCounter: doc.data()?.actionforRoleCounter,
                        enabledRole: doc.data().enabledRole,
                        multiple: doc.data().multiple
                    })
                })
                setMafiaRole(roles);
            })
            const covenSnapshot = onSnapshot(collection(database, "gamedata/roles/coven"), (snapshot) => {
                let roles = [];
                snapshot.forEach((doc) => {
                    roles.push({
                        filliation: "coven",
                        role: doc.data().role,
                        skill: doc.data().skill,
                        special: doc.data().special,
                        wakeOrder: doc.data().wakeOrder,
                        actionforRoleCounter: doc.data()?.actionforRoleCounter,
                        enabledRole: doc.data().enabledRole,
                        multiple: doc.data().multiple
                    })
                })
                setCovenRole(roles);
                
            })
            const horsemenSnapshot = onSnapshot(collection(database, "gamedata/roles/horsemen"), (snapshot) => {
                let roles = [];
                snapshot.forEach((doc) => {
                    roles.push({
                        filliation: "horsemen",
                        role: doc.data().role,
                        skill: doc.data().skill,
                        special: doc.data().special,
                        wakeOrder: doc.data().wakeOrder,
                        actionforRoleCounter: doc.data()?.actionforRoleCounter,
                        enabledRole: doc.data().enabledRole,
                        multiple: doc.data().multiple

                    })
                })
                setHorsemenRole(roles);
                
            })
            const neutralSnapshot = onSnapshot(collection(database, "gamedata/roles/neutral"), (snapshot) => {
                let roles = [];
                snapshot.forEach((doc) => {
                    roles.push({
                        filliation: "neutral",
                        role: doc.data().role,
                        skill: doc.data().skill,
                        special: doc.data().special,
                        wakeOrder: doc.data().wakeOrder,
                        actionforRoleCounter: doc.data()?.actionforRoleCounter,
                        enabledRole: doc.data().enabledRole,
                        multiple: doc.data().multiple

                    })
                })
                setNeutralRole(roles);
                console.log(roles);
                
            })
        }
        loadInfo();
    }, [])
    useEffect(() => {

        function addAllRoles(townRole, mafiaRole, covenRole, horsemenRole, neutralRole) {
            setAllRoles([...townRole, ...mafiaRole, ...covenRole, ...horsemenRole, ...neutralRole])
           
        }
        addAllRoles(covenRole, mafiaRole, townRole, horsemenRole, neutralRole);

    }, [covenRole, mafiaRole, townRole, horsemenRole, neutralRole])
    const handleConfirm = async (e) => {
        e.preventDefault();
        const chosenPlayer = playerList.filter(player => player.playerName === currentPlayer);
        const chosenRole = allRoles.filter(role => role.role === currentRole);
        const chosenPlayerId = chosenPlayer[0].id
        const chosenRoleWakeOrder = chosenRole[0].wakeOrder
        await updateDoc(doc(database, "playeradmin", "players", user.email, chosenPlayerId), { role: currentRole, filliation: currentFilliation, life: "alive", action: "pending", wakeOrder: chosenRoleWakeOrder, actionforRoleCounter: chosenRole[0].actionforRoleCounter? chosenRole[0].actionforRoleCounter : deleteField() })

    }

    const handleReset = async (e) => {
        e.preventDefault();
        for (let i = 0; i < playerList.length; i++) {
            const currentId = playerList[i].id;
            const ref = doc(database, "playeradmin", "players", user.email, currentId)

            await updateDoc(ref, { role: "none", filliation: "none", life: "none", action: "none", wakeOrder: 0, actionforRoleCounter: 0})
        }
        updateDoc(doc(database, "playeradmin", "playerStatuses", user.email, "gameState", "gameState", "gameState"), { gameState: "inicio"})
    }
    const handleEraseSpecificPlayer = (playerId) => {
        updateDoc(doc(database, "playeradmin", "players", user.email, playerId), { role: "none", filliation: "none", life: "none", action: "none", wakeOrder: 0 })

    }
    const isManualDisabled = () => {
        return randomizerChosenRoles.length !== playerList.length;
    }
    const startGame = () => {
        navigate('/day');
        updateDoc(doc(database, "playeradmin", "playerStatuses", user.email, "gameState", "gameState", "gameState"), { gameState: "dia"})

    }
    async function handleManualRandomizer() {
        var randomizedPlayers = []
        const players = playerList.slice();
        const roleList = randomizerChosenRoles;
        const chosenRoles = []
        for (let i = 0; i < roleList.length; i++){
            const temp = allRoles.filter(role => role.role === roleList[i]) 
            chosenRoles.push(temp[0]);
        }
        for (let i = 0; players.length > 0; i++) {
            const roleIndex = Math.floor(Math.random() * chosenRoles.length)
            var selectedIndex = Math.floor(Math.random() * players.length);
            var selectedName = players.splice(selectedIndex, 1)[0];
            var selectedRole = chosenRoles[roleIndex];
            var usedRole = chosenRoles.filter(role => role.role === selectedRole.role);
            var index = chosenRoles.findIndex(function (obj) {
                return obj.role === usedRole[0].role;
            })
            const deleted = chosenRoles.splice(index, 1)[0];
            randomizedPlayers.push({ selectedName, selectedRole })
        }
        for (let i = 0; i < randomizedPlayers.length; i++) {
            const currentId = randomizedPlayers[i].selectedName.id;
            const currentRole = randomizedPlayers[i].selectedRole.role;
            const wakeOrder = randomizedPlayers[i].selectedRole.wakeOrder;
            const currentFilliation = randomizedPlayers[i].selectedRole.filliation
            await updateDoc(doc(database, "playeradmin", "players", user.email, currentId), { role: currentRole, filliation: currentFilliation, life: "alive", action: "pending", wakeOrder: wakeOrder, willText: "none", actionforRoleCounter: randomizedPlayers[i].selectedRole.actionforRoleCounter? randomizedPlayers[i].selectedRole.actionforRoleCounter : null})
        }
        setRandomizerChosenRoles([]);
        setIsManualRandomizerOpen(false);
    }
    const handleCardDelivery = () => {
        updateDoc(doc(database, "playeradmin", "playerStatuses", user.email, "gameState", "gameState", "gameState"), { gameState: "entregueCartas"})

    }

    const addFunctionToRole = (addedRole) => {
        setRandomizerChosenRoles([...randomizerChosenRoles, addedRole]);
        console.log(randomizerChosenRoles);
    }

    const removeFunctionToRole = (removedRole) => {
        let tempArray = [...randomizerChosenRoles];
        const removedRoleIndex = tempArray.indexOf(removedRole);
        if (removedRoleIndex === -1) {
            // nothing happens
        } else {
            tempArray.splice(removedRoleIndex, 1);
            setRandomizerChosenRoles(tempArray);
        }
    }

    return (
        <div className="playerRole">
            <h3 className="page-title">
            Seleciona a função de cada jogador
            </h3>
            <Popup className="randomizerModalRoles" open={isManualRandomizerOpen} modal closeOnDocumentClick={false}>
                    <div className="header">Randomizador de Funções</div>
                <div className="modalRole">
                    <div className="content modalRandomizerContent">
                    <div className="selectors">
                        <div className="selector-category">
                            <h4>Cidade</h4>
                                <hr />
                                {townRole.map(role => (
                                    role.enabledRole ? (
                                        
                                        <span className="eachRole townies" key={role.key}>
                                <label >{role.role}
                                </label>
                                <div className="buttonSection">
                                {role.multiple? 'M' : 'U'}

                                <button onClick={() => removeFunctionToRole(role.role)}>-</button>
                                <input type="number" readOnly value={randomizerChosenRoles.filter(x => x === role.role).length} />
                                <button onClick={ () => addFunctionToRole(role.role)}>+</button>
                                </div>
                            </span>
                                ) : (null)
                        ))}
                            </div>
                            <div>

                        <div className="selector-category">
                            <h4>A Familia</h4>
                            <hr />
                                {mafiaRole.map(role => (
                                    role.enabledRole ? (
                                
                                <span className="eachRole mafiaies">
                               <label >{role.role} 
                                </label>
                                            <div className="buttonSection">
                                {role.multiple? 'M' : 'U'}
                                <button onClick={() => removeFunctionToRole(role.role)}>-</button>
                                <input type="number" readOnly value={randomizerChosenRoles.filter(x => x === role.role).length} />
                                <button onClick={ () => addFunctionToRole(role.role)}>+</button>
                                </div>
                                </span>) : (null)
                            ))}
                        </div>
                        <div className="selector-category">
                            <h4>Coven - Desabilitadas</h4>
                            <hr />
                                    {covenRole.map(role => (
                                    role.enabledRole ? (
                                
                                <span className="eachRole covenies">
                               <label >{role.role}
                                </label>
                                <div className="buttonSection">
                                {role.multiple? 'M' : 'U'}
                                <button onClick={() => removeFunctionToRole(role.role)}>-</button>
                                <input type="number" readOnly value={randomizerChosenRoles.filter(x => x === role.role).length} />
                                <button onClick={ () => addFunctionToRole(role.role)}>+</button>
                                </div>
                                </span>):(null)
                            ))}
                                </div>
                            </div>
                            <div>
                                
                        <div className="selector-category">
                            <h4>Cavaleiros</h4>
                            <hr />
                                    {horsemenRole.map(role => (
                                    role.enabledRole ? (
                                
                                <span className="eachRole horsies">
                               <label >{role.role}
                                </label>
                                <div className="buttonSection">
                                {role.multiple? 'M' : 'U'}
                                <button onClick={() => removeFunctionToRole(role.role)}>-</button>
                                <input type="number" readOnly value={randomizerChosenRoles.filter(x => x === role.role).length} />
                                <button onClick={ () => addFunctionToRole(role.role)}>+</button>
                                </div>
                                </span>):(null)
                            ))}
                        </div>
                        <div className="selector-category">
                            <h4>Neutros</h4>
                            <hr />
                                    {neutralRole.map(role => (
                                    role.enabledRole ? (
                                
                                <span className="eachRole neutraies">
                               <label >{role.role}
                                </label>
                                <div className="buttonSection">
                                {role.multiple? 'M' : 'U'}
                                <button onClick={() => removeFunctionToRole(role.role)}>-</button>
                                <input type="number" readOnly value={randomizerChosenRoles.filter(x => x === role.role).length} />
                                <button onClick={ () => addFunctionToRole(role.role)}>+</button>
                                </div>
                                </span>) : (null)
                                ))}
                                </div>
                                </div>
                                
                        </div>
                        <div className="manualRandomizerLower">

                            <div>Funções Selecionadas: <span className="counterBox">
                            {randomizerChosenRoles.length}</span></div>
                            <div>Quantidade de Jogadores:
                                <span className="counterBox">{playerList.length}</span>
                            </div>
                            
                        </div>
                        <div className="manualRandomizerLower">

                    <button className="button" disabled={isManualDisabled()} onClick={handleManualRandomizer}>Randomizar Manualmente</button>
                    <button className="button" onClick={() => setIsManualRandomizerOpen(false)}>Fechar Randomizador</button>
                        </div>
                    </div>
                    </div>
            </Popup>
            <div className="playerRole-main">
                <div className="playerRole-assign">
                    <form >
                        <label >
                            Jogador:
                            <select name="player" id="player" value={currentPlayer} onChange={(e) => setCurrentPlayer(e.target.value)}>
                                {playerList.map((player) => (
                                    <option key={player.key}>{player.playerName}
                                    </option>
                                ))}

                            </select>
                        </label>
                        <label >
                            Filiação:
                            <select name="affiliation" id="affiliation" value={currentFilliation} onChange={(e) => setCurrentFilliation(e.target.value)} >
                                    <option value="town" id="town">Cidade</option>
                                    <option value="coven" id="coven" className="coven">Coven</option>
                                    <option value="the family" className="mafia">A Familia</option>
                                    <option value="horsemen" className="cavaleirosDoApocalipse">Cavaleiros do Apocalipse</option>
                                    <option value="neutral" className="neutral">Neutros</option>
                            </select>
                        </label>
                        <label >
                            Função:
                            <select name="role" id="role" value={currentRole} onChange={(e) => setCurrentRole(e.target.value)}>
                                {allRoles.filter(role => role.filliation.includes(currentFilliation)).map(filteredrole => (
                                    <option key={filteredrole.role}>{filteredrole.role}</option>
                                ))} ;
                                

                            </select>
                        </label>
                        <button type="submit" className="button" onClick={handleConfirm}>Confirmar</button>
                        <button type="button" className="button" onClick={handleReset}>Resetar Todos</button>
                        <button type="button" className="button" onClick={() => setIsManualRandomizerOpen(true)}>Gerador Aleatorio Manual</button>
                        <Link to='/statuses' target='_blank' rel='noopener noreferrer' />
                        <a className="button " target="_blank" href="/statuses">Status de Telão</a>
                        <button type="button" className="button" onClick={handleCardDelivery}>Entregar Cartas</button>
                    </form>
                </div>
                <div className="playerRole-roles">
                    <div className="town">
                        <h4>
                        Cidade
                        </h4>
                        <div className="playerRole-town card-border scrollable">
                            {playerList.filter(player => player.filliation.includes("town")).map(filteredPlayer => (
                            <p key={filteredPlayer.id}>{filteredPlayer.playerName} - {filteredPlayer.role} <button className="delete-button" onClick={() => handleEraseSpecificPlayer(filteredPlayer.id)}>x</button></p>
                                ))}
                        </div>
                    </div>
                    <div className="evil">
                        <h4>
                        A Familia/Coven/Cavaleiros
                        </h4>
                        <div className="playerRole-evil card-border scrollable">
                        {playerList.filter(player => player.filliation.includes("the family")).map(filteredPlayer => (
                            <p key={filteredPlayer.id}>{filteredPlayer.playerName} - {filteredPlayer.role} <button className="delete-button" onClick={() => handleEraseSpecificPlayer(filteredPlayer.id)}>x</button></p>
                                ))}
                        {playerList.filter(player => player.filliation.includes("coven")).map(filteredPlayer => (
                            <p key={filteredPlayer.id}>{filteredPlayer.playerName} - {filteredPlayer.role} <button className="delete-button" onClick={() => handleEraseSpecificPlayer(filteredPlayer.id)}>x</button></p>
                                ))}
                        {playerList.filter(player => player.filliation.includes("horsemen")).map(filteredPlayer => (
                            <p key={filteredPlayer.id}>{filteredPlayer.playerName} - {filteredPlayer.role} <button className="delete-button" onClick={() => handleEraseSpecificPlayer(filteredPlayer.id)}>x</button></p>
                                ))}
                        </div>
                    </div>
                    <div className="neutral">
                        <h4>
                        Neutro
                        </h4>
                        <div className="playerRole-neutral card-border scrollable">
                        {playerList.filter(player => player.filliation.includes("neutral")).map(filteredPlayer => (
                            <p key={filteredPlayer.id}>{filteredPlayer.playerName} - {filteredPlayer.role} <button className="delete-button" onClick={() => handleEraseSpecificPlayer(filteredPlayer.id)}>x</button></p>
                                ))}
                        </div>
                    </div>
                    <div className="button-container button-area">
                <ButtonLink destination="/playerlist" buttonText="Voltar"/>
                <button onClick={startGame} className="button">Começar Jogo</button>
            </div>
                </div>
            </div>

        </div>
        
    )
}

export default PlayerRole;