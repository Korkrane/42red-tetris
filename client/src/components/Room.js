import { useEffect, useState } from 'react';
import {useLocation, useNavigate} from 'react-router-dom';
import { socket } from './Menu'
import { Box } from '@mui/system';
import PlayArea from './PlayArea';
import RoomDetails from './RoomDetails';
import { useMediaQuery } from 'react-responsive';

const Room = () => {

    const [players, setPlayers] = useState([]);
    const location = useLocation();
    const navigate = useNavigate();
    const [once, setOnce] = useState(false);

    useEffect(() => {

        console.log('room',location.state.soloGameMode)
        socket.on('playersInRoom', (data) => {
            console.log('playersInRoom event received');
            console.log(data);
            setPlayers(data);
        })

        if(once === false)
        {
            console.log('should pop once');
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
        socket.emit("leaveRoom", { roomId: location.state.roomId });
        navigate('/');
    }

    return (
        <>
            <Box sx={{ display: 'flex', maxHeight: '100%', minHeight: '100%', minWidth: '100%', justifyContent: 'flex-start'}}>
                <RoomDetails players={players} leaveRoom={leaveRoom} soloGameMode={location.state.soloGameMode}/>
                <PlayArea me={location.state.userName} soloGameMode={location.state.soloGameMode} />
            </Box>
        </>
    );
}

export default Room;