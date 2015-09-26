Nstagram.Views.PhotosIndexItem = Backbone.CompositeView.extend({
  tagName: 'li',
  template: JST['photos/index_item'],

  initialize: function (options) {
    this.userSession = options.userSession;
    this.profile = options.profile;
    this.listenTo(this.model, 'sync change change:is_current_user_liking set', this.render);
    this.listenTo(this.model._like, 'sync', this.renderLater);
  },

  events: {
    'doubletap': 'like',
  },

  render: function () {
    var user = this.model.user || new Nstagram.Models.User({
      username: "you",
      profile_picture_url: ""
    });
    var content = this.template({
      photo: this.model,
      user: user,
      profile: this.profile
    });
    this.$el.html(content);

    return this;
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
          this.showHeartBreak();
        }.bind(this)
      });
    } else {
      this.model.like({
        success: function (like, xHr, options) {
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
