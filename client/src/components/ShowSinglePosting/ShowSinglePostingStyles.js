import styled from 'styled-components';

export const PostingWrapper = styled.div`
  height: 100%;
  width: 100%;
  background-color: white;
  backdrop-filter: blur(4px);
  position: absolute;
`;

export const ImageDiv = styled.div`
  position: absolute;
  width: 518px;
  height: 457px;
  left: 250px;
  top: 155px;
  background-color: white;
`;

export const UserInfoDiv = styled.div`
  position: absolute;
  width: 376px;
  height: 113px;
  left: 185px;
  top: 657px;
`;

export const UserText = styled.h4`
  font-family: Roboto;
  font-style: normal;
  font-weight: normal;
  font-size: 24px;
  display: flex;
  align-items: center;
  color: black;
`;

export const DetailsDiv = styled.div`
  position: absolute;
  width: 503px;
  height: 443px;
  left: 900px;
  top: 155px;
`;

export const DescriptionDiv = styled.div`
  position: absolute;
  width: 900px;
  height: 214px;
  left: 250px;
  top: 570px;
  text-align: left;
`;

export const DescriptionText = styled.label`
  margin-top: 10px;
  width: 900px;
  height: 200px;
`;

export const PriceText = styled.label`
  font-family: Roboto;
  font-style: normal;
  font-weight: bold;
  font-size: 24px;
  display: flex;
  align-items: center;
  color: black;
`;

export const DetailsText = styled.label`
  margin-top: 15px;
  font-family: Roboto;
  font-style: normal;
  font-weight: normal;
  font-size: 20px;
  display: flex;
  align: top;
  color: black;
`;