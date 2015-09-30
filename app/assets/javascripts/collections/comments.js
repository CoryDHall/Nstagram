Nstagram.Collections.Comments = Backbone.Collection.extend({

  model: Nstagram.Models.Comment,
  initialize: function (options) {
    this.url = '/api/comments/' + options["photo_id"];
  }

});
