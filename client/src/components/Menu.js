import socketIO from 'socket.io-client';
import MButton from './Button';
import { Title } from './Button';
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
import { useMediaQuery } from 'react-responsive'
import { grey } from '@mui/material/colors';


export const socket = socketIO.connect('http://localhost:4000');

const Menu = () => {
    let navigate = useNavigate();

    const [nameInput, setNameInput] = useState('');
    const [roomIdInput, setRoomIdInput] = useState('');
    const [openSolo, setOpenSolo] = useState(false);
	const [openJoin, setOpenJoin] = useState(false);
    const [joinable, setJoinable] = useState(true);
    const [errorMessage, setErrorMessage] = useState('');

    useEffect(() => {
        socket.on('navToRoom', (data) => {
            const hash = data.id + '[' + nameInput + ']';
            navigate("/" + hash, {state:{roomId: data.id, userName:nameInput, soloGameMode:data.soloGame}});
        });

        socket.on('cantJoin', (data) => {
            setJoinable(false);
            setErrorMessage(data);
        });

        return () => {
            socket.off('navToRoom');
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

    const createRoom = () => {
        socket.emit('createRoom',{name:nameInput, soloGame:true});
    }

    const joinRoom = () => {
        socket.emit('joinRoom', { name: nameInput, id: roomIdInput, soloGame: false });
    };

    const handleNameInputChange = (e) => {
        setNameInput(e.target.value);
    };

    const handleRoomIdInputChange = (e) => {
        setRoomIdInput(e.target.value);
    };

    const isTabletOrMobile = useMediaQuery({ maxWidth: 1024 })

    return(
        <>
            <div className='Menu'>
                <Title isTabletOrMobile={isTabletOrMobile}>RED-TETRIS</Title>
                <MButton isTabletOrMobile={isTabletOrMobile}  onClick={handleOpenSolo}>Solo</MButton>
                <Modal open={openSolo} onClose={handleCloseSolo}>
                     <Box sx={{
                        position: 'absolute',
                        top: '50%',
                        left: '50%',
                        transform: 'translate(-50%, -50%)',
                        width: isTabletOrMobile === true ? 200 : 400,
                        height: isTabletOrMobile === true ? 120 : 'auto',
                        border: '2px solid #000',
                        borderRadius:5,
                        p: 4,
                        bgcolor: grey[900]}}>
                        <Typography id="modal-title-title-solo" variant="h6" component="h2" color={grey[50]}>
                            Game Settings
                        </Typography>
                        <TextField sx={{ m: 2}}
                            id="input-with-icon-textfield-solo"
                            label="Your player name"
                            InputLabelProps={{
                                style: { color: grey[50] },
                            }}
                            InputProps={{
                            startAdornment: (
                                <InputAdornment position="start">
                                <AccountCircleIcon sx={{color:grey[50]}}/>
                                </InputAdornment>
                            ),
                            style: { color: grey[50] },
                            }}
                            variant="standard"
                            onChange= {handleNameInputChange}
                        />
                        <Button sx={{
                            bottom:45,
                            marginLeft: isTabletOrMobile === true ? -16 : 10,
                            marginBottom: isTabletOrMobile === true ? -5 : 0,
                            position: "absolute"}}
                            variant="contained"  disabled={nameInput === '' ? true : false} onClick={createRoom}>Join</Button>
                    </Box>
                </Modal>
                <MButton isTabletOrMobile={isTabletOrMobile} onClick={handleOpenJoin}>Join</MButton>
                <Modal open={openJoin} onClose={handleCloseJoin}>
                     <Box sx={{
                            position: 'absolute',
                            top: '50%',
                            left: '50%',
                            transform: 'translate(-50%, -50%)',
                            width: isTabletOrMobile === true ? 200 : 400,
                            height: isTabletOrMobile === true ? 200 : 'auto',
                            border: '2px solid',
                            borderColor: joinable ? '#000' : 'error.main',
                            borderRadius:5,
                            p: 4,
                            bgcolor: grey[900]}}>
                        <Typography sx={{color: joinable ? grey[50] : 'error.main'}} id="modal-modal-title" variant="h6" component="h2" >
                           Game Settings {errorMessage}
                        </Typography>
                        <TextField sx={{ m: 2 }}
                            id="input-with-icon-textfield"
                            label="Your player name"
                            InputLabelProps={{
                                style: { color: grey[50] },
                            }}
                            InputProps={{
                            startAdornment: (
                                <InputAdornment position="start">
                                        < AccountCircleIcon sx={{ color: grey[50] }} />
                                </InputAdornment>
                            ),
                            style: { color: grey[50] },
                            }}
                            variant="standard"
                            onChange= {handleNameInputChange}
                        />
                        <TextField sx={{ m: 2 }}
                            id="input-with-icon-textfield"
                            label="room ID"
                            InputLabelProps={{
                                style: { color: grey[50] },
                            }}
                            InputProps={{
                            startAdornment: (
                                <InputAdornment position="start">
                                        <TagIcon sx={{ color: grey[50] }} />
                                </InputAdornment>
                            ),
                            style: { color: grey[50] },
                            }}
                            variant="standard"
                            onChange= {handleRoomIdInputChange}
                        />
                        <Button sx={{
                            bottom:45,
                            marginLeft: isTabletOrMobile === true ? -16 : 10,
                            marginBottom: isTabletOrMobile === true ? -5 : 0,
                            position: "absolute"}}
                            variant="contained"  disabled={nameInput === '' || roomIdInput === '' ? true : false} onClick={joinRoom}>Join</Button>
                    </Box>
                </Modal>
            </div>
        </>
    );
}

export default Menu;