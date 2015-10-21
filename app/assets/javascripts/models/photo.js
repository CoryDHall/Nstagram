Nstagram.Models.Photo = Backbone.Model.extend({
  urlRoot: function () {
    if (this.collection) {
      this._urlRoot = this.collection.url;
    } else {
      this._urlRoot = "api/users/:" + this.user.get("username")+ "/photos";
    }
    return this._urlRoot
  },
  initialize: function (options) {
    this.parse(options);
  },
  parse: function (resp) {
    if (resp.user) {
      this.user = this.user || new Nstagram.Models.User();
      this.user.set(resp.user.attributes || resp.user);
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
    if (resp.comments) {
      this.comments();
      this.comments().set(resp.comments);
      delete resp.comments;
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
  },
  comments: function (options) {
    this._comments = this._comments || new Nstagram.Collections.Comments({
      photo_id: this.id
    });
    return this._comments;
  },
  newComment: function (options) {
    var comment = new Nstagram.Models.Comment({
      photo_id: this.id
    });
    comment.set(options);
    this.comments().add(comment);
    return comment;
  }
});
