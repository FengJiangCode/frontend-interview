/**
 * 题目标题：有效的括号
 * 题目类型：算法题
 * 难度：简单
 *
 * 题目描述：
 * 给定一个只包括 `(`、`)`、`[`、`]`、`{`、`}` 的字符串 `s`，
 * 判断字符串是否有效。
 *
 * 有效字符串需要满足：
 * 1. 左括号必须用相同类型的右括号闭合
 * 2. 左括号必须以正确的顺序闭合
 * 3. 每个右括号都必须有一个对应的左括号
 *
 * 举例说明：
 * 输入：
 * s = "()[]{}"
 *
 * 输出：
 * true
 *
 * 解释：
 * 每一个左括号都能按正确顺序找到对应的右括号，所以字符串有效。
 *
 * 作答要求：
 * 1. 尽量将时间复杂度优化到 O(n)
 * 2. 说明为什么这道题适合使用栈
 * 3. 注意处理提前出现右括号的情况
 *
 * 测试说明：
 * 1. 直接在下方答题区补全实现
 * 2. 运行 node 01-question.js
 * 3. 对照“实际结果”和“预期结果”判断是否正确
 */

// TODO: 在这里完成你的实现
export function isValid(s) {
  const map = new Map([
    ["(", ")"],
    ["[", "]"],
    ["{", "}"],
  ]);

  const stack = [];
  for (let index = 0; index < s.length; index++) {
    const element = s[index];
    if (map.has(element)) {
      stack.push(element);
    } else {
      const last = stack.pop();
      if (map.get(last) !== element) {
        return false;
      }
    }
  }

  return !stack.length;
}

function runExample() {
  const s = "()[]{}";
  const actual = isValid(s);
  const expected = true;

  console.log("题目：有效的括号");
  console.log("测试用例输入:", s);
  console.log("实际结果:", actual);
  console.log("预期结果:", expected);
}

try {
  runExample();
} catch (error) {
  console.error("001-有效的括号 01-question.js: 请先完成 TODO");
  console.error(error.message);
}
