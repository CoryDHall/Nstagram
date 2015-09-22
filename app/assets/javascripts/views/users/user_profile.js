Nstagram.Views.UserProfile = Backbone.CompositeView.extend({
  tagName: 'nstagram-profile',
  template: JST['users/profile'],

  initialize: function (options) {
    this.userSession = options.userSession;
    this.listenTo(this.model, 'sync change', this.render);
    this.listenTo(this.userSession, 'sync', this.render);
  },

  render: function () {
    this.$el.html(this.template({
      user: this.model,
      userSession: this.userSession
    }));

    this.addSubview('nstagram-follow-button', new Nstagram.Views.FollowButton({
      model: this.model,
      userSession: this.userSession
    }));

    this.addSubview('nstagram-thumbs-index', new Nstagram.Views.PhotosIndex({
      collection: this.model.photos(),
      user: this.model,
      style: 'thumb',
      userSession: this.userSession,
      profile: true
    }));
    return this;
  }
});
