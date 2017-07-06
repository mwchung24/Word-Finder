const Board = require("./board.js");
// const submitBar = require("./submit_bar.js");

class Game {
  constructor() {

    this.board = new Board (
      $("#board")
    );
    // this.submitBar = new submitBar (
    //   $("#submitBar")
    // );


    this.start();
  }

  start () {
    this.board.setupBoard();
    this.board.clearWord();
    // this.submitBar.submitBar();
  }

}

module.exports = Game;
