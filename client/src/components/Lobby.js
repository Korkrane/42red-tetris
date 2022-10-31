import { useEffect, useState } from 'react';
import {useLocation, useNavigate} from 'react-router-dom';
import { socket } from './Menu'
import { Box } from '@mui/system';
import PlayArea from './PlayArea';
import RoomDetails from './RoomDetails';

const Lobby = () => {

    // const [message, setMessage] = useState("");
    // const [messages, setMessages] = useState([]);
    const [players, setPlayers] = useState([]);
    const location = useLocation();
    // const navigate = useNavigate();
    const [once, setOnce] = useState(false);

    useEffect(() => {


        // window.onpopstate = () => {
        //     socket.emit("leaveLobby", {lobbyId:location.state.lobbyId});
        //     navigate('/');
        //   }

        // socket.on("receiveMssg", (data) => {
        //     console.log("receiveMssg event");
        //     console.log(data)
        //     setMessages(previousMessages => [...previousMessages, data]);
        // })

        socket.on('playersInLobby', (data) => {
            console.log('playersInLobby event received');
            console.log(data);
            setPlayers(data);

        })

        if(once === false)
        {
            console.log('should pop once getplayers');
            socket.emit("getPlayers", { lobbyId: location.state.lobbyId });
        }
        setOnce(true);

        return () => {
            // socket.off('gameStart');
            // socket.off('receiveMssg');
            socket.off('playersInLobby');
            // socket.off('getPlayers');
        };
    }, [location.state.lobbyId, once, players])

    return (
        <>
            <Box sx={{ display: 'flex', maxHeight: '100%', minHeight: '100%', minWidth: '100%', justifyContent: 'flex-start', backgroundColor: "#4b4d4c"}}>
                    <PlayArea players={players}/>
                    <RoomDetails players={players}/>
            </Box>
        </>
    );
}

export default Lobby;