import { database } from "../../firebaseConnection";
import { collection, doc , deleteDoc } from "firebase/firestore";
import "./playerListing.css"
function playerListing(props){
    const userDetail = localStorage.getItem("UserLogin");
    const data = JSON.parse(userDetail);
    const email = data.email
    async function handleDelete(id) {
        const docRef = doc(database, `playeradmin/players/${data.email}`, id)
        await deleteDoc(docRef);
    }

    return (
        <div className="playerlisting-name">
            <p key={props.id}>{props.playerName}</p>
            <button className="delete-button" onClick={() => handleDelete(props.id)}>x</button>
        </div>
        
    )
}

export default playerListing;