//index.js
const express = require('express');
const app = express();
const PORT = 4000;
const Lobby = require('./Lobby');
const Client = require('./Client');

const http = require('http').Server(app);
const cors = require('cors');

app.use(cors());

const { uniqueNamesGenerator, adjectives, colors, animals } = require('unique-names-generator');

function createId(len = 6, chars = 'abcdefghijklmnopqrstuvwxyz0123456789')
{
  let id= '';
  while(len--){
    id += chars[Math.floor(Math.random() * chars.length)]
  }
  return id;
}

function createName()
{
    return uniqueNamesGenerator({
        dictionaries: [adjectives, animals, colors], // colors can be omitted here as not used
        length: 3,
        style: 'lowerCase',
        separator: '-'
      });
}

const lobbies = new Map;

const socket = require('socket.io')(http, {
    cors: {
        origin: "http://localhost:3000"
    }
});

socket.on('connection', (socket) => {
    console.log(`⚡: ${socket.id} user just connected!`);
    const client = new Client(socket, createName())

    socket.on('createLobby', (...args) => {
      const lobbyDetails =JSON.parse(args);
      console.log(`${socket.id} creates a new lobby`);
      if(lobbyDetails.type === 'custom')
      {
        const lobby = new Lobby(lobbyDetails.id);
        lobby.join(client);
        lobbies.set(lobby.id, lobby);
        client.send({id: lobby.id});
      }
      else
      {
        const lobby = new Lobby(createId());
        lobby.join(client);
        lobbies.set(lobby.id, lobby);
        client.send({id: lobby.id});
      }
    });

    socket.on('joinLobby', (...args) => {
      const lobbyIdToJoin =JSON.parse(args[0]);
      console.log(lobbyIdToJoin);
      console.log(`${socket.id} wants to join lobby \x1b[36m\x1b[32m${lobbyIdToJoin.id}\x1b[0m`);
      const lobby = lobbies.get(lobbyIdToJoin.id);
      lobby.join(client);
      client.send({id: lobby.id});
    });

    socket.on('checkLobbies', () => {
      console.log(lobbies);
    });

    socket.on('checkLobby', (...args) => {
      const lobbyToCheck =JSON.parse(args[0]);
      console.log(`${socket.id} wants to check lobby \x1b[36m\x1b[32m${lobbyToCheck.id}\x1b[0m`);
      const lobby = lobbies.get(lobbyToCheck.id);
      if (lobby)
        client.sendCheck({exist:"true", id:lobby.id});
      else
        client.sendCheck({exist:"false", id:null});
    });

    socket.on('disconnect', () => {
      console.log('🔥: A user disconnected');
      const lobby = client.lobby;
      if(lobby){
          console.log(`He was in ${lobby.id}`)
          lobby.leave(client);
          if(lobby.clients.size === 0) {
            lobbies.delete(lobby.id)
            console.log(`lobby ${lobby.id} is empty and has been deleted.`)
          }
      }

    });
});

http.listen(PORT, () => {
  console.log(`Server listening on ${PORT}`);
});