const express = require('express');
const app = express();
const cors = require('cors');
const Client = require('./Client');
const helpers = require("./helpers");
const PORT = 4000;

const httpServer = require("http").createServer();
let io = require("socket.io")(httpServer, {
	cors: {
	  origin: "http://localhost:3000"
	}
  });

app.use(cors());

const rooms = new Map;

io.on('connection', (socket) => {

	console.log(`⚡: ${socket.id} user just connected!`);
	const client = new Client(socket, helpers.createName())

	socket.on('disconnect', () => {
		console.log('🔥: A user disconnected');
		const room = client.room;
		if (room) {
			room.remove(client);
			const playersInRoom = [...room.clients].map(x => ({ name: x.name, status: x.readyToPlay, admin: x.admin }));
			io.in(room.id).emit("playersInRoom", playersInRoom);
			if (room.clients.size === 0)
				rooms.delete(room.id)
		}
	});

	require('./roomHandler')(socket, rooms, client, io);
	require('./chatHandler')(socket, io);
	require('./gameActionHandler')(socket, rooms, client, io);
	require('./getRoomDataHandler')(socket, rooms, client, io);

	return io;
});

exports.io  = io;

httpServer.listen(PORT, () => {
	console.log(`Server listening on ${PORT}`);
});