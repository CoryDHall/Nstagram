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
        console.log("[data-error='" + $el.attr('data-error') + "'][data-time='" + $el.attr('data-time') + "']");
        return !$errors.is("[data-error='" + $el.attr('data-error') + "'][data-time='" + $el.attr('data-time') + "']");
        return true;
      }));
    }

    this.closeErrors();

    return this;
  },

  closeErrors: function () {
    TweenMax.staggerFromTo(
      this.$('li').not('.closing'),
      1,
      {
        css: { className: "+=closing" }
      },
      {
        css: { className: "+=closing-done" },
        delay: 3,
      },
      1,
      function () {
        this.$('.closing-done').remove();
      }.bind(this)
    );
  }
});
