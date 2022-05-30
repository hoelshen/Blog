function debounce(fn, wait) {
  var timer = null;
  return function () {
    clearTimeId(timer);
    timer = setTimeout(function () {
      fn.apply(this, arguments);
    }, wait);
  };
}
