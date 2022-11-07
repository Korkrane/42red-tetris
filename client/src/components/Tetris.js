import React, { useEffect, useState, useCallback } from 'react';
import { useLocation } from 'react-router-dom';
import { useInterval } from '../hooks/useInterval';
import TetrisGrid from './Stage';
import MiniTetrisGrid from './MiniStage';
import Display from './Display';
import { socket } from './Menu'
import { Box } from '@mui/system';

const Tetris = ({start, name, game, me}) => {
    const location = useLocation();
    const [dropTime, setDropTime] = useState(null);

    useEffect(() => {

        if (start === true) {
            console.log('should set drop time');
            setDropTime(1000);
        }
    }, [start])

    const drop = () => {
        if (start === true)
        {
            console.log("emit rawdrop");
            socket.emit("rawDrop", { roomId: location.state.roomId });
        }
    };

    useInterval(() => {
        if(!game.gameOver)
            drop();
    }, dropTime);

    const move = ({ keyCode }) => {
        if (Object.values(me)[0] === name && start === true)
            socket.emit("move", {keyCode:keyCode, roomId: location.state.roomId});
    };

    return (
        <Box
            id="indivTetris"
            role="button"
            tabIndex="0"
            onKeyDown={e => move(e)}
            /*onKeyUp={keyUp}*/
            sx={{ border: 1, borderRadius: 5, flexGrow: 1, maxWidth: '100%', alignItems: 'center', justifyContent: 'center', display: 'flex' }}
        >
            {game.gameOver ? null : (<TetrisGrid stage={game.stage} />)}
            <Box sx={{
                width: '100%',
                maxWidth: '200px',
                display: 'block',
                padding: '0 20px'
            }}>
                {game.gameOver ? (
                    <Display gameOver={game.gameOver} text="Game Over" />
                ) : (
                    <div>
                        <Display text={`Player: ${game.playerName}`} />
                        <Display text={`Score: ${game.score}`} />
                        <Display text={`rows: ${game.rows}`} />
                        <Display text={`Level: ${game.level}`} />
                        <Display text={`Key: ${game.keyCode}`} />
                        <MiniTetrisGrid stage={game.miniStage} />
                    </div>

                )}
            </Box>
        </Box>
    );
};

export default Tetris;