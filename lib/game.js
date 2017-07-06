const Board = require("./board.js");

class Game {
  constructor() {

    this.board = new Board (
      $("#board")
    );

    this.start();
  }

  start () {
    this.board.setupBoard();
    this.board.clearWord();
  }

}

module.exports = Game;
