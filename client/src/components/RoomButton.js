import { Box } from '@mui/system';
import { makeStyles } from "@material-ui/core";
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import Button from '@mui/material/Button';
import CancelIcon from '@mui/icons-material/Cancel';
import LogoutIcon from '@mui/icons-material/Logout';
import { useMediaQuery } from 'react-responsive';
import ReplayIcon from '@mui/icons-material/Replay';
import { orange } from '@mui/material/colors';
import { useEffect, useState } from 'react';

const useStyles = makeStyles((theme) => ({
    startICon: {
        margin: 0
    }
}));

const RoomButton = ({me, players, leaveRoom, setPlayerReady, flag, gameEnd, gameStarted, resetGame}) => {

    const classes = useStyles();
    const isTabletOrMobile = useMediaQuery({ maxWidth: 1024 })
    const [isAdmin, setIsAdmin] = useState(false);

    useEffect(() => {
        for (let i = 0; i < players.length ; i++)
        {
            if (players[i].name === me && players[i].admin)
                setIsAdmin(true);
        }
    }, [me,players])

    return (
        <>
            <Box sx={{ display: "flex", justifyContent: 'space-evenly' }}>
                <Button sx={{flexGrow:1}} classes={{ startIcon: (isTabletOrMobile === true) ? classes.startICon : null }} variant="contained" startIcon={<LogoutIcon />} onClick={leaveRoom}>{isTabletOrMobile === true ? null: 'Leave'}</Button>
                <Button color="warning" sx={{ display: (gameEnd === true && isAdmin === true) ? 'flex' : 'none' }} classes={{ startIcon: (isTabletOrMobile === true) ? classes.startICon : null }} variant="contained" startIcon={<ReplayIcon />} onClick={resetGame}>{isTabletOrMobile === true ? null : 'Replay'}</Button>
                <Button sx={{ display: (gameStarted === true) ? 'none' : 'flex' }} classes={{ startIcon: (isTabletOrMobile === true) ? classes.startICon : null }} variant="contained" startIcon={flag ? <CancelIcon /> : <CheckCircleIcon />} onClick={setPlayerReady} color={flag ? "error" : "success"}>
                    {isTabletOrMobile === true ? null : 'Ready'}
                </Button>
            </Box>
        </>
    );
}

export default RoomButton;