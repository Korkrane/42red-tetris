

class Client{
    constructor(socket, name)
    {
      this.socket = socket;
      this.room = null;
      this.name = name;
      this.readyToPlay = false;
    }

    setName(name)
    {
      this.name = name;
    }
  }

module.exports = Client;