import './App.css';
import socketIO from 'socket.io-client';
import Button, { JoinButton, LeaveButton, MultiButton, CheckButton, SoloButton} from './components/Button';
import { useEffect, useState} from 'react';

const socket = socketIO.connect('http://localhost:4000');

const createLobby = () => {
  const lobby = JSON.stringify({type:'normal', id: null})
  socket.emit('createLobby', lobby);
}

const joinLobby = () => {
  // const lobby = JSON.stringify({type:'normal', id: null})
  // socket.emit('createLobby', lobby);
}

const checkLobbies = () => {
  socket.emit('checkLobbies');
}

const initLobby = () => {
  const lobbyId = window.location.hash.split('#')[1];
  console.log(`initLobby: lobbyId is ${lobbyId}`);

  if (lobbyId && typeof lobbyId !== "undefined"){
    console.log("does lobby exists ?");
    const data = JSON.stringify({id: lobbyId})
    socket.emit('checkLobby', data)
  }
}


function App() {

  useEffect(() => {
    socket.on('lobbyJoined', (...args) => {
      const data = JSON.parse(args[0]);
      //console.log(data);
      window.location.hash = data.id;
    });

    socket.on('lobbyChecked', (...args) => {
      const lobbyDetails = JSON.parse(args);
      //console.log(lobbyDetails);
      if(lobbyDetails.exist === "false")
      {
        const customLobbyId = window.location.hash.split('#')[1];
        const e = JSON.stringify({type:'custom', id: customLobbyId})
        socket.emit('createLobby', e);
      }
      else
      {
        const lobbyId = JSON.stringify({id: lobbyDetails.id})
        socket.emit('joinLobby', lobbyId)
      }
    });


    return () => {
      socket.off('lobbyJoined');
      socket.off('lobbyChecked');
    };
  }, []);

    initLobby();

  return (
    <>
    <div className='Menu'>
      <SoloButton onClick={createLobby}>Solo</SoloButton>
      <MultiButton onClick={createLobby}>Multi</MultiButton>
      <JoinButton join onClick={joinLobby}>Join</JoinButton>
      <CheckButton check onClick={checkLobbies}>Check Lobbies</CheckButton>
    </div>
    </>
  );
}

export default App;
