import React from 'react';
import { Wrapper, Header } from './CreatePostingStyles';

const CreatePosting = (props) => {
  return (
    <Wrapper>
      <Header> Create Posting! </Header>

      <form>

        <label for='address'> Address: </label>
        <input name='address' type='text' />
        <br></br>

        {/*Start Date && End Date??*/}

        <label for="term">Choose Your Term: </label>
        <select name="term" id="term">
          <option value="Spring 2021">Spring 2021</option>
          <option value="Fall 2021">Fall 2021</option>
          <option value="Winter 2022">Winter 2022</option>
          <option value="Spring 2022">Spring 2022</option>
        </select>
        <br></br>

        <label for="start">Start Date: </label>
        <input type="date" id="start" name="start-date"
          value="2021-09-01"
          min="2021-05-01" max="2022-08-31"></input>
        <br></br>

        <label for="start">End Date: </label>
        <input type="date" id="end" name="end-start"
          value="2021-12-31"
          min="2021-05-01" max="2022-08-31"></input>
        <br></br>

        <label for='price'> Price Per Month: </label>
        <input name='price' type='text' />
        <br></br>

        <label for="is_negotiable"> Is it Negotiable?: </label>
        <select name="is_negotiable" id="is_negotiable">
          <option value="Yes">Yes</option>
          <option value="No">No</option>
        </select>
        <br></br>

        <label for='leasing'> Leasing Company: </label>
        <input name='leasing' type='text' />
        <br></br>

        <label for="genders"> Who can live here?: </label>
        <select name="genders" id="genders">
          <option value="Female">Female</option>
          <option value="Male">Male</option>
          <option value="Co-ed">Co-ed</option>
        </select>
        <br></br>

        <label for='number_rooms_total'> Number of Rooms Total: </label>
        <input name='number_rooms_total' type='text' />
        <br></br>

        <label for='number_rooms_open'> Number of Rooms Available: </label>
        <input name='number_rooms_open' type='text' />
        <br></br>

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

        <label for='description'> Description: </label>
        <br></br>
        <textarea rows="5" cols="60" name="description">
          Enter More Details Here...
        </textarea>
        <br></br>
        <br></br>
        <input type="submit" value="submit" />
      </form>
    </Wrapper>
  );
}

export default CreatePosting;