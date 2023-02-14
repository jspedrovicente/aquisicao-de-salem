import './home.css'
import ButtonLink from '../../components/ButtonLink';
const Home = () => {
    return (
        <div className="home">

            <h3>
                Painel Administrativo
            </h3>

            <div className='button-container'>
                <ButtonLink destination="/login" buttonText="Log In"/>
                <ButtonLink destination="/signup" buttonText="Cadastrar"/>
                <ButtonLink destination="/tutorial" buttonText="Conheça o Jogo"/>
            </div>
        </div>
    )
}

export default Home;