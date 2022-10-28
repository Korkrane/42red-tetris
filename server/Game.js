class Game {

    constructor(name) {
        this.pos = null;
        this.tetromino = null;
        this.collided = false;
        this.playerName = name;
        this.stage = this.createStage();
    }

    createStage()
    {
        return Array.from(Array(20), () => new Array(12).fill([0, 'clear']),);
    }

}

module.exports = Game;