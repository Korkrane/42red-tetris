import { Box} from '@mui/system';
import Tetris from './Tetris';
import { useEffect, useState } from 'react';
import {useLocation} from 'react-router-dom';
import { socket } from './Menu'

const PlayArea = ({players}) => {

    const [games, setGames] = useState([]);
    const [once, setOnce] = useState(false);
    const location = useLocation();

    useEffect(() => {

        socket.on('gamesInRoom', (data) => {
            console.log('gamesInRoom event received');
            console.log(data);
            setGames(data);
        })

        // socket.on('playerMoved', (data) => {
        //     console.log('playerMoved event received');
        //     console.log(data);
        //     setGames(data);
        // })

        if (once === false) {
            console.log('should pop once games');
            socket.emit("getGames", { roomId: location.state.roomId });
        }
        setOnce(true);

        return () => {
            socket.off('gamesInRoom');
            socket.off('getGames');
            socket.off('playerMoved');
        };
    }, [games, location.state.roomId, once])

    const move = (event) => {
        console.log(event.keyCode)
        socket.emit("playerMove", {keyCode: event.keyCode, roomId: location.state.lobbyId});
    };

    return(
        <>
            <Box tabIndex="0" onKeyDown={e => move(e)} id='PlayArea' m={2} sx={{ display: 'flex', flex: '100%', flexWrap: 'wrap', flexGrow: 1, borderRadius: 5, backgroundColor: "#fb44" }}>
                {players.map((item, index) => (
                    <Tetris key={item.name + index} name={item.name} />
                ))}
            </Box>
        </>
    );
}

export default PlayArea;