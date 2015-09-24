Nstagram.FlashErrors.View = Backbone.CompositeView.extend({
  tagName: 'ul',

  template: JST['flash'],

  initialize: function () {
    this.listenTo(this.collection, 'sync', this.render);
  },

  render: function () {
    var content = this.template({
      errors: this.collection
    });

    this.$el.html(content);

    return this;
  },
});
