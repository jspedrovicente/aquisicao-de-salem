import { database } from "../../firebaseConnection";
import { collection, deleteDoc } from "firebase/firestore";

const playerListing = (props) => {
    const userDetail = localStorage.getItem("UserLogin");
    const data = JSON.parse(userDetail);
    const email = data.email

    const handleDelete = async (id) => {
        const docRef = collection(database, email)
        await deleteDoc(docRef, id);
    }

    return (
        <div key={props.key}>{props.playerName} <button className="delete-button" onClick={() => handleDelete(props.id)}>x</button></div>
        
    )
}

export default playerListing;