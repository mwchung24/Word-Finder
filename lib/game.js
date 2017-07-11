const Board = require("./board.js");

class Game {
  constructor() {

    this.board = new Board (
      $("#board")
    );

    this.timer = 60;
    this.interval = null;

    this.playInterval = this.playInterval.bind(this);
    this.stopInterval = this.stopInterval.bind(this);
    this.gameOver = this.gameOver.bind(this);
    this.start = this.start.bind(this);
    this.reset = this.reset.bind(this);
    this.timerfunc = this.timerfunc.bind(this);
    this.startButton();
    this.splash();
  }

  splash() {
    $("#board ul").remove();
    let $div = $('<div class="Instructions">');
    $("#board").append($div);
    let $div2 = $('<div class="InstructionsHeader">');
    $("#board div").append($div2.text("Instructions"));
    let $div3 = $('<div class="Instruct">');
    $div.append($div3.text("Use mouse to click and drag across adjacent letters to create words!  You can also drag diagonally."));
    let $div4 = $('<div class="Instruct">');
    $div.append($div4.text("You have 60 seconds to submit as many words as you can!"));
    let $div5 = $('<div class="Instruct">');
    $div.append($div5.text("Good Luck!"));
  }

  startButton() {
    const $button = $("<button>");

    $button.text("Start");

    $("#startButton")
    .on("click", this.reset);

    $("#startButton")
    .append($button);
  }

  resetButton() {
    const $resetButton = $("<button>");

    $resetButton.text("Restart");

    $("#startButton")
    .on("click", this.reset);

    $("#startButton")
    .append($resetButton);
  }

  start () {
    this.board.setupBoard();
    this.board.clearWord();
    $("#startButton button").remove();

    this.playInterval();
    this.resetButton();
  }

  gameOver () {
    this.board.deactivateBoard();
  }

  playInterval() {
    clearInterval(this.interval);
    this.interval = null;
    this.interval = setInterval(
      this.timerfunc,
      10
    );
  }

  stopInterval() {
    clearInterval(this.interval);
    this.interval = null;
  }

  timerfunc () {
    this.timer -= 1;
    if (this.timer <= 0) {
      $("#timer")
      .text(`Timer: 0`);
      this.stopInterval();
      this.gameOver();
    } else {
      $("#timer")
      .text(`Timer: ${this.timer}`);
    }
  }

  reset() {
    this.board.randomizeBoard();
    this.timer = 60;
    $("#timer")
    .text(`Timer: ${this.timer}`);
    this.start();
  }
}

module.exports = Game;
