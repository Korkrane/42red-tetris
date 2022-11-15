const Room = require('./Room');
const helpers = require("./helpers");

module.exports = function (socket, rooms, client, io) {

    const clientJoinRoom = (room) => {
        room.addClient(client);
        socket.join(room.id);
    }

    const createRoom = (id) => {
        const room = new Room(id);
        rooms.set(room.id, room);
        clientJoinRoom(room)
        client.setAdmin();

        return room;
    }

    const emitPlayersInRoom = (room) => {
        const playersInRoom = [...room.clients].map(x => ({ name: x.name, status: x.readyToPlay, admin: x.admin }));
        io.in(room.id).emit("playersInRoom", playersInRoom);
    }

    const moveClientToRoom = (room, data) => {
        socket.emit('navToRoom', { id: room.id, soloGame: data.soloGame })
    }

    socket.on('createRoom', (data) => {
        client.setName(data.name);
        const newRoom = createRoom(helpers.createId());
        moveClientToRoom(newRoom, data);
        emitPlayersInRoom(newRoom);
    });

    socket.on('joinRoom', (data) => {
        client.setName(data.name);
        const room = rooms.get(data.id);

        if (room === undefined) { //join a non-existent room
            const newRoom = createRoom(data.id);
            moveClientToRoom(newRoom, data);
            emitPlayersInRoom(newRoom);
        }
        else { //check for exceptions then make the client join the room
            const game = room.games.find(({ playerName }) => playerName === client.name)
            if (room.hasStarted === true) {
                socket.emit("cantJoin", '- game has started');
                return;
            }
            else if (game) {
                socket.emit("cantJoin", '- duplicate playername');
                return;
            }
            clientJoinRoom(room);
            moveClientToRoom(room, data);
            emitPlayersInRoom(room);
        }
    });

    socket.on('leaveRoom', (data) => {
        console.log()
        client.clearStatus();
        const room = rooms.get(data.id);

        if (room.hasStarted) { //ingame, player leave make him automatically lose.
            const gameToUpdate = room.games.find(({ playerName }) => playerName === client.name);
            gameToUpdate.lose();
            const games = room.games;
            io.in(data.id).emit("gamesInRoom", games);
        }
        room.leave(client);
        if (room.clients.size === 0) //room empty
            rooms.delete(room.id)
        else { //make another client room admin
            const randomClient = [...room.clients][Math.floor(Math.random() * room.clients.size)];
            randomClient.admin = true;
        }
        socket.leave(room.id);
        emitPlayersInRoom(room);
    });
};