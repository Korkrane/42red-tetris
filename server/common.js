const Room = require('./Room');
const Client = require('./Client');
const { io } = require('./index')

function drop(room) {
    const gamesToDrop = [...room.games]
    for (const game of gamesToDrop) {
        game.drop();
    }
    if (room.allPlayersHaveLost()) {
        finishGame(room);
        return;
    }
    io.in(room.id).emit("playerMoved", room.games);
}

const emitPlayersInRoom = (room) => {
    const playersInRoom = [...room.clients].map(x => ({ name: x.name, status: x.readyToPlay, admin: x.admin }));
    io.in(room.id).emit("playersInRoom", playersInRoom);
}

const emitResults = (room) => {
    const highestScore = Math.max.apply(Math, room.games.map(function (o) { return o.score; }));
    const winnerGame = room.games.find(function (o) { return o.score == highestScore; });
    io.in(room.id).emit("results", { name: winnerGame.playerName, score: winnerGame.score });
    clearInterval(dropInterval);
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

let dropInterval;

const dropLoop = (room) => {
    dropInterval = setInterval(drop, 1000, room);
}

module.exports = { dropLoop, emitResults, unsetReadyToPlayStatus, finishGame, drop}