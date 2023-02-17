import { Link, Navigate } from "react-router-dom";

const ButtonLink = (props) => {
    const destination = props.destination;
    const buttonText = props.buttonText;
    return (
        <Link to={destination} className="button">
            {buttonText}
        </Link>

    )
}

export default ButtonLink;