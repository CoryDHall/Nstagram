Nstagram.Views.SignUp = Backbone.View.extend({
  tagName: 'form',
  template: JST['users/sign_up'],
  id: 'signup-form',
  events: {
    "submit":"signUp"
  },
  initialize: function () {
    this.user = new Nstagram.Models.User();
    this.listenTo(this.user, "sync", this.render)
  },
  render: function () {
    this.$el.html(this.template({
      user: this.user
    }));
    return this;
  },
  signUp: function (e) {
    e.preventDefault();

    var formData = this.$el.serializeJSON();
    this.user = new Nstagram.Models.User();
    this.user.save(formData, {
      success: function (newUser) {
        if (newUser.escape('errors').length > 0) {
          return;
        }
        Backbone.history.navigate('', {
          trigger: true
        })
      }
    });
  }
});
