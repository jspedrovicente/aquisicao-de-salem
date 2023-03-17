import { async } from "@firebase/util";
import { setDoc, doc, addDoc, collection, onSnapshot, deleteDoc, updateDoc } from "firebase/firestore";
import { useEffect, useState } from "react";
import { database } from "../../firebaseConnection";
import "./night.css"
// SET THE Function wakeup ORDER IN FIREBASE FOR EACH CHARACTER, REMEMBER MERETRIZ IS FIRST IF THE EXECUTOR HAS ALREADY MADE HIS DECISION
const Night = () => {
    const [user, setUser] = useState([]);
    const [players, setPlayers] = useState([]);
    const [alivePlayers, setAlivePlayers] = useState([]);
    const [townRole, setTownRole] = useState([]);
    const [covenRole, setCovenRole] = useState([]);
    const [mafiaRole, setMafiaRole] = useState([]);
    const [neutralRole, setNeutralRole] = useState([]);
    const [allRoles, setAllRoles] = useState([]);
    const [player, setPlayer] = useState('');

    // Night Manipulation
    const [controlCounter, setControlCounter] = useState(0);
    const [currentPlayerTitle, setCurrentPlayerTitle] = useState('')
    const [currentPlayerDescription, setCurrentPlayerDescription] = useState('')
    // Night actions that transfers to morning
    const [visitAction, setVisitAction] = useState('');
    const [executorAction, setExecutorAction] = useState('');
    const [motivateAction, setMotivateAction] = useState('');
    
    // Night actions that do not transfer
    const [blockAction, setBlockAction] = useState('');


    useEffect(() => {
        const loadUserInformation = () => {
            const userDetail = localStorage.getItem("UserLogin");
            setUser(JSON.parse(userDetail));
            const data = JSON.parse(userDetail);
        } 

        
        loadUserInformation();
    }, [])
    useEffect(() => {
        const loadPlayers = () => {
            const x = onSnapshot(collection(database, `playeradmin/players/${user.email}`), (snapshot) => {
                let list = [];
                snapshot.forEach((doc) => {
                    list.push({
                        id: doc.id,
                        key: doc.id,
                        playerName: doc.data().playerName,
                        victoryPoints: doc.data().victoryPoints,
                        role: doc.data().role,
                        filliation: doc.data().filliation,
                        life: doc.data().life,
                        action: doc.data().action,
                        wakeOrder: doc.data().wakeOrder
                    })
                })
                setPlayers(list);
                setAlivePlayers(list.sort((a, b) => a.wakeOrder - b.wakeOrder).filter(player => player.life.includes("alive")))
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

        loadPlayers();
    }, [user.email]);
    useEffect(() => {

        function addAllRoles(townRole, mafiaRole, covenRole, neutralRole) {  
            setAllRoles([...townRole,...mafiaRole, ...covenRole, ...neutralRole])
           
       }
        addAllRoles(covenRole, mafiaRole, townRole, neutralRole);
    }, [covenRole])
    const incrementCounter = () => {
        setControlCounter(controlCounter => controlCounter + 1);
    };
    
    const openSingleDropDown = () => {
        let attackDropDown = document.querySelector(".alivePlayerDropDownAction")
        attackDropDown.classList.remove("invisible")
    }
    const closeSingleDropDown = () => {
        let attackDropDown = document.querySelector(".alivePlayerDropDownAction")
        attackDropDown.classList.add("invisible")
    }
    const openConfirmButton = () => {
        let attackDropDown = document.querySelector(".confirmButton")
        attackDropDown.classList.add("invisible")
    }
    const closeConfirmButton = () => {
        let attackDropDown = document.querySelector(".confirmButton")
        attackDropDown.classList.add("invisible")
    }
    
    const writePlayerInformation = () => {
        var currentPlayer = alivePlayers[controlCounter];
        var roledetails = allRoles.filter(singleRole => { return singleRole.role === currentPlayer.role });
        setCurrentPlayerTitle(currentPlayer.role);
        setCurrentPlayerDescription(roledetails[0].skill);
    }
    const wakeUpPlayers = () => {
        if (alivePlayers[controlCounter] != null) {
            
        switch (alivePlayers[controlCounter].role) {
            case 'meretriz':
                openSingleDropDown();
                writePlayerInformation();
                incrementCounter();
                break;
            case 'executor':
                openSingleDropDown();
                writePlayerInformation();
                incrementCounter();
                break;
            case 'bardo':
                writePlayerInformation();
                if (alivePlayers[controlCounter].playerName.includes(blockAction)) {
                    setCurrentPlayerDescription('Jogador Bloqueado, clique em pular a vez');
                    closeConfirmButton();
                } else {
                    openSingleDropDown();
                }
                incrementCounter();
                break;
        }   
            return;
        }
            
    }
    const confirmAction = () => {
        switch (alivePlayers[controlCounter - 1].role) {
            case 'meretriz':
                setBlockAction(player);
                setVisitAction([...visitAction, { visitor: alivePlayers[controlCounter - 1].playerName, target: player }]);
                closeSingleDropDown();
                break;

            case 'executor':
                setExecutorAction(player);
                setVisitAction([...visitAction, { visitor: alivePlayers[controlCounter - 1].playerName, target: player }]);
                closeSingleDropDown();
                break;
            case 'bardo':
                setMotivateAction(player);
                setVisitAction([...visitAction, { visitor: alivePlayers[controlCounter - 1].playerName, target: player }]);
                closeSingleDropDown();
                break;
        }
        
            wakeUpPlayers();
    }
    const skipAction = () => {
        incrementCounter();
    }
    const iniciarNoite = () => {
        document.querySelector(".startbutton").classList.add('invisible')
        wakeUpPlayers();
    } 
    const checkstuff = () => {
        console.log(blockAction);
        console.log(visitAction);
        console.log(executorAction);
        console.log(alivePlayers);
    }
    return (

        <div className="night">
            <h3 className="page-title">
                Noite 1
            </h3>
            <button className="button">Encerrar Jogo</button>
            <div className="nightMain">
                <div className="event-action event">
                        <h4>
                        Ação Noturna
                        </h4>
                    <div className="huge-container card-border scrollable">
                        <h4 className="playerRole">{currentPlayerTitle}</h4>
                        <p className="playerDescription">{ currentPlayerDescription }</p>
                        <div className="actionContainer">
                            <div className="alivePlayerDropDownAction invisible">
                                <select name="alivePlayer" id="alivePlayer" value={player} onChange={(e) => {setPlayer(e.target.value)}}>
                                    {alivePlayers.map((player) => (
                                        <option key={alivePlayers.key}>
                                            {player.playerName}
                                        </option>
                                    ))}
                                </select>
                            </div>
                                <button type="button" className="button confirmButton" onClick={confirmAction}>
                                        Confirmar Ação
                            </button>
                            <button type="button" className="button skipButton" onClick={skipAction}>Pular Vez</button>
                            <button type="button" className="button startbutton" onClick={iniciarNoite}>Iniciar Noite</button>
                            <button type="button" className="button startbutton" onClick={checkstuff}>check stuff</button>
                            <button type="button" className="button startbutton" onClick={wakeUpPlayers}>Wakeup</button>
                            {controlCounter}
                        </div>
                    </div>
                    
                </div>
                <div className="night-right">

                <div className="event-currentplayers event">
                        <h4>
                        Jogadores Vivos
                        </h4>
                        <div className="small-container card-border scrollable characters">
                            {alivePlayers.map((player) => (
                                <p key={player.key}>
                                    {player.playerName} - {player.role}
                                </p>
                            ))}
                        </div>
                    
                </div>
                <div className="event-buttons">
                    <button className="button"> Encerrar Noite!</button>

                </div>
                </div>
            </div>
        </div>
    )
}

export default Night;