
// 先说下区别 防抖和节流
// 以及使用场景
function debounce(fn,timeout) {
  let timerId = null;

  return function () {
    clearTimeout(timerId)
     timerId = setTimeout(() => {
       fn.apply(this, arguments);
     }, timeout);
  }
}

// 你是一个没有耐心的，你只在固定时间内等待，过时就走
function throttle(fn, timeout) {
  let lastTime = 0;
  return function () {
    let currentTime = +new Date();
    if (currentTime > lastTime + timeout) {
      lastTime = currentTime;
      fn.apply(this, arguments)
    }
  };
}