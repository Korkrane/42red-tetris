module.exports = function (socket, rooms, client, io) {

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

}