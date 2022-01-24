74. 搜索二维矩阵

编写一个高效的算法来判断 m x n 矩阵中，是否存在一个目标值。该矩阵具有如下特性：

每行中的整数从左到右按升序排列。
每行的第一个整数大于前一行的最后一个整数。

```js
/**
 * @param {number[][]} matrix
 * @param {number} target
 * @return {boolean}
 */
var searchMatrix = function(matrix, target) {
  // 先循环第一层 接着定位第一层的位 寻找大小
  for(let i = 0; i < matrix.length; i++) {
  
    for(let j = 0; j < matrix[i].length; j++){
      while(target < matrix[i][j]){

      }
    }
  }
};


searchMatrix([[1,3,5,7],[10,11,16,20],[23,30,34,60]], 3)
```

// 这里面有两个要思考的点
// 第二行 比 第一行要高  
// 每行都是升序

// 贪心算法

```js
var findNumberIn2DArray = function(matrix, target){
  if(!matrix.length) return false
  let x = matrix.length - 1, y = 0;
  while(x >= 0 && y<matrix[0].length){
    if(matrix[x][y] === target){
      return true;
    } else if(matrix[x][y] > target){
      x--;
    } else {
      y++;
    }
  }
  return false
}
```