import { Box } from '@mui/system';
import { useEffect } from 'react';
import { Typography, TextField, IconButton } from '@mui/material';
import SendIcon from '@mui/icons-material/Send';

const Chat = ({messages, sendMessage, setMessage, message}) => {

    useEffect(() => {

    })

    return (
        <>
            <Box sx={{ maxHeight: '85%', display: 'flex', flexDirection: 'column', flexGrow: 1, backgroundColor: "success", border: 1 }}>
                <Typography variant="h5" align="center">
                    messages
                </Typography>
                <Box sx={{
                    overflow: 'hidden',
                    overflowY: "scroll",
                    wordWrap: 'break-word',
                    '&::-webkit-scrollbar': {
                        width: '10px'
                    },
                    '&::-webkit-scrollbar-track': {
                        boxShadow: 'inset 0 0 6px rgba(0,0,0,0.00)',
                        webkitBoxShadow: 'inset 0 0 6px rgba(0,0,0,0.00)'
                    },
                    '&::-webkit-scrollbar-thumb': {
                        backgroundColor: '#4444',
                        outline: '1px solid slategrey'
                    }
                }}>
                    {messages.map((item, index) => (
                        <div key={index + item.name}>{item.name}: {item.message}</div>
                    ))}
                </Box>
            </Box>
            <Box>
                <TextField size="small" variant="outlined" placeholder="Your message..." value={message}
                    onChange={(event) => {
                        setMessage(event.target.value)
                    }}

                    onKeyPress={(event) => {
                        if (event.key === "Enter") {
                            sendMessage()
                        }
                    }} />
                <IconButton onClick={sendMessage}> <SendIcon /></IconButton>
            </Box>
        </>
    );
}

export default Chat;