# 两者对比

防抖： 抖动现象的本质是短时间内产生了高频次触发
节流： 使短时间内的函数调用以一个固定的频率间隔执行

## debounce
假设你正在乘电梯上楼，当电梯门关闭之前发现有人也要乘电梯，礼貌起见，你会按下开门开关，然后等他进电梯； 
如果在电梯门关闭之前，又有人来了，你会继续开门；
这样一直进行下去，你可能需要等待几分钟，最终没人进电梯了，才会关闭电梯门，然后上楼。

所以debounce的作用是，**当调用动作触发一段时间后，才会执行该动作，若在这段时间间隔内又调用此动作则将重新计算时间间隔**。

1. debounce函数会通过闭包维护一个timer
1. 当同一action在delay的时间间隔内再次触发，则清理timer，然后重新设置timer


```js
const debounce = (fn, wait) =>{
  var timerId = null;

  return function(){
    clearTimeout(timerId);
    timerId = setTimeout(()=>{
      fn.apply(this, arguments)
    }, wait)
 }
}
```


所以debounce的作用是，**当调用动作触发一段时间后，才会执行该动作，若在这段时间间隔内又调用此动作则将重新计算时间间隔**。
throttle
假设你正在乘电梯上楼，当电梯门关闭之前发现有人也要乘电梯，礼貌起见，你会按下开门开关，然后等他进电梯；  
但是，你是个没耐心的人，你最多只会等待电梯停留一分钟；
在这一分钟内，你会开门让别人进来，但是过了一分钟之后，你就会关门，让电梯上楼。

```js
const throttle = (fn ,wait)=>{
  var wait = wait || 0;
  var lastTime = 0;

  return function(){
    var currentTime = +new Date();
    if(currentTime > lastTime + wait){
      lastTime = currentTime;
      fn.apply(this, arguments)
    }
  }
}
```