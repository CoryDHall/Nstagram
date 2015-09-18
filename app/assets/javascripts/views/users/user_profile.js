Nstagram.Views.UserProfile = Backbone.CompositeView.extend({
  tagName: 'nstagram-profile',
  template: JST['users/profile'],
  events: {
  },

  initialize: function (options) {
    this.userSession = options.userSession;
    this.listenTo(this.model, 'sync', this.render);
  },

  events: {
    "click button": "toggleFollow"
  },

  render: function () {
    this.$el.html(this.template({
      user: this.model
    }));
    return this;
  },

  toggleFollow: function (e) {
    var thisUser = this.model;

    switch ($(e.currentTarget).attr("class").split("-")[0]) {
      case "follow":
        this.userSession.fetch({
          success: function (session) {
            thisUser.follow();
          }
        });
        break;
      case "unfollow":
          thisUser.unfollow();
        break;
    }
  }
});
