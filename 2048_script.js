
    const size = 4;
    let board = [];
    let score = 0;
    const mergeSound = document.getElementById('mergeSound');

    function init() {
      board = Array(size).fill().map(() => Array(size).fill(0));
      score = 0;
      document.getElementById('score').textContent = score;
      addTile(); addTile();
      draw();
    }

    function addTile() {
      let options = [];
      for (let i = 0; i < size; i++) {
        for (let j = 0; j < size; j++) {
          if (board[i][j] === 0) options.push({ x: i, y: j });
        }
      }
      if (options.length > 0) {
        let spot = options[Math.floor(Math.random() * options.length)];
        board[spot.x][spot.y] = Math.random() > 0.1 ? 2 : 4;
      }
    }

    function draw() {
      const game = document.getElementById('game');
      game.innerHTML = '';
      for (let i = 0; i < size; i++) {
        for (let j = 0; j < size; j++) {
          let val = board[i][j];
          const tile = document.createElement('div');
          tile.className = 'tile tile-' + val + (val !== 0 ? ' new' : '');
          tile.textContent = val === 0 ? '' : val;
          game.appendChild(tile);
        }
      }
      document.getElementById('score').textContent = score;
    }

    function slide(row) {
      row = row.filter(val => val);
      for (let i = 0; i < row.length - 1; i++) {
        if (row[i] === row[i + 1]) {
          row[i] *= 2;
          score += row[i];
          row[i + 1] = 0;
          mergeSound.play();
        }
      }
      row = row.filter(val => val);
      while (row.length < size) row.push(0);
      return row;
    }

    function rotateClockwise(matrix) {
      return matrix[0].map((_, i) => matrix.map(row => row[i]).reverse());
    }

    function rotateCounterClockwise(matrix) {
      return matrix[0].map((_, i) => matrix.map(row => row[size - 1 - i]));
    }

    function keyPressed(e) {
      let before = JSON.stringify(board);

      if (e.key === 'ArrowRight') {
        board = board.map(row => slide(row.reverse()).reverse());
      } else if (e.key === 'ArrowLeft') {
        board = board.map(row => slide(row));
      } else if (e.key === 'ArrowDown') {
        board = rotateClockwise(board);
        board = board.map(row => slide(row));
        board = rotateCounterClockwise(board);
      } else if (e.key === 'ArrowUp') {
        board = rotateClockwise(board);
        board = board.map(row => slide(row.reverse()).reverse());
        board = rotateCounterClockwise(board);
      }

      let after = JSON.stringify(board);
      if (before !== after) {
        addTile();
        draw();
      }
    }

    window.addEventListener('keydown', keyPressed);
    init();
  