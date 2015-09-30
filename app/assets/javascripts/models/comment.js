Nstagram.Models.Comment = Backbone.Model.extend({
  initialize: function (options) {
    this.urlRoot = '/api/comments/' + options["photo_id"];
  }
});
