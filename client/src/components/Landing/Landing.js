import { useState } from 'react';
import { useHistory } from "react-router-dom";
import axios from 'axios';

import Input from './Input.js'
import { Wrapper, Header } from '../CreatePosting/CreatePostingStyles';

import './Landing.css';


const Landing = ({ setUserId }) => {
    const history = useHistory();

    const [userInfo, setUserInfo] = useState({
        email: '',
        password: '',
        first_name: '',
        last_name: '',
        phone_num: null,
    });
    const [createUser, setCreateUser] = useState(false)
    const [error, setError] = useState(null);

    const onChange = (e) => setUserInfo({ ...userInfo, [e.target.name]: e.target.value });

    const isValidEmail = (email) => {
        const regexLaurier = /^[\w.+\-]+@mylaurier\.ca$/;
        const regexWaterloo = /^[\w.+\-]+@uwaterloo\.ca$/;
        return regexLaurier.test(email) || regexWaterloo.test(email);
    };

    const onSignupSubmit = async () => {
        console.log("Sign Up Pressed");

        if (userInfo.email === '' || userInfo.first_name === '' ||
            userInfo.last_name === '' || userInfo.password === '') {
            setError('Please enter all the fields');
            return;
        }

        if (!isValidEmail(userInfo.email)) {
            setError('Please enter your valid university email');
            return;
        }

        const data = { ...userInfo };

        try {
            const response = await axios.post('api/users/signup', data);
            // console.log(response);

            setUserId(response.data.id);
            history.push("/createPosting");
        } catch (err) {
            setError(err.response.data.error);
            // console.log(err.response);
        }
    }

    const onLoginSubmit = async () => {
        console.log("Login Pressed Pressed");

        if (userInfo.email === '' || userInfo.password === '') {
            setError('Please enter all the fields');
            return;
        }

        if (!isValidEmail(userInfo.email)) {
            setError('Please enter your valid university email');
            return;
        }

        const data = {
            email: userInfo.email,
            password: userInfo.password
        };

        try {
            const response = await axios.post('api/users/login', data);
            // console.log(response);

            setUserId(response.data.id)
            history.push("/createPosting");
        } catch (err) {
            setError(err.response.data.error);
            // console.log(err.response);
        }
    }

    return (
        <Wrapper>
            <div className="Dialog">
            <Header> Honk For Sublet </Header>
                {createUser &&
                    <>
                        <Input
                            type='text'
                            name='first_name'
                            placeHolder='First Name'
                            value={userInfo.first_name}
                            onChange={onChange} />
                        <Input
                            type='text'
                            name='last_name'
                            placeHolder='Last Name'
                            value={userInfo.last_name}
                            onChange={onChange} />
                    </>
                }
                <Input
                    type='text'
                    name='email'
                    placeHolder='University Email'
                    value={userInfo.email}
                    onChange={onChange} />
                <Input
                    type='password'
                    name='password'
                    placeHolder='Password'
                    value={userInfo.password}
                    onChange={onChange} />
                {createUser &&
                    <Input
                        type='tel'
                        name='phone_num'
                        placeHolder='Phone Numer'
                        value={userInfo.phone_num}
                        onChange={onChange} />
                }
                {error && <h6>{error}</h6>}
                <button
                    className="Btn"
                    onClick={createUser ? onSignupSubmit : onLoginSubmit} >
                    {createUser ? 'Sign Up' : 'Log In'}
                </button>
                {!createUser &&
                    <button
                        className="Btn"
                        onClick={() => setCreateUser(!createUser)} >
                        Create Account
                    </button>
                }
            </div>
        </Wrapper>
    );
}

export default Landing;
