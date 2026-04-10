/**
 * 题目标题：实现支持占位符的柯里化
 * 题目类型：手写题
 * 难度：中级
 *
 * 解题思路：
 * 这道题相比基础版 curry，多了一层“占位符补位”的处理。
 * 核心思路可以拆成两步：
 * 1. 每次调用时，先把新参数优先填进旧参数列表里的占位符位置
 * 2. 如果还有多余参数，再继续追加到参数列表末尾
 *
 * 在判断是否执行原函数时，不能只看参数数组长度，
 * 还要确保前 fn.length 个位置里已经没有占位符了。
 *
 * 时间复杂度：
 * O(n)
 *
 * 空间复杂度：
 * O(n)
 *
 * 复杂度如何计算：
 * 假设原函数需要 n 个参数，
 * 每次合并参数时最多线性扫描已有参数和本次新参数，
 * 因此单次合并复杂度为 O(n)；
 * 额外空间主要来自新的参数数组拷贝，也是 O(n)。
 *
 * 关键边界情况：
 * 1. 新参数需要优先填补旧占位符，而不是一味追加
 * 2. 前 fn.length 个位置里只要还有占位符，就不能执行
 * 3. 允许一次传多个参数，也允许分多次慢慢补齐
 *
 * 面试追问：
 * 1. 这里为什么不能只用 args.length >= fn.length 判断是否执行？
 * 2. 柯里化、偏函数、占位符偏函数之间有什么区别？
 * 3. 如果要兼容可变参数函数，应该怎么设计终止条件？
 */

function mergeArgs(prevArgs, nextArgs, placeholder) {
  const mergedArgs = [...prevArgs];
  let nextIndex = 0;

  for (
    let i = 0;
    i < mergedArgs.length && nextIndex < nextArgs.length;
    i += 1
  ) {
    if (mergedArgs[i] === placeholder) {
      mergedArgs[i] = nextArgs[nextIndex];
      nextIndex += 1;
    }
  }

  while (nextIndex < nextArgs.length) {
    mergedArgs.push(nextArgs[nextIndex]);
    nextIndex += 1;
  }

  return mergedArgs;
}

function canInvoke(args, expectedLength, placeholder) {
  if (args.length < expectedLength) {
    return false;
  }

  for (let i = 0; i < expectedLength; i += 1) {
    if (args[i] === placeholder) {
      return false;
    }
  }

  return true;
}

export function curry(fn) {
  const placeholder = curry.placeholder;

  function generateCurried(collectedArgs) {
    return function curried(...newArgs) {
      const mergedArgs = mergeArgs(collectedArgs, newArgs, placeholder);

      if (canInvoke(mergedArgs, fn.length, placeholder)) {
        return fn.apply(this, mergedArgs.slice(0, fn.length));
      }

      return generateCurried(mergedArgs);
    };
  }

  return generateCurried([]);
}

curry.placeholder = Symbol("curry placeholder");

function runExample() {
  const _ = curry.placeholder;

  function join(a, b, c) {
    return `${a}_${b}_${c}`;
  }

  const curriedJoin = curry(join);
  const actual = [
    curriedJoin(1, 2, 3),
    curriedJoin(_, 2)(1, 3),
    curriedJoin(_, _, 3)(1)(2),
    curriedJoin(1, _, 3)(2),
  ];
  const expected = ["1_2_3", "1_2_3", "1_2_3", "1_2_3"];

  console.log("题目：实现支持占位符的柯里化");
  console.log("实际结果：", actual);
  console.log("预期结果：", expected);
}

runExample();
