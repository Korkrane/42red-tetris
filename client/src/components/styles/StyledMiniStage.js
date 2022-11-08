import styled from 'styled-components';

export const StyledMiniStage = styled.div`
  display: grid;
  grid-template-rows: repeat(
    ${props => props.height},25px
  );
  width: 50%;
  grid-template-columns: repeat(${props => props.width}, 1fr);
  grid-gap: 1px;
  background: #111;
  margin: 0 auto;
`;