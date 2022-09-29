// 二叉树层序遍历

const helpFun = function (root, level, array) {
  if (root === null) return;
  if (!array[level]) {
    array[level] = []
  }
  // 存放该层的数据
  array[level].push(root.val);
  helpFun(root.left, level + 1, array);
  helpFun(root.right, level + 1, array);
}


const levelOrder = function(root){
  if (root === null) return [];
  // 全局数组
  var array = [];
  // 遍历第一层
  helpFun(root, 0, array);
  return array
}