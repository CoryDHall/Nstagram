Nstagram.Views.UserProfile = Backbone.CompositeView.extend({
  tagName: 'nstagram-profile',
  template: JST['users/profile'],

  initialize: function (options) {
    this.userSession = options.userSession;
    this.listenTo(this.model, 'sync change', this.render);
    this.listenTo(this.userSession, 'sync', this.render);
    // this.listenTo(this.model.photos(), 'sync', this.render);
    this.page = 1;
  },

  hearAbout: function (e) {
    this.checkScroll(e, this.getMore.bind(this));
  },


  render: function () {
    this.$el.html(this.template({
      user: this.model,
      userSession: this.userSession,
    }));

    this.addSubview('nstagram-follow-button', new Nstagram.Views.FollowButton({
      model: this.model,
      userSession: this.userSession
    }));

    this.thumbIndex = new Nstagram.Views.PhotosIndex({
      collection: this.model.photos(),
      user: this.model,
      style: 'thumb',
      userSession: this.userSession,
      profile: true,
      pageOn: this.page
    })
    this.addSubview('nstagram-thumbs-index', this.thumbIndex);


    return this;
  },

  getMore: function ($load_el) {
    this.model.photos().initialize({ username: this.model.get("username") })
    this.thumbIndex.getMore($load_el);

  }
});
