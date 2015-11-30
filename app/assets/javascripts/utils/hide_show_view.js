(function () {
  Backbone.View.prototype.hide = function (callback, time) {
    this.$el.addClass("hidden-view");
    time = time || 0;
    callback && setTimeout(callback, time);
    return this;
  }
  Backbone.View.prototype.show = function (callback, time) {
    this.$el.removeClass("hidden-view");
    time = time || 0;
    callback && setTimeout(callback, time);
    return this;
  }
})();
