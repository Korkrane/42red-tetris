import { useEffect, useState, onKeyPress } from 'react';
import {useLocation, useNavigate} from 'react-router-dom';
import { socket } from './Menu'
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import Button from '@mui/material/Button';
import CancelIcon from '@mui/icons-material/Cancel';
import { Box, Container } from '@mui/system';
import { Typography, TextField, IconButton } from '@mui/material';
import { alignProperty } from '@mui/material/styles/cssUtils';
import LogoutIcon from '@mui/icons-material/Logout';
import SendIcon from '@mui/icons-material/Send';
import PlayArea from './PlayArea';
import Players from './Players';
import Chat from './Chat';
import LobbyButton
 from './LobbyButton';
const Lobby = () => {


    const [message, setMessage] = useState("");
    const [messages, setMessages] = useState([]);
    const [players, setPlayers] = useState([]);
    const location = useLocation();
    const navigate = useNavigate();
    const [once, setOnce] = useState(false);

    const sendMessage = () => {
        console.log('you sent a message');
        socket.emit("sendToChat", {message, lobbyId:location.state.lobbyId, name:location.state.userName});
        setMessage('');
    }

    const leaveLobby = () => {
        console.log('you leave lobby ' + location.state.lobbyId);
        socket.emit("leaveLobby", {lobbyId:location.state.lobbyId});
        return navigate('/');
    }

    useEffect(() => {


        window.onpopstate = () => {
            socket.emit("leaveLobby", {lobbyId:location.state.lobbyId});
            navigate('/');
          }

        socket.on("receiveMssg", (data) => {
            console.log("receiveMssg event");
            console.log(data)
            setMessages(previousMessages => [...previousMessages, data]);
        })

        socket.on('playersInLobby', (data) => {
            console.log('playersInLobby event received');
            console.log(data);
            setPlayers(data);
        })

        socket.on('gameStart', (data) => {
            console.log("game gonna start");
        })

        if(once === false)
        {
            console.log('should pop once');
            socket.emit("getPlayers", { lobbyId: location.state.lobbyId });
        }
        setOnce(true);

        return () => {
            socket.off('gameStart');
            socket.off('receiveMssg');
            socket.off('playersInLobby');
        };
    }, [location.state.lobbyId, navigate, once, players])

    const [flag, setFlag] = useState(true);



    const setPlayerReady = () => {
      setFlag(!flag);
        socket.emit('readyToPlay', { lobbyId: location.state.lobbyId });
    };


    return (
        <>
            <Box sx={{ display: 'flex', maxHeight: '100%', minHeight: '100%', minWidth: '100%', justifyContent: 'flex-start', backgroundColor: "#4b4d4c"}}>
                    <PlayArea players={players} />
					<Box m={2} sx={{ maxHeight: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', minWidth: '15%', border: 3, borderRadius: 5, padding: 3, backgroundColor: "#fb44" }}>
                        <Players players={players}/>
                        <Chat messages={messages} sendMessage={sendMessage} setMessage={setMessage} message={message} />
                        <LobbyButton leaveLobby={leaveLobby} setPlayerReady={setPlayerReady} flag={flag}/>
                    </Box>
            </Box>
        </>
    );
}

export default Lobby;