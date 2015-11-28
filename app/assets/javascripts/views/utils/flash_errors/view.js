Nstagram.FlashErrors.View = Backbone.CompositeView.extend({
  tagName: 'ul',
  className: 'clearfix',
  template: JST['globals/flash'],

  initialize: function () {
    this.listenTo(this.collection, 'add', this.render);
  },

  render: function () {
    var content = this.template({
      errors: this.collection
    });

    if (this.$('nsta-flash-loaded').length === 0 ) {
      this.$el.html(content);
    } else {
      var $errors = this.$('li');
      var $newErrors = $(content).find('li');
      this.$el.append($newErrors.filter(function (idx) {
        var $el = $($newErrors.get(idx));

        return !$errors.is("[data-error='" + $el.attr('data-error') + "'][data-time='" + $el.attr('data-time') + "']");
      }));
    }
    this.popErrors();

    return this;
  },
  popErrors: function () {
    TweenMax.staggerTo(
      this.$('.opening'),
      0.0,
      { css: { className: "-=opening" } },
      0.2,
      this.closeErrors.bind(this)
    );
  },

  closeErrors: function () {
    this.$('li').not('.closing, .closing-done').each(function (idx, el) {
      var length = parseInt(el.attributes.getNamedItem("data-length").value);
      TweenMax.fromTo(
        el,
        0.2,
        {
          css: { className: "+=closing" }
        },
        {
          delay: length,
          css: { className: "+=closing-done" },
          onComplete: function () {
            this.$('.closing-done').remove();
          }.bind(this)
        }
      );
    }.bind(this));
    // TweenMax.staggerFromTo(
    //   this.$('li').not('.closing, .closing-done'),
    //   0.2,
    //   {
    //     css: { className: "+=closing" }
    //   },
    //   {
    //     css: { className: "+=closing-done" },
    //     delay: 1.2,
    //   },
    //   0.4,
    // );
  }
});
