import React, { useEffect, useState, useCallback } from 'react';
import { TETROMINOS, randomTetromino } from '../tetrominos';
import { STAGE_WIDTH, checkCollision, createStage } from '../gameHelpers';
import { useLocation } from 'react-router-dom';

// Custom Hooks
import { useInterval } from '../hooks/useInterval';
// import { useStage } from '../hooks/useStage';
// import { useGameStatus } from '../hooks/useGameStatus';

// Components
import TetrisGrid from './Stage';
import Display from './Display';
import { socket } from './Menu'
import { Box } from '@mui/system';

const Tetris = ({name, game, me}) => {
    const location = useLocation();
    const [dropTime, setDropTime] = useState(null);
    // const [gameOver, setGameOver] = useState(false);

    ////USEPLAYER
    // const [player, updatePlayerPos, resetPlayer, playerRotate] = usePlayer();
    // const [player, setPlayer] = useState(game.player);

    // const rotate = (matrix, dir) => {
    //     // Make the rows to become cols (transpose)
    //     const rotatedTetro = matrix.map((_, index) =>
    //         matrix.map(col => col[index]),
    //     );
    //     // Reverse each row to get a rotated matrix
    //     if (dir > 0) return rotatedTetro.map(row => row.reverse());
    //     return rotatedTetro.reverse();
    // };

    // const playerRotate = (stage, dir) => {
    //     const clonedPlayer = JSON.parse(JSON.stringify(player));
    //     clonedPlayer.tetromino = rotate(clonedPlayer.tetromino, dir);

    //     const pos = clonedPlayer.pos.x;
    //     let offset = 1;
    //     while (checkCollision(clonedPlayer, stage, { x: 0, y: 0 })) {
    //         clonedPlayer.pos.x += offset;
    //         offset = -(offset + (offset > 0 ? 1 : -1));
    //         if (offset > clonedPlayer.tetromino[0].length) {
    //             rotate(clonedPlayer.tetromino, -dir);
    //             clonedPlayer.pos.x = pos;
    //             return;
    //         }
    //     }
    //     setPlayer(clonedPlayer);
    // };

    // const updatePlayerPos = ({ x, y, collided }) => {
    //     setPlayer(prev => ({
    //         ...prev,
    //         pos: { x: (prev.pos.x += x), y: (prev.pos.y += y) },
    //         collided,
    //     }));
    //     // socket.emit('playerUpdate', { player: player, roomId: location.state.roomId });
    // };

    // const resetPlayer = useCallback(() => {
    //     setPlayer({
    //         pos: { x: STAGE_WIDTH / 2 - 2, y: 0 },
    //         tetromino: game.tetromino.shape,
    //         // tetromino: randomTetromino().shape,
    //         collided: false,
    //     });
    // }, []);

    // const [stage, setStage, rowsCleared] = useStage(player, resetPlayer);
    /////USESTAGE
    // const [stage, setStage] = useState(game.stage);
    // const [rowsCleared, setRowsCleared] = useState(0);

    useEffect(() => {
        console.log('emit playerupdate')
        socket.emit("playerUpdate", {roomId: location.state.roomId });
    }, [location.state.roomId]);

    ////USEGAME
    // const [score, setScore, rows, setRows, level, setLevel] = useGameStatus(
    //     rowsCleared
    // );
    // const [score, setScore] = useState(game.score);
    // const [rows, setRows] = useState(game.rows);
    // const [level, setLevel] = useState(game.level);

    // const linePoints = [40, 100, 300, 1200];

    // const calcScore = useCallback(() => {
    //     // We have score
    //     if (rowsCleared > 0) {
    //         // This is how original Tetris score is calculated
    //         setScore(prev => prev + linePoints[rowsCleared - 1] * (level + 1));
    //         setRows(prev => prev + rowsCleared);
    //     }
    // }, [level, linePoints, rowsCleared]);

    // useEffect(() => {
    //     calcScore();
    // }, [calcScore, rowsCleared, score]);

    // const movePlayer = dir => {
    //     if (!checkCollision(player, stage, { x: dir, y: 0 })) {
    //         updatePlayerPos({ x: dir, y: 0 });
    //     }
    // };

    // const keyUp = ({ keyCode }) => {
    //     if (!gameOver) {
    //         // Activate the interval again when user releases down arrow.
    //         if (keyCode === 40) {
    //             setDropTime(1000 / (level + 1));
    //         }
    //     }
    // };

    const startGame = () => {
        setDropTime(1000);
    };

    const drop = () => {
        console.log("emit rawdrop");
        socket.emit("rawDrop", {roomId: location.state.roomId});
    };

    useInterval(() => {
        drop();
    }, dropTime);

    const move = ({ keyCode }) => {
        if (Object.values(me)[0] === name)
            socket.emit("move", {keyCode:keyCode, roomId: location.state.roomId});
    };

    useEffect(() => {
        socket.on('gameStart', (data) => {
            console.log("game gonna start");
            startGame();
        })

        return () => {
            socket.off('gameStart');
        };
    }, [startGame])

    return (
        <Box
            id="indivTetris"
            role="button"
            tabIndex="0"
            onKeyDown={e => move(e)}
            /*onKeyUp={keyUp}*/
            sx={{ border: 1, borderRadius: 5, flexGrow: 1, maxWidth: '100%', alignItems: 'center', justifyContent: 'center', display: 'flex' }}
        >
            <TetrisGrid stage={game.stage} />
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
                    </div>
                )}
            </Box>
        </Box>
    );
};

export default Tetris;