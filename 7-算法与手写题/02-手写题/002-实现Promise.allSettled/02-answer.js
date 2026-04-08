/**
 * 题目标题：实现 Promise.allSettled
 * 题目类型：手写题
 * 难度：中级
 *
 * 解题思路：
 * Promise.allSettled 的关键点是：
 * 1. 无论单项成功还是失败，外层 Promise 都不能提前结束
 * 2. 必须等待所有任务都 settled 后，再统一返回结果数组
 * 3. 返回结果顺序必须和输入顺序一致
 *
 * 实现时可以先用 Array.from(iterable) 把输入统一转成数组，
 * 这样既能兼容任意可迭代对象，也方便通过 length 判断总数。
 * 然后遍历每一项，用 Promise.resolve(item) 统一处理普通值和 Promise。
 * 成功时记录为 { status: "fulfilled", value }，
 * 失败时记录为 { status: "rejected", reason }。
 * 每结束一项，就把计数加一；当所有项都结束后，resolve(results)。
 *
 * 时间复杂度：
 * O(n)
 *
 * 空间复杂度：
 * O(n)
 *
 * 复杂度如何计算：
 * 假设输入共有 n 项，需要遍历一次输入，并维护一个长度为 n 的结果数组，
 * 所以时间复杂度是 O(n)，额外空间复杂度也是 O(n)。
 *
 * 关键边界情况：
 * 1. 输入为空数组或空可迭代对象时，应立即返回 []
 * 2. 输入中可能包含普通值
 * 3. 某一项 reject 时，不能让外层 Promise reject
 * 4. 多个异步任务完成顺序可能不同，但最终结果顺序必须稳定
 *
 * 面试追问：
 * 1. Promise.all 和 Promise.allSettled 的区别是什么？
 * 2. 为什么不能用 results.length 判断是否全部结束？
 * 3. 如果要实现并发控制版本，该怎么设计？
 */

export function myPromiseAllSettled(iterable) {
  return new Promise((resolve) => {
    const items = Array.from(iterable);

    if (items.length === 0) {
      resolve([]);
      return;
    }

    const results = new Array(items.length);
    let settledCount = 0;

    items.forEach((item, index) => {
      Promise.resolve(item)
        .then((value) => {
          results[index] = { status: "fulfilled", value };
        })
        .catch((reason) => {
          results[index] = { status: "rejected", reason };
        })
        .finally(() => {
          settledCount += 1;

          if (settledCount === items.length) {
            resolve(results);
          }
        });
    });
  });
}

async function runExample() {
  const mixedResult = await myPromiseAllSettled([
    Promise.resolve(1),
    Promise.reject("error"),
    3,
  ]);

  const orderedResult = await myPromiseAllSettled([
    new Promise((resolve) => setTimeout(() => resolve("slow"), 20)),
    new Promise((resolve) => setTimeout(() => resolve("fast"), 0)),
  ]);

  const emptyResult = await myPromiseAllSettled([]);
  const allFulfilledResult = await myPromiseAllSettled([
    Promise.resolve("a"),
    "b",
  ]);
  const partialRejectedResult = await myPromiseAllSettled([
    Promise.resolve("ok"),
    Promise.reject("boom"),
  ]);

  console.log("题目：实现 Promise.allSettled");
  console.log("混合输入结果：", mixedResult);
  console.log("顺序稳定性结果：", orderedResult);
  console.log("空输入结果：", emptyResult);
  console.log("全部成功结果：", allFulfilledResult);
  console.log("部分失败结果：", partialRejectedResult);
}

runExample().catch((error) => {
  console.error("002-实现Promise.allSettled 02-answer.js: 运行失败");
  throw error;
});
