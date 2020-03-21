面向切面编程（aop）

面对处理过程中的某个步骤或阶段，以获得逻辑过程中各部分之间低耦合性的隔离效果

无侵入的代码
```js
    function test(argument){
        alert(2)
    }
    Function.prototype.before = function(fn){
        var _self = this;
        return function(){
            fn.apply(_self, arguments);
                _self.apply(_self, arguments);
            }
    
        fn();
        return _self.apply(this, arguments)
        }
    
    Function.prototype.after = function (fn) {
        //body  先执行本身  在执行回调
        var _self = this;
        return function(){
            _self.apply(this, arguments);
            fn.apply(this, arguments);
        }
    }
    test.before(function(){
        alert(1)
        return 'me test'
    })
    
    
    //1. test被执行了两次 
    //2. 将before和after作为中转站
    //3. 挂载self的到fn上面

```