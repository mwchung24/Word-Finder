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
