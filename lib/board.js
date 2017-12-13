const GenerateLetter = require("./letters.js");
const submitBar = require("./submit_bar.js");
const submittedWords = require("./submitted_words.js");
const Score = require("./score.js");
const Trie = require("./trie.js");

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
    this.handleMute = this.handleMute.bind(this);
    this.wordScore = this.wordScore.bind(this);
    this.tileSound = new Audio("./assets/sounds/tiles.wav");
    this.tileSound.volume = 0;
    this.successSound = new Audio("./assets/sounds/success.wav");
    this.successSound.volume = 0;
    this.failSound = new Audio("./assets/sounds/failed.wav");
    this.failSound.volume = 0;
    this.gameOverText = this.gameOverText.bind(this);
    this.submitScore = this.submitScore.bind(this);
    this.fetchScores = this.fetchScores.bind(this);

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
    $("#board svg").remove();

    this.gameOverText();
    this.submitScore();
    this.fetchScores();

  }

  gameOverText() {
    //adds game over text where the board was removed from
    let $div = $('<div class="gameOverText">');
    if (this.score > 100) {
      $div.text(`You're a super star! You found ${this.wordCount()} words and scored ${this.score} points!`).appendTo($("#board"));
    } else if (this.score > 50) {
      $div.text(`Great Job! You found ${this.wordCount()} words and scored ${this.score} points!`).appendTo($("#board"));
    } else {
      $div.text(`You can do better! You found ${this.wordCount()} words and scored ${this.score} points!`).appendTo($("#board"));
    }
  }

  submitScore() {
    //submits the username and score to the firebase database
    let newScore = firebase.database().ref("scores").push();
    window.newScore = newScore;
    let username = $(".highscores input").val();
    if (username) {
      newScore.set({username: `${username}`, score: parseInt(this.score)});
    } else {
      newScore.set({username: `User1`, score: parseInt(this.score)});
    }
  }

  fetchScores() {
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

  wordScore(word) {
    let score = 0;
    let wordArray = word.split("");
    for (let i = 0; i < wordArray.length; i++) {
      score += this.GenerateLetter.lettersValue(wordArray[i]);
    }
    return score;
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
        let score = this.wordScore($("#submitBar input").val());
        $li.append(" - " + score + " points");
        $("#submittedWords ul")
        .prepend($li);
        this.submitted_words.push($("#submitBar input").val());
        this.keepScore($("#submitBar input").val());
        this.successSound.play();
      } else {
        this.failSound.play();
      }
    } else {
      this.failSound.play();
    }

    $("#submitBar input")
      .val("");

    //removes the highlighting from the tiles
    $("#board ul li").removeClass("active");
    //removes lines between tiles
    $(".svgLine").addClass('invisible');
  }

  //mouse event that creates a "word" to compare against the dictionary
  //submitbar is filled in as the user drags across adjacent tiles
  MouseDown (e) {
    e.preventDefault();
    let tile = $(e.currentTarget);
    tile = tile.data().pos;
    this.selectedTiles.push(tile);
    this.tileSound.play();
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
          this.tileSound.pause();
          this.tileSound.play();
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

  handleMute() {
    if(this.tileSound.volume) {
      $(".timerAndScore i").addClass('muted');
      this.tileSound.volume = 0;
      this.successSound.volume = 0;
      this.failSound.volume = 0;
    } else {
      this.tileSound.volume = 0.4;
      this.successSound.volume = 0.1;
      this.failSound.volume = 0.1;
      $(".timerAndScore i").removeClass('muted');
    }
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

    $(".timerAndScore i").remove();

    let $i = $('<i class="fa fa-music mute muted" aria-hidden="true"></i>');
    // $span.text('<i class="fa fa-music mute" aria-hidden="true"></i>');
    $(".timerAndScore").append($i);

    $(".timerAndScore i").on("click", this.handleMute);

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
