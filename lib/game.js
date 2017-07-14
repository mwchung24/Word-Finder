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

  //instructions splash screen before user starts the game
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

    this.board.username($div5);
  }

  //rendering of the start button
  startButton() {
    const $button = $("<button>");

    $button.text("Start");

    $("#startButton")
    .on("click", this.reset);

    $("#startButton")
    .append($button);
  }

  //render of the restart button
  resetButton() {
    $("#startButton button").remove();
    const $resetButton = $("<button>");

    $resetButton.text("Restart");

    $("#startButton")
    .on("click", this.reset);

    $("#startButton")
    .append($resetButton);
  }

  //starts the game when start button is pressed
  start () {
    this.board.setupBoard();
    this.board.clearWord();
    $("#startButton button").remove();

    this.playInterval();
    this.resetButton();
  }

  //game over, when timer hits zero, the board is deactivated
  gameOver () {
    this.board.deactivateBoard();
  }

  //count down for the timer
  playInterval() {
    clearInterval(this.interval);
    this.interval = null;
    this.interval = setInterval(
      this.timerfunc,
      1000
    );
  }

  //clears the setInterval for the timer
  stopInterval() {
    clearInterval(this.interval);
    this.interval = null;
  }

  //timer check to see if timer is at zero
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

  //resets the game when the restart button is clicked
  reset() {
    this.board.randomizeBoard();
    this.timer = 60;
    $("#timer")
    .text(`Timer: ${this.timer}`);
    this.start();
  }
}

module.exports = Game;
