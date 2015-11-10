Backbone.Router.prototype._swapView = function (newView) {
  this._currentView && this._currentView.remove();
  this._currentView = newView;

  this.$rootEl = this.$rootEl || $('<div>').appendTo($('body'));
  this.$rootEl.empty().append(newView.$el);
  newView.render();
};
