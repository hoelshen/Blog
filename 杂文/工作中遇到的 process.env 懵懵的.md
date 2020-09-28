# 前文

## 遇到在 request 根据环境判断 baseurl

process对象是全局变量，它提供当前node.js的有关信息，以及控制当前node.js的有关进程。因为是全局变量，它对于node应用程序是始终可用的，无需require()。

process.env.NODE_ENV

NODE_ENV不是process.env对象上原有的属性，它是我们自己添加上去的一个环境变量，用来确定当前所处的开发阶段。

一般生产阶段设为production，开发阶段设为develop，然后在脚本中读取process.env.NODE_ENV。

这里有两个要注意的地方:
win

```bash
NODE_ENV=production node build.js
```

mac

```bash
set NODE_ENV=production node build.js
```

或者使用 cross-env 这个包 解决

```bash
cross-env NODE_ENV=production node build.js
```

但是我们不能再模块中使用,要想在模块中使用, 需要一些配置

DefinePlugin

```js
const webpack = require('webpack');

module.exports = {
    entry: {
        app: './src/app'
    },
    output: {
        path: 'dist',
        filename: 'bundle.js'
    },
    plugins: [
        new webpack.DefinePlugin({
           'process.env.NODE_ENV':  JSON.stringify(process.env.NODE_ENV)
        })
    ]
};

```

然后这样使用
let url = '';
 if (process.env.NODE_ENV === 'testing') {
   url = 'http://my.test.cn';
 } else if (process.env.alpord === 'alpord') {
   url = 'http://my.alpord.cn';
 } else if (process.env.NODE_ENV === 'production') {
   url = 'http://my.product.cn';
 } else {
   url = 'http://my.develop.cn';
 }

如果不用DefinePlugin可以把环境变量放到原型上

import config from '.src/abs'
Vue.prototype.GLOBAL = config