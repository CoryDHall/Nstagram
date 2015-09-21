Nstagram.Views.FollowButton = Backbone.CompositeView.extend({
  template: JST['users/follow_button'],

  initialize: function (options) {
    this.userSession = options.userSession;
    this.listenTo(this.model, 'sync', this.render);
    this.listenTo(this.model._follow, 'save destroy', this.render);
  },

  events: {
    "click": "toggleFollow"
  },

  render: function () {
    this.$el.html(this.template({
      user: this.model
    }));
    return this;
  },

  toggleFollow: function (e) {
    // debugger
    var thisUser = this.model;

    switch (this.$('button').attr("class").split("-")[0]) {
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
