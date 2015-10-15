(function () {
  var PFilter = Nstagram.PhotoFilter = function (options) {
    this.algorithm = options.algorithm;
    this.overlays = options.overlays;
    this.border = options.border;
  };

  PFilter.prototype.applyFilter = function (imageData) {
    var dArr = imageData.data;
    var result = new Uint8ClampedArray(dArr);
    var buffer = new Uint8ClampedArray(4);

    for (var i = 0; i < dArr.length / 4; i++) {
      buffer.set(this.algorithm(i * 4, dArr));
      result.set(buffer, i * 4);
    }

    return new ImageData(result, imageData.width, imageData.height);
  };

  var sqrt = Math.sqrt;

  PFilter.makeLinearCurve = function (m, b, len) {
    m = m === 0 || m ? m : 1;
    b = b || 0;
    len = len || 256;
    var linearCurve = new Float64Array(len);
    for (var i = 0; i < len; i++) {
      linearCurve[i] = (len / 2) + m * (i - len / 2) + b;
    }
    return linearCurve;
  };

  PFilter.makeQuadraticCurve = function (a, b, c, len) { // y = ax^2 + bx + c
    len = len || 256;
    a = a === 0 || a ? a : 1;
    b = b || 0;
    c = c === 0 || c ? c : -(len / 2);
    var curve = this.makeLinearCurve(b, c, len);
    for (var i = 0; i < len; i++) {
      curve[i] += i * a * (i / (len - 1)) * (i / (len - 1));
    }
    return curve;
  };

  Nstagram.Filters = Nstagram.Filters || {};

  var hardCurve = PFilter.makeLinearCurve(4 / 3);
  var softCurve = PFilter.makeLinearCurve();
  softCurve.set(PFilter.makeQuadraticCurve(1, 0, null, 128), 0);
  softCurve.set(PFilter.makeQuadraticCurve(-1, 2, 192, 128), 128);

  Nstagram.Filters.Carl =  new PFilter({
    algorithm: function (idx, dataArr) {
      var r = dataArr[idx],
          g = dataArr[idx + 1],
          b = dataArr[idx + 2],
          a = dataArr[idx + 3];
      r = softCurve[r];
      g = (14 * g + softCurve[g]) / 16 + 16;
      b = (3 * b + softCurve[b]) / 4;
      return [r, g, b, a];
    },
  });

  Nstagram.Filters.Conz =  new PFilter({
    algorithm: function (idx, dataArr) {
      var r = dataArr[idx],
          g = dataArr[idx + 1],
          b = dataArr[idx + 2],
          a = dataArr[idx + 3];
      r = (r + softCurve[r] + 255) / 3;
      g = (255 + softCurve[g] + hardCurve[g]) / 3;
      b = (b + 255 + hardCurve[b]) / 3;
      return [r, g, b, a];
    },
  });

  Nstagram.Filters.Ruben =  new PFilter({
    algorithm: function (idx, dataArr) {
      var r = dataArr[idx],
          g = dataArr[idx + 1],
          b = dataArr[idx + 2],
          a = dataArr[idx + 3];

      r = g = b = (r + softCurve[r] + softCurve[g] + softCurve[b]) / 4;
      return [r, g, b, a];
    },
  });

  Nstagram.Filters.Lily =  new PFilter({
    algorithm: function (idx, dataArr) {
      var r = dataArr[idx],
          g = dataArr[idx + 1],
          b = dataArr[idx + 2],
          a = dataArr[idx + 3];
      rN = (4 * r + hardCurve[255 - g] + softCurve[255 - b]) / 6;
      gN = (10 * g + hardCurve[255 - b] + softCurve[255 - r]) / 12;
      bN = (8 * b + hardCurve[255 - r] + softCurve[255 - g] + 2 * softCurve[r]) / 12;
      return [rN, gN, bN, a];
    },
  });

  Nstagram.Filters.Tommy =  new PFilter({
    algorithm: function (idx, dataArr) {
      var r = dataArr[idx],
          g = dataArr[idx + 1],
          b = dataArr[idx + 2],
          a = dataArr[idx + 3];
      r = (sqrt(r * (softCurve[g] + (b + r) / 2) / 2) + r * 2 + 255) / 4;
      b = (sqrt(b * (softCurve[g] + r) / 2) + 7 * b + 255) / 4;
      return [r, g, b, a];
    },
  });

  Nstagram.Filters.Jonathan =  new PFilter({
    algorithm: function (idx, dataArr) {
      var r = dataArr[idx],
          g = dataArr[idx + 1],
          b = dataArr[idx + 2],
          a = dataArr[idx + 3];

      r = g = b = (r + softCurve[255 - r] + softCurve[255 - g] + softCurve[255 - b]) / 4;
      return [r, g, b, a];
    },
  });

  Nstagram.Filters.Sennacy =  new PFilter({
    algorithm: function (idx, dataArr) {
      var r = dataArr[idx],
          g = dataArr[idx + 1],
          b = dataArr[idx + 2],
          a = dataArr[idx + 3];

      r = ((1 - (idx / dataArr.length) * 0.875) * (r + 255) / 2 + r) / 2;
      g = ((1 - (idx / dataArr.length) * 0.875) * (g + 192) / 2 + g) / 2;
      b = ((1 - (idx / dataArr.length) * 0.875) * (b + 128) / 2 + b) / 2;
      return [r, g, b, a];
    },
  });

  Nstagram.Filters._3D =  new PFilter({
    algorithm: function (idx, dataArr) {
      var r = dataArr[idx],
          g = dataArr[idx + 1],
          b = dataArr[idx + 2],
          a = dataArr[idx + 3];
      var offset;
      for (var i = -4; i < 4; i++) {
        offset = idx + 4 * i;
        offset *= offset >= 0;
        offset = offset >= dataArr.length ? dataArr.length : offset;
        r = (r + softCurve[dataArr[offset]]) / 2;
      }
      return [r, g, b, a];
    },
  });

})();
