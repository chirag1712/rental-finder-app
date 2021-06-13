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

        <label for="number_rooms_total"> Number of Rooms Total: </label>
        <select name="number_rooms_total" id="number_rooms_total">
          <option value="1">1</option>
          <option value="2">2</option>
          <option value="3">3</option>
          <option value="4">4</option>
          <option value="5">5</option>
          <option value="6">6</option>
          <option value="7">7</option>
        </select>
        <br></br>

        {/* add some kind of listener here so its less than number rooms total */}
        <label for="number_rooms_open"> Number of Rooms Available: </label>
        <select name="number_rooms_open" id="number_rooms_open">
          <option value="1">1</option>
          <option value="2">2</option>
          <option value="3">3</option>
          <option value="4">4</option>
          <option value="5">5</option>
          <option value="6">6</option>
          <option value="7">7</option>
        </select>
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

         {/* add some kind of listener here so its less than number rooms total */}
        <label for="num_washrooms"> Number of Washrooms: </label>
        <select name="num_washrooms" id="num_washrooms">
          <option value="1">1</option>
          <option value="2">2</option>
          <option value="3">3</option>
          <option value="4">4</option>
          <option value="5">5</option>
          <option value="6">6</option>
          <option value="7">7</option>
        </select>
        <br></br>
        <br></br>

        <label for='description'> Description: </label>
        <br></br>
        <textarea rows = "5" cols = "60" name = "description">
            Enter More Details Here...
        </textarea>
        <br></br>
        <br></br>
        <input type = "submit" value = "submit" />
      </form>
    </Wrapper>
  );
}

export default CreatePosting;