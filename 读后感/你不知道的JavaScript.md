# 你不知道的JavaScript

对值的不同表示方法称为类型

直接包含在源码中的值被称为字面值

数字和布尔型字面值可以直接表示

隐式类型转换是每个JavaScript编程的人都应该学习的。

注释应该解释为什么，而非是什么

将值赋给一个符号容器，也就是变量。

通过声明变量存放指定类型的值， 避免不想要的值类型转换，人们认为这种静态类型（类型强制）提高了程序的正确性。

强调值的类型而不是变量的类型，弱类型（动态类型）

变量的主要用途： 管理程序状态  状态跟踪了值随着程序运行的变化。

变量的另一个常见用法是集中设置值

在JavaScript中常量的变量用大写表示，多个单词之间用下划线_分割

块不需要；结尾

**不满足期望类型的值通常会被强制转换为需要的类型**

**函数是可以通过名字被“调用” 的已命名代码段**

**作用域基本上是变量的一个集合以及如何通过名称访问这些变量的规则**

只有函数内部的代码才能访问这个函数作用域的变量

**如果一个作用域嵌套在另外一个作用域内， 那么内层作用域中的代码可以访问这两个作用域中的变量。**

```jsx
function outer(){
        var a = 1;
        function inner(){
            var b = 2;
            //这里我们既可以访问啊，也能访问b
            console.log(a+b)
        }
        inner();
        //这里我们只能访问a
        console.log(a)
    }
    outer();
```

变量能够以几种不同的方法进入这样“未定义”值的状态， 其中包括没有返回值的函数和使用void运算符。  undefined

[ ] 表示法接受变量或者字符串字面值（需要使用".."或者'..'）

数组和函数： 看作是对象类型的特殊子类型，而不是内置类型。

对象封箱 原生值作为对象使用时， 在引用其他属性和方法

显示类型转换你可以在代码中看到的类型由一种转换到另一种

隐式类型转换： 某些其他运算可能存在的隐式副作用而引发的类型转换.

字符串值可以封装为string对象  数字  number对象 布尔值封装成boolean对象

布尔值为假

- ""
- 0、-0、NaN(无效数字)
- null、undefined
- false

只有在非布尔值强制转换为布尔型值时才会遵循这个真假转换规则。

==检查的是允许类型转换情况下的值的相等性， 而===检查不允许类型转换情况下的值的相等性

- 如果要比较的两个值的任意一个（即一边）可能是true 或者false值，那么要避免使用==，而使用===
- 如果要比较的两个值中的任意一个可能是特定值（0、“”或者[ ]- 空数组），那么避免使用===，而使用==
- 在所有其他情况下，使用==都是安全的。

如果是比较两个非原生的话，比如对象（包括函数和数组）， 那么你需要特殊注意==与===这些比较规则。因为这些值通常是涌过引用访问的，所以==和===比较只是简单地检查这些引用是否匹配，而完全不关心其引用的值是什么.

```jsx
var a = [1,2,3]
var b = [1,2,3]
var c = "1,2,3"
a==c;  //true
b==c;  //true
a==b   //false
```

如果试图设定尚未声明的变量，那么就会导致在顶层全局作用域创建这个变量或者错误

```jsx
function foo(){
	a = 1; //a没有正式声明
}
foo();
a;  //1 全局都能访问到
```

```jsx
function foo(){
		"use stict"
		//这个代码是严格模式
		function bar(){
			//这个代码是严格模式
		}
}
//这个代码不是严格模式
```

虽然匿名函数表达式的使用广泛，但通常更需要已命名函数表达式

```jsx
function makdeAdder(x){
	// 参数 x是一个内层变量
	
	// 内层函数add()使用x,所以它外围有一个“闭包”
	function add(y){
		return y+ x
	}
	return add
}
调用外层makeadder返回的、指向内层add函数的引用能够记忆传入makeadder 的x值。

//plus获得指向内层add的一个引用
var plus = makdeAdder(3)
```

闭包最常见的应用是模块模式

```jsx
function User(){
	var username,password;
	function doLogin(user, pw){
		username = user;
		password = pw
	}

	var publicAPI = {
		login = doLogin
	}

	return publicAPI

}

//创建一个user模块实例
var fred = User();

//不采用 new User()的原因
user() 只是一个函数，而不是需要实例化的类，所以正常调用即可

fred.login("fred", "123456")
```

this 通常指向一个对象  并不指向这个函数本身

关于this的四条规则

