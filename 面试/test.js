/* console.log('start here');

const foo = () => (new Promise((resolve, reject)=> {
  console.log('first promise constructor');

  let promise1 = new Promise((resolve, reject) => {
    console.log('second promise constructor')

    setTimeout(()=>{
      console.log('setTimeout here')
    }, 0)

    resolve('promise1')
  })


  resolve('promise0');

  promise1.then(arg => {
    console.log(arg)
  })

}))

foo().then(arg => {
  console.log(arg)
})

console.log('end here') */


/* 遇见promise1， 执行promise1的构造函数， 同步输出second promise constructor 以及end here

1、bind操作只有第一次绑定有效果，之后再次进行绑定，不会有效果

2、new操作的绑定操作优先度要高于bind，事实上，也会高于apply和call
 */



function generatorCalc(){
  let sum = 0;
  var _fn =  function(){
    const arr = Array.prototype.slice.call(arguments);
    console.log('arr: ', arr);
    if(arr.length == 0) return sum

    arr.forEach(element => {
      sum = sum + element
    });
    return sum
  }

  return _fn
}

var calc = generatorCalc();
calc(1);
calc(2)(3);
calc() // 6

function generatorCalc(){
  let sum = 0;
  var _fn =  function(){
    const arr = Array.prototype.slice.call(arguments);
    if(arr.length == 0) return sum

    arr.forEach(element => {
      sum = sum + element
    });

    return _fn
  }

  return _fn
}


const promise = new Promise((resolve, reject)=> {
  setTimeout(()=>{
    resolve('lucas')
  }, 2000)
})

promise.then(null)
  .then(data=> {
    console.log(data)
  });


// Thenable在callback之前抛出异常
// Promise rejects
var thenable = { then: function(resolve) {
  throw new TypeError("Throwing");
  resolve("Resolving");
}};

var p2 = Promise.resolve(thenable);
p2.then(function(v) {
  // 不会被调用
}, function(e) {
  console.log(e); // TypeError: Throwing
});

// Thenable在callback之后抛出异常
// Promise resolves
var thenable = { then: function(resolve) {
  resolve("Resolving");
  throw new TypeError("Throwing");
}};

var p3 = Promise.resolve(thenable);
p3.then(function(v) {
  console.log(v); // 输出"Resolving"
}, function(e) {
  // 不会被调用
});



var sum = (A,B,C,D)=>{
  var target = 0;
  var hashMap =  {};
  count = 0;
  for(let a of A){
    for(let b of B){
      hashMap[a+b] = hashMap.get(a+b, 0)+1
    }
  }

  for(let c of C){
    for(let d of D){
      s = -(c+d)
      if(s in hashMap);
      count += hashMap[s]
    }
  }

  return count
}
var valu = sum([1,2],[-2,-1], [-1, 2], [0,2])
console.log('sum', value)