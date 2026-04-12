/**
 * 题目标题：最长不重复子串
 * 题目类型：算法题
 * 难度：中级
 *
 * 解题思路：
 * 这道题非常适合使用滑动窗口。
 *
 * 我们用两个指针 left 和 right 表示一个窗口，
 * 窗口内始终维护“没有重复字符”这个条件。
 * right 向右扩展窗口时，
 * 如果当前字符已经在窗口中出现过，
 * 就不断移动 left 缩小窗口，
 * 直到窗口重新满足“无重复字符”为止。
 *
 * 每次窗口合法时，
 * 都可以用 right - left + 1 更新最长长度。
 *
 * 常见做法有 Set 和 Map 两种，
 * 这里使用 Set，
 * 因为它更直观地表达“窗口内是否存在某字符”。
 *
 * 时间复杂度：
 * O(n)
 *
 * 空间复杂度：
 * O(k)
 *
 * 复杂度如何计算：
 * 设字符串长度为 n。
 * left 和 right 两个指针最多都只会从左到右移动 n 次，
 * 所以总操作次数是线性的，时间复杂度为 O(n)。
 *
 * 额外使用了一个 Set 来存储当前窗口中的字符，
 * 最多存放 k 个不同字符，
 * 因此空间复杂度为 O(k)，最坏情况下可视为 O(n)。
 *
 * 关键边界情况：
 * 1. 空字符串应返回 0
 * 2. 所有字符都相同，比如 "bbbbb"，应返回 1
 * 3. 重复字符出现在窗口中间时，要正确收缩窗口
 *
 * 面试追问：
 * 1. 为什么这道题适合用滑动窗口？
 * 2. 如果要求返回最长子串本身，应该怎么改？
 * 3. Set 写法和 Map 写法分别有什么优缺点？
 */

export function lengthOfLongestSubstring(s) {
  const set = new Set();
  let left = 0;
  let maxLen = 0;

  for (let right = 0; right < s.length; right += 1) {
    while (set.has(s[right])) {
      set.delete(s[left]);
      left += 1;
    }

    set.add(s[right]);
    maxLen = Math.max(maxLen, right - left + 1);
  }

  return maxLen;
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

runExample();
