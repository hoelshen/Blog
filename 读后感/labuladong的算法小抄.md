# labuladong 的算法小抄

1.

最底层的就是数组和链表

对于解决 hash 冲突的办法： 拉链法和 线性探查法
树如果用 数组来实现就是堆

数组由于是连续紧凑型，可以随机访问，通过索引能够快速找到对应的元素，而且如果相对节约存储空间。 但正因为连续存储，内存空间必须一次性给足，时间复杂度 0(N); 如果想进行插入和删除操作，每次必须搬运后面的所有数据，时间复杂度度为 O(N);

链表因为元素不连续，靠指针指向下一个元素的位置，所以不存在数组的扩容问题；如果知道某一元素的前驱和后驱，操作指针即可删除该元素或者插入该元素，时间复杂度为 O(1); 但是正因为空间的不连续，你无法根据索引算出对应元素的地址，所以不能随机访问，而且每个元素必须存储指向前后元素位置的指针，会消耗更多的存储空间。

数据结构种类很多， 他们的目的就是无非就是不用的应用场景下高效的增删改查；

线性形式以 for/while 迭代为代表，非线性形式以递归为代表

二叉树有前中后序遍历 其实链表也有前序和后序遍历， 例如在前序遍历的时候打印 head.val 就是正序打印链表；在后序遍历的位置打印 head.val 就是倒序打印链表；
写过 web 中间件的朋友应该可以发现，中间件的调用链其实就是一个递归遍历链表的过程。
前置中间件 比如 session 的注入 在前序遍历的位置执行，
后置中间件（异常捕获）在后序遍历的位置执行
而一些中间件（计算调用总耗时）在前序和后序遍历的位置都有代码

只要是递归基本上都是树的问题

1.2 动态规划解题套路框架 1.首先，动态规划问题的一般形式就是求最值， 求解动态规划的核心问题是穷举

动态规划的穷举有点特别， 存在『重叠子问题』
所以需要『备忘录』或者『DP table』来优化穷举过程
动态规划问题一定会具备『最有子结构』，虽然穷举所有可行解并不是一件容易的事，只有列出正确的『状态转移方程』，才能正确的穷举。

要想写出正确的状态转移方程， 一定要思考以下几点： 1.这个问题的 base case（最简单情况）是什么？ 2.这个问题有什么『状态』

**但凡遇到需要递归解决的问题，最好都画出递归树。**

递归算法的的时间复杂度怎么计算？就是用子问题个数乘以解决一个子问题需要的时间。

斐波那契数列
二叉树节点总数为指数级别的，所以求子问题个数的时间复杂度为 O(2 指数 n)

自顶向下

```javascript
let fiber = function (num) {
  let cache = [];
  let fib = function (cache, num) {
    if (num <= 1) return 1;
    if (cache[num]) {
      return cache[num];
    } else {
      cache[num] = fib(cache, num - 1) + fib(cache, num - 2);
    }
    return cache[num];
  };
  return fib(cache, num);
};
console.log(fiber(200));
```

自底向上
DP table 来消除重叠子问题

```javascript
let fiber = function (n) {
  if (n === 0) return 0;
  if (n === 1 || n === 2) return 1;
  let dp = [];
  dp[1] = dp[2] = 1;
  for (let i = 3; i <= n; i++) {
    dp[i] = dp[i - 1] + dp[i - 2];
  }
  return dp[n];
};
console.log(fiber(8));
```

凑零钱

如何列出正确的状态转移方程

1. 确定 base case
2. 确定『状态』， 也就是原问题和子问题的变量
3. 确定『选择』， 也就是导致『状态』产生变化的行为
4. 明确 dp 函数、数组的定义

dp(n)的定义：输入一个目标金额 n， 返回凑出目标金额 n 的最少硬币数量

```javascript
let coinChange = function (coins, amount) {
  let dp = function (num) {
    // 确定base case
    if (num == 0) return 0;
    if (num < 1) return -1;
    let res = num;
    for (coin of coins) {
      // 确定状态
      let subProblem = dp(num - coin);
      if (subProblem === -1) continue;
      // 确定 选择
      res = Math.min(res, 1 + subProblem);
    }
    return res;
  };
  return dp(amount);
};
console.log(coinChange([1, 3, 5], 11));
```

