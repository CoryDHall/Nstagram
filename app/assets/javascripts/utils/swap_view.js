Backbone.Router.prototype._swapView = function (newView) {
  this._currentView && this._currentView.remove();
  this._currentView = newView;

  this.$rootEl = this.$rootEl || $('<div>').appendTo($('body'));
  this.$rootEl.html(newView.$el);
  newView.render();
};
