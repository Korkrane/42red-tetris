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
        emitGameEnd(room);
        unsetReadyToPlayStatus(room);
        emitPlayersInRoom(room);
    }

    //TODO rename as emitResults
    const emitGameEnd = (room) => {
        const highestScore = Math.max.apply(Math, room.games.map(function (o) { return o.score; }));
        const winnerGame = room.games.find(function (o) { return o.score == highestScore; });
        winnerGame.setWin();
        io.in(room.id).emit("gameEnd", winnerGame.playerName, winnerGame.score);
    }

    socket.on('drop', (data) => {
        console.log('receive drop', data, 'from', client.name);
        const room = rooms.get(data.id);
        const gameToUpdate = room.games.find(({ playerName }) => playerName === client.name);
        gameToUpdate.drop();
        if (room.allPlayersHaveLost()) {
            finishGame(room);
            return ;
        }
        io.in(room.id).emit("playerMoved", room.games);
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

    socket.on('resetGame', (data) => {
        console.log('receive resetGame', data);
        const room = rooms.get(data.roomId);
        room.clean();
        console.log('emit gamesInRoom');
        io.in(room.id).emit("gamesInRoom", room.games);
        room.startGame();
        emitPlayersInRoom(room);
        console.log('emit gameStart');
        io.in(room.id).emit("gameStart");
    });

}