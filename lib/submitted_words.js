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
}

module.exports = submittedWords;
