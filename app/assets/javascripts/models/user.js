Nstagram.Models.User = Backbone.Model.extend({
  urlRoot: '/api/users',
  initialize: function (options) {
    options = options || {}
    this.url = options.url || Backbone.Model.prototype.url.bind(this);
  },
  follow: function () {

    this._follow.save({}, {
      success: function (follow) {
        var attrs = _.clone(follow.attributes);
        delete attrs.user;
        this.set(this.parse(attrs));
      }.bind(this)
    });
  },
  unfollow: function () {

    this._follow.destroy({
      success: function (follow) {
        this.fetch({
          reset: true
        });
      }.bind(this)
    });
  },
  parse: function (response) {
    if (response.is_following !== undefined) {
      this._follow = new Nstagram.Models.Follow({
        following: response.id
      });
      this._follow.set(response.follow);
      delete response.follow;
    }
    return response;
  }
});
