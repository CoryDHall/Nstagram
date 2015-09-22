Nstagram.Views.PhotosIndexItem = Backbone.CompositeView.extend({
  tagName: 'li',
  template: JST['photos/index_item'],

  initialize: function (options) {
    this.userSession = options.userSession;
    this.profile = options.profile;
    this.listenTo(this.model, 'sync change', this.render);
    this.listenTo(this.user, 'sync change', this.render);
  },

  render: function () {
    var content = this.template({
      photo: this.model,
      profile: this.profile
    });
    this.$el.html(content);

    return this;
  }
});
