import { async } from "@firebase/util";
import { setDoc, doc, addDoc, collection, onSnapshot, deleteDoc, updateDoc } from "firebase/firestore";
import { useEffect, useState } from "react";
import { database } from "../../firebaseConnection";
import { useNavigate } from "react-router-dom";
import Popup from 'reactjs-popup';
import 'reactjs-popup/dist/index.css';
import "./night.css"
import useSound from "use-sound";
import harpEffect from "../../assets/bardo-soundeffect.mp3"
import assassinoemserieEffect from "../../assets/assassinoemserie-soundeffect.mp3"
import arsonistaEffect from "../../assets/arsonista-soundeffect.mp3"
import armadilheiroEffect from "../../assets/armadilheiro-soundeffect.mp3"
import meretrizEffect from "../../assets/meretriz-soundeffect.mp3"
import ferreiroEffect from "../../assets/ferreiro-soundeffect.mp3"
import xerifeEffect from "../../assets/xerife-soundeffect.mp3"
import pistoleiroEffect from "../../assets/pistoleiro-soundeffect.mp3"
import palhacoEffect from "../../assets/palhaco-soundeffect.mp3"
import espiaoEffect from "../../assets/espiao-soundeffect.mp3"
import veteranEffect from "../../assets/veteran-soundeffect.mp3"
import investigadorEffect from "../../assets/investigador-soundeffect.mp3"
import guardiaoEffect from "../../assets/guardiao-soundeffect.mp3"
import mediumEffect from "../../assets/medium-soundeffect.mp3"
import vigilanteEffect from "../../assets/vigilante-soundeffect.mp3"
import padeiraEffect from "../../assets/padeira-soundeffect.mp3"
import medicodapesteEffect from "../../assets/medicodapeste-soundeffect.mp3"
import lobisomenEffect from "../../assets/lobisomen-soundeffect.mp3"
import feiticeirabenevolenteEffect from "../../assets/feiticeirabenevolente-soundeffect.mp3"
import feiticeirabenevolenteGrimorioEffect from "../../assets/feiticeirabenevolente-grimorio-soundeffect.mp3"
import curandeiraEffect from "../../assets/curandeira-soundeffect.mp3"
import miragemGrimorioEffect from "../../assets/miragem-grimorio-soundeffect.mp3"
import parasitaEffect from "../../assets/parasita-soundeffect.mp3"
import amaldicoadoraEffect from "../../assets/amaldicoadora-soundeffect.mp3"
import parasitaGrimorioEffect from "../../assets/parasita-grimorio-soundeffect.mp3"
import grimorioEffect from "../../assets/coven-grimorio-presente.mp3"
import horsemenSound from "../../assets/horsemen-soundeffect.mp3"
import fuxiqueiraSound from "../../assets/fuxiqueira-soundeffect.mp3"
import taberneiroSound from "../../assets/taberneiro-soundeffect.mp3"
import mafiaWakeupSoundEffect from "../../assets/mafia-wakeup-soundeffect.mp3"
import werewolfPresentEffect from "../../assets/werewolf-present-soundeffect.mp3"
import nightmusic from "../../assets/nightsounds/nightmusic/nightMusic.mp3"

