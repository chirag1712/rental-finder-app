
const Input = ({type, name, placeHolder, value, onChange}) => {

    return (
        <input
            className='Input'
            type={type}
            name={name}
            placeholder={placeHolder}
            value={value}
            onChange={e => onChange(e)} />
    );
};

export default Input;
