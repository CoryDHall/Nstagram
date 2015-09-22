Nstagram.Views.Menu = Backbone.CompositeView.extend({
  template: JST['globals/footer_menu'],

  render: function () {
    var content = this.template();
    this.$el.html(content);

    return this;
  },

  events: {
    "click a": "select"
  },

  select: function (e) {
    this.$('.selected').removeClass("selected");
    $(e.currentTarget).addClass("selected");
  }

});
