import { Box, Container } from '@mui/system';
import { useEffect, useState, onKeyPress } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { socket } from './Menu'
import { Typography, TextField, IconButton } from '@mui/material';
import SendIcon from '@mui/icons-material/Send';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import Button from '@mui/material/Button';
import CancelIcon from '@mui/icons-material/Cancel';
import LogoutIcon from '@mui/icons-material/Logout';

const LobbyButton = ({leaveLobby, setPlayerReady, flag}) => {

    useEffect(() => {

    })

    return (
        <>
            <Box sx={{ display: "flex", justifyContent: 'space-evenly' }}>
                <Button variant="contained" startIcon={<LogoutIcon />} onClick={leaveLobby}>Leave</Button>
                <Button variant="contained" startIcon={flag ? <CancelIcon /> : <CheckCircleIcon />} onClick={setPlayerReady} color={flag ? "error" : "success"}>
                    Ready
                </Button>
            </Box>
        </>
    );
}

export default LobbyButton;