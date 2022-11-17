

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
      this.admin = false;
    }

    unsetReady() {
      this.readyToPlay = false;
    }

    setReady() {
      this.readyToPlay = true;
    }

    isReady() {
        return(this.readyToPlay === true ? true : false);
    }
  }

module.exports = Client;