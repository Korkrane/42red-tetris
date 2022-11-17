module.exports = function (socket, rooms, client, io) {

    const emitPlayersInRoom = (room) => {
        const playersInRoom = [...room.clients].map(x => ({ name: x.name, status: x.readyToPlay, admin: x.admin }));
        io.in(room.id).emit("playersInRoom", playersInRoom);
    }

    const unsetReadyToPlayStatus = (room) => {
        room.hasStarted = false;
        room.clients.forEach(client => {
            client.unsetReady();
        })
    }

    const finishGame = (room) => {
        emitResults(room);
        unsetReadyToPlayStatus(room);
        emitPlayersInRoom(room);
    }

    const emitResults = (room) => {
        const highestScore = Math.max.apply(Math, room.games.map(function (o) { return o.score; }));
        const winnerGame = room.games.find(function (o) { return o.score == highestScore; });
        io.in(room.id).emit("results", {name:winnerGame.playerName, score:winnerGame.score});
    }

    socket.on('drop', (data) => {
        // console.log('receive drop', data, 'from', client.name);
        // const room = rooms.get(data.id);
        // const gameToUpdate = room.games.find(({ playerName }) => playerName === client.name);
        // gameToUpdate.drop();
        // if (room.allPlayersHaveLost()) {
        //     finishGame(room);
        //     return ;
        // }
        // io.in(room.id).emit("playerMoved", room.games);
    });

    socket.on('move', (data) => {
        console.log('receive move', data, 'from', client.name);
        const room = rooms.get(data.id);
        const gameToUpdate = room.games.find(({ playerName }) => playerName === client.name);
        gameToUpdate.move(data.keyCode);
        if (room.allPlayersHaveLost()) {
            finishGame(room);
            return;
        }
        io.in(room.id).emit("playerMoved", room.games);
    });

    const startGame = (room) => {
        if (room.allPlayersAreReady()) {
            room.startGame();
            console.log('emit gameStart');
            io.in(room.id).emit("gameStart");
        }
    }

    const cleanGames = (room) => {
        room.clean();
        console.log('emit gamesInRoom');
        io.in(room.id).emit("gamesInRoom", room.games);
    }

    const setReadyToPlayStatus = (room) => {
        room.clients.forEach(client => {
            client.setReady();
        })
    }

    socket.on('resetGame', (data) => {
        console.log('receive resetGame', data);
        const room = rooms.get(data.roomId);
        cleanGames(room);
        setReadyToPlayStatus(room);
        emitPlayersInRoom(room);
        startGame(room);
    });

}