const Form = (props) => {

    const label = props.label
    const type = props.type
    const state = props.state
    return (
        <label>{label}
        
        <input type={type} value={state} onChange={(e) => props.changeState(e.target.value)}  />
        </label>
    )
}

export default Form;