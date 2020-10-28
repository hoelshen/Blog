# 从 ajax 到 axios

## XMLHttpRequest 对象

``` js
const xhr = new XMLHttpRequest();

xhr.onreadystatechange = function() {
    if (xhr.readyState === 4 && xhr.status === 200) {}
};

const url = "http://www.baidu.com/";
xhr.open("post", url, true); //初始化
const body = {
    data: {
        a: 1
    }
};

xhr.send(body);

xhr.onload = function() {
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




XMLHttpRequest.responseType 属性是一个枚举属性, 返回响应式数据的类型.

responseType 支持以下几种值:
* "" 
    responseType 为空字符串时，采用默认类型 DOMString，与设置为 text 相同。
* arraybuffer
    response 是一个包含二进制数据的 JavaScript arrayBuffer
* blob
    response 是一个包含二进制数据的 blob 对象
* document
    response是一个 html document 或 xmldocument, 这取决于接收到的数据的 mime 类型.
* json
    response 是一个 JavaScript 对象。这个对象是通过将接收到的数据类型视为 JSON 解析得到的     
* text
    response 是一个以 DOMString 对象表示的文本。
## ajax

``` js
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

``` js
// 原生XHR
var xhr = new XMLHttpRequest();
xhr.open('GET', url);
xhr.onreadystatechange = function() {
    if (xhr.readyState === 4 && xhr.status === 200) {
        console.log(xhr.responseText) // 从服务器获取数据
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
![](https://tva1.sinaimg.cn/large/0081Kckwgy1gk4tak223cj30gm0gw0tf.jpg)
  我们可以为 axios 处理一下错误

``` js
axios.get('/user/12345')
    .catch(function(error) {
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

取消选择

``` js
// 创建取消令牌的生成器对象
var CancelToken = axios.CancelToken;
// 从中获取令牌对象
var source = CancelToken.source();

// 发请求
axios.get('/user/12345', {
    // 传递令牌
    cancelToken: source.token
}).catch(function(thrown) {
    if (axios.isCancel(thrown)) {
        console.log('Request canceled', thrown.message);
    } else {
        // 处理错误
    }
});

// 取消请求（message 参数是可选的）
source.cancel('Operation canceled by the user.');
```

封装完成的取消请求

``` js
    import axios from 'axios';

    axios.defaults.timeout = 5000;
    axios.defaults.baseURL = '';

    let pending = []; //声明一个数组用于存储每个ajax请求的取消函数和ajax标识
    let cancelToken = axios.CancelToken;
    let removePending = (ever) => {
        for (let p in pending) {
            if (pending[p].u === ever.url + '&' + ever.method) { //当当前请求在数组中存在时执行函数体
                pending[p].f(); //执行取消操作
                pending.splice(p, 1); //把这条记录从数组中移除
            }
        }
    }

    //http request 拦截器
    axios.interceptors.request.use(
        config => {
            config.data = JSON.stringify(config.data);
            config.headers = {
                'Content-Type': 'application/x-www-form-urlencoded'
            }
            // ------------------------------------------------------------------------------------
            removePending(config); //在一个ajax发送前执行一下取消操作
            config.cancelToken = new cancelToken((c) => {
                // 这里的ajax标识我是用请求地址&请求方式拼接的字符串，当然你可以选择其他的一些方式
                pending.push({
                    u: config.url + '&' + config.method,
                    f: c
                });
            });
            // -----------------------------------------------------------------------------------------
            return config;
        },
        error => {
            return Promise.reject(err);
        }
    );
    //http response 拦截器
    axios.interceptors.response.use(
        response => {
            // ------------------------------------------------------------------------------------------
            removePending(res.config); //在一个ajax响应后再执行一下取消操作，把已经完成的请求从pending中移除
            // -------------------------------------------------------------------------------------------
            if (response.data.errCode == 2) {
                router.push({
                    path: "/login",
                    query: {
                        redirect: router.currentRoute.fullPath
                    } //从哪个页面跳转
                })
            }
            return response;
        },
        error => {
            return Promise.reject(error)
        }
    )
```

// 自己实现一个简略版的

``` js
	// 创建Promise，返回放行开关cancel
	function source() {
	    var cancel;
	    var promise = new Promise(function(resolve) {
	        cancel = resolve;
	    });
	    return {
	        cancel: cancel,
	        token: promise
	    }
	}
	// 发请求
	function axios_get(config) {
	    if (config.cancelToken) {
	        config.cancelToken.then(function() {
	            xhr.abort();
	        })
	    }


      // 最终发请求
      xhr.request();
	}

	// 代码执行
	var source = source();

	axios_get({
	    cancelToken: source.token
	});

	setTimeout(function() {
	    source.cancel(); // 5秒之后执行下一步操作
	}, 5000)
```

demo

```js
    <button @click="getMsg" class="get-msg">获取数据</button>
    getMsg() {
      let CancelToken = axios.CancelToken;
      let self = this;  
      axios
        .get("http://www.zhangxinxu.com/study/201802/cros-ajax.php", {
          cancelToken: new CancelToken(function executor(c) {
            self.cancel = c;
            console.log(c);
            // 这个参数 c 就是CancelToken构造函数里面自带的取消请求的函数，这里把该函数当参数用
          }),
        })
        .then((res) => {
          this.items = res.data;
        })
        .catch((err) => {
          console.log(err);
        });

      //手速够快就不用写这个定时器了，点击取消获取就可以看到效果了
      setTimeout(function () {
        //只要我们去调用了这个cancel()方法，没有完成请求的接口便会停止请求
        self.cancel();
      }, 100);
    }


```