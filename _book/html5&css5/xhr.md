```js
const controller = new AbortController();
const { signal } = controller;
fetch('/foo', { signal }).then(...);
signal.onabort = () => { ... };
controller.abort();



```

Fetch API 也能像 XHR 那样中断一个请求了，只是稍微绕了一点。通过创建一个 AbortController 实例，我们得到了一个 Fetch API 原生支持的控制中断的控制器。这个实例的 signal 参数是一个 AbortSignal 实例，还提供了一个 abort() 方法发送中断信号。只需要将 signal 参数传递进 fetch() 的初始化参数中，就可以在 fetch 请求之外控制请求的中断了：


过去 FileReader 只能在 onload 事件上拿到整个文件的数据，或者对文件使用 slice() 方法得到 Blob 文件片段。

