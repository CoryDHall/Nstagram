Nstagram.Views.Welcome = Backbone.CompositeView.extend({
  id: 'welcome',
  template: JST['welcome'],
  events: {
    'click nav > a': 'toggleSignUpLogIn'
  },
  render: function () {
    var content = this.template();

    this.$el.html(content);
    this.addSubview('section.welcome', new Nstagram.Views.LogIn(), true);
    this.addSubview('section.welcome', new Nstagram.Views.SignUp(), true);
    this.$('#login-form, .login-link')
      .addClass('hidden-form');

    TweenPlugin.activate("colorProps");
    setInterval(this.shiftBGColor.bind(this), 100 / 12);
    return this;
  },
  shiftBGColor: function () {
    this.welcome = this.welcome || {
      head: this.$('header.welcome'),
      deg: 0,
      update: function () {
        this.deg = Math.round(((Math.random() * 3) - 1) / 1) + this.deg % 360;

        this.head[0].style.backgroundImage = "radial-gradient(circle at 0% 100%, " + this.getColor(0) + " 0%, transparent 90%), radial-gradient(circle at 100% 20%, " + this.getColor(90) + " 0%, transparent 60%), radial-gradient(circle at 90% 90%, " + this.getColor(240) + " 0%, transparent 80%)";
      },
      getColor: function (rotation) {
        rotation = rotation || 0;
        return "hsla(" + ((this.deg + rotation) % 360) + ", 90%, 45%, 0.9)";
      }
    };
    this.welcome.update();
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
