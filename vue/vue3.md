# vue composition api

1. vue3 使用js 实现了类型推断，新版 api 全部采用普通函数，避免使用了装饰器@
2. 解决了多组件间逻辑重用问题
3. composition api 简单。


```js
let oldArrayPrototype = Array.prototype;
let proto = Object.create(oldArrayPrototype); //继承
['push', 'shift', 'unshfit'].forEach(method =>{  //函数劫持， 把函数重写  内部 继续调用老的方法
  updateView(); //切片变成
  oldArrayPrototype[method].call(this, ...arguments)
})

function observer(target){
  if(typeof target ! == 'object' || target == null){
    return target ;
  }
  if(Array.isArray(target)){  //拦截数组，对数组的方法进行重写
    Object.setPrototypeOf(target, proto)  //写个循环， 赋予给target
    // target.__proto———— = proto;
  }
  for(let key in target){
    definReactive(target, key, target[key])
  }
}
function definReactive(target, key, value){
  observer(value); //递归
  Object.defineProperty(target, key ,{
    get(){
      return value
    },
    set(newValue){
      if(newValue !== value){
        observer(newValue);
        updateView();
        value = newValue;
      }
    }
  })
}


let data = {name: 'sjh', age:[1,2,3]}

observer(data);

data.age.push(4)
console.log('data: ', data.age);














```