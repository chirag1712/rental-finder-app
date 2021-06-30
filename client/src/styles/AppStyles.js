import styled from 'styled-components';
import bg from '../images/bg.jpg'

export const AppDiv = styled.div`
  text-align: center;
  height: 100vh;
`;

export const Wrapper = styled.div`
height: 100%;
width:100%;
background-image: url(${bg});
background-size:cover;
backdrop-filter: blur(4px);
position: absolute;
`;

export const Header = styled.h1`
margin-top:0;
text-align: center;
color: #000000;
`;

export const Margin50 = styled.div`
  margin-top: 25px;
  margin-bottom: 25px;
`;

export const Margin100 = styled.div`
  margin-top: 50px;
  margin-bottom: 50px;
`;

export const GreenButton = styled.button`
  width: 265px;
  height: 36px;
  background: #46BD99;
  border-radius: 20px;
  margin-top: 10px;
  margin-bottom: 10px;
  text-align: center;
  color: white;
  border-color: #46BD99;
  cursor: pointer;
  text-decoration: none;
  font-size: 1.4rem;
  font-family: inherit;
  font-size: 20px;
  line-height: 25px;
`;

export const InputBox = styled.input`
  width: 357px;
  font-size: 1.2rem;
  color: #9D9E9F;
  background-color: transparent;
  margin-top: 15px;
  margin-bottom: 15px;
  border: none;
  outline: none;
  border-bottom: 2px solid #9D9E9F;
  padding: 0px;
`;

export const BigLogo = styled.img`
  width: 170px;
  height: 181px;
  margin: auto;
  object-fit: contain;
`;