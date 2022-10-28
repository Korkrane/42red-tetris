class Client{

    constructor(socket, name)
    {
      this.socket = socket;
      this.lobby = null;
      this.name = name;
      this.readyToPlay = false;
      // this.stage = null;
      // this.player = null;
    }

    // createStage()
    // {
    //   this.stage = Array.from(Array(20), () =>
    //     new Array(12).fill([0, 'clear']),);
    // }

    // rotate(matrix, dir) {
    //   // Make the rows to become cols (transpose)
    //   const rotatedTetro = matrix.map((_, index) =>
    //     matrix.map(col => col[index]),
    //   );
    //   // Reverse each row to get a rotated matrix
    //   if (dir > 0) return rotatedTetro.map(row => row.reverse());
    //   return rotatedTetro.reverse();
    // }

    // playerRotate(dir) {
    //   const clonedPlayer = JSON.parse(JSON.stringify(this.player));
    //   clonedPlayer.tetromino = this.rotate(clonedPlayer.tetromino, dir);

    //   const pos = clonedPlayer.pos.x;
    //   let offset = 1;
    //   while (this.checkCollision(clonedPlayer, this.stage, { x: 0, y: 0 })) {
    //     clonedPlayer.pos.x += offset;
    //     offset = -(offset + (offset > 0 ? 1 : -1));
    //     if (offset > clonedPlayer.tetromino[0].length) {
    //       this.rotate(clonedPlayer.tetromino, -dir);
    //       clonedPlayer.pos.x = pos;
    //       return;
    //     }
    //   }
    //   this.player = clonedPlayer;
    //   // setPlayer(clonedPlayer);
    // }


    // drop() {
    //   // Increase level when player has cleared 10 rows
    //   // if (rows > (level + 1) * 10) {
    //   //   setLevel(prev => prev + 1);
    //   //   // Also increase speed
    //   //   setDropTime(1000 / (level + 1) + 200);
    //   // }

    //   if (!this.checkCollision(this.player, this.stage, { x: 0, y: 1 })) {
    //     // this.updatePlayerPos({ x: 0, y: 1, collided: false });
    //     console.log('gonna drop');
    //     this.updatePlayerPos(0, 1, false);
    //   } else {
    //     // Game over!
    //     if (this.player.pos.y < 1) {
    //       console.log('GAME OVER!!!');
    //       // setGameOver(true);
    //       // setDropTime(null);
    //     }
    //     // this.updatePlayerPos({ x: 0, y: 0, collided: true });
    //     this.updatePlayerPos(0, 0, true);
    //   }
    // }

    // dropPlayer() {
    //   // We don't need to run the interval when we use the arrow down to
    //   // move the tetromino downwards. So deactivate it for now.
    //   // setDropTime(null);
    //   this.drop();
    // }


    // move(data) {
    //   this.player = data.player;

    //   if (data.keyCode === 37) {
    //     // movePlayer(-1);
    //     console.log('keycode = 37');

    //     if (!this.checkCollision(data.player, data.stage, { x: -1, y: 0 })) {
    //       this.updatePlayerPos(-1, 0);
    //     }
    //   } else if (data.keyCode === 39) {
    //     console.log('keycode = 37');

    //     if (!this.checkCollision(data.player, data.stage, { x: 1, y: 0 })) {
    //       this.updatePlayerPos(1, 0);
    //     }
    //     } else if (data.keyCode === 40) {
    //       console.log('keycode = 40');
    //         this.dropPlayer();
    //     } else if (data.keyCode === 38) {

    //       console.log('keycode = 38');
    //       this.playerRotate(1);
    //       console.log(this.player)
    //     }
    //   }

    // updatePlayerPos(x, y, collided) {
    //   console.log('should update player pos', x, y);
    //   console.log(this.player);
    //   this.player.pos.x += x;
    //   this.player.pos.y += y;
    //   this.player.collided = collided;
    //   console.log(this.player);
    //   // setPlayer(prev => ({
    //   //   ...prev,
    //   //   pos: { x: (prev.pos.x += x), y: (prev.pos.y += y) },
    //   //   collided,
    //   // }));
    // }

    // checkCollision(player, stage, { x: moveX, y: moveY }) {
    //   for (let y = 0; y < player.tetromino.length; y += 1) {
    //     for (let x = 0; x < player.tetromino[y].length; x += 1) {
    //       // 1. Check that we're on an actual Tetromino cell
    //       if (player.tetromino[y][x] !== 0) {
    //         if (
    //           // 2. Check that our move is inside the game areas height (y)
    //           // We shouldn't go through the bottom of the play area
    //           !stage[y + player.pos.y + moveY] ||
    //           // 3. Check that our move is inside the game areas width (x)
    //           !stage[y + player.pos.y + moveY][x + player.pos.x + moveX] ||
    //           // 4. Check that the cell wer'e moving to isn't set to clear
    //           stage[y + player.pos.y + moveY][x + player.pos.x + moveX][1] !==
    //           'clear'
    //         ) {
    //           return true;
    //         }
    //       }
    //     }
    //   }
    // }

  }

module.exports = Client;