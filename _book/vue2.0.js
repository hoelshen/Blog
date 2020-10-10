let oldArrayPrototype = Array.prototype;
let proto = Object.create(oldArrayPrototype); //继承
['push', 'shift', 'unshfit'].forEach(method =>{  //函数劫持， 把函数重写  内部 继续调用老的方法
  proto[method] = function(){
    updateView(); //切片变成
    console.log('oldArrayPrototype',oldArrayPrototype )
    oldArrayPrototype[method].call(this, ...arguments)
  }
})

function observer(target){
  if(typeof target !== 'object' || target == null){
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

function updateView(){
  console.log('更新视图')
}

let data = {name: 'sj', age:[1,2,3]}

observer(data);

data.age.push(4)
console.log('data: ', data.age);