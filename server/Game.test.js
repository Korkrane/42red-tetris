const Game = require("./Game");
const Room = require("./Room");
const tetrominos = require('./tetrominos');


describe("Game class", () => {
    let tetrominoSeed, game;

    beforeAll(() => {
        tetrominoSeed = Array.from({ length: 50 }, () => tetrominos.randomTetromino());
        game = new Game('a', tetrominoSeed);
    });

    it('should have win equals to true', () => {
        game.setWin();
        expect(game.win).toBe(true);
    });

    it('should have gameover equals to true', () => {
        game.lose();
        expect(game.gameOver).toBe(true);
    });

    it('should have keyCode equals to 38', () => {
        game.updateKey(38);
        expect(game.keyCode).toBe(38);
    });

    it('should have position equals to {x:4, y:0}', () => {
        game.initPosition();
        const pos = {x:4, y:0}
        expect(game.player.pos).toEqual(pos);
    });

    it('should have reset player position', () => {
        game.resetPlayer();
        const pos = { x: 4, y: 0 }
        expect(game.player.pos).toEqual(pos);
    });

    it('should have reset class', () => {
        game.reset();
        const pos = { x: 4, y: 0 }
        expect(game.player.pos).toEqual(pos);
    });

    it('drop 1', () => {
        game.drop();
        const pos = { x: 4, y: 1 }
        expect(game.player.pos).toEqual(pos);
    });

    it('sweepRows', () => {
        game.sweepRows(game.stage);
        expect(game.rows).toEqual(0);
    });

    it('move left', () => {
        game.move(37);
        expect(game.rows).toEqual(0);
    });

    it('move rotation', () => {
        game.move(38);
        expect(game.rows).toEqual(0);
    });
});
