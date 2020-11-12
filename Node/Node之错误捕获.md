#  


## 进程处理

如果在退出之前需要做一些后续的处理，那么可以将process.exit()放在其它回调函数内调用。
```js
process.on('SIGINT', function () {
    console.log('Exit now!');
    port.write('ddd', function (){
        process.exit();
    });
});
```


## 内存泄露检测

　我们通过安装memwatch 能够方便发现内存泄漏，首先安装这个模块：

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

node-heapdump是一个能够用于导出V8 heap 的工具，然后在Chrome Devtools中进行详细检测，你也能在其中比较heap快照，这就更容易发现你的泄漏在什么地方。

现在让我们在上面代码中导出堆图，每次有内存泄漏发生时，我们就将V8的stack输出快照到磁盘中：

memwatch.on('leak', function(info) {
 console.error(info);
 var file = '/tmp/myapp-' + process.pid + '-' + Date.now() + '.heapsnapshot';
 heapdump.writeSnapshot(file, function(err){
   if (err) console.error(err);
   else console.error('Wrote snapshot: ' + file);
  });
});


## cpu 负载检测

// /app/lib/cpu.js
const os = require('os');
// cpu核心数
const length = os.cpus().length;
// 单核CPU的平均负载
os.loadavg().map(load => load / length);

