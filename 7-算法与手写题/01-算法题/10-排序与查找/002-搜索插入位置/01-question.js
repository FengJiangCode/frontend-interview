/**
 * 题目标题：搜索插入位置
 * 题目类型：算法题
 * 难度：简单
 *
 * 题目描述：
 * 给定一个升序排列的整数数组 nums，
 * 和一个目标值 target。
 *
 * 如果目标值存在于数组中，返回它的下标；
 * 如果不存在，返回它将会被按顺序插入的位置。
 *
 * 你必须使用时间复杂度为 O(log n) 的算法。
 *
 * 举例说明：
 * 输入：
 * nums = [1, 3, 5, 6]
 * target = 5
 *
 * 输出：
 * 2
 *
 * 再比如：
 * nums = [1, 3, 5, 6]
 * target = 2
 *
 * 输出：
 * 1
 *
 * 作答要求：
 * 1. 优先使用二分查找实现
 * 2. 时间复杂度尽量做到 O(log n)
 * 3. 说明为什么找不到时可以返回 left
 *
 * 测试说明：
 * 1. 直接在下方答题区补全实现
 * 2. 运行 node 01-question.js
 * 3. 对照“实际结果”和“预期结果”判断是否正确
 */

// TODO: 在这里完成你的实现
export function searchInsert(nums, target) {
  let l = 0
  let r = nums.length-1

  while(l<=r){
    const mid = l + Math.floor((r-l)/2)
    if (nums[mid]===target) {
        return mid
    }else if (nums[mid]>target) {
        r = mid - 1
    }else{
        l = mid + 1
    }
  }

  return l

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

try {
  runExample();
} catch (error) {
  console.error("002-搜索插入位置 01-question.js: 请先完成 TODO");
  console.error(error.message);
}
