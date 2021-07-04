import { useState, Fragment } from 'react';
import Input from '../Landing/Input.js'
import Select from 'react-select'
import { Wrapper, Header, BigLogo, Margin50, GreenButton } from '../../styles/AppStyles.js';
import { WhiteBox, SelectBox, TextArea, Label, WrapperDiv } from './CreatePostingStyles.js';
import logo from '../../images/HonkForSubletLogo.png'
import axios from 'axios';

const CreatePosting = ({ user_id, setUserId }) => {

    const [info, setInfo] = useState({
        term: '',
        start_date: '',
        end_date: '',
        price_per_month: '',
        gender_details: '',
        rooms_available: '',
        total_rooms: '',
        description: '',
        street_num: '',
        street_name: '',
        city: '',
        postal_code: '',
        ac: '',
        washrooms: '',
        wifi: '',
        parking: '',
        laundry: '',
    });

    const handleChange = e => setInfo({ ...info, [e.target.name]: e.target.value });

    const handleSubmit = async (e) => {
        e.preventDefault();

        const data = { user_id, ...info };

        try {
            const response = await axios.post('api/postings/create', data);
            alert('Successfully Made a Posting!');
            // console.log(response.data);
        } catch (err) {
            alert('Error!');
            // console.log(err.response.data);
        }
    }

    const handleLogout = () => {
        setUserId(null);
        localStorage.clear();
    }

    return (
        <Wrapper>
            <WrapperDiv>
                <WhiteBox>
                    <Margin50></Margin50>
                    <BigLogo src={logo}></BigLogo>
                    <Header> Create Posting! </Header>
                    <Margin50></Margin50>

                    <form action="" onSubmit={handleSubmit}>
                        <Input name='street_num' type='text' onChange={handleChange} placeHolder='Street Number' />
                        <br></br>
                        <Input name='street_name' type='text' onChange={handleChange} placeHolder='Street Name' />
                        <br></br>

                        <Input name='city' type='text' onChange={handleChange} placeHolder='City' />
                        <br></br>

                        <Input name='postal_code' type='text' onChange={handleChange} placeHolder='Postal Code' />
                        <WrapperDiv>
                            <SelectBox name="term" id="term" onChange={handleChange}>
                                <option value="" disabled selected>Choose Your Term</option>
                                <option value="fall">Fall</option>
                                <option value="winter">Winter</option>
                                <option value="spring">Spring</option>
                            </SelectBox>
                        </WrapperDiv>
                        <Label for="start_date">Start Date: </Label>
                        <input type="date" id="start" name="start_date"
                            min="2021-05-01" max="2022-08-31" onChange={handleChange}></input>
                        <br></br>
                        <Label for="end_date">End Date: </Label>
                        <input type="date" id="end" name="end_date"
                            min="2021-05-01" max="2022-08-31" onChange={handleChange}></input>
                        <br></br>

                        <Input name='price_per_month' type='text' onChange={handleChange} placeHolder='Price Per Month' />
                        <WrapperDiv>
                            <SelectBox name="gender_details" id="gender_details" onChange={handleChange}>
                                <option value="" disabled selected>Who Can Live Here?</option>
                                <option value="female">Female</option>
                                <option value="male">Male</option>
                                <option value="co-ed">Co-ed</option>
                            </SelectBox>
                        </WrapperDiv>
                        <Input name='rooms_available' type='text' onChange={handleChange} placeHolder='Number of Rooms Available' />
                        <br></br>
                        <Input name='total_rooms' type='text' onChange={handleChange} placeHolder='Number of Rooms Total' />
                        <br></br>

                        <WrapperDiv>
                            <SelectBox name="ac" id="ac" onChange={handleChange}>
                                <option value="" disabled selected>Is there A/C</option>
                                <option value='true'>Yes</option>
                                <option value='false'>No</option>
                            </SelectBox>
                        </WrapperDiv>
                        <Input name='washrooms' type='text' onChange={handleChange} placeHolder='Total Number of Washrooms' />
                        <br></br>
                        <WrapperDiv>
                            <SelectBox name="wifi" id="wifi" onChange={handleChange}>
                                <option value="" disabled selected>Wifi Options</option>
                                <option value='true'>Included</option>
                                <option value='false'>Not Included</option>
                            </SelectBox>
                        </WrapperDiv>
                        <WrapperDiv>
                            <SelectBox name="parking" id="parking" onChange={handleChange}>
                                <option value="" disabled selected>Is there Parking?</option>
                                <option value='true'>Included</option>
                                <option value='false'>Not Included</option>
                            </SelectBox>
                        </WrapperDiv>
                        <WrapperDiv>
                            <SelectBox name="laundry" id="laundry" onChange={handleChange}>
                                <option value="" disabled selected>Laundry Options</option>
                                <option value="same-floor">Same Floor</option>
                                <option value="common">In the Building</option>
                                <option value="ensuite">In Suite</option>
                                <option value="unavailable">No Laundry</option>
                            </SelectBox>
                        </WrapperDiv>
                        <TextArea rows="5" cols="60" name="description" onChange={handleChange}>
                            Enter Description Here...
                        </TextArea>
                        <Margin50></Margin50>
                        <GreenButton type="submit" value="submit"> Submit </GreenButton>
                    </form>
                    <GreenButton onClick={handleLogout}>Logout</GreenButton>
                    <Margin50></Margin50>
                </WhiteBox>
            </WrapperDiv>
        </Wrapper>
    );
}

export default CreatePosting;
