Nstagram.Views.UsersIndexItem = Backbone.CompositeView.extend({
  tagName: 'li',
  template: JST['users/index_item'],

  initialize: function (options) {
    this.userSession = options.userSession;
    this.listenTo(this.model, 'sync change', this.render);
  },

  render: function () {
    var content = this.template({
      user: this.model
    });
    this.$el.html(content);
    this.followButton = new Nstagram.Views.FollowButton({
      model: this.model,
      userSession: this.userSession
    });
    this.addSubview(
      'nstagram-follow-button',
      this.followButton
    );

    return this;
  }
});
