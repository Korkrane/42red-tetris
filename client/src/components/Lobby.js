import { useEffect, useState } from 'react';
import {useLocation, useNavigate} from 'react-router-dom';
import { socket } from './Menu'
import { IconButton } from '@mui/material';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import Button from '@mui/material/Button';
import CancelIcon from '@mui/icons-material/Cancel';

const Lobby = () => {

    const [message, setMessage] = useState("");
    const [players, setPlayers] = useState([]);
    const [messageReceived, setMessageReceived] = useState("");
    const location = useLocation();
    const navigate = useNavigate();
    const [once, setOnce] = useState(false);

    const sendMessage = () => {
        console.log('you sent a message');
        socket.emit("sendToChat", {message, room:location.state.lobbyId});
    }

    const leaveLobby = () => {
        console.log('you leave lobby ' + location.state.lobbyId);
        socket.emit("leaveLobby", {lobbyId:location.state.lobbyId});
        return navigate('/');
    }

    const getPlayers = () => {
        socket.emit("getPlayers",   {lobbyId:location.state.lobbyId});
    }

    useEffect(() => {

        window.onpopstate = () => {
            socket.emit("leaveLobby", {lobbyId:location.state.lobbyId});
            navigate('/');
          }

        socket.on("receiveMssg", (data) => {
            console.log("receiveMssg event");
            setMessageReceived(data.message);
        })

        socket.on('playersInLobby', (data) => {
            console.log('playersInLobby event received');
            setPlayers(previousPlayers => [...previousPlayers, ...data.players]);
        })

        setOnce(true);
        if(once === false)
            socket.emit("getPlayers",   {lobbyId:location.state.lobbyId});

        return () => {
            socket.off('receiveMssg');
            socket.off('playersInLobby');
        };
    }, [location.state.lobbyId, navigate, players])

    const [flag, setFlag] = useState(true);



    const setPlayerReady = () => {
      setFlag(!flag);
      socket.emit('readyToPlay',  {room:location.state.lobbyId});
    };

    const checkPlayers = () => {
        console.log('check players');
        console.log(players);
      };

    return (
        <>
            <div className='Lobby'>
              <input placeholder="message..." onChange={(event) => {
                setMessage(event.target.value)
              }}/>
              <button onClick={sendMessage}>Send message</button>
            </div>
            <h1>Messages:</h1>
            {messageReceived}
            <h1>lobbyid:</h1>
            <div>{location.state.lobbyId}</div>
            <h1>userName:</h1>
            <div>{location.state.userName ? location.state.userName : "undefined"}</div>
            <h1>players:</h1>
            {
                <div>
                {players.map(item =>(
                    <div>{item}</div>
                ))}
                </div>
            }
             <h1>number of players in room {players.length}</h1>
            <Button onClick={checkPlayers}>check players</Button>
            <Button onClick={getPlayers}>get players</Button>
            <Button onClick={leaveLobby}>leave Lobby</Button>
            <Button variant="contained" startIcon={flag ? <CancelIcon />: <CheckCircleIcon />} onClick={setPlayerReady} color={flag ? "error" : "success"}>
            Ready
            </Button>
        </>
    );
}

export default Lobby;