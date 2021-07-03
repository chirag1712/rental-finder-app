import { useState } from 'react';
import { Wrapper, Header, BigLogo, Margin50, GreenButton } from '../../styles/AppStyles.js';
import logo from '../../images/HonkForSubletLogo.png'

const ShowSinglePosting = ({ user_id, setUserId }) => {

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
      alert('Successfully Made a Posting!');
    } catch (err) {
      alert('Error!');
      console.log(err.response.data);
    }
  }

  const handleLogout = () => {
    setUserId(null);
    localStorage.clear();
  }

  return (
    <Wrapper>
          <Margin50></Margin50>
          <BigLogo src={logo}></BigLogo>
          <Header> Show Posting </Header>
    </Wrapper>
  );
}

export default ShowSinglePosting;
