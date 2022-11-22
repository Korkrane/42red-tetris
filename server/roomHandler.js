const Room = require('./Room');
const helpers = require("./helpers");
const common = require("./common");

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

    const moveClientToRoom = (room, data) => {
        socket.emit('navToRoom', { id: room.id, soloGame: data.soloGame })
    }

    socket.on('createRoom', (data) => {
        console.log('nnn');
        client.setName(data.name);
        const newRoom = createRoom(helpers.createId());
        moveClientToRoom(newRoom, data);
        common.emitPlayersInRoom(newRoom);
    });


    const roomIsJoinable = (room) => {
        // console.log(room.games);
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
            common.emitPlayersInRoom(newRoom);
        }
        else { //check for exceptions then make the client join the room
            if(roomIsJoinable(room))
            {
                console.log('room is joinable');
                clientJoinRoom(room);
                //TODO refacto avec le if du dessus possible
                moveClientToRoom(room, data);
                const playersInRoom = [...room.clients].map(x => ({ name: x.name, status: x.readyToPlay, admin: x.admin }));
                console.log(playersInRoom);
                common.emitPlayersInRoom(room);
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
        //TO DO CHECK UNUSED ROOM CUZ DISAPPEAR DURING GAME
        // room.removeGame();
        if (room.isEmpty())
            rooms.delete(room.id);
        else
        {
            client.unsetAdmin();
            client.unsetReady();
            room.setNewAdmin();
        }
        socket.leave(room.id);
        common.emitPlayersInRoom(room);
    });

    const updateClientStatus = () => {
        console.log(client);
        if (!client.isReady())
            client.setReady();
        else
            client.unsetReady();
    }

    socket.on('readyToPlay', (data) => {
        console.log('lol', data, rooms);
        const room = rooms.get(data.roomId);

        updateClientStatus();
        common.emitPlayersInRoom(room);
        common.startGame(room);
    });
};