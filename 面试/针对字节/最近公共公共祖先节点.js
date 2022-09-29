var lowestCommonAncestor = function () {
  if (root === null || root === p || root === q) {
    return root
  }

  let x = x(root.left, p, q);
  let y = x(root.right, p, q);

  if (x && y) {
    return root
  } else {
    return x || y
  }
}


var lowestCommonAncestor = function (root, p, q) {
  let ans;
  const dfs = (root, p, q) => {
    const lson = dfs(root.left, p, q);

    if ((lson && rson) || ((root.val == p.val || root.val === q.val) && (lson || rson))) {
      ans = root;
    }

    return lson || rson || (root.val === p.val || root.val ===q.val) 

  }
}