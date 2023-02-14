import { useState } from "react";
import Form from "../../components/Forms";
const SignUp = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [name, setName] = useState('');

    function handleSignUp(event) {
        event.preventDefault()
        console.log(name, email, password)
    }
    return (
        <div>
            <form onSubmit={handleSignUp}>
                <Form type="text" label="Nome" state={name} changeState={setName}> </Form>
                <Form type="email" label="Email" state={email} changeState={setEmail}> </Form>
                <Form type="password" label="Senha" state={password} changeState={setPassword}> </Form>
            <button className="button">Cadastrar</button>
            </form>
        </div>
    )
}

export default SignUp;