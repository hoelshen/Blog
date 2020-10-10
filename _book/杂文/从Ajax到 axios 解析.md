# 从 ajax 到 axios


## XMLHttpRequest 对象

```js
const xhr = new XMLHttpRequest();

xhr.onreadystatechange = function () {
  if (xhr.readyState === 4 && xhr.status === 200) {
  }
};

const url = "http://www.baidu.com/";
xhr.open("post", url, true);  //初始化
const body = {
  data: {
    a: 1
  }
};

xhr.send(body);

xhr.onload = function () {
  // 请求结束后, 在此处写处理代码
  console.log('请求成功', xhr.responseText)
};

// 当网络不佳时，我们需要给请求设置一个超时时间

// 超时时间单位为毫秒
xhr.timeout = 1000

// 当请求超时时，会触发 ontimeout 方法
xhr.ontimeout = () => console.log('请求超时')
```

* xhr.readyStatus==0 尚未调用 open 方法
* xhr.readyStatus==1 已调用 open 但还未发送请求（未调用 send）
* xhr.readyStatus==2 已发送请求（已调用 send）
* xhr.readyStatus==3 已接收到请求返回的数据
* xhr.readyStatus==4 请求已完成

## ajax

```js
function ajax(options) {
  let url = options.url;
  const method = options.method.toLocaleLowerCase() || "get";
  const async = options.async == true; // default is true
  const data = options.data;
  const xhr = new XMLHttpRequest();

  if (options.timeout && options.timeout > 0) {
    xhr.timeout = options.timeout;
  }

  return new Promise((resolve, reject) => {
    xhr.ontimeout = () => reject && reject("请求超时");
    xhr.onreadystatechange = () => {
      if (xhr.readyState == 4) {
        if ((xhr.status >= 200 && xhr.status < 300) || xhr.status == 304) {
          resolve && resolve(xhr.responseText);
        } else {
          reject && reject();
        }
      }
    };
    xhr.onerror = (err) => reject && reject(err);

    let paramArr = [];
    let encodeData;
    if (data instanceof Object) {
      for (let key in data) {
        // 参数拼接需要通过 encodeURIComponent 进行编码
        paramArr.push(
          encodeURIComponent(key) + "=" + encodeURIComponent(data[key])
        );
      }
      encodeData = paramArr.join("&");
    }

    if (method === "get") {
      // 检测 url 中是否已存在 ? 及其位置
      const index = url.indexOf("?");
      if (index === -1) url += "?";
      else if (index !== url.length - 1) url += "&";
      // 拼接 url
      url += encodeData;
    }

    xhr.open(method, url, async);
    if (method === "get") xhr.send(null);
    else {
      // post 方式需要设置请求头
      xhr.setRequestHeader(
        "Content-Type",
        "application/x-www-form-urlencoded;charset=UTF-8"
      );
      xhr.send(encodeData);
    }
  });
}
```

## fetch

```js
// 原生XHR
var xhr = new XMLHttpRequest();
xhr.open('GET', url);
xhr.onreadystatechange = function() {
    if (xhr.readyState === 4 && xhr.status === 200) {
        console.log(xhr.responseText)   // 从服务器获取数据
    }
}
xhr.send()
// fetch
fetch(url)
    .then(response => {
        if (response.ok) {
            return response.json();
        }
    })
    .then(data => console.log(data))
    .catch(err => console.log(err))

```

## axios

  我们可以为 axios 处理一下错误

```js
axios.get('/user/12345')
  .catch(function (error) {
    if (error.response) {
      // 请求已发出，但服务器响应的状态码不在 2xx 范围内
      console.log(error.response.data);
      console.log(error.response.status);
      console.log(error.response.headers);
    } else {
      // Something happened in setting up the request that triggered an Error
      console.log('Error', error.message);
    }
    console.log(error.config);
  });
```













