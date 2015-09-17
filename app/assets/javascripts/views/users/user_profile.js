Nstagram.Views.UserProfile = Backbone.CompositeView.extend({
  tagName: 'nstagram-profile',
  template: JST['users/profile'],
  events: {
  },
  
  initialize: function () {
    this.listenTo(this.model, 'sync', this.render);
  },

  render: function () {
    this.$el.html(this.template({
      user: this.model
    }));
    return this;
  },
});
