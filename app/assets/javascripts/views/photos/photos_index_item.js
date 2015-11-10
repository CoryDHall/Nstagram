Nstagram.Views.PhotosIndexItem = Backbone.CompositeView.extend({
  tagName: 'li',
  className: 'photo-view',
  template: JST['photos/index_item'],

  initialize: function (options) {
    this.userSession = options.userSession;
    this.profile = options.profile;
    this.listenTo(this.model, 'sync change change:is_current_user_liking set', this.render);
    this.listenTo(this.model._like, 'sync', this.renderLater);
    this.listenTo(this.model.comments(), 'add remove fetch', this.render);
  },

  events: {
    'doubletap': 'like',
    'click .like-button': 'likeToggle',
    'click .delete-button': 'delete',
    'input .comment-input': 'startingInput',
    'submit': 'saveComment'
  },

  startingInput: function (e) {
    if (e.target.value === "") {
      this.$('.new-comment-button').prop("disabled", true);
    } else {
      this.$('.new-comment-button').prop("disabled", false);
    }
  },

  saveComment: function (e) {
    e.preventDefault();
    var comment = this.model.newComment($(e.target).serializeJSON());
    comment.save({
      user: this.userSession.user.get("username")
    }, {
      success: this.render.bind(this),
      error: function () {
        comment.collection.remove(comment);
      }
    });
  },

  delete: function (e) {
    e.preventDefault();
    if (confirm("Are you sure?")) {
      this.model.destroy({
        success: this.remove.bind(this)
      });
    }
  },

  getUser: function () {
    return this.model.user || new Nstagram.Models.User({
      username: "you",
      profile_picture_url: ""
    });
  },

  render: function () {
    var user = this.getUser();
    var content = this.template({
      photo: this.model,
      user: user,
      profile: this.profile,
      session: this.userSession
    });
    this.$el.html(content);



    var comments = this.model.comments();
    comments.each(function(comment, idx) {
      if (idx === 2 && false) {
        this.$('nsta-comments').prepend($('<p class="comment"></p>').text("•••"));
      } else {
        this.addSubview(
          'nsta-comments',
          new Nstagram.Views.CommentsIndexItem({
            class: "comment",
            body: comment.get('body'),
            user: comment.get('user'),
            photo_id: this.model.id
          }),
          true
        );
      }
    }.bind(this));
    // debugger
    this.renderCaption();

    return this;
  },

  renderCaption: function () {
    var body = this.model.get('caption');
    if (body === "") {
      return;
    }
    var user = this.getUser();
    this.addSubview(
      'nsta-caption',
      new Nstagram.Views.CommentsIndexItem({
        class: "caption",
        body: body,
        user: user.escape('username'),
        photo_id: this.model.id
      })
    );
  },

  renderLater: function () {
    setTimeout(function () {
      this.model.trigger("sync");
    }.bind(this), 1000);
  },

  likeToggle: function (e) {
    e.preventDefault();
    if (this.model.get("is_current_user_liking")) {
      this.model.unlike({
        success: function (like, xHr, options) {
          $(e.currentTarget).text("like");
          this.showHeartBreak();
        }.bind(this)
      });
    } else {
      this.model.like({
        success: function (like, xHr, options) {
          $(e.currentTarget).text("unlike");
          this.showHeart();
        }.bind(this)
      });
    }
  },

  like: function (e) {
    e.preventDefault();
    if (this.model.get("is_current_user_liking")) {

    } else {
      this.model.like({
        success: function (like, xHr, options) {
          this.showHeart();
        }.bind(this)
      });
    }
  },

  showHeart: function () {
    var $overlay = $('<div>').text("\uD83D\uDC96").addClass("photo-like opening");
    this.$('nsta-photo').append($overlay);
    TweenMax.to($overlay, 1, { css: { className: "-=opening" }, yoyo: true, onReverseComplete: function () {
        $overlay.remove();
      }
    });
  },

  showHeartBreak: function () {
    var $overlay = $('<div>').text("\uD83D\uDC94").addClass("photo-like opening");
    this.$('nsta-photo').append($overlay);
    TweenMax.to($overlay, 1, { css: { className: "-=opening" }, yoyo: true, onReverseComplete: function () {
        $overlay.remove();
      }
    });
  }

});
