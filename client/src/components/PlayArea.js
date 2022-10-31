import { Box} from '@mui/system';
import Tetris from './Tetris';
import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { socket } from './Menu'

const PlayArea = ({players}) => {

    const [games, setGames] = useState([]);
    const [lastkey, setKey] = useState();
    const [once, setOnce] = useState(false);
    const location = useLocation();

    useEffect(() => {

        socket.on('gamesInLobby', (data) => {
            console.log('gamesInLobby event received');
            console.log(data);
            setGames(data);
        })

        socket.on('playerMoved', (data) => {
            console.log('playerMoved event received');
            console.log(data);
            setGames(data);
        })

        if (once === false) {
            console.log('should pop once games');
            socket.emit("getGames", { lobbyId: location.state.lobbyId });
        }
        setOnce(true);

        return () => {
            socket.off('gamesInLobby');
            socket.off('getGames');
            socket.off('playerMoved');
        };
    }, [games, location.state.lobbyId, once])

    const keyUp = (event) => {
        console.log(event.keyCode)
        // if (!gameOver) {
        //     // Activate the interval again when user releases down arrow.
        //     if (keyCode === 40) {
        //         setDropTime(1000 / (level + 1));
        //     }
        // }
    };

    const move = (event) => {
        console.log(event.keyCode)
        socket.emit("playerMove", {keyCode: event.keyCode, lobbyId: location.state.lobbyId});
    };

    console.log('render playarea');
    return(
        <>
            <Box tabIndex="0" onKeyUp={e => keyUp(e)} onKeyDown={e => move(e)}  id='PlayArea' m={2} sx={{ display: 'flex', flex: '100%', flexWrap: 'wrap', flexGrow: 1, borderRadius: 5, backgroundColor: "#fb44" }}>
                {games.map(item => (
                    <Tetris name={item.playerName} details={item}/>
                ))}
            </Box>
        </>
    );
}

export default PlayArea;