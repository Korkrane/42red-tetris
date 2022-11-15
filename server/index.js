const express = require('express');
const app = express();
const cors = require('cors');

const Client = require('./Client');
const Room = require('./Room');
const helpers = require("./helpers");
const PORT = 4000;


const httpServer = require("http").createServer();
const io = require("socket.io")(httpServer, {
	cors: {
	  origin: "http://localhost:3000"
	}
  });

app.use(cors());

const rooms = new Map;

io.on('connection', (socket) => {
		console.log(`⚡: ${socket.id} user just connected!`);
		const client = new Client(socket, helpers.createName())

		require('./roomHandler')(socket, rooms, client, io);

		socket.on('disconnect', () => {
			console.log('🔥: A user disconnected');
			const room = client.room;
			if(room)
			{
				room.leave(client);
				const playersInRoom = [...room.clients].map(x => ({ name: x.name, status: x.readyToPlay, admin: x.admin }));
				io.in(room.id).emit("playersInRoom", playersInRoom);
				if(room.clients.size === 0)
				{
					rooms.delete(room.id)
					console.log(`room ${room.id} is empty and has been deleted.`)
				}
			}
		});

		socket.on('sendToChat', (data) => {
					console.log('receive sendToChat', data);
					io.in(data.roomId).emit('receiveMssg', data);
			});

		socket.on('getPlayers', (data) => {
			console.log('receive getPlayers', data);
				const room = rooms.get(data.roomId);
				const playersInRoom = [...room.clients].map(x => ({ name: x.name, status: x.readyToPlay, admin: x.admin }));
				// console.log(PlayersNameInroom + ' are in ' + data.id);
				console.log(playersInRoom);
				// if(socket.rooms.has(data.roomId))
				// 	console.log('socket is in room');
				socket.emit("playersInRoom", playersInRoom);
		});

		socket.on('readyToPlay', (data) => {
			console.log('receive readyToPlay', data);
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
			console.log('receive rawdrop', data);
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

	});

	return io;
});

httpServer.listen(PORT, () => {
	console.log(`Server listening on ${PORT}`);
});