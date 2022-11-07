
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
        this.tetrominoSeed = tetrominoSeed;
        this.tetromino = this.tetrominoSeed[0];
        this.i = 0;
        this.player = this.initPlayer();
        this.miniStage = this.lol()
        this.nextTetromino = null;
    }

    lol() {
        return Array.from(Array(4), () => new Array(4).fill([0, 'clear']),);
    }

    setMiniStage(nextTetromino) {
        this.nextTetromino = nextTetromino;
        let clonedPlayer = { tetromino: this.nextTetromino.shape, pos: { x: 0, y: 0 }, collided:false }
        console.log('real', this.player)
        console.log('clone', clonedPlayer)

        const newStage = this.miniStage.map(row =>
            row.map(cell => (cell[1] === 'clear' ? [0, 'clear'] : cell)),
        );
        // Then draw the tetromino
        clonedPlayer.tetromino.forEach((row, y) => {
            row.forEach((value, x) => {
                if (value !== 0) {
                    newStage[y + clonedPlayer.pos.y][x + clonedPlayer.pos.x] = [
                        value,
                        `${clonedPlayer.collided ? 'merged' : 'clear'}`,
                    ];
                }
            });
        });
        this.miniStage = newStage;
    }

    resetPlayer()
    {
        //tetromino selection
        this.i += 1;
        if(this.i >= this.tetrominoSeed.length)
        {
            this.i = 0;
            this.tetromino = this.tetrominoSeed[0];
        }
        else
            this.tetromino = this.tetrominoSeed[this.i];

        //set new player info
        this.player.tetromino = this.tetromino.shape;
        this.player.pos = { x: 12 / 2 - 2, y: 0 };
        this.player.collided = false;


    }

    setStage()
    {
        const newStage = this.stage.map(row =>
            row.map(cell => (cell[1] === 'clear' ? [0, 'clear'] : cell)),
        );
        // Then draw the tetromino
        this.player.tetromino.forEach((row, y) => {
            row.forEach((value, x) => {
                if (value !== 0) {
                    newStage[y + this.player.pos.y][x + this.player.pos.x] = [
                        value,
                        `${this.player.collided ? 'merged' : 'clear'}`,
                    ];
                }
            });
        });
        // Then check if we collided
        if (this.player.collided) {
            console.log('gonna reset setStage')
            // resetPlayer();
            // setStage(sweepRows(newStage));
        }
        this.stage = newStage;
    }

    checkCollision(player, stage, { x: moveX, y: moveY }){
        for (let y = 0; y < player.tetromino.length; y += 1) {
            for (let x = 0; x < player.tetromino[y].length; x += 1) {
                // 1. Check that we're on an actual Tetromino cell
                if (player.tetromino[y][x] !== 0) {
                    if (
                        // 2. Check that our move is inside the game areas height (y)
                        // We shouldn't go through the bottom of the play area
                        !stage[y + player.pos.y + moveY] ||
                        // 3. Check that our move is inside the game areas width (x)
                        !stage[y + player.pos.y + moveY][x + player.pos.x + moveX] ||
                        // 4. Check that the cell wer'e moving to isn't set to clear
                        stage[y + player.pos.y + moveY][x + player.pos.x + moveX][1] !==
                        'clear'
                    ) {
                        return true;
                    }
                }
            }
        }
    }

    updatePlayerPos({x, y, collided}) {
        console.log('update player pos')
        this.player.collided = collided;
        this.player.pos.x += x;
        this.player.pos.y += y;
        this.updateStage();
    }

    drop()
    {
        // // Increase level when player has cleared 10 rows
        // if (rows > (level + 1) * 10) {
        //     setLevel(prev => prev + 1);
        //     // Also increase speed
        //     setDropTime(1000 / (level + 1) + 200);
        // }

        if (!this.checkCollision(this.player, this.stage, { x: 0, y: 1 })) {
            this.updatePlayerPos({ x: 0, y: 1, collided: false });
        } else {
            // Game over!
            if (this.player.pos.y < 1) {
                console.log('GAME OVER!!!');
                this.gameOver = true;
                // setDropTime(null);
            }
            this.updatePlayerPos({ x: 0, y: 0, collided: true });
        }
    }

    sweepRows(newStage)
    {
            newStage.reduce((ack, row) => {
                if (row.findIndex(cell => cell[0] === 0) === -1) {
                    setRowsCleared(prev => prev + 1);
                    ack.unshift(new Array(newStage[0].length).fill([0, 'clear']));
                    return ack;
                }
                ack.push(row);
                return ack;
            })
    }

    updateStage()
    {
        // this.stage = stage;

        // const sweepRows = newStage =>
        //     newStage.reduce((ack, row) => {
        //         if (row.findIndex(cell => cell[0] === 0) === -1) {
        //             setRowsCleared(prev => prev + 1);
        //             ack.unshift(new Array(newStage[0].length).fill([0, 'clear']));
        //             return ack;
        //         }
        //         ack.push(row);
        //         return ack;
        //     }, [])

        this.setMiniStage(this.tetrominoSeed[this.i + 1])
        // First flush the stage
        const newStage = this.stage.map(row =>
            row.map(cell => (cell[1] === 'clear' ? [0, 'clear'] : cell)),
        );
        // Then draw the tetromino
        this.player.tetromino.forEach((row, y) => {
            row.forEach((value, x) => {
                if (value !== 0) {
                    newStage[y + this.player.pos.y][x + this.player.pos.x] = [
                        value,
                        `${this.player.collided ? 'merged' : 'clear'}`,
                    ];
                }
            });
        });
        // Then check if we collided
        if (this.player.collided) {
            console.log(this.playerName + 'has collided, reset player and sweep rows')
            this.resetPlayer();
            // this.stage = this.sweepRows(newStage);
            // setStage(sweepRows(newStage));
        }
        this.stage = newStage;
        console.log(this.player);
    }

    initPlayer() {
        return { tetromino: this.tetromino.shape, collided: false, pos: this.initPosition() };
    }

    initPosition() {
        return { x: 12 / 2 - 2, y: 0 };
    }

    createStage()
    {
        return Array.from(Array(20), () => new Array(12).fill([0, 'clear']),);
    }

    updateKey(key)
    {
        this.keyCode = key;
    }

    movePlayer(dir) {
        if (!this.checkCollision(this.player, this.stage, { x: dir, y: 0 })) {
            this.updatePlayerPos({ x: dir, y: 0 });
        }
    }

    dropPlayer() {
        this.drop();
     }

    rotate(matrix, dir) {
        // Make the rows to become cols (transpose)
        const rotatedTetro = matrix.map((_, index) =>
            matrix.map(col => col[index]),
        );
        // Reverse each row to get a rotated matrix
        if (dir > 0) return rotatedTetro.map(row => row.reverse());
        return rotatedTetro.reverse();
    }

    playerRotate(stage, dir) {
        console.log('this tetro:', this.tetromino)
        const clonedPlayer = this.player;
        clonedPlayer.tetromino = this.rotate(clonedPlayer.tetromino, dir);

        console.log('cloned tetro:', clonedPlayer.tetromino)

        const pos = clonedPlayer.pos.x;
        let offset = 1;
        while (this.checkCollision(clonedPlayer, stage, { x: 0, y: 0 })) {
            clonedPlayer.pos.x += offset;
            offset = -(offset + (offset > 0 ? 1 : -1));
            if (offset > clonedPlayer.tetromino[0].length) {
                this.rotate(clonedPlayer.tetromino, -dir);
                clonedPlayer.pos.x = pos;
                return;
            }
        }
        this.player = clonedPlayer;
        this.updateStage();
     }

    move(keyCode)
    {
        console.log(keyCode)
        this.keyCode = keyCode;
        if (!this.gameOver) {
            if (keyCode === 37) {
                this.movePlayer(-1);
            } else if (keyCode === 39) {
                this.movePlayer(1);
            } else if (keyCode === 40) {
                this.dropPlayer();
            } else if (keyCode === 38) {
                this.playerRotate(this.stage, 1);
            }
        }
    }
  }

module.exports = Game;