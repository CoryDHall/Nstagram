Nstagram.Views.LogIn = Backbone.View.extend({
  tagName: 'form',
  template: JST['log_in_form'],
  events: {
    "submit":"logIn"
  },
  render: function () {
    this.$el.html(this.template());
    return this;
  },
  logIn: function (e) {
    e.preventDefault();

    var formData = this.$el.serializeJSON();
    var session = new Nstagram.Models.UserSession();
    session.save(formData, {
      success: function () {
        Backbone.history.navigate('', {
          trigger: true
        })
      }
    });
  }
});
