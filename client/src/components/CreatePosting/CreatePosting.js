import { useEffect, useRef } from 'react';
import Input from '../Landing/Input.js'
import { Wrapper, Header, BigLogo, Margin50, GreenButton } from '../../styles/AppStyles.js';
import { WhiteBox, SelectBox, TextArea, Label, WrapperDiv } from './CreatePostingStyles.js';
import logo from '../../images/HonkForSubletLogo.png'
import axios from 'axios';
import { useAuth } from '../../useAuth';
import { useHistory } from 'react-router';

const CreatePosting = () => {
    const history = useHistory();
    const auth = useAuth();
    const form = useRef(null);

    const handleSubmit = async (e) => {
        e.preventDefault();

        const data = new FormData(form.current);
        data.set('user_id', auth.user.id);

        var files = document.getElementById('fileItem').files;
        for (let i = 0; i < files.length; i++) {
            data.append(i, files[i])
        }

        const config = {
            headers: { 'content-type': 'multipart/form-data' }
        }

        try {
            const response = await axios.post('api/postings/create', data, config);
            alert('Successfully Made a Posting!');
            // console.log(response.data);
        } catch (err) {
            alert('Error!');
            // console.log(err.response.data);
        }
    }

    const handleChange = () => { }

    return (
        <Wrapper>
            <WrapperDiv>
                <WhiteBox>
                    <Margin50></Margin50>
                    <BigLogo src={logo}></BigLogo>
                    <Header> Create Posting! </Header>
                    <Margin50></Margin50>

                    <form action="" ref={form} onSubmit={handleSubmit}>
                        <Input name='street_num' type='number' placeHolder='Street Number' onChange={handleChange} />
                        <br></br>
                        <Input name='street_name' type='text' placeHolder='Street Name' onChange={handleChange} />
                        <br></br>

                        <Input name='city' type='text' placeHolder='City' onChange={handleChange} />
                        <br></br>

                        <Input name='postal_code' type='text' placeHolder='Postal Code' onChange={handleChange} />
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

                        <Input name='price_per_month' type='number' placeHolder='Price Per Month' onChange={handleChange} />
                        <WrapperDiv>
                            <SelectBox name="gender_details" id="gender_details" onChange={handleChange}>
                                <option value="" disabled selected>Who Can Live Here?</option>
                                <option value="female">Female</option>
                                <option value="male">Male</option>
                                <option value="co-ed">Co-ed</option>
                            </SelectBox>
                        </WrapperDiv>
                        <Input name='rooms_available' type='number' placeHolder='Number of Rooms Available' onChange={handleChange} />
                        <br></br>
                        <Input name='total_rooms' type='number' placeHolder='Number of Rooms Total' onChange={handleChange} />
                        <br></br>

                        <WrapperDiv>
                            <SelectBox name="ac" id="ac" onChange={handleChange}>
                                <option value="" disabled selected>Is there A/C</option>
                                <option value={true}>Yes</option>
                                <option value={false}>No</option>
                            </SelectBox>
                        </WrapperDiv>
                        <Input name='washrooms' type='number' placeHolder='Total Number of Washrooms' onChange={handleChange} />
                        <br></br>
                        <WrapperDiv>
                            <SelectBox name="wifi" id="wifi" onChange={handleChange}>
                                <option value="" disabled selected>Wifi Options</option>
                                <option value="true" >Included</option>
                                <option value="false">Not Included</option>
                            </SelectBox>
                        </WrapperDiv>
                        <WrapperDiv>
                            <SelectBox name="parking" id="parking" onChange={handleChange}>
                                <option value="" disabled selected>Is there Parking?</option>
                                <option value="true">Included</option>
                                <option value="false">Not Included</option>
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
                        <input id="fileItem" type="file" multiple onChange={handleChange}></input>
                        <Margin50></Margin50>
                        <GreenButton type="submit" value="submit"> Submit </GreenButton>
                    </form>
                    <GreenButton onClick={() => auth.signOut()}>Logout</GreenButton>
                    <Margin50></Margin50>
                </WhiteBox>
            </WrapperDiv>
        </Wrapper>
    );
}

export default CreatePosting;
