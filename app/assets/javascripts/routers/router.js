(function () {

  var Views = Nstagram.Views;
  var Collections = Nstagram.Collections;
  var Models = Nstagram.Models;

  Nstagram.Routers.Router = Backbone.Router.extend({

    initialize: function (options) {
      this.$rootEl = $(options.rootEl);

      this.$headEl = $(options.headEl);
      this._head = new Views.Header();
      this.$headEl.on("click", "nstagram-logo", function (e) {
        TweenMax.to(this.$rootEl, 1 + this.$rootEl.scrollTop() / 5000, { scrollTo: { y: 0 } });
      }.bind(this));
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
      this.hideBars();

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

    updateTitle: function (pageTitle, darken) {
      if (darken) {
        this._head.goDark();
      } else {
        this._head.unDark();
      }
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
      this.updateTitle("#" + query);
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
            // searchView.$el.parent().append($thumbs);
            this.$rootEl.append($thumbs);
            searchView.$el.appendTo($thumbs);
          }.bind(this);
          // searchView.listenTo(photos, "reset", putInPlace);
          photos.fetch({
            data: {
              'scope': "photos"
            },
            success: function (collection, resp) {
            },
            reset: true
          });
          this._swapView(searchView, {
            after: putInPlace
          });
        }.bind(this));
      }
    },

    menuSelect: function (linkClass) {
      this.$footEl.find('.selected').removeClass('selected');
      $('.' + linkClass).not('.selected').addClass('selected');
    },

    photoShow: function (username, photo_id) {
      var photos = new Collections.Photos({
        username: username,
        style: "full"
      });
      this.userSession(function (session) {
        var photo = photos.getOrFetch(photo_id);
        this.updateTitle(username + "'s photo");
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

      this.userSession(function (session) {
        var welcomeView = new Views.Welcome({
          session: session
        });

        this.needsNoLogin(welcomeView);
      }.bind(this), true);

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
        this.updateTitle("Upload", true);

        this.needsLogin(photoUploadView);
      }.bind(this));
    },

    feed: function () {
      this.userSession(function (session) {

        this.menuSelect("home-link");

        if (session.user.get("num_following") === 0 && session.user.get("num_posts") === 0) {
          session.user.id && Nstagram.FlashErrors.newErrors.add({
            reference: "Feed",
            status: "notice",
            time: "now",
            message: "There's nothing to show here :(, try following other users or uploading a photo!",
            length: 5
          });
          Backbone.history.navigate('/users', {
            trigger: true
          });
        } else {
          this.updateTitle();
          var feedView = new Views.PhotosIndex({
            userSession: session,
            collection: new Collections.Feed()
          });

          feedView.collection.fetch({
            reset: true
          });

          this.needsLogin(feedView);
        }
      }.bind(this), true);
    },

    usersIndex: function () {
      this.userSession(function (session) {
        this.menuSelect("all-users-link");
        this.updateTitle("Users");

        var userIndexView = new Views.UsersIndex({
          collection: this.users(),
          userSession: session
        });

        this.needsLogin(userIndexView);
      }.bind(this));
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
      users.fetch({
        reset: true,
        success: function () {
        }
      });
      var followingView = new Views.UsersIndex({
        collection: users,
        userSession: this.userSession()
      });

      this.updateTitle(username + " follows")

      this.needsLogin(followingView);
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

      this.updateTitle(username + "'s followers")

      this.needsLogin(followersView);
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

    userSession: function (callback, force) {
      this._userSession = this._userSession ||
        new Models.UserSession();

      force = force || false;
      if (!force && this._userSession.updated && Date.now() - this._userSession.updated < 1000000) {
        callback && callback(this._userSession);
      } else {
        this._userSession.fetch({
          success: function (session) {
            session.updated = Date.now();
            callback && callback(session);
          },
        });
      }

      return this._userSession;
    },

    needsLogin: function (view) {
      this.userSession(function (session) {
        if (session.isNew()) {
          Nstagram.FlashErrors.newErrors.add({
            reference: "Login",
            status: "failure",
            time: "now",
            message: "Please Log In or Sign Up to view this page",
            length: 3
          });
          Backbone.history.toRoot();
        } else {
          this._swapView(view)
        }
      }.bind(this));
    },

    needsNoLogin: function (view) {
      this.userSession(function (session) {
        if (!session.isNew()) {
          Backbone.history.toRoot();
        } else {
          this._swapView(view)
        }
      }.bind(this), true);
    },

    needsOwnership: function (username, view) {
      this.userSession(function (session) {
        if (session.user.escape("username") !== username) {
          Backbone.history.toRoot();
        } else {
          this._swapView(view)
        }
      }.bind(this), true);
    },

    logout: function () {
      this._currentView.stopListening();
      this._currentView.hide(function () {
        this._currentView.remove();

        this.userSession(function (session) {
          session.destroy();
          session.clear();
          session.user.clear();
          this.$footEl.find('*').removeClass("selected").blur();
          Backbone.history.toRoot();
        }.bind(this), true);

      }.bind(this),200);
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

    _swapView: function (view, callbacks) {
      callbacks = callbacks || {};
      callbacks.begin && callbacks.begin();
      this._currentView && this._currentView.hide(function () {
        this._currentView.remove();
        callbacks.during && callbacks.during();
      }.bind(this), 200);

      this.userSession(function (session) {
        if (session.user.isNew()) {
          this.hideBars();
        } else {
          this.showBars();
        }
        Backbone.Router.prototype._swapView.call(this, view, callbacks.after);
        this.$rootEl.trigger("scroll");
      }.bind(this))
    },
  });
})();
