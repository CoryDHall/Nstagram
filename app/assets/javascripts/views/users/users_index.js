Nstagram.Views.UsersIndex = Backbone.CompositeView.extend({
  tagName: 'users-index',
  template: JST['users/index'],

  initialize: function () {
    this.listenTo(this.collection, "reset", this.render);
  },

  events: {
    'click button.logout': 'logout'
  },

  render: function () {
    var content = this.template({
      users: this.collection
    });
    this.$el.html(content);

    return this;
  },

  logout: function (e) {
    // $.ajax({
    //   url: "/user_session",
    //   method: "DELETE",
    //   dataType: "html",
    //   complete: function () {
        // $('nstagram-content').attr("data-logged-in", false);
        // Backbone.history.navigate('', {
        //   trigger: true
        // });
    //   }
    // });
  }

});
