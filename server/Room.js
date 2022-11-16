const Game = require("./Game");
const tetrominos = require('./tetrominos');

class Room{

    constructor(id)
    {
      this.id = id;
      this.clients = new Set;
      this.hasStarted = false;
      this.games = new Array;
      this.tetrominoSeed = this.createTetrominoSeed()
    }

    createTetrominoSeed()
    {
      return Array.from({length:50}, () => tetrominos.randomTetromino())
    }

    addClient(client)
    {
      this.clients.add(client);
      const game = new Game(client.name, this.tetrominoSeed);
      this.games.push(game);
      client.room = this;
    }

    remove(client)
    {
      this.clients.delete(client);
      client.room = null;
    }

    isEmpty()
    {
      return (this.clients.size === 0 ? true : false);
    }

    setNewAdmin()
    {
      const randomClient = [...this.clients][Math.floor(Math.random() * this.clients.size)];
      randomClient.admin = true;
    }

    allPlayersAreReady()
    {
      return ([...this.clients].every(x => x.readyToPlay === true));
    }
  }

module.exports = Room;