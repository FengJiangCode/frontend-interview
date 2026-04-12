/**
 * 题目标题：买卖股票的最佳时机
 * 题目类型：算法题
 * 难度：简单
 *
 * 解题思路：
 * 这道题可以用贪心来做。
 *
 * 核心思路是：
 * 在遍历数组的过程中，
 * 持续维护“到当前为止出现过的最低价格”，
 * 并在每一天尝试用“当天价格 - 最低价格”更新最大利润。
 *
 * 也就是说：
 * 1. 如果今天价格更低，就把它记为新的最低买入价
 * 2. 如果今天价格更高，就尝试作为卖出价，更新最大利润
 *
 * 这样就能保证：
 * 买入一定发生在卖出之前，
 * 并且每一天都在尝试得到最优结果。
 *
 * 时间复杂度：
 * O(n)
 *
 * 空间复杂度：
 * O(1)
 *
 * 复杂度如何计算：
 * 只遍历一次 prices 数组，
 * 每个元素只处理一次，所以时间复杂度是 O(n)。
 * 只使用了常数个额外变量，因此空间复杂度是 O(1)。
 *
 * 关键边界情况：
 * 1. 数组为空时应返回 0
 * 2. 价格一直下降时应返回 0
 * 3. 买入必须在卖出之前，不能颠倒顺序
 *
 * 面试追问：
 * 1. 为什么这道题适合用贪心？
 * 2. 为什么不能先找最大值再找最小值？
 * 3. 如果允许买卖多次，这题会怎么变？
 */

export function maxProfit(prices) {
  if (!prices.length) {
    return 0;
  }

  let minPrice = prices[0];
  let maxProfitValue = 0;

  for (let i = 1; i < prices.length; i += 1) {
    if (prices[i] < minPrice) {
      minPrice = prices[i];
    } else {
      maxProfitValue = Math.max(maxProfitValue, prices[i] - minPrice);
    }
  }

  return maxProfitValue;
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

runExample();
