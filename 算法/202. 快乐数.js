// 202. 快乐数

// 编写一个算法来判断一个数 n 是不是快乐数。

// 「快乐数」定义为：

// 对于一个正整数，每一次将该数替换为它每个位置上的数字的平方和。
// 然后重复这个过程直到这个数变为 1，也可能是 无限循环 但始终变不到 1。
// 如果 可以变为  1，那么这个数就是快乐数。
// 如果 n 是快乐数就返回 true ；不是，则返回 false 。


```js
/**
 * @param {number} n
 * @return {boolean}
 */
var isHappy = function(n) {
  // 如果这个数是两位数 那么就拆开来
  // 拆成两位
  // n.length

  if()

};
```

//这道题也是一个循环贪心算法
const isHappy = n => {
    const set = new Set();
    let num = n;
    while (true) {
        const strNum = `${num}`;
        const len = strNum.length;
        let newN = 0;
        for (let i = 0; i < len; i++) {
            newN += Number(strNum[i]) ** 2;
        }
        if (newN === 1) return true;
        if (set.has(newN)) return false;
        set.add(newN);
        num = newN;
    }
};

isHappy(19)