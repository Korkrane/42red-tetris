
import styled from 'styled-components'

// const Button = ({ onClick}) => (
//   <StyledPlayButton onClick={onClick}>Solo</StyledPlayButton>
// )

// const JoinButton = ({ onClick}) => (
//   <StyledJoinButton onClick={onClick}>Join a game</StyledJoinButton>
// )

// const LeaveButton = ({ onClick}) => (
//   <StyledLeaveButton onClick={onClick}>Join a game</StyledLeaveButton>
// )

// const MultiButton = ({ onClick}) => (
//   <StyledMultiButton onClick={onClick}>Multiplayer</StyledMultiButton>
// )

const Button = styled.button`
  display:flexbox;
  justify-content:center;
  box-sizing: border-box;
  min-height: 100px;
  width: 30%;
  border-radius: 20px;
  border: none;
  color: white;
  background: #333;
  font-family: Pixel, Arial, Helvetica, sans-serif;
  font-size: 2rem;
  outline: none;
  cursor: pointer;
`;

export const JoinButton = styled(Button)`
  background: blue;
`;

export const CheckButton = styled(Button)`
  background: orange;
`;

export const LeaveButton = styled(Button)`
  background: red;
`;

export const SoloButton = styled(Button)`
  background: #333;
`;

export const MultiButton = styled(Button)`
  background: #333;
`;

export default Button;