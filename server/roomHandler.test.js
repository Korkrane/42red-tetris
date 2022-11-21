const Game = require("./Game");
const Room = require("./Room");
const tetrominos = require('./tetrominos');
const helpers = require("./helpers");
// const {Client} = require('./Client');
const Client = require("socket.io-client");
const {io} = require('./index');

describe("roomHandler", () => {
    let room, client, clientSocket;

    beforeAll((done) => {
        room = new Room('foo');
        // client = new Client(helpers.createName())
        clientSocket = new Client(`http://localhost:4000`);
        clientSocket.on("connect", done);
    });

    it('should be empty', () => {
        expect(room.isEmpty()).toBe(true);
    });

    afterAll(() => {
        io.close();
        clientSocket.close();
    });
});
