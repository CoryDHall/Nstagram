Nstagram.Models.Photo = Backbone.Model.extend({
  urlRoot: function () {
    this._urlRoot = "api/users/:" + this.user.get("username")+ "/photos";
    return this._urlRoot
  },
  initialize: function (options) {
  },
  parse: function (resp) {
    if (resp.user) {
      this.user = this.user || new Nstagram.Models.User();
      this.user.set(resp.user);
      delete resp.user;

    }
    return resp;
  }
});
