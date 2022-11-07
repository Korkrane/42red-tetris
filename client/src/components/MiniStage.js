import React from 'react';
import { StyledMiniStage } from './styles/StyledMiniStage';

import Cell from './Cell';

const MiniTetrisGrid = ({ stage }) => (
    <StyledMiniStage width={stage[0].length} height={stage.length}>
        {stage.map(row => row.map((cell, x) => <Cell key={x} type={cell[0]} />))}
    </StyledMiniStage>
);

export default MiniTetrisGrid;