// 第二版的代码
function objectFactory() {
  var obj = new Object(),
    Constructor = [].shift.call(arguments);

  obj.__proto__ = Constructor.prototype;

  var ret = Constructor.apply(obj, arguments);

  return typeof ret === "object" ? ret : obj;
}

// 例子3 多加一个参数
function Student(name, age) {
  this.name = name;
  this.age = age;
  // this.doSth();
  // return Error();
}
Student.prototype.doSth = function () {
  console.log(this.name);
};
var student1 = newOperator(Student, "若", 18);
var student2 = newOperator(Student, "川", 18);
// var student1 = new Student('若');
// var student2 = new Student('川');
console.log(student1, student1.doSth()); // {name: '若'} '若'
console.log(student2, student2.doSth()); // {name: '川'} '川'

student1.__proto__ === Student.prototype; // true
student2.__proto__ === Student.prototype; // true
// __proto__ 是浏览器实现的查看原型方案。
// 用ES5 则是：
Object.getPrototypeOf(student1) === Student.prototype; // true
Object.getPrototypeOf(student2) === Student.prototype; // true
