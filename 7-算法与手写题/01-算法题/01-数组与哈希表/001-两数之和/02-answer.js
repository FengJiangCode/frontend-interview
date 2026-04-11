/**
 * 题目标题：两数之和
 * 题目类型：算法题
 * 难度：简单
 *
 * 解题思路：
 * 这道题最直接的想法是两层循环，
 * 枚举每一对数字，判断它们的和是否等于 target。
 * 但这样时间复杂度是 O(n^2)。
 *
 * 更优的做法是使用哈希表。
 * 我们在遍历数组时，先计算当前数字还缺多少才能凑成 target，
 * 再去哈希表中查这个“差值”是否已经出现过。
 * 如果出现过，说明已经找到了答案；
 * 如果没有，就把当前数字和它的下标存进哈希表，继续往后遍历。
 *
 * 这样每个元素只需要处理一次，
 * 就能把整体时间复杂度降到 O(n)。
 *
 * 时间复杂度：
 * O(n)
 *
 * 空间复杂度：
 * O(n)
 *
 * 复杂度如何计算：
 * 假设数组长度为 n，
 * 我们只遍历数组一次，每次查哈希表和写哈希表都是平均 O(1)，
 * 所以总时间复杂度是 O(n)。
 * 额外使用了一个哈希表来存已经访问过的数字和下标，
 * 最多存 n 个元素，所以空间复杂度是 O(n)。
 *
 * 关键边界情况：
 * 1. 数组中可能有重复数字，比如 [3, 3]
 * 2. 返回的是下标，不是数字本身
 * 3. 同一个元素不能重复使用，所以要先查再存
 *
 * 面试追问：
 * 1. 如果数组已经有序，能不能用双指针做？
 * 2. 为什么这里要先查哈希表，再把当前值存进去？
 * 3. 暴力解法和哈希表解法的复杂度差异在哪里？
 */

export function twoSum(nums, target) {
  const map = new Map();

  for (let i = 0; i < nums.length; i += 1) {
    const current = nums[i];
    const rest = target - current;

    if (map.has(rest)) {
      return [map.get(rest), i];
    }

    map.set(current, i);
  }

  return [];
}

function runExample() {
  const nums = [2, 7, 11, 15];
  const target = 9;
  const actual = twoSum(nums, target);
  const expected = [0, 1];

  console.log("题目：两数之和");
  console.log("测试用例输入:", { nums, target });
  console.log("实际结果:", actual);
  console.log("预期结果:", expected);
}

runExample();
