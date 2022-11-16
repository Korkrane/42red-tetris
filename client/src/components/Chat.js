import { Box } from '@mui/system';
import { Typography, TextField, IconButton } from '@mui/material';
import SendIcon from '@mui/icons-material/Send';
import { grey } from '@mui/material/colors';

const Chat = ({messages, sendMessage, setMessage, message}) => {

    return (
        <>
            <Box sx={{ maxHeight: '85%', display: 'flex', flexDirection: 'column', flexGrow: 1, border: 1, borderColor:grey[700], borderRadius:5 }}>
                <Typography variant="h5" align="center" color={grey[700]}>
                    messages
                </Typography>
                <Box sx={{
                    color: grey[700],
                    overflow: 'hidden',
                    overflowY: "scroll",
                    wordWrap: 'break-word',
                    '&::-webkit-scrollbar': {
                        width: '10px',
                    },
                    '&::-webkit-scrollbar-track': {
                        boxShadow: 'inset 0 0 6px rgba(0,0,0,0.00)',
                        webkitBoxShadow: 'inset 0 0 6px rgba(0,0,0,0.00)',
                    },
                    '&::-webkit-scrollbar-thumb': {
                        backgroundColor: '#4444',
                        outline: '1px solid slategrey',
                        borderRadius: '10px'
                    }
                }}>
                    {messages.map((item, index) => (
                        <div key={index + item.name}>{item.name}: {item.message}</div>
                    ))}
                </Box>
            </Box>
            <Box sx={{display:'flex', justifyContent:'flex-start'}}>
                <TextField size="small" variant="outlined" placeholder="Your message..." value={message}
                    sx={{
                        '& .MuiOutlinedInput-root': {
                            '& fieldset': {
                                borderColor: grey[700],
                            },
                            '&:hover fieldset': {
                                borderColor: grey[700],
                            },
                    }}}
                    inputProps={{ style: { color: grey[500] } }}

                    onChange={(event) => {
                        setMessage(event.target.value)
                    }}

                    onKeyPress={(event) => {
                        if (event.key === "Enter") {
                            sendMessage()
                        }
                    }} />
                <IconButton onClick={sendMessage}> <SendIcon sx={{ color: grey[700] }} /></IconButton>
            </Box>
        </>
    );
}

export default Chat;