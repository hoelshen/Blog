// Promise.all((Promise.then(1), 2).then(v => console.log(v)) // 输出1,2

// Promise.all((Promise.then(1), 2, Promise.reject(3)).then(v => console.log(v)) // 3

// Promise.all(setTimeout(() => { console.log(1), 500 }), 2, Promise.reject(3).then(v => console.log(v))); //123



// 翻转字符串里的单词
// function reverseString(string){
//   console.log('string', string);
//   const arr = string.trim().split(/\s+/);
//   let reverseValue = ``;
//   console.log('arr', arr);
//   for(let i = arr.length -1; i > 0; i--){
//     reverseValue += arr[i] + ' ';
//   }
//   return reverseValue
// }

// console.log(reverseString(' the sky is blue '))


// function reverseBetween(head, left, right){
//   //限定了范围，由全局到处理成起止位置
//   // 那我是不是可以拆分成三部分
//   // 1.第一步 生成虚拟头节点
//   const dummyNode = new ListNode(-1);
//   dummyNode.next = head; //虚拟头节点

//   // 2.第二步 遍历left前一个节点
//   let pre = dummyNode;
//   for(let i = 0; i< left -1; i++){
//     pre = pre.next;
//   }
//   // 3.遍历rightNode到right位置
//   let rightNode = pre;
//   for(let i=0; i < right -left +1 ; i++){
//     rightNode = rightNode.next;
//   }

//   // 4.保存leftNode 和rightNode.next
//   let leftNode = pre.next;
//   let curr = rightNode.next

//   // 5.切断left到right的子链
//   pre.next = null;
//   rightNode.next = null;

//   //6. 反转left到right的子链
//   reverseList(leftNode);

//   pre.next = rightNode;
//   leftNode.next = curr;
//   return dummyNode.next
// }

// console.log(reverseBetween([1,2,3,4,5],2,4));



// Promise all 解决一个promise失败，其他promise 也跟着失败

// const p1 = new Promise((resolve, reject) => {
//   throw new Error('报错了');
// })

// const p2 = new Promise((resolve, reject) => {
//   resolve('hello');
// })
// .then(result => result)
// .catch(e => e);

// Promise.all([p1, p2].map(promise => promise.then((res) => res).catch(err => err))).then(res => console.log('111', res));

const p1 = new Promise((resolve, reject) => {
  throw new Error('报错了');
})
.then(result => result)
.catch(e => e);

const p2 = new Promise((resolve, reject) => {
  resolve('hello');
})
.then(result => result)
.catch(e => e);

const p3 = new Promise((resolve, reject) => {
  resolve('world');
})
.then(result => result)
.catch(e => e);
 
// 包裹函数，避免 promise 抛出 reject
const wrapPromise = (promise)=> {
  return new Promise((resolve, reject) => {
    promise
    .then((info) => resolve({ isok: true, info }))
    .catch((err) => resolve({ isok: false, err }))
  })
}
 
 
// Promise.all 调用
 const resArr = await Promise.all([
    // 全部使用 wrapPromise 包裹
    wrapPromise(p1),
    wrapPromise(p2),
    wrapPromise(p3)
  ])
  const [res1, res2, res3] = resArr.map((res) => {
    if (res.isok) {
      // 处理 fulfilled promise 结果的逻辑
      return res.info
    } else {
      // 处理 rejected promise 结果的逻辑
      console.error('err', err)
      return {}
    }
  })
console.log('res', res1,res2,res3);