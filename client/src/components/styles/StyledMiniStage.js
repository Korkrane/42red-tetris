import styled from 'styled-components';

export const StyledMiniStage = styled.div`
  display: grid;
  grid-template-rows: repeat(${props => props.height},1fr));
  grid-template-columns: repeat(${props => props.width}, 1fr);
  grid-gap: 1px;
  // border: 4px solid #999;
  // width: 100%;
  // max-width: 20vw;
  // min-width:50;
  background: #111;
`;