Nstagram.Models.Guest = Backbone.Model.extend({
  url: "/api/users/guest/new",

  initialize: function (options) {
    this.session = options.session;
  },

  parse: function (resp) {
    // this.session = new Nstagram.Models.UserSession();
    // session.set(resp);
    // session.parse({
    //   password: "password"
    // });
    this.session.fetch({
      success: function () {
        Backbone.history.navigate('users', {
          trigger: true
        })
      }
    });
    return resp;
  }
});
