Nstagram.Views.PhotoNew = Backbone.CompositeView.extend({
  tagName: 'form',
  template: JST['photos/photo_form'],
  id: 'photo-form',

  events: {
    "click #photo-upload": "pickPhoto",
    "click .filter-select h6": "toggleFilters",
    "click li.filter-item a": "chooseFilter",
    "change #photo-input": "showPhoto",
    "submit": "submit",
    "resize window": "resize"
  },

  initialize: function (options) {
    this.userSession = options.userSession;
    $(window).resize(this.resize.bind(this));
    this.aRatio = 1;
  },

  toggleFilters: function (e) {
    if (this.$('.filter-select.disabled').length == 1) {
      return;
    } else if (this.$('.filter-select.closed').length == 1) {
      TweenMax.to(this.$('.filter-select.closed'), 0.125, { css: { className: "-=closed" } });
      return
    }
    TweenMax.to(this.$('.filter-select'), 0.5, { css: { className: "+=closed" } });
  },

  chooseFilter: function (e) {
    var $sel = $(e.currentTarget).parent();
    TweenMax.to(this.$('.filter-item.selected'), 0.4, { css: { className: "-=selected" } });
    this.changeFilter(Nstagram.Filters[$sel.attr("data-filter")]);
    this.canvasToFile();
    TweenMax.to($sel, 0.2, { css: { className: "+=selected" } });
  },

  resize: function (e) {
    var $canvas = this.$('canvas');
    var availableHeight = this.$el.parent().height() - this.$('button').height() - this.$('.form-caption').height();
    var availableWidth = this.$el.parent().width();
    var avRatio = availableWidth / availableHeight;
    if (availableWidth / this.aRatio <= availableHeight) {
      $canvas.width(availableWidth);
      $canvas.height(availableWidth / this.aRatio);
    } else {
      $canvas.width(availableHeight * this.aRatio);
      $canvas.height(availableHeight);
    }
  },

  render: function () {
    this.$el.html(this.template());
    Nstagram.FlashErrors.newErrors.add({
      reference: "Upload",
      status: "notice",
      time: "now",
      message: "Upload a photo by clicking in the black square",
      length: 5
    });
    this.resize();
    var ctx = this.$('canvas')[0].getContext("2d");
    ctx.fillStyle = "#000";
    ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height);
    return this;
  },

  showPhoto: function (e) {
    var photo = this.photoFile = e.currentTarget.files[0];
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
      canvas.width = img.naturalWidth;
      canvas.height = img.naturalHeight;
      var ctx = canvas.getContext("2d");
      var aRatio = this.aRatio = (img.naturalWidth / img.naturalHeight);
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      var $canvas = this.$('canvas');

      ctx.drawImage(img, 0, 0);

      view.canvasToFile();

      view.$('button').prop("disabled", false);
      view.resize();
    }.bind(this));
    if (photo) {
      reader.readAsDataURL(photo);
    }
  },

  canvasToFile: function () {
    var canvas = this.$('#photo-upload')[0];
    var photoUri = canvas.toDataURL("image/jpeg", 1.0);
    var bytes = atob(photoUri.split(',')[1]);
    var arr = new Uint8Array(bytes.length);
    for (var i = 0; i < bytes.length; i++) {
      arr[i] = bytes.charCodeAt(i);
    }

    this.photoFile = new Blob([arr], { type: "image/jpeg" });
  },

  changeFilter: function (filter) {
    var canvas = this.$('#photo-upload')[0];
    var ctx = canvas.getContext("2d");
    if (filter) {
      this.changeFilter();
      var nd = filter.applyFilter(ctx.getImageData(0, 0, canvas.width, canvas.height));
      ctx.putImageData(nd, 0, 0);
    } else {
      ctx.drawImage(this.img, 0, 0);
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
    formData.append('photo[photo]', this.photoFile, "photo" + Math.random() + ".jpeg");

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
