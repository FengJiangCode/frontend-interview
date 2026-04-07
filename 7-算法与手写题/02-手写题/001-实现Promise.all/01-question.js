/**
 * 题目标题：实现 Promise.all
 * 题目类型：手写题
 * 难度：中级
 *
 * 题目描述：
 * 请手写一个 myPromiseAll 函数，功能类似于 Promise.all。
 * 它接收一个可迭代对象，里面的每一项都可能是 Promise，也可能是普通值。
 * 只有当所有项都成功时，才按原顺序返回结果数组；
 * 只要有一个失败，就立即进入 reject。
 *
 * 举例说明：
 * 输入：
 * myPromiseAll([
 *   Promise.resolve(1),
 *   Promise.resolve(2),
 *   3
 * ])
 *
 * 输出：
 * [1, 2, 3]
 *
 * 解释：
 * 普通值也要被当作成功结果处理，并且最终结果顺序要和输入顺序一致。
 *
 * 作答要求：
 * 1. 使用 JavaScript 实现
 * 2. 保证结果顺序与输入顺序一致
 * 3. 正确处理普通值和 Promise
 * 4. 任意一个失败时应立即 reject
 *
 * 测试说明：
 * 1. 直接在下方答题区补全实现
 * 2. 运行 node 01-question.js
 * 3. 对照“实际结果”和“预期结果”判断是否正确
 */

// TODO: 在这里完成你的实现
export function myPromiseAll(iterable) {
  throw new Error("TODO: 请实现 myPromiseAll 函数");
}

async function runExample() {
  const actual = await myPromiseAll([
    Promise.resolve(1),
    Promise.resolve(2),
    3,
  ]);

  const expected = [1, 2, 3];

  console.log("题目：实现 Promise.all");
  console.log("测试用例：Promise.resolve(1), Promise.resolve(2), 3");
  console.log("实际结果：", actual);
  console.log("预期结果：", expected);
}

runExample().catch((error) => {
  console.error("001-实现Promise.all 01-question.js: 运行失败");
  throw error;
});
