Nstagram.Collections.PhotoSearch = Backbone.Collection.extend({

  model: Nstagram.Models.Photo,

  initialize: function (options) {
    this.url = "api/search/" + options['query'];
    this.style = "thumb"
  },
  fetch: function (options) {
    return Nstagram.Collections.Photos.prototype.fetch.call(this, options);
  },

  parse: function (resp) {
    return resp.photos;
  },

});
