//index.js
const express = require('express');
const app = express();
const PORT = 4000;
const Lobby = require('./Lobby');
const Client = require('./Client');

// const http = require('http').Server(app);
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

const httpServer = require("http").createServer();
const io = require("socket.io")(httpServer, {
  cors: {
    origin: "http://localhost:3000"

  }
});

// const socket = require('socket.io')(http, {
// 		cors: {
// 				origin: "http://localhost:3000"
// 		}
// });

io.on('connection', (socket) => {
		console.log(`⚡: ${socket.id} user just connected!`);
		const client = new Client(socket, createName())

		socket.on('createLobby', (data) => {
			client.name = data.name
			console.log(`${socket.id}\x1b[36m\x1b[32m[${client.name}]\x1b[0m creates a new lobby`);

			const lobby = new Lobby(createId());

			lobbies.set(lobby.id, lobby);
			lobby.joinedBy(client);
			socket.emit('navToLobby',{id: lobby.id})
			socket.join(lobby.id);

			const playersInRoom = [...lobby.clients].map(x => ({ name: x.name, status: x.readyToPlay }));
			console.log(playersInRoom);
			io.in(data.id).emit("playersInLobby", playersInRoom);
			// const PlayersNameInLobby = [...lobby.clients].map(x => x.name);
			// console.log(PlayersNameInLobby + ' are in ' + lobby.id);
			// // if(socket.rooms.has(lobby.id))
			// // 		console.log('socket is in room');
			// io.in(lobby.id).emit("playersInLobby", {players:PlayersNameInLobby});
			// console.log('C');
			// console.log('should be emmited to ' + lobby.id);
			console.log(`${socket.id}\x1b[36m\x1b[32m[${client.name}]\x1b[0m has joined the lobby \x1b[36m\x1b[32m${lobby.id}\x1b[0m after creation`);
		});

		socket.on('joinLobby', (data) => {
			client.name = data.name;
			console.log(`${socket.id}\x1b[36m\x1b[32m[${client.name}]\x1b[0m wants to join lobby \x1b[36m\x1b[32m${data.id}\x1b[0m`);
			const lobby = lobbies.get(data.id);
			//If client join a lobby that doesn't exist, create it and add it to our map.
			if(lobby === undefined)
			{
				// const lobby = new Lobby(data.id);

				// lobbies.set(data.id, lobby);
				// lobby.joinedBy(client);
				// socket.emit('navToLobby',{id: data.id})
				// socket.join(data.id);
				// const PlayersNameInLobby = [...lobby.clients].map(x => x.name);
				// console.log(PlayersNameInLobby + ' are in ' + data.id);
				// io.in(data.id).emit("playersInLobby", {players:PlayersNameInLobby});
				// console.log('A');
			}
			else
			{
				lobby.joinedBy(client);
				socket.emit('navToLobby',{id: data.id})
				socket.join(data.id);
				const playersInRoom = [...lobby.clients].map(x => ({name: x.name, status:x.readyToPlay}));
				// console.log(PlayersNameInLobby + ' are in ' + data.id);
				console.log(playersInRoom);
				io.in(data.id).emit("playersInLobby", playersInRoom);
				console.log('B');
			}
			console.log(`${socket.id}\x1b[36m\x1b[32m[${client.name}]\x1b[0m has joined the lobby \x1b[36m\x1b[32m${data.id}\x1b[0m`);

		});

		socket.on('leaveLobby', (data) => {
			const lobbyIdToLeave = data.lobbyId;
			console.log(lobbyIdToLeave);
			console.log(`${socket.id} wants to leave lobby \x1b[36m\x1b[32m${lobbyIdToLeave}\x1b[0m`);
			const lobby = lobbies.get(lobbyIdToLeave);
			lobby.leave(client);
			if(lobby.clients.size === 0) {
				lobbies.delete(lobby.id)
				console.log(`lobby ${lobby.id} is empty and has been deleted.`)
			}
			socket.leave(lobby.id);
		});

		socket.on('checkLobbies', () => {
			console.log(lobbies);
		});

		// socket.on('checkLobby', (...args) => {
		// 	const lobbyToCheck =JSON.parse(args[0]);
		// 	console.log(`${socket.id} wants to check lobby \x1b[36m\x1b[32m${lobbyToCheck.id}\x1b[0m`);
		// 	const lobby = lobbies.get(lobbyToCheck.id);
		// 	if (lobby)
		// 		client.sendCheck({exist:"true", id:lobby.id});
		// 	else
		// 		client.sendCheck({exist:"false", id:null});
		// });

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

		socket.on('sendToChat', (data) => {
					console.log(data);
					io.in(data.lobbyId).emit("receiveMssg", data);
			});

			socket.on('getPlayers', (data) => {
				const lobby = lobbies.get(data.lobbyId);
				const playersInRoom = [...lobby.clients].map(x => ({ name: x.name, status: x.readyToPlay }));
				// console.log(PlayersNameInLobby + ' are in ' + data.id);
				console.log(playersInRoom);
				// if(socket.rooms.has(data.lobbyId))
				// 	console.log('socket is in room');
				socket.emit("playersInLobby", playersInRoom);
		});

		socket.on('readyToPlay', (data) => {
			if(client.readyToPlay === false)
				client.readyToPlay = true;
			else
				client.readyToPlay = false;
			const lobby = lobbies.get(data.lobbyId);
			const playersInRoom = [...lobby.clients].map(x => ({ name: x.name, status: x.readyToPlay }));
			io.in(data.lobbyId).emit("playersInLobby", playersInRoom);
		});
});

httpServer.listen(PORT, () => {
	console.log(`Server listening on ${PORT}`);
});