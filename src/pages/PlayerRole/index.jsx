import { useState, useEffect, useReducer } from "react";
import "./playerRole.css"
import ButtonLink from "../../components/ButtonLink"
import { database } from "../../firebaseConnection";
import { setDoc, doc, addDoc, collection, onSnapshot, deleteDoc } from "firebase/firestore";

const PlayerRole = () => {
    const [townRole, setTownRole] = useState([]);
    const [covenRole, setCovenRole] = useState([]);
    const [mafiaRole, setMafiaRole] = useState([]);
    const [playerName, setPlayerName] = useState('');
    const [user, setUser] = useState({});
    const [allRoles, setAllRoles] = useState([]);
    const [playerList, setPlayerList] = useState([]);
    const [neutralRole, setNeutralRole] = useState([]);
    const [availableRoles, setAvailableRoles] = useState([]);
    const [currentFilliation, setCurrentFilliation] = useState('town');

    useEffect(() => {
        async function loadInfo() {
            const userDetail = localStorage.getItem("UserLogin");
            setUser(JSON.parse(userDetail));
                const data = JSON.parse(userDetail);
                const unsub = onSnapshot(collection(database, data?.email), (snapshot) => {
                    let list = [];
                    snapshot.forEach((doc) => {
                        list.push({
                            id: doc.id,
                            key: doc.id,
                            playerName: doc.data().playerName,
                            victoryPoints: doc.data().victoryPoints,
                            role: doc.data().role,
                        })
                    })
                    setPlayerList(list);
                })

            const townSnapshot = onSnapshot(collection(database, "gamedata/roles/town"), (snapshot) => {
                let roles = [];
                snapshot.forEach((doc) => {
                    roles.push({
                        filiation: "town",
                        role: doc.data().role,
                        skill: doc.data().skill,
                        special: doc.data().special
                    })
                })
                setTownRole(roles)

            })
            const mafiaSnapshot = onSnapshot(collection(database, "gamedata/roles/mafia"), (snapshot) => {
                let roles = [];
                snapshot.forEach((doc) => {
                    roles.push({
                        filiation: "mafia",
                        role: doc.data().role,
                        skill: doc.data().skill,
                        special: doc.data().special
                    })
                })
                setMafiaRole(roles);
            })
            const covenSnapshot = onSnapshot(collection(database, "gamedata/roles/coven"), (snapshot) => {
                let roles = [];
                snapshot.forEach((doc) => {
                    roles.push({
                        filiation: "coven",
                        role: doc.data().role,
                        skill: doc.data().skill,
                        special: doc.data().special
                    })
                })
                setCovenRole(roles);
                
            })

            

        }

        loadInfo();
    }, []) 
    useEffect(() => {

        function addAllRoles(townRole, mafiaRole, covenRole) {  
            setAllRoles([...townRole,...mafiaRole, ...covenRole])
           
       }
        addAllRoles(covenRole, mafiaRole, townRole);
    }, [covenRole])


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
                            <select name="player" id="player">
                                {playerList.map((player) => (
                                    <option key={player.key}>{player.playerName}
                                    </option>
                                ))}
                            </select>
                        </label>
                        <label >
                            Filiação:
                            <select name="affiliation" id="affiliation" value={currentFilliation} onChange={(e) => setCurrentFilliation(e.target.value)} >
                                    <option value="town">Cidade</option>
                                <option value="coven">Coven</option>
                                    <option value="mafia">Mafia</option>
                                    <option value="neutral">Neutros</option>
                            </select>
                        </label>
                        <label >
                            Função:
                            <select name="role" id="role">
                                {allRoles.filter(role => role.filiation.includes(currentFilliation)).map(filteredrole => (
                                    <option key={filteredrole.role}>{filteredrole.role}</option>
                                ))} ;

                            </select>
                        </label>
                        <button type="submit" className="button">Confirmar</button>
                    </form>
                </div>
                <div className="playerRole-roles">
                    <div className="town">
                        <h4>
                        Cidade
                        </h4>
                        <div className="playerRole-town card-border scrollable">
                        </div>
                    </div>
                    <div className="evil">
                        <h4>
                        Mafia/Coven/Cavaleiros
                        </h4>
                        <div className="playerRole-evil card-border scrollable">
                        </div>
                    </div>
                    <div className="neutral">
                        <h4>
                        Neutro
                        </h4>
                        <div className="playerRole-neutral card-border scrollable">
                        </div>
                    </div>
            <div className="button-container button-area">
                <ButtonLink destination="/playerlist" buttonText="Voltar"/>
                <button className="button">Começar Partida</button>
            </div>
                </div>
            </div>
        </div>
    )
}

export default PlayerRole;