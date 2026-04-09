/**
 * 题目标题：实现防抖
 * 题目类型：手写题
 * 难度：中级
 *
 * 解题思路：
 * 防抖的核心是“重新计时”。
 * 每次触发时都先清掉上一次定时器，然后开启新的定时器。
 * 只有在 delay 时间内没有再次触发，才会真正执行 fn。
 *
 * 实现时要注意两个点：
 * 1. 保留调用时的 this
 * 2. 保留最后一次调用时的参数
 *
 * 时间复杂度：
 * O(1)
 *
 * 空间复杂度：
 * O(1)
 *
 * 复杂度如何计算：
 * 每次调用只涉及一次 clearTimeout 和一次 setTimeout，
 * 没有和输入规模线性相关的额外循环，额外只维护一个定时器引用。
 *
 * 关键边界情况：
 * 1. 高频连续触发时，只应执行最后一次
 * 2. 需要保留调用时的 this
 * 3. 需要保留最后一次调用的参数
 *
 * 面试追问：
 * 1. 防抖和节流有什么区别？
 * 2. 如果要支持立即执行版防抖，应该怎么扩展？
 * 3. 如果要支持取消防抖，应该怎么设计？
 */

export function debounce(fn, delay) {
  let timer = null;

  return function (...args) {
    const context = this;

    if (timer !== null) {
      clearTimeout(timer);
    }

    timer = setTimeout(() => {
      fn.apply(context, args);
    }, delay);
  };
}

async function runExample() {
  const calls = [];
  const context = { tag: "debounce-demo" };

  const debounced = debounce(function (value) {
    calls.push({ value, tag: this.tag });
  }, 80);

  debounced.call(context, "a");
  debounced.call(context, "b");
  debounced.call(context, "c");

  await new Promise((resolve) => setTimeout(resolve, 140));

  const actual = calls;
  const expected = [{ value: "c", tag: "debounce-demo" }];

  console.log("题目：实现防抖");
  console.log("实际结果：", actual);
  console.log("预期结果：", expected);
}

runExample().catch((error) => {
  console.error("003-实现防抖 02-answer.js: 运行失败");
  throw error;
});
