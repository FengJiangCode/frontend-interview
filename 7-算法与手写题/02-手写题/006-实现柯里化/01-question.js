/**
 * 题目标题：实现柯里化
 * 题目类型：手写题
 * 难度：中级
 *
 * 题目描述：
 * 请手写一个 curry 函数，把一个接受多个参数的函数，
 * 转换成可以分步传参的函数。
 *
 * 举例说明：
 * 输入：
 * function add(a, b, c) {
 *   return a + b + c;
 * }
 * const curriedAdd = curry(add);
 *
 * curriedAdd(1)(2)(3)
 * curriedAdd(1, 2)(3)
 * curriedAdd(1)(2, 3)
 *
 * 输出：
 * 三种调用方式都应该返回 6
 *
 * 解释：
 * 柯里化的关键是收集参数。
 * 当参数数量不足时继续返回函数，
 * 当参数数量足够时执行原函数。
 *
 * 作答要求：
 * 1. 支持分多次传参
 * 2. 支持一次传一个或多个参数
 * 3. 参数收集完成后正确执行原函数
 *
 * 测试说明：
 * 1. 直接在下方答题区补全实现
 * 2. 运行 node 01-question.js
 * 3. 对照控制台输出判断是否符合预期
 */

// TODO: 在这里完成你的实现
export function curry(fn) {
  function x(...args) {
    if (args.length >= fn.length) {
      return fn.call(this, ...args);
    }

    return function (...restArgs) {
      return x.call(this, ...[...args, ...restArgs]);
    };
  }

  return x;
}

function runExample() {
  function add(a, b, c) {
    return a + b + c;
  }

  const curriedAdd = curry(add);
  const actual = [
    curriedAdd(1)(2)(3),
    curriedAdd(1, 2)(3),
    curriedAdd(1)(2, 3),
  ];
  const expected = [6, 6, 6];

  console.log("题目：实现柯里化");
  console.log("实际结果：", actual);
  console.log("预期结果：", expected);
}

runExample();
