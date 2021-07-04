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

  const handleChange = e => setInfo({ ...info, [e.target.name]: e.target.value })

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

  const termOptions = [
    { value: 'term', label: "Choose Your Term", isdisabled: true },
    { value: 'fall', label: 'Fall' },
    { value: 'winter', label: 'Winter' },
    { value: 'spring', label: 'Spring' }
  ]

  const genderOptions = [
    { value: 'gender_details', label: "Who Can Live Here?", isdisabled: true },
    { value: 'female', label: 'Female' },
    { value: 'male', label: 'Male' },
    { value: 'co-ed', label: 'Co-Ed' }
  ]

  const acOptions = [
    { value: 'ac', label: "Is there A/C", isdisabled: true },
    { value: 'true', label: 'Yes' },
    { value: 'false', label: 'No' }
  ]

  const parkingOptions = [
    { value: 'parking_options', label: "Is there Parking?", isdisabled: true },
    { value: 'true', label: 'Yes' },
    { value: 'false', label: 'No' }
  ]

  const wifiOptions = [
    { value: 'wifi_options', label: "Wifi Options", isdisabled: true },
    { value: 'true', label: 'Included' },
    { value: 'false', label: 'Not Included' }
  ]

  const laundryStuff = [
    { value: 'laundry', label: "Laundry State", isdisabled: true },
    { value: 'same-floor', label: 'Same Floor' },
    { value: 'common', label: 'In the Building' },
    { value: 'ensuite', label: 'In Suite' },
    { value: 'unavailable', label: 'No Laundry' }
  ]

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
              <Select
                isOptionDisabled={(option) => option.isdisabled}
                defaultValue={termOptions[0]}
                options={termOptions}
                name="term"
                id="term"
                onChange={handleChange} />
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
              <Select
                isOptionDisabled={(option) => option.isdisabled}
                defaultValue={genderOptions[0]}
                options={genderOptions}
                name="gender_details"
                id="gender_details"
                onChange={handleChange} />
            </WrapperDiv>
            <Input name='rooms_available' type='text' onChange={handleChange} placeHolder='Number of Rooms Available' />
            <br></br>
            <Input name='total_rooms' type='text' onChange={handleChange} placeHolder='Number of Rooms Total' />
            <br></br>

            <WrapperDiv>
              <Select
                isOptionDisabled={(option) => option.isdisabled}
                defaultValue={acOptions[0]}
                options={acOptions}
                name="ac"
                id="ac"
                onChange={handleChange} />
            </WrapperDiv>
            <Input name='num_washrooms' type='text' onChange={handleChange} placeHolder='Total Number of Washrooms' />
            <br></br>
            <WrapperDiv>
              <Select
                isOptionDisabled={(option) => option.isdisabled}
                defaultValue={wifiOptions[0]}
                options={wifiOptions}
                name="wifi"
                id="wifi"
                onChange={handleChange} />
            </WrapperDiv>
            <WrapperDiv>
              <Select
                isOptionDisabled={(option) => option.isdisabled}
                defaultValue={parkingOptions[0]}
                options={parkingOptions}
                name="parking"
                id="parking"
                onChange={handleChange} />
            </WrapperDiv>
            <WrapperDiv>
              <Select
                isOptionDisabled={(option) => option.isdisabled}
                defaultValue={laundryStuff[0]}
                options={laundryStuff}
                name="laundry"
                id="laundry"
                onChange={handleChange} />
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
