import { Box} from '@mui/system';
import Tetris from './Tetris';


const PlayArea = ({players}) => {

    return(
        <>
            <Box id='PlayArea' m={2} sx={{ display: 'flex', flex: '100%', flexWrap: 'wrap', flexGrow: 1, borderRadius: 5, backgroundColor: "#fb44" }}>
                {players.map(item => (
                    <Tetris name={item.name} />
                ))}
            </Box>
        </>
    );
}

export default PlayArea;