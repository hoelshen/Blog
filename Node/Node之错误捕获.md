# 错误捕获与内存告警

- 平台兼容性问题

- 内存泄露

对内存进行"检查"

安装

```js
npm install heapdump -S
```

使用

```js
var heapdump = require("heapdump");
let startMem = process.memoryUsage();

function calc(data) {
  return Math.round((data / 1024 / 1024) * 10000) / 10000 + " MB";
}
// 使用的是 koa
router.all("/foo", async (ctx, next) => {
  let mem = process.memoryUsage();
  logger.debug(
    "memory before",
    calc(startMem.rss),
    "memory now:",
    calc(mem.rss),
    "diff increase",
    calc(mem.rss - startMem.rss)
  );
  // ...
});
```

## 进程处理

如果在退出之前需要做一些后续的处理，那么可以将 process.exit()放在其它回调函数内调用。

```js
process.on("SIGINT", function () {
  console.log("Exit now!");
  port.write("ddd", function () {
    process.exit();
  });
});
```

## 内存泄露检测

我们通过安装 memwatch 能够方便发现内存泄漏，首先安装这个模块：

npm install --save memwatch

在我们的代码中加入：

var memwatch = require('memwatch');
memwatch.setup();

加入发现泄漏的事件：

memwatch.on('leak', function(info) {
console.error('Memory leak detected: ', info);
});
我们通过安装 memwatch 能够方便发现内存泄露

## Heapdump

node-heapdump 是一个能够用于导出 V8 heap 的工具，然后在 Chrome Devtools 中进行详细检测，你也能在其中比较 heap 快照，这就更容易发现你的泄漏在什么地方。

现在让我们在上面代码中导出堆图，每次有内存泄漏发生时，我们就将 V8 的 stack 输出快照到磁盘中：

```js
memwatch.on("leak", function (info) {
  console.error(info);
  var file = "/tmp/myapp-" + process.pid + "-" + Date.now() + ".heapsnapshot";
  heapdump.writeSnapshot(file, function (err) {
    if (err) console.error(err);
    else console.error("Wrote snapshot: " + file);
  });
});
```

## cpu 负载检测

// /app/lib/cpu.js
const os = require('os');
// cpu 核心数
const length = os.cpus().length;
// 单核 CPU 的平均负载
os.loadavg().map(load => load / length);
