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

import werewolfPresentEffect from "../../assets/werewolf-present-soundeffect.mp3"
import afilhadoEffect from "../../assets/afilhado-soundeffect.mp3"
import godfatherEffect from "../../assets/godfather-soundeffect.mp3"
import zeladorEffect from "../../assets/zelador-soundeffect.mp3"
import conselheiraEffect from "../../assets/conselheira-soundeffect.mp3"
import vigaristaEffect from "../../assets/vigarista-soundeffect.mp3"
import nightmusic1 from "../../assets/nightsounds/nightmusic/nightmusic1.mp3"
import nightmusic2 from "../../assets/nightsounds/nightmusic/nightmusic2.mp3"
import nightmusic3 from "../../assets/nightsounds/nightmusic/nightmusic3.mp3"
import nightmusic4 from "../../assets/nightsounds/nightmusic/nightmusic4.mp3"
import nightmusic5 from "../../assets/nightsounds/nightmusic/nightmusic5.mp3"
import nightmusic6 from "../../assets/nightsounds/nightmusic/nightmusic6.mp3"
import nightmusic7 from "../../assets/nightsounds/nightmusic/nightmusic7.mp3"
import nightmusic8 from "../../assets/nightsounds/nightmusic/nightmusic8.mp3"

// SET THE Function wakeup ORDER IN FIREBASE FOR EACH CHARACTER, REMEMBER MERETRIZ IS FIRST IF THE EXECUTOR HAS ALREADY MADE HIS DECISION
const Night = () => {
    // SoundEffects for all the characters;
    const [playNightSound1, { stop: stopNightSound1 }] = useSound(nightmusic1, {volume: 0.45});
    const [playNightSound2, { stop: stopNightSound2 }] = useSound(nightmusic2, {volume: 0.45});
    const [playNightSound3, { stop: stopNightSound3 }] = useSound(nightmusic3, {volume: 0.45});
    const [playNightSound4, { stop: stopNightSound4 }] = useSound(nightmusic4, {volume: 0.45});
    const [playNightSound5, { stop: stopNightSound5 }] = useSound(nightmusic5, {volume: 0.45});
    const [playNightSound6, { stop: stopNightSound6 }] = useSound(nightmusic6, {volume: 0.45});
    const [playNightSound7, { stop: stopNightSound7 }] = useSound(nightmusic7, {volume: 0.45});
    const [playNightSound8, { stop: stopNightSound8 }] = useSound(nightmusic8, {volume: 0.45});
    const [playBardoSound] = useSound(harpEffect, {volume: 0.50});
    const [playAssassinoEmSerieSound] = useSound(assassinoemserieEffect);
    const [playArsonistaSound] = useSound(arsonistaEffect);
    const [playArmadilheiroSound] = useSound(armadilheiroEffect);
    const [playFerreiroSound] = useSound(ferreiroEffect);
    const [playXerifeSound] = useSound(xerifeEffect);
    const [playMeretrizSound] = useSound(meretrizEffect);
    const [playPistoleiroSound] = useSound(pistoleiroEffect);
    const [playPalhacoSound] = useSound(palhacoEffect, {volume: 0.50});
    const [playEspiaoSound] = useSound(espiaoEffect);
    const [playInvestigadorSound] = useSound(investigadorEffect);
    const [playVigilanteSound] = useSound(vigilanteEffect);
    const [playVeteranSound] = useSound(veteranEffect);
    const [playMediumSound] = useSound(mediumEffect);
    const [playGuardiaoSound] = useSound(guardiaoEffect);
    const [playPadeiraSound] = useSound(padeiraEffect);
    const [playMedicoDaPesteSound] = useSound(medicodapesteEffect);
    const [playLobisomenSound] = useSound(lobisomenEffect);
    const [playFeiticeiraSound] = useSound(feiticeirabenevolenteEffect);
    const [playFeiticeiraGrimorioSound] = useSound(feiticeirabenevolenteGrimorioEffect);
    const [playCurandeiraSound] = useSound(curandeiraEffect);
    const [playMiragemGrimorioSound] = useSound(miragemGrimorioEffect);
    const [playParasitaSound] = useSound(parasitaEffect);
    const [playAmaldicoadoraSound] = useSound(amaldicoadoraEffect);
    const [playParasitaGrimorioSound] = useSound(parasitaGrimorioEffect);
    const [playGrimorioSound] = useSound(grimorioEffect);
    const [playWerewolfPresentSound] = useSound(werewolfPresentEffect);
    const [playAfilhadoSound] = useSound(afilhadoEffect);
    const [playGodfatherSound] = useSound(godfatherEffect);
    const [playZeladorSound] = useSound(zeladorEffect);
    const [playConselheiraSound] = useSound(conselheiraEffect);
    const [playVigaristaSound] = useSound(vigaristaEffect);
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
    const [investigatorCounter, setInvestigatorCounter] = useState(0);
    const [veteranCounter, setVeteranCounter] = useState(0);
    const [conselheiraCounter, setConselheiraCounter] = useState(0);
    const [zeladorCounter, setZeladorCounter] = useState(0);
    
    const [armadilheiroAction, setArmadilheiroAction] = useState('');
    const [spyAction, setSpyAction] = useState('');
    // Information that gets processed together
    const [motivateAction, setMotivateAction] = useState('');
    const [blackMailAction, setBlackMailAction] = useState('');
    const [cleanUpAction, setCleanUpAction] = useState('');
    const [markAction, setMarkAction] = useState('');
    const [clownBombAction, setClownBombAction] = useState('');
    const [inGameStatusAfliction, setinGameStatusAfliction] = useState([]);
    const [armadilheiroInformation, setArmadilheiroInformation] = useState([]);
    // Information that transfers but is processed SOLO
    const [arsonTarget, setArsonTarget] = useState([]);
    const [poisonedTarget, setPoisonedTarget] = useState([]);
    const [newPoisonedTarget, setNewPoisonedTarget] = useState([]);
    const [parasiteAction, setParasiteAction] = useState([]);
    const [newParasiteAction, setNewParasiteAction] = useState([]);
    const [deadAction, setDeadAction] = useState([]);
    const [publicEvents, setPublicEvents] = useState([]);

    // Night actions that do not transfer
    const [falsefyInvestigativeAction, setFalsefyInvestigativeAction] = useState([]);
    const [cureAction, setCureAction] = useState([]);
    const [blockAction, setBlockAction] = useState([]);
    const [weapon, setWeapon] = useState('espada');
    const [attackAction, setAttackAction] = useState([]);
    const [protectAction, setProtectAction] = useState('');
    const [ferreiroProtectAction, setferreiroProtectAction] = useState('');
    const [alertAction, setAlertAction] = useState('');
    const [werewolfAlert, setWerewolfAlert] = useState('');
    const [padeiraTemp, setPadeiraTemp] = useState([]);
    const [investigadorTemp, setInvestigatorTemp] = useState([]);
    const [veteranTemp, setVeteranTemp] = useState([]);
    const [conselheiraTemp, setConselheiraTemp] = useState([]);
    const [zeladorTemp, setZeladorTemp] = useState([]);
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
            const investigatorData = onSnapshot(collection(database, `playeradmin/playerStatuses/${user.email}/investigatorCounter/investigatorCounter`), (snapshot) => {
                let temp = [];
                snapshot.forEach((doc) => {
                    temp.push({ counter: doc.data().counter });
                })
                setInvestigatorTemp(temp)
            })
            const veteranData = onSnapshot(collection(database, `playeradmin/playerStatuses/${user.email}/veteranCounter/veteranCounter`), (snapshot) => {
                let temp = [];
                snapshot.forEach((doc) => {
                    temp.push({ counter: doc.data().counter });
                })
                setVeteranTemp(temp)
            })
            const conselheiraData = onSnapshot(collection(database, `playeradmin/playerStatuses/${user.email}/conselheiraCounter/conselheiraCounter`), (snapshot) => {
                let temp = [];
                snapshot.forEach((doc) => {
                    temp.push({ counter: doc.data().counter });
                })
                setConselheiraTemp(temp)
            })
            const zeladorData = onSnapshot(collection(database, `playeradmin/playerStatuses/${user.email}/zeladorCounter/zeladorCounter`), (snapshot) => {
                let temp = [];
                snapshot.forEach((doc) => {
                    temp.push({ counter: doc.data().counter });
                })
                setZeladorTemp(temp)
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
                    pse.push({ playerName: doc.data().target, id: doc.id });
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

    const interruptMusicPlaying = () => {
        stopNightSound1();
        stopNightSound2();
        stopNightSound3();
        stopNightSound4();
        stopNightSound5();
        stopNightSound6();
        stopNightSound7();
        stopNightSound8();
    }
    const encerrarNoite = async () => {
        interruptMusicPlaying();
        const dead = [];
        const temporaryStatusAfliction = [];
        const allpublicEvents = [];
        for (let i = 0; i < attackAction.length; i++) {
            const player = alivePlayers.filter(player => { return player.playerName === attackAction[i].target })
            if (player.length > 0) {
                
            if (nightImmunity.includes(player[0].role)) {
                // Nothing happens  
            } else{
                if (cureAction.some(e => e.target === attackAction[i].target)) {
                // Nothing happens
                        
                } else {
                    if (alertAction.includes(attackAction[i].target)) {
                        // nothing happens  
                    } else {
                        if (protectAction.includes(attackAction[i].target)) {
                                const protector = alivePlayers.filter(player => { return player.role === 'guardiao' })
                                const agressor = alivePlayers.filter(player => { return player.playerName === attackAction[i].attacker })
                                dead.push({ killedPlayer: agressor[0].playerName, killedPlayerRole: agressor[0].role, attackerRole: "guardiao"});
                                dead.push({ killedPlayer: protector[0].playerName, killedPlayerRole: protector[0].role, attackerRole: "guardiao" });
                        } else {
                            if (ferreiroProtectAction.includes(attackAction[i].target)) {
                                    // nothing happens
                            } else {
                                if (cleanUpAction === attackAction[i].target) {
                                dead.push({ killedPlayer: attackAction[i].target, killedPlayerRole: "LIMPADO", attackerRole: attackAction[i].attackerRole  })
                                    
                                } else {
                                dead.push({ killedPlayer: attackAction[i].target, killedPlayerRole: player[0].role, attackerRole: attackAction[i].attackerRole  })
                                }
                            }
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
                for (let i = 0; alerted.length > i; i++) {
                    const player = alivePlayers.filter(player => { return player.playerName === alerted[i].visitor })

                    dead.push({ killedPlayer: alerted[i].visitor, killedPlayerRole: player[0].role, attackerRole: "veterano" })
                };
            };
        };
        if (werewolfAlert !== '') {
            const veteran = alivePlayers.filter(player => { return player.role === 'lobisomen' });
            const alerted = visitAction.filter(visitor => { return visitor.target === veteran[0].playerName })
            if (alerted.length > 0) {
                for (let i = 0; alerted.length > i; i++) {
                    const player = alivePlayers.filter(player => { return player.playerName === alerted[i].visitor })
                    dead.push({ killedPlayer: alerted[i].visitor, killedPlayerRole: player[0].role, attackerRole: "lobisomen" })
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
                        if (cureAction.some(e => e.target === specialAttack[i].target)) {
                            // Nothing happens
                                
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
            allpublicEvents.push({target: blackMailAction , event: 'chantageado' })
        }
        if (markAction !== '') {
            temporaryStatusAfliction.push({ target: markAction, status: 'marcado' });
        }
        if (clownBombAction !== '') {
            temporaryStatusAfliction.push({ target: clownBombAction, status: 'bomba' });
            allpublicEvents.push({target: clownBombAction , event: 'bomba' })

        }
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
                temporaryStatusAfliction.push({ target: executorAction[n].target, status: 'ALVOEXECUTADOR' });
            }  
        }
        if (newParasiteAction.length > 0) {
            for (let n = 0; newParasiteAction.length > n; n++){
                temporaryStatusAfliction.push({ target: newParasiteAction[n].playerName, status: 'parasita' });
            }  
        }
        if (newPoisonedTarget.length > 0) {
            for (let m = 0; newPoisonedTarget.length > m; m++){
                temporaryStatusAfliction.push({ target: newPoisonedTarget[m].target, status: 'amaldiçoado' });
                allpublicEvents.push({target: newPoisonedTarget[m].target , event: 'amaldiçoado' })
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
        if (allpublicEvents.length > 0) {
            const ref = collection(database, `playeradmin/playerStatuses/${user.email}/publicEvents/publicEvents`)
            for (let i = 0; i < allpublicEvents.length; i++){
                await addDoc(ref, {
                    target: allpublicEvents[i].target,
                    event: allpublicEvents[i].event
                })
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
        setDeadAction(dead);
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
        const arsoned = [];
        for (let i = 0; i < arsonTarget.length; i++) {
            const arsonedPlayers = alivePlayers.filter(player => { return player.playerName === arsonTarget[i].playerName })
            if (arsonedPlayers.length > 0) {
                arsoned.push({ target: arsonedPlayers[0].playerName })
            }
        }

        for (let index = 0; index < arsoned.length; index++){
            temp.push({ attacker: alivePlayers[controlCounter - 1].playerName, attackerRole: 'arsonista', target: arsoned[index].target })
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
        document.querySelector(".alivePlayerDropDownAction2").classList.remove("invisible");
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
        setMultipleCharactersPresent('MAFIA ACORDA')
    }
    const EndMafiaNight = () => {
        setMultipleCharactersPresent('Depois dessa Ação, colocar Mafia para dormir!.')
    }
    const RemoveMultipleCharInfo = () => {
        setMultipleCharactersPresent('')
    }
    const writeCovenInformation = () => {
        setMultipleCharactersPresent('COVEN ACORDA')
    }
    const endCovenNight = () => {
        setMultipleCharactersPresent('Depois dessa Ação, colocar COVEN para dormir!.')
    }
    const writeHorsemenInformation = () => {
        setMultipleCharactersPresent('CAVALEIROS ACORDAM')
    }
    const endHorsemenNight = () => {
        setMultipleCharactersPresent('CAVALEIROS DORMEM')
    }
    const writePlayerInformation = () => {
        var currentPlayer = alivePlayers[controlCounter];
        console.log(allRoles);
        var roledetails = allRoles.filter(singleRole => { return singleRole.role === currentPlayer.role });
        setCurrentPlayerTitle(currentPlayer.role);
        setCurrentPlayerName(currentPlayer.playerName);
        setCurrentPlayerDescription(roledetails[0].skill);
    }
    const writeInvestigativeAction = () => {
        setInvestigativeModal(true);
        const investigatedPlayer = alivePlayers.filter(investigated => investigated.playerName === player);
        const ActionTakerRole = alivePlayers[controlCounter - 1].role;
        if ( ActionTakerRole === 'xerife') {
            if (falsefyInvestigativeAction.includes(investigatedPlayer[0].playerName)) {
                setInvestigativeInfo(`Esse jogador é Suspeito`)
                
            } else {
                if (investigatedPlayer[0].filliation === 'town' || investigatedPlayer[0].role === 'godfather' || investigatedPlayer[0].role === 'miragem') {
                    setInvestigativeInfo(`Esse jogador é Inocente`)
                } else {
                    setInvestigativeInfo(`Esse jogador é Suspeito`)
                }
            }
        } else {
            if (ActionTakerRole === 'investigador' || ActionTakerRole === 'conselheira') {
                if (investigatedPlayer[0].role === 'miragem') {
                        setInvestigativeInfo(`Esse jogador é o(a) Meretriz`)
                    
                } else {
                    if (investigatedPlayer[0].role === 'peste') {
                        setInvestigativeInfo(`Esse jogador é o(a) Morte`)
                    } else {
                        setInvestigativeInfo(`Esse jogador é o(a) ${investigatedPlayer[0].role}`)
                    }
                }
            }
        }
            
        }

    const wakeUpPlayers = () => {
        if (alivePlayers[controlCounter] != null) {
        openConfirmButton();
            const atualJogador = alivePlayers[controlCounter];
            switch (atualJogador.role) {
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
                    updateDoc(doc(database, "playeradmin", "players", user.email, alivePlayers[controlCounter].id), { wakeOrder: 99 });
                    writePlayerInformation();
                    setCurrentPlayerDescription(`Não precisa acordar a pessoa, clique em confirmar Ação`);
                }
                incrementCounter();
                break;
            case 'bardo':
                writePlayerInformation();
                playBardoSound();
                if (blockAction.includes(atualJogador.playerName) || blockAction2.includes(atualJogador.playerName)){
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
                if (blockAction.includes(atualJogador.playerName) || blockAction2.includes(atualJogador.playerName)) {
                    setCurrentPlayerDescription('Jogador Bloqueado, clique em pular a vez');
                    closeConfirmButton();
                } else {
                    openSingleDropDown();
                }
                incrementCounter();
                break;
            case 'curandeira':
                writePlayerInformation();
                playCurandeiraSound();
                if (blockAction.includes(atualJogador.playerName) || blockAction2.includes(atualJogador.playerName)) {
                    setCurrentPlayerDescription('Jogador Bloqueado, clique em pular a vez');
                    closeConfirmButton();
                } else {
                    openSingleDropDown();
                }
                incrementCounter();
                break;
            case 'espiao':
                writePlayerInformation();
                playEspiaoSound();
                if (blockAction.includes(atualJogador.playerName) || blockAction2.includes(atualJogador.playerName)) {
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
                if (blockAction.includes(atualJogador.playerName) || blockAction2.includes(atualJogador.playerName)) {
                    setCurrentPlayerDescription('Jogador Bloqueado, clique em pular a vez');
                    closeConfirmButton();
                }
                if (weaponCreateAction[0].weaponChoice === 'none') {
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
                playGuardiaoSound();

                if (blockAction.includes(atualJogador.playerName) || blockAction2.includes(atualJogador.playerName)) {
                    setCurrentPlayerDescription('Jogador Bloqueado, clique em pular a vez');
                    closeConfirmButton();
                } else {
                    openSingleDropDown();
                }
                incrementCounter();
                    break;
            case 'investigador':
                writePlayerInformation();
                playInvestigadorSound();
                document.querySelector('.investigatorCounter').classList.remove('invisible');
                if (blockAction.includes(atualJogador.playerName) || blockAction2.includes(atualJogador.playerName)) {
                    setCurrentPlayerDescription('Jogador Bloqueado, clique em pular a vez');
                    closeConfirmButton();
                } else {
                    if (investigatorCounter > 0) {
                        openSingleDropDown();
                    } else {
                    closeConfirmButton();
                    setCurrentPlayerDescription('Você já consumiu todas suas ações');
                    }
                }
                incrementCounter();
                    break;
            case 'xerife':
                writePlayerInformation();
                playXerifeSound();
                if (blockAction.includes(atualJogador.playerName) || blockAction2.includes(atualJogador.playerName)) {
                    setCurrentPlayerDescription('Jogador Bloqueado, clique em pular a vez');
                    closeConfirmButton();
                } else {
                    openSingleDropDown();
                }
                incrementCounter();
                    break;
            case 'medium':
                writePlayerInformation();
                playMediumSound();
                if (blockAction.includes(atualJogador.playerName) || blockAction2.includes(atualJogador.playerName)) {
                    setCurrentPlayerDescription('Jogador Bloqueado, clique em pular a vez');
                    closeConfirmButton();
                } else {
                    openDeadDropDown();
                }
                incrementCounter();
                    break;
            case 'vigilante':
                writePlayerInformation();
                playVigilanteSound();
                if (blockAction.includes(atualJogador.playerName) || blockAction2.includes(atualJogador.playerName)) {
                    setCurrentPlayerDescription('Jogador Bloqueado, clique em pular a vez');
                    closeConfirmButton();
                } else {
                    openSingleDropDown();
                }
                incrementCounter();
                    break;
            case 'veterano':
                writePlayerInformation();
                playVeteranSound();
                document.querySelector('.veteranCounter').classList.remove('invisible');

                if (blockAction.includes(atualJogador.playerName) || blockAction2.includes(atualJogador.playerName)) {
                    setCurrentPlayerDescription('Jogador Bloqueado, clique em pular a vez');
                    closeConfirmButton();
                } else {
                    if (veteranCounter > 0) {
                        
                    } else {
                        closeConfirmButton();
                        setCurrentPlayerDescription('Você já consumiu todas suas ações');
                        
                    }
                }
                incrementCounter();
                    break;
            case 'padeira':
                writePlayerInformation();
                playPadeiraSound();
                document.querySelector('.padeiraCounter').classList.remove('invisible');
                if (blockAction.includes(atualJogador.playerName) || blockAction2.includes(atualJogador.playerName)) {
                    setCurrentPlayerDescription('Jogador Bloqueado, clique em pular a vez');
                    closeConfirmButton();
                } else {
                    if (padeiraHealCount > 0) {
                        openSingleDropDown();
                        document.querySelector('.padeiraButton').classList.remove('invisible');
                    } else {
                        closeSingleDropDown();
                        setCurrentPlayerDescription('Você não tem curas para usar mais!');
                    }
                }
                incrementCounter();
                break;
            case 'godfather':
                writePlayerInformation();
                writeMafiaInformation();
                playGodfatherSound();
                if (blockAction.includes(atualJogador.playerName) || blockAction2.includes(atualJogador.playerName)) {
                    setCurrentPlayerDescription('Jogador Bloqueado, clique em pular a vez');
                    closeConfirmButton();
                } else {
                    openSingleDropDown();
                }
                if (alivePlayers[controlCounter + 1] === null || alivePlayers[controlCounter + 1].filliation !== 'mafia') {
                EndMafiaNight();
                }
            incrementCounter();
            break;
            case 'conselheira':
                writePlayerInformation();
                writeMafiaInformation();
                playConselheiraSound();
                document.querySelector('.conselheiraCounter').classList.remove('invisible');

                if (blockAction.includes(atualJogador.playerName) || blockAction2.includes(atualJogador.playerName)) {
                    setCurrentPlayerDescription('Jogador Bloqueado, clique em pular a vez');
                    closeConfirmButton();
                } else {
                    if (controlCounter === 0) {
                        updateDoc(doc(database, "playeradmin", "players", user.email, alivePlayers[controlCounter].id), { role: "godfather", wakeOrder: 28 })

                        setCurrentPlayerDescription('Você foi promovido para Godfather!')
                        openSingleDropDown();
                    } else {
                        if (alivePlayers[controlCounter - 1].role !== 'meretriz') {
                            if (conselheiraCounter > 0) {
                                openSingleDropDown();
                            } else {
                                setCurrentPlayerDescription('Você já consumiu todas suas ações');
                                closeConfirmButton();
                            }
                            
                        } else {
                            updateDoc(doc(database, "playeradmin", "players", user.email, alivePlayers[controlCounter].id), { role: "godfather", wakeOrder: 28 })

                            setCurrentPlayerDescription('Você foi promovido para Godfather!')
                            openSingleDropDown();
                        }
                    }
                }
                if (alivePlayers[controlCounter + 1] === null || alivePlayers[controlCounter + 1].filliation !== 'mafia' ) {
                    EndMafiaNight();
                    }
                incrementCounter();
                break;
            case 'vigarista':
                writePlayerInformation();
                writeMafiaInformation();
                playVigaristaSound();
                if (blockAction.includes(atualJogador.playerName) || blockAction2.includes(atualJogador.playerName)) {
                    setCurrentPlayerDescription('Jogador Bloqueado, clique em pular a vez');
                    closeConfirmButton();
                } else {
                    if (controlCounter === 0) {
                        updateDoc(doc(database, "playeradmin", "players", user.email, alivePlayers[controlCounter].id), { role: "godfather", wakeOrder: 28 })

                        setCurrentPlayerDescription('Você foi promovido para Godfather!')
                        openSingleDropDown();
                    } else {
                        if (alivePlayers[controlCounter - 1].role !== 'meretriz') {
                            openSingleDropDown();
                            
                        } else {
                            updateDoc(doc(database, "playeradmin", "players", user.email, alivePlayers[controlCounter].id), { role: "godfather", wakeOrder: 28 })

                            setCurrentPlayerDescription('Você foi promovido para Godfather!')
                            openSingleDropDown();
                        }
                    }
                }
                if (alivePlayers[controlCounter + 1] === null || alivePlayers[controlCounter + 1].filliation !== 'mafia' ) {
                    EndMafiaNight();
                }
                incrementCounter();
                    break;
            case 'zelador':
                writePlayerInformation();
                writeMafiaInformation();
                document.querySelector('.zeladorCounter').classList.remove('invisible');

                playZeladorSound();
                if (blockAction.includes(atualJogador.playerName) || blockAction2.includes(atualJogador.playerName)) {
                    setCurrentPlayerDescription('Jogador Bloqueado, clique em pular a vez');
                    closeConfirmButton();
                }
                if (controlCounter === 0) {
                    updateDoc(doc(database, "playeradmin", "players", user.email, alivePlayers[controlCounter].id), { role: "godfather", wakeOrder: 28 })

                    setCurrentPlayerDescription('Você foi promovido para Godfather!')
                    openSingleDropDown();
                } else {
                    if (alivePlayers[controlCounter - 1].role !== 'meretriz') {
                        if (zeladorCounter) {
                            
                        } else {
                            closeConfirmButton();
                            setCurrentPlayerDescription('Você já consumiu todas suas ações');
                        }
                    } else {
                        updateDoc(doc(database, "playeradmin", "players", user.email, alivePlayers[controlCounter].id), { role: "godfather", wakeOrder: 28 })

                        setCurrentPlayerDescription('Você foi promovido para Godfather!')
                        openSingleDropDown();
                    }
                }
                if (alivePlayers[controlCounter + 1] === null || alivePlayers[controlCounter + 1].filliation !== 'mafia' ) {
                    EndMafiaNight();
                }
                incrementCounter();
                break;
            case 'afilhado':
                writePlayerInformation();
                writeMafiaInformation();
                playAfilhadoSound();
                if (blockAction.includes(atualJogador.playerName) || blockAction2.includes(atualJogador.playerName)) {
                    setCurrentPlayerDescription('Jogador Bloqueado, clique em pular a vez');
                    closeConfirmButton();
                } else {
                    if (controlCounter === 0) {
                        updateDoc(doc(database, "playeradmin", "players", user.email , alivePlayers[controlCounter].id), {role: "godfather", wakeOrder: 28})

                        setCurrentPlayerDescription('Você foi promovido para Godfather!')
                        openSingleDropDown();
                    } else {
                        if (alivePlayers[controlCounter - 1].role !== "godfather") {
                        updateDoc(doc(database, "playeradmin", "players", user.email , alivePlayers[controlCounter].id), {role: "godfather"})
                        setCurrentPlayerDescription('Você foi promovido para Godfather!')
                        openSingleDropDown();
                        } else {
                        setCurrentPlayerDescription("Esse jogador não tem habilidade noturna enquanto tiver outro Godfather em jogo.")
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
                if (blockAction.includes(atualJogador.playerName) || blockAction2.includes(atualJogador.playerName)) {
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
                if (blockAction.includes(atualJogador.playerName) || blockAction2.includes(atualJogador.playerName)) {
                    setCurrentPlayerDescription('Jogador Bloqueado, clique em pular a vez');
                    closeConfirmButton();
                } else {
                    openSingleDropDown();

                }
                incrementCounter();
                break;
            case 'medico da peste':
                writePlayerInformation();
                playMedicoDaPesteSound();
                if (blockAction.includes(atualJogador.playerName) || blockAction2.includes(atualJogador.playerName)) {
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
                    playLobisomenSound();
                } else {
                    setCurrentPlayerDescription('Você não precisa acordar durante noites sem lua cheia');
                }
                incrementCounter();
                break;
            case 'arsonista':
                writePlayerInformation();
                playArsonistaSound();
                if (blockAction.includes(atualJogador.playerName) || blockAction2.includes(atualJogador.playerName)) {
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
                if (blockAction.includes(atualJogador.playerName) || blockAction2.includes(atualJogador.playerName)) {
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
                if (currentDayTemp[0].currentDay >= 4) {
                    playFeiticeiraGrimorioSound();
                } else {
                    playFeiticeiraSound();
                };
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
                playAmaldicoadoraSound();
                if (poisonedTarget.length > 0) {
                    let temp = [];
                    for (var i = 0; poisonedTarget.length > i; i++){
                        temp.push({ attacker: alivePlayers[controlCounter].playerName, attackerRole: 'amaldicoadora', target: poisonedTarget[i].playerName })
                    } 

                    setSpecialAttack(...specialAttack, temp);
                    for (let p = 0; p < poisonedTarget.length; p++){
                        const theRef = doc(database, `playeradmin/playerStatuses/${user.email}/poisonTarget/poisonTarget`, poisonedTarget[p].id)
                        deleteDoc(theRef);
                    }
                    const statusPoisoned = inGameStatusAfliction.filter(status => { return status.status === 'amaldiçoado' });
                    
                    for (let p = 0; p < statusPoisoned.length; p++){
                        const theRef = doc(database, `playeradmin/playerStatuses/${user.email}/statusAfliction/statusAfliction`, statusPoisoned[p].id)
                        deleteDoc(theRef);
                    }
                }
                if (blockAction.includes(atualJogador.playerName) || blockAction2.includes(atualJogador.playerName)) {
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
                if (currentDayTemp[0].currentDay === 4) {
                    closeSingleDropDown();
                    setCurrentPlayerDescription('Todos seus parasitas EXPLODEM');
                    playParasitaGrimorioSound();
                    const here = [];
                    for (let index = 0; index < parasiteAction.length; index++){
                        here.push({ attacker: alivePlayers[controlCounter].playerName, attackerRole: 'parasita', target: parasiteAction[index].playerName })
                        const parasiteRef = doc(database, `playeradmin/playerStatuses/${user.email}/parasiteTarget/poisonTarget`, parasiteAction[index].id)
                        deleteDoc(parasiteRef);
                    }
                    setSpecialAttack(...specialAttack, here);
                }
                else {
                    if (currentDayTemp[0].currentDay > 4) {
                    setCurrentPlayerDescription('Você não tem mais habilidade Noturna.');
                        
                    } else {
                        playParasitaSound();
                    if (blockAction.includes(atualJogador.playerName) || blockAction2.includes(atualJogador.playerName)) {
                        setCurrentPlayerDescription('Jogador Bloqueado, clique em pular a vez');
                        closeConfirmButton();
                    }
                    else {
                        openSingleDropDown();
                    }
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
                    playMiragemGrimorioSound();
                    if (blockAction.includes(atualJogador.playerName) || blockAction2.includes(atualJogador.playerName)) {
                        setCurrentPlayerDescription('Jogador Bloqueado, clique em pular a vez');
                        closeConfirmButton();
                        
                    } else {
                        openSingleDropDown();
                    }
                } else {
                closeSingleDropDown();
                }
                if (alivePlayers[controlCounter + 1] === null || alivePlayers[controlCounter + 1].filliation !== 'coven' ) {
                    endCovenNight();
                }
                incrementCounter();
                break;
            case 'fome':
                openSecondAttackDropDown();
                openSingleDropDown();
                writePlayerInformation();
                writeHorsemenInformation();
                if (alivePlayers[controlCounter + 1].filliation !== 'horsemen') {
                    endHorsemenNight();
                }
                incrementCounter();
                break;
            case 'guerra':
                writePlayerInformation();
                writeHorsemenInformation();
                    if (blockAction.includes(atualJogador.playerName) || blockAction2.includes(atualJogador.playerName)) {
                        setCurrentPlayerDescription('Jogador Bloqueado, clique em pular a vez');
                        closeConfirmButton();
                    } else {
                        openSecondAttackDropDown();
                        openSingleDropDown();
                    }
                if (alivePlayers[controlCounter + 1].filliation !== 'horsemen') {
                    endHorsemenNight();
                }
                incrementCounter();
                break;
            case 'morte':
                writePlayerInformation();
                writeHorsemenInformation();
                    if (blockAction.includes(atualJogador.playerName) || blockAction2.includes(atualJogador.playerName)) {
                        setCurrentPlayerDescription('Jogador Bloqueado, clique em pular a vez');
                        closeConfirmButton();
                    } else {
                        openSingleDropDown();
                    }
                if (alivePlayers[controlCounter + 1].filliation !== 'horsemen') {
                    endHorsemenNight();
                }
                incrementCounter();
                break;
            case 'peste':
                writePlayerInformation();
                writeHorsemenInformation();
                if (alivePlayers[controlCounter + 1].filliation !== 'horsemen') {
                    endHorsemenNight();
                }
                incrementCounter();
                break;
            default:
                writePlayerInformation();
                setCurrentPlayerDescription('Esse personagem não acorda a noite, clique em confirmar');
                incrementCounter();
                closeSingleDropDown();

        }
        return;
    } 
    setCurrentPlayerTitle('Noite encerrada')
        setCurrentPlayerDescription('Clique em Encerrar Noite!')
        
    closeConfirmButton();
    return;    
    }
    const confirmAction = async () => {
        switch (alivePlayers[controlCounter - 1].role) {
            case 'meretriz':
                setBlockAction([...blockAction, player]);
                blockAction2 = [player];
                setVisitAction([...visitAction, { visitor: alivePlayers[controlCounter - 1].playerName, target: player }]);
                closeSingleDropDown();
                break;
            case 'executor':

                if (currentDayTemp[0].currentDay === 1) {
                    setExecutorAction([{ target: player }]);
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
                if (weaponCreateAction[0].weaponChoice === 'none') {
                    setWeapon(weapon);
                    updateDoc(doc(database, "playeradmin", "playerStatuses", user.email, "weaponChoice", "weaponChoice", "weaponChoice"), { weapon: weapon });

                    document.querySelector('.weaponDropDownAction').classList.add('invisible');
                } 
                if (weaponCreateAction[0].weaponChoice === 'espada') {
                    setAttackAction([...attackAction, { attacker: alivePlayers[controlCounter - 1].playerName, attackerRole: alivePlayers[controlCounter - 1].role, target: player }]);
                    setVisitAction([...visitAction, { visitor: alivePlayers[controlCounter - 1].playerName, target: player }]);
                    updateDoc(doc(database, "playeradmin", "playerStatuses", user.email, "weaponChoice", "weaponChoice", "weaponChoice"), { weapon: "none" });

                    setWeaponCreateAction('');
                }
                if (weaponCreateAction[0].weaponChoice === 'escudo') {
                        setferreiroProtectAction(alivePlayers[controlCounter - 1].playerName);
                    setWeaponCreateAction('');
                    updateDoc(doc(database, "playeradmin", "playerStatuses", user.email, "weaponChoice", "weaponChoice", "weaponChoice"), { weapon: "none" });
                    
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
                writeInvestigativeAction();
                closeSingleDropDown();
                const newCounterValue = investigatorCounter - 1;
                setInvestigatorCounter(newCounterValue)
                await delay(4000)
                setInvestigativeModal(false)
                document.querySelector('.investigatorCounter').classList.add('invisible');

                break;
            case 'xerife':
                setVisitAction([...visitAction, { visitor: alivePlayers[controlCounter - 1].playerName, target: player }]);
                writeInvestigativeAction();
                closeSingleDropDown();
                await delay(4000)
                setInvestigativeModal(false)

                break;
            case 'vigilante':
                setVisitAction([...visitAction, { visitor: alivePlayers[controlCounter - 1].playerName, target: player }]);
                const checktargetfilliation = alivePlayers.filter(aliver => { return aliver.playerName === player });
                if (checktargetfilliation[0].filliation === "town") {
                    setAttackAction([...attackAction, { attacker: alivePlayers[controlCounter - 1].playerName, attackerRole: alivePlayers[controlCounter - 1].role, target: player }, { attacker: alivePlayers[controlCounter - 1].playerName, attackerRole: alivePlayers[controlCounter - 1].role, target: alivePlayers[controlCounter - 1].playerName }]);
                    
                } else {
                    setAttackAction([...attackAction, { attacker: alivePlayers[controlCounter - 1].playerName, attackerRole: alivePlayers[controlCounter - 1].role, target: player }]);
                }
                closeSingleDropDown();
                break;
            case 'medium':
                closeDeadDropDown();
                break;
            case 'veterano':
                setAlertAction(alivePlayers[controlCounter - 1].playerName);
                var newVetCounter = veteranCounter - 1;
                setVeteranCounter(newVetCounter);
                document.querySelector('.veteranCounter').classList.add('invisible');

                break;
            case 'godfather':
                setVisitAction([...visitAction, { visitor: alivePlayers[controlCounter - 1].playerName, target: player }]);
                setAttackAction([...attackAction, { attacker: alivePlayers[controlCounter - 1].playerName, attackerRole: alivePlayers[controlCounter - 1].role, target: player }]);
                closeSingleDropDown();
                RemoveMultipleCharInfo()
                break;
            case 'afilhado':
                console.log(controlCounter);
                if (controlCounter === 1) {
                    setVisitAction([...visitAction, { visitor: alivePlayers[controlCounter - 1].playerName, target: player }]);
                    setAttackAction([...attackAction, { attacker: alivePlayers[controlCounter - 1].playerName, attackerRole: alivePlayers[controlCounter - 1].role, target: player }]);
                    closeSingleDropDown();
                    RemoveMultipleCharInfo()
                    
                } else {
                    if (alivePlayers[controlCounter - 2].role !== "godfather") {
                        setVisitAction([...visitAction, { visitor: alivePlayers[controlCounter - 1].playerName, target: player }]);
                        setAttackAction([...attackAction, { attacker: alivePlayers[controlCounter - 1].playerName, attackerRole: alivePlayers[controlCounter - 1].role, target: player }]);
                        closeSingleDropDown();
                        RemoveMultipleCharInfo()
                    }                 
                }
                closeSingleDropDown();
                RemoveMultipleCharInfo()
                break;
            case 'conselheira':
                writeInvestigativeAction();
                setVisitAction([...visitAction, { visitor: alivePlayers[controlCounter - 1].playerName, target: player }]);
                closeSingleDropDown();
                RemoveMultipleCharInfo()
                const newConsCounter = conselheiraCounter - 1;
                setConselheiraCounter(newConsCounter)
                await delay(4000)
                setInvestigativeModal(false)
                document.querySelector('.conselheiraCounter').classList.add('invisible');
                

                break;
            case 'vigarista':
                setVisitAction([...visitAction, { visitor: alivePlayers[controlCounter - 1].playerName, target: player }]);
                setBlackMailAction(player);
                closeSingleDropDown();
                RemoveMultipleCharInfo()
                break;
            case 'zelador':
                const mafiaTarget = attackAction.filter(attacker => attacker.attackerRole === 'godfather');
                if (mafiaTarget.length > 0){
                setVisitAction([...visitAction, { visitor: alivePlayers[controlCounter - 1].playerName, target: mafiaTarget[0].target }]);
                    setCleanUpAction(mafiaTarget[0].target)
                    const newZelCounter = zeladorCounter - 1;
                    setZeladorCounter(newZelCounter)
                    
                }
                closeSingleDropDown();
                RemoveMultipleCharInfo()
                document.querySelector('.zeladorCounter').classList.add('invisible');
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
                if (currentDayTemp[0].currentDay % 2 === 0) {
                    setAttackAction([...attackAction, { attacker: alivePlayers[controlCounter - 1].playerName, attackerRole: alivePlayers[controlCounter - 1].role, target: player }]);
                    setVisitAction([...visitAction, { visitor: alivePlayers[controlCounter - 1].playerName, target: player }]);
                    setWerewolfAlert(alivePlayers[controlCounter - 1].playerName);

                } else {
                    
                }
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

                RemoveMultipleCharInfo()

                break
            case 'amaldicoadora':
                if (currentDayTemp[0].currentDay >= 4) {
                    const pois = [{ target: player }, { target: player2 }]
                    setNewPoisonedTarget(pois)
                    setVisitAction([...visitAction, { visitor: alivePlayers[controlCounter - 1].playerName, target: player }, { visitor: alivePlayers[controlCounter - 1].playerName, target: player2 }]);
                } else {
                    const pois = [{ target: player }];
                    setNewPoisonedTarget(pois);
                    setVisitAction([...visitAction, { visitor: alivePlayers[controlCounter - 1].playerName, target: player }]);
                }
                RemoveMultipleCharInfo()
                closeSecondAttackDropDown();
                break;
            case 'parasita':
                if (currentDayTemp[0].currentDay >= 4) {

                } else {
                    setNewParasiteAction([{ playerName: player }]);
                    setVisitAction([...visitAction, { visitor: alivePlayers[controlCounter - 1].playerName, target: player }]);
                }
                RemoveMultipleCharInfo()
                break;
            case 'miragem':
                if (currentDayTemp[0].currentDay >= 4) {
                    setBlockAction([...blockAction, player]);
                    blockAction2 = [player];
                    setVisitAction([...visitAction, { visitor: alivePlayers[controlCounter - 1].playerName, target: player }]);
                }
                closeSingleDropDown();
                RemoveMultipleCharInfo()

                break;
            case 'fome':
                setBlockAction([...blockAction, player, player2]);
                blockAction2 = [player];
                setVisitAction([...visitAction, { visitor: alivePlayers[controlCounter - 1].playerName, target: player }, { visitor: alivePlayers[controlCounter - 1].playerName, target: player2 } ]);
                closeSingleDropDown();
                RemoveMultipleCharInfo()
                closeSecondAttackDropDown();
                break;
            case 'guerra':
                setFalsefyInvestigativeAction([player, player2]);
                setVisitAction([...visitAction, { visitor: alivePlayers[controlCounter - 1].playerName, target: player }, { visitor: alivePlayers[controlCounter - 1].playerName, target: player2 }]);
                closeSingleDropDown();
                RemoveMultipleCharInfo()
                closeSecondAttackDropDown();
                break;
            case 'morte':
                setVisitAction([...visitAction, { visitor: alivePlayers[controlCounter - 1].playerName, target: player }]);
                setAttackAction([...attackAction, { attacker: alivePlayers[controlCounter - 1].playerName, attackerRole: alivePlayers[controlCounter - 1].role, target: player }]);
                closeSingleDropDown();
                RemoveMultipleCharInfo()
                break;
            case 'peste':
                closeSingleDropDown();
                RemoveMultipleCharInfo();
                break;
            default:
                closeSingleDropDown();
                closeDeadDropDown();
                closeSecondAttackDropDown();
                document.querySelector('.padeiraButton').classList.add('invisible');
                document.querySelector('.padeiraCounter').classList.add('invisible');
                document.querySelector('.zeladorCounter').classList.add('invisible');
                document.querySelector('.veteranCounter').classList.add('invisible');
                document.querySelector('.conselheiraCounter').classList.add('invisible');
                document.querySelector('.investigatorCounter').classList.add('invisible');
                break;
        }        
        wakeUpPlayers();
    }
    const skipAction = () => {
        closeSingleDropDown();
        closeDeadDropDown();
        RemoveMultipleCharInfo()
        document.querySelector('.weaponDropDownAction').classList.add('invisible');
        document.querySelector('.padeiraButton').classList.add('invisible');
        document.querySelector('.padeiraCounter').classList.add('invisible');
        document.querySelector('.zeladorCounter').classList.add('invisible');
        document.querySelector('.veteranCounter').classList.add('invisible');
        document.querySelector('.conselheiraCounter').classList.add('invisible');
        document.querySelector('.investigatorCounter').classList.add('invisible');
        document.querySelector('.arsonistaButton').classList.add('invisible');
        closeSecondAttackDropDown();
        wakeUpPlayers();
    }
    const playNightSounds = () => {
        const num = Math.random();
        setTimeout(() => {


        if (num < 0.1 && num > 0.0) {
            playNightSound1();
        } 
        if (num < 0.2 && num > 0.1) {
            playNightSound2();
        }
        if (num < 0.3 && num > 0.2) {
            playNightSound3();
        }
        if (num < 0.4 && num > 0.3) {
            playNightSound4();
        }
        if (num < 0.5 && num > 0.4) {
            playNightSound5();
        }
        if (num < 0.6 && num > 0.5) {
            playNightSound6();
        }
        if (num < 0.7 && num > 0.6) {
            playNightSound7();
        }
        if (num > 0.7) {
            playNightSound8();
            }
        }, 4000)
        const witchesInHere = alivePlayers.filter(witch => { return witch.filliation === 'coven'})
        const wolvesInHere = alivePlayers.filter(wolf => { return wolf.role === 'lobisomen'})
        if (currentDayTemp[0].currentDay % 2 === 0 && wolvesInHere.length > 0) {
            playWerewolfPresentSound();
        }
        if (currentDayTemp[0].currentDay > 3 && witchesInHere.length > 0) {
            setTimeout(() => {
                playGrimorioSound();

            }, 2000);
        }
    }
    const nightPrompt = () => {
        playNightSounds();
        setIsOpen(false);
        console.log(allRoles)
        setPadeiraHealCount(padeiraTemp[0].healCount);
        setInvestigatorCounter(investigadorTemp[0].counter);
        setVeteranCounter(veteranTemp[0].counter);
        setConselheiraCounter(conselheiraTemp[0].counter);
        setZeladorCounter(zeladorTemp[0].counter);
        setCurrentDay(currentDayTemp[0].currentDay)
        if (currentDayTemp[0].currentDay % 2 === 0) {
            setNightImmunity(['arsonista', 'assassino em serie', 'lobisomen', 'sobrevivente', 'morte' ])
            
        } else {
            setNightImmunity(['arsonista', 'assassino em serie', 'sobrevivente', 'morte' ])
            
        }

    }
    const acordarJogadores = () => {
        document.querySelector(".startbutton").classList.add('invisible')
        document.querySelector(".skipButton").classList.remove('invisible')
        document.querySelector(".confirmButton").classList.remove('invisible')
        wakeUpPlayers();
    } 
    return (

        <div className="night">
            <h3 className="page-title">
                Noite {currentDay}
            </h3>
            <div className="nightMain">
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
                <div className="event-action event">
                        <h4>
                        Ação Noturna
                        </h4>
                    <div className="huge-container card-border scrollable">
                        <h4 className="specialCases">{multipleCharactersPresent}</h4>
                        <h4 className="playerRole">{currentPlayerTitle} { currentPlayerName }</h4>
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
                            </div>
                            <div className="alivePlayerDropDownAction2 invisible">

                                <select name="alivePlayer" id="alivePlayer" value={player2} onChange={(e) => { setPlayer2(e.target.value) }}>
                                    <option value="" defaultValue disabled hidden>Selecione Aqui</option>
                                    {alivePlayers.map((player) => (
                                        <option key={player.key + '2'}>
                                            {player.playerName}
                                        </option>
                                    ))}
                                </select>
                            </div>
                                <button type="button" className="button padeiraButton invisible" onClick={padeiraAction}>Curar e Proximo</button>
                                <button type="button" className="button arsonistaButton invisible" onClick={ArsonAction}>TACAR FOGO!</button>
                            <div className="padeiraCounter invisible">Quantidade de Curas: {padeiraHealCount}</div>
                            <div className="investigatorCounter invisible">Quantidade de Investigações: {investigatorCounter}</div>
                            <div className="conselheiraCounter invisible">Quantidade de Investigações: {conselheiraCounter}</div>
                            <div className="veteranCounter invisible">Quantidade de Alertas: {veteranCounter}</div>
                            <div className="zeladorCounter invisible">Quantidade de Limpezas: {zeladorCounter}</div>
                            <div className="deadPlayerDropDownAction invisible">
                                <select name="deadPlayer" id="deadPlayer" value={player} onChange={(e) => {setPlayer(e.target.value)}}>
                                    {deadPlayers.map((player) => (
                                        <option key={player.key}>
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
                            <button type="button" className="button startbutton" onClick={acordarJogadores}>Acordar Jogadores</button>
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