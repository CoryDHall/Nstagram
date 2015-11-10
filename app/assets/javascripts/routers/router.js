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
      Nstagram.FlashErrors.setEl(this.$flashEl);
      Nstagram.FlashErrors.listen();

      this.$footEl = $(options.footEl);
      this._menu = new Views.Menu();
      this.$footEl.html(this._menu.$el);
      this._menu.render();
      this._barsHidden = false;

      this._scrolling = false;
      this.$rootEl.on("scroll", function (e) {
        if (this._scrolling) {
          return
        } else {
          this._scrolling = true;
          this.tellCurrentView(e);
          setTimeout(function () {
            this._scrolling = false;
          }.bind(this), 100);
        }
      }.bind(this));
    },

    tellCurrentView: function (e) {
      this._currentView && this._currentView.hearAbout(e);
    },

    updateTitle: function (pageTitle) {
      this._currentTitle = pageTitle ? pageTitle.toUpperCase() : "nstagram";
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
      'me': 'you',
      'users/:username': 'userProfile',
      'users/:username/edit': 'editUserProfile',
      'users/:username/following': 'userFollowing',
      'users/:username/followers': 'userFollowers',
      'users/:username/p/:photo_id': 'photoShow',
      'users/:username/p/:photo_id/comments': 'photoComments',
      'search/:scope/:query': 'search',
      '*redirect': 'root',
    },

    search: function (scope, query) {
      var qscope = {
        'p': 'photos',
        'u': 'users'
      }[scope] || "all";
      if (qscope === "photos") {
        var photos = new Collections.PhotoSearch({
          query: query
        });
        this.userSession(function (session) {
          var searchView = new Views.PhotosIndex({
            userSession: session,
            collection: photos,
            style: 'thumb',
            profile: true
          });
          var putInPlace = function (coll, resp) {
            var $thumbs = $('<nstagram-thumbs-index>');
            searchView.$el.parent().append($thumbs);
            searchView.$el.appendTo($thumbs);
          };
          searchView.listenTo(photos, "sync", putInPlace);
          photos.fetch({
            data: {
              'scope': "photos"
            },
            success: function (collection, resp) {
            },
            reset: true
          });
          this._swapView(searchView);
        }.bind(this));
      }
    },

    menuSelect: function (linkClass) {
      $('.selected').removeClass('selected');
      $('.' + linkClass).not('.selected').addClass('selected');
    },

    photoShow: function (username, photo_id) {
      var photos = new Collections.Photos({
        username: username,
        style: "full"
      });
      this.userSession(function (session) {
        var photo = photos.getOrFetch(photo_id);
        var showView = new Views.PhotoShow({
          userSession: session,
          model: photo
        });
        this._swapView(showView);
      }.bind(this));
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

    you: function () {
      this.userSession(function (session) {
        this.menuSelect("you-link");
        this.userProfile(session.user.get("username"));
      }.bind(this));
    },

    uploadPhoto: function () {
      var photoUploadView;
      this.userSession(function (session) {
        photoUploadView = new Views.PhotoNew({
          userSession: session
        });
        this.menuSelect("upload-link");
        this.updateTitle("Upload");

        this.needsLogin(photoUploadView);
      }.bind(this));
    },

    feed: function () {
      this.userSession(function (session) {

        this.menuSelect("home-link");

        if (session.user.get("num_following") === 0) {
          Backbone.history.navigate('/users', {
            trigger: true
          });
        } else {
          var feedView = new Views.PhotosIndex({
            userSession: session,
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
      this.menuSelect("all-users-link");
      this.updateTitle("Users");

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
        }.bind(this),
        error: function () {
          Backbone.history.navigate('/users', {
            trigger: true
          });
        }
      });
    },

    userFollowing: function (username) {
      var users = new Collections.Following({
        follower: username
      });
      var that = this;
      users.fetch({
        reset: true,
        success: function () {
          that.userSession(function (session) {
            var followingView = new Views.UsersIndex({
              collection: users,
              userSession: session
            });

            that._swapView(followingView);
          });
        }
      });
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
        session.destroy();
        session.clear();
        session.user.clear();
        $('*').removeClass("selected").blur();
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

    _swapView: function (view) {
      this.userSession(function (session) {
        if (session.user.isNew()) {
          this.hideBars();
        } else {
          this.showBars();
        }
        Backbone.Router.prototype._swapView.call(this, view);
        this.$rootEl.trigger("scroll");
      }.bind(this))
    },
  });
})();
