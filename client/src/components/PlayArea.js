import { Box} from '@mui/system';
import Tetris from './Tetris';
import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { socket } from './Menu'

const PlayArea = () => {

    const [games, setGames] = useState([]);
    const [once, setOnce] = useState(false);
    const location = useLocation();

    useEffect(() => {

        socket.on('gamesInLobby', (data) => {
            console.log('gamesInLobby event received');
            console.log(data);
            setGames(data);
        })

        if (once === false) {
            console.log('should pop once games');
            socket.emit("getGames", { lobbyId: location.state.lobbyId });
        }
        setOnce(true);

        return () => {
            socket.off('getGames');
        };
    }, [])

    return(
        <>
            <Box id='PlayArea' m={2} sx={{ display: 'flex', flex: '100%', flexWrap: 'wrap', flexGrow: 1, borderRadius: 5, backgroundColor: "#fb44" }}>
                {games.map(item => (
                    <Tetris name={item.playerName} details={item}/>
                ))}
            </Box>
        </>
    );
}

export default PlayArea;