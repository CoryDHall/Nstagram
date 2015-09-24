Nstagram.Views.UserProfile = Backbone.CompositeView.extend({
  tagName: 'nstagram-profile',
  template: JST['users/profile'],

  initialize: function (options) {
    this.userSession = options.userSession;
    this.listenTo(this.model, 'sync change', this.render);
    this.listenTo(this.userSession, 'sync', this.render);
    this.listenTo(this.model.photos(), 'sync', this.render);
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
      pageOn: this.page + 1
    })
    this.addSubview('nstagram-thumbs-index', this.thumbIndex);


    return this;
  },

  getMore: function ($load_el) {
    if ($load_el.parent().length === 0 || this.model.photos().any(function (photo) {
      return photo.get("is_on_last_page");
    })) {
      return;
    }
    this.page = parseInt($load_el.remove().attr("data-page"), 10);
    this.model.photos().initialize({ username: this.model.get("username") })
    this.model.photos().fetch({
      data: {
        page: this.page
      },
      remove: false
    });
  }
});
