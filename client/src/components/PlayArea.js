import { Box} from '@mui/system';
import Tetris from './Tetris';
import { useEffect, useState } from 'react';
import {useLocation} from 'react-router-dom';
import { socket } from './Menu'

const PlayArea = (me) => {

    const [games, setGames] = useState([]);
    const [once, setOnce] = useState(false);
    const [start, setStart] = useState(false);
    const location = useLocation();

    useEffect(() => {

        socket.on('gamesInRoom', (data) => {
            setGames(data);
        })

        socket.on('playerMoved', (data) => {
            setGames(data);
        })

        socket.on('gameStart', (data) => {
            setStart(true);
        })

        if (once === false) {
            console.log('should pop once games');
            socket.emit("getGames", { roomId: location.state.roomId });
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
            <Box id='PlayArea' m={2} sx={{ display: 'flex', flex: '100%', flexWrap: 'wrap', flexGrow: 1, borderRadius: 5, /*backgroundColor: "#fb44"*/ }}>
                {games.map((item, index) => (
                    <Tetris key={item.playerName + index} start={start} name={item.playerName} game={item} me={me}/>
                ))}
            </Box>
        </>
    );
}

export default PlayArea;