Nstagram.Models.UserSession = Backbone.Model.extend({
  url: '/user_session/current',
  parse: function (response) {
    this.user = new Nstagram.Models.User(response);
    if (response !== null) {
      response = { id: response.id };
    }
    return response;
  }
});