// SET THE Function wakeup ORDER IN FIREBASE FOR EACH CHARACTER, REMEMBER MERETRIZ IS FIRST IF THE EXECUTOR HAS ALREADY MADE HIS DECISION
const Night = () => {
    // SoundEffects for all the characters;
    const [playNightSound, { stop: stopNightSound }] = useSound(nightmusic, {volume: 0.50});
    const [playGrimorioSound] = useSound(grimorioEffect);
    const [playWerewolfPresentSound] = useSound(werewolfPresentEffect);
    const delay = ms => new Promise(res => setTimeout(res, ms));
    const [isOpen, setIsOpen] = useState(true);
    const [investigativeModal, setInvestigativeModal] = useState(false);
    const [investigativeInfo, setInvestigativeInfo] = useState('');
    const [user, setUser] = useState([]);
    const [players, setPlayers] = useState([]);
    const [alivePlayers, setAlivePlayers] = useState([]);
    const [deadPlayers, setDeadPlayers] = useState([]);
    const [townRole, setTownRole] = useState([]);
    const [mafiaRole, setMafiaRole] = useState([]);
    const [neutralRole, setNeutralRole] = useState([]);
    const [horsemenRole, setHorsemenRole] = useState([]);
    const [covenRole, setCovenRole] = useState([]);
    const [allRoles, setAllRoles] = useState([]);
    const navigateToMorning = useNavigate();
    
    // Night Manipulation
    const [currentDay, setCurrentDay] = useState(1);
    const [currentPlayerTitle, setCurrentPlayerTitle] = useState('');
    const [currentPlayerDescription, setCurrentPlayerDescription] = useState('');
    const [currentPlayerName, setCurrentPlayerName] = useState('');
    const [notifierModalContent, setNotifierModalContent] = useState('');
    const [groupInfo, setGroupInfo] = useState('true');
    const [groupWakeModalIsOpen, setGroupWakeModalIsOpen] = useState(false);
    const [isNotifierModal, setIsNotifierModal] = useState(false);
    // Night actions that transfers to morning

    // Information that is transfered solo
    const [visitAction, setVisitAction] = useState([]);
    const [executorAction, setExecutorAction] = useState([]);
    const [weaponCreateAction, setWeaponCreateAction] = useState([]);
    const [padeiraHealCount, setPadeiraHealCount] = useState(0);
    const [investigatorCounter, setInvestigatorCounter] = useState(0);
    const [veteranCounter, setVeteranCounter] = useState(0);
    const [conselheiraCounter, setConselheiraCounter] = useState(0);
    const [zeladorCounter, setZeladorCounter] = useState(0);
    
    const [armadilheiroAction, setArmadilheiroAction] = useState('');
    const [spyAction, setSpyAction] = useState('');
    const [fuxiqueiraAction, setFuxiqueiraAction] = useState('');
    // Information that gets processed together
    const [motivateAction, setMotivateAction] = useState('');
    const [blackMailAction, setBlackMailAction] = useState('');
    const [cleanUpAction, setCleanUpAction] = useState('');
    const [markAction, setMarkAction] = useState('');
    const [clownBombAction, setClownBombAction] = useState('');
    // Information that transfers but is processed SOLO
    const [arsonTarget, setArsonTarget] = useState([]);
    const [newPoisonedTarget, setNewPoisonedTarget] = useState([]);
    const [newParasiteAction, setNewParasiteAction] = useState([]);
    const [publicEvents, setPublicEvents] = useState([]);

    const [mobilePlayerActionsSingle, setMobilePlayerActionsSingle] = useState([])
    // Night actions that do not transfer
    const [cureAction, setCureAction] = useState([]);
    const [attackAction, setAttackAction] = useState([]);
    const [protectAction, setProtectAction] = useState('');
    const [ferreiroProtectAction, setferreiroProtectAction] = useState('');
    const [alertAction, setAlertAction] = useState('');
    const [werewolfAlert, setWerewolfAlert] = useState('');
    const [currentDayTemp, setCurrentDayTemp] = useState([]);
    const [multipleCharactersPresent, setMultipleCharactersPresent] = useState('')
    const [specialAttack, setSpecialAttack] = useState([]);
    const [nightImmunity, setNightImmunity] = useState(['arsonista', '']);
    const [taberneiroDodge, setTaberneiroDodge] = useState('');
    const [deadChatLogs, setDeadChatLogs] = useState([]);

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
                        wakeOrder: doc.data().wakeOrder,
                        buff: doc.data().buff,
                        debuff: doc.data().debuff,
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
            const horsemenSnapshot = onSnapshot(collection(database, "gamedata/roles/horsemen"), (snapshot) => {
                let roles = [];
                snapshot.forEach((doc) => {
                    roles.push({
                        filliation: "horsemen",
                        role: doc.data().role,
                        skill: doc.data().skill,
                        special: doc.data().special,
                        wakeOrder: doc.data().wakeOrder

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
                        wakeOrder: doc.data().wakeOrder

                    })
                })
                setNeutralRole(roles);
                
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
        function addAllRoles(townRole, mafiaRole, horsemenRole, neutralRole, covenRole) {
            setAllRoles([...townRole, ...mafiaRole, ...horsemenRole, ...neutralRole, ...covenRole,])
           
        }
        addAllRoles(townRole, mafiaRole, horsemenRole, neutralRole, covenRole);
    }, [horsemenRole])
    useEffect(() => {
        const loadRememberedData = () => {
            const snapshots = onSnapshot(collection(database, `playeradmin/playerStatuses/${user.email}/mobilePlayerActions/mobilePlayerActionsSingle`), (snapshot) => {
                let actionForThis = []
                snapshot.forEach((doc) => {
                    actionForThis.push({
                    id: doc.id,
                    user: doc.data().user,
                    userID: doc.data().userID,
                    userRole: doc.data().userRole,
                    target: doc.data().target,
                    targetRole: doc.data().targetRole,
                    wakeOrder: doc.data().wakeOrder,
                    targetId: doc.data().targetId
                    
                })
                    setMobilePlayerActionsSingle(actionForThis);
            })
            })
            const chatLogs = onSnapshot(collection(database, `playeradmin/chatsLog/jspedrogarcia@gmail.com`), (snapshot) => {
                let conversations = []
                snapshot.forEach((doc) => {
                    conversations.push({
                        id: doc.id
                    })
                })
                setDeadChatLogs(conversations);
            })
        }
        loadRememberedData();
    }, [user.email])
    const interruptMusicPlaying = () => {
        stopNightSound();
    }
    const encerrarNoiteMobile = async () => {
        interruptMusicPlaying();
        let rolesImunetoBlocks = ['meretriz', 'taberneiro', 'miragem', 'executor'];
        let rolesThatAttackBlockers = ['assassino em serie', 'mestre', 'lobisomen', 'morte'];
        let rolesImunetoAttacks = ['piromaniaco', 'assassino em serie']
        let consideredEvilRoles = ['fome', 'guerra', 'morte', 'estranho', 'amaldicoadora', 'feiticeira benevolente', 'parasita', 'matriarca', 'mestre', 'mordomo', 'zelador', 'piromaniaco', 'assassino em serie', 'bobo da corte', 'executor', 'lobisomen', 'medico da peste', 'palhaco', 'pistoleiro' ]
        let blockedTargets = [];
        let attackingAction = [];
        let visitsThatOccured = [];
        let healedTargets = [];
        let protectedTargets = [];
        let zeladorTarget = false;
        updateDoc(doc(database, "playeradmin", "blackout", user.email, 'blackout'), { blackout: 'true' })

        let Sactions = mobilePlayerActionsSingle.sort((a, b) => a.wakeOrder - b.wakeOrder);

        // variables for temporary aflictions
        let fakeSuspect = [];
        let fakeInnocent = [];
        let attackImmunity = [];
        let agressiveToVisits = [];
        var murderedPlayers = []
        if (currentDayTemp[0].currentDay % 2 === 0) {
            const lobisomenPerson = alivePlayers.filter((player) => player.role === 'lobisomen');
            if (lobisomenPerson.length > 0) {
                agressiveToVisits.push(lobisomenPerson[0].playerName);
            }
            rolesImunetoBlocks.push('lobisomen');
            rolesImunetoAttacks.push('lobisomen');
        }
        console.log(mobilePlayerActionsSingle);
        console.log(Sactions);

        // First FOR to run through for blocks
        for (let i = 0; i < Sactions.length; i++) {
            if (Sactions[i].userRole === 'meretriz' || Sactions[i].userRole === 'taberneiro' || Sactions[i].userRole === 'fome') {
                if (rolesImunetoBlocks.includes(Sactions[i].targetRole)) {
                    // in this case nothing happens
                    // If the person thats getting blocked is imune, nothing happens
                    console.log('this target can NOT be blocked');
                } else {
                    // if theyre not imune, they get blocked
                    blockedTargets.push(Sactions[i].target)
                }
                
                if (rolesThatAttackBlockers.includes(Sactions[i].targetRole)) {
                // if the person that got blocked is a role that attacks, then push into attackingAction the info
                attackingAction.push({ attacker: Sactions[i].target, attackerRole: Sactions[i].targetRole, target: Sactions[i].user, targetRole: Sactions[i].userRole})
                }
            }
        }
        // For that loops through everyone and declares visits
        for (let i = 0; i < Sactions.length; i++) {
            // Loop for visits]
            if (blockedTargets.includes(Sactions[i].user)) {
                console.log('this person is blocked so therefore they will not visit their target')
            } else if (Sactions[i].user === Sactions[i].target) {
                // In case of veteran and zelador and all of that lol (all the classes that target themselves)
            } else {
                visitsThatOccured.push({ visitor: Sactions[i].user, visited: Sactions[i].target });
            }
        }
        console.log(visitsThatOccured);


        // FOR that runs through everyone else
        for (let i = 0; i < Sactions.length; i++) {
            console.log(Sactions[i].user)
            const ref = doc(database, "playeradmin", "players", user.email, Sactions[i].userID)
            // Checks if the target is blocked, case they are, responds to block and skips their continuation
            if (blockedTargets.includes(Sactions[i].user)) {
                updateDoc((ref), { newResponse: 'Você foi Bloqueado essa noite!' })
            } else {
                // Now the switch case for all the actions
                switch (Sactions[i].userRole) {
                    case 'investigador':
                        if (Sactions[i].targetRole === 'miragem') {
                            updateDoc((ref), { newResponse: `O jogador ${Sactions[i].target} tem a função meretriz` })
                        } else if (Sactions[i].targetRole === 'peste') {
                            updateDoc((ref), { newResponse: `O jogador ${Sactions[i].target} tem a função morte` })
                        } else {
                            updateDoc((ref), { newResponse: `O jogador ${Sactions[i].target} tem a função ${Sactions[i].targetRole}` })
                        }
                        break;
                    case 'xerife':
                        if (consideredEvilRoles.includes(Sactions[i].targetRole) || fakeSuspect.includes(Sactions[i].target)) {
                            updateDoc((ref), { newResponse: `O jogador ${Sactions[i].target} é suspeito!` })
                        }else {
                            updateDoc((ref), { newResponse: `O jogador ${Sactions[i].target} NÃO é suspeito!` })
                        }
                        break;
                    case 'espiao':
                        const possibleVisits = visitsThatOccured.filter((visit) => visit.visitor === Sactions[i].target);
                        let actualVisitors = []
                        for (let i = 0; i < possibleVisits.length; i++) {
                            actualVisitors.push(possibleVisits[i].visited)
                        }
                        if (actualVisitors.length > 0) {
                            updateDoc((ref), { newResponse: `O(s) jogador(es) ${actualVisitors.map((visitor) => visitor)} receberam uma visita de seu alvo` });
                        } else {
                            updateDoc((ref), { newResponse: `Seu alvo não visitou ninguém!` });
                        }
                        break;
                    case 'fuxiqueira':
                        // Respond with 3 names, 1 of which has really visited their target, 2 of which are random.
                        if (alivePlayers.length > 5) {
                            const peopleThatVisitedFuxTarget = visitsThatOccured.filter((visit) => visit.visited === Sactions[i].target && visit.visitor !== Sactions[i].user);
                            if (peopleThatVisitedFuxTarget.length > 0) {
                                console.log('triggered fuxiqueira action');
                                let suspects = [];
                                suspects.push(peopleThatVisitedFuxTarget[0].visitor);
                                const filteredPlayers = alivePlayers.filter((persons) => persons.playerName !== Sactions[i].user && persons.players !== suspects[0] && persons.playerName !== Sactions[i].target);
                                console.log(filteredPlayers);
                                for (let i = 0; i < 2; i++){
                                    let x = Math.floor((Math.random() * filteredPlayers.length) + 1);
                                    suspects.push(filteredPlayers[x].playerName);
                                    const removed = filteredPlayers.splice(x, 1);
                                }
                                const organizedSuspects = suspects.sort((a, b) => a - b);
                                updateDoc((ref), { newResponse: `O(s) jogador(es) ${organizedSuspects.map((suspect) => suspect)} possivelmente visitaram seu alvo: ${Sactions[i].target}` });
                            } else {
                                console.log('did not trigger fuxiqueira action')
                                updateDoc((ref), { newResponse: `Há boatos de que ninguém visitou seu alvo: ${Sactions[i].target}` });
                            }
                        } else {
                            updateDoc((ref), { newResponse: `Sua habilidade só funciona com 6 ou mais jogadores vivos` });
                        }
                        break;
                    case 'armadilheiro':
                        let possibleVisitors = visitsThatOccured.filter((visit) => visit.visited === Sactions[i].target);
                        let ocurrences = [];
                        console.log(possibleVisitors);
                        for (let i = 0; i < possibleVisitors.length; i++) {
                            ocurrences.push(possibleVisitors[i].visitor)
                        }
                        if (ocurrences.length > 0) {
                            updateDoc((ref), { newResponse: `O(s) jogador(es) ${ocurrences.map((trigger) => trigger)} visitaram seu alvo!` });
                        } else {
                            updateDoc((ref), { newResponse: `Ninguém visitou seu alvo` });
                        }
                        break;                  
                    case 'curandeira':
                        healedTargets.push(Sactions[i].target);
                        break;                  
                    case 'padeira':
                        healedTargets.push(Sactions[i].target);
                        break;
                    case 'guardiao':
                        protectedTargets.push(Sactions[i].target);
                        break;
                    case 'bardo':
                        updateDoc((doc(database, "playeradmin", "players", user.email, Sactions[i].targetId)), { buff: 'Você está Motivado! Seu voto em qualquer votação está dobrado!' });
                        break;
                    case 'veterano':
                        agressiveToVisits.push(Sactions[i].user);
                        rolesImunetoAttacks.push('veterano');
                        break;
                    case 'vigilante':
                        attackingAction.push({ attacker: Sactions[i].user, attackerRole: Sactions[i].userRole, target: Sactions[i].target, targetRole: Sactions[i].targetRole })
                        break;
                    case 'medium':
                        // Nothing needs to be registered
                        break;
                    case 'ferreiro':
                        break;
                    case 'assassino em serie':
                        attackingAction.push({ attacker: Sactions[i].user, attackerRole: Sactions[i].userRole, target: Sactions[i].target, targetRole: Sactions[i].targetRole })
                        break;
                    case 'executor':
                        updateDoc((doc(database, "playeradmin", "players", user.email, Sactions[i].targetId)), { executorTarget: true });
                        break;
                    case 'lobisomen':
                        attackingAction.push({ attacker: Sactions[i].user, attackerRole: Sactions[i].userRole, target: Sactions[i].target, targetRole: Sactions[i].targetRole })
                        break;
                    case 'medico da peste':
                        healedTargets.push(Sactions[i].target);
                        break;
                    case 'palhaco':
                        updateDoc((doc(database, "playeradmin", "players", user.email, Sactions[i].targetId)), { clownBomb: true });
                        break;
                    case 'pistoleiro':
                        updateDoc((doc(database, "playeradmin", "players", user.email, Sactions[i].targetId)), { pistoleiroMark: true });
                        break;
                    case 'mestre':
                        attackingAction.push({ attacker: Sactions[i].user, attackerRole: Sactions[i].userRole, target: Sactions[i].target, targetRole: Sactions[i].targetRole })
                        break;
                    case 'patriarca':
                        // Nothing needs to be registered as far as I know
                        break;
                    case 'matriarca':
                        if (Sactions[i].targetRole === 'miragem') {
                            updateDoc((ref), { newResponse: `O jogador ${Sactions[i].target} tem a função meretriz` })
                        } else if (Sactions[i].targetRole === 'peste') {
                            updateDoc((ref), { newResponse: `O jogador ${Sactions[i].target} tem a função morte` })
                        } else {
                            updateDoc((ref), { newResponse: `O jogador ${Sactions[i].target} tem a função ${Sactions[i].targetRole}` })
                        }
                        break;
                    case 'mordomo':
                        updateDoc((doc(database, "playeradmin", "players", user.email, Sactions[i].targetId)), { debuff: 'Você está Chantageado!' });
                        break;
                    case 'zelador':
                        zeladorTarget = true;
                        break;
                    case 'morte':
                        attackingAction.push({ attacker: Sactions[i].user, attackerRole: Sactions[i].userRole, target: Sactions[i].target, targetRole: Sactions[i].targetRole })
                        break;
                    case 'guerra':
                        break;
                    case 'FILLER HERE FOR ME TO REMEMBER':
                        // Mafia is getting written together, same as coven!
                        break;
                    default:
                        break;
                    
                    
                }


            }

        }
        // Trigger the alerted players
        var playersThatVisitedAgressors = []
        for (let i = 0; i < agressiveToVisits.length; i++) {
            const result = visitsThatOccured.filter((visit) => visit.visited === agressiveToVisits[i]);
            for (let i = 0; i < result.length; i++){
                playersThatVisitedAgressors.push(result[i]);
            }
        }
        for (let i = 0; i < playersThatVisitedAgressors.length; i++) {
            console.log( playersThatVisitedAgressors)
            const roleofWhoAttacked = alivePlayers.filter((player) => player.playerName === playersThatVisitedAgressors[i].visited);
            const roleofWhosGettingAttacked = alivePlayers.filter((player) => player.playerName === playersThatVisitedAgressors[i].visitor);
            attackingAction.push({ attacker: playersThatVisitedAgressors[i].visited, attackerRole: roleofWhoAttacked[0].role, target: playersThatVisitedAgressors[i].visitor, targetRole: roleofWhosGettingAttacked[0].role });
        }
        // ATTACK actions
        for (let i = 0; i < attackingAction.length; i++) {
            console.log(attackingAction)
            const att = attackingAction[i];
            if (rolesImunetoAttacks.includes(att.targetRole)) {
                // Nothing happens to the person
            } else if (protectedTargets.includes(att.target)) {
                // Nothing happens
                const theGuardian = alivePlayers.filter((player) => player.role === 'guardiao');
                attackingAction.push({ attacker: theGuardian[0].playerName, attackerRole: 'guardiao', target: att.attacker, targetRole: att.targetRole });

            } else if (healedTargets.includes(att.target)) {
                // nothing happens to the healed person
              
            } else {
                if (att.attackerRole === 'vigilante') {
                    const targetFill = alivePlayers.filter(player => player.role === att.targetRole);
                    if (targetFill[0]?.filliation === 'town') {
                        murderedPlayers.push({ killedPlayerName: att.attacker, killedPlayerRole: att.attackerRole, attackerRole: att.attackerRole, attacker: att.attacker });
                        console.log('triggered the vigilante ifs')
                    }
                }
                // kill the player
                murderedPlayers.push({ killedPlayerName: att.target, killedPlayerRole: att.targetRole, attackerRole: att.attackerRole, attacker: att.attacker });
                console.log(murderedPlayers);
                console.log('triggered the murdered shit')

            }
        }

        const eventsDatabase = collection(database, `playeradmin/playerStatuses/${user.email}/announcements/announcements`)
        for (let i = 0; i < murderedPlayers.length; i++){

            console.log(players);
            if (murderedPlayers[i].attackerRole === 'mestre' && zeladorTarget === true) {
            const killThisMFucker = players.filter((player) => player.playerName === murderedPlayers[0].killedPlayerName);
                await updateDoc(doc(database, "playeradmin", "players", user.email, killThisMFucker[0].id), { life: "dead", newResponse: `Você está morto, sua função não poderá ser revelada e nem o agressor.` })
                await addDoc(eventsDatabase, {
                    killedPlayer: murderedPlayers[i].killedPlayerName,
                    killedPlayerRole: 'O Zelador Esteve por aqui!',
                    attackerRole: 'O Zelador Esteve por aqui!'
                })
            } else {
                
                const killThisMFucker = players.filter((player) => player.playerName === murderedPlayers[0].killedPlayerName);
                await updateDoc(doc(database, "playeradmin", "players", user.email, killThisMFucker[0].id), { life: "dead", newResponse: `Você está morto, quem te matou foi o ${murderedPlayers[i].attackerRole}` })
                await addDoc(eventsDatabase, {
                    killedPlayer: murderedPlayers[i].killedPlayerName,
                    killedPlayerRole: murderedPlayers[i].killedPlayerRole,
                    attackerRole: murderedPlayers[i].attackerRole
                })
            }
        }
        // Delete the past actions;
        for (let i = 0; i < Sactions.length; i++){
            const ref = doc(database, "playeradmin", "playerStatuses", user.email, "mobilePlayerActions", "mobilePlayerActionsSingle", Sactions[i].id)
            await deleteDoc(ref);

        }
        // Update the current Day
        await updateDoc(doc(database, "playeradmin", "playerStatuses", user.email, "dayCounter", "dayCounter", "dayCounter"), { currentDay: currentDay + 1 });

        // Erasing the DeadChatlogs
        for (let i = 0; i < deadChatLogs.length; i++){
            await deleteDoc(doc(database, `playeradmin/chatsLog/jspedrogarcia@gmail.com/${deadChatLogs[i].id}`))
        }

        const docRef = collection(database, `playeradmin/playerStatuses/${user.email}/visitAction/visitAction`)
        for (let i = 0; i < visitsThatOccured.length; i++){
            await addDoc(docRef, {
                visitor: visitsThatOccured[i].visitor,
                visited: visitsThatOccured[i].visited
            })
        }
        // Go to the day page!
        navigateToMorning('/day');

    }






    const encerrarNoite = async () => {
        interruptMusicPlaying();
        const dead = [];
        const temporaryStatusAfliction = [];
        const allpublicEvents = [];
        const attackingAction = attackAction;
        const specialAttackingAction = specialAttack;
        const taberneiroTargetRole = alivePlayers.filter(targeted => targeted.playerName === taberneiroDodge);

        for (let i = 0; i < attackingAction.length; i++) {
            const player = alivePlayers.filter(player => { return player.playerName === attackingAction[i].target })
            if (player.length > 0) {
                
            if (nightImmunity.includes(player[0].role)) {
                // Nothing happens  
            } else{
                if (cureAction.some(e => e.target === attackingAction[i].target)) {
                // Nothing happens
                        
                } else {
                    if (alertAction.includes(attackingAction[i].target)) {
                        // nothing happens  
                    } else {
                        if (protectAction.includes(attackingAction[i].target)) {
                            const protector = alivePlayers.filter(player => { return player.role === 'guardiao' })
                                const agressor = alivePlayers.filter(player => { return player.playerName === attackingAction[i].attacker })
                                dead.push({ killedPlayer: agressor[0].playerName, killedPlayerRole: agressor[0].role, attackerRole: "guardiao"});
                                dead.push({ killedPlayer: protector[0].playerName, killedPlayerRole: protector[0].role, attackerRole: "guardiao" });
                        } else {
                            if (ferreiroProtectAction.includes(attackingAction[i].target)) {
                                    // nothing happens
                            } else {
                                if (cleanUpAction === attackingAction[i].target) {
                                dead.push({ killedPlayer: attackingAction[i].target, killedPlayerRole: "LIMPADO", attackerRole: attackingAction[i].attackerRole  })
                                    
                                } else {
                                dead.push({ killedPlayer: attackingAction[i].target, killedPlayerRole: player[0].role, attackerRole: attackingAction[i].attackerRole  })
                                }
                            }
                        }
                    }
                }
                }
            }
        };
        if (specialAttackingAction.length > 0) {
            for (let i = 0; i < specialAttackingAction.length; i++) {
                const player = alivePlayers.filter(player => { return player.playerName === specialAttackingAction[i].target })
                if (player.length > 0) {
                    
                    if (nightImmunity.includes(player[0].role)) {
                        // Nothing happens
                        
                    }
                    else {
                        if (cureAction.some(e => e.target === specialAttackingAction[i].target)) {
                            // Nothing happens
                                
                        }
                        else {
                            dead.push({ killedPlayer: specialAttackingAction[i].target, killedPlayerRole: player[0].role, attackerRole: specialAttackingAction[i].attackerRole })
                        }
                    }
                }

            }
        };
        if (cleanUpAction !== '') {
            temporaryStatusAfliction.push({ target: cleanUpAction, status: 'limpado' });
        }
        if (motivateAction !== '') {
            temporaryStatusAfliction.push({ target: motivateAction, status: 'motivado' });
            allpublicEvents.push({ target: motivateAction, event: 'motivado' });

        }
        if (arsonTarget.length > 0) {
            for (let n = 0; arsonTarget.length > n; n++){
                temporaryStatusAfliction.push({ target: arsonTarget[n].playerName, status: 'ensopado' });
            }  
        }
        if (executorAction.length > 0) {
            for (let n = 0; executorAction.length > n; n++){
                temporaryStatusAfliction.push({ target: executorAction[n].target, status: 'executação' });
            }  
        }
        if (newParasiteAction.length > 0) {
            for (let n = 0; newParasiteAction.length > n; n++){
                temporaryStatusAfliction.push({ target: newParasiteAction[n].playerName, status: 'parasita' });
            }  
        }
        if (newPoisonedTarget.length > 0) {
            for (let m = 0; newPoisonedTarget.length > m; m++){
                if (newPoisonedTarget[m].target === taberneiroDodge) {
                    
                } else {
                    temporaryStatusAfliction.push({ target: newPoisonedTarget[m].target, status: 'amaldiçoado' });
                    allpublicEvents.push({target: newPoisonedTarget[m].target , event: 'amaldiçoado' })
                }
            }
            
        }
        if (temporaryStatusAfliction.length > 0) {
            const temporaryref = collection(database, `playeradmin/playerStatuses/${user.email}/statusAfliction/statusAfliction`)
            for (let k = 0; k < temporaryStatusAfliction.length; k++){
                if (temporaryStatusAfliction[k].target === taberneiroDodge) {
                    if (currentDayTemp[0].currentDay % 2 === 0 && taberneiroTargetRole[0].role === 'lobisomen') {
                        await addDoc(temporaryref, {
                            target: temporaryStatusAfliction[k].target,
                            status: temporaryStatusAfliction[k].status
                        })
                    }
                } else {
                    if (temporaryStatusAfliction[k].target === alertAction) {
                        
                    }
                    await addDoc(temporaryref, {
                        target: temporaryStatusAfliction[k].target,
                        status: temporaryStatusAfliction[k].status
                    })
                }
            }
        }
        if (allpublicEvents.length > 0) {
            const ref = collection(database, `playeradmin/playerStatuses/${user.email}/publicEvents/publicEvents`)
            for (let i = 0; i < allpublicEvents.length; i++){
                if (allpublicEvents[i].target === taberneiroDodge) {
                    if (currentDayTemp[0].currentDay % 2 === 0 && taberneiroTargetRole[0].role === 'lobisomen') {
                        await addDoc(ref, {
                            target: allpublicEvents[i].target,
                            status: allpublicEvents[i].status
                        })
                    }
                } else {
                    await addDoc(ref, {
                        target: allpublicEvents[i].target,
                        event: allpublicEvents[i].event
                    })
                }
            }
        }

        // Set the armadilheiro information

        if (armadilheiroAction !== '') {
            const visitors = visitAction.filter(visit => { return visit.target === armadilheiroAction });
            const ref = collection(database, `playeradmin/playerStatuses/${ user.email }/armadilheiroInformation/armadilheiroInformation`)
            for (let i = 0; i < visitors.length; i++){
                const test = alivePlayers.filter(player => { return player.playerName === visitors[i].visitor });
                addDoc(ref, {
                    role: test[0].role
                })
            }

        }
        if (spyAction !== '') {
            const ref = collection(database, `playeradmin/playerStatuses/${ user.email }/spyInformation/spyInformation`)
            const visitee = visitAction.filter(visit => { return visit.visitor === spyAction })
            for (let i = 0; i < visitee.length; i++){
                addDoc(ref, {
                    visited: visitee[i].target
                })
            }
        }
        if (fuxiqueiraAction !== '') {
            if (alivePlayers.length > 5) {
            const ref = collection(database, `playeradmin/playerStatuses/${user.email}/fuxiqueiraInformation/fuxiqueiraInformation`)
            const visitors = visitAction.filter(visit => { return visit.target === fuxiqueiraAction })
            const fuxiqueira = alivePlayers.filter(player => player.role === 'fuxiqueira');
            for (let i = 0; i < visitors.length; i++){
                if (visitors[i].visitor === fuxiqueira[0].playerName) {
                    visitors.splice(i, 1);
                    i--;
                }
            }

            if (visitors.length > 0) {
                const temporaryVisitors = []
                    temporaryVisitors.push(visitors[0].visitor)
                console.log('Primeira pessoa que visitou:' + temporaryVisitors)
                for (var x = 0; x < 2; x++){
                    var roleIndex = Math.floor(Math.random() * alivePlayers.length)
                    if (temporaryVisitors.includes(alivePlayers[roleIndex].playerName) || alivePlayers[roleIndex].playerName === fuxiqueira[0].playerName || alivePlayers[roleIndex].playerName === fuxiqueiraAction) {
                        x--
                    } else {
                        temporaryVisitors.push(alivePlayers[roleIndex].playerName)
                        console.log('2nd & 3rd randoms?:' + temporaryVisitors)
                    }
                }
                temporaryVisitors.sort()
                for (let i = 0; i < temporaryVisitors.length; i++){
                    addDoc(ref, {
                        visited: temporaryVisitors[i]
                    })
                }
                }
            }
        }
        exportvisitDatabase();
        exportNewDatabase();
        minorDatabaseUpdates();
        // Kill players Officially
        for (let j = 0; j < dead.length; j++){
            const infoPlayer = alivePlayers.filter(player => { return player.playerName === dead[j].killedPlayer });
            await updateDoc(doc(database, "playeradmin", "players", user.email, infoPlayer[0].id), { life: "dead"})
        }
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
                target: newPoisonedTarget[c].target
            })
        }
    }
    const minorDatabaseUpdates = async () => {
        await updateDoc(doc(database, "playeradmin", "playerStatuses", user.email, "dayCounter", "dayCounter", "dayCounter"), { currentDay: currentDay + 1 });
        await updateDoc(doc(database, "playeradmin", "playerStatuses", user.email, "padeiraHeals", "padeiraHeals", "padeiraHeals"), { healCountMax: padeiraHealCount });
        await updateDoc(doc(database, "playeradmin", "playerStatuses", user.email, "conselheiraCounter", "conselheiraCounter", "conselheiraCounter"), { counter: conselheiraCounter });
        await updateDoc(doc(database, "playeradmin", "playerStatuses", user.email, "investigatorCounter", "investigatorCounter", "investigatorCounter"), { counter: investigatorCounter });
        await updateDoc(doc(database, "playeradmin", "playerStatuses", user.email, "zeladorCounter", "zeladorCounter", "zeladorCounter"), { counter: zeladorCounter });
        await updateDoc(doc(database, "playeradmin", "playerStatuses", user.email, "veteranCounter", "veteranCounter", "veteranCounter"), { counter: veteranCounter });
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
    const playNightSounds = () => {
        playNightSound()
        const witchesInHere = alivePlayers.filter(witch => { return witch.filliation === 'coven'})
        const wolvesInHere = alivePlayers.filter(wolf => { return wolf.role === 'lobisomen' })
        let text = '';
        if (currentDayTemp[0].currentDay % 2 === 0 && wolvesInHere.length > 0) {
            playWerewolfPresentSound();
            setIsNotifierModal(true)
            text = text + 'O Lobisomen transformou essa noite.'
        }
        if (currentDayTemp[0].currentDay > 3 && witchesInHere.length > 0) {
            text = text + 'As bruxas possuem o Grimorio!'
            setIsNotifierModal(true)
            setTimeout(() => {
                playGrimorioSound();

            }, 2000);
        }
        setNotifierModalContent(text)

    }
    const nightPrompt = () => {
        playNightSounds();
        setIsOpen(false);
        updateDoc(doc(database, "playeradmin", "playerStatuses", user.email, "gameState", "gameState", "gameState"), { gameState: "noite"})
        setCurrentDay(currentDayTemp[0].currentDay)
        for (let i = 0; i < players.length; i++){
            updateDoc(doc(database, `playeradmin/players/${user.email}/${players[i].id}`), { newResponse: "", buff: "", debuff: "", clownBomb: false, pistoleiroMark: false });
        }

    }
    return (

        <div className="night">
            <h3 className="page-title">
                Noite {currentDay}
            </h3>
            <div className="nightMain">
                <div className="event-action event">
                        <h4>
                        Jogadores e Ações
                        </h4>
                    <div className="huge-container card-border scrollable">
                        <div className="actionContainer">
                            {alivePlayers.map(player => {
                                return player.action === 'pending' ?
                                    <div className="townies actionUnit"> <p>{player.playerName} </p><p>{player.role}</p> <p> Ação Pendente</p></div>
                                :   <div className="mafiaies actionUnit"> <p>{player.playerName} </p><p>{player.role}</p> <p> Ação Completa</p></div>
                            })}
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
                    <button className="button" onClick={encerrarNoiteMobile}> Encerrar Noite!</button>

                </div>
                </div>
            </div>
            <Popup open={investigativeModal} modal closeOnDocumentClick={false}>
                    <div className="modalNight">
                        <div className="header">Resultado da sua Pesquisa</div>
                        <div className="content investigativeContent">
                            <div className="investigativeModalInformation">{investigativeInfo}</div>
                        </div>
                        </div>
        </Popup>
            <Popup open={isOpen} modal >
                    <div className="modalNight">
                        <div className="header">Para iniciar a noite, clique abaixo </div>
                        <div className="content">

                            <button className="button" onClick={nightPrompt}>Iniciar Noite</button>
                        </div>
                        </div>
        </Popup>
            <Popup open={groupWakeModalIsOpen} modal closeOnDocumentClick={false}>
                    <div className="modalNight">
                        <div className="header">{groupInfo}</div>
                        <div className="content">
                        <button className="button" onClick={() => setGroupWakeModalIsOpen(false)}>Okay</button>
                    </div>
                    
                        </div>
        </Popup>
            <Popup open={isNotifierModal} modal closeOnDocumentClick={false}>
                    <div className="modalNight">
                        <div className="header">{notifierModalContent}</div>
                        <div className="content">
                        <button className="button" onClick={() => setIsNotifierModal(false)}>Okay</button>
                    </div>
                    
                        </div>
        </Popup>
        </div>
    )
}

export default Night;