import { database } from "../../firebaseConnection";
import { setDoc, doc, addDoc, collection, onSnapshot, deleteDoc, updateDoc, serverTimestamp } from "firebase/firestore";
import { useEffect, useState } from "react";
import Form from "../../components/Forms";
import { Store } from 'react-notifications-component';
import Popup from 'reactjs-popup';
import scrollSVG from "../../assets/svgs/scroll-svg.svg"
import cardSVG from "../../assets/svgs/card-svg.svg"
import loadingEffect from "../../assets/svgs/loading-effect.svg"
import eyeSVG from "../../assets/svgs/eye-svg.svg"
import eyeCloseSVG from "../../assets/svgs/eye-closed-svg.svg"
import questionSVG from "../../assets/svgs/question-svg.svg"

import './style.css';


const PlayerMobile = () => {
    const [playerList, setPlayerList] = useState([]);
    const [user, setUser] = useState([])
    const [players, setPlayers] = useState([]);
    const [alivePlayers, setAlivePlayers] = useState([]);
    const [deadPlayers, setDeadPlayers] = useState([]);
    const [gameState, setGameState] = useState('inicio');
    const [name, setName] = useState('');
    const [registeredPlayerId, setRegisteredPlayerId] = useState('')
    const [townRole, setTownRole] = useState([]);
    const [covenRole, setCovenRole] = useState([]);
    const [horsemenRole, setHorsemenRole] = useState([]);
    const [mafiaRole, setMafiaRole] = useState([]);
    const [neutralRole, setNeutralRole] = useState([]);
    const [allRoles, setAllRoles] = useState([]);
    const [playerCurrentRole, setPlayerCurrentRole] = useState([]);
    const [playerCurrentInformation, setPlayerCurrentInformation] = useState([]);
    const [currentDay, setCurrentDay] = useState(0);
    const [willText, setWillText] = useState('');
    const [target1, setTarget1] = useState('');
    const [target2, setTarget2] = useState('');
    const [weaponChoice, setWeaponChoice] = useState('');
    const [mensagemDeMorto, setMensagemDeMorto] = useState('');
    const [mensagemdoMal, setMensagemdoMal] = useState('');
    const [allMessages, setAllMessages] = useState([])
    const [hiddenPrivateInfo, setHiddenPrivateInfo] = useState(false);
    const [allEvilChat, setHiddenEvilChat] = useState([]);
    const [noActionsNight1, setNoActionsNight1] = useState(['assassino em serie', 'mestre', 'vigilante', 'lobisomen', 'palhaco', 'pistoleiro', 'zelador', 'caloteira', 'veterano'])

    const [willOpen, setWillOpen] = useState(false);
    const [cardOpen, setCardOpen] = useState(false);
    const [questionOpen, setQuestionOpen] = useState(false);
    useEffect(() => {
        const loadPlayers = () => {
            const x = onSnapshot(collection(database, `playeradmin/players/jspedrogarcia@gmail.com`), (snapshot) => {
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
                        newResponse: doc.data().newResponse,
                        doused: doc.data().doused,
                    })
                })
                setPlayers(list);
                setAlivePlayers(list.filter(player => player.life.includes("alive")))
                setDeadPlayers(list.filter(player => player.life.includes("dead")))
            })
        }
        const townSnapshot = onSnapshot(collection(database, "gamedata/roles/town"), (snapshot) => {
            let roles = [];
            snapshot.forEach((doc) => {
                roles.push({
                    filliation: "town",
                    role: doc.data().role,
                    skill: doc.data().skill,
                    special: doc.data().special,
                    wakeOrder: doc.data().wakeOrder,
                    image: doc.data().image,
                    wakeTrigger: doc.data().WakeTrigger
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
                    image: doc.data().image,
                    wakeTrigger: doc.data().WakeTrigger
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
                    image: doc.data().image,
                    wakeTrigger: doc.data().WakeTrigger
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
                    image: doc.data().image,
                    wakeTrigger: doc.data().WakeTrigger
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
                    image: doc.data().image,
                    wakeTrigger: doc.data().WakeTrigger
                })
            })
            setNeutralRole(roles);
            
        })
        const a = onSnapshot(collection(database, `playeradmin/playerStatuses/jspedrogarcia@gmail.com/gameState/gameState`), (snapshot) => {
            let gameState = 'inicio';
            snapshot.forEach((doc) => {
                gameState = (doc.data().gameState)
            })
            setGameState(gameState);
        })
        loadPlayers();


    }, [user.email]);
    // Load all the Roles
    useEffect(() => {
        function addAllRoles(townRole, mafiaRole, covenRole, horsemenRole, neutralRole) {
            setAllRoles([...townRole, ...mafiaRole, ...covenRole, ...horsemenRole, ...neutralRole])
           
        }
        addAllRoles(covenRole, mafiaRole, townRole, horsemenRole, neutralRole);

    }, [covenRole])
    useEffect(() => {
            const a = onSnapshot(collection(database, `playeradmin/players/jspedrogarcia@gmail.com`), (snapshot) => {
                let playerInfo = [];
                snapshot.forEach((doc) => {
                    if (doc.id === registeredPlayerId) {
                        playerInfo.push({
                            id: doc.id,
                            key: doc.id,
                            playerName: doc.data().playerName,
                            victoryPoints: doc.data().victoryPoints,
                            role: doc.data().role,
                            filliation: doc.data().filliation,
                            image: doc.data().image,
                            willText: doc.data().willText,
                            action: doc.data().action,
                            newResponse: doc.data().newResponse,
                            wakeOrder: doc.data().wakeOrder,
                            buff: doc.data().buff,
                            debuff: doc.data().debuff,
                            clownBomb: doc.data().clownBomb,
                            pistoleiroMark: doc.data().pistoleiroMark,
                            doused: doc.data().doused,
                            executorTarget: doc.data().executorTarget,
                            life: doc.data().life,
                            actionforRoleCounter: doc.data().actionforRoleCounter,
                            
                        })
                        if (playerInfo[0].role !== 'none') {
                            const chosenRole = allRoles.filter((role) => role.role === playerInfo[0].role)
                            setPlayerCurrentRole(chosenRole);
                            console.log(chosenRole)
                            setWillText(playerInfo[0].willText);
                    }
                    }
                })
                setPlayerCurrentInformation(playerInfo);
                console.log(playerInfo)
            })
        
            const dayCounterSnapshot = onSnapshot(collection(database, `playeradmin/playerStatuses/jspedrogarcia@gmail.com/dayCounter/dayCounter`), (snapshot) => {
                let currentDayx = [];
                snapshot.forEach((doc) => {
                    currentDayx = ({ currentDay: doc.data().currentDay })
                })
                setCurrentDay(currentDayx.currentDay)
            })
        
        const mesagesSnapshot = onSnapshot(collection(database, `playeradmin/chatsLog/jspedrogarcia@gmail.com`),
            (snapshot) => {
                let currentMessages = [];
                snapshot.forEach((doc) => {
                    currentMessages.push({autor: doc.data().autor, message: doc.data().mensagem, horario: doc.data().horario})
                })
                const sortedMessages = currentMessages.sort((a, b) => a.horario - b.horario)
                setAllMessages(sortedMessages)
            })
        const familyMessageSnapshot = onSnapshot(collection(database, `playeradmin/familyChatLog/jspedrogarcia@gmail.com`),
            (snapshot) => {
                let currentMessages = [];
                snapshot.forEach((doc) => {
                    currentMessages.push({autor: doc.data().autor, message: doc.data().mensagem, horario: doc.data().horario})
                })
                const sortedMessages = currentMessages.sort((a, b) => a.horario - b.horario)
                setHiddenEvilChat(sortedMessages)
            })
        }, [registeredPlayerId])
    

        function findmyCookies() {
            let name = "playerID=";
            let decodedCookie = decodeURIComponent(document.cookie);
            let ca = decodedCookie.split(';');
            console.log(ca);
            for(let i = 0; i <ca.length; i++) {
              let c = ca[i];
              while (c.charAt(0) === ' ') {
                c = c.substring(1);
                }
                console.log(c.indexOf(name))
                if (c.indexOf(name) === 0) {
                    const myAcc = players.filter((player) => player.id === c.substring(name.length, c.length))
                    console.log(myAcc);
                    if (myAcc.length > 0) {
                        setPlayerCurrentInformation(myAcc[0]);
                        setRegisteredPlayerId(c.substring(name.length, c.length))
                        return;
                    } else {
                        Store.addNotification({
                            title: "Conta NÃO Encontrada",
                            message: "Recomendo que faça o cadastro novamente!",
                            type: "warning",
                            insert: "top",
                            container: "top-right",
                            animationIn: ["animate__animated", "animate__fadeIn"],
                            animationOut: ["animate__animated", "animate__fadeOut"],
                            dismiss: {
                              duration: 5000,
                              onScreen: true
                            }
                        })
                    }
                }

            }
            return "";
        }
        
        function handlePlayerSignUp(event) {
            event.preventDefault()
            const ref = collection(database, `playeradmin/players/jspedrogarcia@gmail.com`)
            const fixedName = name.replace(/ /g, '')
            addDoc(ref, {
                playerName: fixedName,
                victoryPoints: 0,
                role: "none",
                filliation: "none",
                life: "none",
                image: "none",
                willText: "none",
                action: "pending",
                newResponse: '',
                buff: '',
                debuff: '',
                clownBomb: false,
                pistoleiroMark: false,
                doused: false,
                executorTarget: false,
            }) 
            .then(function (docRef) {
                    setRegisteredPlayerId(docRef.id);
                    document.cookie = "playerID = " + docRef.id;
                    console.log(document.cookie);
            })
            .then(() => {
                        Store.addNotification({
                            title: "Cadastro feito com Sucesso",
                            message: "Agora só aguardar futuras instruções.",
                            type: "success",
                            insert: "top",
                            container: "top-right",
                            animationIn: ["animate__animated", "animate__fadeIn"],
                            animationOut: ["animate__animated", "animate__fadeOut"],
                            dismiss: {
                              duration: 5000,
                              onScreen: true
                            }
                        })
            })
    }
    
    const handleWillSave = () => {
        updateDoc(doc(database, "playeradmin", "players", "jspedrogarcia@gmail.com", registeredPlayerId), { willText: willText})
        .then(() => {
            Store.addNotification({
                message: "Testamento Salvo com sucesso",
                type: "success",
                insert: "top",
                container: "top-center",
                animationIn: ["animate__animated", "animate__fadeIn"],
                animationOut: ["animate__animated", "animate__fadeOut"],
                dismiss: {
                  duration: 3000,
                  onScreen: true
                }
            })
        setWillOpen(false);
})
    }
    const handleFerreiroWeapon = () => {
    }
    const handlePadeiraSave = () => {
        const playersInGame = alivePlayers;
        const targetRole = playersInGame.filter((player) => player.playerName === target1);
        const ref = collection(database, `playeradmin/playerStatuses/jspedrogarcia@gmail.com/mobilePlayerActions/mobilePlayerActionsSingle`)
        addDoc(ref, {
            user: playerCurrentInformation[0].playerName,
            userID: playerCurrentInformation[0].id,
            userRole: playerCurrentInformation[0].role,
            target: target1,
            targetRole: targetRole[0].role,
            wakeOrder: playerCurrentInformation[0].wakeOrder
        })
        updateDoc((doc(database, "playeradmin", "players", "jspedrogarcia@gmail.com", playerCurrentInformation[0].id)), { actionforRoleCounter: playerCurrentInformation[0].actionforRoleCounter - 1 });
    }
    const piromaniacoFire = () => {
        // I gotta think of how I am handling this.
        const ref = collection(database, `playeradmin/playerStatuses/jspedrogarcia@gmail.com/mobilePlayerActions/mobilePlayerActionsSingle`)
        addDoc(ref, {
            user: playerCurrentInformation[0].playerName,
            userID: playerCurrentInformation[0].id,
            userRole: playerCurrentInformation[0].role,
            target: playerCurrentInformation[0].playerName,
            targetRole: playerCurrentInformation[0].role,
            wakeOrder: playerCurrentInformation[0].wakeOrder,
            targetId: playerCurrentInformation[0].id
        })    
        updateDoc(doc(database, "playeradmin", "players", "jspedrogarcia@gmail.com", registeredPlayerId), { action: "complete" } )
    }
    const handleActionSave = () => {
        if (playerCurrentRole[0].wakeTrigger === 6) {
            if (currentDay % 2 === 1) {
                
                updateDoc(doc(database, "playeradmin", "players", "jspedrogarcia@gmail.com", registeredPlayerId), { action: "complete" })
            } else {
            const targetRole = alivePlayers.filter((player) => player.playerName === target1);
            const ref = collection(database, `playeradmin/playerStatuses/jspedrogarcia@gmail.com/mobilePlayerActions/mobilePlayerActionsSingle`)
            addDoc(ref, {
                user: playerCurrentInformation[0].playerName,
                userID: playerCurrentInformation[0].id,
                userRole: playerCurrentInformation[0].role,
                target: target1,
                targetRole: targetRole[0].role,
                wakeOrder: playerCurrentInformation[0].wakeOrder,
                targetId: targetRole[0].id
            })
                updateDoc(doc(database, "playeradmin", "players", "jspedrogarcia@gmail.com", registeredPlayerId), { action: "complete" })
            }
        }
        if (playerCurrentRole[0].role === 'padeira') { 
            updateDoc(doc(database, "playeradmin", "players", "jspedrogarcia@gmail.com", registeredPlayerId), { action: "complete" } )
        } else if (playerCurrentRole[0].role === 'executor') {
            
            if (playerCurrentInformation[0].actionforRoleCounter < 1) {
                updateDoc(doc(database, "playeradmin", "players", "jspedrogarcia@gmail.com", registeredPlayerId), { action: "complete" } )
            } else {
                const playersInGame = alivePlayers;
                const targetRole = playersInGame.filter((player) => player.playerName === target1);
                const ref = collection(database, `playeradmin/playerStatuses/jspedrogarcia@gmail.com/mobilePlayerActions/mobilePlayerActionsSingle`)
                addDoc(ref, {
                    user: playerCurrentInformation[0].playerName,
                    userID: playerCurrentInformation[0].id,
                    userRole: playerCurrentInformation[0].role,
                    target: target1,
                    targetRole: targetRole[0].role,
                    wakeOrder: playerCurrentInformation[0].wakeOrder,
                    targetId: targetRole[0].id
                })
                updateDoc(doc(database, "playeradmin", "players", "jspedrogarcia@gmail.com", registeredPlayerId), { action: "complete" })
                updateDoc((doc(database, "playeradmin", "players", "jspedrogarcia@gmail.com", playerCurrentInformation[0].id)), { actionforRoleCounter: playerCurrentInformation[0].actionforRoleCounter - 1 });
            }
        } else {
            if ((playerCurrentRole[0].wakeTrigger === 1 && playerCurrentInformation[0].actionforRoleCounter > 0) ||(playerCurrentRole[0].wakeTrigger === 1 && playerCurrentInformation[0].actionforRoleCounter === null)) {
                const targetRole = alivePlayers.filter((player) => player.playerName === target1);
            const ref = collection(database, `playeradmin/playerStatuses/jspedrogarcia@gmail.com/mobilePlayerActions/mobilePlayerActionsSingle`)
            addDoc(ref, {
                user: playerCurrentInformation[0].playerName,
                userID: playerCurrentInformation[0].id,
                userRole: playerCurrentInformation[0].role,
                target: target1,
                targetRole: targetRole[0].role,
                wakeOrder: playerCurrentInformation[0].wakeOrder,
                targetId: targetRole[0].id
            })
                updateDoc(doc(database, "playeradmin", "players", "jspedrogarcia@gmail.com", registeredPlayerId), { action: "complete" })
                
            } else if (playerCurrentRole[0].wakeTrigger === 4 && playerCurrentInformation[0].actionforRoleCounter > 0) {
                const ref = collection(database, `playeradmin/playerStatuses/jspedrogarcia@gmail.com/mobilePlayerActions/mobilePlayerActionsSingle`)
                
            addDoc(ref, {
                user: playerCurrentInformation[0].playerName,
                userID: playerCurrentInformation[0].id,
                userRole: playerCurrentInformation[0].role,
                target: playerCurrentInformation[0].playerName,
                targetRole: playerCurrentInformation[0].role,
                wakeOrder: playerCurrentInformation[0].wakeOrder,
                targetId: playerCurrentInformation[0].id
            })    
            updateDoc(doc(database, "playeradmin", "players", "jspedrogarcia@gmail.com", registeredPlayerId), { action: "complete" } )
            
        } else {
        if (playerCurrentInformation[0].actionforRoleCounter === 0) {
                    updateDoc(doc(database, "playeradmin", "players", "jspedrogarcia@gmail.com", registeredPlayerId), { action: "complete" } )
                }    
                if (playerCurrentRole[0].wakeTrigger === 2) {
                    const playersInGame = alivePlayers;
                    const targetRole = playersInGame.filter((player) => player.playerName === target1);
                    const ref = collection(database, `playeradmin/playerStatuses/jspedrogarcia@gmail.com/mobilePlayerActions/mobilePlayerActionsSingle`)
                    addDoc(ref, {
                        user: playerCurrentInformation[0].playerName,
                        userID: playerCurrentInformation[0].id,
                        userRole: playerCurrentInformation[0].role,
                        target: target1,
                        targetRole: targetRole[0].role,
                        wakeOrder: playerCurrentInformation[0].wakeOrder,
                        targetId: targetRole[0].id
                    })
                    const targetRole2 = playersInGame.filter((player) => player.playerName === target1);
                    addDoc(ref, {
                        user: playerCurrentInformation[0].playerName,
                        userID: playerCurrentInformation[0].id,
                        userRole: playerCurrentInformation[0].role,
                        target: target2,
                        targetRole: targetRole2[0].role,
                        wakeOrder: playerCurrentInformation[0].wakeOrder,
                        targetId: targetRole2[0].id
                    })
                        updateDoc(doc(database, "playeradmin", "players", "jspedrogarcia@gmail.com", registeredPlayerId), { action: "complete" })
          }      
        }
        }
        // This triggers for players that have limited roles except for Executor and Padeira that do something else.
        if ((playerCurrentRole[0].role === 'investigador' && playerCurrentInformation[0].actionforRoleCounter > 0) || (playerCurrentRole[0].role === 'zelador' && playerCurrentInformation[0].actionforRoleCounter > 0) || (playerCurrentRole[0].role === 'matriarca' && playerCurrentInformation[0].actionforRoleCounter > 0) || (playerCurrentRole[0].role === 'veterano' && playerCurrentInformation[0].actionforRoleCounter > 0) || (playerCurrentRole[0].role === 'caloteira' && playerCurrentInformation[0].actionforRoleCounter > 0) ) {
            updateDoc((doc(database, "playeradmin", "players", "jspedrogarcia@gmail.com", playerCurrentInformation[0].id)), { actionforRoleCounter: playerCurrentInformation[0].actionforRoleCounter - 1 });
        }
        if (playerCurrentRole[0].wakeTrigger === 0) {
            updateDoc(doc(database, "playeradmin", "players", "jspedrogarcia@gmail.com", registeredPlayerId), { action: "complete" })
        }
        setTarget1('');
        setTarget2('');
    }
    const enviarMensagemDeMorto = () => {
        addDoc(collection(database, `playeradmin/chatsLog/jspedrogarcia@gmail.com`), {
            autor: playerCurrentInformation[0].playerName,
            autorRole: playerCurrentInformation[0].role,
            mensagem: mensagemDeMorto,
            horario: serverTimestamp()
        })
        setMensagemDeMorto('');
    }

    const sendEvilMessage = () => {
        addDoc(collection(database, `playeradmin/familyChatLog/jspedrogarcia@gmail.com`), {
            autor: playerCurrentInformation[0].playerName,
            autorRole: playerCurrentInformation[0].role,
            mensagem: mensagemdoMal,
            horario: serverTimestamp()
        })
        setMensagemdoMal('');
    }
    const handleSkipTurn = () => {
        // Make it so the pending turns into completed
        updateDoc(doc(database, "playeradmin", "players", "jspedrogarcia@gmail.com", registeredPlayerId), { action: "complete" } )
    }
    return (
        <div >
            <div className="mainMobilePage">
            {registeredPlayerId === '' ? (
                <>
                <div className="signUp">
            <h3>
                Digite seu nome abaixo!
            </h3>
            <form onSubmit={handlePlayerSignUp} className="form">
                                <Form type="text" label="Nome:" state={name} changeState={setName}> </Form>
                                <p>Aguarde um aviso prévio do Administrador para Cadastrar seu nome!</p>
                                <button type="submit" className="button">Cadastrar</button>
            </form>
                                <button className="button" onClick={findmyCookies}>Já Cadastrei!</button>
            </div>
            </>
            )
            :
            gameState === 'inicio' ?
            (
            <div className="waitingForMatch">
                                Aguardando inicio da partida!
                                <div className="loading">
                                <img src={loadingEffect}></img>
                                </div>
            </div>
            ) :
            gameState === 'entregueCartas' ? (
                            <div className="cardDelivered">
                                Bem-vindo ao jogo
                            
                            {playerCurrentInformation.length > 0 ? (
                                <div>
                                    {playerCurrentInformation[0].playerName} - {playerCurrentInformation[0].role }
                                </div>
                                ) : (null)}
                                <div className="interactiveButtons">
                                    <button className="intButton" onClick={() => setCardOpen(true)}><img src={cardSVG}></img></button>
                                </div>

            </div>
            ) :
            gameState === 'dia' && playerCurrentRole.length > 0 ? (
                                <div>
                                    <h2 className="header">Dia {currentDay} </h2>
                                    <div className="interactiveButtons">
                                    <button className="intButton" onClick={() => setHiddenPrivateInfo(hiddenPrivateInfo => !hiddenPrivateInfo)}><img src={hiddenPrivateInfo? eyeCloseSVG : eyeSVG}></img></button>
                                    <button className="intButton" onClick={() => setCardOpen(true)}><img src={cardSVG}></img></button>
                                        <button className="intButton" onClick={() => setWillOpen(true)}><img src={scrollSVG}></img></button>
                                    <button className="intButton" onClick={() => setQuestionOpen(true)}><img src={questionSVG}></img></button>
                                    </div>
                                    <div className="playerNoticeBox">
                                        <div>Informações Importantes</div>
                                        <div className="playerNotice">
                                            {playerCurrentInformation[0].life === 'dead' ? (
                                                <div>VOCÊ ESTÁ MORTO</div>
                                            ) : (<>
                                        {playerCurrentInformation[0].newResponse ? (
                                            <div>Informativo: {playerCurrentInformation[0].newResponse}</div>
                                            ) : (<div>Informativo: Não há informativos por agora.</div>)}
                                        {playerCurrentInformation[0].debuff ? (
                                            <div>Efeito Negativo: {playerCurrentInformation[0].debuff}</div>
                                            ) : (null)}
                                        {playerCurrentInformation[0].buff ? (
                                            <div>Efeito Positivo: {playerCurrentInformation[0].buff}</div>
                                            ) : (null)}
                                            </>)}
                                            </div>
                                    </div>
                                    <div className="playerInfoBox">
                                        <div>Suas Informações</div>
                                        <div className="playerInfo fadeMe" hidden={hiddenPrivateInfo}>
                                        <p>
                                            Nome: {playerCurrentInformation[0].playerName}
                                        </p>
                                        <p>
                                            Filliação: {playerCurrentInformation[0].filliation === 'town' ? 'Cidade' : playerCurrentInformation[0].filliation === 'the family'? 'A Familia' : playerCurrentInformation[0].filliation === 'coven'? 'Coven' : playerCurrentInformation[0].filliation === 'neutral' ? 'Neutro' : playerCurrentInformation[0].filliation === 'horsemen' ? 'Cavaleiros do Apocalipse' : ''  }
                                        </p>
                                        <p>
                                            Função: {playerCurrentInformation[0].role}
                                        </p>
                                        </div>
                                    </div>
                                    

                                    {playerCurrentInformation[0]?.life === 'dead' ? (
                                        <div className="chatMortosBox">
                                            <div className="fadeMe" hidden={hiddenPrivateInfo}>Chat dos Mortos</div>
                                            <div className="chatMortos fadeMe" hidden={hiddenPrivateInfo}>

                                            <div className="chatMortosLog">
                                                {allMessages.map((message) => (
                                                    <div className="chatMortosLogMsg">
                                                        <span>{message.autor}:</span><span>{message.message}</span>
                                                    </div>
                                                ))}
                                                </div>
                                                <div className="chatMortosTextType">
                                            <input type="text" value={mensagemDeMorto} onChange={(e) => setMensagemDeMorto(e.target.value)} />
                                                    <button className="button" onClick={enviarMensagemDeMorto}>Enviar</button>
                                                </div>
                                                    <span>Informativo: O medium pode ler suas mensagens a noite!</span>
                                            </div>
                                        </div>
                                    ) : (null)}

                                    {playerCurrentInformation[0]?.filliation === 'the family' && playerCurrentInformation[0]?.life === "alive" ? (
                                        <div className="mafiaInfoBox">
                                            <div className="fadeMe" hidden={hiddenPrivateInfo}>Centro da Familia</div>
                                            <div className="mafiaInfo fadeMe" hidden={hiddenPrivateInfo}>
                                            {alivePlayers.filter((player) => player.filliation === 'the family').map(player => (
                                                <span>
                                                    <p>{player.playerName} - {player.role}</p>
                                                </span>
                                            ))}    
                                            </div>

                                        </div>
                                    ):(null)}
                                    {playerCurrentInformation[0]?.filliation === 'horsemen' && playerCurrentInformation[0]?.life === "alive" ? (
                                        <div className="mafiaInfoBox">
                                            <div className="fadeMe" hidden={hiddenPrivateInfo}>Centro dos Cavaleiros</div>
                                            <div className="mafiaInfo fadeMe" hidden={hiddenPrivateInfo}>
                                            {alivePlayers.filter((player) => player.filliation === 'horsemen').map(player => (
                                                <span>
                                                    <p>{player.playerName} - {player.role}</p>
                                                </span>
                                            ))}    
                                            </div>

                                        </div>
                                    ):(null)}
                                </div>
            ) : gameState === 'noite' && playerCurrentRole.length > 0 && playerCurrentInformation[0].life === 'alive' ? (
                                    <div>

                                    <div className="header">Noite {currentDay} </div>
                                    <div className="interactiveButtons">
                                    <button className="intButton" onClick={() => setCardOpen(true)}><img src={cardSVG}></img></button>
                                        <button className="intButton" onClick={() => setWillOpen(true)}><img src={scrollSVG}></img></button>
                                    <button className="intButton" onClick={() => setQuestionOpen(true)}><img src={questionSVG}></img></button>
                                    </div>
        
                                        <div className="nightAction">
                                        {playerCurrentInformation[0].playerName} - {playerCurrentInformation[0].role}

                                            {playerCurrentInformation[0]?.actionforRoleCounter !== null && (
                                                <div className="informativoActions">
                                                    Quantidade de ações restantes: {playerCurrentInformation[0]?.actionforRoleCounter}
                                                </div>
                                            )}
                                            {(playerCurrentRole[0].role === 'lobisomen' && currentDay % 2 === 0) || (playerCurrentRole[0].wakeTrigger === 1 && playerCurrentInformation[0].action === "pending" && playerCurrentInformation[0].actionforRoleCounter > 0) || (playerCurrentRole[0].wakeTrigger === 1 && playerCurrentInformation[0].action === "pending" && playerCurrentInformation[0]?.actionforRoleCounter === null) || (playerCurrentInformation[0].action === "pending" && playerCurrentRole[0].wakeTrigger === 2) ? (
                                            
                                                (currentDay === 1 && noActionsNight1.includes(playerCurrentInformation[0].role)) ? (null) : (
                                            
                                                                                        
                                                <div className="actualAction">

                                                    <span>
                                                        Selecione seu Alvo
                                                    </span>
                                                    <select  name="alivePlayerTarget1" id="alivePlayerTarget1" value={target1} onChange={(e) => setTarget1(e.target.value)}>
                                                    <option value="" defaultValue disabled>Selecione Alguém</option>
                                                        {alivePlayers
                                                            .filter((player) => player.playerName !== playerCurrentInformation[0].playerName)
                                                            .map((player) => (
                                                                <option key={player.key}>{player.playerName}</option>
                                                            ))
                                                        }
                                                    </select>
                                            
                                                    </div>
                                                )
                                            ) : (null)}
                                            {playerCurrentRole[0].wakeTrigger === 2 && playerCurrentInformation[0].action === "pending" ? (
                                                <div className="actualAction">
                                                    <span>
                                                        Selecione seu Alvo 2
                                                    </span>
                                                    <select  name="alivePlayerTarget2" id="alivePlayerTarget2" value={target2} onChange={(e) => setTarget2(e.target.value)}>
                                                    <option value="" defaultValue disabled>Selecione</option>
                                                        {alivePlayers
                                                            .filter((player) => player.playerName !== playerCurrentInformation[0].playerName)
                                                            .map((player) => (
                                                                <option key={player.key}>{player.playerName}</option>
                                                            ))
                                                        }
                                                    </select>
                                            
                                                </div>
                                            ) : (null)}
                                            {playerCurrentRole[0].wakeTrigger === 5 && (
                                                <div>

                                                <select name="weaponChoice" id="weaponChoice" value={weaponChoice} onChange={(e) => setWeaponChoice(e.target.value)}>
                                                    <option value="" defaultValue disabled>Selecione</option>
                                                    <option value="espada">Espada</option>
                                                    <option value="escudo">Escudo</option>
                                                    
                                                    </select>
                                                <button className="button" onClick={handleFerreiroWeapon}>Fazer Arma</button>
                                                </div>
                                                
                                            )}
                                            {playerCurrentRole[0].role === 'medium' && (
                                                <div className="chatMortosBox">
                                            <div>Chat dos Mortos</div>
                                            <div className="chatMortos">

                                            <div className="chatMortosLog">
                                                {allMessages.map((message) => (
                                                    <div className="chatMortosLogMsg">
                                                        <span>Jogador:</span><span>{message.message}</span>
                                                    </div>
                                                ))}
                                                </div>
                                            </div>
                                        </div>
                                            )}
                                            {playerCurrentRole[0].role === 'piromaniaco' ? (
                                            <div className="piromaniacoInfoBox">
                                            <div className="fadeMe" hidden={hiddenPrivateInfo}>Centro do Piromaniaco</div>
                                            <div className="piromaniacoInfo fadeMe" hidden={hiddenPrivateInfo}>
                                            {alivePlayers.filter((player) => player.doused === true).map(player => (
                                                <span>
                                                    <p>{player.playerName} está encharcado!</p>
                                                </span>
                                            ))}    
                                            </div>

                                                </div>) : (null)}
                                        {playerCurrentInformation[0]?.filliation === 'the family' && playerCurrentInformation[0]?.life === "alive" ? (
                                        <div className="mafiaInfoBox">
                                            <div className="fadeMe" hidden={hiddenPrivateInfo}>Centro da Familia</div>
                                            <div className="mafiaInfo fadeMe" hidden={hiddenPrivateInfo}>
                                            {alivePlayers.filter((player) => player.filliation === 'the family').map(player => (
                                                <span>
                                                    <p>{player.playerName} - {player.role}</p>
                                                </span>
                                            ))}    
                                            </div>

                                        </div>
                                    ):(null)}
                                    {playerCurrentInformation[0]?.filliation === 'horsemen' && playerCurrentInformation[0]?.life === "alive" ? (
                                        <div className="mafiaInfoBox">
                                            <div className="fadeMe" hidden={hiddenPrivateInfo}>Centro dos Cavaleiros</div>
                                            <div className="mafiaInfo fadeMe" hidden={hiddenPrivateInfo}>
                                            {alivePlayers.filter((player) => player.filliation === 'horsemen').map(player => (
                                                <span>
                                                    <p>{player.playerName} - {player.role}</p>
                                                </span>
                                            ))}    
                                            </div>

                                        </div>
                                            ) : (null)}
                                            {playerCurrentInformation[0].filliation === 'horsemen' || playerCurrentInformation[0].filliation === 'the family' ? (
                                                <div className="evilChatBox">
                                                    <div>Chat Privado</div>
                                                    <div className="evilChatInfo">
                                                        {allEvilChat.map((chat) => (
                                                            <span>
                                                                <p>{chat.autor}: { chat.message }</p>
                                                        </span>
                                                    ))}
                                                    </div>
                                                    <div className="evilChatButtons">
                                                    <input type="text" value={mensagemdoMal } onChange={(e) => setMensagemdoMal(e.target.value)}/>
                                                    <button type="button" className="button" onClick={sendEvilMessage}>Enviar Mensagem</button>
                                                    </div>
                                                </div>
                                    ) : (null)}
                                            {playerCurrentInformation[0].action === "pending" && (
                                                <div>
                                                    {playerCurrentRole[0].role === 'padeira' && playerCurrentInformation[0]?.actionforRoleCounter > 0 && (
                                                    <button className="button" onClick={handlePadeiraSave}>Curar Jogador!</button>
                                                    )}
                                                    {playerCurrentRole[0].role === 'piromaniaco' &&(
                                                    <button className="button" onClick={piromaniacoFire}>Tacar fogo!</button>
                                                    )}

                                                    {(currentDay === 1 && noActionsNight1.includes(playerCurrentInformation[0].role)) || playerCurrentRole[0].wakeTrigger === 0 ? (null) : (

                                                        <button className="button" onClick={handleActionSave}>{playerCurrentRole[0].role === 'padeira' ? 'Encerrar Jogada' : 'Confirmar Ação' }</button>
                                                    )}
                                                    <button className="button" onClick={handleSkipTurn}>{playerCurrentRole[0].wakeTrigger === 0 ? 'Encerrar Noite' : 'Pular Vez'}</button>
                                                </div>
                                            )}
                                            {playerCurrentInformation[0].action === "complete" && (
                                                <div className="completedActionWaiting">
                                                    Aguardando encerramento da noite!
                                                    <div className="loading">
                                                    <img src={loadingEffect}></img>
                                                    </div>
                                                </div>
                                            )}
                                        </div>
            </div>
            ) : ('')
            }
                
            </div>


            {/* The popups */}
            <Popup className="modalMobile" position="center" open={cardOpen} modal closeOnEscape={false} closeOnDocumentClick={false}>
                <div>

                
                    <div className="header"> Sua Carta</div>
                    <div className="cardDetailedInformation">
            {playerCurrentRole.length > 0 ? (
                        <img className="cardImg img-responsive" src={playerCurrentRole[0].image} alt={playerCurrentRole[0].role} /> 
                ) : (<div>Você ainda não possui carta! Só aguardar!</div>)}
                <button className="button" onClick={() => setCardOpen(false)}>Fechar</button>
                    </div>
                    </div>
            </Popup>
            <Popup className="modalMobile" position="center" open={questionOpen} modal closeOnEscape={false} closeOnDocumentClick={false}>
                <div>
                    <div className="header">Ajuda</div>
                    <div className="cardDetailedInformation">
                    <div>O que te ajudará</div>
                <button className="button" onClick={() => setQuestionOpen(false)}>Fechar</button>
                    </div>
                    </div>
            </Popup>
            <Popup position="center">

            </Popup>
            <Popup className="modalMobile"  open={willOpen} modal closeOnEscape={false} closeOnDocumentClick={false}>
                <div className="modal-testatamentcontent">

                    <div className="header"> Seu Testamento</div>
                    <div className="testamentInformation">
                        <p>Informações que você gostaria de lembrar</p>
                        <textarea autoFocus={false} className="testamentTextArea" name="" id="" value={willText} onChange={(e) => setWillText(e.target.value)}></textarea>
                    </div>
                    <div>
                <button className="button" onClick={handleWillSave}>Salvar Testamento</button>
                <button className="button" onClick={() => setWillOpen(false)}>Fechar</button>
                    </div>
                </div>
            </Popup>

    </div>
    )
}

export default PlayerMobile;