/**
 * 题目标题：实现并发控制器
 * 题目类型：手写题
 * 难度：中级
 *
 * 题目描述：
 * 请手写一个 limitConcurrency 函数，用来控制异步任务的最大并发数。
 * 它接收一个任务函数数组和最大并发数 limit，
 * 每个任务函数都会返回一个 Promise。
 *
 * 要求在任意时刻，同时运行的任务数量不能超过 limit，
 * 并且最终返回结果数组时，结果顺序要和任务输入顺序一致。
 *
 * 举例说明：
 * 输入：
 * const tasks = [
 *   () => Promise.resolve(1),
 *   () => Promise.resolve(2),
 *   () => Promise.resolve(3),
 * ];
 *
 * await limitConcurrency(tasks, 2);
 *
 * 输出：
 * [1, 2, 3]
 *
 * 解释：
 * 这道题的重点不是单纯地等待所有 Promise 完成，
 * 而是要在“总任务数”和“最大并发数”之间做好调度。
 *
 * 作答要求：
 * 1. 任意时刻同时执行的任务数不能超过 limit
 * 2. 最终结果顺序要和输入顺序一致
 * 3. 所有任务成功时返回结果数组
 * 4. 任意任务失败时应立即 reject
 *
 * 测试说明：
 * 1. 直接在下方答题区补全实现
 * 2. 运行 node 01-question.js
 * 3. 对照控制台输出判断是否符合预期
 */

// TODO: 在这里完成你的实现
export async function limitConcurrency(tasks, limit) {
  let currentIndex = 0;
  const res = [];

  async function worker() {
    while (currentIndex < tasks.length) {
      const index = currentIndex;
      currentIndex++;
      res[index] = await tasks[index]();
    }
  }

  const workers = [];
  const maxRunning = Math.min(limit, tasks.length);
  for (let index = 0; index < maxRunning; index++) {
    workers.push(worker());
  }
  await Promise.all(workers);
  return res;
}

function createTask(value, delay, tracker) {
  return () =>
    new Promise((resolve) => {
      tracker.running += 1;
      tracker.maxRunning = Math.max(tracker.maxRunning, tracker.running);

      setTimeout(() => {
        tracker.running -= 1;
        resolve(value);
      }, delay);
    });
}

async function runExample() {
  const tracker = { running: 0, maxRunning: 0 };
  const tasks = [
    createTask("A", 80, tracker),
    createTask("B", 30, tracker),
    createTask("C", 50, tracker),
    createTask("D", 20, tracker),
  ];

  const actual = {
    results: await limitConcurrency(tasks, 2),
    maxRunning: tracker.maxRunning,
  };

  const expected = {
    results: ["A", "B", "C", "D"],
    maxRunning: 2,
  };

  console.log("题目：实现并发控制器");
  console.log("实际结果：", actual);
  console.log("预期结果：", expected);
}

runExample().catch((error) => {
  console.error("009-实现并发控制器 01-question.js: 请先完成 TODO");
  console.error(error.message);
});
