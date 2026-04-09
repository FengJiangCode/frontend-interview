/**
 * 题目标题：实现防抖
 * 题目类型：手写题
 * 难度：中级
 *
 * 题目描述：
 * 请手写一个 debounce 函数。
 * 它接收一个函数 fn 和一个等待时间 delay，返回一个新的函数。
 * 在高频触发时，只有最后一次触发在等待时间结束后才会真正执行。
 *
 * 举例说明：
 * 输入：
 * const debounced = debounce(fn, 100)
 * debounced("a")
 * debounced("b")
 * debounced("c")
 *
 * 输出：
 * 只执行一次 fn，并且拿到最后一次调用的参数 "c"
 *
 * 解释：
 * 每次触发都会重新计时，只有等待时间内不再触发时，才真正执行原函数。
 *
 * 作答要求：
 * 1. 正确保存 fn 执行时的 this 和参数
 * 2. 高频触发时只执行最后一次
 * 3. 返回值为新的函数
 *
 * 测试说明：
 * 1. 直接在下方答题区补全实现
 * 2. 运行 node 01-question.js
 * 3. 对照控制台输出判断是否符合预期
 */

// TODO: 在这里完成你的实现
export function debounce(fn, delay) {
  let time = null
  return function (...agu){
    if (time) {
      clearTimeout(time)
    }
    time = setTimeout(()=>{
      fn.call(this,...agu)
      time = null
    },delay)
  }
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
  console.error("003-实现防抖 01-question.js: 运行失败");
  throw error;
});
