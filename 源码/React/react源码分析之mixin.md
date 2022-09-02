# react 源码分析之mixin

## 采用继承的方式

``` js
function extend(obj1, obj2) {
    Object.keys(obj2).forEach(function(key) {
            obj1[key] = obj2[key]
        })
}
class People {}
```

``` js
var SetIntervalMixin = {
    componentWillMount: function() {
        this.intervals = [];
    }
    setInterval: function() {
        this.intervals.push(setInterval.apply(null, arguments));
    }
    componentWillUnMount: function() {
        this.intervals.forEach(clearInterval);
    }
}
const Demo1 = React.createClass({
    mixins: [SetIntervalMixin]
})
```

```js
var SetIntervalMixin = { 
／／省略
}
class Demo1 extends Components {};
extends(Demo1.prototype, SetIntervalMixin );


```
