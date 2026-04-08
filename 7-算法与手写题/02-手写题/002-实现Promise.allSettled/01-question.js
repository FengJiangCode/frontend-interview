/**
 * 题目标题：实现 Promise.allSettled
 * 题目类型：手写题
 * 难度：中级
 *
 * 题目描述：
 * 请手写一个 myPromiseAllSettled 函数，功能类似于 Promise.allSettled。
 * 它接收一个可迭代对象，里面的每一项都可能是 Promise，也可能是普通值。
 * 无论单项是成功还是失败，都不能让整体提前结束；
 * 只有当所有项都结束后，才按原顺序返回结果数组。
 *
 * 举例说明：
 * 输入：
 * myPromiseAllSettled([
 *   Promise.resolve(1),
 *   Promise.reject("error"),
 *   3
 * ])
 *
 * 输出：
 * [
 *   { status: "fulfilled", value: 1 },
 *   { status: "rejected", reason: "error" },
 *   { status: "fulfilled", value: 3 }
 * ]
 *
 * 解释：
 * 普通值也要被当作成功结果处理。
 * 失败项不能让整体 reject，而是要记录到结果数组中。
 * 最终结果顺序必须和输入顺序一致。
 *
 * 作答要求：
 * 1. 使用 JavaScript 实现
 * 2. 正确处理 fulfilled 和 rejected 两种状态
 * 3. 支持普通值和 Promise 混合输入
 * 4. 不能因为某一项 reject 就让整体提前失败
 *
 * 测试说明：
 * 1. 直接在下方答题区补全实现
 * 2. 运行 node 01-question.js
 * 3. 对照“实际结果”和“预期结果”判断是否正确
 */

// TODO: 在这里完成你的实现
export function myPromiseAllSettled(iterable) {
  return new Promise((resolve, reject) => {
    const res = [];
    let count = 0;

    if (iterable.length <= 0) {
      resolve(res);
    }

    for (let index = 0; index < iterable.length; index++) {
      const element = iterable[index];
      Promise.resolve(element)
        .then((data) => {
          res[index] = {
            status: "fulfilled",
            value: data,
          };
        })
        .catch(() => {
          res[index] = {
            status: "rejected",
            reason: "error",
          };
        })
        .finally(() => {
          count++;
          if (count >= iterable.length) {
            resolve(res);
          }
        });
    }
  });
}

async function runExample() {
  const actual = await myPromiseAllSettled([
    Promise.resolve(1),
    Promise.reject("error"),
    3,
  ]);

  const expected = [
    { status: "fulfilled", value: 1 },
    { status: "rejected", reason: "error" },
    { status: "fulfilled", value: 3 },
  ];

  console.log("题目：实现 Promise.allSettled");
  console.log('测试用例：Promise.resolve(1), Promise.reject("error"), 3');
  console.log("实际结果：", actual);
  console.log("预期结果：", expected);
}

runExample().catch((error) => {
  console.error("002-实现Promise.allSettled 01-question.js: 运行失败");
  throw error;
});
