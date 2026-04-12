/**
 * 题目标题：买卖股票的最佳时机
 * 题目类型：算法题
 * 难度：简单
 *
 * 题目描述：
 * 给定一个数组 prices，
 * 其中 prices[i] 表示某支股票第 i 天的价格。
 *
 * 你只能选择某一天买入，
 * 并在未来的某一天卖出。
 * 请你计算所能获得的最大利润。
 *
 * 如果你不能获得任何利润，返回 0。
 *
 * 举例说明：
 * 输入：
 * prices = [7, 1, 5, 3, 6, 4]
 *
 * 输出：
 * 5
 *
 * 解释：
 * 第 2 天买入，价格是 1
 * 第 5 天卖出，价格是 6
 * 最大利润是 6 - 1 = 5
 *
 * 额外示例：
 * prices = [7, 6, 4, 3, 1] -> 0
 *
 * 作答要求：
 * 1. 时间复杂度尽量做到 O(n)
 * 2. 说明为什么这道题适合用贪心思路
 * 3. 注意买入必须发生在卖出之前
 *
 * 测试说明：
 * 1. 直接在下方答题区补全实现
 * 2. 运行 node 01-question.js
 * 3. 对照“实际结果”和“预期结果”判断是否正确
 */

// TODO: 在这里完成你的实现
export function maxProfit(prices) {
  let min = null
  let res = 0

  for (let index = 0; index < prices.length; index++) {
    const element = prices[index];
    if (index === 0) {
      min = element
    } else {
      min = Math.min(min,element)
    }
    
    res = Math.max(res,element - min)
  }

  return res
}

function runExample() {
  const prices = [7, 1, 5, 3, 6, 4];
  const actual = maxProfit(prices);
  const expected = 5;

  console.log("题目：买卖股票的最佳时机");
  console.log("测试用例输入:", prices);
  console.log("实际结果:", actual);
  console.log("预期结果:", expected);
}

try {
  runExample();
} catch (error) {
  console.error("001-买卖股票的最佳时机 01-question.js: 请先完成 TODO");
  console.error(error.message);
}
