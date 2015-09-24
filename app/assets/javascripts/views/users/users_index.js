Nstagram.Views.UsersIndex = Backbone.CompositeView.extend({
  tagName: 'users-index',
  template: JST['users/index'],

  initialize: function (options) {
    this.userSession = options.userSession;

    this.page = 1;
    this.listenTo(this.collection, "reset set sync", this.render);
  },


  hearAbout: function (e) {
    this.checkScroll(e, this.getMore.bind(this));
  },


  render: function () {
    var content = this.template({
      users: this.collection,
      pageOn: this.page + 1
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
