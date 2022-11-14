import { Box} from '@mui/system';
import Tetris from './Tetris';
import { useEffect, useState } from 'react';
import {useLocation} from 'react-router-dom';
import { socket } from './Menu'
import { Title } from './Button';

const PlayArea = ({me, soloGameMode}) => {

    const [games, setGames] = useState([]);
    const [once, setOnce] = useState(false);
    const [start, setStart] = useState(false);
    const location = useLocation();
    const [counter, setCounter] = useState(0);

    useEffect(() => {
        counter > 0 && setTimeout(() => setCounter(counter - 1), 1000);
        return () => {
        };
    }, [counter, soloGameMode])

    useEffect(() => {

        socket.on('gamesInRoom', (data) => {
            setGames(data);
        })

        socket.on('playerMoved', (data) => {
            setGames(data);
        })

        socket.on('gameStart', (data) => {
            setStart(true);
            setCounter(5);
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
    }, [games, location.state.roomId, once])

    return(
        <>
            {counter !== 0
            ? <Title style={{textAlign: 'center', marginLeft: 'auto', marginRight: 'auto', marginTop: 'auto', marginBottom: 'auto' }}>{counter}</Title>
            : start === true
                    ? <>
                        <Box id='PlayArea' m={2} sx={{ display: 'flex', flex: '100%', flexWrap: 'wrap', flexGrow: 1, borderRadius: 5, /*backgroundColor: "#fb44"*/ }}>
                            {games.map((item, index) => (
                                <Tetris key={item.playerName + index} start={start} name={item.playerName} game={item} me={me} setCounter={setCounter}/>
                            ))}
                        </Box>
                        </>
                    : null
            }
        </>
    );
}

export default PlayArea;