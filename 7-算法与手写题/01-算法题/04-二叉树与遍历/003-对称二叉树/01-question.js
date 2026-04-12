/**
 * 题目标题：对称二叉树
 * 题目类型：算法题
 * 难度：简单
 *
 * 题目描述：
 * 给定一个二叉树 root，
 * 检查它是否是轴对称的。
 *
 * 也就是说，
 * 判断这棵树是否和自己的镜像完全一致。
 *
 * 举例说明：
 * 输入：
 * root = [1, 2, 2, 3, 4, 4, 3]
 *
 * 输出：
 * true
 *
 * 解释：
 * 左子树和右子树互为镜像，
 * 所以这棵树是对称的。
 *
 * 再比如：
 * root = [1, 2, 2, null, 3, null, 3]
 *
 * 输出：
 * false
 *
 * 作答要求：
 * 1. 优先使用递归实现
 * 2. 说明递归函数的参数分别表示什么
 * 3. 说明为什么要成对比较两个节点
 *
 * 测试说明：
 * 1. 直接在下方答题区补全实现
 * 2. 运行 node 01-question.js
 * 3. 对照“实际结果”和“预期结果”判断是否正确
 */

class TreeNode {
  constructor(val = 0, left = null, right = null) {
    this.val = val;
    this.left = left;
    this.right = right;
  }
}

function createBinaryTree(arr) {
  if (!arr.length || arr[0] == null) {
    return null;
  }

  const root = new TreeNode(arr[0]);
  const queue = [root];
  let index = 1;

  while (queue.length && index < arr.length) {
    const node = queue.shift();

    if (index < arr.length && arr[index] != null) {
      node.left = new TreeNode(arr[index]);
      queue.push(node.left);
    }
    index += 1;

    if (index < arr.length && arr[index] != null) {
      node.right = new TreeNode(arr[index]);
      queue.push(node.right);
    }
    index += 1;
  }

  return root;
}

// TODO: 在这里完成你的实现
export function isSymmetric(root) {
  function fn (left,right){
    if (!left && !right) {
      return true
    }

    if (!left || !right) {
      return false
    }

    if (left.val !== right.val) {
      return false
    }

    return fn(left.left,right.right) && fn(left.right,right.left)
  }

  if (!root) {
    return true
  }
  
  return fn(root.left,root.right)
}

function runExample() {
  const root = createBinaryTree([1, 2, 2, 3, 4, 4, 3]);
  const actual = isSymmetric(root);
  const expected = true;

  console.log("题目：对称二叉树");
  console.log("测试用例输入:", [1, 2, 2, 3, 4, 4, 3]);
  console.log("实际结果:", actual);
  console.log("预期结果:", expected);
}

try {
  runExample();
} catch (error) {
  console.error("003-对称二叉树 01-question.js: 请先完成 TODO");
  console.error(error.message);
}