1. foo();   肺炎个模式，foo()最后会将this设置为全局对象。严格迷失下，这是为定义的行为，在访问bar属性时会出错—因此“global” 是为this.bar创建的值
2. objj1.foo()  将this设置为对象obj1
3. foo.call(obj2)   将this设置为对象obj2
4. new foo()    将 this 设置为一个全新的空对象

原型

当对象引用某个属性时，如果这个属性不存在，那么JavaScript会自动使用对象的内部原型引用找到另外一个对象来寻找这个属性。

从一个对象到其后备对象北部原型引用链接是在创建对象时发生的

```jsx
var foo = {
	a: 42
}

//创建bar并将其链接到foo
var bar = Object.create(foo);
bar.b = "Hello world";
bar.b  //“hello world”
bar.a  // 42 => 委托给foo
```

更自然应用原型的方式被称为"行为委托"模式

polyfilling 根据新特性的定义，创建一段与之行为等价但能够在旧的JavaScript环境中运行的代码。

新增加的语法是无法进行polyfilling的。新语法在旧版JavaScript引擎上会抛错。

我们就使用到

Babel(<https://babeljs.io>)  从ES6编译到ES5

Traceur(<https://github.com/google/traceur-compiler>)

transpiling

```jsx
fucntion foo(){
	var a = arguments[0] !==(void 0 )  ? arguments[0] : 2
	console.log( a );
}
```

非JavaScript

例如dom api

document.getElement

相关的被称为宿主对象

另一个示例是输入输出 （i/o）

this关联的是对象原型机制， 这种机制是一个属性查找链，与寻找词法作用域变脸的方式类似， 但在原型中进行封装，即模拟（伪造）类和（所谓“原型化的”）继承，是对JavaScript的另一个重大误用

[h5新增特性](https://www.notion.so/h5-59d12d68fb6f4928bf67115aa54278a0)

JavaScript 中有两个机制可以『欺骗』词法作用域： eval(..) 和with.前者可以对一段包含一个或多个声明的『代码』字符串进行验算， 并借此来修改已经存在的词法作用域（在运行时）
后者本质上是通过将一个对象的引用当做作用域来处理， 将对象的属性当做作用域中的标识符来处理，从而创建一个新的词法作用域（同样是在运行时）

对象属性引用链中只有上一层或者说最后一层在调用位置中起作用

```js
function foo(){
  console.log('this.a', this.a)
}
var obj2 = {
  a: 42,
  foo:foo
}

var obj1 = {
  a: 2,
  foo:foo
}

obj1.obj2.foo()
```

隐式绑定丢失 变为默认绑定

```js
function foo(){
  console.log(this.a)
}

var obj = {
  a:2,
  foo: foo
}

var bar = obj.foo // 函数别名

var a = 'oops, global'

bar()  // oops, global

```

虽然bar 是obj.foo的一个引用， 但是实际上，他引用的是foo 函数本身，因此此时的bar（）其实是一个不带任何修饰的函数调用， 因此应用了默认绑定。

```js
function foo(){
  console.log(this.a)
}

function doFoo(fn){

  fn()
}

var a = 'oops, global'

var obj = {
  a:2,
  foo: foo
}

doFoo(obj.foo)
```

参数传参其实就是一种隐式绑定

显示绑定

硬绑定的 bar 不可能在修改它的 this

bind（）会返回一个硬编码的新函数， 它会把你指定的参数设置为this的上下文并调用原始函数。

```js
function bind(fn, obj){
  return function(){
    return fn.apply(obj, arguments)
  }
}

```

new 绑定

当 Number 在 new 表达式中被调用时， 它是一个构造函数： 它会初始化新创建的对象

优先级

显式绑定 > 隐式绑定 > 默认绑定

new绑定 > 隐式绑定 > 默认绑定

```js
function foo(){
  // 返回一个箭头函数
  return (a)=> {
    // this 继承自foo（）
    console.log(this.a)
  }

}


var obj1 = {
  a: 2
}

var obj2 = {
  a: 3
}

var bar = foo.call(obj1)

bar.call(obj2) // 2, 不是 3

```

foo() 内部创建的箭头函数会捕获调用时的foo()的this。 由于foo() 的this 绑定到obj1， bar(引用箭头函数) 的this 也会绑定到obj1， 箭头函数的绑定无法被修改

箭头函数的绑定无法被修改（new 也不行！）

```js
function NothingSpecial(){
  console.log('Dont mind me')
}

var a = new NothingSpecial();

a;
```

new 会劫持所有普通函数并用构造对象的形式来调用
