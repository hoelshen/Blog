function myNew() { 
  //用new Object() 的方式新建了一个对象 obj
  let obj = {};
  // 取出第一个参数，就是我们要传入的构造函数。此外因为 shift 会修改原数组，所以 arguments 会被去除第一个参数
  let Constructor = [].shift.call(arguments);

  obj.__proto__ = Constructor.prototype;
  // 使用 apply，改变构造函数 this 的指向到新建的对象，这样 obj 就可以访问到构造函数中的属性
  let res = Constructor.apply(obj, arguments);
  return res instanceof Object ? res : obj;
}
function Anima(name, age) { 
  this.name = name;
  this.age = age;

}
Anima.prototype.length = 11;
Anima.prototype.sayYourName = function () {
  console.log('I am ' + this.name);
};
var person = new Anima('Kevin', '18');

console.log(person.name) // Kevin
console.log(person.age) // 11
console.log(person.strength) // 11

person.sayYourName(); // I am Kevin
// 当我们用new 实例的时候 可以：
// 1. 访问到Anima构造函数里的属性
//  2. 访问到Anima.prototype中的属性