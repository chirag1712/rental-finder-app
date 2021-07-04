import { useState } from 'react';

import axios from 'axios';

import { Wrapper, Header } from './CreatePostingStyles';

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
    postal_code: ''
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

  return (
    <Wrapper>
      <Header> Create Posting! </Header>

      <form action="" onSubmit={handleSubmit}>
        <label for='street_num'> Street Number: </label>
        <input name='street_num' type='text' onChange={handleChange} />
        <br></br>

        <label for='street_name'> Street Name: </label>
        <input name='street_name' type='text' onChange={handleChange} />
        <br></br>

        <label for='city'> City: </label>
        <input name='city' type='text' onChange={handleChange} />
        <br></br>

        <label for='postal_code'> Postal Code: </label>
        <input name='postal_code' type='text' onChange={handleChange} />
        <br></br>

        <label for="term">Choose Your Term: </label>
        <select name="term" id="term" onChange={handleChange}>
          <option value="" disabled selected>Select</option>
          <option value="fall">Fall</option>
          <option value="winter">Winter</option>
          <option value="spring">Spring</option>
        </select>
        <br></br>

        <label for="start_date">Start Date: </label>
        <input type="date" id="start" name="start_date"
          min="2021-05-01" max="2022-08-31" onChange={handleChange}></input>
        <br></br>

        <label for="end_date">End Date: </label>
        <input type="date" id="end" name="end_date"
          min="2021-05-01" max="2022-08-31" onChange={handleChange}></input>
        <br></br>

        <label for='price_per_month'> Price Per Month: </label>
        <input name='price_per_month' type='text' onChange={handleChange} />
        <br></br>

        <label for="gender_details"> Who can live here?: </label>
        <select name="gender_details" id="gender_details" onChange={handleChange}>
          <option value="" disabled selected>Select</option>
          <option value="female">Female</option>
          <option value="male">Male</option>
          <option value="co-ed">Co-ed</option>
        </select>
        <br></br>

        <label for='rooms_available'> Number of Rooms Available: </label>
        <input name='rooms_available' type='text' onChange={handleChange} />
        <br></br>

        <label for='total_rooms'> Number of Rooms Total: </label>
        <input name='total_rooms' type='text' onChange={handleChange} />
        <br></br>

        <label for='description'> Description: </label>
        <br></br>
        <textarea rows="5" cols="60" name="description" onChange={handleChange}>
          Enter More Details Here...
        </textarea>
        <br></br>
        <br></br>
        <input type="submit" value="submit" />
      </form>
      <button onClick={handleLogout}>logout</button>
    </Wrapper>
  );
}

export default CreatePosting;
