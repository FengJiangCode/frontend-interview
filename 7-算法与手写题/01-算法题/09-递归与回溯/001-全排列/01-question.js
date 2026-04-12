/**
 * 题目标题：全排列
 * 题目类型：算法题
 * 难度：中级
 *
 * 题目描述：
 * 给定一个不含重复数字的数组 nums，
 * 返回其所有可能的全排列。
 *
 * 你可以按任意顺序返回答案。
 *
 * 举例说明：
 * 输入：
 * nums = [1, 2, 3]
 *
 * 输出：
 * [
 *   [1, 2, 3],
 *   [1, 3, 2],
 *   [2, 1, 3],
 *   [2, 3, 1],
 *   [3, 1, 2],
 *   [3, 2, 1]
 * ]
 *
 * 作答要求：
 * 1. 使用递归与回溯思路实现
 * 2. 说明“路径、选择列表、结束条件”分别是什么
 * 3. 注意回溯时要恢复现场
 *
 * 测试说明：
 * 1. 直接在下方答题区补全实现
 * 2. 运行 node 01-question.js
 * 3. 对照“实际结果”和“预期结果”判断是否正确
 */

// TODO: 在这里完成你的实现
export function permute(nums) {
  void nums;
  throw new Error("TODO: 请在 01-question.js 中完成实现");
}

function runExample() {
  const nums = [1, 2, 3];
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
  console.log("实际结果:", JSON.stringify(actual));
  console.log("预期结果:", JSON.stringify(expected));
}

try {
  runExample();
} catch (error) {
  console.error("001-全排列 01-question.js: 请先完成 TODO");
  console.error(error.message);
}
