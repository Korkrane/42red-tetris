import { Box } from '@mui/system';
import { makeStyles } from "@material-ui/core";
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import Button from '@mui/material/Button';
import CancelIcon from '@mui/icons-material/Cancel';
import LogoutIcon from '@mui/icons-material/Logout';
import { useMediaQuery } from 'react-responsive';
import ReplayIcon from '@mui/icons-material/Replay';
import { orange } from '@mui/material/colors';

const useStyles = makeStyles((theme) => ({
    startICon: {
        margin: 0
    }
}));

const RoomButton = ({leaveRoom, setPlayerReady, flag, gameEnd, gameStarted, resetGame}) => {

    const classes = useStyles();
    const isTabletOrMobile = useMediaQuery({ maxWidth: 1024 })

    return (
        <>
            <Box sx={{ display: "flex", justifyContent: 'space-evenly' }}>
                <Button classes={{ startIcon: (isTabletOrMobile === true) ? classes.startICon : null }} variant="contained" startIcon={<LogoutIcon />} onClick={leaveRoom}>{isTabletOrMobile === true ? null: 'Leave'}</Button>
                {
                    // gameEnd === true
                    // ?
                    //     <Button classes={{ startIcon: (isTabletOrMobile === true) ? classes.startICon : null }} variant="contained" startIcon={<ReplayIcon />} onClick={resetGame} color={"warning"}>
                    //         {isTabletOrMobile === true ? null : 'Replay'}
                    //     </Button>
                    // :
                        <Button disabled={gameStarted ? true : false} classes={{ startIcon: (isTabletOrMobile === true) ? classes.startICon : null }} variant="contained" startIcon={flag ? <CancelIcon /> : <CheckCircleIcon />} onClick={setPlayerReady} color={flag ? "error" : "success"}>
                            {isTabletOrMobile === true ? null : 'Ready'}
                        </Button>
                }
            </Box>
        </>
    );
}

export default RoomButton;