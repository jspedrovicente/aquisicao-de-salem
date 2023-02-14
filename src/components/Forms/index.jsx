const Form = (props) => {
    return (
        <label>{props.label}
        
        <input type={props.type} value={props.state} onChange={(e) => props.changeState(e.target.value)}  />
        </label>
    )
}

export default Form;