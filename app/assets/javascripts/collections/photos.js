Nstagram.Collections.Photos = Backbone.Collection.extend({

  model: Nstagram.Models.Photo,
  initialize: function (options) {
    this.url = "api/users/:" + options["username"] + "/photos";
    this.style = options.style || 'thumb'
  },
  fetch: function (options) {
    options = options || {};
    options.data = options.data || {};
    options.data["style"] = this.style;
    options.beforeSend = function (xhr, settings) {
      settings.xhr = function () {
        var xhr = $.ajaxSettings.xhr();

        xhr.upload.addEventListener("progress", function (e) {
        }, false);

        xhr.upload.onload = function () {
        };

        xhr.addEventListener("progress", function (e) {
        }, false);

        xhr.onload = function () {
        };

        return xhr;
      };
    };
    return Backbone.Collection.prototype.fetch.call(this, options);
  }

});
