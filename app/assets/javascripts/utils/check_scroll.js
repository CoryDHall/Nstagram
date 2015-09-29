Backbone.View.prototype.checkScroll = function (e, callback) {
  var $container = $(e.currentTarget);
  var ctx = $container.context;
  var sH = ctx.scrollHeight,
      cH = ctx.clientHeight,
      sT = ctx.scrollTop,
      $load_el = this.$('load-more');
  this.status = this.status || { running: false };
  if (callback && ((sT + cH) / sH) > (2 / 3) && !this.status.running) {
    this.status.running = true;
    setTimeout(function () {
      this.status.running = false;
    }.bind(this), 600);
    return callback($load_el);
  }
};
