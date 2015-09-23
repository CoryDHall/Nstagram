Nstagram.Models.Like = Backbone.Model.extend({
  initialize: function (options) {
    this.url = "api/like/" + options.photo.id;
  },

  idAttribute: "photo_id",

});
