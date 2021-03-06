Nstagram.Views.Welcome = Backbone.CompositeView.extend({
  id: 'welcome',
  template: JST['welcome'],
  initialize: function (options) {
    this.session = options.session;
  },
  events: {
    'click nav > a': 'toggleSignUpLogIn',
    'submit .guest-form': 'guestLogin',
    'click a.twitter-button': 'disableForms',
    'submit form': 'disableForms',
  },
  render: function () {
    var content = this.template();

    this.$el.html(content);
    this.addSubview('section.welcome', new Nstagram.Views.LogIn({
      session: this.session,
      parentView: this,
    }), true);
    this.addSubview('section.welcome', new Nstagram.Views.SignUp({
      session: this.session,
      parentView: this,
    }), true);
    this.$('#signup-form, .signup-link')
      .addClass('hidden-form');

    TweenPlugin.activate("colorProps");
    setTimeout(this.shiftBGColor.bind(this), 0);
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
    requestAnimationFrame(this.shiftBGColor.bind(this));
  },

  toggleSignUpLogIn: function (e) {
    e.preventDefault();
    this.$('a')
      .removeClass('hidden-form')
      .not(e.currentTarget)
      .addClass('hidden-form');

    var tl = Nstagram.timeline;

    switch ($(e.currentTarget).attr('class')) {
      case 'signup-link':
        tl
          .to(this.$('#signup-form.hidden-form'), 0.25, { className: "-=hidden-form" })
          .to(this.$('#login-form').not('.hidden-form'), 0.5, { className: "+=hidden-form" }, '-=0.4');
        break;
      case 'login-link':
        tl
          .to(this.$('#login-form.hidden-form'), 0.25, { className: "-=hidden-form" })
          .to(this.$('#signup-form').not('.hidden-form'), 0.5, { className: "+=hidden-form" }, '-=0.2');
        break;
    }
  },

  disableForms: function (e) {
    var props = {
      disabled: true,
      href: "javascript:void(0)"
    };
    this.$('.welcome form *, .twitter-button').not($(e.currentTarget).find('button')).prop(props).attr(props);
  },

  guestLogin: function (e) {
    e.preventDefault();
    var guest = new Nstagram.Models.Guest({
      session: this.session
    });
    this.session.user = guest;
    guest.save();
  },
});
