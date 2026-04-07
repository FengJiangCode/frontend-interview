/**
 * 题目标题：实现 Promise.all
 * 题目类型：手写题
 * 难度：中级
 *
 * 解题思路：
 * Promise.all 的核心有三个点：
 * 1. 所有任务都成功时，统一返回结果数组
 * 2. 返回结果的顺序必须和输入顺序一致
 * 3. 只要有一个失败，就立即 reject
 *
 * 实现时可以遍历输入，把每一项都用 Promise.resolve 包一层，
 * 这样普通值和 Promise 都能统一处理。
 * 然后用一个 results 数组按索引收集结果，再用 fulfilledCount 统计完成数量。
 * 当 fulfilledCount 等于总长度时，说明所有任务都成功了，此时 resolve(results)。
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
 * 1. 输入为空数组时，应立即返回 []
 * 2. 输入中可能包含普通值
 * 3. 多个 Promise 完成顺序可能不同，但结果顺序必须稳定
 * 4. 任意一个 Promise reject 时要立即失败
 *
 * 面试追问：
 * 1. Promise.all 和 Promise.allSettled 的区别是什么？
 * 2. 为什么结果顺序和完成顺序无关？
 * 3. 如果要实现并发控制版本，该怎么设计？
 */

export function myPromiseAll(iterable) {
  return new Promise((resolve, reject) => {
    const items = Array.from(iterable);

    if (items.length === 0) {
      resolve([]);
      return;
    }

    const results = new Array(items.length);
    let fulfilledCount = 0;

    items.forEach((item, index) => {
      Promise.resolve(item)
        .then((value) => {
          results[index] = value;
          fulfilledCount += 1;

          if (fulfilledCount === items.length) {
            resolve(results);
          }
        })
        .catch(reject);
    });
  });
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
  console.error("001-实现Promise.all 02-answer.js: 运行失败");
  throw error;
});
