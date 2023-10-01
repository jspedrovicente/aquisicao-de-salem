import {doc, addDoc, collection, onSnapshot, deleteDoc, updateDoc } from "firebase/firestore";
import { useEffect, useState } from "react";
import { database } from "../../firebaseConnection";
import { useNavigate } from "react-router-dom";
import Popup from 'reactjs-popup';
import 'reactjs-popup/dist/index.css';
import "./night.css"
import useSound from "use-sound";
import grimorioEffect from "../../assets/coven-grimorio-presente.mp3"
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
    const [evilChatLog, setEvilChatLog] = useState([]);
    const navigateToMorning = useNavigate();
    
    // Night Manipulation
    const [currentDay, setCurrentDay] = useState(1);
    const [notifierModalContent, setNotifierModalContent] = useState('');
    const [isNotifierModal, setIsNotifierModal] = useState(false);
    // Night actions that transfers to morning

    // Information that is transfered solo
    const [mobilePlayerActionsSingle, setMobilePlayerActionsSingle] = useState([])
    // Night actions that do not transfer
    const [currentDayTemp, setCurrentDayTemp] = useState([]);
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
                        doused: doc.data().doused
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
                        autor: doc.data().autor, message: doc.data().mensagem, horario: doc.data().horario, id: doc.id
                    })
                })
                const sortedMessages = conversations.sort((a, b) => a.horario - b.horario)
                setDeadChatLogs(sortedMessages);
            })
            const evilChatLog = onSnapshot(collection(database, `playeradmin/familyChatLog/jspedrogarcia@gmail.com`), (snapshot) => {
                let conversations = []
                snapshot.forEach((doc) => {
                    conversations.push({
                        autor: doc.data().autor, message: doc.data().mensagem, horario: doc.data().horario, id: doc.id
                    })
                })
                const sortedMessages = conversations.sort((a, b) => a.horario - b.horario)
                setEvilChatLog(sortedMessages);
            })
        }
        loadRememberedData();
    }, [user.email])
    const interruptMusicPlaying = () => {
        stopNightSound();
    }
    const encerrarNoiteMobile = async () => {
        interruptMusicPlaying();
        let rolesImunetoBlocks = ['meretriz', 'taberneiro', 'miragem', 'executor', 'caloteira'];
        let rolesThatAttackBlockers = ['assassino em serie', 'mestre', 'lobisomen', 'morte', 'vigilante'];
        let rolesImunetoAttacks = ['piromaniaco', 'assassino em serie', 'sobrevivente']
        let consideredEvilRoles = ['fome', 'guerra', 'morte', 'estranho', 'amaldicoadora', 'feiticeira benevolente', 'parasita', 'matriarca', 'mestre', 'mordomo', 'zelador', 'piromaniaco', 'assassino em serie', 'bobo da corte', 'executor', 'lobisomen', 'medico da peste', 'palhaco', 'pistoleiro' ]
        let blockedTargets = [];
        let attackingAction = [];
        let visitsThatOccured = [];
        let attackingActionSpecial = [];
        let healedTargets = [];
        let protectedTargets = [];
        let zeladorTarget = false;
        let fakeSuspect = [];
        let agressiveToVisits = [];
        var murderedPlayers = []
        let tabernTarget = []
        let caloteiraTarget = '';
        updateDoc(doc(database, "playeradmin", "blackout", user.email, 'blackout'), { blackout: 'true' })
        let Sactions = mobilePlayerActionsSingle.sort((a, b) => a.wakeOrder - b.wakeOrder);
        // variables for temporary aflictions
        if (currentDayTemp[0].currentDay % 2 === 0) {
            const lobisomenPerson = alivePlayers.filter((player) => player.role === 'lobisomen');
            if (lobisomenPerson.length > 0) {
                agressiveToVisits.push(lobisomenPerson[0].playerName);
            }
            rolesImunetoBlocks.push('lobisomen');
            rolesImunetoAttacks.push('lobisomen');
        }

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
                    if (Sactions[i].userRole === 'taberneiro') {
                        tabernTarget.push(Sactions[i].target);
                    }
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
            } else if (tabernTarget.includes(Sactions[i].target) && Sactions[i].userRole !== 'taberneiro') {
                // This visit will not happen at all
            }
                else {
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
            } else if (tabernTarget.includes(Sactions[i].target) && Sactions[i].userRole !== 'taberneiro') {
                // Nothing should happen.
            }
            else {
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
                            updateDoc((ref), { newResponse: `Seu alvo: (${Sactions[i].target}) visitou: ${actualVisitors.map((visitor) => visitor)} ` });
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
                                const filteredPlayers = alivePlayers.filter((persons) => persons.playerName !== Sactions[i].user && persons.playerName !== suspects[0] && persons.playerName !== Sactions[i].target);
                                console.log(filteredPlayers);
                                for (let i = 0; i < 2; i++){
                                    let xValue = Math.floor((Math.random() * filteredPlayers.length) + 1);
                                    suspects.push(filteredPlayers[xValue].playerName);
                                    filteredPlayers.splice(xValue, 1);
                                }
                                const organizedSuspects = suspects.sort();
                                console.log(suspects);
                                console.log(organizedSuspects);
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
                            const roleOfVisitor = alivePlayers.filter(player => player.playerName === possibleVisitors[i].visitor);
                            ocurrences.push(roleOfVisitor[0].role)
                        }
                        if (ocurrences.length > 0) {
                            updateDoc((ref), { newResponse: `As funções ${ocurrences.map((trigger) => trigger)} visitaram seu alvo: ${Sactions[i].target}` });
                        } else {
                            updateDoc((ref), { newResponse: `Ninguém ativou a sua armadilha essa noite!` });
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
                    case 'piromaniaco':
                        if (Sactions[i].user === Sactions[i].target) {
                            const dousedPlayers = alivePlayers.filter((player) => player.doused === true);
                            console.log('doused players' + dousedPlayers)
                            for (let j = 0; j < dousedPlayers.length; j++){
                                // Set as an attacking action?
                                attackingActionSpecial.push({ attacker: Sactions[i].user, attackerRole: Sactions[i].userRole, target: dousedPlayers[j].playerName, targetRole: dousedPlayers[j].role })
                                updateDoc((doc(database, "playeradmin", "players", user.email, dousedPlayers[j].id)), { doused: false });
                                
                            }
                        } else {
                            updateDoc((doc(database, "playeradmin", "players", user.email, Sactions[i].targetId)), { doused: true });
                        }
                        break;
                    case 'mestre':
                        attackingAction.push({ attacker: Sactions[i].user, attackerRole: Sactions[i].userRole, target: Sactions[i].target, targetRole: Sactions[i].targetRole })
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
                    case 'caloteira':
                        caloteiraTarget = Sactions[i].target;
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
            if (att.target === caloteiraTarget) {
                murderedPlayers.push({ killedPlayerName: att.target, killedPlayerRole: att.targetRole, attackerRole: att.attackerRole, attacker: att.attacker });
            } else if (rolesImunetoAttacks.includes(att.targetRole)) {
                // Nothing happens to the person
            } else if (protectedTargets.includes(att.target)) {
                // Nothing happens
                const theGuardian = alivePlayers.filter((player) => player.role === 'guardiao');
                attackingAction.push({ attacker: theGuardian[0].playerName, attackerRole: 'guardiao', target: att.attacker, targetRole: att.attackerRole });

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
        // Special attacks (that can be healed but not protected);
        for (let i = 0; i < attackingActionSpecial.length; i++) {
            console.log(attackingActionSpecial)
            const att = attackingActionSpecial[i];
            if (healedTargets.includes(att.target)) {
                // nothing happens to the healed person
            } else {
                // kill the player
                murderedPlayers.push({ killedPlayerName: att.target, killedPlayerRole: att.targetRole, attackerRole: att.attackerRole, attacker: att.attacker });
            }
        }

        const eventsDatabase = collection(database, `playeradmin/playerStatuses/${user.email}/announcements/announcements`)
        for (let i = 0; i < murderedPlayers.length; i++){

            if (murderedPlayers[i].attackerRole === 'mestre' && zeladorTarget === true) {
            const killThisMFucker = players.filter((player) => player.playerName === murderedPlayers[i].killedPlayerName);
                await updateDoc(doc(database, "playeradmin", "players", user.email, killThisMFucker[0].id), { life: "dead", newResponse: `Você está morto, sua função não poderá ser revelada e nem o agressor.` })
                await addDoc(eventsDatabase, {
                    killedPlayer: murderedPlayers[i].killedPlayerName,
                    killedPlayerRole: 'O Zelador Esteve por aqui!',
                    attackerRole: 'O Zelador Esteve por aqui!'
                })
            } else {
                
                const killThisMFucker = players.filter((player) => player.playerName === murderedPlayers[i].killedPlayerName);
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

        // Declaring all the visits
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
        for (let i = 0; i < evilChatLog.length; i++){
            deleteDoc(doc(database, `playeradmin/familyChatLog/jspedrogarcia@gmail.com/${evilChatLog[i].id}`))

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
            <Popup open={isOpen} modal >
                    <div className="modalNight">
                        <div className="header">Para iniciar a noite, clique abaixo </div>
                        <div className="content">

                            <button className="button" onClick={nightPrompt}>Iniciar Noite</button>
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