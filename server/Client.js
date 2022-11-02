

class Client{
    constructor(socket, name)
    {
      this.socket = socket;
      this.room = null;
      this.name = name;
      this.readyToPlay = false;
    }
  }

module.exports = Client;