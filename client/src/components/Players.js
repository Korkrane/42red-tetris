import { Box } from '@mui/system';
import { Typography} from '@mui/material';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CancelIcon from '@mui/icons-material/Cancel';
import { grey } from '@mui/material/colors';
import LocalPoliceIcon from '@mui/icons-material/LocalPolice';

const Players = ({players}) => {

    return (
        <>
            <Box sx={{ border: 2, borderRadius:5, borderColor:grey[700] }} pb={1}>
                        <Typography variant="h5" align="center" color={grey[700]}>
                                players
                            </Typography>
                            {
                                <Box>
                                    {players.map((item, index) => (
                                        <Box key={item.name + index} display='flex'>
                                            <Box sx={{ flexGrow: 1, color:grey[700] }} ml={2}>{item.name}</Box>
                                            <Box mr={2}>{item.admin ? <LocalPoliceIcon color="primary" fontSize='small'/> : null}{item.status ? <CheckCircleIcon color="success" fontSize="small"/> : <CancelIcon color="error" fontSize="small" />}</Box>
                                        </Box>

                                    ))}
                                </Box>
                            }

                        </Box>
        </>
    );
}

export default Players;