1.

最底层的就是数组和链表

对于解决hash冲突的办法： 拉链法和 线性探查法
树如果用 数组来实现就是堆

数组由于是连续紧凑型，可以随机访问，通过索引能够快速找到对应的元素，而且如果相对节约存储空间。 但正因为连续存储，内存空间必须一次性给足，时间复杂度0(N); 如果想进行插入和删除操作，每次必须搬运后面的所有数据，时间复杂度度为O(N);

链表因为元素不连续，靠指针指向下一个元素的位置，所以不存在数组的扩容问题；如果知道某一元素的前驱和后驱，操作指针即可删除该元素或者插入该元素，时间复杂度为O(1); 但是正因为空间的不连续，你无法根据索引算出对应元素的地址，所以不能随机访问，而且每个元素必须存储指向前后元素位置的指针，会消耗更多的存储空间。

数据结构种类很多， 他们的目的就是无非就是不用的应用场景下高效的增删改查；

线性形式以for/while 迭代为代表，非线性形式以递归为代表

二叉树有前中后序遍历 其实链表也有前序和后序遍历， 例如在前序遍历的时候打印 head.val 就是正序打印链表；在后序遍历的位置打印head.val就是倒序打印链表；
写过web中间件的朋友应该可以发现，中间件的调用链其实就是一个递归遍历链表的过程。
前置中间件 比如session的注入 在前序遍历的位置执行，
后置中间件（异常捕获）在后序遍历的位置执行
而一些中间件（计算调用总耗时）在前序和后序遍历的位置都有代码

只要是递归基本上都是树的问题

1.2 动态规划解题套路框架
1.首先，动态规划问题的一般形式就是求最值， 求解动态规划的核心问题是穷举

动态规划的穷举有点特别， 存在『重叠子问题』
所以需要『备忘录』或者『DP table』来优化穷举过程
动态规划问题一定会具备『最有子结构』，虽然穷举所有可行解并不是一件容易的事，只有列出正确的『状态转移方程』，才能正确的穷举。

要想写出正确的状态转移方程， 一定要思考以下几点：
1.这个问题的base case（最简单情况）是什么？
2.这个问题有什么『状态』

但凡遇到需要递归解决的问题，最好都画出递归树。

递归算法的的时间复杂度怎么计算？就是用子问题个数乘以解决一个子问题需要的时间。

斐波那契数列
二叉树节点总数为指数级别的，所以求子问题个数的时间复杂度为O(2指数n)

自顶向下

```javascript
let fiber = function(num){
    let cache = [];
    let fib = function (cache, num) {
        if(num <= 1) return 1;
        if(cache[num]){
            return cache[num]
        } else {
           cache[num] = fib(cache,num - 1) + fib(cache, num - 2);;
        }
        return cache[num];
    };
    return fib(cache, num)
};
console.log(fiber(200));
```

自底向上
DP table 来消除重叠子问题

```javascript
let fiber = function(n){
    if(n ===0) return 0;
    if(n ===1 || n ===2) return 1;
    let dp = [];
    dp[1] = dp[2] = 1;
    for(let i = 3; i <= n; i++){
      dp[i] = dp[i -1] + dp[i-2]
    }
    return dp[n];
};
console.log(fiber(8));


```

凑零钱

如何列出正确的状态转移方程

1. 确定base case
2. 确定『状态』， 也就是原问题和子问题的变量
3. 确定『选择』， 也就是导致『状态』产生变化的行为
4. 明确dp函数、数组的定义

dp(n)的定义：输入一个目标金额n， 返回凑出目标金额n的最少硬币数量

```javascript
let coinChange = function (coins, amount){
    let dp = function(num){
        // 确定base case
        if(num == 0) return 0;
        if(num < 1) return -1;
        let res = num;
        for(coin of coins){
            // 确定状态
            let subProblem = dp(num - coin);
            if(subProblem === -1) continue ;
            // 确定 选择
            res = Math.min(res, 1+subProblem);
        } 
        return res
    }
    return dp(amount)
}
console.log(coinChange([1,3,5], 11));
```

// 带备忘录的

```javascript
let coinChange = function (coins, amount){
    let memo = [];
    let dp = function(num){
        // 查备忘录 避免重复计算
        if(memo[n]) return memo[n];
        // 确定base case
        if(num == 0) return 0;
        if(num < 1) return -1;
        let res = num;
        for(coin of coins){
            // 确定状态
            let subProblem = dp(num - coin);
            if(subProblem === -1) continue ;
            // 确定 选择
            res = Math.min(res, 1+subProblem);
        } 
        // 记入备忘录中
        memo[num] = res;
        return memo[num]
    }
    return dp(amount)
}
console.log(coinChange([1,3,5], 11));
```

DP table
dp数组的定义： 当目标金额为i时，至少需要dp[i] 枚硬币凑出;

```javascript
let coinChange = function (coins, amount){
    let dp = function(num){
        // 确定base case
        dp[0] == 0;
        let dp = Array.from(num);
        for(let i = 0; i < dp.length; i++){
            for(coin of coins){
                // 确定状态
                if(i - coin < 0) continue ;
                dp[i] = Math.min(dp(i), dp[num - coin]);
            } 
         
        }
    }
    return  dp[amount] === amount+1 ? -1 : dp[amount]
}
console.log(coinChange([1,3,5], 11));
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

其核心就是for循环里面的递归，在递归调用之前『做选择』， 在递归调用之后『撤销选择』

// 全排列

我们定义的backtrack 函数其实就像一个指针，在这颗树上遍历，同时要正确维护每个节点的属性，每当走到树的底层，其『路径』就是一个全排列

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
  if(track.length === nums.length){
    result.push(track);
    return;
  }

  for( let i = 0; i <nums.length; i++){
    // 排除不合法的选择
    if(track.indexOf(nums[i]) !== -1) continue;
    // 做选择
    track.push(nums[i]);
    // 进入下一层决策树
    backtrack(nums, track);
    // 取消选择
    track.pop();
  }
};
```

写backtrack函数时，需要维护走过的『路径』和当前可以做的『选择列表』，当触发『结束条件』时，将『路径』记入结果集。

回溯算法：  走过的『路径』、当前的『选择列表』和『结束条件』；
动态规划： 『状态』、『选择』、『base case』；

1.4 BFS算法框架
 BFS(broad first search) ，广度优先搜索和DFS(深度优先搜索)

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

分析二分搜索的一个技巧是： 不要出现else， 而是把所有情况用else if写清楚，这样可以清楚展现所有细节。
js 中找mid的 有以下几种形式

``````JS
    var point = Math.ceil(arr.length / 2);
    let mid = Math.round((leftIndex + rightIndex) / 2);
    let mid = left + (right -left) / 2  // 解决 left 和 right 太大 溢出
```
