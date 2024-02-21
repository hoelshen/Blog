/**
 * Definition for a binary tree node.
 * function TreeNode(val, left, right) {
 *     this.val = (val===undefined ? 0 : val)
 *     this.left = (left===undefined ? null : left)
 *     this.right = (right===undefined ? null : right)
 * }
 */
/**
 * @param {TreeNode} root
 * @return {number[]}
 */
var inorderTraversal = function (root) {
  const arr = [];
  const findRoot = (root) => {
      if (!root) return;
      findRoot(root.left);
      arr.push(root.val);
      findRoot(root.right);
  }
  findRoot(root);
  return arr
};