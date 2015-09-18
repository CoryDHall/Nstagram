Nstagram.Models.User = Backbone.Model.extend({
  urlRoot: '/api/users',
  initialize: function (options) {
    options = options || {}
    this.url = options.url || Backbone.Model.prototype.url.bind(this);
  }
});
