module.exports = function (socket, rooms, client, io) {

    socket.on('getPlayers', (data) => {
        console.log('receive getPlayers', data);
        const room = rooms.get(data.roomId);
        const playersInRoom = [...room.clients].map(x => ({ name: x.name, status: x.readyToPlay, admin: x.admin }));
        socket.emit("playersInRoom", playersInRoom);
    });

    socket.on('getGames', (data) => {
        const room = rooms.get(data.roomId);
        io.in(data.roomId).emit("gamesInRoom", room.games);
    });
}