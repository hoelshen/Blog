# webpack 热更新 HMR(Hot Module Replacement)

热更新：文件改动后，以最小的代价改变被改变的区域。尽可能保留改动文件前的状态（修改 js 代码之后可以把页面输入的部分信息保留下来）

## 热更新的原理

1. 使用 webpack-dev-server （后面简称 WDS）托管静态资源，同时以 Runtime 方式注入一段处理 HMR 逻辑的客户端代码；
2. 浏览器加载页面后，与 WDS 建立 WebSocket 连接；
3. Webpack 监听到文件变化后，增量构建发生变更的模块，并通过 WebSocket 发送 hash 事件；
4. 浏览器接收到 hash 事件后，请求 manifest 资源文件，确认增量变更范围；
5. 浏览器加载发生变更的增量模块；
6. Webpack 运行时触发变更模块的 module.hot.accept 回调，执行代码变更逻辑；
   done。

## 热更新使用

```js
devServer: {
        contentBase: './dist',
        port: '7008',
        inline: true,
        host: '0.0.0.0',
        disableHostCheck: true,//不使用白名单的原因是多人开发，每个人都需要绑定Host不方便，因此关闭Host检查
        hot: true,  //开启热更新
},
plugins: [
        new MiniCssExtractPlugin({
            filename: "css/[name].css",
        }),
        new HtmlWebpackPlugin({
            title: 'Output Management'
        }),
        new webpack.HotModuleReplacementPlugin() //开启热更新
],
// 在webpack 入口js底部加上以下代码
if (module.hot) {
    module.hot.accept();
}

before: (app) => {
  app.use('*', (req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Methods", "POST,GET");
    res.header("Access-Control-Allow-Headers", "Origin,Accept,Content-Type,Content-Length, Authorization, Accept,X-Requested-With");
    next();
  });
}



```

热更新代码用到的

```js
function reloadApp() {
  if (isUnloading || !hotReload) {
    return;
  }
  if (_hot) {
    log.info('[WDS] App hot update...');
    var hotEmitter = require('webpack/hot/emitter');
    hotEmitter.emit('webpackHotUpdate', currentHash);
    if (typeof self !== 'undefined' && self.window) {
      self.postMessage('webpackHotUpdate' + currentHash, '*');
    }
  } else {
    ...//非重要代码省略
  }
}

```

## 热更新的优化方式

1. 减少热更新的文件范围

热更新的速度与需要更新的文件数量直接相关。通过减少不必要的文件更新，可以显著提升性能

优化方法：

    使用 module.hot.accept 精确指定需要热更新的模块。

    避免全局更新，只更新修改的模块。

```js
if (module.hot) {
  module.hot.accept("./myModule", () => {
    // 仅更新 myModule
    const newModule = require("./myModule");
    // 执行更新逻辑
  });
}
```

2. 优化 webpack 配置

通过调整 webpack 配置，可以减少构建时间和热更新的开销

优化方法：

    1. 减少文件监听范围

      使用 watchOptions.ignored 忽略不必要的文件。（如 node_modules）

    ```js
    module.exports = {
      watchOptions: {
        ignored: /node_modules/,
      },
    };
    ```

    2. 减少文件解析范围：

      使用 resolve.alias 配置，减少文件解析范围。

    ```js
    module.exports = {
      resolve: {
        alias: {
          "@": path.resolve(__dirname, "src"),
        },
      },
    };
    ```

    3. 减少文件打包范围

      使用 include 和 exclude 配置，减少 loader 处理的文件范围。

    ```js
    module.exports = {
      module: {
        rules: [
          {
            test: /\.js$/,
            include: path.resolve(__dirname, "src"),
            exclude: /node_modules/,
            use: "babel-loader",
          },
        ],
      },
    };
    ```

    4. 使用 HappyPack

      使用 HappyPack 将 loader 的执行转移到 worker 线程，提升构建速度。

    ```js
    const HappyPack = require("happypack");
    new HappyPack({
      id: "babel",
      loaders: ["babel-loader"],
    });
    ```

    5. 使用缓存

    启用持久化缓存（如 cache 配置），减少重复构建时间。

    ```js
    module.exports = {
      cache: {
        type: "filesystem",
      },
    };
    ```

    6. 减少 Source Map 开销：

      使用 cheap-source-map 替代 source-map，减少 Source Map 开销。

    ```js
    module.exports = {
      devtool: "cheap-source-map",
    };
    ```

3. 优化开发服务器

   禁用不必要的功能：
   如禁用压缩（compress: false）和静态文件服务（serveStatic: false）。

   ```js
   module.exports = {
     devServer: {
       compress: false,
       serveStatic: false,
     },
   };
   ```

   调整轮询间隔：
   如果使用文件系统轮询（如 Docker 环境），可以调整 watchOptions.poll 的间隔。

   ```js
   module.exports = {
     watchOptions: {
       poll: 1000,
     },
   };
   ```

4. 代码分割与懒加载

通过代码分割和懒加载，可以减少每次热更新时需要处理的代码量。

优化方法：

    使用动态 import() 实现懒加载。

    使用 SplitChunksPlugin 分割公共代码。

5. 减少依赖模块的数量

   项目依赖的模块越多，热更新的开销越大。通过减少不必要的依赖，可以提升性能。

   优化方法：
   移除未使用的依赖。

   使用 webpack-bundle-analyzer 分析依赖，优化打包体积。
