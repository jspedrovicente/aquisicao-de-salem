import "./day.css"
import ButtonLink from "../../components/ButtonLink"
import { setDoc, doc, addDoc, collection, onSnapshot, deleteDoc, updateDoc } from "firebase/firestore";
import { useEffect, useState } from "react";
import { database } from "../../firebaseConnection";
import { useNavigate } from "react-router-dom";

const Day = () => {

const [user, setUser] = useState([]);
const [players, setPlayers] = useState([]);
const [alivePlayers, setAlivePlayers] = useState([]);
const [deadPlayers, setDeadPlayers] = useState([]);
const [townRole, setTownRole] = useState([]);
const [covenRole, setCovenRole] = useState([]);
const [mafiaRole, setMafiaRole] = useState([]);
const [neutralRole, setNeutralRole] = useState([]);
const [allRoles, setAllRoles] = useState([]);
const [currentDayTemp, setCurrentDayTemp] = useState([]);
const [currentDay, setCurrentDay] = useState(0);
const navigateToNight = useNavigate();

    
    


// Night actions that transfers to morning
const [visitAction, setVisitAction] = useState([]);
const [executorAction, setExecutorAction] = useState('');
const [motivateAction, setMotivateAction] = useState('');
const [armadilheiroAction, setArmadilheiroAction] = useState('');
const [spyAction, setSpyAction] = useState('');
const [weaponCreateAction, setWeaponCreateAction] = useState([])
const [padeiraHealCount, setPadeiraHealCount] = useState(0)
const [blackMailAction, setBlackMailAction] = useState('')
const [cleanUpAction, setCleanUpAction] = useState('')
const [markAction, setMarkAction] = useState('')
const [clownBombAction, setClownBombAction] = useState('')
const [arsonTarget, setArsonTarget] = useState([]);
const [poisonedTarget, setPoisonedTarget] = useState([]);
const [newPoisonedTarget, setNewPoisonedTarget] = useState([]);
const [parasiteAction, setParasiteAction] = useState([]);
const [statusAfliction, setStatusAfliction] = useState([]);    
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
                setDeadPlayers(list.sort((a, b) => a.wakeOrder - b.wakeOrder).filter(player => player.life.includes("dead")))
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
            const dayCounterSnapshot = onSnapshot(collection(database, `playeradmin/playerStatuses/${user.email}/dayCounter/dayCounter`), (snapshot) => {
                const currentDayx = [];
                snapshot.forEach((doc) => {

                    currentDayx.push({ currentDay: doc.data().currentDay })

                })
                
                setCurrentDay(currentDayx[0].currentDay)
                setCurrentDayTemp(currentDayx)
            })
        }
    
        loadPlayers();
    }, [user.email]);
    useEffect(() => {
    
        function addAllRoles(townRole, mafiaRole, covenRole, neutralRole) {
            setAllRoles([...townRole, ...mafiaRole, ...covenRole, ...neutralRole])
           
        }
        addAllRoles(covenRole, mafiaRole, townRole, neutralRole);
    }, [covenRole])

    useEffect(() => {
        const importData = () => {
            const aflictionData = onSnapshot(collection(database, `playeradmin/playerStatuses/${user.email}/statusAfliction/statusAfliction`), (snapshot) => {
                let temp = [];
                snapshot.forEach((doc) => {
                    temp.push({ target: doc.data().target, status: doc.data().status, key: doc.id, id: doc.id });
                })
                setStatusAfliction(temp)
            })
            const visitData = onSnapshot(collection(database, `playeradmin/playerStatuses/${user.email}/visitAction/visitAction`), (snapshot) => {
                let temp = [];
                snapshot.forEach((doc) => {
                    temp.push({
                        visitor: doc.data().visitor,
                        target: doc.data().target,
                        id: doc.id,
                        key: doc.id
                    })
                })
                setVisitAction(temp);
            })
        }
        importData();
    }, [user.email])
    const endGameCompletely = async () => {
        for (let p = 0; p < statusAfliction.length; p++) {
            const theRef = doc(database, `playeradmin/playerStatuses/${user.email}/statusAfliction/statusAfliction`, statusAfliction[p].id)
            await deleteDoc(theRef)

        }

        updateDoc(doc(database, "playeradmin", "playerStatuses", user.email, "dayCounter", "dayCounter", "dayCounter"), { currentDay: 1})
        navigateToNight('/playerlist')
    }
    const clearNeedlessData = () => {
        // clears visitAction
        for (let p = 0; p < visitAction.length; p++){
            const theRef = doc(database, `playeradmin/playerStatuses/${user.email}/visitAction/visitAction`, visitAction[p].id)
            deleteDoc(theRef);
        }
        // clears bomb, marks, motivations and parasites.
        const bombClear = statusAfliction.filter(status => { return status.status === 'bomba' })
        const markClear = statusAfliction.filter(status => {return status.status === 'marcado'})
        const motivateClear = statusAfliction.filter(status => { return status.status === 'motivado' })
        const parasiteClear = statusAfliction.filter(status => { return status.status === 'parasita' })
        for (let p = 0; p < bombClear.length; p++) {
            const theRef = doc(database, `playeradmin/playerStatuses/${user.email}/statusAfliction/statusAfliction`, bombClear[p].id)
            deleteDoc(theRef)
        }
        for (let p = 0; p < markClear.length; p++) {
            const theRef = doc(database, `playeradmin/playerStatuses/${user.email}/statusAfliction/statusAfliction`, markClear[p].id)
            deleteDoc(theRef)
        }
        for (let p = 0; p < motivateClear.length; p++) {
            const theRef = doc(database, `playeradmin/playerStatuses/${user.email}/statusAfliction/statusAfliction`, motivateClear[p].id)
            deleteDoc(theRef)
        }

        if (currentDay > 4) {
            for (let p = 0; p < parasiteClear.length; p++) {
                const theRef = doc(database, `playeradmin/playerStatuses/${user.email}/statusAfliction/statusAfliction`, parasiteClear[p].id)
                deleteDoc(theRef)
            }
        }
    }

    const startNight = () => {
        clearNeedlessData();
        navigateToNight('/night');
    }

    return (
        // The day has to set all the player actions as pending
        <div className="day">
            <h3 className="page-title">
                Dia {currentDay}
            </h3>
            <button className="button" onClick={endGameCompletely}>Encerrar Jogo</button>
            <div className="dayMain">
                <div className="event-ocurrence event">
                        <h4>
                        Acontecimentos
                        </h4>
                        <div className="large-container card-border scrollable">
                        </div>
                </div>

                <div className="event-aliveplayers event">
                        <h4>
                        Jogadores Vivos
                        </h4>
                    <div className="small-container card-border scrollable">
                    {alivePlayers.map((player) => (
                                        <p key={player.key + '2'}>
                            {player.playerName} - {player.role}
                                        </p>
                                    ))}
                        </div>
                </div>
                <div className="event-hiddenocurrence event">
                        <h4>
                        Ações da Noite
                        </h4>
                    <div className="small-container card-border scrollable">
                        {visitAction.map((visit) => (
                            <p key={visit.key}>
                                {visit.visitor} visitou {visit.target}
                        </p>
                    ))}    
                    </div>
                </div>
                <div className="event-death event">
                        <h4>
                        Jogadores Mortos
                        </h4>
                    <div className="large-container card-border scrollable">
                        {deadPlayers.map((player) => (
                            <p key={player.key + '3'}>
                            {player.playerName} - {player.role}
                                        </p>
                                    ))}
                    </div>
                </div>
                <div className="event-status event">
                        <h4>
                        Status
                        </h4>
                    <div className="small-container card-border scrollable">
                    {statusAfliction.map((player) => (
                                        <option key={player.key}>
                            {player.target} - {player.status}
                                        </option>
                                    ))}
                        </div>
                </div>
                <div className="event-killplayer event">
                        <h4>
                        Matar Jogador
                        </h4>
                    <div className="small-container event-killplayer-inner">
                        <h4>Nome:</h4>
                        <select name="playerName" id="playerName">
                            <option value="selena">SelenaGomez</option>
                        </select>
                        <button className="button">Matar Jogador</button>
                        <button type="button" onClick={startNight} className="button">Começar Noite</button>

                    </div>
                </div>

            </div>

        </div>
    )
}

export default Day;