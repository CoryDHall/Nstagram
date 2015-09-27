Nstagram.Views.LoadMore = Backbone.View.extend({
  tagName: "load-more",
  attributes: {
    "data-page": function () {
      return this.pageOn || 2;
    }
  },
  initialize: function (options) {
    this.pageOn = options.pageOn;
  },
  render: function () {
    return this;
  }
});
