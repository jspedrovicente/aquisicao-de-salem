import { setDoc, doc, addDoc, collection, onSnapshot, deleteDoc, updateDoc } from "firebase/firestore";
import { useEffect, useState } from "react";
import { database } from "../../firebaseConnection";
import "./night.css"

const Night = () => {
    const [user, setUser] = useState([]);
    const [players, setPlayers] = useState([]);


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
                        life: doc.data().life
                    })
                })
                setPlayers(list);
            })
                  
        }
        loadPlayers()

    }, [user.email])
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
                        <h4>Role:</h4>
                        <p>Information about the role</p>
                    </div>
                </div>
                <div className="night-right">

                <div className="event-currentplayers event">
                        <h4>
                        Jogadores Vivos
                        </h4>
                        <div className="small-container card-border scrollable">
                            {players.filter(player => player.life.includes("alive")).map((filteredplayer) => (
                            <p key={filteredplayer.key}>
                            { filteredplayer.playerName }
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