// 带备忘录的

```javascript
let coinChange = function (coins, amount) {
  let memo = [];
  let dp = function (num) {
    // 查备忘录 避免重复计算
    if (memo[n]) return memo[n];
    // 确定base case
    if (num == 0) return 0;
    if (num < 1) return -1;
    let res = num;
    for (coin of coins) {
      // 确定状态
      let subProblem = dp(num - coin);
      if (subProblem === -1) continue;
      // 确定 选择
      res = Math.min(res, 1 + subProblem);
    }
    // 记入备忘录中
    memo[num] = res;
    return memo[num];
  };
  return dp(amount);
};
console.log(coinChange([1, 3, 5], 11));
```

DP table
dp 数组的定义： 当目标金额为 i 时，至少需要 dp[i] 枚硬币凑出;

```javascript
let coinChange = function (coins, amount) {
  let dp = function (num) {
    // 确定base case
    dp[0] == 0;
    let dp = Array.from(num);
    for (let i = 0; i < dp.length; i++) {
      for (coin of coins) {
        // 确定状态
        if (i - coin < 0) continue;
        dp[i] = Math.min(dp(i), dp[num - coin]);
      }
    }
  };
  return dp[amount] === amount + 1 ? -1 : dp[amount];
};
console.log(coinChange([1, 3, 5], 11));
```

## 回溯算法解题套路框架

解决一个回溯问题， 实际上就是决策树的遍历过程

1. 路径： 也就是已经做出的选择
1. 选择列表： 也就是你当前可以做的选择
1. 结束条件： 也就是到达决策树底层，无法在做选择的条件

1.3 回溯的算法框架
result = [];
def backtrack(路径， 选择列表)：
if 满足结束条件：
result.add(路径)
return
for 选择 in 选择列表:
做选择
backtrack(路径， 选择列表)
撤销选择

其核心就是 for 循环里面的递归，在递归调用之前『做选择』， 在递归调用之后『撤销选择』

// 全排列

我们定义的 backtrack 函数其实就像一个指针，在这颗树上遍历，同时要正确维护每个节点的属性，每当走到树的底层，其『路径』就是一个全排列

// 遍历
前序遍历的代码在进入某一个节点之前的那个时间点执行，后序遍历的代码在离开某个节点之后的那个时间点执行

我们需要在递归之前做出选择，在递归之后撤销刚才的选择

这样是回溯算法的一个特点，不像动态规划的存在重叠子问题可以优化，回溯算法就是纯暴力穷举，复杂度一般都很高。

```javascript
// 主函数，输入一组不重复的数字，返回它们的全排列
function permutation(arr) {
  var result = [];
  if (arr.length === 0) {
    return result;
  }
  var temp = [];
  backtrack(arr, temp, result);
  return result;
}
// 全排列的核心函数

// 路径：记录track中
// 选择列表： nums中不存在于track'的那些元素
// 结束条件： nums 中的元素全都在track中出现
function backtrack(nums, track, result) {
  // 触发结束条件
  if (track.length === nums.length) {
    result.push(track);
    return;
  }

  for (let i = 0; i < nums.length; i++) {
    // 排除不合法的选择
    if (track.indexOf(nums[i]) !== -1) continue;
    // 做选择
    track.push(nums[i]);
    // 进入下一层决策树
    backtrack(nums, track);
    // 取消选择
    track.pop();
  }
}
```

写 backtrack 函数时，需要维护走过的『路径』和当前可以做的『选择列表』，当触发『结束条件』时，将『路径』记入结果集。

回溯算法： 走过的『路径』、当前的『选择列表』和『结束条件』；
动态规划： 『状态』、『选择』、『base case』；

1.4 BFS 算法框架
BFS(broad first search) ，广度优先搜索和 DFS(深度优先搜索)

## BFS 算法框架套路

问题的本质就是让你在一副『图』中找到起点 start 和终点 target 的最近距离

队列需要回头，visited 的主要作用就是防止走回头路，大部分都是必需的，但是像一般的二叉树结构，没有子节点到父节点的指针，不会走回头路就不需要 visited。

寻找二叉树最小节点

