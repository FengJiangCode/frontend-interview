/**
 * 题目标题：三数之和
 * 题目类型：算法题
 * 难度：中级
 *
 * 解题思路：
 * 这道题最常见的做法是：
 * 先排序，再固定一个数，剩下两个数用双指针去找。
 *
 * 排序之后有两个关键好处：
 * 1. 可以用双指针根据和的大小来收缩范围
 * 2. 可以更方便地做去重，避免重复三元组
 *
 * 具体做法是：
 * 1. 先将数组升序排序
 * 2. 枚举第一个数 nums[i]
 * 3. 在 i 右侧使用 left 和 right 两个指针寻找另外两个数
 * 4. 如果三数之和小于 0，left 右移
 * 5. 如果三数之和大于 0，right 左移
 * 6. 如果三数之和等于 0，记录答案，并跳过重复值
 *
 * 时间复杂度：
 * O(n^2)
 *
 * 空间复杂度：
 * O(log n) 或 O(n)
 *
 * 复杂度如何计算：
 * 排序通常需要 O(n log n)。
 * 外层遍历一次数组，内层双指针总共线性移动，
 * 所以整体主复杂度是 O(n^2)。
 *
 * 如果排序使用原地排序，额外空间主要来自排序实现本身，
 * 可视具体引擎实现理解为 O(log n) 到 O(n)。
 *
 * 关键边界情况：
 * 1. 数组长度小于 3 时，应直接返回 []
 * 2. 存在多个重复元素时，必须正确去重
 * 3. 全部为正数或全部为负数时，结果应为空
 *
 * 面试追问：
 * 1. 为什么这道题不能直接三层循环？
 * 2. 去重应该在哪几个位置做？
 * 3. 如果题目变成四数之和，思路怎么扩展？
 */

export function threeSum(nums) {
  const result = [];
  nums.sort((a, b) => a - b);

  for (let i = 0; i < nums.length - 2; i += 1) {
    if (i > 0 && nums[i] === nums[i - 1]) {
      continue;
    }

    if (nums[i] > 0) {
      break;
    }

    let left = i + 1;
    let right = nums.length - 1;

    while (left < right) {
      const sum = nums[i] + nums[left] + nums[right];

      if (sum === 0) {
        result.push([nums[i], nums[left], nums[right]]);

        while (left < right && nums[left] === nums[left + 1]) {
          left += 1;
        }

        while (left < right && nums[right] === nums[right - 1]) {
          right -= 1;
        }

        left += 1;
        right -= 1;
      } else if (sum < 0) {
        left += 1;
      } else {
        right -= 1;
      }
    }
  }

  return result;
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

runExample();
