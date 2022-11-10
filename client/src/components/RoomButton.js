import { Box } from '@mui/system';
import { makeStyles } from "@material-ui/core";
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import Button from '@mui/material/Button';
import CancelIcon from '@mui/icons-material/Cancel';
import LogoutIcon from '@mui/icons-material/Logout';
import { useMediaQuery } from 'react-responsive';

const useStyles = makeStyles((theme) => ({
    startICon: {
        margin: 0
    }
}));

const RoomButton = ({leaveRoom, setPlayerReady, flag}) => {

    const classes = useStyles();
    const isDesktopOrLaptop = useMediaQuery({ minWidth: 1024 })
    const isBigScreen = useMediaQuery({ minWidth: 1824 })
    const isTabletOrMobile = useMediaQuery({ maxWidth: 1024 })
    const isPortrait = useMediaQuery({ orientation: 'portrait' })
    const isRetina = useMediaQuery({ minResolution: '2dppx' })

    return (
        <>
            <Box sx={{ display: "flex", justifyContent: 'space-evenly' }}>
                <Button classes={{ startIcon: (isTabletOrMobile === true) ? classes.startICon : null }} variant="contained" startIcon={<LogoutIcon />} onClick={leaveRoom}>{isTabletOrMobile === true ? null: 'Leave'}</Button>
                <Button classes={{ startIcon: (isTabletOrMobile === true) ? classes.startICon : null }} variant="contained" startIcon={flag ? <CancelIcon /> : <CheckCircleIcon />} onClick={setPlayerReady} color={flag ? "error" : "success"}>
                    {isTabletOrMobile === true ? null : 'Ready'}
                </Button>
            </Box>
        </>
    );
}

export default RoomButton;