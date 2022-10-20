import { useEffect, useState } from 'react';
import {useLocation, useNavigate} from 'react-router-dom';
import { socket } from './Menu'
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import Button from '@mui/material/Button';
import CancelIcon from '@mui/icons-material/Cancel';
import { Box, Container } from '@mui/system';
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

        if(once === false)
        {
            console.log('should pop once');
            socket.emit("getPlayers", { lobbyId: location.state.lobbyId });
        }
        setOnce(true);

        return () => {
            socket.off('receiveMssg');
            socket.off('playersInLobby');
        };
    }, [location.state.lobbyId, navigate, once, players])

    const [flag, setFlag] = useState(true);



    const setPlayerReady = () => {
      setFlag(!flag);
        socket.emit('readyToPlay', { lobbyId: location.state.lobbyId });
    };

    const checkPlayers = () => {
        console.log(players);
    }

    return (
        <>
            <Container maxWidth="sm">
                <div className='Lobby'>
                <input placeholder="message..." onChange={(event) => {
                    setMessage(event.target.value)
                }}/>
                <button onClick={sendMessage}>Send message</button>
                </div>
                <h1>Messages:</h1>
                {
                    <div>
                        {messages.map(item => (
                            <div>{item.name}:{item.message}</div>
                        ))}
                    </div>
                }
                <h1>lobbyid:</h1>
                <div>{location.state.lobbyId}</div>
                <h1>userName:</h1>
                <div>{location.state.userName ? location.state.userName : "undefined"}</div>
                <h1>players:</h1>
                {
                    <div>
                    {players.map(item =>(
                        <Box display='flex' justifyContent='flex-start'>
                                {item.name}
                                {item.status ? <CheckCircleIcon color="success" fontSize="small" sx={{ bottom: 45 }} /> : <CancelIcon color="error" fontSize="small" />}
                        </Box>

                    ))}
                    </div>
                }
                <h1>number of players in room {players.length}</h1>
                <Button onClick={leaveLobby}>leave Lobby</Button>
                <Button onClick={checkPlayers}>check Players</Button>
                <Button variant="contained" startIcon={flag ? <CancelIcon />: <CheckCircleIcon />} onClick={setPlayerReady} color={flag ? "error" : "success"}>
                Ready
                </Button>
            </Container>
        </>
    );
}

export default Lobby;