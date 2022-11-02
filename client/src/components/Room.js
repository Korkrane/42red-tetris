import { useEffect, useState } from 'react';
import {useLocation, useNavigate} from 'react-router-dom';
import { socket } from './Menu'
import { Box } from '@mui/system';
import PlayArea from './PlayArea';
import Players from './Players';
import Chat from './Chat';
import RoomButton from './RoomButton';

const Room = () => {


    const [message, setMessage] = useState("");
    const [messages, setMessages] = useState([]);
    const [players, setPlayers] = useState([]);
    const location = useLocation();
    const navigate = useNavigate();
    const [once, setOnce] = useState(false);

    const sendMessage = () => {
        console.log('you sent a message');
        socket.emit("sendToChat", {message, roomId:location.state.roomId, name:location.state.userName});
        setMessage('');
    }

    const leaveRoom = () => {
        console.log('you leave room ' + location.state.roomId);
        socket.emit("leaveRoom", {roomId:location.state.roomId});
        return navigate('/');
    }

    useEffect(() => {


        window.onpopstate = () => {
            socket.emit("leaveRoom", {roomId:location.state.roomId});
            navigate('/');
          }

        socket.on("receiveMssg", (data) => {
            console.log("receiveMssg event");
            console.log(data)
            setMessages(previousMessages => [...previousMessages, data]);
        })

        socket.on('playersInRoom', (data) => {
            console.log('playersInRoom event received');
            console.log(data);
            setPlayers(data);
        })

        // socket.on('gameStart', (data) => {
        //     console.log("game gonna start");
        // })

        if(once === false)
        {
            console.log('should pop once');
            socket.emit("getPlayers", { roomId: location.state.roomId });
        }
        setOnce(true);

        return () => {
            socket.off('gameStart');
            socket.off('receiveMssg');
            socket.off('playersInRoom');
        };
    }, [location.state.roomId, navigate, once, players])

    const [flag, setFlag] = useState(true);



    const setPlayerReady = () => {
      setFlag(!flag);
        socket.emit('readyToPlay', { roomId: location.state.roomId });
    };


    return (
        <>
            <Box sx={{ display: 'flex', maxHeight: '100%', minHeight: '100%', minWidth: '100%', justifyContent: 'flex-start', backgroundColor: "#4b4d4c"}}>
                    <PlayArea players={players} />
					<Box m={2} sx={{ maxHeight: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', minWidth: '15%', border: 3, borderRadius: 5, padding: 3, backgroundColor: "#fb44" }}>
                        <Players players={players}/>
                        <Chat messages={messages} sendMessage={sendMessage} setMessage={setMessage} message={message} />
                        <RoomButton leaveRoom={leaveRoom} setPlayerReady={setPlayerReady} flag={flag}/>
                    </Box>
            </Box>
        </>
    );
}

export default Room;