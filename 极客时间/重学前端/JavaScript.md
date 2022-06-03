# js

javaScript引擎会常驻于内存中

宿主发起的任务称为宏任务， JavaScript 引擎发起的任务称为微任务。

行为都是一个事件循环， 所以 Node 术语， 也会把这部分称为事件循环。

宏观任务的队列就相当于事件循环

``` js
    var r = new Promise(function(resolve, reject) {
        console.log("a");
        resolve()
    });
    r.then(() => console.log("c"));
    console.log("b")
    // 输出顺序是a b c

    var r = new Promise(function(resolve, reject) {
        console.log("a");
        resolve()
    });
    setTimeout(() => console.log("d"), 0)
    r.then(() => console.log("c"));
    // console.log("b")
```

![untitled](https://tva1.sinaimg.cn/large/00831rSTgy1gd3uqh046tj313y0iut9x.jpg)

![untitled%201](https://tva1.sinaimg.cn/large/00831rSTgy1gd3uqf7dzaj31tw0ta0vk.jpg)

在宏观任务中，JavaScript 的promise还会产生异步代码，

![untitled%202](https://tva1.sinaimg.cn/large/00831rSTgy1gd3uqag9rnj30pm0uejsk.jpg)

有了宏观任务 和 微观任务  可以实现 js引擎级 和  宿主级的任务

例如 Promise永远在队列尾部添加微观任务。 setTimeout等宿主api， 则会添加宏观任务。

``` js
    var r = new Promise(function(resolve, reject) {
        console.log("a");
        resolve()
    });
    setTimeout(() => console.log("d"), 0)
    r.then(() => console.log("c"));
    console.log("b")
```

微任务始终优先于宏任务：

微任务总会在下一个宏任务之前执行，在本身所属的宏任务结束后立即执行。

![untitled%203](https://tva1.sinaimg.cn/large/00831rSTgy1gd3uq8cy1yj30lo0b63yu.jpg)

``` js
    function sleep(duration) {
        return new Promise(function(resolve, reject) {
            console.log("b");
            setTimeout(resolve, duration);
        })
    }
    console.log("a");
    sleep(5000).then(() => console.log("c"));
```

![untitled%205](https://tva1.sinaimg.cn/large/00831rSTgy1gd3uq70rp6j30sq0nqwfn.jpg)

闭包其实只是一个绑定了执行环境的函数

* 环境部分
    * 环境: 函数的词法环境（执行上下文的一部分）
    * 标识符列表： 函数中用到的未声明的变量
* 表达式部分： 函数体

javaScript中的函数完全符合闭包的定义。

它的环境部分是函数词法环境部分组成，  它的标识符列表是函数中用到的为声明变量， 它的表达式部分就是函数体

闭包对应的概念是“函数”

![untitled%206](https://tva1.sinaimg.cn/large/00831rSTgy1gd3uq3xfv0j30zc0lmq3p.jpg)

![untitled%207](https://tva1.sinaimg.cn/large/00831rSTgy1gd3uq1tbx5j312s0l675i.jpg)

``` js
    var b = {}
    let c = 1
    this.a = 2;
```

![untitled%208](https://tva1.sinaimg.cn/large/00831rSTgy1gd3upygxupj30b6098aa4.jpg)

在只有 var， 没有 let 的时代， 诞生了一个技巧：立即执行的函数表达式

创建一个函数， 并且立即执行， 来构造一个新的域，从而控制 var 的范围。

``` js
    ;
    (function() {
        var a;
        //code
    }());
    (function() {
        var a;
        //code
    })()

    void

    function() {
        var a;
        //code
    }();

    var b;
    void

    function() {
        var env = {
            b: 1
        };
        b = 2;
        console.log("In function b:", b);
        with(env) {
            var b = 3;
            console.log("In with b:", b);
        }
    }();
    console.log("Global b:", b);
```

一下语句会产生 let 使用的作用域

* for
* if
* switch
* try/catch/finally

![untitled%209](https://tva1.sinaimg.cn/large/00831rSTgy1gd3upxotn2j314u0ls752.jpg)

1. 普通函数： function关键字
2. 箭头函数：⇒运算符定义的函数
3. 方法： 在class中定义的函数

``` js
    class C {
        foo() {
            //code
        }
    }
```

4. 生成器函数 ： function*定义

``` js
    function foo * () {
        // code
    }
```

5. 类： 用class定义的类， 实际上也是函数

``` js
    class Foo {
        constructor() {
            //code
        }
    }
```

6，7，8 异步函数： 普通函数、箭头函数、生成器函数加上async关键字

``` js
    async function foo() {
        // code
    }
    const foo = async () => {
        // code
    }
    async function foo * () {
        // code
    }
```

调用它所使用的引用: 我们获取函数的表达式，它实际上返回的并非是函数本身， 而是一个Reference类型

Reference 类型由有两部分组成 ： 一个对象 和 一个属性值。

reference类型中的对象被当作 this 值

调用函数时使用的引用， 决定了函数 执行时刻的 this 值。

生成器函数、异步生成器函数或者

在javaSciprt标准中，为函数规定了用来保存定义时上下文的私有属性[[Environment]]

当一个函数执行时，会创建一条新的执行环境记录， 记录的外层词法环境 会被设置成函数的[[Environment]]

在JavaScript标准定义了[[thisMode]]私有属性

[[thisMode]]私有属性有三个值

* lexical: 从上下文中找this， 对应箭头函数
* global: 表示当this为undefined时， 取全局对象，对应了普通函数
* strrict: 严格模式， this按照调用时传入的值， null或者undefined

![untitled%2010](https://tva1.sinaimg.cn/large/00831rSTgy1gd3uptbf5oj30qc0r0dhl.jpg)

``` js
    function foo() {
        try {
            return 0;
        } catch (err) {

        } finally {
            return 1;
        }
    }

    console.log(foo());

    //1
```

语句块涉及到：

javaScript标准类型

Compltion Record表示一个语句执行完之后的结果

[[type]] 表示完成的类型， 有break continue return throw 和 normal几种类型

[[value]] 表示语句的返回值， 如果语句没有， 则是empty

[[target]] 表示语句的目标， 通常是一个javascript标签

![untitled%2011](https://tva1.sinaimg.cn/large/00831rSTgy1gd3upryyffj30p20xsgnt.jpg)

普通语句执行时，会得到[[type]] 为normal的compltion Rcord， javaScript遇到这样的会继续执行下一条语句

这些语句只有表达式会产生[[value]]

例如  i =1; 产生  1；   var i = 1; 产生undefined。

语句块  内部的语句的completion Record的[[type]] 不为normal， 就打断语句块后续的语句执行。

return 语句可能产生 return 或者 throw  类型的 Completion Record

``` js
    {
        var i = 1; // normal, empty, empty
        i++; // normal, 1, empty
        console.log(i) //normal, undefined, empty
    } // normal, undefined, empty

    //上文提到的有三个字段  
```

控制类型语句分两部分:

1. 对内部造成影响， 如 if\switch\while / for\try

2. 对外部产生影响  break、continue、return 、throw

![untitled%2012](https://tva1.sinaimg.cn/large/00831rSTgy1gd3uppxza8j311c0kudid.jpg)

![untitled%2013](https://tva1.sinaimg.cn/large/00831rSTgy1gd3upof9gzj30zo0u0ju0.jpg)

css选择器 第三优先级

“，”

伪元素：

![untitled%2014](https://tva1.sinaimg.cn/large/00831rSTgy1gd3upllhijj30960b0744.jpg)

dom api
![dom](https://tva1.sinaimg.cn/large/00831rSTgy1gd3vs3w4c9j30ze0fw754.jpg)

![dom](https://tva1.sinaimg.cn/large/00831rSTgy1gd3vmv43ksj310m0ikt9r.jpg)
range api

``` js
    var range = new Range(),
        firstText = p.childNodes[1],
        secondText = em.firstChild
    range.setStart(firstText, 9) // do not forget the leading space
    range.setEnd(secondText, 4)
```

![untitled%2017](https://tva1.sinaimg.cn/large/00831rSTgy1gd3vr432oqj313y0l4ab6.jpg)

[script标签写export为什么会抛错](js/script%20export.md)

[name(){}和name: function(){}](js/name%20name%20function.md)
