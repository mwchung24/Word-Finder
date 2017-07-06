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
