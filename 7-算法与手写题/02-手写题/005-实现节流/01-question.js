/**
 * 题目标题：实现节流
 * 题目类型：手写题
 * 难度：中级
 *
 * 题目描述：
 * 请手写一个 throttle 函数，实现节流效果。
 * 在连续高频触发时，保证函数在固定时间内最多只执行一次。
 *
 * 举例说明：
 * 输入：
 * const throttled = throttle(fn, 100)
 * 连续快速调用 throttled("a")、throttled("b")、throttled("c")
 *
 * 输出：
 * 在 100ms 内，fn 最多只会执行一次
 *
 * 解释：
 * 节流的重点不是“最后一次才执行”，
 * 而是“在一段时间窗口内限制执行频率”。
 *
 * 作答要求：
 * 1. 正确实现基础节流行为
 * 2. 保留调用时的 this
 * 3. 保留触发时传入的参数
 *
 * 测试说明：
 * 1. 直接在下方答题区补全实现
 * 2. 运行 node 01-question.js
 * 3. 对照控制台输出判断是否符合预期
 */

// TODO: 在这里完成你的实现
export function throttle(fn, delay) {
  let time = 0;
  return function (...args) {
    if (Date.now() - time >= delay) {
      time = Date.now();
      fn.call(this, ...args);
    }
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
  console.error("005-实现节流 01-question.js: 运行失败");
  throw error;
});
