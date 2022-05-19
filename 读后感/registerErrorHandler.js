let handlerError = null;
export default {
  foo(fn) {
    callWithErrorHandling(fn);
  },
  //用户可以调用这个方法来注册一个错误处理函数
  registerErrorHandler(handler) {
    handlerError = handler;
  },
};
function callWithErrorHandling(fn, ...args) {
  // 如果用户没有注册错误处理函数，则直接调用
  if (!handlerError) {
    return fn(...args);
  }
  try {
    return fn && fn(...args);
  } catch (e) {
    handlerError(e);
  }
}
