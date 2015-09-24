Backbone.View.prototype.checkScroll = function (e, callback) {
  var $container = $(e.currentTarget);
  var ctx = $container.context;
  var sH = ctx.scrollHeight,
      cH = ctx.clientHeight,
      sT = ctx.scrollTop,
      $load_el = this.$('load-more');
  if (callback && ((sT + cH) / sH) > (2 / 3)) {
    return callback($load_el);
  }
};
