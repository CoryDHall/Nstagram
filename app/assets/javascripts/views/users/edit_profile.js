Nstagram.Views.EditProfile = Backbone.View.extend({
  tagName: 'form',
  template: JST['users/user_form'],
  id: 'editprofile-form',
  events: {
    "submit":"edit"
  },
  initialize: function () {
    this.user = this.model;
    this.listenTo(this.user, "sync", this.render)
  },
  render: function () {
    this.$el.html(this.template({
      user: this.user
    }));
    return this;
  },
  edit: function (e) {
    e.preventDefault();

    var formData = this.$el.serializeJSON();

    this.user.save(formData, {
      success: function (newUser) {
        if (newUser.escape('errors').length > 0) {
          return;
        }
        Backbone.history.navigate('users/' + newUser.escape("username"), {
          trigger: true
        })
      }
    });
  }
});
