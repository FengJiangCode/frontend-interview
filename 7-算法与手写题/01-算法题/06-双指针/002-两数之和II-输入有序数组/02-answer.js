/**
 * 题目标题：两数之和 II - 输入有序数组
 * 题目类型：算法题
 * 难度：简单
 *
 * 解题思路：
 * 这道题和普通“两数之和”最大的区别是：
 * 输入数组已经有序。
 *
 * 因为数组有序，
 * 我们可以使用双指针：
 * 1. left 指向数组开头
 * 2. right 指向数组结尾
 * 3. 如果两数之和等于 target，直接返回结果
 * 4. 如果两数之和小于 target，说明需要更大的数，left 右移
 * 5. 如果两数之和大于 target，说明需要更小的数，right 左移
 *
 * 这样每一步都能利用有序性缩小范围，
 * 不需要像普通“两数之和”那样依赖哈希表。
 *
 * 时间复杂度：
 * O(n)
 *
 * 空间复杂度：
 * O(1)
 *
 * 复杂度如何计算：
 * left 和 right 两个指针最多各移动 n 次，
 * 所以整体时间复杂度是 O(n)。
 * 只使用了常数个额外变量，因此空间复杂度是 O(1)。
 *
 * 关键边界情况：
 * 1. 数组只有两个元素时也要能正确处理
 * 2. 返回值下标从 1 开始，而不是从 0 开始
 * 3. 不能重复使用同一个元素
 *
 * 面试追问：
 * 1. 为什么这题适合用双指针？
 * 2. 如果数组无序，为什么双指针不成立？
 * 3. 这题和普通“两数之和”在解法上有什么差异？
 */

export function twoSum(numbers, target) {
  let left = 0;
  let right = numbers.length - 1;

  while (left < right) {
    const sum = numbers[left] + numbers[right];

    if (sum === target) {
      return [left + 1, right + 1];
    }

    if (sum < target) {
      left += 1;
    } else {
      right -= 1;
    }
  }

  return [];
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

runExample();
