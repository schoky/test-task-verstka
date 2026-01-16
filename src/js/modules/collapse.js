class CollapseCard {
  constructor() {
    this.events();
  }

  events() {
    $(document).on("click", "[data-collapse-toggle]", (e) => {
      this.toggle(e);
    });
  }

  toggle(e) {
    let parent = $(e.currentTarget).parent(".collapse-block");

    if ($(e.currentTarget).is(".show")) {
      $(e.currentTarget).next().removeClass("show");
      $(e.currentTarget).removeClass("show");
      parent.removeClass("show");
    } else {
      $(e.currentTarget).next().addClass("show");
      $(e.currentTarget).addClass("show");
      parent.addClass("show");
    }
  }
}

new CollapseCard();
