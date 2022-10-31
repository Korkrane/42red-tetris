const Game = require("./Game");

class Lobby{

    constructor(id)
    {
      this.id = id;
      this.clients = new Set;
      this.hasStarted = false;
      this.games = new Array;
    }

    joinedBy(client)
    {
      if(client.lobby){
        throw new Error('Client already in a lobby');
      }
      this.clients.add(client);
      const game = new Game(client.name);
      this.games.push(game);
      client.lobby = this;
      console.log(this.games);
      // client.createStage();
    }

    leave(client)
    {
      if(client.lobby != this){
        throw new Error('Client not in lobby');
      }
      this.clients.delete(client);
      client.lobby = null;
    }
  }

module.exports = Lobby;