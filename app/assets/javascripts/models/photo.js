Nstagram.Models.Photo = Backbone.Model.extend({
  urlRoot: function () {
    this._urlRoot = "api/users/:" + this.user.get("username")+ "/photos";
    return this._urlRoot
  },
  initialize: function (options) {
    this.user = options.user;
  }
});