```javascript
function minDepth(Q) {
  if (root == null) return 0;
  let depth = 1;
  let size = q.size();
  while (!q.isEmpty()) {
    for (let i = 0; i < size; i++) {
      let node = q.dequeue();
      if (node.left == null && node.right == null) {
        return depth;
      }
      if (node.left != null) {
        q.enqueue(node.left);
      }
      if (node.right != null) {
        q.enqueue(node.right);
      }
    }
    depth++;
  }
}
```

形象点说，DFS 是线，BFS 是面；DFS 是单打独斗，BFS 是集体行动。

既然 BFS 这么好，为什么要用 DFS？
一般来说在寻找最短路径的时候使用 BFS，其他时候用 DFS 多一些。

## 双指针技巧套路框架

双指针技巧分为两类：一类是『快、慢』指针， 一类是『左右指针』
快慢指针：主要解决链表的问题，比如典型的判定链表中是否存在包含环；后者主要解决数组（或者字符串）中的问题，比如二分搜索

1.XUNZ

```js
function hasCycle(head) {
  // 初始化快、慢指针指向头节点
  fast = slow = head;
  while (fast != null && fast.next != null) {
    // 慢指针每次走一步
    slow = slow.next;
    // 快指针每次前进两步
    fast = fast.next.next;
    if (slow == fast) {
      return true;
    }
  }
  return false;
}
```

2.寻找这个环的起始位置

```javascript
function detectCycle(head) {
  // 初始化快、慢指针指向头节点
  fast = slow = head;
  while (fast != null && fast.next != null) {
    // 慢指针每次走一步
    slow = slow.next;
    // 快指针每次前进两步
    fast = fast.next.next;
    if (slow == fast) {
      return true;
    }
  }
  slow = head;
  while (slow != fast) {
    // 两个指针以相同的速度前进
    fast = fast.next;
    slow = slow.next;
  }
  // 两个指针相遇的那个单链表节点就是环的起点
  return slow;
}
```

3.寻找无环单链表的中点

```javascript
while (fast != null && fast.next != null) {
  fast = fast.next.next;
  slow = slow.nextl;
}
return slow;
```

4. 寻找单链表的倒数第 K 个元素

```javascript
while (k-- > 0) {
  fast = fast.next;
}
while (fast != null) {
  slow = slow.next;
  fast = fast.next;
}
return slow;
```

## 左右指针的常用算法

左右指针一般运用在数组问题上，实际上是指两个索引值，一般初始化为 left = 0,right = len(nums) - 1

1.二分搜索

```JS
// 二分搜索
    function binarySearch(){
        // 左、右指针在数组的两端初始化
        var left = 0;
        var right = nums.length - 1;
        while(left <= right){
            var mid = Math.floor((left + right) / 2);
            if(nums[mid] == target){
                return mid;
            }
            if(nums[mid] < target){
                left = mid + 1;
            }else{
                right = mid - 1;
            }
        }
        return -1
    }

```

为什么 while 的循环的条件是<=,而不是<？
因为初始化 right 的时候，nums.length - 1，即最后一个元素的索引，而不是 nums.length

nums.length -1 :相当于左闭右开[left, right)，因为索引大小为 nums.length 是越界的。
nums.length: 相当于两端都闭区间[left， right]

理解下左闭右开的概念：

开闭区间是一个数学概念，开区间使用符号小括号()表示，闭区间使用符号中括号[]表示，闭区间包含了两个端点，而开区间则不包含两个端点

一共四种情况：
(a,b)：区间范围内，不包含 a 和 b
[a,b]：区间范围内，包含 a，也包含 b
(a,b]：区间范围内，不包含 a，包含 b
[a,b)：区间范围内，包含 a，不包含 b

2.两数之和

只要数组有序，就应该想到双指针技巧

```javascript
function twoSum(nums, target) {
  let left = 0;
  let right = nums.length - 1;
  while (left < right) {
    let sum = nums[left] + nums[right];
    if (sum == target) {
      //题目要求索引从1开始的
      return [left + 1, right + 1];
    } else if (sum < target) {
      left++; //让sum大一点
    } else {
      right--; // 让sum小一点
    }
  }
  return [-1, -1];
}
```

3.反转数组

```javascript
function reverseArray(nums) {
  let left = 0;
  let right = nums.length - 1;
  while (left < right) {
    let temp = nums[left];
    nums[left] = nums[right];
    nums[right] = temp;
    left++;
    right--;
  }
  return nums;
}
```

