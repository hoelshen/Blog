# 取消 promise

## 借助于 Promise.race() 方法，可以很容易地取消一个 Promise。

```javascript
function cancelablePromise(promise) {
  let hasCanceled = false;

  const wrappedPromise = new Promise((resolve, reject) => {
    promise.then(
      (val) => (hasCanceled ? reject({ isCanceled: true }) : resolve(val)),
      (error) => (hasCanceled ? reject({ isCanceled: true }) : reject(error))
    );
  });

  return {
    promise: wrappedPromise,
    cancel() {
      hasCanceled = true;
    },
  };
}

const cancelable = cancelablePromise(fetch("http://www.example.com"));

cancelable.promise.then(
  (val) => console.log("request succeeded", val),
  (error) => console.log("request failed", error)
);

// 取消请求
cancelable.cancel();
```

```javascript
//传入一个正在执行的promise
function getPromiseWithAbort(p) {
  let obj = {};
  //内部定一个新的promise，用来终止执行
  let p1 = new Promise(function (resolve, reject) {
    obj.abort = reject;
  });
  obj.promise = Promise.race([p, p1]);
  return obj;
}

var promise = new Promise((resolve) => {
  setTimeout(() => {
    resolve("123");
  }, 3000);
});

var obj = getPromiseWithAbort(promise);

obj.promise.then((res) => {
  console.log(res);
});

//如果要取消
obj.abort("取消执行");
```
