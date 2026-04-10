/**
 * 题目标题：实现柯里化
 * 题目类型：手写题
 * 难度：中级
 *
 * 解题思路：
 * 柯里化的核心是“持续收集参数”。
 * 如果当前收集到的参数数量还不够，就继续返回一个新函数；
 * 如果参数数量已经达到原函数要求，就执行原函数并返回结果。
 *
 * 实现时的关键点是：
 * 1. 利用 fn.length 获取原函数期望参数个数
 * 2. 每次调用时把新旧参数拼起来
 * 3. 参数足够后执行原函数
 *
 * 时间复杂度：
 * O(n)
 *
 * 空间复杂度：
 * O(n)
 *
 * 复杂度如何计算：
 * 假设原函数需要 n 个参数，
 * 在参数收集过程中需要不断拼接参数数组，
 * 最终整体可以看作 O(n) 的时间复杂度和 O(n) 的额外空间复杂度。
 *
 * 关键边界情况：
 * 1. 支持一次传一个参数
 * 2. 支持一次传多个参数
 * 3. 参数数量达到要求后应立即执行
 *
 * 面试追问：
 * 1. 柯里化和偏函数有什么区别？
 * 2. 为什么这里通常会用 fn.length？
 * 3. 如果原函数有剩余参数，柯里化该怎么处理？
 */

export function curry(fn) {
  function curried(...args) {
    if (args.length >= fn.length) {
      return fn.apply(this, args);
    }

    return function (...restArgs) {
      return curried.apply(this, [...args, ...restArgs]);
    };
  }

  return curried;
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
