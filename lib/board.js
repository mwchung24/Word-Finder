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

    this.setup();
  }

  setupBoard() {
    this.submitted_words = [];
    $("#board ul li")
      .on("mousedown", this.MouseDown)
      .on("mouseenter", this.MouseEnter);
  }

  deactivateBoard() {
    $("#board ul li")
      .off();

    $("body")
      .off();

    $("#board ul").remove();

    let $div = $('<div class="gameOverText">');
    $div.text(`You're a super star! You found ${this.wordCount()} words and scored ${this.score} points!`).appendTo($("#board"));

    let newScore = firebase.database().ref("scores").push();
    window.newScore = newScore;
    let username = $(".highscores input").val();
    if (username) {
      newScore.set({username: `${username}`, score: parseInt(this.score)});
    } else {
      newScore.set({username: `User1`, score: parseInt(this.score)});
    }

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


    // $(".Instruct ol li").remove();
    //
    // this.highScore.forEach((score) => {
    //   let $li = $('<li>');
    //   $(".Instruct ol").append($li.text(`Player: ${score} points`));
    // });
  }

  sortNum (a, b) {
    return a - b;
  }

  username($div5) {
    let $input = $('<input placeholder="Enter Username">');
    $(".highscores").append($input);
  }

  wordCount () {
    if (this.submitted_words.length <= 0) {
      return 0;
    } else {
      return this.submitted_words.length;
    }
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

    for (let i = 0; i < adjacent.length; i++) {
      let lastTile = this.selectedTiles[this.selectedTiles.length - 1];
      if (JSON.stringify([pos[0] - lastTile[0], pos[1] - lastTile[1]]
        .sort()) === JSON.stringify(adjacent[i])) {
        return true;
      }

    }
    return false;
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
    words.pop();
    this.trie = new Trie();
    words.forEach(word => {
      this.trie.buildTrie(word);
    });
  }

  setup() {
    $("#board ul").remove();
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

    let coordinates = [];

    // $("#board ul li").forEach((tile)=> {
    //   coordinates.push(tile.position());
    //   debugger
    // });

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
