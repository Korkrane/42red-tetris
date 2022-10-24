import { Box, Container } from '@mui/system';
import { useEffect, useState, onKeyPress } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { socket } from './Menu'
import { Typography, TextField, IconButton } from '@mui/material';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CancelIcon from '@mui/icons-material/Cancel';

const Players = ({players}) => {

    return (
        <>
            <Box sx={{ backgroundColor: "#5d5f", border: 3, borderRadius: 5 }} pb={1}>
                            <Typography variant="h5" align="center">
                                players
                            </Typography>
                            {
                                <Box>
                                    {players.map(item => (
                                        <Box display='flex'>
                                            <Box sx={{ flexGrow: 1 }} ml={2}>{item.name}</Box>
                                            <Box mr={2}>{item.status ? <CheckCircleIcon color="success" fontSize="small"/> : <CancelIcon color="error" fontSize="small" />}</Box>
                                        </Box>

                                    ))}
                                </Box>
                            }

                        </Box>
        </>
    );
}

export default Players;