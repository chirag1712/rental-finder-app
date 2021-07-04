import { InputBox } from '../../styles/AppStyles.js';

const Input = ({type, name, placeHolder, value, onChange}) => {

    return (
        <InputBox
            className='Input'
            type={type}
            name={name}
            placeholder={placeHolder}
            value={value}
            onChange={e => onChange(e)} />
    );
};

export default Input;
