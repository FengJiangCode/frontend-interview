/**
 * 题目标题：全排列
 * 题目类型：算法题
 * 难度：中级
 *
 * 解题思路：
 * 这道题是递归与回溯的经典题。
 *
 * 如果第一次接触回溯，
 * 更容易理解的方式是把问题想成：
 * 当前已经选好的部分叫 path，
 * 当前还没选的数字叫 rest。
 *
 * 每次从 rest 里拿一个数字放到 path 后面，
 * 再递归处理剩下的数字。
 * 当 rest 为空时，说明得到了一组完整排列。
 *
 * 这种“path + rest”的写法更直观，
 * 但会频繁创建新数组。
 *
 * 更标准的面试写法是：
 * 1. 路径 path：当前已经选出来的排列
 * 2. used 数组：标记哪些数字已经被使用过
 * 3. 结束条件：当 path.length === nums.length 时，说明得到了一组完整排列
 *
 * 两种写法本质是一样的，
 * 只是 used 写法更节省空间，也更常见于面试。
 *
 * 时间复杂度：
 * O(n * n!)
 *
 * 空间复杂度：
 * O(n)
 *
 * 复杂度如何计算：
 * 一共有 n! 种排列，
 * 每生成一种排列都需要拷贝长度为 n 的路径，
 * 所以时间复杂度是 O(n * n!)。
 *
 * 递归栈深度和 used 数组、path 数组长度最多都是 n，
 * 所以额外空间复杂度是 O(n)。
 *
 * 关键边界情况：
 * 1. nums 只有一个元素时，应返回 [[nums[0]]]
 * 2. nums 为空时，可返回 [[]] 或 []，通常按题目输入范围默认至少有一个元素
 * 3. 必须在递归返回后恢复现场，否则结果会出错
 *
 * 面试追问：
 * 1. 为什么回溯时一定要撤销选择？
 * 2. 如果数组中有重复元素，应该怎么去重？
 * 3. 回溯和 DFS 的关系是什么？
 */

export function permuteEasy(nums) {
  const result = [];

  function backtrack(path, rest) {
    if (rest.length === 0) {
      result.push(path);
      return;
    }

    for (let i = 0; i < rest.length; i += 1) {
      const current = rest[i];
      const newPath = [...path, current];
      const newRest = [...rest.slice(0, i), ...rest.slice(i + 1)];

      backtrack(newPath, newRest);
    }
  }

  backtrack([], nums);
  return result;
}

export function permute(nums) {
  const result = [];
  const path = [];
  const used = new Array(nums.length).fill(false);

  function backtrack() {
    if (path.length === nums.length) {
      result.push([...path]);
      return;
    }

    for (let i = 0; i < nums.length; i += 1) {
      if (used[i]) {
        continue;
      }

      path.push(nums[i]);
      used[i] = true;

      backtrack();

      path.pop();
      used[i] = false;
    }
  }

  backtrack();
  return result;
}

function runExample() {
  const nums = [1, 2, 3];
  const easyActual = permuteEasy(nums);
  const actual = permute(nums);
  const expected = [
    [1, 2, 3],
    [1, 3, 2],
    [2, 1, 3],
    [2, 3, 1],
    [3, 1, 2],
    [3, 2, 1],
  ];

  console.log("题目：全排列");
  console.log("测试用例输入:", nums);
  console.log("易懂版结果:", JSON.stringify(easyActual));
  console.log("实际结果:", JSON.stringify(actual));
  console.log("预期结果:", JSON.stringify(expected));
}

runExample();
