import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { useInterval } from '../hooks/useInterval';
import { Box } from '@mui/system';

import MiniTetrisGrid from './MiniStage';
import TetrisGrid from './Stage';
import Display from './Display';
import { socket } from './Menu';


const Tetris = ({start, name, game, me}) => {
    const location = useLocation();
    const [dropTime, setDropTime] = useState(null);

    useEffect(() => {
        if (start === true)
            setDropTime(500);
    }, [start])

    useEffect(() => {
        setDropTime(500 / (game.level + 1) + 400);
    }, [game.level])

    const drop = () => {
        if (start === true && me === name && !game.gameOver)
        {
            console.log("emit drop");
            socket.emit("drop", { id: location.state.roomId });
        }
    };

    useInterval(() => {
        if(!game.gameOver)
            drop();
    }, dropTime);

    const move = ({ keyCode }) => {
        if (me === name && start === true && !game.gameOver)
        {
            console.log("emit move");
            socket.emit("move", { keyCode: keyCode, id: location.state.roomId });
        }
    };

    return (
        <Box
            id="indivTetris"
            tabIndex="0"
            onKeyDown={e => move(e)}
            sx={{
                outline:'none',
                flexGrow: 1,
                maxWidth: '100%',
                alignItems: 'center',
                justifyContent: 'center',
                display: 'flex'}}
        >
            <TetrisGrid stage={game.stage} />
            <Box sx={{
                width: '100%',
                maxWidth: '200px',
                display: 'block',
                padding: '0 20px'}}
            >
                <div >
                    <Display text={`Player: ${game.playerName}`} />
                    <Display text={`Score: ${game.score}`} />
                    <Display text={`rows: ${game.rows}`} />
                    <Display text={`Level: ${game.level}`} />
                    <MiniTetrisGrid stage={game.miniStage} />
                </div>
            </Box>
        </Box>
    );
};

export default Tetris;