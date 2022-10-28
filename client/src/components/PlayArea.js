import { Box} from '@mui/system';
import Tetris from './Tetris';
import React, { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { socket } from './Menu'

const PlayArea = ({players}) => {




    return(
        <>
            <Box id='PlayArea' m={2} sx={{ display: 'flex', flex: '100%', flexWrap: 'wrap', flexGrow: 1, borderRadius: 5, backgroundColor: "#fb44" }}>
                {players.map(item => (
                    <Tetris name={item.name} client={item} />
                ))}
            </Box>
        </>
    );
}

export default PlayArea;