
# ES6之类（一）

  本文会分为上下两篇。上篇会讲 ES5 相关的东西， 下篇会讲 ES6 相关的东西。

## 对象方法、 类方法、 原型方法

``` js
function People(name) {
    this.name = name;
    //对象方法  
    this.Introduce = function() {
        alert("My name is " + this.name);
    }
}
//类方法  
People.Run = function() {
    alert("I can run");
}
//原型方法  
People.prototype.IntroduceChinese = function() {
    alert("我的名字是" + this.name);
}

//测试  

var p1 = new People("Windking");

p1.Introduce(); //对象方法需要通过实例化对象去调用  

People.Run(); //类方法不需要通过实例化对象去调用  

p1.IntroduceChinese(); //原型方法也需要通过实例化对象去调用
```

1. 对象方法包括构造函数中的方法以及构造函数原型上面的方法。
2. 类方法，相当于函数， 可以为其添加函数属性及方法。
3. 原型方法一般用于对象实例共享，比如 Person.prototype.sayName=function(){console.log(this.name); }; 在原型上面添加该方法，就能实现共享。这样就不用每一次初始化一个实例的时候，为其分配相应的内存了。

## 原型链

每一个切图仔最开始接触前端，最头疼的就是原型与原型链相关的东西。那么我们先来梳理下。

原型是什么？

在JavaScript中原型是一个prototype对象，用于表示类型之间的关系。

原型链是什么？

JavaScript 万物都是对象，对象和对象之间也有关系，并不是孤立存在的。对象之间的继承关系，在 JavaScript 中是通过 prototype 对象指向父类对象，直到指向 Object 对象为止，这样就形成了一个原型指向的链条，专业术语称之为原型链。

在我们学习之前先来看几个问题理清几个概念

### prototype 和 __proto__

   其实在 JavaScript 代码还没有运行的时候，JavaScript 环境已经有一个 window 对象
window 对象有一个 Object 属性， window. Object 是一个函数对象. window. Object 这个函数对象有一个重要的属性是 prototype.

``` js
var obj = {};
obj.toString();
console.log('obj', obj)
```

