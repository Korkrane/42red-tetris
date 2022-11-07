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
    const [gameOver, setGameOver] = useState(false);

    ////USEPLAYER
    // const [player, updatePlayerPos, resetPlayer, playerRotate] = usePlayer();
    const [player, setPlayer] = useState(game.player);

    const rotate = (matrix, dir) => {
        // Make the rows to become cols (transpose)
        const rotatedTetro = matrix.map((_, index) =>
            matrix.map(col => col[index]),
        );
        // Reverse each row to get a rotated matrix
        if (dir > 0) return rotatedTetro.map(row => row.reverse());
        return rotatedTetro.reverse();
    };

    const playerRotate = (stage, dir) => {
        const clonedPlayer = JSON.parse(JSON.stringify(player));
        clonedPlayer.tetromino = rotate(clonedPlayer.tetromino, dir);

        const pos = clonedPlayer.pos.x;
        let offset = 1;
        while (checkCollision(clonedPlayer, stage, { x: 0, y: 0 })) {
            clonedPlayer.pos.x += offset;
            offset = -(offset + (offset > 0 ? 1 : -1));
            if (offset > clonedPlayer.tetromino[0].length) {
                rotate(clonedPlayer.tetromino, -dir);
                clonedPlayer.pos.x = pos;
                return;
            }
        }
        setPlayer(clonedPlayer);
    };

    const updatePlayerPos = ({ x, y, collided }) => {
        setPlayer(prev => ({
            ...prev,
            pos: { x: (prev.pos.x += x), y: (prev.pos.y += y) },
            collided,
        }));
        // socket.emit('playerUpdate', { player: player, roomId: location.state.roomId });
    };

    const resetPlayer = useCallback(() => {
        setPlayer({
            pos: { x: STAGE_WIDTH / 2 - 2, y: 0 },
            tetromino: game.tetromino.shape,
            // tetromino: randomTetromino().shape,
            collided: false,
        });
    }, []);

    // const [stage, setStage, rowsCleared] = useStage(player, resetPlayer);
    /////USESTAGE
    const [stage, setStage] = useState(game.stage);
    const [rowsCleared, setRowsCleared] = useState(0);

    useEffect(() => {
        setRowsCleared(0);

        const sweepRows = newStage =>
            newStage.reduce((ack, row) => {
                if (row.findIndex(cell => cell[0] === 0) === -1) {
                    setRowsCleared(prev => prev + 1);
                    ack.unshift(new Array(newStage[0].length).fill([0, 'clear']));
                    return ack;
                }
                ack.push(row);
                return ack;
            }, [])

        // First flush the stage
        const newStage = stage.map(row =>
            row.map(cell => (cell[1] === 'clear' ? [0, 'clear'] : cell)),
        );
        // Then draw the tetromino
        player.tetromino.forEach((row, y) => {
            row.forEach((value, x) => {
                if (value !== 0) {
                    newStage[y + player.pos.y][x + player.pos.x] = [
                        value,
                        `${player.collided ? 'merged' : 'clear'}`,
                    ];
                }
            });
        });
        // Then check if we collided
        if (player.collided) {
            console.log('gonna reset')
            resetPlayer();
            setStage(sweepRows(newStage));
        }
        setStage(newStage);
    }, [player, resetPlayer]);

    ////USEGAME
    // const [score, setScore, rows, setRows, level, setLevel] = useGameStatus(
    //     rowsCleared
    // );
    const [score, setScore] = useState(0);
    const [rows, setRows] = useState(0);
    const [level, setLevel] = useState(0);

    const linePoints = [40, 100, 300, 1200];

    const calcScore = useCallback(() => {
        // We have score
        if (rowsCleared > 0) {
            // This is how original Tetris score is calculated
            setScore(prev => prev + linePoints[rowsCleared - 1] * (level + 1));
            setRows(prev => prev + rowsCleared);
        }
    }, [level, linePoints, rowsCleared]);

    useEffect(() => {
        calcScore();
    }, [calcScore, rowsCleared, score]);

    const movePlayer = dir => {
        if (!checkCollision(player, stage, { x: dir, y: 0 })) {
            updatePlayerPos({ x: dir, y: 0 });
        }
    };

    const keyUp = ({ keyCode }) => {
        if (!gameOver) {
            // Activate the interval again when user releases down arrow.
            if (keyCode === 40) {
                setDropTime(1000 / (level + 1));
            }
        }
    };

    const startGame = () => {
        // Reset everything
        setStage(game.stage);
        setDropTime(1000);
        resetPlayer();
        setScore(0);
        setLevel(0);
        setRows(0);
        setGameOver(false);
    };

    const drop = () => {
        // Increase level when player has cleared 10 rows
        if (rows > (level + 1) * 10) {
            setLevel(prev => prev + 1);
            // Also increase speed
            setDropTime(1000 / (level + 1) + 200);
        }

        if (!checkCollision(player, stage, { x: 0, y: 1 })) {
            updatePlayerPos({ x: 0, y: 1, collided: false });
        } else {
            // Game over!
            if (player.pos.y < 1) {
                console.log('GAME OVER!!!');
                setGameOver(true);
                setDropTime(null);
            }
            updatePlayerPos({ x: 0, y: 0, collided: true });
        }
    };

    const dropPlayer = () => {
        // We don't need to run the interval when we use the arrow down to
        // move the tetromino downwards. So deactivate it for now.
        setDropTime(null);
        drop();
    };

    // This one starts the game
    // Custom hook by Dan Abramov
    useInterval(() => {
        drop();
    }, dropTime);

    const move = ({ keyCode }) => {
        console.log(name);
        if (Object.values(me)[0] === name)
        {
            if (!gameOver) {
                if (keyCode === 37) {
                    movePlayer(-1);
                } else if (keyCode === 39) {
                    movePlayer(1);
                } else if (keyCode === 40) {
                    dropPlayer();
                } else if (keyCode === 38) {
                    playerRotate(stage, 1);
                }
            }
            console.log('before send:', stage)
            socket.emit("playerUpdate", { keyCode: keyCode, roomId: location.state.roomId, stage:stage });
        }
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

    console.log('game', game);
    console.log('render'); console.log('stage of ' + game.playerName, stage[0]);
    return (
        <Box
            id="indivTetris"
            role="button"
            tabIndex="0"
            onKeyDown={e => move(e)}
            /*onKeyUp={keyUp}*/
            sx={{ border: 1, borderRadius: 5, flexGrow: 1, maxWidth: '100%', alignItems: 'center', justifyContent: 'center', display: 'flex' }}
        >
            <TetrisGrid stage={stage} />
            <Box sx={{
                width: '100%',
                maxWidth: '200px',
                display: 'block',
                padding: '0 20px'
            }}>
                {gameOver ? (
                    <Display gameOver={gameOver} text="Game Over" />
                ) : (
                    <div>
                        <Display text={`Player: ${name}`} />
                        <Display text={`Score: ${score}`} />
                        <Display text={`rows: ${rows}`} />
                        <Display text={`Level: ${level}`} />
                        <Display text={`Key: ${game.keyCode}`} />
                    </div>
                )}
            </Box>
        </Box>
    );
};

export default Tetris;