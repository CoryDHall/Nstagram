Nstagram.Models.User = Backbone.Model.extend({
  urlRoot: '/api/users',
  initialize: function (options) {
    this.url = options.url || this.url;
  }
});
