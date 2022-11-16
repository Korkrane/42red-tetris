import { Box} from '@mui/system';
import Tetris from './Tetris';
import { useEffect, useState } from 'react';
import {useLocation} from 'react-router-dom';
import { socket } from './Menu'
import { Title } from './Button';
import { useMediaQuery } from 'react-responsive';

const PlayArea = ({ me, soloGameMode, setGameEnd, setGameStarted }) => {

    const [games, setGames] = useState([]);
    const [once, setOnce] = useState(false);
    const [start, setStart] = useState(false);
    const location = useLocation();
    const [counter, setCounter] = useState(0);
    const [winner, setWinner] = useState('');
    const [winnerScore, setWinnerscore] = useState(0);

    useEffect(() => {
        counter > 0 && setTimeout(() => setCounter(counter - 1), 1000);
    }, [counter])

    useEffect(() => {
        socket.on('gameEnd', (...data) => {
            console.log('gameEnd');
            setWinner(data[0]);
            setWinnerscore(data[1]);
            setGameEnd(true);
        })

        return () => {
            socket.off('gameEnd');
        }
    }, [setWinner, setGameEnd])

    useEffect(() => {
        socket.on('gameReseted', (data) => {
            console.log('gameReseted');
        })

        return () => {
            socket.off('gameReseted');
        }
    }, [games])

    useEffect(() => {

        socket.on('gamesInRoom', (data) => {
            console.log('received gamesInRoom');
            setGames(data);
        })

        socket.on('playerMoved', (data) => {
            setGames(data);
        })

        socket.on('gameStart', (data) => {
            console.log('gameStart event received');
            setWinner('');
            setStart(true);
            setGameStarted(true);
            setCounter(3);
        })


        if (once === false) {
            console.log('should pop once games');
            socket.emit("getGames", { roomId: location.state.roomId });
            if (soloGameMode === true)
                setCounter(5);
        }
        setOnce(true);

        return () => {
            socket.off('gamesInRoom');
            socket.off('playerMoved');
            socket.off('gameStart');
        };
    }, [games, location.state.roomId, once, soloGameMode, counter, setGameStarted, setStart,setCounter])

    const isTabletOrMobile = useMediaQuery({ maxWidth: 1024 })
    return(
        <>
            {
                winner !== ''
                ? soloGameMode === true
                        ? <Title isTabletOrMobile={isTabletOrMobile} style={{ textAlign: 'center', marginLeft: 'auto', marginRight: 'auto', marginTop: 'auto', marginBottom: 'auto' }}><span style={{ color: 'white' }}>score: </span>{winnerScore} pts</Title>
                        : <Title isTabletOrMobile={isTabletOrMobile} style={{ textAlign: 'center', marginLeft: 'auto', marginRight: 'auto', marginTop: 'auto', marginBottom: 'auto' }}>{winner} <span style={{ color: 'white' }}>has won with</span> {winnerScore} <span style={{ color: 'white' }}>pts</span></Title>
                : counter !== 0
                        ? <Title isTabletOrMobile={isTabletOrMobile} style={{ textAlign: 'center', marginLeft: 'auto', marginRight: 'auto', marginTop: 'auto', marginBottom: 'auto' }}>{counter}</Title>
                        : start === true
                            ? <>
                                <Box id='PlayArea' m={2} sx={{ display: 'flex', flex: '100%', flexWrap: 'wrap', flexGrow: 1, borderRadius: 5}}>
                                    {games.map((item, index) => (
                                        <Tetris key={item.playerName + index} start={start} name={item.playerName} game={item} me={me}/>
                                    ))}
                                </Box>
                            </>
                            : null
            }

        </>
    );
}

export default PlayArea;