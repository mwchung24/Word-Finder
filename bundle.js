/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports, __webpack_require__) {

const Game = __webpack_require__(1);

// document.addEventListener("DOMContentLoaded", () => {
//   const game = new Game();
// });

$( () => {
  const game = new Game();
});


/***/ }),
/* 1 */
/***/ (function(module, exports, __webpack_require__) {

const Board = __webpack_require__(2);

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


/***/ }),
/* 2 */
/***/ (function(module, exports, __webpack_require__) {

const GenerateLetter = __webpack_require__(3);
const submitBar = __webpack_require__(4);
const submittedWords = __webpack_require__(5);
const Score = __webpack_require__(6);
const Trie = __webpack_require__(7);

class Board {
  constructor (
    $el
  )
  {
    jQuery.get('https://raw.githubusercontent.com/mwchung24/Word-Finder/master/assets/dictionary.txt', (text) => this.dictionary(text));

    this.submitBar = new submitBar (
      $("#submitBar")
    );

    this.submittedWords = new submittedWords (
      $("#submittedWords")
    );

    this.Score = new Score (
      $("#score")
    );

    this.selectedTiles = [];
    this.submitted_words = [];
    this.highScore = [];

    this.GenerateLetter = new GenerateLetter();
    this.$el = $el;
    this.selected = false;
    this.MouseDown = this.MouseDown.bind(this);
    this.MouseEnter = this.MouseEnter.bind(this);
    this.MouseUp = this.MouseUp.bind(this);
    this.score = 0;
    this.setup = this.setup.bind(this);
    this.dictionary = this.dictionary.bind(this);
    this.adjacentTiles = this.adjacentTiles.bind(this);
    this.wordCount = this.wordCount.bind(this);
    this.sortNum = this.sortNum.bind(this);
    this.tileLines = this.tileLines.bind(this);

    this.setup();
  }

  //sets up event listeners on the tiles
  setupBoard() {
    this.submitted_words = [];
    $("#board ul li")
      .on("mousedown", this.MouseDown)
      .on("mouseenter", this.MouseEnter);
  }

  //removes event listeners on the tiles
  deactivateBoard() {
    $("#board ul li")
      .off();

    $("body")
      .off();

    //removes tiles from the board
    $("#board ul").remove();

    //adds game over text where the board was removed from
    let $div = $('<div class="gameOverText">');
    if (this.score > 100) {
      $div.text(`You're a super star! You found ${this.wordCount()} words and scored ${this.score} points!`).appendTo($("#board"));
    } else if (this.score > 50) {
      $div.text(`Great Job! You found ${this.wordCount()} words and scored ${this.score} points!`).appendTo($("#board"));
    } else {
      $div.text(`You can do better! You found ${this.wordCount()} words and scored ${this.score} points!`).appendTo($("#board"));
    }

    //submits the username and score to the firebase database
    let newScore = firebase.database().ref("scores").push();
    window.newScore = newScore;
    let username = $(".highscores input").val();
    if (username) {
      newScore.set({username: `${username}`, score: parseInt(this.score)});
    } else {
      newScore.set({username: `User1`, score: parseInt(this.score)});
    }

    //fetches the top 10 highscores and renders them to the screen
    var scoresTable = firebase.database().ref("scores");
    scoresTable.orderByChild("score").limitToLast(10).on('value', (snapshot, highscores) => {
      $(".Instruct ol li").remove();
      highscores = [];
      snapshot.forEach(childSnapshot => {
        highscores.push((childSnapshot.val()));
      });
        highscores.reverse();
      for (let i = 0; i < highscores.length; i++) {
        let $li = $('<li>');
        $(".Instruct ol").append($li.text(`${highscores[i].username}: ${highscores[i].score} points`));
      }
    });
  }

  //sorts the highscores from highest to lowest
  sortNum (a, b) {
    return a - b;
  }

  //creates the username input form
  username($div5) {
    let $input = $('<input placeholder="Enter Username">');
    $(".highscores").append($input);
  }

  //counts the amount of words found
  wordCount () {
    if (this.submitted_words.length <= 0) {
      return 0;
    } else {
      return this.submitted_words.length;
    }
  }

  //clears word from the submitbar
  clearWord() {
    $("body")
    .on("mouseup", this.MouseUp);
  }

  //keeps score
  keepScore(word) {
    let wordArray = word.split("");
    for (let i = 0; i < wordArray.length; i++) {
      this.score += this.GenerateLetter.lettersValue(wordArray[i]);
    }
    $("#score")
      .text(`Score: ${this.score}`);
  }

  //mouse event that compares the words against the dictionary,
  //submits word and score if word is found in the dictionary
  MouseUp (e) {
    e.preventDefault();
    this.selected = false;
    this.selectedTiles = [];
    let $li = $('<li>');
    if(this.trie.validWord($("#submitBar input").val())) {
      if(!this.submitted_words.includes($("#submitBar input").val())) {
        $li.append($("#submitBar input").val());
        $("#submittedWords ul")
        .prepend($li);
        this.submitted_words.push($("#submitBar input").val());
        this.keepScore($("#submitBar input").val());
      }
    }

    $("#submitBar input")
      .val("");

    //removes the highlighting from the tiles
    $("#board ul li").removeClass("active");
    //removes lines between tiles
    $(".svgLine").addClass('invisible');
  }

  //starts to create a "word" to compare against the dictionary
  //submitbar is filled in as the user drags
  MouseDown (e) {
    e.preventDefault();
    let tile = $(e.currentTarget);
    tile = tile.data().pos;
    this.selectedTiles.push(tile);
    this.selected = true;
    $("#submitBar input")
      .val(e.currentTarget.children[1].innerHTML);
  }

  //creates the lines between tiles
  tileLines(currentTile, previousTile) {
    let currentx = currentTile[0];
    let currenty = currentTile[1];
    let previousx = previousTile[0];
    let previousy = previousTile[1];

    $(`.tile${currentx}${currenty}-${previousx}${previousy}`).removeClass('invisible');
  }

  //mouse event when mouse is hovered over a tile
  //programmed to behave the same way as if it was clicked
  MouseEnter(e) {
    e.preventDefault();

    let tile = $(e.currentTarget);

    tile = tile.data().pos;
    if (this.selected === true) {
      if (this.adjacentTiles(tile)) {
        $("#board ul li")
        .on("hover", $(e.currentTarget).addClass('active'));
        if (!this.selectedTiles.includes(tile)) {
          // debugger
          this.tileLines(tile, this.selectedTiles.slice(-1)[0]);
          this.selectedTiles.push(tile);
          $("#submitBar input")
          .val(function(index, val) {
            return val + e.currentTarget.children[1].innerHTML;
          });
        }
      }
    }
  }

  //adjacent tiles check.  Checks to see if the current tile and the next
  //tile are adjacent.  Does not allow for non-adjacent drags
  adjacentTiles (pos) {
    const adjacent = [
      [-1, -1],
      [-1,  0],
      [-1,  1],
      [ 0,  1],
      [ 0, -1],
      [ 1, -1],
      [ 1,  0],
      [ 1,  1]
    ];

    for (let i = 0; i < adjacent.length; i++) {
      let lastTile = this.selectedTiles[this.selectedTiles.length - 1];
      if (JSON.stringify([pos[0] - lastTile[0], pos[1] - lastTile[1]]
        .sort()) === JSON.stringify(adjacent[i])) {
        return true;
      }

    }
    return false;
  }

  //randomizes the board when user starts or restarts the game
  randomizeBoard() {
    this.score = 0;
    $("#score")
      .text(`Score: ${this.score}`);

    this.submittedWords.randomizeBoard();
    this.setup();
  }

  //builds a trie from the dictionary.txt
  dictionary(text) {
    const words = text.split("\n");
    words.pop();
    this.trie = new Trie();
    words.forEach(word => {
      this.trie.buildTrie(word);
    });
  }

  //sets up the board with initial tiles
  setup() {
    $("#board ul").remove();
    $("#board svg").remove();
    $("#submittedWords ul li").remove();
    $("#board div").remove();
    const $ul = $("<ul>");
    for (let row = 0; row < 4; row++) {
      for (let col = 0; col < 4; col++) {
        let $div = $("<div>");
        let $div2 = $("<div>");
        let liLetter = this.GenerateLetter.randomLetter();
        let $li = $('<li>');
        $li.data("pos", [row, col]);
        $div.text(liLetter).appendTo($li);
        $div2.text(this.GenerateLetter.lettersValue(liLetter)).prependTo($li);
        $ul.append($li);
      }
    }

    this.$el.append($ul);

    //lines between tiles are initially hidden and only visible conditionally
    //horizontal
    $("#board").append('<svg class="svgLine invisible tile00-01 tile01-00" width="500" height="500"><line x1="130" y1="42" x2="210" y2="42"/></svg>');
    $("#board").append('<svg class="svgLine invisible tile01-02 tile02-01" width="500" height="500"><line x1="210" y1="42" x2="290" y2="42"/></svg>');
    $("#board").append('<svg class="svgLine invisible tile02-03 tile03-02" width="500" height="500"><line x1="290" y1="42" x2="370" y2="42"/></svg>');

    $("#board").append('<svg class="svgLine invisible tile10-11 tile11-10" width="500" height="500"><line x1="130" y1="122" x2="210" y2="122"/></svg>');
    $("#board").append('<svg class="svgLine invisible tile11-12 tile12-11" width="500" height="500"><line x1="210" y1="122" x2="290" y2="122"/></svg>');
    $("#board").append('<svg class="svgLine invisible tile12-13 tile13-12" width="500" height="500"><line x1="290" y1="122" x2="370" y2="122"/></svg>');

    $("#board").append('<svg class="svgLine invisible tile20-21 tile21-20" width="500" height="500"><line x1="130" y1="202" x2="210" y2="202"/></svg>');
    $("#board").append('<svg class="svgLine invisible tile21-22 tile22-21" width="500" height="500"><line x1="210" y1="202" x2="290" y2="202"/></svg>');
    $("#board").append('<svg class="svgLine invisible tile22-23 tile23-22" width="500" height="500"><line x1="290" y1="202" x2="370" y2="202"/></svg>');

    $("#board").append('<svg class="svgLine invisible tile30-31 tile31-30" width="500" height="500"><line x1="130" y1="282" x2="210" y2="282"/></svg>');
    $("#board").append('<svg class="svgLine invisible tile31-32 tile32-31" width="500" height="500"><line x1="210" y1="282" x2="290" y2="282"/></svg>');
    $("#board").append('<svg class="svgLine invisible tile32-33 tile33-32" width="500" height="500"><line x1="290" y1="282" x2="370" y2="282"/></svg>');
    //vertical
    $("#board").append('<svg class="svgLine invisible tile00-10 tile10-00" width="500" height="500"><line x1="130" y1="42" x2="130" y2="122"/></svg>');
    $("#board").append('<svg class="svgLine invisible tile01-11 tile11-01" width="500" height="500"><line x1="210" y1="42" x2="210" y2="122"/></svg>');
    $("#board").append('<svg class="svgLine invisible tile02-12 tile12-02" width="500" height="500"><line x1="290" y1="42" x2="290" y2="122"/></svg>');
    $("#board").append('<svg class="svgLine invisible tile03-13 tile13-03" width="500" height="500"><line x1="370" y1="42" x2="370" y2="122"/></svg>');

    $("#board").append('<svg class="svgLine invisible tile10-20 tile20-10" width="500" height="500"><line x1="130" y1="122" x2="130" y2="202"/></svg>');
    $("#board").append('<svg class="svgLine invisible tile11-21 tile21-11" width="500" height="500"><line x1="210" y1="122" x2="210" y2="202"/></svg>');
    $("#board").append('<svg class="svgLine invisible tile12-22 tile22-12" width="500" height="500"><line x1="290" y1="122" x2="290" y2="202"/></svg>');
    $("#board").append('<svg class="svgLine invisible tile13-23 tile23-13" width="500" height="500"><line x1="370" y1="122" x2="370" y2="202"/></svg>');

    $("#board").append('<svg class="svgLine invisible tile20-30 tile30-20" width="500" height="500"><line x1="130" y1="202" x2="130" y2="282"/></svg>');
    $("#board").append('<svg class="svgLine invisible tile21-31 tile31-21" width="500" height="500"><line x1="210" y1="202" x2="210" y2="282"/></svg>');
    $("#board").append('<svg class="svgLine invisible tile22-32 tile32-22" width="500" height="500"><line x1="290" y1="202" x2="290" y2="282"/></svg>');
    $("#board").append('<svg class="svgLine invisible tile23-33 tile33-23" width="500" height="500"><line x1="370" y1="202" x2="370" y2="282"/></svg>');
    //diagonal
    $("#board").append('<svg class="svgLine invisible tile00-11 tile11-00" width="500" height="500"><line x1="130" y1="42" x2="210" y2="122"/></svg>');
    $("#board").append('<svg class="svgLine invisible tile01-10 tile10-01" width="500" height="500"><line x1="210" y1="42" x2="130" y2="122"/></svg>');
    $("#board").append('<svg class="svgLine invisible tile01-12 tile12-01" width="500" height="500"><line x1="210" y1="42" x2="290" y2="122"/></svg>');
    $("#board").append('<svg class="svgLine invisible tile02-11 tile11-02" width="500" height="500"><line x1="290" y1="42" x2="210" y2="122"/></svg>');
    $("#board").append('<svg class="svgLine invisible tile02-13 tile13-02" width="500" height="500"><line x1="290" y1="42" x2="370" y2="122"/></svg>');
    $("#board").append('<svg class="svgLine invisible tile03-12 tile12-03" width="500" height="500"><line x1="370" y1="42" x2="290" y2="122"/></svg>');

    $("#board").append('<svg class="svgLine invisible tile10-21 tile21-10" width="500" height="500"><line x1="130" y1="122" x2="210" y2="202"/></svg>');
    $("#board").append('<svg class="svgLine invisible tile11-20 tile20-11" width="500" height="500"><line x1="210" y1="122" x2="130" y2="202"/></svg>');
    $("#board").append('<svg class="svgLine invisible tile11-22 tile22-11" width="500" height="500"><line x1="210" y1="122" x2="290" y2="202"/></svg>');
    $("#board").append('<svg class="svgLine invisible tile12-21 tile21-12" width="500" height="500"><line x1="290" y1="122" x2="210" y2="202"/></svg>');
    $("#board").append('<svg class="svgLine invisible tile12-23 tile23-12" width="500" height="500"><line x1="290" y1="122" x2="370" y2="202"/></svg>');
    $("#board").append('<svg class="svgLine invisible tile13-22 tile22-13" width="500" height="500"><line x1="370" y1="122" x2="290" y2="202"/></svg>');

    $("#board").append('<svg class="svgLine invisible tile20-31 tile31-20" width="500" height="500"><line x1="130" y1="202" x2="210" y2="282"/></svg>');
    $("#board").append('<svg class="svgLine invisible tile21-30 tile30-21" width="500" height="500"><line x1="210" y1="202" x2="130" y2="282"/></svg>');
    $("#board").append('<svg class="svgLine invisible tile21-32 tile32-21" width="500" height="500"><line x1="210" y1="202" x2="290" y2="282"/></svg>');
    $("#board").append('<svg class="svgLine invisible tile22-31 tile31-22" width="500" height="500"><line x1="290" y1="202" x2="210" y2="282"/></svg>');
    $("#board").append('<svg class="svgLine invisible tile22-33 tile33-22" width="500" height="500"><line x1="290" y1="202" x2="370" y2="282"/></svg>');
    $("#board").append('<svg class="svgLine invisible tile23-32 tile32-23" width="500" height="500"><line x1="370" y1="202" x2="290" y2="282"/></svg>');


    //renders highscore table from fire base on initial app load
    var scoresTable = firebase.database().ref("scores");
    scoresTable.orderByChild("score").limitToLast(10).on('value', (snapshot, highscores) => {
      $(".Instruct ol li").remove();
      highscores = [];
      snapshot.forEach(childSnapshot => {
        highscores.push((childSnapshot.val()));
      });
        highscores.reverse();
      for (let i = 0; i < highscores.length; i++) {
        let $li = $('<li>');
        $(".Instruct ol").append($li.text(`${highscores[i].username}: ${highscores[i].score} points`));
      }
    });
  }
}

module.exports = Board;


/***/ }),
/* 3 */
/***/ (function(module, exports) {

const LETTERS = {
  "A": {
    frequency: 9,
    value: 1,
  },

  "B": {
    frequency: 2,
    value: 4,
  },

  "C": {
    frequency: 2,
    value: 4,
  },

  "D": {
    frequency: 5,
    value: 2,
  },

  "E": {
    frequency: 13,
    value: 1,
  },

  "F": {
    frequency: 2,
    value: 4,
  },

  "G": {
    frequency: 3,
    value: 3,
  },

  "H": {
    frequency: 4,
    value: 3,
  },

  "I": {
    frequency: 8,
    value: 1,
  },

  "J": {
    frequency: 1,
    value: 10,
  },

  "K": {
    frequency: 1,
    value: 5,
  },

  "L": {
    frequency: 4,
    value: 2,
  },

  "M": {
    frequency: 2,
    value: 4,
  },

  "N": {
    frequency: 5,
    value: 2,
  },

  "O": {
    frequency: 8,
    value: 1,
  },

  "P": {
    frequency: 2,
    value: 4,
  },

  "Q": {
    frequency: 1,
    value: 10,
  },

  "R": {
    frequency: 6,
    value: 1,
  },

  "S": {
    frequency: 5,
    value: 1,
  },

  "T": {
    frequency: 7,
    value: 1,
  },

  "U": {
    frequency: 4,
    value: 2,
  },

  "V": {
    frequency: 2,
    value: 5,
  },

  "W": {
    frequency: 2,
    value: 4,
  },

  "X": {
    frequency: 1,
    value: 8,
  },

  "Y": {
    frequency: 2,
    value: 3,
  },

  "Z": {
    frequency: 1,
    value: 10,
  },
};

class GenerateLetter {
  constructor () {
    this.letters = [];

    this.lettersFrequency();
  }

  lettersFrequency () {
    Object.keys(LETTERS).forEach(letter => {
      for (var i = 0; i < LETTERS[letter].frequency; i++) {
        this.letters.push(letter);
      }
    });
  }

  lettersValue (letter) {
    return LETTERS[letter].value;
  }

  randomLetter () {
    return this.letters[Math.floor(Math.random() * this.letters.length)];
  }
}

module.exports = GenerateLetter;


/***/ }),
/* 4 */
/***/ (function(module, exports) {

class submitBar {
  constructor(
    $el
  )
  {

    this.$el = $el;
    this.setup();
  }

  submitBar() {
    $("#submitBar input");
  }

  setup() {
    const $input = $("<input disabled>");

    this.$el.append($input);
  }
}

module.exports = submitBar;


/***/ }),
/* 5 */
/***/ (function(module, exports) {

class submittedWords {
  constructor(
    $el
  )
  {

  this.$el = $el;
  this.setup();
  }

  submittedWords() {
    $("#submittedWords ul");
  }

  setup() {
    const $ul = $("<ul>");

    this.$el.append($ul);
  }

  randomizeBoard() {
    $("#submittedWords ul li").remove();
  }
}

module.exports = submittedWords;


/***/ }),
/* 6 */
/***/ (function(module, exports) {

class Score {
  constructor(
    $el
  )
  {

  this.$el = $el;
  this.setup();
  }

  score() {
    $("#score");
  }

  setup() {

  }
}

module.exports = Score;


/***/ }),
/* 7 */
/***/ (function(module, exports) {

class Trie {
  constructor () {
    this.root = new TrieNode("");
  }

  buildTrie (word) {
    let currentNode = this.root;
    for (let i = 0; i < word.length; i++) {
      if (currentNode.children[word[i]]) {
        currentNode = currentNode.children[word[i]];
      } else {
        let newNode = new TrieNode(word[i]);
        currentNode.addChild(newNode);
        currentNode = newNode;
      }
    }
    currentNode.isWord = true;
  }

  validWord(word) {
    let currentNode = this.root;
    for (let i = 0; i < word.length; i++) {
      if(currentNode.children[word[i]]) {
        currentNode = currentNode.children[word[i]];
      } else {
        return false;
      }
    }

    return currentNode.isWord;
  }
}

class TrieNode {
  constructor (letter) {
    this.letter = letter;
    this.children = {};
    this.isWord = false;
  }

  addChild(newNode) {
    this.children[newNode.letter] = newNode;
  }
}

module.exports = Trie;


/***/ })
/******/ ]);
//# sourceMappingURL=bundle.js.map