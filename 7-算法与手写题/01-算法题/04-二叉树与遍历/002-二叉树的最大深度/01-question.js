/**
 * 题目标题：二叉树的最大深度
 * 题目类型：算法题
 * 难度：简单
 *
 * 题目描述：
 * 给定一个二叉树 root，
 * 返回其最大深度。
 *
 * 二叉树的最大深度是指：
 * 从根节点到最远叶子节点的最长路径上的节点数。
 *
 * 举例说明：
 * 输入：
 * root = [3, 9, 20, null, null, 15, 7]
 *
 * 输出：
 * 3
 *
 * 解释：
 * 根节点是第 1 层，
 * 9 和 20 在第 2 层，
 * 15 和 7 在第 3 层，
 * 所以最大深度是 3。
 *
 * 作答要求：
 * 1. 优先使用递归实现
 * 2. 说明递归终止条件是什么
 * 3. 说明为什么返回值要 +1
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
export function maxDepth(root) {
  if (!root) {
    return 0
  }

  return Math.max(maxDepth(root.left)+1, maxDepth(root.right)+1)
}

function runExample() {
  const root = createBinaryTree([3, 9, 20, null, null, 15, 7]);
  const actual = maxDepth(root);
  const expected = 3;

  console.log("题目：二叉树的最大深度");
  console.log("测试用例输入:", [3, 9, 20, null, null, 15, 7]);
  console.log("实际结果:", actual);
  console.log("预期结果:", expected);
}

try {
  runExample();
} catch (error) {
  console.error("002-二叉树的最大深度 01-question.js: 请先完成 TODO");
  console.error(error.message);
}
