import { useState } from "react";
import Form from "../../components/Forms";
import { auth } from "../../firebaseConnection";
import { createUserWithEmailAndPassword } from "firebase/auth"
import { useNavigate } from "react-router-dom";
import { Store } from 'react-notifications-component';
import ButtonLink from "../../components/ButtonLink";
import "./signUp.css"
const SignUp = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [name, setName] = useState('');
    const navigate = useNavigate()

    async function handleSignUp(event) {
        event.preventDefault()
        if (email !== '' && password !== '') {
            await createUserWithEmailAndPassword(auth, email, password)
                .then(() => {
                    Store.addNotification({
                        title: "Deu Certo",
                        message: "Cadastro feito com Sucesso",
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
                .catch((e) => {
                    Store.addNotification({
                        title: "Deu errado",
                        message: `${e}`,
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
        } else {
            Store.addNotification({
                title: "erro",
                message: "Favor Preencher todos os dados",
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
        }
    }
    return (
        <div className="signUp">
            <h3>
                Faça Seu Cadastro abaixo
            </h3>
            <form onSubmit={handleSignUp} className="form">
                <Form type="text" label="Nome:" state={name} changeState={setName}> </Form>
                <Form type="email" label="Email:" state={email} changeState={setEmail}> </Form>
                <Form type="password" label="Senha:" state={password} changeState={setPassword}> </Form>
            <button type="submit" className="button">Cadastrar</button>
            <ButtonLink destination="/" buttonText="Voltar" />
            </form>
        </div>
    )
}

export default SignUp;