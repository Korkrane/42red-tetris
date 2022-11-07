import { useEffect, useState } from "react";
import {useLocation, useNavigate} from 'react-router-dom';
import { Box } from '@mui/system';
import { socket } from './Menu'
import Players from './Players';
import Chat from './Chat';
import RoomButton from './RoomButton';

const RoomDetails = ({players}) => {

	const [message, setMessage] = useState("");
    const [messages, setMessages] = useState([]);
    const [flag, setFlag] = useState(true);

	const location = useLocation();
    const navigate = useNavigate();

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

	const setPlayerReady = () => {
		setFlag(!flag);
		  socket.emit('readyToPlay', { roomId: location.state.roomId });
	  };

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

        return () => {
            socket.off('receiveMssg');
        };
    }, [location.state.roomId, navigate, players])


	return (
		<>
			<Box m={2} sx={{ maxHeight: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', minWidth: '15%', border: 3, borderRadius: 5, padding: 3, backgroundColor: "#fb44" }}>
				<Players players={players}/>
				<Chat messages={messages} sendMessage={sendMessage} setMessage={setMessage} message={message} />
				<RoomButton leaveRoom={leaveRoom} setPlayerReady={setPlayerReady} flag={flag}/>
			</Box>
		</>
	)
}

export default RoomDetails;