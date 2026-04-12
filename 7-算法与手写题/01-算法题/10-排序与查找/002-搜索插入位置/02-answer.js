/**
 * 题目标题：搜索插入位置
 * 题目类型：算法题
 * 难度：简单
 *
 * 解题思路：
 * 这道题本质上还是二分查找，
 * 只是目标不再只是“找到它”，
 * 还要在找不到时返回它应该插入的位置。
 *
 * 做法和普通二分查找很像：
 * 1. 如果 nums[mid] === target，直接返回 mid
 * 2. 如果 nums[mid] < target，说明目标只能在右半边，left = mid + 1
 * 3. 如果 nums[mid] > target，说明目标只能在左半边，right = mid - 1
 *
 * 当循环结束时，left 会停在“第一个大于等于 target 的位置”。
 * 如果 target 不存在，
 * 这个位置正好就是它应该插入的位置。
 *
 * 所以找不到时直接返回 left 即可。
 *
 * 时间复杂度：
 * O(log n)
 *
 * 空间复杂度：
 * O(1)
 *
 * 复杂度如何计算：
 * 每次比较都能排除掉一半区间，
 * 所以时间复杂度是 O(log n)。
 *
 * 只使用了 left、right、mid 这几个额外变量，
 * 所以空间复杂度是 O(1)。
 *
 * 关键边界情况：
 * 1. target 比所有元素都小，最后返回 0
 * 2. target 比所有元素都大，最后返回 nums.length
 * 3. target 不存在但在中间，返回中间某个插入点
 *
 * 面试追问：
 * 1. 为什么循环结束后可以直接返回 left？
 * 2. 这题和普通二分查找的区别是什么？
 * 3. 这题能不能用递归写？
 */

export function searchInsert(nums, target) {
  let left = 0;
  let right = nums.length - 1;

  while (left <= right) {
    const mid = left + Math.floor((right - left) / 2);

    if (nums[mid] === target) {
      return mid;
    }

    if (nums[mid] < target) {
      left = mid + 1;
    } else {
      right = mid - 1;
    }
  }

  return left;
}

function runExample() {
  const nums = [1, 3, 5, 6];
  const target = 2;
  const actual = searchInsert(nums, target);
  const expected = 1;

  console.log("题目：搜索插入位置");
  console.log("测试用例输入:", nums, "target =", target);
  console.log("实际结果:", actual);
  console.log("预期结果:", expected);
}

runExample();
