Nstagram.Views.PhotosIndexItem = Backbone.CompositeView.extend({
  tagName: 'li',
  template: JST['photos/index_item'],

  initialize: function (options) {
    this.userSession = options.userSession;
    this.user = options.user;
    this.listenTo(this.model, 'sync change', this.render);
  },

  render: function () {
    var content = this.template({
      photo: this.model,
      user: this.user
    });
    this.$el.html(content);

    return this;
  }
});
