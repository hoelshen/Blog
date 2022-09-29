// 二维数组中的查找

// var findNumberIn2DArray = function (arr, target) {
//   // 切割每一行 或者到最后一位元素 判断 target 是不是在当前行
//   let num = 0
//   while (num < arr.length) {
//     const itemArr = arr[num];
//     // 7 < 9
//     if (itemArr[itemArr.length - 1] < target) {
//       // 可能在这一行
//       for (let i = 0; i < itemArr.length; i++) {
//         if (itemArr[i] == target) {
//           return true;
//         }
//       }
//       num++
//     } else if (itemArr[itemArr.length - 1] > target) {
//       // 10 > 9
//       num++;
//     }
//   }
//   return false
// }

var findNumberIn2DArray = function (matrix, target) {
  if (!matrix.length) return false;
  let x = matrix.length - 1,
    y = 0;
  while (x >= 0 && y < matrix[0].length) {
    if (matrix[x][y] === target) {
      return true;
    } else if (matrix[x][y] > target) {
      x--;
    } else {
      y++;
    }
  }
  return false;
};