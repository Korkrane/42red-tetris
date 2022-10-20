

class Client{
    constructor(socket, name)
    {
      this.socket = socket;
      this.lobby = null;
      this.name = name;
      this.readyToPlay = false;
    }

    // joinLobby(data)
    // {
    //     this.socket.emit('lobbyJoined', data);
    // }

    // sendCheck(data)
    // {
    //     const msg = JSON.stringify(data)

    //     console.log(`Sending check: ${msg}`);
    //     // this.socket.send(msg, function ack(err) {
    //     //     if(err){
    //     //         console.log(`Message failed`, msg, err)
    //     //     }
    //     // })
    //     // or
    //     // this.socket.emit('message', msg);
    //     this.socket.emit('lobbyChecked', msg);
    // }


  }

module.exports = Client;