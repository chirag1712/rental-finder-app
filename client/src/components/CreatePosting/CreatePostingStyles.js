import styled from 'styled-components';

export const WhiteBox = styled.div`
  align: center;
  width: 60%;
  height: 90%;
  min-width: 476px;
  background: #FFFFFF;
  border-radius: 20px;
  overflow-y: scroll;
  position: absolute;
  top:0;
	bottom: 0;
	left: 0;
	right: 0;
  margin: auto;

::-webkit-scrollbar {
  width:10px;
  border-left:3px solid transparent;
  border-radius: 10px;
}

::-webkit-scrollbar-thumb {
  background-color:#b8b8b8;
  border-radius: 20px;
  }

::-webkit-scrollbar-thumb:vertical:hover {
  background-color:#a3a2a2;
  border-radius: 20px;
  }

::-webkit-scrollbar-track-piece:end {
    background: transparent;
    margin-bottom: 10px; 
}
::-webkit-scrollbar-track-piece:start {
    background: transparent;
    margin-top: 10px;
}
`;

export const WrapperDiv = styled.div`
  width: 357px;
  margin: auto;
  margin-top: 15px;
  margin-bottom: 15px;
  object-fit: contain;
`;

export const TextArea = styled.textarea`
  width: 357px;
  margin: auto;
  margin-top: 15px;
  margin-bottom: 15px;
  object-fit: contain;
  border-radius: 10px;
  font-family: 'Roboto';
  font-size: 16px;
  color:#808080;
`;


export const Label = styled.label`
  width: 225px;
  margin-top: 15px;
  margin-bottom: 15px;
  object-fit: contain;
  font-family: 'Roboto';
  display: inline-block;
  text-align: left;
  font-size: 1.2em;
  color:#666666;
`;

export const SelectBox = styled.select`
  width: 357px;
  font-size: 1.2rem;
  color: #808080;
  background-color: transparent;
  margin-top: 5px;
  margin-bottom: 5px;
  padding: 6px;
  border-radius: 5px;
`;
