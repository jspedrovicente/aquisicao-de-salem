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
    const [deadPlayers, setDeadPlayers] = useState([]);
    const [townRole, setTownRole] = useState([]);
    const [covenRole, setCovenRole] = useState([]);
    const [mafiaRole, setMafiaRole] = useState([]);
    const [neutralRole, setNeutralRole] = useState([]);
    const [allRoles, setAllRoles] = useState([]);
    
    // Night Manipulation
    const [player, setPlayer] = useState('');
    const [player1, setPlayer1] = useState('');
    const [player2, setPlayer2] = useState('');
    const [player3, setPlayer3] = useState('');
    const [player4, setPlayer4] = useState('');
    const [currentDay, setCurrentDay] = useState(0);
    const [controlCounter, setControlCounter] = useState(0);
    const [currentPlayerTitle, setCurrentPlayerTitle] = useState('');
    const [currentPlayerDescription, setCurrentPlayerDescription] = useState('');
    // Night actions that transfers to morning
    const [visitAction, setVisitAction] = useState('');
    const [executorAction, setExecutorAction] = useState('');
    const [motivateAction, setMotivateAction] = useState('');
    const [armadilheiroAction, setArmadilheiroAction] = useState('');
    const [spyAction, setSpyAction] = useState('');
    const [weaponCreateAction, setWeaponCreateAction] = useState([])
    const [padeiraHealCount, setPadeiraHealCount] = useState(0)
    
    // Night actions that do not transfer
    const [cureAction, setCureAction] = useState([]);
    const [blockAction, setBlockAction] = useState('');
    const [weapon, setWeapon] = useState('');
    const [attackAction, setAttackAction] = useState([]);
    const [protectAction, setProtectAction] = useState('');
    const [ferreiroProtectAction, setferreiroProtectAction] = useState('');
    const [alertAction, setAlertAction] = useState(false);
    const [padeiraTemp, setPadeiraTemp] = useState([]);
    const [currentDayTemp, setCurrentDayTemp] = useState([]);
    let blockAction2 = '';

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
                let currentDay = [];
                snapshot.forEach((doc) => {
                    currentDay.push({ currentDay: doc.data().currentDay })
                })
                setCurrentDayTemp(currentDay)

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
        const loadRememberedData = () => {
            const rememberedData = onSnapshot(collection(database, `playeradmin/playerStatuses/${user.email}/weaponChoice/weaponChoice`), (snapshot) => {
                let weapon = [];
                snapshot.forEach((doc) => {
                    weapon.push({ weaponChoice: doc.data().weapon });
                })
                setWeaponCreateAction(weapon);

            })
            const padeiraData = onSnapshot(collection(database, `playeradmin/playerStatuses/${user.email}/padeiraHeals/padeiraHeals`), (snapshot) => {
                let padeira = [];
                snapshot.forEach((doc) => {
                    padeira.push({ healCount: doc.data().healCountMax });
                })
                console.log(padeira)
                setPadeiraTemp(padeira)
            })
        }
        loadRememberedData();
    }, [user.email])
    const incrementCounter = () => {
        setControlCounter(controlCounter => controlCounter + 1);
    };
    const padeiraAction = () => {
        var arr = padeiraHealCount;
        var newArray = padeiraHealCount - 1;
        setPadeiraHealCount(newArray);
        setVisitAction([...visitAction, { visitor: alivePlayers[controlCounter - 1].playerName, target: player }]);
        setCureAction([...cureAction, { healer: alivePlayers[controlCounter - 1].playerName, attackerRole: alivePlayers[controlCounter - 1].role, target: player }]);


    }
    const openSingleDropDown = () => {
        let attackDropDown = document.querySelector(".alivePlayerDropDownAction")
        attackDropDown.classList.remove("invisible")
    }
    const closeSingleDropDown = () => {
        let attackDropDown = document.querySelector(".alivePlayerDropDownAction")
        attackDropDown.classList.add("invisible")
    }
    const openDeadDropDown = () => {
        let deadDropDown = document.querySelector(".deadPlayerDropDownAction")
        deadDropDown.classList.remove("invisible")
    }
    const closeDeadDropDown = () => {
        let deadDropDown = document.querySelector(".deadPlayerDropDownAction")
        deadDropDown.classList.add("invisible")
    }
    const openConfirmButton = () => {
        let attackDropDown = document.querySelector(".confirmButton")
        attackDropDown.classList.remove("invisible")
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
        openConfirmButton();
            
        switch (alivePlayers[controlCounter].role) {
            case 'meretriz':
                openSingleDropDown();
                writePlayerInformation();
                incrementCounter();
                break;
            case 'executor':   
                if (currentDayTemp[0].currentDay === 1) {
                    openSingleDropDown();
                    writePlayerInformation();
                } else {
                    writePlayerInformation();
                    setCurrentPlayerDescription(`Seu alvo é ${executorAction}, não precisa acordar a pessoa, clique em confirmar Ação`);
                }
                incrementCounter();
                break;
            case 'bardo':
                writePlayerInformation();
                if (blockAction === alivePlayers[controlCounter].playerName || blockAction2 === alivePlayers[controlCounter].playerName) {
                    setCurrentPlayerDescription('Jogador Bloqueado, clique em pular a vez');
                    closeConfirmButton();
                } else {
                    openSingleDropDown();
                }
                incrementCounter();
                break;
            case 'armadilheiro':
                writePlayerInformation();
                if (blockAction === alivePlayers[controlCounter].playerName || blockAction2 === alivePlayers[controlCounter].playerName) {
                    setCurrentPlayerDescription('Jogador Bloqueado, clique em pular a vez');
                    closeConfirmButton();
                } else {
                    openSingleDropDown();
                }
                incrementCounter();
                break;
            case 'carteiro':
                writePlayerInformation();
                if (blockAction === alivePlayers[controlCounter].playerName || blockAction2 === alivePlayers[controlCounter].playerName) {
                    setCurrentPlayerDescription('Jogador Bloqueado, clique em pular a vez');
                    closeConfirmButton();
                } else {
                }
                incrementCounter();
                break;
            
            case 'curandeira':
                writePlayerInformation();
                if (blockAction === alivePlayers[controlCounter].playerName || blockAction2 === alivePlayers[controlCounter].playerName) {
                    setCurrentPlayerDescription('Jogador Bloqueado, clique em pular a vez');
                    closeConfirmButton();
                } else {
                    openSingleDropDown();
                }
                incrementCounter();
                break;
            case 'espiao':
                writePlayerInformation();
                if (blockAction === alivePlayers[controlCounter].playerName || blockAction2 === alivePlayers[controlCounter].playerName) {
                    setCurrentPlayerDescription('Jogador Bloqueado, clique em pular a vez');
                    closeConfirmButton();
                } else {
                    openSingleDropDown();
                }
                incrementCounter();
                break;
            case 'ferreiro':
                writePlayerInformation();
                if (blockAction === alivePlayers[controlCounter].playerName || blockAction2 === alivePlayers[controlCounter].playerName) {
                    setCurrentPlayerDescription('Jogador Bloqueado, clique em pular a vez');
                    closeConfirmButton();
                }
                if (weaponCreateAction[0].weaponChoice === '') {
                    document.querySelector('.weaponDropDownAction').classList.remove('invisible');
                }
                if (weaponCreateAction[0].weaponChoice === 'espada') {
                    openSingleDropDown();
                }
                if (weaponCreateAction[0].weaponChoice === 'escudo') {
                    setCurrentPlayerDescription('Você está protegido esta noite!');
                }
                incrementCounter();
                break;
            case 'guardiao':
                writePlayerInformation();
                if (blockAction === alivePlayers[controlCounter].playerName || blockAction2 === alivePlayers[controlCounter].playerName) {
                    setCurrentPlayerDescription('Jogador Bloqueado, clique em pular a vez');
                    closeConfirmButton();
                } else {
                    openSingleDropDown();
                }
                incrementCounter();
                    break;
            case 'investigador':
                writePlayerInformation();
                if (blockAction === alivePlayers[controlCounter].playerName || blockAction2 === alivePlayers[controlCounter].playerName) {
                    setCurrentPlayerDescription('Jogador Bloqueado, clique em pular a vez');
                    closeConfirmButton();
                } else {
                    openSingleDropDown();
                }
                incrementCounter();
                    break;
            case 'xerife':
                writePlayerInformation();
                if (blockAction === alivePlayers[controlCounter].playerName || blockAction2 === alivePlayers[controlCounter].playerName) {
                    setCurrentPlayerDescription('Jogador Bloqueado, clique em pular a vez');
                    closeConfirmButton();
                } else {
                    openSingleDropDown();
                }
                incrementCounter();
                    break;
            case 'medium':
                writePlayerInformation();
                if (blockAction === alivePlayers[controlCounter].playerName || blockAction2 === alivePlayers[controlCounter].playerName) {
                    setCurrentPlayerDescription('Jogador Bloqueado, clique em pular a vez');
                    closeConfirmButton();
                } else {
                    openDeadDropDown();
                }
                incrementCounter();
                    break;
            case 'vigilante':
                writePlayerInformation();
                if (blockAction === alivePlayers[controlCounter].playerName || blockAction2 === alivePlayers[controlCounter].playerName) {
                    setCurrentPlayerDescription('Jogador Bloqueado, clique em pular a vez');
                    closeConfirmButton();
                } else {
                    openSingleDropDown();
                }
                incrementCounter();
                    break;
            case 'veterano':
                writePlayerInformation();
                if (blockAction === alivePlayers[controlCounter].playerName || blockAction2 === alivePlayers[controlCounter].playerName) {
                    setCurrentPlayerDescription('Jogador Bloqueado, clique em pular a vez');
                    closeConfirmButton();
                } else {
                }
                incrementCounter();
                    break;
            case 'padeira':
                writePlayerInformation();
                document.querySelector('.padeiraCounter').classList.remove('invisible');
                if (blockAction === alivePlayers[controlCounter].playerName || blockAction2 === alivePlayers[controlCounter].playerName) {
                    setCurrentPlayerDescription('Jogador Bloqueado, clique em pular a vez');
                    closeConfirmButton();
                } else {
                    if (padeiraHealCount === 0) {
                        closeSingleDropDown();
                        setCurrentPlayerDescription('Você não tem curas para usar mais!');

                    } if (padeiraHealCount >= 0) {
                        openSingleDropDown();
                        document.querySelector('.padeiraButton').classList.remove('invisible');
                    }
                    openSingleDropDown();
                }
                incrementCounter();
                    break;
            default:
                setCurrentPlayerDescription('Esse personagem não acorda a noite, clique em confirmar');
                incrementCounter();

            }

        return;
    } 
    setCurrentPlayerTitle('Noite encerrada')
    setCurrentPlayerDescription('Clique em Encerrar Noite!')
    document.querySelector(".skipButton").classList.add('invisible')
    closeConfirmButton();
    return;    
    }
    const confirmAction = () => {
        switch (alivePlayers[controlCounter - 1].role) {
            case 'meretriz':
                setBlockAction(player);
                blockAction2 = player;
                setVisitAction([...visitAction, { visitor: alivePlayers[controlCounter - 1].playerName, target: player }]);
                closeSingleDropDown();
                break;
            case 'executor':

                if (currentDayTemp[0].currentDay === 1) {
                    setExecutorAction(player);
                    setVisitAction([...visitAction, { visitor: alivePlayers[controlCounter - 1].playerName, target: player }]);
                    closeSingleDropDown();
                    break;
                } else {
                    closeSingleDropDown();
                    break;
                }
            case 'bardo':
                setMotivateAction(player);
                setVisitAction([...visitAction, { visitor: alivePlayers[controlCounter - 1].playerName, target: player }]);
                closeSingleDropDown();
                break;
            case 'armadilheiro':
                setArmadilheiroAction(player);
                setVisitAction([...visitAction, { visitor: alivePlayers[controlCounter - 1].playerName, target: player }]);
                closeSingleDropDown();
                break;
            case 'curandeira':
                setCureAction(player);
                setVisitAction([...visitAction, { visitor: alivePlayers[controlCounter - 1].playerName, target: player }]);
                closeSingleDropDown();
                break;
            case 'espiao':
                setSpyAction(player);
                setVisitAction([...visitAction, { visitor: alivePlayers[controlCounter - 1].playerName, target: player }]);
                closeSingleDropDown();
                break;
            case 'ferreiro':
                if (weaponCreateAction[0].weaponChoice === '') {
                setWeapon(weapon);
                document.querySelector('.weaponDropDownAction').classList.add('invisible');
                } 
                if (weaponCreateAction[0].weaponChoice === 'espada') {
                    setAttackAction([...attackAction, { attacker: alivePlayers[controlCounter - 1].playerName, attackerRole: alivePlayers[controlCounter - 1].role, target: player }]);
                    setVisitAction([...visitAction, { visitor: alivePlayers[controlCounter - 1].playerName, target: player }]);
                    setWeaponCreateAction('');
                }
                if (weaponCreateAction[0].weaponChoice === 'escudo') {
                        setferreiroProtectAction(alivePlayers[controlCounter - 1].playerName);
                        setWeaponCreateAction('');
                }
                closeSingleDropDown();
                break;
            case 'guardiao':
                setProtectAction(player);
                setVisitAction([...visitAction, { visitor: alivePlayers[controlCounter - 1].playerName, target: player }]);
                closeSingleDropDown();
                break;
            case 'investigador':
                setVisitAction([...visitAction, { visitor: alivePlayers[controlCounter - 1].playerName, target: player }]);
                closeSingleDropDown();
                break;
            case 'xerife':
                setVisitAction([...visitAction, { visitor: alivePlayers[controlCounter - 1].playerName, target: player }]);
                closeSingleDropDown();
                break;
            case 'vigilante':
                setVisitAction([...visitAction, { visitor: alivePlayers[controlCounter - 1].playerName, target: player }]);
                setAttackAction([...attackAction, { attacker: alivePlayers[controlCounter - 1].playerName, attackerRole: alivePlayers[controlCounter - 1].role, target: player }]);
                closeSingleDropDown();
                break;
            case 'medium':
                closeDeadDropDown();
                break;
            case 'veterano':
                setAlertAction(true);
                break;
            
            // default is used for characters that dont necessarily have a confirm action
            default:
                closeSingleDropDown();
                closeDeadDropDown();
                document.querySelector('.padeiraButton').classList.add('invisible');
                break;
        }        
        wakeUpPlayers();
    }
    const skipAction = () => {
        closeSingleDropDown();
        closeDeadDropDown();
        document.querySelector('.weaponDropDownAction').classList.add('invisible');
        document.querySelector('.padeiraButton').classList.add('invisible');
        wakeUpPlayers();
    }
    const iniciarNoite = () => {
        document.querySelector(".startbutton").classList.add('invisible')
        document.querySelector(".confirmButton").classList.remove('invisible')
        document.querySelector(".skipButton").classList.remove('invisible')
        setPadeiraHealCount(padeiraTemp[0].healCount);
        setCurrentDay(currentDayTemp[0].currentDay)
        wakeUpPlayers();
    } 
    const checkstuff = () => {
        console.log(visitAction);
        console.log(alivePlayers);
        console.log(allRoles);
        console.log(padeiraTemp);
        console.log(padeiraHealCount);
        console.log(cureAction);
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
                                    <button type="button" className="button padeiraButton invisible" onClick={padeiraAction}>Curar e Proximo</button>
                            </div>
                            <div className="padeiraCounter invisible"> {padeiraHealCount}</div>
                            <div className="deadPlayerDropDownAction invisible">
                                <select name="deadPlayer" id="deadPlayer" value={player} onChange={(e) => {setPlayer(e.target.value)}}>
                                    {deadPlayers.map((player) => (
                                        <option key={deadPlayers.key}>
                                            {player.playerName}
                                        </option>
                                    ))}
                                </select>
                            </div>
                            <div className="weaponDropDownAction invisible">
                                <select name="weaponChoice" id="weaponChoice" value={weapon} onChange={(e) => { setWeapon(e.target.value) }}>
                                    <option value="espada">espada</option>
                                    <option value="escudo">escudo</option>

                                </select>
                            </div>
                                <button type="button" className="button confirmButton invisible" onClick={confirmAction}>
                                        Confirmar
                            </button>
                            <button type="button" className="button skipButton invisible" onClick={skipAction}>Pular Vez</button>
                            <button type="button" className="button startbutton" onClick={iniciarNoite}>Iniciar Noite</button>
                            <button type="button" className="button startbutton" onClick={checkstuff}>check stuff</button>
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