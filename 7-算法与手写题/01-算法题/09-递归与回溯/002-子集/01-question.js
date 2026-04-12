/**
 * 题目标题：子集
 * 题目类型：算法题
 * 难度：简单
 *
 * 题目描述：
 * 给定一个整数数组 nums，
 * 数组中的元素互不相同。
 *
 * 请你返回该数组所有可能的子集。
 *
 * 你可以按任意顺序返回答案。
 *
 * 举例说明：
 * 输入：
 * nums = [1, 2, 3]
 *
 * 输出：
 * [
 *   [],
 *   [1],
 *   [2],
 *   [3],
 *   [1, 2],
 *   [1, 3],
 *   [2, 3],
 *   [1, 2, 3]
 * ]
 *
 * 作答要求：
 * 1. 优先使用递归与回溯实现
 * 2. 说明 path 和 start 分别表示什么
 * 3. 注意回溯时要恢复现场
 *
 * 测试说明：
 * 1. 直接在下方答题区补全实现
 * 2. 运行 node 01-question.js
 * 3. 对照“实际结果”和“预期结果”判断是否正确
 */

// TODO: 在这里完成你的实现
export function subsets(nums) {
  void nums;
  throw new Error("TODO: 请在 01-question.js 中完成实现");
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

try {
  runExample();
} catch (error) {
  console.error("002-子集 01-question.js: 请先完成 TODO");
  console.error(error.message);
}
