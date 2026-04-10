/**
 * 题目标题：实现节流
 * 题目类型：手写题
 * 难度：中级
 *
 * 解题思路：
 * 节流的核心是“限制执行频率”。
 * 只要当前触发时间和上一次执行时间的间隔小于 delay，
 * 就直接跳过；只有超过 delay，才允许真正执行。
 *
 * 实现时要注意两个点：
 * 1. 保留调用时的 this
 * 2. 保留本次触发时传入的参数
 *
 * 这里实现的是最常见的时间戳版节流。
 *
 * 时间复杂度：
 * O(1)
 *
 * 空间复杂度：
 * O(1)
 *
 * 复杂度如何计算：
 * 每次调用只做常数次时间比较和一次函数调用判断，
 * 没有和输入规模相关的循环，额外只维护一个时间戳变量。
 *
 * 关键边界情况：
 * 1. 高频连续触发时，在时间窗口内只能执行一次
 * 2. 需要保留调用时的 this
 * 3. 需要保留本次执行时的参数
 *
 * 面试追问：
 * 1. 节流和防抖有什么区别？
 * 2. 时间戳版和定时器版节流有什么区别？
 * 3. 如果要支持尾调用，应该怎么扩展？
 */

export function throttle(fn, delay) {
  let lastTime = 0;

  return function (...args) {
    const now = Date.now();

    if (now - lastTime < delay) {
      return;
    }

    lastTime = now;
    fn.apply(this, args);
  };
}

async function runExample() {
  const calls = [];
  const context = { tag: "throttle-demo" };

  const throttled = throttle(function (value) {
    calls.push({ value, tag: this.tag });
  }, 80);

  throttled.call(context, "a");
  throttled.call(context, "b");
  throttled.call(context, "c");

  await new Promise((resolve) => setTimeout(resolve, 100));
  throttled.call(context, "d");

  const actual = calls;
  const expected = [
    { value: "a", tag: "throttle-demo" },
    { value: "d", tag: "throttle-demo" },
  ];

  console.log("题目：实现节流");
  console.log("实际结果：", actual);
  console.log("预期结果：", expected);
}

runExample().catch((error) => {
  console.error("005-实现节流 02-answer.js: 运行失败");
  throw error;
});
