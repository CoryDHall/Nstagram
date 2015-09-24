(function () {

  var FlErr = Nstagram.FlashErrors = {};

  FlErr.Error = Backbone.Model.extend({
  });

  FlErr.Errors = Backbone.Collection.extend({
    url: '/api/errors',
    model: FlErr.Error,
  });

  FlErr.update = function () {
    this.newErrors.fetch();
  };

  FlErr.clear = function () {
    // this may be unnecessary
  };

  FlErr.setEl = function ($el) {
    this.$rootEl = $el;
    this.newErrors = new FlErr.Errors();
    this.errorView = new FlErr.View({
      collection: this.newErrors
    });

    Backbone.Router.prototype._swapView.call(this, this.errorView)
  };

  FlErr.listen = function () {
    $(document).ajaxComplete(function (e, xHr, options) {
      if (options["url"] !== FlErr.Errors.prototype.url) {
        FlErr.update();
      }
    });
  };

})();
