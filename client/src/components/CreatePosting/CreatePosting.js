import React, { Component } from 'react';
import { Wrapper, Header } from './CreatePostingStyles';
import axios from 'axios';
import { render } from 'react-dom';

class CreatePosting extends Component {
  state = {
    user_id: '1',
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

  handleSubmit = event => {
    event.preventDefault();

    const data = {
      user_id: this.state.user_id,
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

    axios.post('http://localhost:5000/create', { data })
      .then(res => {
        console.log(data);
      })
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
            <option value="fall">Fall</option>
            <option value="winter">Winter</option>
            <option value="spring">Spring</option>
          </select>
          <br></br>

          <label for="start_date">Start Date: </label>
          <input type="date" id="start" name="start_date"
            value="2021-09-01"
            min="2021-05-01" max="2022-08-31" onChange={this.handleChange}></input>
          <br></br>

          <label for="end_date">End Date: </label>
          <input type="date" id="end" name="end_date"
            value="2021-12-31"
            min="2021-05-01" max="2022-08-31" onChange={this.handleChange}></input>
          <br></br>

          <label for='price_per_month'> Price Per Month: </label>
          <input name='price_per_month' type='text' onChange={this.handleChange} />
          <br></br>

          {/* 
        <label for="is_negotiable"> Is it Negotiable?: </label>
        <select name="is_negotiable" id="is_negotiable">
          <option value="Yes">Yes</option>
          <option value="No">No</option>
        </select>
        <br></br>

        <label for='leasing'> Leasing Company: </label>
        <input name='leasing' type='text' />
        <br></br>
        */}

          <label for="gender_details"> Who can live here?: </label>
          <select name="gender_details" id="genders" onChange={this.handleChange}>
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

          {/* 
        <label for='num_washrooms'> Number of Washrooms: </label>
        <input name='num_washrooms' type='text' />
        <br></br>

        <label for="ac"> Air Conditioning?: </label>
        <select name="ac" id="ac">
          <option value="Yes">Yes</option>
          <option value="No">No</option>
        </select>
        <br></br>

        <label for="wifi"> Wifi?: </label>
        <select name="wifi" id="wifi">
          <option value="Yes">Included</option>
          <option value="No">Not Included</option>
        </select>
        <br></br>

        <label for="parking"> Parking: </label>
        <select name="parking" id="parking">
          <option value="Yes">Yes</option>
          <option value="No">No</option>
        </select>
        <br></br>

        <label for="laundry"> Laundry: </label>
        <select name="laundry" id="laundry">
          <option value="Ensuite">Ensuite</option>
          <option value="On Site">On Site</option>
          <option value="None">None</option>
        </select>
        <br></br>
        <br></br>

        */}
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