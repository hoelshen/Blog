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
