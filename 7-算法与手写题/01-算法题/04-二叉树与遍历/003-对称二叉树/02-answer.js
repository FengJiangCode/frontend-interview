/**
 * 题目标题：对称二叉树
 * 题目类型：算法题
 * 难度：简单
 *
 * 解题思路：
 * 这道题适合用递归判断两棵子树是否互为镜像。
 *
 * 关键不是只比较左右子树的根节点值，
 * 而是要成对比较：
 * 1. 左子树的左节点和右子树的右节点
 * 2. 左子树的右节点和右子树的左节点
 *
 * 也就是说，
 * 如果两棵树互为镜像，
 * 那么它们外侧对应节点和内侧对应节点都必须相等。
 *
 * 可以定义递归函数：
 * isMirror(left, right)
 *
 * 它表示：
 * 以 left 和 right 为根的两棵树是否互为镜像。
 *
 * 递归终止条件：
 * 1. left 和 right 都为空，返回 true
 * 2. 只有一个为空，返回 false
 * 3. 两个节点值不相等，返回 false
 *
 * 递归关系：
 * isMirror(left, right)
 * = isMirror(left.left, right.right)
 *   && isMirror(left.right, right.left)
 *
 * 时间复杂度：
 * O(n)
 *
 * 空间复杂度：
 * O(h)
 *
 * 复杂度如何计算：
 * 每个节点最多访问一次，
 * 所以时间复杂度是 O(n)。
 *
 * 递归调用栈深度取决于树的高度 h，
 * 所以空间复杂度是 O(h)。
 * 最坏情况下树退化成链表，可视为 O(n)。
 *
 * 关键边界情况：
 * 1. 空树本身是对称的，返回 true
 * 2. 一个节点为空、另一个不为空时，返回 false
 * 3. 节点值相同但子树结构不同，也不是对称树
 *
 * 面试追问：
 * 1. 为什么不能只比较左右子树的值？
 * 2. 为什么这道题适合写成双节点递归？
 * 3. 这道题能不能用队列迭代实现？
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

function isMirror(left, right) {
  if (!left && !right) {
    return true;
  }

  if (!left || !right) {
    return false;
  }

  if (left.val !== right.val) {
    return false;
  }

  return isMirror(left.left, right.right) && isMirror(left.right, right.left);
}

export function isSymmetric(root) {
  if (!root) {
    return true;
  }

  return isMirror(root.left, root.right);
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

runExample();
