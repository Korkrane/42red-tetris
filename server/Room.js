class Room{

    constructor(id)
    {
      this.id = id;
      this.clients = new Set;
      this.hasStarted = false;
    }

    joinedBy(client)
    {
      if(client.room){
        throw new Error('Client already in a room');
      }
      this.clients.add(client);
      client.room = this;
    }

    leave(client)
    {
      if(client.room != this){
        throw new Error('Client not in room');
      }
      this.clients.delete(client);
      client.room = null;
    }
  }

module.exports = Room;