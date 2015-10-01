Nstagram.Models.Guest = Backbone.Model.extend({
  url: "/api/users/guest/new",

  parse: function (resp) {
    var session = new Nstagram.Models.UserSession();
    // session.set(resp);
    // session.parse({
    //   password: "password"
    // });
    session.fetch({
      success: function () {
        Backbone.history.navigate('users', {
          trigger: true
        })
      }
    });
    return resp;
  }
});
