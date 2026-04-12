/**
 * 题目标题：爬楼梯
 * 题目类型：算法题
 * 难度：简单
 *
 * 题目描述：
 * 假设你正在爬楼梯。
 * 需要 n 阶你才能到达楼顶。
 *
 * 每次你可以爬 1 阶或者 2 阶。
 * 请问有多少种不同的方法可以爬到楼顶？
 *
 * 举例说明：
 * 输入：
 * n = 2
 *
 * 输出：
 * 2
 *
 * 解释：
 * 1. 1 阶 + 1 阶
 * 2. 2 阶
 *
 * 额外示例：
 * n = 3 -> 3
 *
 * 作答要求：
 * 1. 尽量使用动态规划思路实现
 * 2. 时间复杂度尽量做到 O(n)
 * 3. 说明状态转移方程为什么成立
 *
 * 测试说明：
 * 1. 直接在下方答题区补全实现
 * 2. 运行 node 01-question.js
 * 3. 对照“实际结果”和“预期结果”判断是否正确
 */

// TODO: 在这里完成你的实现
export function climbStairs(n) {
  const dp = [0,1,2]

  for (let index = 3; index <= n; index++) {
    dp[index] = dp[index-2] + dp[index-1]
  }

  return dp[n]
}

function runExample() {
  const n = 3;
  const actual = climbStairs(n);
  const expected = 3;

  console.log("题目：爬楼梯");
  console.log("测试用例输入:", n);
  console.log("实际结果:", actual);
  console.log("预期结果:", expected);
}

try {
  runExample();
} catch (error) {
  console.error("001-爬楼梯 01-question.js: 请先完成 TODO");
  console.error(error.message);
}
