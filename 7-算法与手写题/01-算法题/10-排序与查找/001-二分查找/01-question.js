/**
 * 题目标题：二分查找
 * 题目类型：算法题
 * 难度：简单
 *
 * 题目描述：
 * 给定一个升序排列的整数数组 nums，
 * 和一个目标值 target。
 *
 * 请你在数组中找到目标值的下标，
 * 如果目标值不存在，返回 -1。
 *
 * 举例说明：
 * 输入：
 * nums = [-1, 0, 3, 5, 9, 12]
 * target = 9
 *
 * 输出：
 * 4
 *
 * 再比如：
 * nums = [-1, 0, 3, 5, 9, 12]
 * target = 2
 *
 * 输出：
 * -1
 *
 * 作答要求：
 * 1. 优先使用二分查找实现
 * 2. 时间复杂度尽量做到 O(log n)
 * 3. 说明 left、right、mid 分别表示什么
 *
 * 测试说明：
 * 1. 直接在下方答题区补全实现
 * 2. 运行 node 01-question.js
 * 3. 对照“实际结果”和“预期结果”判断是否正确
 */

// TODO: 在这里完成你的实现 递归版
// export function search(nums, target) {


//   function find(left,right){
//     const mid = left + Math.floor((right-left)/2)

//     if(left>right) return -1

//     if (nums[mid] === target) {
//       return mid
//     } else if (nums[mid]>target){
//       return find(left,mid-1)
//     }else{
//       return find(mid + 1,right)
//     }
//   }

//   return find(0, nums.length-1)
// }

// TODO: 在这里完成你的实现 循环版
export function search(nums, target) {
  let l = 0
  let r = nums.length - 1

  while(l<=r){
    const mid = l + Math.floor((r-l)/2)

    if (nums[mid]===target) {
      return mid
    } else if (nums[mid]>target){
      r = mid -1
    }else{
      l = mid + 1
    }
  }

  return -1
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

try {
  runExample();
} catch (error) {
  console.error("001-二分查找 01-question.js: 请先完成 TODO");
  console.error(error.message);
}
