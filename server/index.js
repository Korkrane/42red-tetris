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
			console.log(data.soloGame);
			client.setName(data.name);
			client.setAdmin();
			const room = new Room(helpers.createId());
			rooms.set(room.id, room);
			room.addClient(client);
			socket.join(room.id);
			socket.emit('navToRoom',{id: room.id, soloGame:data.soloGame})
			const playersInRoom = [...room.clients].map(x => ({ name: x.name, status: x.readyToPlay, admin:x.admin }));
			io.in(data.id).emit("playersInRoom", playersInRoom);
			console.log(`${socket.id}\x1b[36m\x1b[32m[${client.name}]\x1b[0m has joined the room \x1b[36m\x1b[32m${room.id}\x1b[0m after creation`);
		});

		socket.on('joinRoom', (data) => {
			client.setName(data.name);
			console.log(`${socket.id}\x1b[36m\x1b[32m[${client.name}]\x1b[0m wants to join room \x1b[36m\x1b[32m${data.id}\x1b[0m`);
			const room = rooms.get(data.id);
			if(room === undefined)
			{
				console.log(data.id, 'undefined')
				const room = new Room(data.id);
				client.setAdmin();
				rooms.set(room.id, room);
				room.addClient(client);
				socket.join(room.id);
				socket.emit('navToRoom', { id: data.id, soloGame: data.soloGame })
				const playersInRoom = [...room.clients].map(x => ({ name: x.name, status: x.readyToPlay, admin: x.admin }));
				io.in(data.id).emit("playersInRoom", playersInRoom);
			}
			else
			{
				console.log(data.id, 'defined')
				const game = room.games.find(({ playerName }) => playerName === client.name)
				if(room.hasStarted === true){
					socket.emit("cantJoin", '- game has started');
					return;
				}
				else if(game){
					socket.emit("cantJoin", '- duplicate playername');
					return;
				}
				room.addClient(client);
				socket.emit('navToRoom', { id: data.id, soloGame: data.soloGame })
				socket.join(data.id);
				const playersInRoom = [...room.clients].map(x => ({ name: x.name, status: x.readyToPlay, admin: x.admin }));
				io.in(data.id).emit("playersInRoom", playersInRoom);
			}
			console.log(`${socket.id}\x1b[36m\x1b[32m[${client.name}]\x1b[0m has joined the room \x1b[36m\x1b[32m${data.id}\x1b[0m`);
		});

		socket.on('leaveRoom', (data) => {
			const roomIdToLeave = data.roomId;
			client.readyToPlay = false;
			if(client.admin)
				client.unsetAdmin();
			console.log(roomIdToLeave);
			console.log(`${socket.id} wants to leave room \x1b[36m\x1b[32m${roomIdToLeave}\x1b[0m`);
			const room = rooms.get(roomIdToLeave);

			if (room.hasStarted)
			{
				const gameToUpdate = room.games.find(({ playerName }) => playerName === client.name);
				gameToUpdate.lose();
				const games = room.games;
				io.in(data.roomId).emit("gamesInRoom", games);
			}
			room.leave(client);
			if(room.clients.size === 0) {
				rooms.delete(room.id)
				console.log(`room ${room.id} is empty and has been deleted.`)
			}
			socket.leave(room.id);
			const playersInRoom = [...room.clients].map(x => ({ name: x.name, status: x.readyToPlay, admin: x.admin }));
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
				const playersInRoom = [...room.clients].map(x => ({ name: x.name, status: x.readyToPlay, admin: x.admin }));
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
				const playersInRoom = [...room.clients].map(x => ({ name: x.name, status: x.readyToPlay, admin: x.admin }));
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
			const playersInRoom = [...room.clients].map(x => ({ name: x.name, status: x.readyToPlay, admin: x.admin }));
			io.in(data.roomId).emit("playersInRoom", playersInRoom);

			console.log(playersInRoom);
			const allTitlesAreTrue = playersInRoom.every(x => x.status === true);
			if(allTitlesAreTrue === true)
			{
				console.log("all players are ready");
				//block joinable room
				room.hasStarted = true;
				console.log(room);
				const games = room.games;
				console.log('--foreach--')
				games.forEach(game => {
					game.setStage();
				})
				console.log('--end of foreach--')
				console.log('emit gameStart');
				io.in(data.roomId).emit("gameStart");
			}

		});

		socket.on('getGames', (data) => {
			const room = rooms.get(data.roomId);
			io.in(data.roomId).emit("gamesInRoom", room.games);
		});

		socket.on('getIndividualGame', (data) => {
			const room = rooms.get(data.roomId);
			const game = room.games.find(({ playerName }) => playerName === client.name);
			socket.emit("getIndividualGame", game);
		});

		socket.on('rawDrop', (data) => {
			console.log('receive rawdrop');
			const room = rooms.get(data.roomId);
			const gameToUpdate = room.games.find(({ playerName }) => playerName === client.name);
			gameToUpdate.drop();
			const gameEnded = room.games.every(game => game.gameOver === true);
			if (gameEnded) {
				console.log('they all lost');
				const highestScore = Math.max.apply(Math, room.games.map(function (o) { return o.score; }));
				const winnerGame = room.games.find(function (o) { return o.score == highestScore; });
				console.log(winnerGame.playerName);
				winnerGame.setWin();
				io.in(data.roomId).emit("gameEnd", winnerGame.playerName, winnerGame.score);
				//TODO reset game of every1
				room.hasStarted = false;
				room.clients.forEach(client => {
					client.resetReady();
				})
				room.games.forEach(game => {
					game.reset();
				})
				const playersInRoom = [...room.clients].map(x => ({ name: x.name, status: x.readyToPlay, admin: x.admin }));
				io.in(data.roomId).emit("playersInRoom", playersInRoom);
			}
			io.in(data.roomId).emit("playerMoved", room.games);
		});

		socket.on('move', (data) => {
			console.log('receive move', data);
			const room = rooms.get(data.roomId);
			const gameToUpdate = room.games.find(({ playerName }) => playerName === client.name);
			gameToUpdate.move(data.keyCode);
			const gameEnded = room.games.every(game => game.gameOver === true);
			if (gameEnded) {
				console.log('they all lost');
				const highestScore = Math.max.apply(Math, room.games.map(function (o) { return o.score; }));
				const winnerGame = room.games.find(function (o) { return o.score == highestScore; });
				console.log(winnerGame.playerName);
				winnerGame.setWin();
				io.in(data.roomId).emit("gameEnd", winnerGame.playerName, winnerGame.score);
				//TODO reset game of every1
				room.hasStarted = false;
				room.clients.forEach(client => {
					console.log('set unready');
					client.resetReady();
				})
				room.games.forEach(game => {
					game.reset();
				})
				const playersInRoom = [...room.clients].map(x => ({ name: x.name, status: x.readyToPlay, admin: x.admin }));
				io.in(data.roomId).emit("playersInRoom", playersInRoom);
			}
			io.in(data.roomId).emit("playerMoved", room.games);
		});

	socket.on('resetGame', (data) => {
		console.log('receive resetGame', data);

		const room = rooms.get(data.roomId);
		// const playersInRoom = [...room.clients].map(x => ({ name: x.name, status: x.readyToPlay, admin: x.admin }));
		// io.in(data.roomId).emit("playersInRoom", playersInRoom);

		// console.log(playersInRoom);
		room.hasStarted = true;
		console.log(room);
		const games = room.games;
		console.log('--foreach--')
		games.forEach(game => {
			game.setStage();
		})
		console.log('--end of foreach--')
		console.log('emit gameStart');
		io.in(data.roomId).emit("gameStart");
		// const room = rooms.get(data.roomId);
		// io.in(data.roomId).emit("gameReseted", room.games);


		// const playersInRoom = [...room.clients].map(x => ({ name: x.name, status: x.readyToPlay }));
		// playersInRoom.forEach(player => {
		// 	player.status = false;
		// })

		// // console.log(PlayersNameInroom + ' are in ' + data.id);
		// console.log(playersInRoom);
		// // if(socket.rooms.has(data.roomId))
		// // 	console.log('socket is in room');
		// socket.emit("playersInRoom", playersInRoom);
	});
});

httpServer.listen(PORT, () => {
	console.log(`Server listening on ${PORT}`);
});