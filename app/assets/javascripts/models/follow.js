Nstagram.Models.Follow = Backbone.Model.extend({
  initialize: function (options) {
    this.url = "api/users/" + options.following + "/follow";
  },
  idAttribute: "user_id"
});
