

// 个人感觉核心点在与 limit 去控制

const limitPromise = function (arr, limit, callback = ()=> {}) {
  // 维护：请求数组、结果数组
  // 1. 先把并发数量的数组发送，返回一个请求，在补充一个，直到arr.length = responseArr.length;
  let requestArr = [];
  let responseArr = [];
  let arrCopy = [...arr];
  let p1 =  new Promise((resolve, reject) => {
     resolve(res);
   });
  // 1. 先取出limit数量的请求，放入到requestArr
  if (arr.length < limit) {
    requestArr = arrCopy;
  } else {
    requestArr = arrCopy.slice(0, limit);
  }

  //写递归循环
  const call = () => {
    // 获取当前触发的请求
    let a = Promise.race(requestArr)
    a.then(resolve).catch(reject).finally(() => {
      // 在数组中删除已经触发的请求
      requestArr.forEach(item => {
        requestArr.splice(requestArr.indexOf(a), 1)
      })

      // 请求触发后，删除当前请求，同时判断欻如的URL数组内是否还有未加入的请求
      // 如果有，则加入，并重新触发循环

      if (arrCopy.length > 0) {
        requestArr.push(arrCopy.unshift())
        call()
      }
      // 触发完成之后，判断请求列表里面是否还有请求，有则重新进入循环
      if (requestArr.length) {
        call()
      }
    })
  }
  // for (let i = 0; i < requestArr.length; i++){
  //   p1.then(function (res) {
  //     responseArr.push(res);
  //     const newRequest = arr.slice()
  //     requestArr.push(newRequest);
  //   })
  // }

  // 2.请求返回 放入responseArr，并添加下一个到requestArr

  if (arr.length === responseArr.length) {
    callback()
  }
}