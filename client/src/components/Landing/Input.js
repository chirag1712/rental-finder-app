import { InputBox } from '../../styles/AppStyles.js';

const Input = ({ type, name, placeHolder, value }) => {

    return (
        <InputBox
            className='Input'
            type={type}
            name={name}
            placeholder={placeHolder}
            value={value}
        />
    );
};

export default Input;
