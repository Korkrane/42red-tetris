import { Box } from '@mui/system';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import Button from '@mui/material/Button';
import CancelIcon from '@mui/icons-material/Cancel';
import LogoutIcon from '@mui/icons-material/Logout';

const RoomButton = ({leaveLobby, setPlayerReady, flag}) => {

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

export default RoomButton;