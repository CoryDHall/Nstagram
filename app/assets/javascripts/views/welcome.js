Nstagram.Views.Welcome = Backbone.CompositeView.extend({
  id: 'welcome',
  template: JST['welcome'],
  events: {
    'click a': 'toggleSignUpLogIn'
  },
  render: function () {
    var content = this.template();

    this.$el.html(content);
    this.addSubview('section.welcome', new Nstagram.Views.LogIn());
    this.addSubview('section.welcome', new Nstagram.Views.SignUp());
    this.$('#login-form, .login-link')
      .addClass('hidden-form');

    return this;
  },
  toggleSignUpLogIn: function (e) {
    e.preventDefault();

    this.$('a')
      .removeClass('hidden-form')
      .not(e.currentTarget)
      .addClass('hidden-form');
      
    switch ($(e.currentTarget).attr('class')) {
      case 'signup-link':
        this.$('#signup-form.hidden-form')
          .removeClass('hidden-form');
        this.$('#login-form')
          .not('.hidden-form')
          .addClass('hidden-form');
        break;
      case 'login-link':
        this.$('#login-form.hidden-form')
          .removeClass('hidden-form');
        this.$('#signup-form')
          .not('.hidden-form')
          .addClass('hidden-form');
        break;
    }
  }
});
