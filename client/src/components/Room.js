import { useEffect, useState } from 'react';
import {useLocation, useNavigate} from 'react-router-dom';
import { socket } from './Menu'
import { Box } from '@mui/system';
import PlayArea from './PlayArea';
import RoomDetails from './RoomDetails';

const Room = () => {

    const [players, setPlayers] = useState([]);
    const location = useLocation();
    const navigate = useNavigate();
    const [once, setOnce] = useState(false);
    const [gameEnd, setGameEnd] = useState(false);
    const [gameStarted, setGameStarted] = useState(false);

    useEffect(() => {
        socket.on('playersInRoom', (data) => {
            console.log('playersInRoom event received', data);
            setPlayers(data);
        })

        if(once === false)
        {
            if(location.state.soloGameMode === true)
                socket.emit('readyToPlay', { roomId: location.state.roomId });
            else
                socket.emit("getPlayers", { roomId: location.state.roomId });
        }
        setOnce(true);

        return () => {
            socket.off('playersInRoom');
        };
    }, [location.state.roomId, once, players])

    const leaveRoom = () => {
        console.log('you leave room ' + location.state.roomId);
        socket.emit("leaveRoom", { id: location.state.roomId });
        navigate('/');
    }

    return (
        <>
            <Box sx={{ display: 'flex', maxHeight: '100%', minHeight: '100%', minWidth: '100%', justifyContent: 'flex-start'}}>
                <RoomDetails me={location.state.userName}  players={players} leaveRoom={leaveRoom} soloGameMode={location.state.soloGameMode} gameEnd={gameEnd} gameStarted={gameStarted} />
                <PlayArea me={location.state.userName} soloGameMode={location.state.soloGameMode} setGameEnd={setGameEnd} setGameStarted={setGameStarted} />
            </Box>
        </>
    );
}

export default Room;