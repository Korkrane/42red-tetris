const Game = require("./Game");
const Room = require("./Room");
const tetrominos = require('./tetrominos');
const helpers = require("./helpers");
const Client = require('./Client');

describe("Client class", () => {
    let room, client;

    beforeAll(() => {
        client = new Client(helpers.createName())
    });

    it('setName', () => {
        client.setName('Joe');
        expect(client.name).toBe('Joe');
    });

    it('unsetAdmin', () => {
        client.unsetAdmin();
        expect(client.admin).toBe(false);
    });

    it('setAdmin', () => {
        client.setAdmin();
        expect(client.admin).toBe(true);
    });

    it('setReady', () => {
        client.setReady();
        expect(client.readyToPlay).toBe(true);
    });

    it('isReady', () => {
        client.unsetReady();
        expect(client.readyToPlay).toBe(false);
    });

    it('isReady', () => {
        expect(client.isReady()).toBe(false);
        client.setReady();
        expect(client.isReady()).toBe(true);
    });

});
