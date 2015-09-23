Nstagram.Models.Photo = Backbone.Model.extend({
  urlRoot: function () {
    this._urlRoot = "api/users/:" + this.user.get("username")+ "/photos";
    return this._urlRoot
  },
  initialize: function (options) {
    this.parse(options);
  },
  parse: function (resp) {
    if (resp.user) {
      this.user = this.user || new Nstagram.Models.User();
      this.user.set(resp.user);
      delete resp.user;
    }
    if (resp.current_like) {
      this._like = new Nstagram.Models.Like({
        photo: {id: resp.id}
      });
      this._like.set(resp.current_like);
      delete resp.current_like;
    }
    if (resp.likes) {
      this.likers = this.likers || new Nstagram.Collections.Users();
      this.likers.set(resp.likes.users);
      delete resp.likes.users;
    }
    return resp;
  },
  like: function (options) {
    this.set("is_current_user_liking", true);
    this._like.save({}, options);
  },
  unlike: function (options) {
    this.set("is_current_user_liking", false);
    options["completed"] = this.fetch.bind(this, {
      reset: true
    });
    this._like.destroy(options);
  }
});
