/**
 * 题目标题：二叉树的层序遍历
 * 题目类型：算法题
 * 难度：中级
 *
 * 解题思路：
 * 这道题的关键是“按层遍历”，
 * 而按层处理节点最自然的结构就是队列。
 *
 * 先把根节点放入队列，
 * 然后每次取出当前层的所有节点，
 * 依次记录它们的值，
 * 并把它们的左右子节点加入队列，
 * 这样就能一层一层地完成遍历。
 *
 * 为了区分“当前层有多少个节点”，
 * 每轮循环开始时先记录队列长度 size，
 * 这个 size 就表示当前层的节点数。
 * 处理完这 size 个节点后，
 * 就得到了当前层的结果。
 *
 * 时间复杂度：
 * O(n)
 *
 * 空间复杂度：
 * O(n)
 *
 * 复杂度如何计算：
 * 假设二叉树一共有 n 个节点，
 * 每个节点只会进入队列一次、出队一次，
 * 所以总时间复杂度是 O(n)。
 *
 * 队列在最宽的一层可能会同时存放较多节点，
 * 最坏情况下需要 O(n) 的额外空间，
 * 因此空间复杂度是 O(n)。
 *
 * 关键边界情况：
 * 1. 空树时应返回 []
 * 2. 只有根节点时应返回 [[root.val]]
 * 3. 某些节点缺少左子树或右子树时也要正确处理
 *
 * 面试追问：
 * 1. 为什么这道题适合用队列，而不是栈？
 * 2. 如果要求自底向上层序遍历，该怎么改？
 * 3. 如果要求锯齿形层序遍历，该怎么改？
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

export function levelOrder(root) {
  if (!root) {
    return [];
  }

  const result = [];
  const queue = [root];

  while (queue.length) {
    const size = queue.length;
    const level = [];

    for (let i = 0; i < size; i += 1) {
      const node = queue.shift();
      level.push(node.val);

      if (node.left) {
        queue.push(node.left);
      }

      if (node.right) {
        queue.push(node.right);
      }
    }

    result.push(level);
  }

  return result;
}

function runExample() {
  const root = createBinaryTree([3, 9, 20, null, null, 15, 7]);
  const actual = levelOrder(root);
  const expected = [[3], [9, 20], [15, 7]];

  console.log("题目：二叉树的层序遍历");
  console.log("测试用例输入:", [3, 9, 20, null, null, 15, 7]);
  console.log("实际结果:", JSON.stringify(actual));
  console.log("预期结果:", JSON.stringify(expected));
}

runExample();
