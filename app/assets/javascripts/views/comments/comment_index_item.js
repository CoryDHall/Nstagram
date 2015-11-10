Nstagram.Views.CommentsIndexItem = Backbone.CompositeView.extend({
  tagName: 'p',
  template: JST['comments/index_item'],
  className: "",
  initialize: function (options) {
    this._setAttributes({
      class: options.class || "comment"
    });
    delete options.class;
    this.model = options.model || new Nstagram.Models.Comment(options);
  },
  render: function () {
    var content = this.template({
      comment: this.model
    });
    this.$el.html(content);
    this.goLive();

    return this;
  },
  goLive: function () {
    var text = this.$('span').text();
    text = text.replace(/(#)(\w+)/g,function (match, marker, hashtag) {
      return ["<a href=\"#search/p/",
        hashtag,
        "\" class=\"hashtag\">",
        match,
        "</a>"
      ].join('');
    });
    text = text.replace(/(@)([\w_\-]+)/g,function (match, marker, username) {
      return ["<a href=\"#users/",
        username,
        "\" class=\"mention\">",
        match,
        "</a>"
      ].join('');
    });
    this.$('span').html(text);
  }

});
