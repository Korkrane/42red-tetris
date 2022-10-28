import React, { useEffect, useState } from 'react';

import { checkCollision } from '../gameHelpers';

// Custom Hooks
import { useInterval } from '../hooks/useInterval';
import { usePlayer } from '../hooks/usePlayer';
import { useStage } from '../hooks/useStage';
import { useGameStatus } from '../hooks/useGameStatus';
import { useLocation, useNavigate } from 'react-router-dom';

// Components
import TetrisGrid from './Stage';
import Display from './Display';
import { socket } from './Menu'
import { Box } from '@mui/system';

const Tetris = ({name, details}) => {
    // const [dropTime, setDropTime] = useState(null);
    // const [gameOver, setGameOver] = useState(false);

    // const [player, updatePlayerPos, resetPlayer, playerRotate] = usePlayer();
    // const [stage, setStage, rowsCleared] = useStage(client, player, resetPlayer);
    // const [score, setScore, rows, setRows, level, setLevel] = useGameStatus(
    //     rowsCleared
    // );

    // const location = useLocation();

    // const movePlayer = dir => {
    //     if (!checkCollision(player, stage, { x: dir, y: 0 })) {
    //         updatePlayerPos({ x: dir, y: 0 });
    //     }
    // };

    const keyUp = ({ keyCode }) => {
        // if (!gameOver) {
        //     // Activate the interval again when user releases down arrow.
        //     if (keyCode === 40) {
        //         setDropTime(1000 / (level + 1));
        //     }
        // }
    };

    // const startGame = () => {
    //     // Reset everything
    //     setStage(client.stage); //before was createSStage();
    //     setDropTime(1000);
    //     resetPlayer();
    //     setScore(0);
    //     setLevel(0);
    //     setRows(0);
    //     setGameOver(false);
    // };

    // const drop = () => {
    //     // Increase level when player has cleared 10 rows
    //     if (rows > (level + 1) * 10) {
    //         setLevel(prev => prev + 1);
    //         // Also increase speed
    //         setDropTime(1000 / (level + 1) + 200);
    //     }

    //     if (!checkCollision(player, stage, { x: 0, y: 1 })) {
    //         updatePlayerPos({ x: 0, y: 1, collided: false });
    //     } else {
    //         // Game over!
    //         if (player.pos.y < 1) {
    //             console.log('GAME OVER!!!');
    //             setGameOver(true);
    //             // setDropTime(null);
    //         }
    //         updatePlayerPos({ x: 0, y: 0, collided: true });
    //     }
    // };

    // const dropPlayer = () => {
    //     // We don't need to run the interval when we use the arrow down to
    //     // move the tetromino downwards. So deactivate it for now.
    //     setDropTime(null);
    //     drop();
    // };

    // // This one starts the game
    // // Custom hook by Dan Abramov
    // useInterval(() => {
    //     drop();
    // }, dropTime);

    // const move = ({ keyCode }) => {
    //     socket.emit("playerMove", { name: client.name, keyCode: keyCode, lobbyId: location.state.lobbyId, player:player, stage:stage });
    //     // if (!gameOver) {
    //     //     if (keyCode === 37) {
    //     //         movePlayer(-1);
    //     //     } else if (keyCode === 39) {
    //     //         movePlayer(1);
    //     //     } else if (keyCode === 40) {
    //     //         dropPlayer();
    //     //     } else if (keyCode === 38) {
    //     //         playerRotate(stage, 1);
    //     //     }
    //     // }
    // };



    // useEffect(() => {
    //     socket.on('gameStart', (data) => {
    //         startGame();
    //     })

    //     return () => {
    //         socket.off('gameStart');
    //     };
    // }, [startGame])

    console.log('re-render');
    console.log(details);
    return (
        <Box
            id="indivTetris"
            role="button"
            tabIndex="0"
            // onKeyDown={e => move(e)}
            onKeyUp={keyUp}
            sx={{ border: 1, borderRadius: 5, flexGrow: 1, maxWidth: '100%', alignItems: 'center', justifyContent: 'center', display: 'flex' }}
        >
            {/* <TetrisGrid stage={stage} /> */}
            <Box sx={{
                width: '100%',
                maxWidth: '200px',
                display: 'block',
                padding: '0 20px'
            }}>
                {/* {gameOver ? (
                    <Display gameOver={gameOver} text="Game Over" />
                ) : (
                    <div>
                        <Display text={`Player: ${name}`} />
                        <Display text={`Score: ${score}`} />
                        <Display text={`rows: ${rows}`} />
                        <Display text={`Level: ${level}`} />
                    </div>
                )} */}
            </Box>
        </Box>
    );
};

export default Tetris;