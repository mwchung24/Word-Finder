const Board = require("./board.js");

class Game {
  constructor() {

    this.board = new Board (
      $("#board")
    );
  }

  start () {
    this.board.setupBoard();
  }

}

module.exports = Game;
