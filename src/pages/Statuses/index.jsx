import { database } from "../../firebaseConnection";
import { setDoc, doc, addDoc, collection, onSnapshot, deleteDoc, updateDoc } from "firebase/firestore";
import { useEffect, useState } from "react";
import './statuses.css'



const Victory = () => {
    const [playerList, setPlayerList] = useState([]);
    const [user, setUser] = useState([])
    const [players, setPlayers] = useState([]);
    const [alivePlayers, setAlivePlayers] = useState([]);
    const [deadPlayers, setDeadPlayers] = useState([]);
    const [blackout, setBlackout] = useState([{ fact: 'true' }]);
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
        }
        const a = onSnapshot(collection(database, `playeradmin/blackout/${user.email}`), (snapshot) => {
            let blk = [];
            snapshot.forEach((doc) => {
                blk.push({fact: doc.data().blackout })
            })
            console.log(blk);
            setBlackout(blk);
        })
        loadPlayers();

    }, [user.email]);
    return (
        
        <div >
            {blackout[0].fact === 'true' ?
                (
                <span className="HUGE">Revelado após os anúncios</span>
                ) : blackout[0].fact === 'false' ?
                    (
                        <div className="main">
                    <div>
                                <div className="rowinStatus">

                {alivePlayers.map((player) => (
                    <span className="statusnoted">{player.playerName }</span>
                    ))}
                    </div>
            </div>
                            </div>
                    ) : (<span className="HUGE">Cidadãos de Salem DORMEM</span>) }
        </div>
    )
}

export default Victory;