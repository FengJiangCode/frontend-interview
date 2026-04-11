/**
 * 题目标题：有效的括号
 * 题目类型：算法题
 * 难度：简单
 *
 * 解题思路：
 * 这道题非常适合用栈来做。
 * 因为括号匹配天然符合“后进先出”的特点：
 * 最后出现的左括号，必须最先被匹配掉。
 *
 * 遍历字符串时：
 * 1. 遇到左括号，就压入栈中
 * 2. 遇到右括号，就取出栈顶元素判断能否匹配
 * 3. 如果不能匹配，或者栈已经空了，直接返回 false
 *
 * 最后如果整个字符串遍历结束，栈也正好为空，
 * 才说明所有括号都正确匹配。
 *
 * 时间复杂度：
 * O(n)
 *
 * 空间复杂度：
 * O(n)
 *
 * 复杂度如何计算：
 * 假设字符串长度为 n，
 * 我们只遍历一次字符串，每个字符最多入栈和出栈一次，
 * 所以时间复杂度是 O(n)。
 * 最坏情况下所有字符都是左括号，需要全部压栈，
 * 因此额外空间复杂度是 O(n)。
 *
 * 关键边界情况：
 * 1. 字符串一开始就是右括号，比如 `]`，应直接返回 false
 * 2. 像 `([)]` 这种顺序错误的情况不能只看数量，要看栈顶是否匹配
 * 3. 遍历结束后如果栈不为空，说明还有左括号未闭合
 *
 * 面试追问：
 * 1. 为什么这道题天然适合用栈？
 * 2. 如果只统计括号数量，为什么不够？
 * 3. 这道题能不能用递归来做？为什么面试里更常写栈？
 */

export function isValid(s) {
  const stack = [];
  const map = {
    ")": "(",
    "]": "[",
    "}": "{",
  };

  for (let i = 0; i < s.length; i += 1) {
    const char = s[i];

    if (char === "(" || char === "[" || char === "{") {
      stack.push(char);
      continue;
    }

    if (stack.pop() !== map[char]) {
      return false;
    }
  }

  return stack.length === 0;
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

runExample();
