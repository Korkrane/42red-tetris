const express = require('express');
const cors = require('cors');
const app = express();

const Client = require('./Client');
const Room = require('./Room');
const helpers = require("./helpers");
const PORT = 4000;


const httpServer = require("http").createServer();
const rooms = new Map;
const io = require("socket.io")(httpServer, {
	cors: {
	  origin: "http://localhost:3000"

	}
  });

app.use(cors());

io.on('connection', (socket) => {
		console.log(`⚡: ${socket.id} user just connected!`);
		const client = new Client(socket, helpers.createName())

		socket.on('createRoom', (data) => {
			console.log(`${socket.id}\x1b[36m\x1b[32m[${client.name}]\x1b[0m creates a new Room`);
			client.setName(data.name);
			const room = new Room(helpers.createId());
			rooms.set(room.id, room);
			room.addClient(client);
			socket.join(room.id);
			socket.emit('navToRoom',{id: room.id})
			const playersInRoom = [...room.clients].map(x => ({ name: x.name, status: x.readyToPlay }));
			io.in(data.id).emit("playersInRoom", playersInRoom);
			console.log(`${socket.id}\x1b[36m\x1b[32m[${client.name}]\x1b[0m has joined the room \x1b[36m\x1b[32m${room.id}\x1b[0m after creation`);
		});

		socket.on('joinRoom', (data) => {
			client.setName(data.name);
			console.log(`${socket.id}\x1b[36m\x1b[32m[${client.name}]\x1b[0m wants to join room \x1b[36m\x1b[32m${data.id}\x1b[0m`);
			const room = rooms.get(data.id);
			//If client join a room that doesn't exist, create it and add it to our map.
			if(room === undefined)
			{
				// const room = new Room(data.id);

				// rooms.set(data.id, room);
				// room.addClient(client);
				// socket.emit('navToRoom',{id: data.id})
				// socket.join(data.id);
				// const PlayersNameInRoom = [...room.clients].map(x => x.name);
				// console.log(PlayersNameInRoom + ' are in ' + data.id);
				// io.in(data.id).emit("playersInRoom", {players:PlayersNameInRoom});
				// console.log('A');
			}
			else
			{
				if(room.hasStarted === true)
				{
					console.log('couldnt join the room');
					socket.emit("cantJoin");
					return;
				}
				room.addClient(client);
				socket.emit('navToRoom',{id: data.id})
				socket.join(data.id);
				const playersInRoom = [...room.clients].map(x => ({name: x.name, status:x.readyToPlay}));
				// console.log(PlayersNameInRoom + ' are in ' + data.id);
				console.log(playersInRoom);
				io.in(data.id).emit("playersInRoom", playersInRoom);
				console.log('B');
			}
			console.log(`${socket.id}\x1b[36m\x1b[32m[${client.name}]\x1b[0m has joined the room \x1b[36m\x1b[32m${data.id}\x1b[0m`);

		});

		socket.on('leaveRoom', (data) => {
			const roomIdToLeave = data.roomId;
			client.readyToPlay = false;
			console.log(roomIdToLeave);
			console.log(`${socket.id} wants to leave room \x1b[36m\x1b[32m${roomIdToLeave}\x1b[0m`);
			const room = rooms.get(roomIdToLeave);
			room.leave(client);
			if(room.clients.size === 0) {
				rooms.delete(room.id)
				console.log(`room ${room.id} is empty and has been deleted.`)
			}
			socket.leave(room.id);
			const playersInRoom = [...room.clients].map(x => ({name: x.name, status:x.readyToPlay}));
			io.in(roomIdToLeave).emit("playersInRoom", playersInRoom);
		});

		socket.on('checkLobbies', () => {
			console.log(rooms);
		});

		socket.on('disconnect', () => {
			console.log('🔥: A user disconnected');
			const room = client.room;
			if(room){
					console.log(`He was in ${room.id}`)
					room.leave(client);
					const playersInRoom = [...room.clients].map(x => ({name: x.name, status:x.readyToPlay}));
					io.in(room.id).emit("playersInRoom", playersInRoom);
					if(room.clients.size === 0) {
						rooms.delete(room.id)
						console.log(`room ${room.id} is empty and has been deleted.`)
					}
			}
		});

		socket.on('sendToChat', (data) => {
					console.log(data);
					io.in(data.roomId).emit("receiveMssg", data);
			});

			socket.on('getPlayers', (data) => {
				const room = rooms.get(data.roomId);
				const playersInRoom = [...room.clients].map(x => ({ name: x.name, status: x.readyToPlay }));
				// console.log(PlayersNameInroom + ' are in ' + data.id);
				console.log(playersInRoom);
				// if(socket.rooms.has(data.roomId))
				// 	console.log('socket is in room');
				socket.emit("playersInRoom", playersInRoom);
		});

		socket.on('readyToPlay', (data) => {
			if(client.readyToPlay === false)
				client.readyToPlay = true;
			else
				client.readyToPlay = false;
			const room = rooms.get(data.roomId);
			const playersInRoom = [...room.clients].map(x => ({ name: x.name, status: x.readyToPlay }));
			io.in(data.roomId).emit("playersInRoom", playersInRoom);

			console.log(playersInRoom);
			const allTitlesAreTrue = playersInRoom.every(x => x.status === true);
			if(allTitlesAreTrue === true)
			{
				console.log("all players are ready");
				//block joinable room
				room.hasStarted = true;
				console.log(room);
				io.in(data.roomId).emit("gameStart");
			}

		});

		socket.on('getGames', (data) => {
			console.log('--------');
			console.log(data);
			const room = rooms.get(data.roomId);
			const games = room.games;
			io.in(data.roomId).emit("gamesInRoom", games);
		});

		socket.on('getIndividualGame', (data) => {
			const room = rooms.get(data.roomId);
			const game = room.games.find(({ playerName }) => playerName === client.name);
			socket.emit("getIndividualGame", game);
		});

		// socket.on('playerMove', (data) => {
		// 	const room = rooms.get(data.roomId);
		// 	const gameToUpdate = room.games.find(({ playerName }) => playerName === client.name);
		// 	gameToUpdate.updateKey(data.keyCode);
		// 	const games = room.games;
		// 	io.in(data.roomId).emit("playerMoved", games);
		// });

		socket.on('playerUpdate', (data) => {
			// console.log('-receive-')
			// console.log(data.stage);
			// console.log('--')
			const room = rooms.get(data.roomId);
			const gameToUpdate = room.games.find(({ playerName }) => playerName === client.name);
			gameToUpdate.updatePlayer(data.player, data.stage);
			gameToUpdate.updateKey(data.keyCode);
			// console.log('-send-')
			// console.log(gameToUpdate.stage);
			// console.log('--')
			const games = room.games;
			io.in(data.roomId).emit("playerMoved", games);
		});
});

httpServer.listen(PORT, () => {
	console.log(`Server listening on ${PORT}`);
});