Nstagram.Models.User = Backbone.Model.extend({
  urlRoot: '/api/users',
  initialize: function (options) {
    options = options || {}
    this.url = options.url || Backbone.Model.prototype.url.bind(this);
  },
  follow: function () {
    // this.ensure_follow();
    this._follow.save({}, {
      success: function (follow) {
        var attrs = _.clone(follow.attributes);
        this._follow.clear();
        this._follow.set(attrs.follow);
        delete attrs.follow;
        delete attrs.user;
        this.set(attrs);
      }.bind(this)
    });
  },
  unfollow: function () {

    this._follow.destroy({
      success: function () {
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
  },
  // follow: function () {
  //   this._follow = this._follow || new Nstagram.Models.Follow({
  //     following: response.id
  //   });
  // }
});
