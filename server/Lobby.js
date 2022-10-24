class Lobby{

    constructor(id)
    {
      this.id = id;
      this.clients = new Set;
      this.hasStarted = false;
    }

    joinedBy(client)
    {
      if(client.lobby){
        throw new Error('Client already in a lobby');
      }
      this.clients.add(client);
      client.lobby = this;
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