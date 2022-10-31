import { Box} from '@mui/system';
import Tetris from './Tetris';
import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { socket } from './Menu'

import { useInterval } from '../hooks/useInterval';
import { usePlayer } from '../hooks/usePlayer';
import { useStage } from '../hooks/useStage';
import { useGameStatus } from '../hooks/useGameStatus';
import TetrisGrid from './Stage';
import Display from './Display';

const PlayArea = ({players}) => {

    const log = console.log.bind(console);
    const [games, setGames] = useState([]);
    const [playerGame, setPlayerGame] = useState();
    const [once, setOnce] = useState(false);
    const location = useLocation();

    const [gameOver, setGameOver] = useState(false);
    const [player, updatePlayerPos, resetPlayer, playerRotate] = usePlayer();
    const [stage, setStage, rowsCleared] = useStage(player, resetPlayer);
    const [score, setScore, rows, setRows, level, setLevel] = useGameStatus(rowsCleared);
    // const startGame = () => {
    //     // Reset everything
    //     // setStage(client.stage); //before was createSStage();
    //     // setDropTime(1000);
    //     resetPlayer();
    //     // setScore(0);
    //     // setLevel(0);
    //     // setRows(0);
    //     // setGameOver(false);
    // };

    useEffect(() => {

        socket.on('gamesInLobby', (data) => {
            log('gamesInLobby event received');
            log(data);
            setGames(data);
        })

        socket.on('getIndividualGame', (data) => {
            log('indivgame event received');
            log(data);
            setPlayerGame(data);
        })

        socket.on('playerMoved', (data) => {
            log('playerMoved event received');
            log(data);
            setGames(data);
        })

        socket.on('gameStart', (data) => {
            log('game gonna start');
                // startGame();
                        // Reset everything
            // setStage(playerGame.stage); //before was createSStage();
            // // setDropTime(1000);
            resetPlayer();
            setScore(0);
            setLevel(0);
            setRows(0);
            setGameOver(false);
        })


        if (once === false) {
            log('should pop once games');
            socket.emit("getGames", { lobbyId: location.state.lobbyId });
            socket.emit("getIndividualGame", { lobbyId: location.state.lobbyId });
        }
        setOnce(true);

        return () => {
            socket.off('gamesInLobby');
            socket.off('getGames');
            socket.off('playerMoved');
            socket.off('gameStart');
            socket.off('getIndividualGame');
        };
    }, [games, location.state.lobbyId, once, log])

    const keyUp = (event) => {
        // log(event.keyCode)
        // if (!gameOver) {
        //     // Activate the interval again when user releases down arrow.
        //     if (keyCode === 40) {
        //         setDropTime(1000 / (level + 1));
        //     }
        // }
    };

    const move = (event) => {
        // console.log(event.keyCode)
        if(event.keyCode >= 37 && event.keyCode <= 40)
            socket.emit("playerMove", {keyCode: event.keyCode, lobbyId: location.state.lobbyId});
    };

    const gameInfo = (details) => {
        log(details);
    }
    // console.log('render playarea');
    return(
        <>
            <Box tabIndex="0" onKeyUp={e => keyUp(e)} onKeyDown={e => move(e)}  id='PlayArea' m={2} sx={{ display: 'flex', flex: '100%', flexWrap: 'wrap', flexGrow: 1, borderRadius: 5, backgroundColor: "#fb44" }}>
                {games.map((item, index) => (
                    // <Tetris key={item.playerName + index} name={item.playerName} details={item}/>
                    <Box
                        id="indivTetris"
                        // role="button"
                        // onKeyDown={e => move(e)}
                        // onKeyUp={keyUp}
                        // onKeyUp={e => keyUp(e)}
                        sx={{ border: 1, borderRadius: 5, flexGrow: 1, maxWidth: '100%', alignItems: 'center', justifyContent: 'center', display: 'flex' }}
                    >
                        <TetrisGrid stage={item.stage} />
                        <div>{item.playerName} pressed {item.keyCode}</div>
                        <button onClick={() => gameInfo(item)}>game item</button>
                        <Box sx={{
                            width: '100%',
                            maxWidth: '200px',
                            display: 'block',
                            padding: '0 20px'
                        }}>
                            {item.gameOver ? (
                                <Display gameOver={item.gameOver} text="Game Over" />
                            ) : (
                                <div>
                                    <Display text={`Player: ${item.playerName}`} />
                                    <Display text={`Score: ${item.score}`} />
                                    <Display text={`rows: ${item.rows}`} />
                                    <Display text={`Level: ${item.level}`} />
                                </div>
                            )}
                        </Box>
                    </Box>
                ))}
            </Box>
        </>
    );
}

export default PlayArea;