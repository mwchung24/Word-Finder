const GenerateLetter = require("./letters.js");
const submitBar = require("./submit_bar.js");
const submittedWords = require("./submitted_words.js");

class Board {
  constructor (
    $el
  )
  {

    this.submitBar = new submitBar (
      $("#submitBar")
    );

    this.submittedWords = new submittedWords (
      $("#submittedWords")
    );

    this.selectedTiles = [];

    this.GenerateLetter = new GenerateLetter();
    this.$el = $el;
    this.selected = false;
    this.MouseDown = this.MouseDown.bind(this);
    this.MouseEnter = this.MouseEnter.bind(this);
    this.MouseUp = this.MouseUp.bind(this);

    this.setup();
  }

  setupBoard() {
    $("#board ul li")
      .on("mousedown", this.MouseDown)
      .on("mouseenter", this.MouseEnter);
  }

  clearWord() {
    $("body")
    .on("mouseup", this.MouseUp);
  }

  MouseUp (e) {
    e.preventDefault();
    this.selected = false;
    this.selectedTiles = [];
    let $li = $('<li>');
    $li.append($("#submitBar input").val());
    $("#submittedWords ul")
      .append($li);

    $("#submitBar input")
      .val("");
  }

  MouseDown (e) {
    e.preventDefault();
    // debugger
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
      // debugger
      if (!this.selectedTiles.includes(tile)) {
        this.selectedTiles.push(tile);
        $("#submitBar input")
        .val(function(index, val) {
          return val + e.currentTarget.children[1].innerHTML;
        });
      }
    }
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
