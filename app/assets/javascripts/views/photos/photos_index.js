Nstagram.Views.PhotosIndex = Backbone.CompositeView.extend({
  tagName: 'photos-index',
  template: JST['photos/index'],

  initialize: function (options) {
    this.userSession = options.userSession;
    this.listenTo(this.collection, "reset set sync", this.render);
    this.profile = options.profile;
    this.pageOn = options.pageOn || 1;
  },

  hearAbout: function (e) {
    this.checkScroll(e, this.getMore.bind(this));
  },

  render: function () {
    var content = this.template({
      photos: this.collection,
      pageOn: this.pageOn + 1
    });
    this.$el.html(content);

    this.collection.each(function (photo) {
      this.addSubview(
        'ul',
        new Nstagram.Views.PhotosIndexItem({
          model: photo,
          userSession: this.userSession,
          profile: this.profile
        })
      );
    }.bind(this));
    return this;
  },


  getMore: function ($load_el) {
    if ($load_el.parent().length === 0 || this.collection.any(function (user) {
      return user.get("is_on_last_page");
    })) {
      return;
    }
    this.page = parseInt($load_el.remove().attr("data-page"), 10);
    this.collection.fetch({
      data: {
        page: this.page
      },
      remove: false
    });
  }




});
