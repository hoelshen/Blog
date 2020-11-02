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