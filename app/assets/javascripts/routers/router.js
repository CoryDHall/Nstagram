(function () {

  var Views = Nstagram.Views;
  var Collections = Nstagram.Collections;
  var Models = Nstagram.Models;

  Nstagram.Routers.Router = Backbone.Router.extend({

    initialize: function (options) {
      this.$rootEl = $(options.rootEl);
    },

    routes: {
      '': 'root',
      'welcome': 'welcome',
      'users': 'usersIndex',
      'users/:username': 'userProfile'
    },

    root: function () {
      this.currentUser(function (user) {
        if (user.id !== undefined) {
          Backbone.history.navigate('/users', {
            trigger: true
          });
        } else {
          Backbone.history.navigate('/welcome', {
            trigger: true
          });
        }
      }.bind(this));
    },

    welcome: function () {
      var welcomeView = new Views.Welcome();

      this._swapView(welcomeView);
    },

    usersIndex: function () {
      this.needsLogin();
      var userIndexView = new Views.UsersIndex({
        collection: this.users(),
        currentUser: this.currentUser()
      });
      this._swapView(userIndexView);
    },

    userProfile: function (username) {
      var user = new Models.User({
        url: '/api/users/:' + username
      });
      user.fetch();

      var profileView = new Views.UserProfile({
        model: user
      });

      this._swapView(profileView);
    },

    users: function () {
      this._users = this._users || new Collections.Users();
      this._users.fetch({
        reset: true
      });
      return this._users;
    },

    currentUser: function (callback, wait) {
      this._currentUser = this._currentUser ||
        new Models.UserSession();
      this._currentUser.fetch({
        success: callback,
        wait: wait
      });
      return this._currentUser;
    },

    needsLogin: function () {
      this.currentUser(function (user) {
        if (user.id === undefined) {
          Backbone.history.navigate('welcome', {
            trigger: true
          });
        }
      });
    }
  });
})();
