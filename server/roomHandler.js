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

    // let drop;

    const startGame = (room) => {
        if (room.allPlayersAreReady()) {
            room.startGame();
            console.log('emit gameStart');
            io.in(room.id).emit("gameStart");
            common.dropLoop(room);
            // drop = setInterval(lol, 1000, room);
        }
    }

    socket.on('readyToPlay', (data) => {
        const room = rooms.get(data.roomId);

        updateClientStatus();
        emitPlayersInRoom(room);
        startGame(room);
    });

    // const emitResults = (room) => {
    //     const highestScore = Math.max.apply(Math, room.games.map(function (o) { return o.score; }));
    //     const winnerGame = room.games.find(function (o) { return o.score == highestScore; });
    //     io.in(room.id).emit("results", { name: winnerGame.playerName, score: winnerGame.score });
    //     clearInterval(drop);
    // }

    // const unsetReadyToPlayStatus = (room) => {
    //     room.hasStarted = false;
    //     room.clients.forEach(client => {
    //         client.unsetReady();
    //     })
    // }

    // const finishGame = (room) => {
    //     emitResults(room);
    //     unsetReadyToPlayStatus(room);
    //     emitPlayersInRoom(room);
    // }

    // function lol(room)
    // {
    //     const gamesToDrop = [...room.games]
    //     for (const game of gamesToDrop) {
    //         game.drop();
    //     }
    //     if (room.allPlayersHaveLost()) {
    //         common.finishGame(room);
    //         return;
    //     }
    //     io.in(room.id).emit("playerMoved", room.games);
    // }


};