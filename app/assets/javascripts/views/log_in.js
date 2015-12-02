Nstagram.Views.LogIn = Backbone.View.extend({
  tagName: 'form',
  template: JST['log_in_form'],
  id: 'login-form',
  initialize: function (options) {
    this.session = options.session;
  },
  events: {
    "submit":"logIn",
    "input":"enableButton"
  },
  enableButton: function (e) {
    if (this.$("input").toArray().every(function (input) {
      return input.validity.valid
    })) {
      this.$(":button").prop("disabled", false);
    } else {
      this.$(":button").prop("disabled", true);
    }
  },
  render: function () {
    this.$el.html(this.template());
    return this;
  },
  logIn: function (e) {
    e.preventDefault();

    var formData = this.$el.serializeJSON();
    this.$('#session_username, #session_password').prop("disabled", true);
    var session = this.session || new Nstagram.Models.UserSession();
    session.save(formData, {
      success: function () {
        Backbone.history.navigate('', {
          trigger: true
        });
      }, error: function () {
        this.render();
      }.bind(this)
    });
  }
});
