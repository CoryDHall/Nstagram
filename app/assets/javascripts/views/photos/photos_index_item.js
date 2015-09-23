Nstagram.Views.PhotosIndexItem = Backbone.CompositeView.extend({
  tagName: 'li',
  template: JST['photos/index_item'],

  initialize: function (options) {
    this.userSession = options.userSession;
    this.profile = options.profile;
    this.listenTo(this.model, 'sync change set', this.render);
  },

  events: {
    'dblclick': 'likeToggle',
  },

  render: function () {
    var user = this.model.user || new Nstagram.Models.User({
      username: "you",
      profile_picture_url: ""
    });
    var content = this.template({
      photo: this.model,
      user: user,
      profile: this.profile
    });
    this.$el.html(content);

    return this;
  },

  likeToggle: function (e) {
    if (this.model.get("is_current_user_liking")) {
      this.model.unlike({
        success: function (like, xHr, options) {
          this.showHeartBreak();
        }.bind(this)
      });
    } else {
      this.model.like({
        success: function (like, xHr, options) {
          this.showHeart();
        }.bind(this)
      });
    }
  },

  showHeart: function () {
    this.$('nsta-photo').append($('<div>').text("\uD83D\uDC96").addClass("photo-like"));
  },

  showHeartBreak: function () {
    this.$('nsta-photo').append($('<div>').text("\uD83D\uDC94").addClass("photo-like"));
  }

});
