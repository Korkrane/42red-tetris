import { useEffect, useState } from 'react';
import {useLocation} from 'react-router-dom';
import { socket } from './Menu'
import { Box } from '@mui/system';
import PlayArea from './PlayArea';
import RoomDetails from './RoomDetails';
import { useMediaQuery } from 'react-responsive';

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

    const isDesktopOrLaptop = useMediaQuery({ minWidth: 1024 })
    const isBigScreen = useMediaQuery({ minWidth: 1824 })
    const isTabletOrMobile = useMediaQuery({ maxWidth: 1024 })
    const isPortrait = useMediaQuery({ orientation: 'portrait' })
    const isRetina = useMediaQuery({ minResolution: '2dppx' })

    return (
        <>

            <Box sx={{ display: 'flex', maxHeight: '100%', minHeight: '100%', minWidth: '100%', justifyContent: 'flex-start'}}>
                <div id="screen">
                    {isDesktopOrLaptop && <p>You are a desktop or laptop</p>}
                    {isBigScreen && <p>You  have a huge screen</p>}
                    {isTabletOrMobile && <p>You are a tablet or mobile phone</p>}
                    <p>Your are in {isPortrait ? 'portrait' : 'landscape'} orientation</p>
                    {isRetina && <p>You are retina</p>}
                </div>
                <PlayArea me={location.state.userName}/>
                <RoomDetails players={players}/>
            </Box>
        </>
    );
}

export default Room;