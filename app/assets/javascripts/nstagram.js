window.Nstagram = {
  Models: {},
  Collections: {},
  Views: {},
  Routers: {},
  initialize: function() {
    this.router = new Nstagram.Routers.Router({
      rootEl: "nstagram-content > div.temp"
    });

    Backbone.history.start();
  }
};

$(document).ready(function(){
  Nstagram.initialize();
});
