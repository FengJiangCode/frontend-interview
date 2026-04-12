/**
 * 题目标题：最长不重复子串
 * 题目类型：算法题
 * 难度：中级
 *
 * 题目描述：
 * 给定一个字符串 s，
 * 请你找出其中不含有重复字符的最长子串的长度。
 *
 * 举例说明：
 * 输入：
 * s = "abcabcbb"
 *
 * 输出：
 * 3
 *
 * 解释：
 * 最长不重复子串是 "abc"，
 * 所以长度为 3。
 *
 * 额外示例：
 * 1. s = "bbbbb" -> 1
 * 2. s = "pwwkew" -> 3
 *
 * 作答要求：
 * 1. 尽量将时间复杂度优化到 O(n)
 * 2. 说明为什么这道题适合使用滑动窗口
 * 3. 注意处理重复字符出现在窗口内部的情况
 *
 * 测试说明：
 * 1. 直接在下方答题区补全实现
 * 2. 运行 node 01-question.js
 * 3. 对照“实际结果”和“预期结果”判断是否正确
 */

// TODO: 在这里完成你的实现
export function lengthOfLongestSubstring(s) {


  let length = 0
  let l = 0
  let r = 0
  const set = new Set()
  while(r<s.length){
    
    while(set.has(s[r])){
      set.delete[s[l]]
      l++
    }

    set.add(s[r])
    r++
  }
  return length
}

function runExample() {
  const s = "abcabcbb";
  const actual = lengthOfLongestSubstring(s);
  const expected = 3;

  console.log("题目：最长不重复子串");
  console.log("测试用例输入:", s);
  console.log("实际结果:", actual);
  console.log("预期结果:", expected);
}

try {
  runExample();
} catch (error) {
  console.error("001-最长不重复子串 01-question.js: 请先完成 TODO");
  console.error(error.message);
}
