import React, { Component } from 'react';
import { Wrapper, Header } from './CreatePostingStyles';
import axios from 'axios';
import { render } from 'react-dom';

class CreatePosting extends Component {
  state = {
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
  }

  handleChange = event => {
    this.setState({ [event.target.name]: event.target.value })
  }

  handleSubmit = async (event) => {
    event.preventDefault();

    const data = {
      user_id: this.props.user_id,
      term: this.state.term,
      start_date: this.state.start_date,
      end_date: this.state.end_date,
      price_per_month: this.state.price_per_month,
      gender_details: this.state.gender_details,
      rooms_available: this.state.rooms_available,
      total_rooms: this.state.total_rooms,
      description: this.state.description,
      street_num: this.state.street_num,
      street_name: this.state.street_name,
      city: this.state.city,
      postal_code: this.state.postal_code
    };

    try {
      const response = await axios.post('api/postings/create', data);
      console.log(response.data);
    } catch (err) {
      console.log(err.response.data);
    }
  }

  render() {
    return (
      <Wrapper>
        <Header> Create Posting! </Header>

        <form action="" onSubmit={this.handleSubmit}>
          <label for='street_num'> Street Number: </label>
          <input name='street_num' type='text' onChange={this.handleChange} />
          <br></br>

          <label for='street_name'> Street Name: </label>
          <input name='street_name' type='text' onChange={this.handleChange} />
          <br></br>

          <label for='city'> City: </label>
          <input name='city' type='text' onChange={this.handleChange} />
          <br></br>

          <label for='postal_code'> Postal Code: </label>
          <input name='postal_code' type='text' onChange={this.handleChange} />
          <br></br>

          <label for="term">Choose Your Term: </label>
          <select name="term" id="term" onChange={this.handleChange}>
            <option value="" disabled selected>Select</option>
            <option value="fall">Fall</option>
            <option value="winter">Winter</option>
            <option value="spring">Spring</option>
          </select>
          <br></br>

          <label for="start_date">Start Date: </label>
          <input type="date" id="start" name="start_date"
            min="2021-05-01" max="2022-08-31" onChange={this.handleChange}></input>
          <br></br>

          <label for="end_date">End Date: </label>
          <input type="date" id="end" name="end_date"
            min="2021-05-01" max="2022-08-31" onChange={this.handleChange}></input>
          <br></br>

          <label for='price_per_month'> Price Per Month: </label>
          <input name='price_per_month' type='text' onChange={this.handleChange} />
          <br></br>

          <label for="gender_details"> Who can live here?: </label>
          <select name="gender_details" id="gender_details" onChange={this.handleChange}>
            <option value="" disabled selected>Select</option>
            <option value="female">Female</option>
            <option value="male">Male</option>
            <option value="co-ed">Co-ed</option>
          </select>
          <br></br>

          <label for='rooms_available'> Number of Rooms Available: </label>
          <input name='rooms_available' type='text' onChange={this.handleChange} />
          <br></br>

          <label for='total_rooms'> Number of Rooms Total: </label>
          <input name='total_rooms' type='text' onChange={this.handleChange} />
          <br></br>

          <label for='description'> Description: </label>
          <br></br>
          <textarea rows="5" cols="60" name="description" onChange={this.handleChange}>
            Enter More Details Here...
          </textarea>
          <br></br>
          <br></br>
          <input type="submit" value="submit" />
        </form>
      </Wrapper>
    );
  }
}

export default CreatePosting;
