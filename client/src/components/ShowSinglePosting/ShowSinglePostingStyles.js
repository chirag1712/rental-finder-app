import styled from 'styled-components';

export const PostingWrapper = styled.div`
  height: 100%;
  width: 100%;
  background-color: white;
  backdrop-filter: blur(4px);
  position: absolute;
`;

export const DetailsDiv = styled.div`
  text-align: center;
  width: 100%;
  height: 100px;
  text-align: center;
  align-items: center;
  display: flex;
  justify-content: center;
  flex-flow: column wrap;
`;

export const DetailsWrapper = styled.div`
  padding: 20px;
  margin-top: 100px;
  display: flex;
  width: 75%;
  margin-left: 12%;
  align-items: center;
  justify-content: center;
  flex-flow: column wrap;
  border: 1px solid #898989;
  box-sizing: border-box;
`;

export const ImageDiv = styled.div`
  position: absolute;
  min-width: 518px;
  min-height: 320px;
  max-width: 518px;
  max-height: 320px;
  margin-top: 50px;
  margin-left: 12%;
  background-color: white;
  text-align: center;
  display: flex;
  align-items: center;
  justify-content: center;
`;

export const MainInfoDiv = styled.div`
  margin-top: 50px;
  margin-left: 55%;
  text-align: center;
  width: 518px;
  height: 320px;
  border: 1px solid #898989;
  box-sizing: border-box;
  text-align: center;
  align-items: center;
  display: flex;
  justify-content: center;
  flex-flow: column wrap;
`;

export const DescriptionDiv = styled.div`
  position: absolute;
  padding-top: 20px;
  margin-top: 20px;
  display: flex;
  width: 75%;
  margin-left: 12%;
  align-items: center;
  justify-content: center;
  flex-flow: column wrap;
  border: 1px solid #898989;
  box-sizing: border-box;
  padding-bottom: 20px;
`;

export const DescriptionWrapper = styled.div`
  position: absolute;
  padding: 20px;
  margin-top: 300px;
  display: flex;
  margin-left: 12%;
  align-items: center;
  justify-content: center;
  flex-flow: column wrap;
  padding-bottom: 20px;
`;

export const DescriptionText = styled.label`
  margin-top: 10px;
  width: 900px;
  height: 200px;
  font-size: 15px;
`;

export const PriceText = styled.label`
  font-style: normal;
  font-weight: bold;
  font-size: 24px;
  display: flex;
  align-items: center;
  color: black;
`;

export const DetailsText = styled.label`
  margin-top: 15px;
  font-style: normal;
  font-weight: normal;
  font-size: 20px;
  display: flex;
  align: top;
  color: black;
`;

export const DetailsTextBold = styled.label`
  margin-top: 15px;
  font-style: normal;
  font-weight: bold;
  font-size: 20px;
  display: flex;
  align: top;
  color: black;
`;