4.滑动窗口算法

1.6 二分搜索框架

```javascript
let binarySearch(){
    let left = 0; right = ...;
    while(...){
        let mid = left + (right - left) / 2;
        if(nums[mid] == target){

        } else if(nums[mid] < target)
            left = ...
        else if(nums[mid] > target){
            right = ...
        }
    }
    return ...
}

```

分析二分搜索的一个技巧是： 不要出现 else， 而是把所有情况用 else if 写清楚，这样可以清楚展现所有细节。
js 中找 mid 的 有以下几种形式

```JS
    var point = Math.ceil(arr.length / 2);
    let mid = Math.round((leftIndex + rightIndex) / 2);
    let mid = left + (right -left) / 2  // 解决 left 和 right 太大 溢出
```

1. 寻找一个数（基本的二分搜索）

2. 寻找左侧边界的二分搜索

搜索左、右边界的二分搜索算法和常规二分搜索算法的区别。让搜索区间变成左闭右开

模板总结：

1. 分析二分搜索代码，不要出现 else，全部展开改成 else if，方便理解。
1. 主义『搜索区间』和 while 的终止条件，搞清楚『搜索区间』的开闭情况非常重要，left 和 right 的更新完全取决与『搜索区间』，如果存在漏掉的元素，记得在最后检查。
1. 若需要定义左闭右开的『搜索区间』搜索左、右边界，只要在 nums【mid】==target 时做修改即可，搜索右侧边界时需要减一。
1. 如果将『搜索区间』全都统一成两端都闭，好记，只要稍微改 nums[mid]==target 条件处的代码和函数返回的代码逻辑即可。

## 滑动窗口算法框架

```javascript
function slidingWindow(s, t) {
  var left = 0;
  right = 0;
  var valid = 0;
  while (right < s.length) {
    if (s[right] == t) {
      valid++;
    }
    // 右移窗口
    right++;
    // 进行窗口内数据的一系列更新
    //...
    if (valid > 0) {
      valid--;
    }
    // 判断左侧窗口是否要收缩
    while (window < s.length && valid < 0) {
      if (s[left] == t) {
        valid++;
      }
      left++;
      // ...
    }
  }
}
```

首先，初始化 window 和 needs 两个哈希表，记录窗口中的字符和需要凑齐的字符：

```JS
function minWindow(s, t) {
   var needs = {}; // 需要凑齐的字符
   var window = {}; //窗口中字符
   for(let a of t){
       //统计需要的字符
       needs[a] = (needs[a] || 0) + 1;
   }
   var left = 0; right = 0, valid = 0;
   // 最小覆盖子串的起始索引及长度
   var start = 0, min =  Number.MAX_VALUE;
   while(right < s.length){
       // 即将移入窗口的字符
       var c = s[right];
       // 其中valid变量表示窗口中满足needs条件的字符个数，如果valid和needs.length的大小相同，则说明窗口以满足条件，已经完全覆盖子串
       right++;
       if(needs[c]){
           // 当前字符在需要的字符中，则更新当前窗口统计
           window[c] = (window[c] || 0) + 1;
           if(window[c] == needs[c]){
               // 当前窗口和需要的字符匹配时，验证数量增加1
               valid++;
           }

       }
       // 判断左侧窗口是否要收缩，当验证数量与需要的字符个数一直时，就应该收缩窗口了
       while(valid == Object.keys(needs).length){
           // 更新最小覆盖子串
           if(right - left < min){
               start = left;
               min = right - left;
           }
           // d是将移出窗口的字符
           var d = s[left];
           left++;
           //进行窗口内数据的一系列更新
           if(needs[d]){
               if(window[d] == needs[d]){
                   valid--;
               }
               window[d]--;
           }
       }
   }
   //返回最小覆盖子串
   return min == Number.MAX_VALUE ? "" : s.substr(start, min);
}
```

套用模板：

1. 当移动 right 扩大窗口，即加入字符时，应该更新哪些数据？ 2.什么条件下，窗口应该暂停扩大，开始移动 left 缩小窗口？ 3.当移动 left 缩小窗口，即移除字符时，应该更新哪些数据？ 4.我们要的结果应该在扩大窗口时还是缩小窗口时进行更新？
