/**
 * 题目标题：两数之和
 * 题目类型：算法题
 * 难度：简单
 *
 * 题目描述：
 * 给定一个整数数组 nums 和一个整数 target，
 * 请你在数组中找出和为目标值 target 的那两个整数，
 * 并返回它们的数组下标。
 *
 * 你可以假设每种输入只会对应一个答案，
 * 并且同一个元素不能重复使用。
 *
 * 举例说明：
 * 输入：
 * nums = [2, 7, 11, 15], target = 9
 *
 * 输出：
 * [0, 1]
 *
 * 解释：
 * 因为 nums[0] + nums[1] === 9，
 * 所以返回 [0, 1]。
 *
 * 作答要求：
 * 1. 返回两个元素的下标，而不是元素本身
 * 2. 同一个元素不能重复使用
 * 3. 尽量将时间复杂度优化到 O(n)
 *
 * 测试说明：
 * 1. 直接在下方答题区补全实现
 * 2. 运行 node 01-question.js
 * 3. 对照“实际结果”和“预期结果”判断是否正确
 */

// TODO: 在这里完成你的实现 双指针
// export function twoSum(nums, target) {
//   let left = 0;
//   let right = nums.length - 1;

//   while (left < right) {
//     if (nums[left] + nums[right] === target) {
//       return [left, right];
//     } else if (nums[left] + nums[right] > target) {
//       right--;
//     } else {
//       left++;
//     }
//   }
// }

// TODO: 在这里完成你的实现 遍历
export function twoSum(nums, target) {
  const map = new Map();
  for (let index = 0; index < nums.length; index++) {
    const v = nums[index];
    const x = target - v;

    if (map.has(x)) {
      return [map.get(x), index];
    }

    map.set(v, index);
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

try {
  runExample();
} catch (error) {
  console.error("001-两数之和 01-question.js: 请先完成 TODO");
  console.error(error.message);
}
