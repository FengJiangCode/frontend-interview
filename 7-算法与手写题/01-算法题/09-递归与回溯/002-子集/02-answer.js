/**
 * 题目标题：子集
 * 题目类型：算法题
 * 难度：简单
 *
 * 解题思路：
 * 这道题非常适合刚开始学习回溯时练手。
 *
 * 因为它不需要像全排列那样维护 used 数组，
 * 也不用处理元素顺序问题。
 *
 * 你只需要理解两件事：
 * 1. path：当前已经选进子集的元素
 * 2. start：下一轮从哪个位置开始选
 *
 * 回溯过程可以理解成：
 * 先把当前 path 收集到结果里，
 * 然后从 start 开始，
 * 依次尝试把后面的每个数字放进 path，
 * 递归进入下一层后，
 * 再把这个数字撤销掉，继续试下一个。
 *
 * 这道题和全排列最大的不同是：
 * 全排列关心顺序，
 * 子集不关心顺序。
 *
 * 所以这里用 start 来保证：
 * 每次都只往后选，
 * 不会重复走回头路。
 *
 * 时间复杂度：
 * O(n * 2^n)
 *
 * 空间复杂度：
 * O(n)
 *
 * 复杂度如何计算：
 * 一个长度为 n 的数组一共有 2^n 个子集，
 * 每次收集答案时最多需要拷贝 n 个元素，
 * 所以时间复杂度是 O(n * 2^n)。
 *
 * 递归调用栈和 path 的最大长度都是 n，
 * 所以额外空间复杂度是 O(n)。
 *
 * 关键边界情况：
 * 1. nums 为空时，结果应该是 [[]]
 * 2. 每一层都要先收集当前 path，因为任何阶段都构成一个合法子集
 * 3. 回溯后必须 pop，否则路径会污染后续结果
 *
 * 面试追问：
 * 1. 为什么这题每一层都要收集 path？
 * 2. 为什么用 start 就能避免重复？
 * 3. 如果数组里有重复元素，应该怎么改？
 */

export function subsets(nums) {
  const result = [];
  const path = [];

  function backtrack(start) {
    result.push([...path]);

    for (let i = start; i < nums.length; i += 1) {
      path.push(nums[i]);
      backtrack(i + 1);
      path.pop();
    }
  }

  backtrack(0);
  return result;
}

function runExample() {
  const nums = [1, 2, 3];
  const actual = subsets(nums);
  const expected = [
    [],
    [1],
    [1, 2],
    [1, 2, 3],
    [1, 3],
    [2],
    [2, 3],
    [3],
  ];

  console.log("题目：子集");
  console.log("测试用例输入:", nums);
  console.log("实际结果:", JSON.stringify(actual));
  console.log("预期结果:", JSON.stringify(expected));
}

runExample();
