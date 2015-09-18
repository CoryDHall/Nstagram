Nstagram.Views.UsersIndex = Backbone.CompositeView.extend({
  tagName: 'users-index',
  template: JST['users/index'],

  initialize: function (options) {
    this.userSession = options.userSession;
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
    this.userSession.destroy();
    this.userSession.clear();
    Backbone.history.navigate('', {
      trigger: true
    });
  }

});
