const common = require("./common");

module.exports = function (socket, rooms, client, io) {

    socket.on('move', (data) => {
        console.log('receive move', data, 'from', client.name);
        const room = rooms.get(data.id);
        const gameToUpdate = room.games.find(({ playerName }) => playerName === client.name);
        gameToUpdate.move(data.keyCode);
        if (room.allPlayersHaveLost()) {
            common.finishGame(room);
            return;
        }
        io.in(room.id).emit("playerMoved", room.games);
    });

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
        common.emitPlayersInRoom(room);
        common.startGame(room);
    });

}