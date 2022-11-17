import { Box} from '@mui/system';
import Tetris from './Tetris';
import { useEffect, useState } from 'react';
import {useLocation} from 'react-router-dom';
import { socket } from './Menu'
import { Title } from './Button';
import { useMediaQuery } from 'react-responsive';

const PlayArea = ({ me, soloGameMode, setGameEnd, setGameStarted, gameStarted }) => {

    const location = useLocation();

    const [games, setGames] = useState([]);
    const [counter, setCounter] = useState(0);
    const [results, setResults] = useState({})

    useEffect(() => {
        counter > 0 && setTimeout(() => setCounter(counter - 1), 1000);
    }, [counter])

    useEffect(() => {
        socket.on('results', (data) => {
            console.log('results');
            setGameEnd(true);
            setResults(data)
        })

        return () => {
            socket.off('gameEnd');
        }
    }, [setGameEnd])

    useEffect(() => {
        socket.emit("getGames", { roomId: location.state.roomId });
        if (soloGameMode === true)
            setCounter(3);
    }, [])

    useEffect(() => {

        socket.on('gamesInRoom', (data) => {
            console.log('received gamesInRoom');
            setGames(data);
        })

        socket.on('playerMoved', (data) => {
            console.log('playerMoved data received');
            setGames(data);
        })

        socket.on('test', (data) => {
            console.log(data);
        })

        socket.on('gameStart', (data) => {
            console.log('gameStart event received');
            setResults({});
            setGameStarted(true);
            setCounter(3);
        })

        return () => {
            socket.off('gamesInRoom');
            socket.off('playerMoved');
            socket.off('gameStart');
            socket.off('test');
        };
    }, [games, location.state.roomId, soloGameMode, counter, setGameStarted,setCounter])

    const isTabletOrMobile = useMediaQuery({ maxWidth: 1024 })
    return(
        <>
            {
                results.name
                ? soloGameMode === true
                        ? <Title isTabletOrMobile={isTabletOrMobile} style={{ textAlign: 'center', marginLeft: 'auto', marginRight: 'auto', marginTop: 'auto', marginBottom: 'auto' }}><span style={{ color: 'white' }}>score: </span>{results.score} pts</Title>
                        : <Title isTabletOrMobile={isTabletOrMobile} style={{ textAlign: 'center', marginLeft: 'auto', marginRight: 'auto', marginTop: 'auto', marginBottom: 'auto' }}>{results.name} <span style={{ color: 'white' }}>has won with</span> {results.score} <span style={{ color: 'white' }}>pts</span></Title>
                : counter !== 0
                        ? <Title isTabletOrMobile={isTabletOrMobile} style={{ textAlign: 'center', marginLeft: 'auto', marginRight: 'auto', marginTop: 'auto', marginBottom: 'auto' }}>{counter}</Title>
                        : gameStarted === true
                            ? <>
                                <Box id='PlayArea' m={2} sx={{ display: 'flex', flex: '100%', flexWrap: 'wrap', flexGrow: 1, borderRadius: 5}}>
                                    {games.map((item, index) => (
                                        <Tetris key={item.playerName + index} start={gameStarted} name={item.playerName} game={item} me={me}/>
                                    ))}
                                </Box>
                            </>
                            : null
            }

        </>
    );
}

export default PlayArea;