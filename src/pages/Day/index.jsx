import "./day.css"
import ButtonLink from "../../components/ButtonLink"

const Day = () => {
    return (
        // The day has to set all the player actions as pending
        <div className="day">
            <h3 className="page-title">
            Dia 1
            </h3>
            <button className="button">Encerrar Jogo</button>
            <div className="dayMain">
                <div className="event-ocurrence event">
                        <h4>
                        Acontecimentos
                        </h4>
                        <div className="large-container card-border scrollable">
                        </div>
                </div>

                <div className="event-aliveplayers event">
                        <h4>
                        Jogadores Vivos
                        </h4>
                        <div className="small-container card-border scrollable">
                        </div>
                </div>
                <div className="event-hiddenocurrence event">
                        <h4>
                        Ações da Noite
                        </h4>
                        <div className="small-container card-border scrollable">
                        </div>
                </div>
                <div className="event-death event">
                        <h4>
                        Jogadores Mortos
                        </h4>
                        <div className="large-container card-border scrollable">
                        </div>
                </div>
                <div className="event-status event">
                        <h4>
                        Status
                        </h4>
                        <div className="small-container card-border scrollable">
                        </div>
                </div>
                <div className="event-killplayer event">
                        <h4>
                        Matar Jogador
                        </h4>
                    <div className="small-container event-killplayer-inner">
                        <h4>Nome:</h4>
                        <select name="playerName" id="playerName">
                            <option value="selena">SelenaGomez</option>
                        </select>
                        <button className="button">Matar Jogador</button>
                        <ButtonLink destination="/night" buttonText="Começar Noite"/>

                    </div>
                </div>

            </div>

        </div>
    )
}

export default Day;