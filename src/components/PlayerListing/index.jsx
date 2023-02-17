import { database } from "../../firebaseConnection";
import { collection, doc , deleteDoc } from "firebase/firestore";

function playerListing(props){
    const userDetail = localStorage.getItem("UserLogin");
    const data = JSON.parse(userDetail);
    const email = data.email
    async function handleDelete(id) {
        const docRef = doc(database, email, id)
        await deleteDoc(docRef);
    }

    return (
        <div key={props.key}>{props.playerName} <button className="delete-button" onClick={() => handleDelete(props.id)}>x</button></div>
        
    )
}

export default playerListing;