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
            <Container maxWidth={false} disableGutters  sx={{height:'100vh', backgroundColor: "#4b4d4c"}}>
                <Typography variant="h2" align="center">
                    room: {location.state.lobbyId}
                </Typography>
                <Box position="absolute" right="25px" sx={{border:3, borderRadius:5, padding:3, backgroundColor: "#fb44" }}>
                    <Box sx={{backgroundColor: "#5d5f", border:3, borderRadius:5}} top="25px" mb={1} pb={1}>
                        <Typography variant="h5" align="center">
                            players
                        </Typography>
                        {
                            <Box>
                            {players.map(item =>(
                                <Box display='flex'>
                                        <Box sx={{ flexGrow: 1 }} ml={1}>{item.name}</Box>
                                        <Box mr={2}>{item.status ? <CheckCircleIcon color="success" fontSize="small" sx={{ bottom: 45 }} /> : <CancelIcon color="error" fontSize="small" />}</Box>
                                </Box>

                            ))}
                            </Box>
                        }

                    </Box>
                    <Box bottom="25px" mb={1}
                        sx={{backgroundColor: "#15f", border:3, borderRadius:5}}>
                        <Typography variant="h5" align="center">
                            messages
                        </Typography>
                        <Box
                        sx={{
                            mb: 2,
                            display: "flex",
                            flexDirection: "column",
                            height: 400,
                            width: 300,
                            overflow: "hidden",
                            overflowY: "scroll",
                            wordWrap: 'break-word',
                            '&::-webkit-scrollbar': {
                                width: '10px'
                              },
                              '&::-webkit-scrollbar-track': {
                                boxShadow: 'inset 0 0 6px rgba(0,0,0,0.00)',
                                webkitBoxShadow: 'inset 0 0 6px rgba(0,0,0,0.00)'
                              },
                              '&::-webkit-scrollbar-thumb': {
                                backgroundColor: '#4444',
                                outline: '1px solid slategrey'
                              }
                            }}
                        >
                        {
                            <div>
                                {messages.map(item => (
                                    <div>{item.name}: {item.message}</div>
                                ))}
                            </div>
                        }
                        </Box>
                        <Box sx={{display:"flex", justifyContent: 'center'}} m={2}>
                            <TextField size="small" variant="outlined" placeholder="Your message..." value={message}
                            onChange={(event) => {
                                    setMessage(event.target.value)}}

                            onKeyPress={(event) => {
                                if (event.key === "Enter") {
                                       sendMessage()}}}/>
                            <IconButton onClick={sendMessage}> <SendIcon/></IconButton>
                        </Box>

                    </Box>
                    <Box sx={{display:"flex", justifyContent: 'space-evenly'}}>
                        <Button variant="contained" startIcon={<LogoutIcon />} onClick={leaveLobby}>Leave</Button>
                        <Button variant="contained" startIcon={flag ? <CancelIcon />: <CheckCircleIcon />} onClick={setPlayerReady} color={flag ? "error" : "success"}>
                        Ready
                        </Button>
                    </Box>

                </Box>
            </Container>
        </>
    );
}

export default Lobby;