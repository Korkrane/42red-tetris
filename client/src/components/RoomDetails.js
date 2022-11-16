import { useEffect, useState } from "react";
import {useLocation, useNavigate} from 'react-router-dom';
import { Box } from '@mui/system';
import { socket } from './Menu'
import Players from './Players';
import Chat from './Chat';
import RoomButton from './RoomButton';
import './RoomDetails.css';

const RoomDetails = ({me, players, leaveRoom, soloGameMode, gameEnd, gameStarted}) => {

	const [message, setMessage] = useState("");
    const [messages, setMessages] = useState([]);
    const [flag, setFlag] = useState(true);
    const [hide, setHide] = useState(true);

	const location = useLocation();
    const navigate = useNavigate();

	const sendMessage = () => {
        socket.emit("sendToChat", {message, roomId:location.state.roomId, name:location.state.userName});
        setMessage('');
    }

	const setPlayerReady = () => {
		setFlag(!flag);
		socket.emit('readyToPlay', { roomId: location.state.roomId });
	  };

    const hideDetails = () => {
        setHide(!hide);
    };

    const resetGame = () => {
        socket.emit('resetGame', { roomId: location.state.roomId });
    }

	useEffect(() => {
        socket.on("receiveMssg", (data) => {
            console.log("receiveMssg event", data);
            setMessages(previousMessages => [...previousMessages, data]);
        })

        return () => {
            socket.off('receiveMssg');
        };
    }, [location.state.roomId, navigate, players])

    const onEmitLeaveLobby = (e) => {
        e.preventDefault();
        console.log("you leave lobby " + location.state.roomId);
        socket.emit("leaveRoom", { id: location.state.roomId });
        navigate("/");
    };

    useEffect(() => {
        window.addEventListener(
            "popstate",
            (e) => {onEmitLeaveLobby(e);},
            { once: true } // This guy makes sure the listener will be removed after invoking it
        );

        return () => {
            window.removeEventListener("popstate", onEmitLeaveLobby);
        };
    }, []);

	return (
		<>
            {soloGameMode === false ?
                <>
                    <Box m={2} sx={{position:'absolute', bottom:0, right:0}}>
                        <button className="glow-on-hover" onClick={hideDetails}>{hide === true ? '+' : '-'}</button>
                    </Box>
                    <Box id="details" m={2} sx={{maxHeight: '100%', display:(hide === true) ? 'none' : 'flex', flexDirection: 'column', justifyContent: 'space-between', minWidth: '15%', maxWidth: '15%', border: 3, borderRadius: 5, padding: 3, backgroundColor: "rgba(20,20,20, 1)"}}>
                        <Players players={players}/>
                        <Chat messages={messages} sendMessage={sendMessage} setMessage={setMessage} message={message} />
                        <RoomButton me={me} players={players} leaveRoom={leaveRoom} setPlayerReady={setPlayerReady} flag={flag} gameEnd={gameEnd} gameStarted={gameStarted} resetGame={resetGame}/>
                    </Box>
                </>
            :
            <></>
            }

		</>
	)
}

export default RoomDetails;