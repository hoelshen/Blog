// bind() 方法会创建一个新函数。当这个新函数被调用时，bind() 的第一个参数将作为它运行时的 this，之后的一序列参数将会在传递的实参前传入作为它的参数。(来自于 MDN )


Function.prototype.bind = function (context) {
  let that = this;
  let bindArgs = Array.prototype.slice.call(argument, 1);
  function Fn() {}

  function fBound(params) {
    let args = Array.prototype.slice.call(arguments);

    return that.apply(
      this instanceof fBound ? this : context,
      bindArgs.concat(args)
    );
  }

  if (this.prototype) {
    Fn.prototype = this.prototype;
  }

  fBound.prototype = new Fn();

  return fBound;
};