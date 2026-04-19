/**
 * 题目标题：大数相加
 * 题目类型：算法题
 * 难度：简单
 *
 * 解题思路：
 * 这道题的关键是模拟小学里的竖式加法。
 * 因为数字可能非常大，不能直接转成 Number，
 * 所以我们需要从字符串的末尾开始，一位一位相加。
 *
 * 具体做法是使用两个指针，
 * 分别指向 num1 和 num2 的最后一位。
 * 每次取出当前位数字，再加上进位 carry，
 * 得到本轮的和 sum。
 *
 * 当前位应该放入结果中的数字是 sum % 10，
 * 新的进位是 Math.floor(sum / 10)。
 * 持续循环，直到两个字符串都遍历完，并且没有剩余进位。
 *
 * 时间复杂度：
 * O(n)
 *
 * 空间复杂度：
 * O(n)
 *
 * 复杂度如何计算：
 * 假设较长字符串的长度为 n。
 * 我们最多从右到左遍历每一位一次，所以时间复杂度是 O(n)。
 * 结果字符串或结果数组最多保存 n + 1 位数字，所以空间复杂度是 O(n)。
 *
 * 关键边界情况：
 * 1. 两个字符串长度不同，例如 "456" 和 "77"
 * 2. 最后一位仍然有进位，例如 "999" 和 "1"
 * 3. 某一边已经遍历结束后，另一边还没结束
 * 4. 输入为 "0" 和 "0" 时，结果应为 "0"
 *
 * 面试追问：
 * 1. 如果要实现大数相减，你会怎么处理借位？
 * 2. 如果输入可能包含前导零，比如 "0012"，要不要先规范化？
 * 3. 为什么这题不能依赖 Number 类型？
 * 4. 如果要实现大数相乘，思路会和这题有什么不同？
 */

export function addStrings(num1, num2) {
  let i = num1.length - 1;
  let j = num2.length - 1;
  let carry = 0;
  const result = [];

  while (i >= 0 || j >= 0 || carry > 0) {
    const digit1 = i >= 0 ? num1[i] - "0" : 0;
    const digit2 = j >= 0 ? num2[j] - "0" : 0;
    const sum = digit1 + digit2 + carry;

    result.push(sum % 10);
    carry = Math.floor(sum / 10);
    i -= 1;
    j -= 1;
  }

  return result.reverse().join("");
}

function runExample() {
  const examples = [
    { num1: "11", num2: "123" },
    { num1: "456", num2: "77" },
    { num1: "999", num2: "1" },
    { num1: "0", num2: "0" },
  ];

  console.log("题目：大数相加");

  for (const { num1, num2 } of examples) {
    console.log(`${num1} + ${num2} =`, addStrings(num1, num2));
  }
}

runExample();
