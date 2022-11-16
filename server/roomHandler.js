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


    const roomIsJoinable = (room) => {
        const roomHasDuplicatePlayerName = room.games.find(({ playerName }) => playerName === client.name)

        if (room.hasStarted === true) {
            socket.emit("cantJoin", '- game has started');
            return false;
        }
        else if (roomHasDuplicatePlayerName) {
            socket.emit("cantJoin", '- duplicate playername');
            return false;
        }

        return true;
    }

    socket.on('joinRoom', (data) => {
        client.setName(data.name);
        const room = rooms.get(data.id);

        if (room === undefined) { //join a non-existent room
            const newRoom = createRoom(data.id);
            moveClientToRoom(newRoom, data);
            emitPlayersInRoom(newRoom);
        }
        else { //check for exceptions then make the client join the room
            if(roomIsJoinable(room))
            {
                clientJoinRoom(room);
                moveClientToRoom(room, data);
                emitPlayersInRoom(room);
            }
        }
    });

    socket.on('leaveRoom', (data) => {
        const room = rooms.get(data.id);

        //TODO shouldnt emit. but emit on emitResults
        //allow to tell front that one of the game is over and display the score msg
        if (room.hasStarted) { //player leaving while game is on make him automatically lose.
            const gameToUpdate = room.games.find(({ playerName }) => playerName === client.name);
            gameToUpdate.lose();
            io.in(data.id).emit("gamesInRoom", room.games);
        }
        room.remove(client);
        if (room.isEmpty())
            rooms.delete(room.id);
        else
            room.setNewAdmin();
        socket.leave(room.id);
        emitPlayersInRoom(room);
    });

    const updateClientStatus = () => {
        if (!client.isReady())
            client.setReady();
        else
            client.unsetReady();
    }

    const startGame = (room) => {
        if (room.allPlayersAreReady()) {
            room.startGame();
            console.log('emit gameStart');
            io.in(data.roomId).emit("gameStart");
        }
    }

    socket.on('readyToPlay', (data) => {
        const room = rooms.get(data.roomId);

        updateClientStatus();
        emitPlayersInRoom(room);
        startGame(room);
    });
};