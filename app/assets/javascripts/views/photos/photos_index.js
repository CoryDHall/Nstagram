Nstagram.Views.PhotosIndex = Backbone.CompositeView.extend({
  tagName: 'photos-index',
  template: JST['photos/index'],

  initialize: function (options) {
    this.userSession = options.userSession;
    this.listenTo(this.collection, "add", this.addMore);
    this.listenTo(this.collection, "reset", this.render);
    this.style = options.style;
    this.profile = options.profile;
    this.page = options.pageOn || 1;
  },

  hearAbout: function (e) {
    this.checkScroll(e, this.getMore.bind(this));
  },

  render: function () {
    var content = this.template();
    this.$el.html(content);

    this.collection.each(function (photo) {
      this.addSubview(
        'ul.photos',
        new Nstagram.Views.PhotosIndexItem({
          model: photo,
          userSession: this.userSession,
          profile: this.profile
        })
      );
    }.bind(this));
    this.loadMoreView = new Nstagram.Views.LoadMore({
      pageOn: this.page + 1
    });
    this.addSubview('div.load-more', this.loadMoreView);
    return this;
  },

  addMore: function (photo) {
    this.addSubview(
      'ul.photos',
      new Nstagram.Views.PhotosIndexItem({
        model: photo,
        userSession: this.userSession,
        profile: this.profile
      })
    );
  },


  getMore: function ($load_el) {
    if ($load_el.parent().length === 0 || this.collection.any(function (user) {
      return user.get("is_on_last_page");
    })) {
      return;
    }
    this.page++;
    this.collection.fetch({
      data: {
        page: this.page,
        style: this.style
      },
      remove: false,
      success: function () {
        this.loadMoreView.initialize({
          pageOn: this.page + 1
        });
        this.loadMoreView.render();
      }.bind(this)
    });
  }

});
