# 两者对比




## debounce
假设你正在乘电梯上楼，当电梯门关闭之前发现有人也要乘电梯，礼貌起见，你会按下开门开关，然后等他进电梯； 
如果在电梯门关闭之前，又有人来了，你会继续开门；
这样一直进行下去，你可能需要等待几分钟，最终没人进电梯了，才会关闭电梯门，然后上楼。

所以debounce的作用是，**当调用动作触发一段时间后，才会执行该动作，若在这段时间间隔内又调用此动作则将重新计算时间间隔**。

1. debounce函数会通过闭包维护一个timer
1. 当同一action在delay的时间间隔内再次触发，则清理timer，然后重新设置timer


```js

const debounce = function(func, interval){
  let timerId;

  return function(e){
    clearTimeout(timerId);
    timerId = setTimeout(function(){
      func.apply()
    }, interval)
  }

}
debounce(apiCall, 3000)
```


所以debounce的作用是，**当调用动作触发一段时间后，才会执行该动作，若在这段时间间隔内又调用此动作则将重新计算时间间隔**。
throttle
假设你正在乘电梯上楼，当电梯门关闭之前发现有人也要乘电梯，礼貌起见，你会按下开门开关，然后等他进电梯；  
但是，你是个没耐心的人，你最多只会等待电梯停留一分钟；
在这一分钟内，你会开门让别人进来，但是过了一分钟之后，你就会关门，让电梯上楼。
```js
let throttle =  function(fn, delay){
  var statTime = 0;
    
  return function() {
      var currTime = +new Date();
      
      if (currTime - statTime > delay) {
          action.apply(this, arguments);
          statTime = currTime ;
      }
  }
}
```