![obj.prototype](http://pvt7l4h05.bkt.clouddn.com/2019-08-28-034839.png)

obj变量指向一个空对象，这个空对象有个__proto_ 属性指向 window. Object.prototype
调用obj.toString（）的时候，obj本身没有toString，就去obj._proto_上面去找toString
所以你调用obj.toString的时候，实际上是调用window. Object.prototype.toString

我们在看这个例子：

``` js
var arr = [];
arr.push(1)
console.log(arr)
```

![arry.__proto_](http://pvt7l4h05.bkt.clouddn.com/2019-08-28-035607.png)

arr.__proto__ 指向window. Array.prototype。 这样当你在调用 arr.push 的时候，arr 自身没有 push 属性，就上去arr.__proto__ 上找。最终找到 push 方法。如果是 arr.valueOf 呢，arr 自身没有，Array.prototype 也没有, 那么他会去 arr.__proto__.__proto__ 就是 window. Object.prototype, 所以 arr.valueOf 其实就是 window. Object.valueOf

所以我们可以得出如下概念:

prototype 是构造函数的属性，构造函数也是对象。 而 __proto__ 是对象的属性，
函数的 prortotype 是个一对象, 对象的 __proto__ 属性指向原型
, __proto__ 将对象和原型连接起来组成了原型链。

* Object 是所有对象的爸爸， 所有对象都可 __proto__ 指向
* Funciton 是所有函数的爸爸， 所有函数都可以通过 __proto__ 找到它

他们的区别:

* prototype 是让你知道用什么属性
* __prototype__ 是让你知道都有什么属性

### constructor 和 prototype

  原型(prototype)是构造函数的一个属性，是一个对象。constructor 是绑在实例上面的，不是绑在原型链上面的。

![构造函数](http: //pvt7l4h05.bkt.clouddn.com/2019-08-26-175034.png)

``` js
Object.prototype.constructor == Objcect
//这个答案是什么
```

 在前面说过，只有 prototype 是让你知道用什么属性（也就是原型链上的方法）

``` js
    function Bottle() {
        this.name = 'a';
        this.sayHello = function() {
            console.log('this.name', this.name);
        }
    }
    Bottle.prototype.sayIntroduce = function() {
        console.log('this.sayIntroduce', this.name);
    }
    var bot1 = new Bottle();
    var bot2 = new Bottle();
    console.log(Bottle.prototype.constructor == Bottle); //ture
    console.log(bot1);
```

![原型链](http://pvt7l4h05.bkt.clouddn.com/2019-08-26-%E5%B1%8F%E5%B9%95%E5%BF%AB%E7%85%A7%202019-08-27%20%E4%B8%8A%E5%8D%881.52.11.png)

  构造函数实例出来的对象，可以得到构造函数对象中的属性，方法。等等还有一个什么 __proto__。我们仔细点进去，有两个东西 constructor: Bottle（）。这是因为我们是由 Bottle，new出来。我们在继续点下去，还有__proto_: 的constructor： Object（）。

``` js
var Obj = function() {};
var obj1 = new Obj();
console.log(obj1.constructor === Obj)

Obj.prototype.constructor = Fighter
```

是Obj，因为他会顺着原型链找上去

再来看一个例子

``` js
    var plane = new Plane();
    Fighter.prototype = new Plane();
    var fighter = new Fighter();
```

Fighter.prototype.constructor = Fighter
只要将子类构造函数constructor指向子类
在由上面我们可以引生出继承
定义：继承可以使子类具有父类的属性和方法

构造函数继承可以传递参数

``` js
function Person(name) {
    this.name = name
}
Person.prototype.sayHello = function() {
    console.log('hi' + this.name)
}

function Student(name, grade) {
    Person.call(this, name)
    this.grade = grade;
}

Student.prototype.selfIntroduce = function() {
    console.log('my ' + this.name + ' grade ' + this.grade)
}

var student = new Student('sjh', 99);
student.selfIntroduce()
```

//我们得出my sjh grade 99
但是这种会遇到一种情况就是无法使用Person的sayHello方法
因为没有继承person原型方法和属性, 继承自Person的实例属性

那么有没有最佳实践呢
最佳实践其实就是在组合继承的基础上修改原型继承的方式，封装inheritPrototype函数，专门处理子类继承父类的原型逻辑.

inheritPrototype函数。

console.log(bottle2.__proto_); //undefined
console.log(bottle1.sayHello() === bottle2.sayHello())

``` js
function Person(name) {
    this.name = name
}
Person.prototype.sayHello = function() {
    console.log(‘hi’ + this.name)
}

function Student(name, grade) {
    Person.call(this, name)
    this.grade = grade;
}

inheritPrototype(Student, Person);

Student.prototype.selfIntroduce = function() {
    console.log('my ' + this.name + ' grade ' + this.grade)
}

function inheritPrototype(subType, superType) {

    var protoType = Object.create(superType.prototype);
    protoType.constructor = subType;
    subType.prototype = protoType

}

var student = new Student(‘sjh’, 23)
console.log(student.name); //‘Cover’
student.sayHello(); // sjh
student.sayHello(); //23
student.hasOwnProperty(‘name’); //true

``
`

  

`
``
js

function Person(name, age, sex) {
    this.name = name;
    this.age = age;
    this.sex = sex;
}

Person.prototype.sayHello = function() {
    console.log(this.name)
}
```

这是我们构造函数的方法, 我们添加下面东西 看能输出什么

``` js
var obj1 = new Person('red', 10, 'man');
var obj2 = new Person('yellow', 11, 'male');
console.log('obj1.sayHello === obj2.sayHello', obj1.sayHello === obj2.sayHello)
```

 通过构造函数生成的实例对象时，会自动为实例对象分配原型对象。每个构造函数都有一个  prototype 属性， 这个属性就是实例对象的原型对象。

 原型对象上的所有属性和方法， 都能被派生对象共享。

``` js
function Person(name) {

}

Person.prototype = {
    constructor: Person,
    sayHello: function() {

    }
}
```

注意：需注意的是在上面的代码中，我们将 Person.prototype 设置为一个新创建的对象。会导致 Person.prototype 对象原来的 constructor 属性不再指向 Person, 这里可以像上面那样，特意的把 constructor 设置为 Person 。

函数声明

函数表达式 与 函数声明 的最主要区别就是函数名称， 在函数表达式只能够可以忽略它，从而创建匿名函数，一个匿名函数可以被用作一个iife（即时调用的函数表达式）， 一旦它定义就运行。
注意点： 函数表达式没有提升，不像函数声明， 你在定义函数表达式之前不能使用函数表达式

``` js
obj();

const obj = function() {
    console.log('obj')
}

//ReferenceError: Cannot access 'obj' before initialization
```

如果想再函数体内部引用当前函数， 则需要创建一个命名函数表达式。 然后函数名称将会作为函数体（作用于）的本地变量

``` js
var math = {
    'factorial': function factorial(n) {
        if (n <= 1) {
            return 1
        }
        return n * factorial(n - 1)
    }
}
const obj = math.factorial(3);
console.log('obj: ', obj); //6
```

被函数表达式赋值的那个变量会有一个 name 属性， 如果

``` js
var arr = [];
arr.name = "随笔川迹";
Array.prototype.name = "川流不息";
console.log(arr.name); // 随笔川迹
```

当构造函数自定义的属性名与该构造函数下原型属性名相同时，构造函数的自定义属性优先于原型属性(可以把构造函数理解为内联样式), 而原型属性或者原型方法可以看做是class)

``` js
var obj = {}; //创建空对象
obj.__proto__ = MyFunc.prototype; //将这个空对象的__proto__成员指向了构造函数对象的prototype成员对象

MyFunc.call(obj); //将构造函数的作用域赋给新对象

return obj //返回新对象obj
```

## 继承 多态 重载

### 子类继承父类

1. 借用构造函数继承

// .call/apply 将 子类 的 this 传给 父类 ， 再将 父类的属性绑定到 子类 的 this 上。

``` js
function Person(name, grade) {
    this.name = name //实例属性
    this.grade = grade // 实例属性
    this.sayHello = function() { //实例方法
        console.log('hello', this.name, this.grade)
    }
}

function Student(name, grade, sex) {
    Person.apply(this, arguments)
    // 或者 Person.call(this, name, grade)
    //父类 没有构造的属性 无法直接用
    this.sex = sex;
    this.sayIntroduce = function() {
        console.log('sayIntroduce', this.name, this.grade, this.sex)
    }
}
var std1 = new Student('b', 11, 'man')
var Per1 = new Person('a', 23, 'man')
std1.sayIntroduce();
std1.sayHello();

console.log('Per1.name', Per1.sex) //拿不到子类的东西， 不然就是双向绑定了
Per1.sayIntroduce() //拿不到子类的东西， 不然就是双向绑定了

console.log('std1.name: ', std1.name);
console.log('std1.grade: ', std1.grade);
console.log('std1.sex: ', std1.sex);

console.log(" student instanceof Student", std1 instanceof Student)
console.log(" student instanceof Student", std1 instanceof Person)
```

instanceof 运算符可以用来判断某个构造函数的 prototype 属性是否存在另外一个要检测对象的原型链上.

这种在构造函数内部借用函数而不借助原型继承的方式被称之为 借用构造函数式继承.
但是这样做的缺点就是没有继承 Person 的原型方法和属性。

``` js
//我们将上面 Person 类里面的 this.sayHello 注释掉
//补上
Person.prototype.sayHello = function() {
    console.log('hello', this.name)
}

std1.sayHello(); //ES5.JS:103 Uncaught TypeError: std1.sayHello is not a function
```

2.prototype 模式

``` js
function Person(name) {
    this.name = name
    // this.sayHello = function() {
    //     console.log('hello', this.name)
    // }
}

Person.prototype.sayHello = function() {
    console.log('hello', this.name)
};

function Student(name, grade, sex) {
    this.name = name;
    this.grade = grade
    this.sex = sex;
}

Student.prototype = new Person(); //通过改变原型对象实现继承
Student.prototype.constrctor = Student; // 保持构造函数和原型对象的完整性
var std1 = new Student('b', 11)
var std2 = new Student('a', 22)
std1.sayHello(); // 实例和原型 均访问的到。
console.log(std1.hasOwnProperty('name')) // false 说明是继承来的属性
console.log(std1.sayHello === std2.sayHello) // true,复用了方法
console.log('std1.prototype: ', Student.prototype);
```

将子类的 prototype 指向父类的实例。 每个 prototype 都有一个 constructor 属性，它指向构造函数。
缺点就是子类实例没有自己的属性

3. 直接继承 prototype

``` js
function Person(name) {
    this.name = name
    // this.sayHello = function() {
    //     console.log('hello', this.name)
    // }
}

Person.prototype.sayHello = function() {
    console.log('hello', this.name)
};

function Student(name, grade, sex) {
    this.name = name;
    this.grade = grade
    this.sex = sex;
}

Student.prototype = Person.prototype;
Student.prototype.constrctor = Student;
var std1 = new Student('b', 11)
std1.sayHello(); // 实例和原型 均访问的到。
console.log('std1.prototype: ', Student.prototype);
console.log(Person.prototype.constructor); //Student
```

 缺点是 Student.prototype 和 Person.prototype 现在都指向同一个对象了，那么任何对Student.prototype 修改， 都会映射到 Person.prototype 上。

### 空对象

``` js
var Obj = function() {}
Obj.prototype = Person.prototype
Student.prototype = Obj.prototype;
Student.prototype = new Obj();
Student.prototype.constructor = Student;
```

以上继承方式或多或少都有点缺点，那么我们有没有完美的解决方案呢

``` js
最佳组合方式

function Animal(name) {
    this.name = name
}
Animal.prototype.species = 'animal'

function Leo(name) {
    Animal.call(this, name)
}
Leo.prototype = new Animal()
Leo.prototype.contructor = Leo

//既然不能直接在两者之间画等号, 就造一个过渡纽带呗. 能够关联起原型链的不只有 new,  Object.create() 也是可以的.

function Animal(name) {
    this.name = name
}
Animal.prototype.species = 'animal'

function Leo(name) {
    Animal.call(this, name)
}
Leo.prototype = Object.create(Animal.prototype)
Leo.prototype.contructor = Leo

// 这种在构造函数内部借函数同时又间接借助原型继承的方式被称之为 寄生组合式继承.
```

### 多态

### 重载

最后放一张高清无码大图，作为总结！

![原型链图](http://pvt7l4h05.bkt.clouddn.com/2019-08-28-js%E5%8E%9F%E5%9E%8B%E9%93%BE.jpeg)

