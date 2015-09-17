(function () {

  var Views = Nstagram.Views;
  var Collections = Nstagram.Collections;

  Nstagram.Routers.Router = Backbone.Router.extend({

    initialize: function (options) {
      this.$rootEl = $(options.rootEl);
    },

    routes: {
      '': 'root'
    },

    root: function () {
      if (this.$rootEl.parent().attr("data-logged-in") === "true") {
        var rootView = new Views.UsersIndex({
          collection: this.users()
        });
      } else {
        var rootView = new Views.Welcome();
      }
      this._swapView(rootView);
    },

    users: function () {
      this._users = this._users || new Collections.Users();
      this._users.fetch({
        reset: true
      });
      return this._users;
    }
  });
})();
