Nstagram.Views.UserProfile = Backbone.CompositeView.extend({
  tagName: 'nstagram-profile',
  className: 'clearfix',
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

  events: {
    "click .thumbnail-link": "showThumbs",
    "click .full-size-link": "showFull"
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

    this._index = new Nstagram.Views.PhotosIndex({
      collection: this.model.photos(),
      user: this.model,
      style: 'thumb',
      userSession: this.userSession,
      profile: true,
      pageOn: this.page
    });
    this.addSubview('nstagram-thumbs-index', this._index);

    var tl = Nstagram.timeline;
    tl
    .set(this.$('nstagram-full-size-index'), { className: "+=hiding" })
    .set(this.$('nstagram-full-size-index'), { className: "+=hidden" });

    return this;
  },

  showThumbs: function (e) {
    e.preventDefault();

    if ($(e.currentTarget).parent().hasClass("selected")) {
      return;
    }
    var swapIndex = this._otherIndex, tl = Nstagram.timeline;
    this._otherIndex = this._index;
    tl
    .set(this.$('nstagram-full-size-index'), { className: "+=hiding" })
    .set(this.$('nstagram-thumbs-index'), { className: "-=hidden" })
    .to(this.$('nstagram-full-size-index'), 0.5, { className: "+=hidden" }, "+=0.25")
    .set(this.$('nstagram-thumbs-index'), { className: "-=hiding"});
    this._index = swapIndex;
    this.page = 1;
    this._index.collection.initialize({
      username: this.model.get("username"),
      style: 'thumb'
    });
    this._index.collection.fetch({ reset: true });
    this._index.resetLoadMore(this.page);
    this.$(".profile-nav li").toggleClass("selected");
  },

  showFull: function (e) {
    e.preventDefault();

    if ($(e.currentTarget).parent().hasClass("selected")) {
      return;
    }

    var swapIndex = this._otherIndex, tl = Nstagram.timeline;
    this._otherIndex = this._index;
    tl
      .set(this.$('nstagram-thumbs-index'), { className: "+=hiding" })
      .set(this.$('nstagram-full-size-index'), { className: "-=hidden" })
      .to(this.$('nstagram-thumbs-index'), 0.5, { className: "+=hidden" }, "+=0.25")
      .set(this.$('nstagram-full-size-index'), { className: "-=hiding" });
    this.$(".profile-nav li").toggleClass("selected");
    if (swapIndex) {
      this.page = 1;
    } else {
      this._index = new Nstagram.Views.PhotosIndex({
        collection: this.model.photos(),
        user: this.model,
        style: 'full',
        userSession: this.userSession,
        profile: true,
        pageOn: this.page
      });
      this.addSubview('nstagram-full-size-index', this._index);
    }
      this._index.collection.initialize({
        username: this.model.get("username"),
        style: 'full'
      });
      this._index.resetLoadMore(this.page);
      this._index.collection.fetch({ reset: true });
  },

  getMore: function ($load_el) {
    this.model.photos().initialize({
      username: this.model.get("username"),
      style: this._index.style
    });
    this._index.getMore($load_el);

  }
});
