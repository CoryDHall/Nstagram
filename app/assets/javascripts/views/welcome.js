Nstagram.Views.Welcome = Backbone.CompositeView.extend({
  id: 'welcome',
  template: JST['welcome'],

  render: function () {
    var content = this.template();

    this.$el.html(content);
    this.addSubview('section.welcome', new Nstagram.Views.LogIn());

    return this;
  }
});
