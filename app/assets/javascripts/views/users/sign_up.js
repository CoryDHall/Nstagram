Nstagram.Views.SignUp = Backbone.View.extend({
  tagName: 'form',
  template: JST['users/sign_up'],
  id: 'signup-form',
  events: {
    "submit":"signUp"
  },
  render: function () {
    this.$el.html(this.template());
    return this;
  },
  signUp: function (e) {
    e.preventDefault();

    var formData = this.$el.serializeJSON();
    var user = new Nstagram.Models.User();
    user.save(formData, {
      success: function () {
        Backbone.history.navigate('', {
          trigger: true
        })
      }
    });
  }
});
