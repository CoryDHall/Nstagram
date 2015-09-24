(function () {

  var FlErr = Nstagram.FlashErrors = {};

  FlErr.Error = Backbone.Model.extend({
  });

  FlErr.Errors = Backbone.Collection.extend({
    url: '/api/errors',
    model: FlErr.Error,
  });

  FlErr.update = function () {
    var newErrors = new FlErr.Errors();
    newErrors.fetch({
      success: function () {
      var newErrorView = new FlErr.View({
        collection: newErrors
      });

      Backbone.Router.prototype._swapView.call(FlErr, newErrorView);
      }
    });
  };

  FlErr.clear = function () {
    // this may be unnecessary
  };

  FlErr.setEl = function ($el) {
    this.$rootEl = $el;
  };

})();
