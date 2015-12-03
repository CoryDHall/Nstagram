Nstagram.Views.SignUp = Backbone.View.extend({
  tagName: 'form',
  template: JST['users/user_form'],
  id: 'signup-form',
  events: {
    "submit":"signUp",
    "input":"advanceForm",
    "keydown":"tabAdvance"
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
  tabAdvance: function (e) {
    if (e.which == 9) {
      if (!this.advanceForm(e)) {
        e.preventDefault();
      }
    }
  },
  advanceForm: function (e) {
    // debugger
    this.validatePassword();
    if (e.target.validity.valid && $(e.target).nextAll("input, button")[0].disabled) {
      $(e.target).nextAll("input, button").first().prop("disabled", false);
    } else if (!e.target.validity.valid) {
      $(e.target).nextAll("button").prop("disabled", true);
      return false;
    }
    return true;
  },
  validatePassword: function () {
    var confirm = this.$('#user_password_confirmation')[0];
    var pass2 = confirm.value;
    var pass1 = this.$('#user_password')[0].value;
    if(pass1!=pass2)
    	confirm.setCustomValidity("Passwords Don't Match");
    else
    	confirm.setCustomValidity('');
    //empty string means no validation error
  },

  signUp: function (e) {
    e.preventDefault();

    // var formData = this.$el.serializeJSON();
    this.user = new Nstagram.Models.User();
    var formData = new FormData(this.el);

    this.user.saveFormData(formData, {
      success: function (newUser) {
        if (newUser.escape('errors').length > 0) {
          this.user.set(formData);
          Backbone.history.toRoot();
          return;
        }
        Backbone.history.toRoot();
      }.bind(this)
    });
  }
});
