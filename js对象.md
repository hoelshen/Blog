# 对象


* 内置对象：  引擎初始化阶段就被创建好的对象。
* 原生对象 ： 除了内置对象，还包括一些在运行过程中动态创建的对象

## 原生对象

ecma-262 把 原生对象（native object）定义为“独立于宿主环境的 ECMAScript 实现提供的对象”
包括一下几点：
    global
    Object
    Function
    Array
    String
    Boolean
    Number
    Date
    RegExp
    Error EvalError
    RangeError
    ReferenceError
    syntaxError、
    TypeError、
    URIError、
    ActiveXObject(服务器方面)、
    Enumerator(集合遍历类)、
    RegExp（正则表达式）

## 内置对象（不需要New）

一个内置的构造器函数是一个内置的对象，也是一个构造函数
常见的有
native Objects： object(constructor), date, math, parseInt, val.
host objects: window,documents,location,history,XMLhttpRequest,settimeout,getElementTagName, querySelectorAll


## 对象的扩展

```javascript
    if(typeof String.prototype.ltrim=='undefined'){
        String.prototype.ltrim = function(){
            var s = this;
            s = s.replace(/^\s*/g, '');
            return s;
        }
    }

    if(typeof String.prototype.rtrim=='undefined'){
        String.prototype.rtrim = function(){
            var s = this;
            s = s.replace(/\s*$/g, '');
            return s;
        }
    }

    if(typeof String.prototype.trim=='undefined'){
        String.prototype.trim = function(){
            return this.ltrim().rtrim();
        }
    }

    if(typeof String.prototype.htmlEncode=='undefined'){
        String.prototype.htmlEncode = function(encodeNewLine){//encodeNewLine:是否encode换行符
            var s = this;
            s = s.replace(/&/g, '&amp;');
            s = s.replace(/</g, '&lt;');
            s = s.replace(/>/g, '&gt;');
            s = s.replace(/'/g, '&quot;');
            if(encodeNewLine){
                s = s.replace(/\r\n/g, '<br />');
                s = s.replace(/\r/g, '<br />');
                s = s.replace(/\n/g, '<br />');
            }
            return s;
        }
    }


```


js原生对象的复制和扩展

```js
  var obj1 = {
    name : 'trigkit4',
    age : 22
};
var obj2 = {
    name : 'frank',
    age : 21,
    speak : function(){
        alert("hi, I'm + name ");
    }
};

var obj3 ={
    age : 20
};

function cloneObj(oldObj) { //复制对象方法
    if (typeof(oldObj) != 'object') return oldObj;
    if (oldObj == null) return oldObj;
    var newObj = Object();
    for (var i in oldObj)
        newObj[i] = cloneObj(oldObj[i]);
    return newObj;
}

function extendObj() { //扩展对象
    var args = arguments;//将传递过来的参数数组赋值给args变量
    if (args.length < 2) return;
    var temp = cloneObj(args[0]); //调用复制对象方法
    for (var n = 1; n < args.length; n++) {
        for (var i in args[n]) {
            temp[i] = args[n][i];
        }
    }
    return temp;
}
var obj =extendObj(obj1,obj2,obj3);
console.log(obj);//{ name: 'frank', age: 20, speak: [Function] }
console.log(obj1);//{ name: 'trigkit4', age: 22 }
console.log(obj2);//{ name: 'frank', age: 21, speak: [Function] }
console.log(obj3);//{ age: 20 }


pop
    移除数组的最后一个元素，返回值是被删除的元素。

push
    在数组的末尾添加一个或者多个元素，返回值是新的数组的长度。

reverse
    颠倒数组中元素的顺序，原先第一个元素现在变成最后一个，同样原先的最后一个元素变成了现在的第一个，也就是数组的索引发生了变化。

shift
    删除数组的第一个元素，返回值是删除的元素。

sort
    对数组中的元素进行排序。

splice
    添加或删除数组中的一个或多个元素。

unshift
    添加一个或者多个元素在数组的开头，返回值是新的数组的长度。







```