(function () {
  Backbone.history.toRoot = function () {
    Backbone.history.navigate('', {
      trigger: true,
      replace: true
    });
  };
})();
