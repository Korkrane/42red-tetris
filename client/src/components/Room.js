import { useEffect, useState } from 'react';
import {useLocation} from 'react-router-dom';
import { socket } from './Menu'
import { Box } from '@mui/system';
import PlayArea from './PlayArea';
import RoomDetails from './RoomDetails';

const Room = () => {

    const [players, setPlayers] = useState([]);
    const location = useLocation();
    const [once, setOnce] = useState(false);

    useEffect(() => {
        socket.on('playersInRoom', (data) => {
            console.log('playersInRoom event received');
            console.log(data);
            setPlayers(data);
        })

        if(once === false)
        {
            console.log('should pop once');
            socket.emit("getPlayers", { roomId: location.state.roomId });
        }
        setOnce(true);

        return () => {
            socket.off('playersInRoom');
        };
    }, [location.state.roomId, once, players])

    return (
        <>
            <Box sx={{ display: 'flex', maxHeight: '100%', minHeight: '100%', minWidth: '100%', justifyContent: 'flex-start', backgroundColor: "#4b4d4c"}}>
                <PlayArea me={location.state.userName}/>
                    <RoomDetails players={players}/>
            </Box>
        </>
    );
}

export default Room;