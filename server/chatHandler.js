module.exports = function (socket, io) {

    socket.on('sendToChat', (data) => {
        io.in(data.roomId).emit('receiveMssg', data);
    });
}