Nstagram.Collections.Photos = Backbone.Collection.extend({

  model: Nstagram.Models.Photo,
  initialize: function (options) {
    this.url = "api/users/" + options.user + "/photos";
  }

});
