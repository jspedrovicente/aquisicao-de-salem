import { async } from "@firebase/util";
import { setDoc, doc, addDoc, collection, onSnapshot, deleteDoc, updateDoc } from "firebase/firestore";
import { useEffect, useState } from "react";
import { database } from "../../firebaseConnection";
import { useNavigate } from "react-router-dom";
import "./night.css"
import useSound from "use-sound";
import nightEffect from "../../assets/night1-soundeffect.mp3"
import harpEffect from "../../assets/bardo-soundeffect.mp3"
import assassinoemserieEffect from "../../assets/assassinoemserie-soundeffect.mp3"
import arsonistaEffect from "../../assets/arsonista-soundeffect.mp3"
import armadilheiroEffect from "../../assets/armadilheiro-soundeffect.mp3"
import meretrizEffect from "../../assets/meretriz-soundeffect.mp3"
import carteiroEffect from "../../assets/carteiro-soundeffect.mp3"
import ferreiroEffect from "../../assets/ferreiro-soundeffect.mp3"
import pistoleiroEffect from "../../assets/pistoleiro-soundeffect.mp3"
import palhacoEffect from "../../assets/palhaco-soundeffect.mp3"
// SET THE Function wakeup ORDER IN FIREBASE FOR EACH CHARACTER, REMEMBER MERETRIZ IS FIRST IF THE EXECUTOR HAS ALREADY MADE HIS DECISION
const Night = () => {
    // SoundEffects for all the characters;
    const [playNightSound, { stop }] = useSound(nightEffect, { volume: 0.75 });
    const [playBardoSound] = useSound(harpEffect);
    const [playAssassinoEmSerieSound] = useSound(assassinoemserieEffect);
    const [playArsonistaSound] = useSound(arsonistaEffect);
    const [playArmadilheiroSound] = useSound(armadilheiroEffect);
    const [playCarteiroSound] = useSound(carteiroEffect);
    const [playFerreiroSound] = useSound(ferreiroEffect);
    const [playMeretrizSound] = useSound(meretrizEffect);
    const [playPistoleiroSound] = useSound(pistoleiroEffect);
    const [playPalhacoSound] = useSound(palhacoEffect);




    const [user, setUser] = useState([]);
    const [players, setPlayers] = useState([]);
    const [alivePlayers, setAlivePlayers] = useState([]);
    const [deadPlayers, setDeadPlayers] = useState([]);
    const [townRole, setTownRole] = useState([]);
    const [covenRole, setCovenRole] = useState([]);
    const [mafiaRole, setMafiaRole] = useState([]);
    const [neutralRole, setNeutralRole] = useState([]);
    const [allRoles, setAllRoles] = useState([]);
    const navigateToMorning = useNavigate();
    
    // Night Manipulation
    const [player, setPlayer] = useState('');
    const [player2, setPlayer2] = useState('');
    const [currentDay, setCurrentDay] = useState(1);
    const [controlCounter, setControlCounter] = useState(0);
    const [currentPlayerTitle, setCurrentPlayerTitle] = useState('');
    const [currentPlayerDescription, setCurrentPlayerDescription] = useState('');
    const [currentPlayerName, setCurrentPlayerName] = useState('');
    // Night actions that transfers to morning

    // Information that is transfered solo
    const [visitAction, setVisitAction] = useState([]);
    const [executorAction, setExecutorAction] = useState([]);
    const [weaponCreateAction, setWeaponCreateAction] = useState([]);
    const [padeiraHealCount, setPadeiraHealCount] = useState(0);
    
    const [armadilheiroAction, setArmadilheiroAction] = useState('');
    const [spyAction, setSpyAction] = useState('');
    // Information that gets processed together
    const [motivateAction, setMotivateAction] = useState('');
    const [blackMailAction, setBlackMailAction] = useState('');
    const [cleanUpAction, setCleanUpAction] = useState('');
    const [markAction, setMarkAction] = useState('');
    const [clownBombAction, setClownBombAction] = useState('');
    const [inGameStatusAfliction, setinGameStatusAfliction] = useState([])

    // Information that transfers but is processed SOLO
    const [arsonTarget, setArsonTarget] = useState([]);
    const [poisonedTarget, setPoisonedTarget] = useState([]);
    const [newPoisonedTarget, setNewPoisonedTarget] = useState([]);
    const [parasiteAction, setParasiteAction] = useState([]);
    const [newParasiteAction, setNewParasiteAction] = useState([]);
    const [deadAction, setDeadAction] = useState([]);
    const [publicEvents, setPublicEvents] = useState([]);

    // Night actions that do not transfer
    const [cureAction, setCureAction] = useState([]);
    const [blockAction, setBlockAction] = useState('');
    const [mirageBlockAction, setMirageBlockAction] = useState('');
    const [weapon, setWeapon] = useState('');
    const [attackAction, setAttackAction] = useState([]);
    const [protectAction, setProtectAction] = useState('');
    const [ferreiroProtectAction, setferreiroProtectAction] = useState('');
    const [alertAction, setAlertAction] = useState('');
    const [padeiraTemp, setPadeiraTemp] = useState([]);
    const [currentDayTemp, setCurrentDayTemp] = useState([]);
    const [multipleCharactersPresent, setMultipleCharactersPresent] = useState('')
    const [specialAttack, setSpecialAttack] = useState([]);
    const [nightImmunity, setNightImmunity] = useState(['arsonista', '']);
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
                setPadeiraTemp(padeira)
            })
            const executorData = onSnapshot(collection(database, `playeradmin/playerStatuses/${user.email}/executorTarget/executorTarget`), (snapshot) => {
                let temp = [];
                snapshot.forEach((doc) => {
                    temp.push({ target: doc.data().target, id: doc.id });
                })
                setExecutorAction(temp)
            })
            const arsonData = onSnapshot(collection(database, `playeradmin/playerStatuses/${user.email}/arsonTarget/arsonTarget`), (snapshot) => {
                let ars = [];
                snapshot.forEach((doc) => {
                    ars.push({ playerName: doc.data().playerName, id: doc.id });
                })
                setArsonTarget(ars)
            })
            const poisonData = onSnapshot(collection(database, `playeradmin/playerStatuses/${user.email}/poisonTarget/poisonTarget`), (snapshot) => {
                let pse = [];
                snapshot.forEach((doc) => {
                    pse.push({ playerName: doc.data().playerName, id: doc.id });
                })
                setPoisonedTarget(pse);
            })
            const parasiteData = onSnapshot(collection(database, `playeradmin/playerStatuses/${user.email}/parasiteTarget/parasiteTarget`), (snapshot) => {
                let pse = [];
                snapshot.forEach((doc) => {
                    pse.push({ playerName: doc.data().playerName, id: doc.id });
                })
                setParasiteAction(pse);
            })
            const currentAf = onSnapshot(collection(database, `playeradmin/playerStatuses/${user.email}/statusAfliction/statusAfliction`), (snapshot) => {
                let pse = [];
                snapshot.forEach((doc) => {
                    pse.push({ playerName: doc.data().target, status: doc.data().status, id: doc.id });
                })
                setinGameStatusAfliction(pse);
            })
        }
        loadRememberedData();
    }, [user.email])
    const encerrarNoite = async () => {
        stop();
        const dead = [];
        const temporaryStatusAfliction = [];
        const allpublicEvents = [];
        for (let i = 0; i < attackAction.length; i++) {
            const player = alivePlayers.filter(player => { return player.playerName === attackAction[i].target })
            if (nightImmunity.includes(player[0].role)) {
                // Nothing happens
                
            }
            else {
                if (cureAction.length > 0) {
                    
                    if (cureAction.some(e => e.target === attackAction[i].target)) {
                        // Nothing happens
                        
                    }
                }
                else {
                    if (alertAction !== '') {
                        
                        if (alertAction.includes(attackAction[i].target)) {
                            // nothing happens
                            
                        }
                    }
                    else {
                        if (protectAction !== '') {
                            
                            if (protectAction.includes(attackAction[i].target)) {
                                const protector = alivePlayers.filter(player => { return player.role === 'guardiao' })
                                const agressor = alivePlayers.filter(player => { return player.playerName === attackAction[i].attacker })
                                dead.push({ killedPlayer: agressor[0].playerName, killedPlayerRole: agressor[0].role, attackerRole: "guardiao"});
                                dead.push({ killedPlayer: protector[0].playerName, killedPlayerRole: protector[0].role, attackerRole: "guardiao" });
                            }
                        }
                        else {
                            if (ferreiroProtectAction !== '') {
                                
                                if (ferreiroProtectAction.includes(attackAction[i].target)) {
                                    // nothing happens
                                }
                            }
                            else {
                                if (cleanUpAction === attackAction[i].target) {
                                dead.push({ killedPlayer: attackAction[i].target, killedPlayerRole: "LIMPADO", attackerRole: attackAction[i].attackerRole  })
                                    
                                } else {
                                    
                                }
                                dead.push({ killedPlayer: attackAction[i].target, killedPlayerRole: player[0].role, attackerRole: attackAction[i].attackerRole  })
                            }
                        }
                    }
                }
            }
        };
        if (alertAction !== '') {
            const veteran = alivePlayers.filter(player => { return player.role === 'veterano' });
            const alerted = visitAction.filter(visitor => { return visitor.target === veteran[0].playerName })
            if (alerted.length > 0) {
                for (var i = 0; alerted.length > i; i++) {
                    const player = alivePlayers.filter(player => { return player.playerName === alerted[i].visitor })

                    dead.push({ killedPlayer: alerted[i].visitor, killedPlayerRole: player[i].role, attackerRole: "veterano" })
                };
            };
        };

        if (specialAttack.length > 0) {
            for (let i = 0; i < specialAttack.length; i++) {
                const player = alivePlayers.filter(player => { return player.playerName === specialAttack[i].target })
                if (player.length > 0) {
                    
                    if (nightImmunity.includes(player[0].role)) {
                        // Nothing happens
                        
                    }
                    else {
                        if (cureAction.length > 0) {
                        
                            if (cureAction.some(e => e.target === specialAttack[i].target)) {
                                // Nothing happens
                                
                            }
                        }
                        else {
                            
                            dead.push({ killedPlayer: specialAttack[i].target, killedPlayerRole: player[0].role, attackerRole: specialAttack[i].attackerRole })
                        }
                    }
                }
            }
        };

        if (blackMailAction !== '') {
            temporaryStatusAfliction.push({ target: blackMailAction, status: 'chantageado' });
        }
        if (markAction !== '') {
            temporaryStatusAfliction.push({ target: markAction, status: 'marcado' });
        }
        if (clownBombAction !== '') {
            temporaryStatusAfliction.push({ target: clownBombAction, status: 'bomba' });
        }
        if (cleanUpAction !== '') {
            temporaryStatusAfliction.push({ target: cleanUpAction, status: 'limpado' });
        }
        if (motivateAction !== '') {
            temporaryStatusAfliction.push({ target: motivateAction, status: 'motivado' });
        }
        if (arsonTarget.length > 0) {
            for (let n = 0; arsonTarget.length < n; n++){
                temporaryStatusAfliction.push({ target: arsonTarget[n].playerName, status: 'ensopado' });
            }  
        }
        if (newParasiteAction.length > 0) {
            for (let n = 0; newParasiteAction.length > n; n++){
                temporaryStatusAfliction.push({ target: newParasiteAction[n].playerName, status: 'parasita' });
            }  
        }
        if (newPoisonedTarget.length > 0) {
            for (let m = 0; newPoisonedTarget > m; m++){
                temporaryStatusAfliction.push({ target: newPoisonedTarget[m], status: 'amaldiçoado' });
            }
            
        }

        if (temporaryStatusAfliction.length > 0) {
            const temporaryref = collection(database, `playeradmin/playerStatuses/${user.email}/statusAfliction/statusAfliction`)
            for (let k = 0; k < temporaryStatusAfliction.length; k++){
                await addDoc(temporaryref, {
                    target: temporaryStatusAfliction[k].target,
                    status: temporaryStatusAfliction[k].status
                })
            }
        }

        setDeadAction(dead);
        exportvisitDatabase();
        exportNewDatabase();
        minorDatabaseUpdates();
        // Kill players Officially
        for (let j = 0; j < dead.length; j++){
            const infoPlayer = alivePlayers.filter(player => { return player.playerName === dead[j].killedPlayer });
            await updateDoc(doc(database, "playeradmin", "players", user.email, infoPlayer[0].id), { life: "dead"})
        }
        // Update Arsonist Data
        const eventsDatabase = collection(database, `playeradmin/playerStatuses/${user.email}/announcements/announcements`)
        for (let i = 0; i < dead.length; i++){
            await addDoc(eventsDatabase, {
                killedPlayer: dead[i].killedPlayer,
                killedPlayerRole: dead[i].killedPlayerRole,
                attackerRole: dead[i].attackerRole
            })
        }
        navigateToMorning('/day');
    };
    const exportNewDatabase = async () => {
        const docRef = collection(database, `playeradmin/playerStatuses/${user.email}/arsonTarget/arsonTarget`)
        for (var z = 0; z < arsonTarget.length; z++) {
            await addDoc(docRef, {
                playerName: arsonTarget[z].playerName
            })
        }
        const parasiteRef = collection(database, `playeradmin/playerStatuses/${user.email}/parasiteTarget/parasiteTarget`)
        for (var x = 0; x < newParasiteAction.length; x++) {
            await addDoc(parasiteRef, {
                playerName: newParasiteAction[x].playerName
            })
        }
        const poisonRef = collection(database, `playeradmin/playerStatuses/${user.email}/poisonTarget/poisonTarget`)
        for (var c = 0; c < newPoisonedTarget.length; c++) {
            await addDoc(poisonRef, {
                playerName: newPoisonedTarget[c]
            })
        }
    }
    const minorDatabaseUpdates = async () => {
        if (executorAction.length > 0) {
            await updateDoc(doc(database, "playeradmin", "playerStatuses", user.email, "executorTarget"), { target: executorAction[0].target })
        }
            await updateDoc(doc(database, "playeradmin", "playerStatuses", user.email, "dayCounter", "dayCounter", "dayCounter"), { currentDay: currentDay + 1})

    } 
    const exportvisitDatabase = async () => {
        const docRef = collection(database, `playeradmin/playerStatuses/${user.email}/visitAction/visitAction`)
        for (var i = 0; i < visitAction.length; i++){
            await addDoc(docRef, {
                visitor: visitAction[i].visitor,
                target: visitAction[i].target
            })
        }
    }
    const incrementCounter = () => {
        setControlCounter(controlCounter => controlCounter + 1);
    };
    const padeiraAction = () => {
        var newArray = padeiraHealCount - 1;
        setPadeiraHealCount(newArray);
        setVisitAction([...visitAction, { visitor: alivePlayers[controlCounter - 1].playerName, target: player }]);
        setCureAction([...cureAction, { healer: alivePlayers[controlCounter - 1].playerName, healerRole: alivePlayers[controlCounter - 1].role, target: player }]);
    }
    const ArsonAction = () => {
        const temp = [];
        for (let index = 0; index < arsonTarget.length; index++){
            temp.push({ attacker: alivePlayers[controlCounter - 1].playerName, attackerRole: 'arsonista', target: arsonTarget[index].playerName })
        }
        setSpecialAttack(...specialAttack, temp );
        for (let p = 0; p < arsonTarget.length; p++){
            const theRef = doc(database, `playeradmin/playerStatuses/${user.email}/arsonTarget/arsonTarget`, arsonTarget[p].id)
            deleteDoc(theRef);
        }
        // BITCH
        const aflicted = inGameStatusAfliction.filter(afliction => { return afliction.status === 'ensopado' });
        for (let p = 0; p < aflicted.length; p++){
            const arsonAflictionRef = (doc(database, `playeradmin/playerStatuses/${user.email}/statusAfliction/statusAfliction`, aflicted[p].id))
            deleteDoc(arsonAflictionRef);
        }
        setArsonTarget([]);
        document.querySelector('.arsonistaButton').classList.add('invisible');
        closeSingleDropDown();
        wakeUpPlayers();
    }
    const openSingleDropDown = () => {
        let attackDropDown = document.querySelector(".alivePlayerDropDownAction")
        attackDropDown.classList.remove("invisible")
    }
    const openSecondAttackDropDown = () => {
        let attackDropDown = document.querySelector(".alivePlayerDropDownAction2")
        attackDropDown.classList.remove("invisible")
    }
    const closeSecondAttackDropDown = () => {
        let attackDropDown = document.querySelector(".alivePlayerDropDownAction2")
        attackDropDown.classList.add("invisible")
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
    const writeMafiaInformation = () => {
        setMultipleCharactersPresent('Acorde TODOS membros da Mafia e faça as funções de acordo.')
    }
    const EndMafiaNight = () => {
        setMultipleCharactersPresent('Depois dessa Ação, colocar Mafia para dormir!.')
    }
    const RemoveMafiaInformation = () => {
        setMultipleCharactersPresent('')
    }
    const writeCovenInformation = () => {
        setMultipleCharactersPresent('Acorde TODOS membros do COVEN e faça as funções de acordo.')
    }
    const endCovenNight = () => {
        setMultipleCharactersPresent('Depois dessa Ação, colocar COVEN para dormir!.')
    }
    const RemoveCovenInformation = () => {
        setMultipleCharactersPresent('')
    }
    const writePlayerInformation = () => {
        var currentPlayer = alivePlayers[controlCounter];
        var roledetails = allRoles.filter(singleRole => { return singleRole.role === currentPlayer.role });
        setCurrentPlayerTitle(currentPlayer.role);
        setCurrentPlayerName(currentPlayer.playerName);
        setCurrentPlayerDescription(roledetails[0].skill);
    }
    const wakeUpPlayers = () => {
        if (alivePlayers[controlCounter] != null) {
        openConfirmButton();
            
        switch (alivePlayers[controlCounter].role) {
            case 'meretriz':
                openSingleDropDown();
                playMeretrizSound();
                writePlayerInformation();
                incrementCounter();
                break;
            case 'executor':   
                if (currentDayTemp[0].currentDay === 1) {
                    openSingleDropDown();
                    writePlayerInformation();
                } else {
                    writePlayerInformation();
                    setCurrentPlayerDescription(`Não precisa acordar a pessoa, clique em confirmar Ação`);
                }
                incrementCounter();
                break;
            case 'bardo':
                writePlayerInformation();
                playBardoSound();
                if (blockAction === alivePlayers[controlCounter].playerName || mirageBlockAction === alivePlayers[controlCounter].playerName || blockAction2 === alivePlayers[controlCounter].playerName) {
                    setCurrentPlayerDescription('Jogador Bloqueado, clique em pular a vez');
                    closeConfirmButton();
                } else {
                    openSingleDropDown();
                }
                incrementCounter();
                break;
            case 'armadilheiro':
                writePlayerInformation();
                playArmadilheiroSound();
                if (blockAction === alivePlayers[controlCounter].playerName || mirageBlockAction === alivePlayers[controlCounter].playerName || blockAction2 === alivePlayers[controlCounter].playerName) {
                    setCurrentPlayerDescription('Jogador Bloqueado, clique em pular a vez');
                    closeConfirmButton();
                } else {
                    openSingleDropDown();
                }
                incrementCounter();
                break;
            case 'carteiro':
                writePlayerInformation();
                playCarteiroSound();
                if (blockAction === alivePlayers[controlCounter].playerName || mirageBlockAction === alivePlayers[controlCounter].playerName || blockAction2 === alivePlayers[controlCounter].playerName) {
                    setCurrentPlayerDescription('Jogador Bloqueado, clique em pular a vez');
                    closeConfirmButton();
                } else {
                }
                incrementCounter();
                break;
            case 'curandeira':
                writePlayerInformation();
                if (blockAction === alivePlayers[controlCounter].playerName || mirageBlockAction === alivePlayers[controlCounter].playerName || blockAction2 === alivePlayers[controlCounter].playerName) {
                    setCurrentPlayerDescription('Jogador Bloqueado, clique em pular a vez');
                    closeConfirmButton();
                } else {
                    openSingleDropDown();
                }
                incrementCounter();
                break;
            case 'espiao':
                writePlayerInformation();
                if (blockAction === alivePlayers[controlCounter].playerName || mirageBlockAction === alivePlayers[controlCounter].playerName || blockAction2 === alivePlayers[controlCounter].playerName) {
                    setCurrentPlayerDescription('Jogador Bloqueado, clique em pular a vez');
                    closeConfirmButton();
                } else {
                    openSingleDropDown();
                }
                incrementCounter();
                break;
            case 'ferreiro':
                writePlayerInformation();
                playFerreiroSound();
                if (blockAction === alivePlayers[controlCounter].playerName || mirageBlockAction === alivePlayers[controlCounter].playerName || blockAction2 === alivePlayers[controlCounter].playerName) {
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
                if (blockAction === alivePlayers[controlCounter].playerName || mirageBlockAction === alivePlayers[controlCounter].playerName || blockAction2 === alivePlayers[controlCounter].playerName) {
                    setCurrentPlayerDescription('Jogador Bloqueado, clique em pular a vez');
                    closeConfirmButton();
                } else {
                    openSingleDropDown();
                }
                incrementCounter();
                    break;
            case 'investigador':
                writePlayerInformation();
                if (blockAction === alivePlayers[controlCounter].playerName || mirageBlockAction === alivePlayers[controlCounter].playerName || blockAction2 === alivePlayers[controlCounter].playerName) {
                    setCurrentPlayerDescription('Jogador Bloqueado, clique em pular a vez');
                    closeConfirmButton();
                } else {
                    openSingleDropDown();
                }
                incrementCounter();
                    break;
            case 'xerife':
                writePlayerInformation();
                if (blockAction === alivePlayers[controlCounter].playerName || mirageBlockAction === alivePlayers[controlCounter].playerName || blockAction2 === alivePlayers[controlCounter].playerName) {
                    setCurrentPlayerDescription('Jogador Bloqueado, clique em pular a vez');
                    closeConfirmButton();
                } else {
                    openSingleDropDown();
                }
                incrementCounter();
                    break;
            case 'medium':
                writePlayerInformation();
                if (blockAction === alivePlayers[controlCounter].playerName || mirageBlockAction === alivePlayers[controlCounter].playerName || blockAction2 === alivePlayers[controlCounter].playerName) {
                    setCurrentPlayerDescription('Jogador Bloqueado, clique em pular a vez');
                    closeConfirmButton();
                } else {
                    openDeadDropDown();
                }
                incrementCounter();
                    break;
            case 'vigilante':
                writePlayerInformation();
                if (blockAction === alivePlayers[controlCounter].playerName || mirageBlockAction === alivePlayers[controlCounter].playerName || blockAction2 === alivePlayers[controlCounter].playerName) {
                    setCurrentPlayerDescription('Jogador Bloqueado, clique em pular a vez');
                    closeConfirmButton();
                } else {
                    openSingleDropDown();
                }
                incrementCounter();
                    break;
            case 'veterano':
                writePlayerInformation();
                if (blockAction === alivePlayers[controlCounter].playerName || mirageBlockAction === alivePlayers[controlCounter].playerName || blockAction2 === alivePlayers[controlCounter].playerName) {
                    setCurrentPlayerDescription('Jogador Bloqueado, clique em pular a vez');
                    closeConfirmButton();
                } else {
                }
                incrementCounter();
                    break;
            case 'padeira':
                writePlayerInformation();
                document.querySelector('.padeiraCounter').classList.remove('invisible');
                if (blockAction === alivePlayers[controlCounter].playerName || mirageBlockAction === alivePlayers[controlCounter].playerName || blockAction2 === alivePlayers[controlCounter].playerName) {
                    setCurrentPlayerDescription('Jogador Bloqueado, clique em pular a vez');
                    closeConfirmButton();
                } else {
                    if (padeiraHealCount === 0) {
                        closeSingleDropDown();
                        setCurrentPlayerDescription('Você não tem curas para usar mais!');

                    } if (padeiraHealCount > 0) {
                        openSingleDropDown();
                        document.querySelector('.padeiraButton').classList.remove('invisible');
                    }
                }
                incrementCounter();
                break;
            case 'godfather':
                writePlayerInformation();
                writeMafiaInformation();
                if (blockAction === alivePlayers[controlCounter].playerName || mirageBlockAction === alivePlayers[controlCounter].playerName || blockAction2 === alivePlayers[controlCounter].playerName) {
                    setCurrentPlayerDescription('Jogador Bloqueado, clique em pular a vez');
                    closeConfirmButton();
                } else {
                    openSingleDropDown();
                }
                if (alivePlayers[controlCounter + 1].filliation !== 'mafia' || alivePlayers[controlCounter + 1] === null) {
                EndMafiaNight();
                }
            incrementCounter();
            break;
            case 'conselheira':
                writePlayerInformation();
                writeMafiaInformation();
                if (blockAction === alivePlayers[controlCounter].playerName || mirageBlockAction === alivePlayers[controlCounter].playerName || blockAction2 === alivePlayers[controlCounter].playerName) {
                    setCurrentPlayerDescription('Jogador Bloqueado, clique em pular a vez');
                    closeConfirmButton();
                } else {
                    openSingleDropDown();
                }
                if (alivePlayers[controlCounter + 1] === null || alivePlayers[controlCounter + 1].filliation !== 'mafia' ) {
                    EndMafiaNight();
                    }
                incrementCounter();
                break;
            case 'vigarista':
                writePlayerInformation();
                writeMafiaInformation();
                if (blockAction === alivePlayers[controlCounter].playerName || mirageBlockAction === alivePlayers[controlCounter].playerName || blockAction2 === alivePlayers[controlCounter].playerName) {
                    setCurrentPlayerDescription('Jogador Bloqueado, clique em pular a vez');
                    closeConfirmButton();
                } else {
                    openSingleDropDown();
                }
                if (alivePlayers[controlCounter + 1] === null || alivePlayers[controlCounter + 1].filliation !== 'mafia' ) {
                    EndMafiaNight();
                }
                incrementCounter();
                    break;
            case 'zelador':
                writePlayerInformation();
                writeMafiaInformation();
                if (blockAction === alivePlayers[controlCounter].playerName || mirageBlockAction === alivePlayers[controlCounter].playerName || blockAction2 === alivePlayers[controlCounter].playerName) {
                    setCurrentPlayerDescription('Jogador Bloqueado, clique em pular a vez');
                    closeConfirmButton();
                } else {
                    openSingleDropDown();
                }
                if (alivePlayers[controlCounter + 1] === null || alivePlayers[controlCounter + 1].filliation !== 'mafia' ) {
                    EndMafiaNight();
                }
                incrementCounter();
                break;
            case 'afilhado':
                writePlayerInformation();
                writeMafiaInformation();
                if (blockAction === alivePlayers[controlCounter].playerName || mirageBlockAction === alivePlayers[controlCounter].playerName || blockAction2 === alivePlayers[controlCounter].playerName) {
                    setCurrentPlayerDescription('Jogador Bloqueado, clique em pular a vez');
                    closeConfirmButton();
                } else {
                    if (controlCounter === 0) {
                        setCurrentPlayerDescription('O Godfather está morto, esse jogador agora é considerado o Godfather e poderá atacar!')
                        openSingleDropDown();
                    } else {
                        if (alivePlayers[controlCounter - 1].role !== "godfather") {
                        setCurrentPlayerDescription('O Godfather está morto, esse jogador agora é considerado o Godfather e poderá atacar!')
                        openSingleDropDown();
                        } else {
                        setCurrentPlayerDescription("Esse jogador não tem habilidade noturna enquanto o Godfather estiver vivo. Clique em Confirmar")
                    }
                    }
                }
                if (alivePlayers[controlCounter + 1].filliation !== 'mafia' || alivePlayers[controlCounter + 1] === null) {
                    EndMafiaNight();
                }
                incrementCounter();
                break;
            case 'pistoleiro':
                writePlayerInformation();
                playPistoleiroSound();
                if (blockAction === alivePlayers[controlCounter].playerName || mirageBlockAction === alivePlayers[controlCounter].playerName || blockAction2 === alivePlayers[controlCounter].playerName) {
                    setCurrentPlayerDescription('Jogador Bloqueado, clique em pular a vez');
                    closeConfirmButton();
                } else {
                    openSingleDropDown();

                }
                incrementCounter();
                break;
            case 'palhaco':
                writePlayerInformation();
                playPalhacoSound();
                if (blockAction === alivePlayers[controlCounter].playerName || mirageBlockAction === alivePlayers[controlCounter].playerName || blockAction2 === alivePlayers[controlCounter].playerName) {
                    setCurrentPlayerDescription('Jogador Bloqueado, clique em pular a vez');
                    closeConfirmButton();
                } else {
                    openSingleDropDown();

                }
                incrementCounter();
                break;
            case 'medico da peste':
                writePlayerInformation();
                if (blockAction === alivePlayers[controlCounter].playerName || mirageBlockAction === alivePlayers[controlCounter].playerName || blockAction2 === alivePlayers[controlCounter].playerName) {
                    setCurrentPlayerDescription('Jogador Bloqueado, clique em pular a vez');
                    closeConfirmButton();
                } else {
                    openSingleDropDown();
                }
                incrementCounter();
                break;            
            case 'lobisomen':
                writePlayerInformation();
                if (currentDayTemp[0].currentDay % 2 === 0) {
                    openSingleDropDown();
                } else {
                    setCurrentPlayerDescription('Você não precisa acordar durante noites sem lua cheia');
                }
                incrementCounter();
                break;
            case 'arsonista':
                writePlayerInformation();
                playArsonistaSound();
                if (blockAction === alivePlayers[controlCounter].playerName || mirageBlockAction === alivePlayers[controlCounter].playerName || blockAction2 === alivePlayers[controlCounter].playerName) {
                    setCurrentPlayerDescription('Jogador Bloqueado, clique em pular a vez');
                    closeConfirmButton();
                } else {
                    document.querySelector('.arsonistaButton').classList.remove('invisible');
                    openSingleDropDown();
                }
                incrementCounter();
                break;
            case 'assassino em serie':
                writePlayerInformation();
                playAssassinoEmSerieSound();
                if (blockAction === alivePlayers[controlCounter].playerName || mirageBlockAction === alivePlayers[controlCounter].playerName || blockAction2 === alivePlayers[controlCounter].playerName) {
                    setCurrentPlayerDescription('Jogador Bloqueado, clique em pular a vez');
                    closeConfirmButton();
                } else {
                    openSingleDropDown();
                }
                incrementCounter();
                break;
            case 'feiticeira benevolente':
                writePlayerInformation();
                writeCovenInformation();
                    if (blockAction === alivePlayers[controlCounter].playerName || blockAction2 === alivePlayers[controlCounter].playerName) {
                        setCurrentPlayerDescription('Jogador Bloqueado, clique em pular a vez');
                        closeConfirmButton();
                    }
                    else {
                        openSingleDropDown()
                    }   
                    if (alivePlayers[controlCounter + 1] === null || alivePlayers[controlCounter + 1].filliation !== 'coven' ) {
                        endCovenNight();
                        }
                    incrementCounter();
                    break;
            case 'amaldicoadora':
                writePlayerInformation();
                writeCovenInformation();
                if (poisonedTarget.length > 0) {
                    let temp = [];
                    for (var i = 0; poisonedTarget.length > i; i++){
                        temp.push({ attacker: alivePlayers[controlCounter].playerName, attackerRole: 'amaldicoadora', target: poisonedTarget[i].playerName })
                    } 

                    setSpecialAttack(...specialAttack, temp);
                    setPoisonedTarget([]);
                    for (let p = 0; p < poisonedTarget.length; p++){
                        const theRef = doc(database, `playeradmin/playerStatuses/${user.email}/poisonTarget/poisonTarget`, poisonedTarget[p].id)
                        deleteDoc(theRef);
                    }
                }
                if (blockAction === alivePlayers[controlCounter].playerName || blockAction2 === alivePlayers[controlCounter].playerName) {
                    setCurrentPlayerDescription('Jogador Bloqueado, clique em pular a vez');
                    closeConfirmButton();
                }
                else {
                    if (currentDayTemp[0].currentDay >= 4) {
                        openSecondAttackDropDown();
                        openSingleDropDown();
                    } else {
                        openSingleDropDown();
                    };
                    }
                    if (alivePlayers[controlCounter + 1] === null || alivePlayers[controlCounter + 1].filliation !== 'coven' ) {
                        endCovenNight();
                    }
                    incrementCounter();
                    break;
            case 'parasita':
                writePlayerInformation();
                writeCovenInformation();
                if (currentDayTemp[0].currentDay >= 4) {
                    closeSingleDropDown();
                    setCurrentPlayerDescription('Todos seus parasitas EXPLODEM');
                    const here = [];
                    for (let index = 0; index < parasiteAction.length; index++){
                        here.push({ attacker: alivePlayers[controlCounter].playerName, attackerRole: 'parasita', target: parasiteAction[index].playerName })
                    }
                    setSpecialAttack(...specialAttack, here);
                    for (let i = 0; i < parasiteAction; i++){
                        const parasiteRef = doc(database, `playeradmin/playerStatuses/${user.email}/parasiteTarget/poisonTarget`, parasiteAction[i].id)
                        deleteDoc(parasiteRef);
                    }
                }
                else {
                    if (blockAction === alivePlayers[controlCounter].playerName || blockAction2 === alivePlayers[controlCounter].playerName) {
                        setCurrentPlayerDescription('Jogador Bloqueado, clique em pular a vez');
                        closeConfirmButton();
                    }
                    else {
                        openSingleDropDown();
                    }
                }
                if (alivePlayers[controlCounter + 1] === null || alivePlayers[controlCounter + 1].filliation !== 'coven' ) {
                    endCovenNight();
                }
                incrementCounter();
                break;
            case 'miragem':
                writeCovenInformation();
                writePlayerInformation();
                if (currentDayTemp[0].currentDay >= 4) {
                    openSingleDropDown();
                }
                if (alivePlayers[controlCounter + 1] === null || alivePlayers[controlCounter + 1].filliation !== 'coven') {
                    endCovenNight();
                }
                incrementCounter();
                break;                
            default:
                writePlayerInformation();
                setCurrentPlayerDescription('Esse personagem não acorda a noite, clique em confirmar');
                incrementCounter();

            }
        return;
    } 
    setCurrentPlayerTitle('Noite encerrada')
    setCurrentPlayerDescription('Clique em Encerrar Noite!')
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
                    setExecutorAction({ target: player });
                    setVisitAction([...visitAction, { visitor: alivePlayers[controlCounter - 1].playerName, target: player }]);
                    closeSingleDropDown();
                } else {
                    closeSingleDropDown();
                }
                break;
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
                setCureAction([...cureAction, { healer: alivePlayers[controlCounter - 1].playerName, healerRole: alivePlayers[controlCounter - 1].role, target: player }]);
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
                setAlertAction(alivePlayers[controlCounter - 1].playerName);
                break;
            case 'godfather':
                setVisitAction([...visitAction, { visitor: alivePlayers[controlCounter - 1].playerName, target: player }]);
                setAttackAction([...attackAction, { attacker: alivePlayers[controlCounter - 1].playerName, attackerRole: alivePlayers[controlCounter - 1].role, target: player }]);
                closeSingleDropDown();
                RemoveMafiaInformation();
                break;
            case 'afilhado':
                if (controlCounter === 1) {
                    setVisitAction([...visitAction, { visitor: alivePlayers[controlCounter - 1].playerName, target: player }]);
                    setAttackAction([...attackAction, { attacker: alivePlayers[controlCounter - 1].playerName, attackerRole: alivePlayers[controlCounter - 1].role, target: player }]);
                    closeSingleDropDown();
                    RemoveMafiaInformation();
                    
                } else {
                    if (alivePlayers[controlCounter - 2].role !== "godfather") {
                        setVisitAction([...visitAction, { visitor: alivePlayers[controlCounter - 1].playerName, target: player }]);
                        setAttackAction([...attackAction, { attacker: alivePlayers[controlCounter - 1].playerName, attackerRole: alivePlayers[controlCounter - 1].role, target: player }]);
                        closeSingleDropDown();
                        RemoveMafiaInformation();
                    }                 
                }
                closeSingleDropDown();
                RemoveMafiaInformation();
                break;
            case 'conselheira':
                setVisitAction([...visitAction, { visitor: alivePlayers[controlCounter - 1].playerName, target: player }]);
                closeSingleDropDown();
                RemoveMafiaInformation();
                break;
            case 'vigarista':
                setVisitAction([...visitAction, { visitor: alivePlayers[controlCounter - 1].playerName, target: player }]);
                setBlackMailAction(player);
                closeSingleDropDown();
                RemoveMafiaInformation();
                break;
            case 'zelador':
                setVisitAction([...visitAction, { visitor: alivePlayers[controlCounter - 1].playerName, target: player }]);
                setCleanUpAction(player)
                closeSingleDropDown();
                RemoveMafiaInformation();
                break;
            case 'pistoleiro':
                setVisitAction([...visitAction, { visitor: alivePlayers[controlCounter - 1].playerName, target: player }]);
                setMarkAction(player);
                closeSingleDropDown();
                break;
            case 'palhaco':
                setVisitAction([...visitAction, { visitor: alivePlayers[controlCounter - 1].playerName, target: player }]);
                setClownBombAction(player);
                closeSingleDropDown();
                break;
            case 'medico da peste':
                setCureAction([...cureAction, { healer: alivePlayers[controlCounter - 1].playerName, healerRole: alivePlayers[controlCounter - 1].role, target: player }]);
                setVisitAction([...visitAction, { visitor: alivePlayers[controlCounter - 1].playerName, target: player }]);
                closeSingleDropDown();
                break;
            case 'lobisomen':
                setAttackAction([...attackAction, { attacker: alivePlayers[controlCounter - 1].playerName, attackerRole: alivePlayers[controlCounter - 1].role, target: player }]);
                setVisitAction([...visitAction, { visitor: alivePlayers[controlCounter - 1].playerName, target: player }]);
                closeSingleDropDown();
                break;
            case 'assassino em serie':
                setVisitAction([...visitAction, { visitor: alivePlayers[controlCounter - 1].playerName, target: player }]);
                setAttackAction([...attackAction, { attacker: alivePlayers[controlCounter - 1].playerName, attackerRole: alivePlayers[controlCounter - 1].role, target: player }]);
                closeSingleDropDown();
                break;
            case 'arsonista':
                document.querySelector('.arsonistaButton').classList.add('invisible');
                setVisitAction([...visitAction, { visitor: alivePlayers[controlCounter - 1].playerName, target: player }]);
                setArsonTarget([{ playerName: player }])
                closeSingleDropDown();
                break;
            case 'feiticeira benevolente':
                if (currentDayTemp[0].currentDay >= 4) {
                    setAttackAction([...attackAction, { attacker: alivePlayers[controlCounter - 1].playerName, attackerRole: alivePlayers[controlCounter - 1].role, target: player }]);
                    setVisitAction([...visitAction, { visitor: alivePlayers[controlCounter - 1].playerName, target: player }]);
                } else {
                    setCureAction([...cureAction, { healer: alivePlayers[controlCounter - 1].playerName, healerRole: alivePlayers[controlCounter - 1].role, target: player }]);
                    setVisitAction([...visitAction, { visitor: alivePlayers[controlCounter - 1].playerName, target: player }]);
                }
                RemoveCovenInformation();
                break
            case 'amaldicoadora':
                if (currentDayTemp[0].currentDay >= 4) {
                    const pois = [player, player2]
                    setNewPoisonedTarget(pois)
                    setVisitAction([...visitAction, { visitor: alivePlayers[controlCounter - 1].playerName, target: player }, { visitor: alivePlayers[controlCounter - 1].playerName, target: player2 }]);
                } else {
                    const pois = [player];
                    setNewPoisonedTarget(pois);
                    setVisitAction([...visitAction, { visitor: alivePlayers[controlCounter - 1].playerName, target: player }]);
                }
                RemoveCovenInformation();
                closeSecondAttackDropDown();
                break;
            case 'parasita':
                if (currentDayTemp[0].currentDay >= 4) {

                } else {
                    setNewParasiteAction([{ playerName: player }]);
                    setVisitAction([...visitAction, { visitor: alivePlayers[controlCounter - 1].playerName, target: player }]);
                }
                RemoveCovenInformation();
                break;
            case 'miragem':
                if (currentDayTemp[0].currentDay >= 4) {
                    
                    setMirageBlockAction(player);
                    blockAction2 = player;
                    setVisitAction([...visitAction, { visitor: alivePlayers[controlCounter - 1].playerName, target: player }]);
                }

                RemoveCovenInformation();
                break;
            default:
                closeSingleDropDown();
                closeDeadDropDown();
                document.querySelector('.padeiraButton').classList.add('invisible');
                document.querySelector('.padeiraCounter').classList.add('invisible');

                break;
        }        
        wakeUpPlayers();
    }
    const skipAction = () => {
        closeSingleDropDown();
        closeDeadDropDown();
        RemoveMafiaInformation();
        RemoveCovenInformation();
        document.querySelector('.weaponDropDownAction').classList.add('invisible');
        document.querySelector('.padeiraButton').classList.add('invisible');
        document.querySelector('.padeiraCounter').classList.add('invisible');
        wakeUpPlayers();
        closeSecondAttackDropDown();
    }
    const iniciarNoite = () => {
        playNightSound();
        document.querySelector(".startbutton").classList.add('invisible')
        document.querySelector(".confirmButton").classList.remove('invisible')
        document.querySelector(".skipButton").classList.remove('invisible')
        setPadeiraHealCount(padeiraTemp[0].healCount);
        setCurrentDay(currentDayTemp[0].currentDay)
        if (currentDay % 2 === 0) {
            setNightImmunity(['arsonista', 'assassino em serie', 'lobisomen', 'sobrevivente' ])
            
        } else {
            setNightImmunity(['arsonista', 'assassino em serie', 'sobrevivente' ])
            
        }

        wakeUpPlayers();
    } 
    const checkstuff = () => {
        console.log('current day' + currentDay)
        console.log('attack action')
        console.log(attackAction);
        console.log('special attack action')
        console.log(specialAttack);
        console.log('visit action')
        console.log(visitAction);
        console.log('new poisoned target');
        console.log(newPoisonedTarget);
        console.log('poisoned action')
        console.log(poisonedTarget);
    }
    return (

        <div className="night">
            <h3 className="page-title">
                Noite {currentDay}
            </h3>
            <button className="button">Encerrar Jogo</button>
            <div className="nightMain">
                <div className="event-action event">
                        <h4>
                        Ação Noturna
                        </h4>
                    <div className="huge-container card-border scrollable">
                        <h4 className="specialCases">{multipleCharactersPresent}</h4>
                        <h4 className="playerRole">{currentPlayerTitle} - { currentPlayerName }</h4>
                        <p className="playerDescription">{ currentPlayerDescription }</p>
                        <div className="actionContainer">
                            <div className="alivePlayerDropDownAction invisible">
                                <select name="alivePlayer" id="alivePlayer" value={player} onChange={(e) => { setPlayer(e.target.value) }}>
                                    <option value="" defaultValue disabled hidden>Selecione Aqui</option>
                                    {alivePlayers.map((player) => (
                                        <option key={player.key}>
                                            {player.playerName}
                                        </option>
                                    ))}
                                </select>
                                <select name="alivePlayer" id="alivePlayer" className="invisible alivePlayerDropDownAction2" value={player2} onChange={(e) => { setPlayer2(e.target.value) }}>
                                    <option value="" defaultValue disabled hidden>Selecione Aqui</option>
                                    {alivePlayers.map((player) => (
                                        <option key={player.key + '2'}>
                                            {player.playerName}
                                        </option>
                                    ))}
                                </select>
                                <button type="button" className="button padeiraButton invisible" onClick={padeiraAction}>Curar e Proximo</button>
                                <button type="button" className="button arsonistaButton invisible" onClick={ArsonAction}>TACAR FOGO!</button>
                            </div>
                            <div className="padeiraCounter invisible">Quantidade de Curas: {padeiraHealCount}</div>
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
                    <button className="button" onClick={encerrarNoite}> Encerrar Noite!</button>

                </div>
                </div>
            </div>
        </div>
    )
}

export default Night;