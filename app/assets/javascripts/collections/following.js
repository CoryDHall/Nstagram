Nstagram.Collections.Following = Backbone.Collection.extend({
  model: Nstagram.Models.User,
  initialize: function (options) {
    this.url = "api/users/" + options.follower + "/following";
  }

});
