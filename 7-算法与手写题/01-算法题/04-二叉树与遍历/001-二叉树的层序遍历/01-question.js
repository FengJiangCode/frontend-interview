/**
 * 题目标题：二叉树的层序遍历
 * 题目类型：算法题
 * 难度：中级
 *
 * 题目描述：
 * 给你一棵二叉树的根节点 root，
 * 请你按层从上到下遍历这棵树，
 * 并返回每一层节点值组成的二维数组。
 *
 * 举例说明：
 * 输入：
 * root = [3, 9, 20, null, null, 15, 7]
 *
 * 输出：
 * [[3], [9, 20], [15, 7]]
 *
 * 解释：
 * 第 1 层是 [3]
 * 第 2 层是 [9, 20]
 * 第 3 层是 [15, 7]
 *
 * 作答要求：
 * 1. 尽量使用迭代方式实现
 * 2. 时间复杂度尽量做到 O(n)
 * 3. 说明为什么这道题适合使用队列
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

// TODO: 在这里完成你的实现 递归
// export function levelOrder(root) {
//   const x = 0
//   const res = []

//   if(!root) return []

//   function fn (node,x){
//     if (res[x]) {
//       res[x].push(node.val)
//     }else(
//       res[x] = [node.val]
//     )
//     if (node.left) {
//       fn(node.left,x+1)
//     }
//     if (node.right) {
//       fn(node.right,x+1)
//     }
//   }

//   fn(root,x)

//   return res
// }

// TODO: 在这里完成你的实现 队列
export function levelOrder(root) {
  const res = []
  if(!root) return res

  const queue = [root]

  while(queue.length){
    const l = queue.length
    const arr = []

    for (let index = 0; index < l; index++) {
      const node = queue.shift()
      arr.push(node.val)

      if (node.left) {
        queue.push(node.left)
      }

      if (node.right) {
        queue.push(node.right)
      }
    }

    res.push(arr)
  }


  return res
  
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

try {
  runExample();
} catch (error) {
  console.error("001-二叉树的层序遍历 01-question.js: 请先完成 TODO");
  console.error(error.message);
}
