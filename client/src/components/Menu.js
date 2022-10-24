import socketIO from 'socket.io-client';
import { JoinButton, MultiButton, SoloButton } from './Button';
import { useEffect, useState } from 'react';
import * as React from 'react';
import { useNavigate} from 'react-router-dom';
import Modal from '@mui/material/Modal';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import { TextField } from '@mui/material';
import TagIcon from '@mui/icons-material/Tag';
import InputAdornment from '@mui/material/InputAdornment';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';

export const socket = socketIO.connect('http://localhost:4000');



// const initLobby = () => {
//     const lobbyId = window.location.hash.split('#')[1];
//     console.log(`initLobby: lobbyId is ${lobbyId}`);

//     if (lobbyId && typeof lobbyId !== "undefined") {
//         console.log("does lobby exists ?");
//         const data = JSON.stringify({ id: lobbyId })
//         socket.emit('checkLobby', data)
//     }
// }

const Menu = () => {
    let navigate = useNavigate();

    const [nameInput, setNameInput] = useState('');
    const [lobbyIdInput, setLobbyIdInput] = useState('');
    const [openSolo, setOpenSolo] = useState(false);
	const [openJoin, setOpenJoin] = useState(false);
    const [joinable, setJoinable] = useState(true);
    const [errorMessage, setErrorMessage] = useState('');

    useEffect(() => {

        socket.on('navToLobby', (data) => {
            const hash = data.id
            navigate("/" + hash, {state:{lobbyId: data.id, userName:nameInput}});
        });

        socket.on('cantJoin', () => {
            console.log('cant join lobby game is going on');
            setJoinable(false);
            setErrorMessage(' - game has started');
        });

        // socket.on('lobbyChecked', (...args) => {
        //     const lobbyDetails = JSON.parse(args);
        //     //console.log(lobbyDetails);
        //     if (lobbyDetails.exist === "false") {
        //         const customLobbyId = window.location.hash.split('#')[1];
        //         const e = JSON.stringify({ type: 'custom', id: customLobbyId })
        //         socket.emit('createLobby', e);
        //     }
        //     else {
        //         const lobbyId = JSON.stringify({ id: lobbyDetails.id })
        //         socket.emit('joinLobby', lobbyId)
        //     }
        // });


        return () => {
            socket.off('navToLobby');
            socket.off('lobbyChecked');
            socket.off('cantJoin');
        };
    }, [navigate, nameInput]);


    const handleOpenSolo = () => setOpenSolo(true);
    const handleCloseSolo = () => setOpenSolo(false);
	const handleOpenJoin = () => setOpenJoin(true);
    const handleCloseJoin = () => {
        setOpenJoin(false);
        setJoinable(true);
        setErrorMessage('');
    };

    const createLobby = () => {
        socket.emit('createLobby',{name:nameInput});
    }

    const joinLobby = () => {
        socket.emit('joinLobby', {name:nameInput, id:lobbyIdInput});
    };

    const handleNameInputChange = (e) => {
        setNameInput(e.target.value);
    };

    const handleLobbyIdInputChange = (e) => {
        setLobbyIdInput(e.target.value);
    };

    const checkLobbies = () => {
        socket.emit('checkLobbies');
    }

    return(
        <>
            <div className='Menu'>
                <SoloButton onClick={handleOpenSolo}>Solo</SoloButton>
                <Modal open={openSolo} onClose={handleCloseSolo}>
                     <Box sx={{position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', width: 400, border: '2px solid #000', borderRadius:5, p: 4, bgcolor: 'background.paper'}}>
                        <Typography id="modal-title-title-solo" variant="h6" component="h2">
                            Game Settings
                        </Typography>
                        <TextField sx={{ m: 2 }}
                            id="input-with-icon-textfield-solo"
                            label="Your player name"
                            InputProps={{
                            startAdornment: (
                                <InputAdornment position="start">
                                < AccountCircleIcon />
                                </InputAdornment>
                            ),
                            }}
                            variant="standard"
                            onChange= {handleNameInputChange}
                        />
                        <Button sx={{bottom:45, marginLeft:10, position: "absolute"}} variant="contained"  disabled={nameInput === '' ? true : false} onClick={createLobby}>Join</Button>
                    </Box>
                </Modal>
                <JoinButton onClick={handleOpenJoin}>Join</JoinButton>
                <Modal open={openJoin} onClose={handleCloseJoin}>
                     <Box sx={{position: 'absolute',
                            top: '50%',
                            left: '50%',
                            transform: 'translate(-50%, -50%)',
                            width: 400,
                            border: '2px solid',
                            borderColor: joinable ? '#000' : 'error.main',
                            borderRadius:5,
                            p: 4,
                            bgcolor: 'background.paper'}}>
                        <Typography sx={{color: joinable ? '#000' : 'error.main'}} id="modal-modal-title" variant="h6" component="h2">
                           Game Settings {errorMessage}
                        </Typography>
                        <TextField sx={{ m: 2 }}
                            id="input-with-icon-textfield"
                            label="Your player name"
                            InputProps={{
                            startAdornment: (
                                <InputAdornment position="start">
                                < AccountCircleIcon />
                                </InputAdornment>
                            ),
                            }}
                            variant="standard"
                            onChange= {handleNameInputChange}
                        />
                        <TextField sx={{ m: 2 }}
                            id="input-with-icon-textfield"
                            label="lobby ID"
                            InputProps={{
                            startAdornment: (
                                <InputAdornment position="start">
                                <TagIcon />
                                </InputAdornment>
                            ),
                            }}
                            variant="standard"
                            onChange= {handleLobbyIdInputChange}
                        />
                        <Button sx={{bottom:45, marginLeft:10, position: "absolute"}} variant="contained"  disabled={nameInput === '' || lobbyIdInput === '' ? true : false} onClick={joinLobby}>Join</Button>
                    </Box>
                </Modal>
                <Button onClick={checkLobbies}>Check Lobbies on serv (debug)</Button>
            </div>
        </>
    );
}

export default Menu;