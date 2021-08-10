import styled from 'styled-components';

export const PostingWrapper = styled.div`
  height: 100%;
  width: 100%;
  backdrop-filter: blur(4px);
`;

export const DetailsDiv = styled.div`
  text-align: center;
  width: 100%;
  height: 100px;
  align-items: center;
  display: inline-block;
  justify-content: center;
  flex-flow: column wrap;
`;

export const DetailsTable = styled.table`
  text-align: center;
  width: 100%;
  height: 100px;
  align-items: center;
  display: flex;
  justify-content: center;
  flex-flow: column wrap;
`;

export const DetailsCell = styled.td`
  text-align: center;
  align-items: center;
  display: flex;
  justify-content: center;
`;

export const DetailsWrapper = styled.div`
  padding: 20px;
  margin-top: 20px;
  display: flex;
  width: 75%;
  min-width: 900px;
  margin-left: 12%;
  align-items: center;
  justify-content: center;
  flex-flow: column wrap;
  border: 1px solid #898989;
  box-sizing: border-box;
  background-color: #d8e9f0;
  border-radius: 20px;
`;

export const ImageDiv = styled.div`
  margin-left: 25%;
  width: 50%;
  margin-top: 30px;
  background-color: white;
  text-align: center;
  display: flex;
  align-items: center;
  justify-content: center;
`;

export const MainInfoDiv = styled.div`
  padding-top: 20px;
  margin-top: 30px;
  display: flex;
  width: 75%;
  height: 160px;
  margin-left: 12%;
  align-items: center;
  justify-content: center;
  flex-flow: column wrap;
  border: 1px solid #898989;
  box-sizing: border-box;
  padding-bottom: 20px;
  background-color: #d8e9f0;
  border-radius: 20px;
  min-width: 900px;
`;

export const DescriptionDiv = styled.div`
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
  background-color: #d8e9f0;
  border-radius: 20px;
  min-width: 900px;
`;

export const DescriptionWrapper = styled.div`
  padding: 20px;
  display: flex;
  margin-left: 12%;
  align-items: center;
  justify-content: center;
  flex-flow: column wrap;
  padding-bottom: 20px;
`;

export const DescriptionText = styled.label`
  margin-top: 10px;
  width: 90%;
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