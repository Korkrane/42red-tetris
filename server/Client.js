

class Client{
    constructor(socket, name)
    {
      this.socket = socket;
      this.room = null;
      this.name = name;
      this.readyToPlay = false;
      this.admin = false;
    }

    setName(name) {
      this.name = name;
    }

    setAdmin() {
      this.admin = true;
    }

    unsetAdmin() {
      this.admin = true;
    }

    resetReady() {
      this.readyToPlay = !this.readyToPlay;
    }

    clearStatus()
    {
      this.readyToPlay = false;
      this.admin = false;
    }
  }

module.exports = Client;