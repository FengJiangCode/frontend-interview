/**
 * 题目标题：爬楼梯
 * 题目类型：算法题
 * 难度：简单
 *
 * 解题思路：
 * 这道题是动态规划的经典入门题。
 *
 * 如果要到达第 n 阶，
 * 最后一步只有两种可能：
 * 1. 从第 n - 1 阶爬 1 步上来
 * 2. 从第 n - 2 阶爬 2 步上来
 *
 * 所以到达第 n 阶的方法数，
 * 就等于到达第 n - 1 阶的方法数
 * 加上到达第 n - 2 阶的方法数。
 *
 * 状态转移方程：
 * dp[n] = dp[n - 1] + dp[n - 2]
 *
 * 这和斐波那契数列非常像。
 *
 * 时间复杂度：
 * O(n)
 *
 * 空间复杂度：
 * O(1)
 *
 * 复杂度如何计算：
 * 只需要从 3 遍历到 n，
 * 每一步做常数次运算，
 * 所以时间复杂度是 O(n)。
 *
 * 这里只保留前两个状态，
 * 没有开辟长度为 n 的数组，
 * 所以空间复杂度是 O(1)。
 *
 * 关键边界情况：
 * 1. n = 1 时，只有 1 种方法
 * 2. n = 2 时，有 2 种方法
 * 3. n 较大时，仍然按递推公式计算
 *
 * 面试追问：
 * 1. 为什么这道题像斐波那契数列？
 * 2. 如果每次可以爬 1、2、3 阶，应该怎么改？
 * 3. 为什么可以把空间复杂度从 O(n) 优化到 O(1)？
 */

export function climbStairs(n) {
  if (n <= 2) {
    return n;
  }

  let prev2 = 1;
  let prev1 = 2;

  for (let i = 3; i <= n; i += 1) {
    const current = prev1 + prev2;
    prev2 = prev1;
    prev1 = current;
  }

  return prev1;
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

runExample();
