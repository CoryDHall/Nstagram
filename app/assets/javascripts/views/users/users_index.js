Nstagram.Views.UsersIndex = Backbone.CompositeView.extend({
  tagName: 'users-index',
  template: JST['users/index'],

  initialize: function (options) {
    this.currentUser = options.currentUser;
    this.listenTo(this.collection, "reset", this.render);
  },

  events: {
    'click button.logout': 'logout'
  },

  render: function () {
    var content = this.template({
      users: this.collection
    });
    this.$el.html(content);

    return this;
  },

  logout: function (e) {
    this.currentUser.destroy();
    this.currentUser.clear();
    Backbone.history.navigate('', {
      trigger: true
    });
  }

});
