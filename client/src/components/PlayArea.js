import { Box} from '@mui/system';
import { useEffect, useState} from 'react';
import Stage from './Stage';
import { createStage } from '../gameHelpers';


//custom hooks
import { usePlayer } from '../hooks/usePlayer';
import { useStage } from '../hooks/useStage';

const PlayArea = ({players}) => {


    useEffect(() => {

    })

    const [dropTime, setDropTime] = useState(null);
    const [gameOver, setGameOver] = useState(false);

    const [player, updatePlayerPos, resetPlayer] = usePlayer();
    const [stage, setStage] = useStage(player);

    console.log('re-render');

    const movePlayer = dir => {
        updatePlayerPos({ x: dir, y: 0 });
    }

    const startGame = () => {
        console.log("start the game")
        // Reset everything
        setStage(createStage());
        resetPlayer();
    }

    const drop = () => {
        updatePlayerPos({ x: 0, y: 1, collided: false })
    }

    const dropPlayer = () => {
        drop();
    }

    const move = ({ keyCode }) => {
        if (!gameOver) {
            if (keyCode === 37) {
                movePlayer(-1);
            } else if (keyCode === 39) {
                movePlayer(1);
            } else if (keyCode === 40) {
                dropPlayer();
            }
        }
    }

    return(
        <>
            <Box m={2} sx={{ display: 'flex', flex:'100%', flexWrap:'wrap',flexGrow:1, borderRadius:5, backgroundColor: "#fb44" }}>
                {players.map(item => (
                    <Box sx={{ border: 1, borderRadius: 5, flexGrow:1,maxWidth:'100%', width:'auto'}}>
                        {item.name}
                        <div role="button" tabIndex="0" onKeyDown={e => move(e)}>
                            <Stage stage={stage} />
                            <button onClick={startGame}>start game</button>
                        </div>

                    </Box>
                ))}
            </Box>
        </>
    );
}

export default PlayArea;