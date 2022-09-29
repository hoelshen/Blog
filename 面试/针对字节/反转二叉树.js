var invertTree = function (root) {
  if(root === null) return root
    const node = root.left;
    root.left = root.right;
    root.right = node;
    root.left && invertTree(root.left);
    root.right && invertTree(root.right);
  return root
}