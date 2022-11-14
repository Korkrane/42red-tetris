import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { useInterval } from '../hooks/useInterval';
import { Box } from '@mui/system';

import MiniTetrisGrid from './MiniStage';
import TetrisGrid from './Stage';
import Display from './Display';
import { socket } from './Menu';


const Tetris = ({start, name, game, me, setCounter}) => {
    const location = useLocation();
    const [dropTime, setDropTime] = useState(null);

    useEffect(() => {

        if (start === true) {
            console.log('should set drop time');
            setDropTime(1000);
        }
    }, [start, setCounter])

    useEffect(() => {
        setDropTime(1000 / (game.level + 1) + 400);
    }, [game.level])

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
        // console.log(keyCode, name, Object.values(me)[0], me);
        if (me === name && start === true)
            socket.emit("move", {keyCode:keyCode, roomId: location.state.roomId});
    };

    return (
        <Box
            id="indivTetris"
            tabIndex="0"
            onKeyDown={e => move(e)}
            sx={{ outline:'none', flexGrow: 1, maxWidth: '100%', alignItems: 'center', justifyContent: 'center', display: 'flex' }}
        >
            {game.gameOver ? (
                <div>
                    <Display text={`Player: ${game.playerName}`} />
                    <Display text={`Score: ${game.score}`} />
                    <Display text={`rows: ${game.rows}`} />
                    <Display text={`Level: ${game.level}`} />
                </div>)
                :
                (<TetrisGrid stage={game.stage} />)
            }
            <Box sx={{
                width: '100%',
                maxWidth: '200px',
                display: 'block',
                padding: '0 20px',
            }}>
                {game.gameOver ? (
                   null
                ) : (
                    <div>
                        <Display text={`Player: ${game.playerName}`} />
                        <Display text={`Score: ${game.score}`} />
                        <Display text={`rows: ${game.rows}`} />
                        <Display text={`Level: ${game.level}`} />
                        <MiniTetrisGrid stage={game.miniStage} />
                    </div>

                )}
            </Box>
        </Box>
    );
};

export default Tetris;