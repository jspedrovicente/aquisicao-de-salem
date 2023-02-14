import ButtonLink from "../../components/ButtonLink"
import Form from "../../components/Forms"
import { useState } from "react"
import "./logIn.css"
const LogIn = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const handleLogin = (e) => {
        e.preventDefault()
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