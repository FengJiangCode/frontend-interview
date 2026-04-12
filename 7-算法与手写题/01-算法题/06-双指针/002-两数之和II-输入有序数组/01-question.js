/**
 * 题目标题：两数之和 II - 输入有序数组
 * 题目类型：算法题
 * 难度：简单
 *
 * 题目描述：
 * 给定一个从小到大有序的整数数组 numbers 和一个目标值 target，
 * 请你从数组中找出两个数，使它们之和等于目标值，
 * 并返回它们的下标。
 *
 * 注意：
 * 1. 返回的下标从 1 开始计数
 * 2. 题目保证有且仅有一个解
 * 3. 同一个元素不能重复使用
 *
 * 举例说明：
 * 输入：
 * numbers = [2, 7, 11, 15], target = 9
 *
 * 输出：
 * [1, 2]
 *
 * 解释：
 * numbers[0] + numbers[1] = 2 + 7 = 9
 * 因为下标从 1 开始计数，所以返回 [1, 2]
 *
 * 作答要求：
 * 1. 尽量使用双指针实现
 * 2. 时间复杂度尽量做到 O(n)
 * 3. 说明为什么这题和普通“两数之和”解法不同
 *
 * 测试说明：
 * 1. 直接在下方答题区补全实现
 * 2. 运行 node 01-question.js
 * 3. 对照“实际结果”和“预期结果”判断是否正确
 */

// TODO: 在这里完成你的实现
export function twoSum(numbers, target) {
  let l = 0
  let r = numbers.length -1

  while(l<r){
    if (numbers[l] + numbers[r] === target) {
      return [l+1, r+1]
    }else if(numbers[l] + numbers[r] >target){
      r--
    }else{
      l++
    }
  }
  return []
}

function runExample() {
  const numbers = [2, 7, 11, 15];
  const target = 9;
  const actual = twoSum(numbers, target);
  const expected = [1, 2];

  console.log("题目：两数之和 II - 输入有序数组");
  console.log("测试用例输入:", { numbers, target });
  console.log("实际结果:", actual);
  console.log("预期结果:", expected);
}

try {
  runExample();
} catch (error) {
  console.error("002-两数之和II-输入有序数组 01-question.js: 请先完成 TODO");
  console.error(error.message);
}
