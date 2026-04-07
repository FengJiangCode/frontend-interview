/**
 * 题目标题：实现节流函数
 * 题目类型：手写题
 * 难度：中级
 *
 * 题目描述：
 * 请手写一个 throttle 函数。
 * 它接收 fn 和 delay 两个参数，返回一个新的函数。
 * 在持续频繁触发时，保证 fn 在每个 delay 时间窗口内最多只执行一次。
 *
 * 举例说明：
 * 输入：
 * const log = throttle((value) => console.log(value), 1000);
 * log(1);
 * log(2);
 * log(3);
 *
 * 输出：
 * 立即打印 1
 * 1 秒内不会再打印 2 和 3
 *
 * 解释：
 * 节流强调“固定时间内最多执行一次”，而不是像防抖那样只执行最后一次。
 *
 * 作答要求：
 * 1. 使用 JavaScript 实现
 * 2. 正确处理高频触发场景
 * 3. 尽量保留 this 和参数
 *
 * 测试说明：
 * 1. 直接在下方答题区补全实现
 * 2. 运行 node 01-question.js
 * 3. 对照“实际结果”和“预期结果”判断是否正确
 */

// TODO: 在这里完成你的实现
export function throttle(fn, delay) {
  throw new Error("TODO: 请实现 throttle 函数");
}

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function runExample() {
  const calls = [];
  const throttled = throttle((value) => {
    calls.push(value);
  }, 30);

  throttled(1);
  throttled(2);
  throttled(3);
  await sleep(35);
  throttled(4);

  console.log("题目：实现节流函数");
  console.log("测试用例：连续触发 1、2、3，等待 35ms 后再触发 4");
  console.log("实际结果：", calls);
  console.log("预期结果：", [1, 4]);
}

runExample().catch((error) => {
  console.error("001-实现节流 01-question.js: 运行失败");
  throw error;
});
