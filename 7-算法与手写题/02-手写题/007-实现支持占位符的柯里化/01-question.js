/**
 * 题目标题：实现支持占位符的柯里化
 * 题目类型：手写题
 * 难度：中级
 *
 * 题目描述：
 * 请手写一个 curry 函数，把一个接受多个参数的函数，
 * 转换成可以分步传参的函数，并且支持“占位符”能力。
 *
 * 也就是说，某些参数位置可以先空出来，
 * 后续再次调用时再把这些位置补齐。
 *
 * 举例说明：
 * 输入：
 * const _ = curry.placeholder;
 *
 * function join(a, b, c) {
 *   return `${a}_${b}_${c}`;
 * }
 *
 * const curriedJoin = curry(join);
 *
 * curriedJoin(1, 2, 3)
 * curriedJoin(_, 2)(1, 3)
 * curriedJoin(_, _, 3)(1)(2)
 * curriedJoin(1, _, 3)(2)
 *
 * 输出：
 * 四种调用方式都应该返回 "1_2_3"
 *
 * 解释：
 * 这道题的重点不只是“收集参数”，
 * 还要处理“旧占位符被新参数依次补位”的逻辑。
 *
 * 作答要求：
 * 1. 支持分多次传参
 * 2. 支持一次传一个或多个参数
 * 3. 支持占位符，后续调用时可以补位
 * 4. 当有效参数数量满足要求且不存在待补占位符时，执行原函数
 *
 * 测试说明：
 * 1. 直接在下方答题区补全实现
 * 2. 运行 node 01-question.js
 * 3. 对照控制台输出判断是否符合预期
 */

// TODO: 在这里完成你的实现
export function curry(fn) {
  void fn;
  throw new Error("TODO: 请在 01-question.js 中完成实现");
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

try {
  runExample();
} catch (error) {
  console.error("007-实现支持占位符的柯里化 01-question.js: 请先完成 TODO");
  console.error(error.message);
}
