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
      this.likers = resp.likes.users || [];
    }
    this.likers = this.likers || [];
    return resp;
  },
  like: function (options) {
    if (this._like) {
      this.set("is_current_user_liking", true);
      this.likers.push({ username: this.escape("current_like_username") });
      this.attributes["likes"] = this.get("likes") || { count: 0 }
      this.get("likes").count += 1;
      this._like.save({}, options);
    }
  },
  unlike: function (options) {
    if (this._like) {
      this.set("is_current_user_liking", false);
      this.likers = _.reject(this.likers, function (liker) {
        return liker.username == this.escape("current_like_username");
      }.bind(this));
      options["completed"] = this.fetch.bind(this, {
        reset: true
      });
      this.attributes["likes"] = this.get("likes") || { count: 0 }
      this.get("likes").count -= 1;
      this.get("likes").count === 0 && this.unset("likes");
      this._like.destroy(options);
    }
  }
});
