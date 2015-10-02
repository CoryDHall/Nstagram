Nstagram.Views.PhotoNew = Backbone.View.extend({
  tagName: 'form',
  template: JST['photos/photo_form'],
  id: 'photo-form',

  events: {
    "click #photo-upload": "pickPhoto",
    "change #photo-input": "showPhoto",
    "submit": "submit",
    "resize window": "resize"
  },

  initialize: function (options) {
    this.userSession = options.userSession;
    $(window).resize(this.resize.bind(this));
  },

  resize: function (e) {
    var $canvas = this.$('canvas');
    var availableHeight = this.$el.parent().height() - this.$('button').height() - this.$('.form-caption').height();
    var availableWidth = this.$el.parent().width();
    if (availableWidth > availableHeight) {
      var newDim = Math.max(availableHeight, 100);
      $canvas.width(newDim);
      $canvas.height(newDim);
    } else {
      $canvas.width(availableWidth);
      $canvas.height(availableWidth);
    }
  },

  render: function () {
    this.$el.html(this.template());
    Nstagram.FlashErrors.newErrors.add({
      reference: "Upload",
      status: "notice",
      time: "now",
      message: "a photo by clicking in the black square"
    })
    this.resize();
    var ctx = this.$('canvas')[0].getContext("2d");
    ctx.fillStyle = "#000";
    ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height);
    return this;
  },

  showPhoto: function (e) {
    var photo = this.photo = e.currentTarget.files[0];
    $(e.currentTarget).prop("disabled", true);
    this.$('.empty').removeClass("empty");
    var reader = new FileReader();
    var view = this;

    reader.addEventListener('load', function () {
      var img = this.img = new Image();
      img.src = reader.result;
      if (img.naturalWidth * img.naturalHeight === 0) {
        reader.readAsDataURL(photo);
        return;
      }
      this.$('.form-caption').prop("disabled", false).focus();

      var canvas = view.$('#photo-upload')[0];

      var ctx = canvas.getContext("2d");
      var aRatio = (img.naturalWidth / img.naturalHeight);
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      var dW = aRatio > 1 ? canvas.width : canvas.width * aRatio;
      var dH = aRatio > 1 ? canvas.height / aRatio : canvas.height;
      var oX = (canvas.width - dW) / 2;
      var oY = (canvas.height - dH) / 2;
      ctx.drawImage(img, oX, oY, dW, dH);

      view.$('button').prop("disabled", false);
      view.resize();
    }.bind(this));
    if (photo) {
      reader.readAsDataURL(photo);
    }
  },

  pickPhoto: function (e) {
    if (!$(e.target).is($('#photo-input'))) {
      e.preventDefault();
    }
    this.$("#photo-input").click();
  },

  submit: function (e) {
    e.preventDefault();
    this.$('button').removeClass('fresh');
    this.resize();

    var formData = new FormData(this.el);
    formData.append('photo[photo]', this.photo);

    this.userSession.fetch({
      success: function (session) {
        this.photo = new Nstagram.Models.Photo({user: session.user});
        // this.photo.parse();
        this.photo.saveFormData(formData, {
          success: function (newPhoto) {
            if (newPhoto.escape('errors').length > 0) {
              return;
            }
            Backbone.history.navigate('', {
              trigger: true
            });
          }
        });
      }.bind(this)
    });
  }
});
