
import styled, { keyframes } from 'styled-components'

const MButton = styled.button`
  display:flexbox;
  justify-content:center;
  box-sizing: border-box;



  min-height:${props => (props.isTabletOrMobile === true ? '50px' : '100px')};
  width: 30%;

  border-radius: 20px;
  border: none;
  outline: none;
  cursor: auto;


  font-family: "Title";
  -webkit-text-stroke: 2px rgb(100,0,0);
  text-shadow: blue 2px 5px;
  font-size:${props => (props.isTabletOrMobile === true ? 'calc(25px + 0.5vw)' : 'calc(40px + 1vw)')};
  color:red;

  border: 4px solid;
  border-color: red;
  background-color: Transparent;
  background-repeat:no-repeat;
  box-shadow: 5px 8px 2px 1px blue;
  :hover{
    border-color: tomato;
    color:tomato;
    text-shadow: rgb(0, 76, 255) 2px 5px;
    box-shadow: 5px 8px 2px 1px rgb(0, 76, 255);
  }

`;

export const Title = styled.div`
  font-family: "Title";
  -webkit-text-stroke: 2px rgb(100,0,0);
  text-shadow: blue 2px 5px;
  color:rgb(255, 0, 0);
  border-color: red;
  font-size:${props => (props.isTabletOrMobile === true ? 'calc(50px + 0.5vw)' : 'calc(100px + 1vw)')};
`;



export default MButton;