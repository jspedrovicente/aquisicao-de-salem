import { Link, Navigate } from "react-router-dom";

const ButtonLink = (props) => {
    return (
        <Link to={props.destination} className="button">
            {props.buttonText}
        </Link>

    )
}

export default ButtonLink;