Backbone.Router.prototype._swapView = function (newView, callback) {
  newView.hide(function () {
  this._currentView = newView;

  this.$rootEl = this.$rootEl || $('<div>').appendTo($('body'));
  this.$rootEl.empty().append(newView.$el);
    newView.render().show(callback, 200);
  }.bind(this), 200);
};
