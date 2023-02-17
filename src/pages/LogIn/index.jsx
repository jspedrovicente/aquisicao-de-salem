import ButtonLink from "../../components/ButtonLink"
import Form from "../../components/Forms"
import { useState } from "react"
import { signInWithEmailAndPassword } from "firebase/auth"
import { auth } from "../../firebaseConnection";
import { Store } from "react-notifications-component";
import { useNavigate } from "react-router-dom";
import "./logIn.css"
const LogIn = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault()
        if (email !== '' && password !== '') {
            await signInWithEmailAndPassword(auth, email, password)
                .then(() => {
                    Store.addNotification({
                        title: "Sucesso!",
                        message: "Login feito com sucesso!",
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
                    navigate('/playerlist', {replace: true})
                })
                .catch((e) => {
                    Store.addNotification({
                        title: "Erro!",
                        message: "Favor preencher os dados de acordo",
                        type: "danger",
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
    }


    return (


        <div className="logIn">
                        <h3>
                Faça o Login para começar
            </h3>
            <form onSubmit={handleLogin} className="form">
                    <Form type="email" state={email} changeState={setEmail} label="Email:"/>
                    <Form type="password" state={password} changeState={setPassword} label="Senha:" />
                <button type="submit" className="button">Fazer Log-in</button>
                <ButtonLink destination="/" buttonText="Voltar"/>
            </form>
        </div>
    )
}

export default LogIn;