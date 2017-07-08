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
      1000
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
