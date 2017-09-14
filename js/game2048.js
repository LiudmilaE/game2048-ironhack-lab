console.log("Hello Game2048");

function Game2048 () {
  this.board = [
    [null,null,null,null],
    [null,null,null,null],
    [null,null,null,null],
    [null,null,null,null]
  ];

  this.score = 0;
  this.won   = false;
  this.lost  = false;

  this._generateTile();
  this._generateTile();

}

 //to create tile and add it randomly to the board
Game2048.prototype._generateTile = function () {
  var initialValue = (Math.random() < 0.8) ? 2 : 4;
  //if random is less 0.8 gives 2, if not gives 4
  var emptyTile = this._getAvailablePosition();

  if (emptyTile) {
    this.board[emptyTile.x][emptyTile.y] = initialValue;
  }
};

//to check the board for available positions
Game2048.prototype._getAvailablePosition = function () {
  var emptyTiles = [];

  this.board.forEach(function(row, rowIndex){
    row.forEach(function(elem, colIndex){
      if (!elem) emptyTiles.push({ x: rowIndex, y: colIndex });
    });
  });

  if (emptyTiles.length === 0)
    return false;

  var randomPosition = Math.floor(Math.random() * emptyTiles.length);
  return emptyTiles[randomPosition];
};

//to check out if the tiles are correctly generated and inserted in the board
Game2048.prototype._renderBoard = function () {
  this.board.forEach(function(row){ console.log(row); });
  console.log('Score: ' + this.score);
};

//Moving tiles
//move Left // why return board changed/false/true ??
Game2048.prototype._moveLeft = function () {
  var newBoard = [];
  var that = this;
  var boardChanged = false;

  this.board.forEach (function (row) {//start of forEach for rows in grd/board
    var newRow = row.filter(function (i) {
      return i !== null;
    });

    for(i = 0; i < newRow.length - 1; i++) {
      if (newRow[i+1] === newRow[i]) {
        newRow[i]   = newRow[i] * 2;
        newRow[i+1] = null;

        that._updateScore(newRow[i]);
      }
    }

    var merged = newRow.filter(function (i) {
      return i !== null;
    });

    while(merged.length < 4) {
      merged.push(null);
    }

    if (newRow.length !== row.length)
      boardChanged = true;

    newBoard.push(merged);
  });//*end of forEach

  this.board = newBoard;
  return boardChanged;
};

//move Right
Game2048.prototype._moveRight = function () {
  var newBoard = [];
  var that = this;
  var boardChanged = false;

  this.board.forEach (function (row) {//start of forEach for rows in grd/board
    var newRow = row.filter(function (i) {
      return i !== null;
    });

    for (i=newRow.length - 1; i>0; i--) {
      if (newRow[i-1] === newRow[i]) {
        newRow[i]   = newRow[i] * 2;
        newRow[i-1] = null;
        that._updateScore(newRow[i]);
      }

      if (newRow.length !== row.length) boardChanged = true;
    }

    var merged = newRow.filter(function (i) {
      return i !== null;
    });

    while(merged.length < 4) {
      merged.unshift(null);
    }

    newBoard.push(merged);
  });// end of forEach

  this.board = newBoard;
  return boardChanged;
};


//Move up and down
//to rotate the board game 90 degree and move tiles
Game2048.prototype._transposeMatrix = function () {
  for (var row = 0; row < this.board.length; row++) {
    for (var column = row+1; column < this.board.length; column++) {
      var temp = this.board[row][column];//temporal variable to change the current row by the new one
      this.board[row][column] = this.board[column][row];
      this.board[column][row] = temp;
    }
  }
};

//Move up
Game2048.prototype._moveUp = function () {
  this._transposeMatrix();
  var boardChanged = this._moveLeft();
  this._transposeMatrix();
  return boardChanged;
};

//Move down
Game2048.prototype._moveDown = function () {
  this._transposeMatrix();
  var boardChanged = this._moveRight();
  this._transposeMatrix();
  return boardChanged;
};

//.move method will receive as a parameter the direction of the move
// ?? where boardChange came from???
Game2048.prototype.move = function (direction) {
  //var boardChanged ??
  if (!this._gameFinished()) {
    switch (direction) {
      case "up":    boardChanged = this._moveUp();    break;
      case "down":  boardChanged = this._moveDown();  break;
      case "left":  boardChanged = this._moveLeft();  break;
      case "right": boardChanged = this._moveRight(); break;
    }

    if (boardChanged) {
      this._generateTile();
      this._isGameLost();
    }
  }
};

//score

Game2048.prototype._updateScore = function (value) {
  this.score += value;

  if (value === 2048) {
   this.won = true;
 }

};

Game2048.prototype.win = function () {
  return this.won;
};

Game2048.prototype._isGameLost = function () {
  if (this._getAvailablePosition())
    return;

  var that   = this;
  var isLost = true;

  this.board.forEach(function (row, rowIndex) {
    row.forEach(function (cell, cellIndex) {
      var current = that.board[rowIndex][cellIndex];
      var top, bottom, left, right;

      if (that.board[rowIndex][cellIndex - 1]) {
        left  = that.board[rowIndex][cellIndex - 1];
      }
      if (that.board[rowIndex][cellIndex + 1]) {
        right = that.board[rowIndex][cellIndex + 1];
      }
      if (that.board[rowIndex - 1]) {
        top    = that.board[rowIndex - 1][cellIndex];
      }
      if (that.board[rowIndex + 1]) {
        bottom = that.board[rowIndex + 1][cellIndex];
      }

      if (current === top || current === bottom || current === left || current === right)
        isLost = false;
    });
  });

  this.lost = isLost;
};

Game2048.prototype._gameFinished = function(){//this.lost  = false this.won===false
  if (this.won===false && this.lost === false) {
    return false;
  } else {
    return true;
  }
};
