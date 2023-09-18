import Form from "../../components/Forms";
import { useState, useEffect } from "react";
import { database } from "../../firebaseConnection";
import { setDoc, doc, addDoc, collection, onSnapshot, deleteDoc } from "firebase/firestore";
import PlayerListing from "../../components/PlayerListing"
import ButtonLink from "../../components/ButtonLink";
import "./playerList.css"
const PlayerList = () => {
    const [playerName, setPlayerName] = useState('');
    const [user, setUser] = useState({});
    const [playerList, setPlayerList] = useState([]);
    
    useEffect(() => {
        async function loadInfo() {
            const userDetail = localStorage.getItem("UserLogin");
            setUser(JSON.parse(userDetail));
            if (userDetail) {
                const data = JSON.parse(userDetail);
                const unsub = onSnapshot(collection(database, `playeradmin/players/${data.email}`), (snapshot) => {
                    let list = [];
                    snapshot.forEach((doc) => {
                        list.push({
                            id: doc.id,
                            key: doc.id,
                            playerName: doc.data().playerName,
                            victoryPoints: doc.data().victoryPoints,
                            role: doc.data().role,
                            life: doc.data().life,
                        })
                    })
                    setPlayerList(list);
                })
            }
        }
        loadInfo();
    }, [])

    const handleRegister = async (e) => {
        e.preventDefault();

        if (playerName !== '') {
            const docRef = collection(database, `playeradmin/players/${user.email}`)
            await addDoc(docRef, {
                playerName: playerName,
                victoryPoints: 0,
                role: "none",
                filliation: "none",
                life: "none",
                image: "none",
                willText: "none",
                action: "pending",
                newResponse: ''
            })
        }
        setPlayerName('')
    }

    return (
            <div className="logIn">
            <h3 className="page-title">
            Cadastre todos os jogadores antes de começar
            </h3>
            <div className="playerlist-main">
                <div className="playerlist-register">

                <form onSubmit={handleRegister}>
                <label>Nome do Jogador
                <input id="playerNameAdd" type="text" value={playerName} onChange={(e) => setPlayerName(e.target.value)}  />
                </label>    
                    <button type="submit" className="button" onClick={handleRegister}>Adicionar Jogador</button>
                        </form> 
                </div>
                <div className="playerlist-container">
                <h4> Lista de Jogadores</h4>
                    <div className="playerlist-list card-border scrollable">
                        {playerList.map((player) => (
                            <PlayerListing key={player.id} playerName={player.playerName}  id={player.id} />
                            )
                            )}
                </div>
                <ButtonLink destination="/playerrole" buttonText="Começar Partida" />
                </div>
            </div>
        </div>
    )
}

export default PlayerList;