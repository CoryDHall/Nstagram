Nstagram.Collections.Feed = Backbone.Collection.extend({

  model: Nstagram.Models.Photo,

  initialize: function (options) {
    this.url = "api/feed";
    this.style = 'full';
  },
  fetch: function (options) {
    return Nstagram.Collections.Photos.prototype.fetch.call(this, options);
  }

});
