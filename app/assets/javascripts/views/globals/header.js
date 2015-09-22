Nstagram.Views.Header = Backbone.CompositeView.extend({
  template: JST['globals/header'],

  events: {
    'click button.logout': 'logout'
  },

  render: function () {
    var content = this.template();
    this.$el.html(content);

    return this;
  },

  logout: function (e) {
    Backbone.history.navigate('logout', {
      trigger: true
    });
  },

  changeTitle: function (title) {
    this.$('nstagram-logo').text(title);
  }

});
