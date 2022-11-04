TETROMINOS = {
    0: { letter: 'init', shape: [[0]], color: '0, 0, 0' },
    I: {
        letter: 'I',
        shape: [
            [0, 'I', 0, 0],
            [0, 'I', 0, 0],
            [0, 'I', 0, 0],
            [0, 'I', 0, 0]
        ],
        color: '80, 227, 230',
    },
    J: {
        letter: 'J',
        shape: [
            [0, 'J', 0],
            [0, 'J', 0],
            ['J', 'J', 0]
        ],
        color: '36, 95, 223',
    },
    L: {
        letter: 'L',
        shape: [
            [0, 'L', 0],
            [0, 'L', 0],
            [0, 'L', 'L']
        ],
        color: '223, 173, 36',
    },
    O: {
        letter: 'O',
        shape: [
            ['O', 'O'],
            ['O', 'O'],
        ],
        color: '223, 217, 36',
    },
    S: {
        letter: 'S',
        shape: [
            [0, 'S', 'S'],
            ['S', 'S', 0],
            [0, 0, 0]
        ],
        color: '48, 211, 56',
    },
    T: {
        letter: 'T',
        shape: [
            [0, 0, 0],
            ['T', 'T', 'T'],
            [0, 'T', 0]
        ],
        color: '132, 61, 198',
    },
    Z: {
        letter: 'Z',
        shape: [
            ['Z', 'Z', 0],
            [0, 'Z', 'Z'],
            [0, 0, 0]
        ],
        color: '227, 78, 78',
    },
}

randomTetromino = () => {
    const tetrominos = 'IJLOSTZ';
    const randTetromino =
        tetrominos[Math.floor(Math.random() * tetrominos.length)];
    return TETROMINOS[randTetromino];
}

module.exports = { TETROMINOS, randomTetromino };