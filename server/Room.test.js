const Game = require("./Game");
const Room = require("./Room");
const tetrominos = require('./tetrominos');
const helpers = require("./helpers");
const Client = require('./Client');

describe("Game class", () => {
    let room, client;

    beforeAll(() => {
        room = new Room('foo');
        client = new Client(helpers.createName())
    });

    it('should be empty', () => {
        expect(room.isEmpty()).toBe(true);
    });

    it('addClient', () => {
        room.addClient(client);
        expect(room.clients.size).toBe(1);
    });

    it('allPlayersAreReady', () => {
        room.addClient(client);
        client.setReady();
        expect(room.allPlayersAreReady()).toBe(true);
        expect(room.isEmpty()).toBe(false);
    });


    it('addClient', () => {
        room.addClient(client);
        room.remove(client)
        expect(room.clients.size).toBe(0);
    });

    it('setNewAdmin', () => {
        room.addClient(client);
        room.setNewAdmin();
        expect(client.admin).toBe(true);
    });

    it('allPlayersHaveLost', () => {
        expect(room.allPlayersHaveLost()).toBe(false);
    });

    it('clean', () => {
        room.clean()
        expect(room.games.length).toBe(4);
    });


    it('removeGame', () => {
        room.removeGame()
        expect(room.games.length).toBe(4);
    });

    it('startGame', () => {
        room.startGame()
        expect(room.hasStarted).toBe(true);
    });
});
