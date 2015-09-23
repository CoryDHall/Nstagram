Nstagram.Views.PhotosIndexItem = Backbone.CompositeView.extend({
  tagName: 'li',
  template: JST['photos/index_item'],

  initialize: function (options) {
    this.userSession = options.userSession;
    this.profile = options.profile;
    this.listenTo(this.model, 'sync change set', this.render);
  },

  render: function () {
    this.model.user = this.model.user || new Nstagram.Models.User({username: "you", profile_picture_url: ""});
    var content = this.template({
      photo: this.model,
      profile: this.profile
    });
    this.$el.html(content);

    return this;
  }
});
