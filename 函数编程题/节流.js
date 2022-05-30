function throttle(fn, wait) {
  var lastTime = 0;
  return function () {
    var currentTime = +new Date();
    if (currentTime > lastTime + wait) {
      lastTime = currentTime;
      fn.apply(this, arguments);
    }
  };
}
