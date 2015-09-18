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
      this.userSession(function (session) {
        if (!session.isNew()) {
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
      this.needsNoLogin();

      var welcomeView = new Views.Welcome();

      this._swapView(welcomeView);
    },

    usersIndex: function () {
      this.needsLogin();

      var userIndexView = new Views.UsersIndex({
        collection: this.users(),
        userSession: this.userSession()
      });
      this._swapView(userIndexView);
    },

    userProfile: function (username) {
      var user = new Models.User({
        url: '/api/users/:' + username
      });
      user.fetch();

      var profileView = new Views.UserProfile({
        model: user,
        userSession: this.userSession()
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

    userSession: function (callback) {
      this._userSession = this._userSession ||
        new Models.UserSession();
      this._userSession.fetch({
        success: callback,
      });
      return this._userSession;
    },

    needsLogin: function () {
      this.userSession(function (session) {
        if (session.isNew()) {
          Backbone.history.navigate('', {
            trigger: true
          });
        }
      });
    },

    needsNoLogin: function () {
      this.userSession(function (session) {
        if (!session.isNew()) {
          Backbone.history.navigate('', {
            trigger: true
          });
        }
      });
    }
  });
})();
