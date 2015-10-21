Nstagram.Views.PhotoShow = Backbone.CompositeView.extend({
  tagName: 'photos-index',
  template: JST['photos/index'],

  initialize: function (options) {
    this.userSession = options.userSession;
    this.listenTo(this.collection, "reset", this.render);
    this.style = "full";
    this.profile = options.profile;
    this.page = options.pageOn || 1;
  },

  render: function () {
    var content = this.template();
    this.$el.html(content);

    this.addSubview(
      'ul.photos',
      new Nstagram.Views.PhotosIndexItem({
        model: this.model,
        userSession: this.userSession,
        profile: this.profile
      })
    );

    return this;
  },
});
