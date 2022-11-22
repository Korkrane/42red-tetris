const Game = require("./Game");
const Room = require("./Room");
const {Client: clientObject} = require('./Client');
const Client = require("socket.io-client");
const {io, rooms, player, server} = require('./index');
jest.setTimeout(25000);
const common = require("./common");

describe("roomHandler", () => {
    let serverSocket, clientSocket, roomId;

    beforeAll((done) => {
        clientSocket = new Client(`http://localhost:4000`);
        io.on("connection", (socket) => {
            serverSocket = socket;
        });
        clientSocket.on("connect", done);
    });

    it("createRoom event", (done) => {
        serverSocket.on("createRoom", (data) => {
            const first = [...rooms][0];
            roomId = first[1].id;
            expect(rooms.size).toBe(1);
            done();
        });
        const data = { name: 'creatorName' }
        clientSocket.emit("createRoom", data);

    });

    it("move event", (done) => {
        serverSocket.on("move", (data) => {
            const first = [...rooms][0];
            roomId = first[1].id;
            expect(rooms.size).toBe(1);
            done();
        });
        const data = { id: roomId, keyCode:38};
        clientSocket.emit("move", data);
    });

    // it("resetGame event", (done) => {
    //     serverSocket.on("resetGame", (data) => {
    //         const first = [...rooms][0];
    //         roomId = first[1].id;
    //         expect(rooms.size).toBe(1);
    //         done();
    //     });
    //     const data = { roomId: roomId };
    //     clientSocket.emit("resetGame", data);
    // });

    it("getGames event", (done) => {
        serverSocket.on("getGames", (data) => {
            expect(rooms.size).toBe(1);
            done();
        });
        const data = { roomId: roomId };
        clientSocket.emit("getGames", data);
    });

    it("getPlayers event", (done) => {
        serverSocket.on("getPlayers", (data) => {
            expect(rooms.size).toBe(1);
            done();
        });
        const data = { roomId: roomId };
        clientSocket.emit("getPlayers", data);
    });

    it("finishGame function", (done) => {
        const first = [...rooms][0];
        console.log(first[1]);
        common.finishGame(first[1]);
        expect(rooms.size).toBe(1);
        done();
    });

    it("drop function", (done) => {
        const first = [...rooms][0];
        console.log(first[1]);
        common.drop(first[1]);
        expect(rooms.size).toBe(1);
        done();
    });

    it("joinRoom event", (done) => {
        serverSocket.on("joinRoom", (data) => {
            expect(rooms.size).toBe(1);
            done();
        });
        const data = { id: roomId };
        clientSocket.emit("joinRoom", data);
    });

    it("leaveRoom event", (done) => {
        serverSocket.on("leaveRoom", (data) => {
            expect(rooms.size).toBe(0);
            done();
        });
        const data = { id: roomId }
        clientSocket.emit("leaveRoom", data);
    });

    afterAll(() => {
        io.close();
        clientSocket.close();
    });
});


// const Game = require("./Game");
// const Room = require("./Room");
// const { Client: clientObject } = require('./Client');
// const Client = require("socket.io-client");
// const { io, rooms, player, server } = require('./index');
// jest.setTimeout(25000);

// describe("roomHandler", () => {
//     let serverSocket, clientSocket, roomId;

//     beforeAll((done) => {
//         clientSocket = new Client(`http://localhost:4000`);
//         io.on("connection", (socket) => {
//             serverSocket = socket;
//         });
//         clientSocket.on("connect", done);
//     });

//     it("createRoom event", (done) => {
//         serverSocket.on("createRoom", (data) => {
//             const first = [...rooms][0];
//             roomId = first[1].id;
//             expect(rooms.size).toBe(1);
//             done();
//         });
//         const data = { name: 'creatorName' }
//         clientSocket.emit("createRoom", data);
//     });

//     it("move event", (done) => {
//         serverSocket.on("move", (data) => {
//             const first = [...rooms][0];
//             roomId = first[1].id;
//             expect(rooms.size).toBe(1);
//             done();
//         });
//         const data = { id: roomId, keyCode:38};
//         clientSocket.emit("move", data);
//     });

//     afterAll(() => {
//         io.close();
//         clientSocket.close();
//     });
// });
