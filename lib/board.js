class Board {
  constructor (
    $el
  )
  {

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
        $li.data("pos", [row, col]);
        $ul.append($li);
      }
    }

    this.$el.append($ul);
  }
}

module.exports = Board;
