window.Nstagram = {
  Models: {},
  Collections: {},
  Views: {},
  Routers: {},
  initialize: function() {
    this.router = new Nstagram.Routers.Router({
      rootEl: "nstagram-content",
      footEl: "nstagram-menu",
      headEl: "nstagram-header",
      flashEl: "nstagram-flash"
    });

    Backbone.history.start();
  }
};
