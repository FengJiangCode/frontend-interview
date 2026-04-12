/**
 * 题目标题：二分查找
 * 题目类型：算法题
 * 难度：简单
 *
 * 解题思路：
 * 这道题的关键前提是：
 * 数组已经按升序排列。
 *
 * 所以每次取中间位置 mid 之后，
 * 都可以根据 nums[mid] 和 target 的大小关系，
 * 直接排除掉一半区间。
 *
 * 具体做法是：
 * 1. 用 left 表示当前查找区间的左边界
 * 2. 用 right 表示当前查找区间的右边界
 * 3. 每次计算中间下标 mid
 * 4. 如果 nums[mid] === target，直接返回 mid
 * 5. 如果 nums[mid] < target，说明目标只可能在右半边，left = mid + 1
 * 6. 如果 nums[mid] > target，说明目标只可能在左半边，right = mid - 1
 *
 * 当 left > right 时，
 * 说明查找区间已经为空，目标不存在，返回 -1。
 *
 * 时间复杂度：
 * O(log n)
 *
 * 空间复杂度：
 * O(1)
 *
 * 复杂度如何计算：
 * 每次比较后都能排除掉一半区间，
 * 所以查找次数大约是 log n 级别，
 * 时间复杂度为 O(log n)。
 *
 * 只使用了常数个额外变量 left、right、mid，
 * 所以空间复杂度为 O(1)。
 *
 * 关键边界情况：
 * 1. 数组为空时，直接返回 -1
 * 2. 目标值在最左边或最右边时，也要能正确命中
 * 3. 循环条件通常写成 left <= right，避免漏掉最后一个元素
 *
 * 面试追问：
 * 1. 为什么二分查找一定要求有序数组？
 * 2. 为什么这里用 left <= right，而不是 left < right？
 * 3. mid 为什么常写成 left + Math.floor((right - left) / 2)？
 */

export function search(nums, target) {
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

  return -1;
}

function runExample() {
  const nums = [-1, 0, 3, 5, 9, 12];
  const target = 9;
  const actual = search(nums, target);
  const expected = 4;

  console.log("题目：二分查找");
  console.log("测试用例输入:", nums, "target =", target);
  console.log("实际结果:", actual);
  console.log("预期结果:", expected);
}

runExample();
