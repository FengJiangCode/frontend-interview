/**
 * 题目标题：二叉树的最大深度
 * 题目类型：算法题
 * 难度：简单
 *
 * 解题思路：
 * 这道题最适合用“从下往上算高度”的递归。
 *
 * 你可以把函数 maxDepth(root) 理解成：
 * “返回以 root 为根的这棵树，最多有多少层。”
 *
 * 那么每次做的事情其实只有 3 步：
 * 1. 先去算左子树有多深
 * 2. 再去算右子树有多深
 * 3. 取两边更深的那个，再加上当前节点这一层
 *
 * 所以状态关系是：
 * maxDepth(root) = Math.max(左子树深度, 右子树深度) + 1
 *
 * 递归终止条件：
 * 当节点为空时，说明已经没有层数了，返回 0。
 *
 * 时间复杂度：
 * O(n)
 *
 * 空间复杂度：
 * O(h)
 *
 * 复杂度如何计算：
 * 假设二叉树有 n 个节点，
 * 每个节点只会被访问一次，
 * 所以时间复杂度是 O(n)。
 *
 * 递归调用栈的深度取决于树的高度 h，
 * 所以空间复杂度是 O(h)。
 * 最坏情况下树退化成链表，可视为 O(n)。
 *
 * 关键边界情况：
 * 1. 空树时返回 0
 * 2. 只有一个根节点时返回 1
 * 3. 左右子树深度不一致时，取较大值
 *
 * 面试追问：
 * 1. 为什么空节点返回 0？
 * 2. 为什么最后要 +1？
 * 3. 这道题能不能用层序遍历实现？
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

export function maxDepth(root) {
  if (!root) {
    return 0;
  }

  const leftDepth = maxDepth(root.left);
  const rightDepth = maxDepth(root.right);

  return Math.max(leftDepth, rightDepth) + 1;
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

runExample();
