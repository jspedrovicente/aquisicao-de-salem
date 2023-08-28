import { database } from "../../firebaseConnection";
import { setDoc, doc, addDoc, collection, onSnapshot, deleteDoc, updateDoc } from "firebase/firestore";
import { useEffect, useState } from "react";
import { Store } from "react-notifications-component";
import './victory.css'




const Victory = () => {
    const [playerList, setPlayerList] = useState([]);
    const [user, setUser] = useState([])
    const [players, setPlayers] = useState([]);
    const [alivePlayers, setAlivePlayers] = useState([]);
    const [deadPlayers, setDeadPlayers] = useState([]);
    const [victorFill, setVictorFill] = useState('');
    const [filiationFill, setFiliationFill] = useState('');
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
            })}
        loadPlayers();
    }, [user.email]);
    const distributePoints = (fill) => {
        if (fill === 'town' || fill === 'mafia' || fill === 'coven' || fill === 'horsemen') {
            
            const victors = players.filter(player => player.filliation === fill)
            for (let i = 0; i < victors.length; i++) {
                updateDoc(doc(database, "playeradmin", "players", user.email, victors[i].id), { victoryPoints: victors[i].victoryPoints + 10 })
            }
            Store.addNotification({
                title: "Sucesso!",
                message: `Todos pertencentes a(o) ${fill} receberam 10 pontos!`,
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
        } else {
            const victor = players.filter(player => player.role === fill)
            updateDoc(doc(database, "playeradmin", "players", user.email, victor[0].id), { victoryPoints: victor[0].victoryPoints + 10 })
            Store.addNotification({
                title: "Sucesso!",
                message: `${victor[0].playerName} recebeu 10 pontos!`,
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
        }
    }

    const resetPoints = () => {
        for (let i = 0; i < players.length; i++){
            updateDoc(doc(database, "playeradmin", "players", user.email, players[i].id), { victoryPoints: 0 })

        }
    }
    const survivalPoints = () => {
        const survivors = players.filter(player => player.life === 'alive');
        for (let i = 0; i < survivors.length; i++) {
            updateDoc(doc(database, "playeradmin", "players", user.email, survivors[i].id), { victoryPoints: survivors[i].victoryPoints + 2 })
        }
        Store.addNotification({
            title: "Sucesso!",
            message: `Pontos entregue com sucesso`,
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
    }
    const filiationPoints = () => {
            for (let i = 0; i < players.length; i++) {
                if (players[i].filliation === 'town') {
                    
                } else if (players[i].filliation === 'mafia') {
                    updateDoc(doc(database, "playeradmin", "players", user.email, players[i].id), { victoryPoints: players[i].victoryPoints + 2 })
                } else if (players[i].filliation === 'coven') {
                    updateDoc(doc(database, "playeradmin", "players", user.email, players[i].id), { victoryPoints: players[i].victoryPoints + 3 })
                }   else if (players[i].filliation === 'horsemen') {
                    updateDoc(doc(database, "playeradmin", "players", user.email, players[i].id), { victoryPoints: players[i].victoryPoints + 2 })
                } else if (players[i].filliation === 'neutral') {
                    if (players[i].role === 'assassino em serie' || players[i].role === 'lobisomen' || players[i].role === 'palhaco' || players[i].role === 'pistoleiro' || players[i].role === 'arsonista') {
                        updateDoc(doc(database, "playeradmin", "players", user.email, players[i].id), { victoryPoints: players[i].victoryPoints + 4 })
                    } else if (players[i].role === 'bobo da corte' || players[i].role === 'executor' || players[i].role === 'medico da peste') {
                        updateDoc(doc(database, "playeradmin", "players", user.email, players[i].id), { victoryPoints: players[i].victoryPoints + 2 })
                    }
                }
            }
            Store.addNotification({
                title: "Sucesso!",
                message: `Pontos entregue com sucesso`,
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
    }
    return (
        <div className="victoryPage" >
                <h2>Página de Pontuação</h2>
            <div className="pointPageMain">

            <div className="small-container bordered">
                <h4>Pontos por Vitôria!</h4>
                <select name="" id="" value={victorFill} onChange={(e) => setVictorFill(e.target.value)}>
                    <option value="" disabled>Selecione</option>
                    <option value="town">Cidade</option>
                    <option value="mafia">Mafia</option>
                    <option value="coven">Coven</option>
                    <option value="horsemen">Cavaleiros</option>
                    <option value="bobo da corte">Bobo da Corte</option>
                    <option value="executor">Executor</option>
                    <option value="arsonista">Arsonista</option>
                    <option value="assassino em serie">Assassino em serie</option>
                    <option value="lobisomen">Lobisomen</option>
                    <option value="medico da peste">Medico da Peste</option>
                    <option value="palhaco">Palhaço</option>
                    <option value="pistoleiro">Pistoleiro</option>
                </select>
                    <button className="button" onClick={() => distributePoints(victorFill)}>Distribuir Pontos!</button>
                    <button className="button" onClick={() => resetPoints()}>RESETAR TODOS Pontos!</button>
            </div>
            <div className="small-container bordered">
                <h4>Pontuações adicionais</h4>
                <button className="button" onClick={() => survivalPoints()}>Sobrevivência!</button>
                <button className="button" onClick={(e) => filiationPoints()}>Filiação!</button>
                
            </div>
            <div>
                        <table>
                            <tr>
                                <th>
                                    Nome
                                </th>
                                <th>
                                    Filiação
                                </th>
                                <th>
                                    Função
                                </th>
                                <th>
                                    Status
                                </th>
                                <th>
                                    Pontuação
                                </th>
                            </tr>
                                
                            {players.map((player) => (
                    
                                    <tr>
                                        <td>
                        {player.playerName}
                                        </td>
                                        <td>
                                        {player.filliation === 'town' ? 'Cidade' : player.filliation === 'mafia' ? 'Mafia' : player.filliation === 'coven' ? 'Coven' : player.filliation === 'horsemen' ? 'Cavaleiros' : ''}
                                        </td>
                                        <td>
                        {player.role}

                                        </td>
                                        <td>
                            {player.life === 'alive' ? 'Vivo' : 'Morto'}

                                        </td>
                                        <td>
                            {player.victoryPoints}

                                        </td>
                        </tr>
                            ))}
                                
                        </table>
                            

                </div>
            </div>
                
        </div>

    )
}

export default Victory;