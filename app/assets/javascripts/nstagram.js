window.Nstagram = {
  Models: {},
  Collections: {},
  Views: {},
  Routers: {},
  initialize: function() {
    this.router = new Nstagram.Routers.Router({
      rootEl: "nstagram-content"
    });

    Backbone.history.start();
  }
};
