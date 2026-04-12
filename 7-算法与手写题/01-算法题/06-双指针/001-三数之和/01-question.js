/**
 * 题目标题：三数之和
 * 题目类型：算法题
 * 难度：中级
 *
 * 题目描述：
 * 给定一个整数数组 nums，
 * 请你找出所有和为 0 且不重复的三元组。
 *
 * 你需要返回所有满足以下条件的结果：
 * 1. 三元组中的三个元素来自数组中的不同位置
 * 2. 三个数之和等于 0
 * 3. 结果中不能包含重复的三元组
 *
 * 举例说明：
 * 输入：
 * nums = [-1, 0, 1, 2, -1, -4]
 *
 * 输出：
 * [[-1, -1, 2], [-1, 0, 1]]
 *
 * 解释：
 * -1 + -1 + 2 = 0
 * -1 + 0 + 1 = 0
 *
 * 作答要求：
 * 1. 尽量将时间复杂度优化到 O(n^2)
 * 2. 说明为什么这道题通常先排序
 * 3. 注意去重逻辑，避免结果中出现重复三元组
 *
 * 测试说明：
 * 1. 直接在下方答题区补全实现
 * 2. 运行 node 01-question.js
 * 3. 对照“实际结果”和“预期结果”判断是否正确
 */

// TODO: 在这里完成你的实现
export function threeSum(nums) {
  
  const sortArr = nums.sort((a,b)=> a - b )
  const res = []

  for (let index = 0; index < sortArr.length - 2; index++) {
    const target = sortArr[index];

    if(index>0 && sortArr[index] === sortArr[index-1]) continue

    if (target>0) break

    let l = index +1
    let r = sortArr.length - 1

    while(l<r){
      if (sortArr[l]+ sortArr[r] + target === 0) {
        res.push([target,sortArr[l],sortArr[r]])

        while(l<r && sortArr[r]=== sortArr[r-1]){r--}

        while(l<r && sortArr[l]=== sortArr[l+1]){l++}
        
        l++
        r--
      }else if(sortArr[l] + sortArr[r] + target < 0){
        l++
      }else{
        r--
      }
    }
    
  }
  return res
}

function runExample() {
  const nums = [-1, 0, 1, 2, -1, -4];
  const actual = threeSum(nums);
  const expected = [[-1, -1, 2], [-1, 0, 1]];

  console.log("题目：三数之和");
  console.log("测试用例输入:", nums);
  console.log("实际结果:", JSON.stringify(actual));
  console.log("预期结果:", JSON.stringify(expected));
}

try {
  runExample();
} catch (error) {
  console.error("001-三数之和 01-question.js: 请先完成 TODO");
  console.error(error.message);
}
