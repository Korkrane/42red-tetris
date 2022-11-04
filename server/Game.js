
const tetrominos = require('./tetrominos');

class Game{

    constructor(name, tetrominoSeed)
    {
        this.keyCode = null;
        this.playerName = name;
        this.stage = this.createStage();
        this.gameOver = false;
        this.score = 0;
        this.rows = 0;
        this.level = 0;
        this.player = this.initPlayer();
        this.tetrominoSeed = tetrominoSeed;
    }

    updatePlayer(player)
    {
        this.player = player;
    }

    initPlayer() {
        return { tetromino: tetrominos.TETROMINOS[0].shape, collided: false, pos: this.initPosition() };
    }

    initPosition() {
        return { x: 0, y: 0 };
    }

    createStage()
    {
        return Array.from(Array(20), () => new Array(12).fill([0, 'clear']),);
    }

    updateKey(key)
    {
        this.keyCode = key;
    }
  }

module.exports = Game;