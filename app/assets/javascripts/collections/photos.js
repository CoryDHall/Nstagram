Nstagram.Collections.Photos = Backbone.Collection.extend({

  model: Nstagram.Models.Photo,
  initialize: function (options) {
    this.url = "api/users/:" + options["username"] + "/photos";
    this.style = options.style || 'thumb'
  },
  fetch: function (options) {
    options = options || {};
    options.data = options.data || {};
    options.data["style"] = this.style;

    return Backbone.Collection.prototype.fetch.call(this, options);
  }

});
