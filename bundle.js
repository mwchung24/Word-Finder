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

document.addEventListener("DOMContentLoaded", () => {
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
  }

  start () {
    this.board.setupBoard();
  }

}

module.exports = Game;


/***/ }),
/* 2 */
/***/ (function(module, exports, __webpack_require__) {

const GenerateLetter = __webpack_require__(3);

class Board {
  constructor (
    $el
  )
  {

    this.GenerateLetter = new GenerateLetter();
    this.$el = $el;
    this.setup();
  }

  setupBoard() {
    $("#board li");
  }

  setup() {
    const $ul = $("<ul>");

    for (let row = 0; row < 4; row++) {
      for (let col = 0; col < 4; col++) {
        let $li = $("<li>");
        let $div = $("<div>");
        let $div2 = $("<div>");
        let liLetter = this.GenerateLetter.randomLetter();
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


/***/ })
/******/ ]);
//# sourceMappingURL=bundle.js.map