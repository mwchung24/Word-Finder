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
  }

  startButton() {
    const $button = $("<button>");

    $button.text("Start");

    $("#startButton")
    .on("click", this.start);

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


/***/ }),
/* 2 */
/***/ (function(module, exports, __webpack_require__) {

const GenerateLetter = __webpack_require__(3);
const submitBar = __webpack_require__(6);
const submittedWords = __webpack_require__(7);
const Score = __webpack_require__(8);
const Trie = __webpack_require__(9);

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

    this.setup();
  }

  setupBoard() {
    $("#board ul li")
      .on("mousedown", this.MouseDown)
      .on("mouseenter", this.MouseEnter);
  }

  deactivateBoard() {
    $("#board ul li")
      .off();

    $("body")
      .off();
  }

  clearWord() {
    $("body")
    .on("mouseup", this.MouseUp);
  }

  keepScore(word) {
    let wordArray = word.split("");
    for (let i = 0; i < wordArray.length; i++) {
      this.score += this.GenerateLetter.lettersValue(wordArray[i]);
    }
    $("#score")
      .text(`Score: ${this.score}`);
  }



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

    $("#board ul li").removeClass("active");
  }

  MouseDown (e) {
    e.preventDefault();
    let tile = $(e.currentTarget);
    tile = tile.data().pos;
    this.selectedTiles.push(tile);
    this.selected = true;
    $("#submitBar input")
      .val(e.currentTarget.children[1].innerHTML);
  }

  MouseEnter(e) {
    e.preventDefault();

    let tile = $(e.currentTarget);

    tile = tile.data().pos;
    if (this.selected === true) {
      if (this.adjacentTiles(tile)) {
        $("#board ul li")
        .on("hover", $(e.currentTarget).addClass('active'));
        if (!this.selectedTiles.includes(tile)) {
          this.selectedTiles.push(tile);
          $("#submitBar input")
          .val(function(index, val) {
            return val + e.currentTarget.children[1].innerHTML;
          });
        }
      }
    }
  }

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

    // debugger

    for (let i = 0; i < adjacent.length; i++) {
      let lastTile = this.selectedTiles[this.selectedTiles.length - 1];
      if (JSON.stringify([pos[0] - lastTile[0], pos[1] - lastTile[1]].sort()) === JSON.stringify(adjacent[i])) {
        return true;
      }

    }
    return false;

    //  return adjacentDeltas.map(delta => {
    //   return [pos[0] + delta[0], pos[1] + delta[1]];
    // });
  }

  randomizeBoard() {
    $("#board ul li").remove();
    this.score = 0;
    $("#score")
      .text(`Score: ${this.score}`);

    this.submittedWords.randomizeBoard();
    this.setup();
  }

  dictionary(text) {
    const words = text.split("\n");
    this.trie = new Trie();
    words.forEach(word => {
      this.trie.buildTrie(word);
    });
  }

  setup() {
    const $ul = $("<ul>");
    for (let row = 0; row < 4; row++) {
      for (let col = 0; col < 4; col++) {
        let $div = $("<div>");
        let $div2 = $("<div>");
        let liLetter = this.GenerateLetter.randomLetter();
        // let $li = $(`<li onmousedown="console.log('${liLetter}')">`);
        let $li = $('<li>');
        $li.data("pos", [row, col]);
        $div.text(liLetter).appendTo($li);
        $div2.text(this.GenerateLetter.lettersValue(liLetter)).prependTo($li);
        $ul.append($li);
      }
    }

    this.$el.append($ul);
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
/* 4 */,
/* 5 */,
/* 6 */
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
/* 7 */
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
/* 8 */
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
/* 9 */
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