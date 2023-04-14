import { useState, useEffect } from "react";
import "./playerRole.css"
import ButtonLink from "../../components/ButtonLink"
import { database } from "../../firebaseConnection";
import useSound from "use-sound";
import ambienceSound from "../../assets/ambience-soundeffect.mp3"
import { useNavigate } from "react-router-dom";
import { setDoc, doc, addDoc, collection, onSnapshot, deleteDoc, updateDoc } from "firebase/firestore";

const PlayerRole = () => {
    const [townRole, setTownRole] = useState([]);
    const [covenRole, setCovenRole] = useState([]);
    const [mafiaRole, setMafiaRole] = useState([]);
    const [user, setUser] = useState({});
    const [allRoles, setAllRoles] = useState([]);
    const [playerList, setPlayerList] = useState([]);
    const [neutralRole, setNeutralRole] = useState([]);
    const [availableRoles, setAvailableRoles] = useState([]);
    const [enemyfill, setEnemyFill] = useState('');
    // information for setting the current information for a player
    const [currentFilliation, setCurrentFilliation] = useState('town');
    const [currentPlayer, setCurrentPlayer] = useState('');
    const [currentRole, setCurrentRole] = useState('');
    const navigate = useNavigate();
    const [playAmbienceSound, { stop }] = useSound(ambienceSound);
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
                        wakeOrder: doc.data().wakeOrder
                    })
                })
                setTownRole(roles)

            })
            const mafiaSnapshot = onSnapshot(collection(database, "gamedata/roles/mafia"), (snapshot) => {
                let roles = [];
                snapshot.forEach((doc) => {
                    roles.push({
                        filliation: "mafia",
                        role: doc.data().role,
                        skill: doc.data().skill,
                        special: doc.data().special,
                        wakeOrder: doc.data().wakeOrder

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
                        wakeOrder: doc.data().wakeOrder

                    })
                })
                setCovenRole(roles);
                
            })
            const neutralSnapshot = onSnapshot(collection(database, "gamedata/roles/neutral"), (snapshot) => {
                let roles = [];
                snapshot.forEach((doc) => {
                    roles.push({
                        filliation: "neutral",
                        role: doc.data().role,
                        skill: doc.data().skill,
                        special: doc.data().special,
                        wakeOrder: doc.data().wakeOrder

                    })
                })
                setNeutralRole(roles);
                
            })
        }
        loadInfo();
    }, []) 
    useEffect(() => {

        function addAllRoles(townRole, mafiaRole, covenRole, neutralRole) {  
            setAllRoles([...townRole,...mafiaRole, ...covenRole, ...neutralRole])
           
       }
        addAllRoles(covenRole, mafiaRole, townRole, neutralRole);
    playAmbienceSound();

    }, [covenRole])
    const handleConfirm = async (e) => {
        e.preventDefault(); 
        for (let i = 0; i < playerList.length; i++) {
            if (playerList[i].playerName === currentPlayer) {
                const currentId = playerList[i].id;
                if (currentRole === "meretriz") {
                await updateDoc(doc(database, "playeradmin", "players", user.email, currentId), { role: currentRole, filliation: currentFilliation, life: "alive", action: "pending", wakeOrder: 2})
                    return;  
                }
                if (currentRole === "executor") {
                await updateDoc(doc(database, "playeradmin", "players", user.email, currentId), { role: currentRole, filliation: currentFilliation, life: "alive", action: "pending", wakeOrder: 1})
                    return;
                }
                if (currentRole === "godfather") {
                await updateDoc(doc(database, "playeradmin", "players", user.email, currentId), { role: currentRole, filliation: currentFilliation, life: "alive", action: "pending", wakeOrder: 28})
                    return;
                }
                if (currentRole === "afilhado") {
                await updateDoc(doc(database, "playeradmin", "players", user.email, currentId), { role: currentRole, filliation: currentFilliation, life: "alive", action: "pending", wakeOrder: 29})
                    return;
                }
                if ( currentRole === "conselheira" || currentRole === "vigarista" || currentRole === "zelador") {
                await updateDoc(doc(database, "playeradmin", "players", user.email, currentId), { role: currentRole, filliation: currentFilliation, life: "alive", action: "pending", wakeOrder: 30})
                    return;
                }
                if ( currentRole === "amaldicoadora" || currentRole === "feiticeira benevolente" || currentRole === "ilusionista" || currentRole === "parasita" || currentRole === "miragem") {
                await updateDoc(doc(database, "playeradmin", "players", user.email, currentId), { role: currentRole, filliation: currentFilliation, life: "alive", action: "pending", wakeOrder: 35})
                    return;
                }
                if ( currentRole === "coveiro" || currentRole === "sobrevivente" || currentRole === "estranho" || currentRole === "prefeito" || currentRole === "bobo da corte" || currentRole === "cidadao") {
                await updateDoc(doc(database, "playeradmin", "players", user.email, currentId), { role: currentRole, filliation: currentFilliation, life: "alive", action: "pending", wakeOrder: 150})
                    return;
                }
                await updateDoc(doc(database, "playeradmin", "players", user.email, currentId), { role: currentRole, filliation: currentFilliation, life: "alive", action: "pending", wakeOrder: 99})
                return;
            }
        }

    }

    const handleReset = async (e) => {
        for (let i = 0; i < playerList.length; i++) {
            const currentId = playerList[i].id;
            await updateDoc(doc(database, "playeradmin", "players", user.email, currentId), {role: "none", filliation: "none", life: "none", action: "none", wakeOrder: 0})
        }
    }
    function mafiaFill() {
        document.querySelector('.coven').classList.add('invisible');
        document.querySelector('.cavaleirosDoApocalipse').classList.add('invisible');
        document.querySelector('.mafia').classList.remove('invisible');
    }
    function covenFill() {
        document.querySelector('.mafia').classList.add('invisible');
        document.querySelector('.cavaleirosDoApocalipse').classList.add('invisible');
        document.querySelector('.coven').classList.remove('invisible');

    }
    const startGame = () => {
        stop();
        navigate('/day');
    }
    return (
        <div className="playerRole">
            <h3 className="page-title">
            Seleciona a função de cada jogador
            </h3>
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
                                    <option value="mafia" className="mafia">Mafia</option>
                                    <option value="cavaleirosDoApocalipse" className="cavaleirosDoApocalipse">Cavaleiros do Apocalipse</option>
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
                    </form>
                    <div className="selecting-opponent">
                        <button type="button" onClick={mafiaFill} className="button">Mafia</button>
                        <button type="button" onClick={covenFill} className="button">Coven</button>
                        {/* <button type="button" onClick={setEnemyFilliation("cavaleirosDoApocalipse")} className="button">Mafia</button> */}
                    </div>
                </div>
                <div className="playerRole-roles">
                    <div className="town">
                        <h4>
                        Cidade
                        </h4>
                        <div className="playerRole-town card-border scrollable">
                            {playerList.filter(player => player.filliation.includes("town")).map(filteredPlayer => (
                            <p key={filteredPlayer.id}>{filteredPlayer.playerName} - {filteredPlayer.role}</p>
                                ))}
                        </div>
                    </div>
                    <div className="evil">
                        <h4>
                        Mafia/Coven/Cavaleiros
                        </h4>
                        <div className="playerRole-evil card-border scrollable">
                        {playerList.filter(player => player.filliation.includes("mafia")).map(filteredPlayer => (
                            <p key={filteredPlayer.id}>{filteredPlayer.playerName} - {filteredPlayer.role}</p>
                                ))}
                        {playerList.filter(player => player.filliation.includes("coven")).map(filteredPlayer => (
                            <p key={filteredPlayer.id}>{filteredPlayer.playerName} - {filteredPlayer.role}</p>
                                ))}
                        </div>
                    </div>
                    <div className="neutral">
                        <h4>
                        Neutro
                        </h4>
                        <div className="playerRole-neutral card-border scrollable">
                        {playerList.filter(player => player.filliation.includes("neutral")).map(filteredPlayer => (
                            <p key={filteredPlayer.id}>{filteredPlayer.playerName} - {filteredPlayer.role}</p>
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