/**
 * 题目标题：大数相加
 * 题目类型：算法题
 * 难度：简单
 *
 * 题目描述：
 * 给定两个非负整数字符串 num1 和 num2，
 * 请你实现一个 addStrings(num1, num2) 函数，
 * 返回它们相加后的结果字符串。
 *
 * 要求不能直接把整个字符串转成数字后再相加，
 * 也不能使用 BigInt。
 * 你需要自己模拟“竖式加法”的过程，处理逐位相加和进位。
 *
 * 举例说明：
 * 输入：
 * num1 = "11", num2 = "123"
 *
 * 输出：
 * "134"
 *
 * 再比如：
 * addStrings("456", "77") => "533"
 * addStrings("999", "1") => "1000"
 *
 * 作答要求：
 * 1. 不能使用 BigInt，也不能整体转成 Number
 * 2. 需要从低位开始逐位相加
 * 3. 需要正确处理不同长度的字符串
 * 4. 需要正确处理最后一位进位
 * 5. 尽量将时间复杂度优化到 O(n)
 *
 * 测试说明：
 * 1. 直接在下方答题区补全实现
 * 2. 运行 node 01-question.js
 * 3. 对照“实际结果”和“预期结果”判断是否正确
 */

// TODO: 在这里完成你的实现
export function addStrings(num1, num2) {
  let l1 = num1.length - 1
  let l2 = num2.length - 1
  let s = 0
  const result = []

  while (s || l1>=0 || l2>=0){
    const n1 = l1>=0 ? Number(num1[l1]) : 0
    const n2 = l2>=0 ? Number(num2[l2]) : 0
    const x = n1 + n2 + s
    
    const r = x % 10
    s = Math.floor(x/10)

    result.push(r)
    l1 = l1 - 1
    l2 = l2 - 1 
  }

  return result.reverse().join('')
}

function runExample() {
  const examples = [
    { num1: "11", num2: "123", expected: "134" },
    { num1: "456", num2: "77", expected: "533" },
    { num1: "999", num2: "1", expected: "1000" },
  ];

  console.log("题目：大数相加");

  for (const { num1, num2, expected } of examples) {
    const actual = addStrings(num1, num2);
    console.log("测试用例输入:", { num1, num2 });
    console.log("实际结果:", actual);
    console.log("预期结果:", expected);
  }
}

try {
  runExample();
} catch (error) {
  console.error("002-大数相加 01-question.js: 请先完成 TODO");
  console.error(error.message);
}
