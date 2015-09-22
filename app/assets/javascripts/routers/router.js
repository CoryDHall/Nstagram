(function () {

  var Views = Nstagram.Views;
  var Collections = Nstagram.Collections;
  var Models = Nstagram.Models;

  Nstagram.Routers.Router = Backbone.Router.extend({

    initialize: function (options) {
      this.$rootEl = $(options.rootEl);

      this.$headEl = $(options.headEl);
      this._head = new Views.Header();
      this.$headEl.html(this._head.$el);
      this._head.render();

      this.$flashEl = $(options.flashEl);

      this.$footEl = $(options.footEl);
      this._menu = new Views.Menu();
      this.$footEl.html(this._menu.$el);
      this._menu.render();
      this._barsHidden = false;
    },

    updateTitle: function (pageTitle) {
      this._currentTitle = pageTitle || "nstagram";
      $('title').text(this._currentTitle);
      this._head.changeTitle(this._currentTitle);
    },

    routes: {
      '': 'root',
      'welcome': 'welcome',
      'upload': 'uploadPhoto',
      'users': 'usersIndex',
      'feed': 'feed',
      'logout': 'logout',
      'users/:username': 'userProfile',
      'users/:username/edit': 'editUserProfile',
      'users/:username/following': 'userFollowing',
      'users/:username/followers': 'userFollowers',
      '*redirect': 'root',
    },

    root: function () {
      this.updateTitle();
      this.userSession(function (session) {
        if (!session.isNew()) {
          this.showBars();
          Backbone.history.navigate('/feed', {
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
      this.hideBars();
      var welcomeView = new Views.Welcome();

      this.needsNoLogin(welcomeView);
    },

    uploadPhoto: function () {
      var photoUploadView = new Views.PhotoNew({
        userSession: this.userSession()
      });

      this.needsLogin(photoUploadView);
    },

    feed: function () {
      this.userSession(function (session) {
        if (session.user.get("num_following") === 0) {
          Backbone.history.navigate('/users', {
            trigger: true
          });
        } else {
          var feedView = new Views.PhotosIndex({
            userSession: this.userSession(),
            collection: new Collections.Feed()
          });

          feedView.collection.fetch({
            reset: true
          });

          this.needsLogin(feedView);
        }
      }.bind(this));
    },

    usersIndex: function () {
      var userIndexView = new Views.UsersIndex({
        collection: this.users(),
        userSession: this.userSession()
      });

      this.needsLogin(userIndexView);
    },

    userProfile: function (username) {
      var user = new Models.User({
        url: '/api/users/:' + username
      });
      user.fetch({
        success: function () {
          var profileView = new Views.UserProfile({
            model: user,
            userSession: this.userSession()
          });

          this.updateTitle(username);

          this._swapView(profileView);
        }.bind(this)
      });

    },

    userFollowing: function (username) {
      var users = new Collections.Following({
        follower: username
      });
      users.fetch({
        reset: true
      });

      var followingView = new Views.UsersIndex({
        collection: users,
        userSession: this.userSession()
      });

      this._swapView(followingView);
    },

    userFollowers: function (username) {
      var users = new Collections.Followers({
        following: username
      });
      users.fetch({
        reset: true
      });

      var followersView = new Views.UsersIndex({
        collection: users,
        userSession: this.userSession()
      });

      this._swapView(followersView);
    },

    editUserProfile: function (username) {
      var user = new Models.User({
        url: '/api/users/:' + username
      });
      user.fetch();

      var editProfileView = new Views.EditProfile({
        model: user,
        userSession: this.userSession()
      });
      this.needsOwnership(username, editProfileView);

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

    needsLogin: function (view) {
      this.userSession(function (session) {
        if (session.isNew()) {
          Backbone.history.navigate('', {
            trigger: true
          });
        } else {
          this._swapView(view)
        }
      }.bind(this));
    },

    needsNoLogin: function (view) {
      this.userSession(function (session) {
        if (!session.isNew()) {
          Backbone.history.navigate('', {
            trigger: true
          });
        } else {
          this._swapView(view)
        }
      }.bind(this));
    },

    needsOwnership: function (username, view) {
      this.userSession(function (session) {
        if (session.user.escape("username") !== username) {
          Backbone.history.navigate('', {
            trigger: true
          });
        } else {
          this._swapView(view)
        }
      }.bind(this));
    },

    logout: function () {
      this.userSession(function (session) {
        session.destroy()
        session.clear()
        Backbone.history.navigate('', {
          trigger: true
        })
      });
    },

    hideBars: function () {
      if (!this._barsHidden) {
        this.$headEl.addClass("hide-bar");
        this.$rootEl.addClass("hide-bar");
        this.$footEl.addClass("hide-bar");
        this._barsHidden = true;
      }
    },

    showBars: function () {
      if (this._barsHidden) {
        this.$headEl.removeClass("hide-bar");
        this.$rootEl.removeClass("hide-bar");
        this.$footEl.removeClass("hide-bar");
        this._barsHidden = false;
      }
    },
  });
})();
