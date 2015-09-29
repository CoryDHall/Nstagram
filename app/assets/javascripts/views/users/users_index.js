Nstagram.Views.UsersIndex = Backbone.CompositeView.extend({
  tagName: 'users-index',
  template: JST['users/index'],

  initialize: function (options) {
    this.userSession = options.userSession;
    this.page = 1;
    this.listenTo(this.collection, "add", this.addMore);
    this.listenTo(this.collection, "reset", this.render);
  },


  hearAbout: function (e) {
    this.checkScroll(e, this.getMore.bind(this));
  },


  render: function () {
    var content = this.template({
      users: this.collection,
    });
    this.$el.html(content);

    this.collection.each(function (user) {
      this.addSubview(
        'ul',
        new Nstagram.Views.UsersIndexItem({
          model: user,
          userSession: this.userSession
        })
      );
    }.bind(this));
    this.loadMoreView = new Nstagram.Views.LoadMore({
      pageOn: this.page + 1
    });
    this.addSubview('div.load-more', this.loadMoreView);

    return this;
  },

  addMore: function (user) {
    this.addSubview(
      'ul',
      new Nstagram.Views.UsersIndexItem({
        model: user,
        userSession: this.userSession
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
        page: this.page
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
