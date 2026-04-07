/**
 * 题目标题：实现节流函数
 * 题目类型：手写题
 * 难度：中级
 *
 * 解题思路：
 * 节流的核心是控制函数执行频率。
 * 记录上一次真正执行的时间，每次触发时拿当前时间和上一次执行时间做比较。
 * 如果间隔大于等于 delay，就执行函数并更新时间；否则直接跳过。
 *
 * 时间复杂度：
 * O(1)
 *
 * 空间复杂度：
 * O(1)
 *
 * 复杂度如何计算：
 * 每次调用只做一次时间比较和常数次赋值，没有循环或递归。
 * 额外空间只使用了一个 lastTime 变量，因此时间和空间复杂度都为常数级。
 *
 * 关键边界情况：
 * 1. 第一次调用应立即执行
 * 2. 高频连续触发时，中间调用应被跳过
 * 3. delay 结束后再次触发应恢复执行
 * 4. 需要正确保留 this 和参数
 *
 * 面试追问：
 * 1. 如何实现尾调用版节流？
 * 2. 节流和防抖的区别是什么？
 * 3. 如何支持取消节流？
 */

export function throttle(fn, delay) {
  let lastTime = 0;

  return function throttled(...args) {
    const now = Date.now();

    if (now - lastTime >= delay) {
      lastTime = now;
      fn.apply(this, args);
    }
  };
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
  console.error("001-实现节流 02-answer.js: 运行失败");
  throw error;
});
