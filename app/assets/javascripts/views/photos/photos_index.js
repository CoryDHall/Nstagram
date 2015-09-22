Nstagram.Views.PhotosIndex = Backbone.CompositeView.extend({
  tagName: 'photos-index',
  template: JST['photos/index'],

  initialize: function (options) {
    this.userSession = options.userSession;
    this.listenTo(this.collection, "reset", this.render);
    this.profile = options.profile;
  },

  render: function () {
    var content = this.template({
      photos: this.collection
    });
    this.$el.html(content);

    this.collection.each(function (photo) {
      this.addSubview(
        'ul',
        new Nstagram.Views.PhotosIndexItem({
          model: photo,
          userSession: this.userSession,
          profile: this.profile
        })
      );
    }.bind(this));

    return this;
  }

});
