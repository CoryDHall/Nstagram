Nstagram.Collections.Feed = Backbone.Collection.extend({

  model: Nstagram.Models.Photo,

  initialize: function (options) {
    this.url = "api/feed";
    this.style = 'full';
  },
  fetch: function (options) {
    options = options || {};
    options.data = {
      style: this.style
    };
    return Backbone.Collection.prototype.fetch.call(this, options);
  }

});
