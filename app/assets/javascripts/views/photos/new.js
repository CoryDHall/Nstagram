Nstagram.Views.PhotoNew = Backbone.View.extend({
  tagName: 'form',
  template: JST['photos/photo_form'],
  id: 'photo-form',

  events: {
    "submit":"submit"
  },

  initialize: function (options) {
    this.userSession = options.userSession;
  },

  render: function () {
    this.$el.html(this.template());

    return this;
  },

  submit: function (e) {
    e.preventDefault();

    var formData = new FormData(this.el);
    this.userSession.fetch({
      success: function (session) {
        this.photo = new Nstagram.Models.Photo({user: session.user});
        // this.photo.parse();
        this.photo.saveFormData(formData, {
          success: function (newPhoto) {
            if (newPhoto.escape('errors').length > 0) {
              return;
            }
            Backbone.history.navigate('', {
              trigger: true
            });
          }
        });
      }.bind(this)
    });
  }
});
