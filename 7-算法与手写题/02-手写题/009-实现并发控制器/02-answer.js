/**
 * 题目标题：实现并发控制器
 * 题目类型：手写题
 * 难度：中级
 *
 * 解题思路：
 * 这道题的核心是“调度”。
 * 我们不能一次性把所有任务都跑起来，
 * 而是应该始终维护一个大小不超过 limit 的执行窗口。
 *
 * 可以准备一个 nextIndex 指针，表示下一个待启动的任务下标。
 * 每当有一个任务完成，就继续补一个新任务进去，
 * 直到所有任务都被启动并完成为止。
 *
 * 为了保证结果顺序稳定，需要用结果数组按任务下标收集返回值，
 * 而不是按完成顺序 push。
 * 同时，只要有任意任务失败，就应立即 reject 整个流程。
 *
 * 时间复杂度：
 * O(n)
 *
 * 空间复杂度：
 * O(n)
 *
 * 复杂度如何计算：
 * 假设共有 n 个任务，每个任务只会被启动和收集一次，
 * 因此调度逻辑整体是 O(n)。
 * 额外空间主要来自结果数组，以及递归调度过程中的少量状态，整体为 O(n)。
 *
 * 关键边界情况：
 * 1. 输入任务数组为空时，应直接返回 []
 * 2. limit 大于任务数量时，实际并发数最多只会到任务总数
 * 3. 结果数组顺序必须和任务输入顺序一致
 * 4. 任意任务失败时要立即 reject
 *
 * 面试追问：
 * 1. 这道题和 Promise.all 的核心区别是什么？
 * 2. 如果希望失败后不中断，而是收集所有结果，应该怎么改？
 * 3. 如果任务很多，为什么并发控制会更有价值？
 */

export async function limitConcurrency(tasks, limit) {
  if (!Array.isArray(tasks)) {
    throw new TypeError("tasks must be an array");
  }

  if (!Number.isInteger(limit) || limit <= 0) {
    throw new TypeError("limit must be a positive integer");
  }

  if (tasks.length === 0) {
    return [];
  }

  const results = new Array(tasks.length);
  let nextIndex = 0;

  async function worker() {
    while (nextIndex < tasks.length) {
      const currentIndex = nextIndex;
      nextIndex += 1;

      results[currentIndex] = await tasks[currentIndex]();
    }
  }

  const workerCount = Math.min(limit, tasks.length);
  const workers = [];

  for (let i = 0; i < workerCount; i += 1) {
    workers.push(worker());
  }

  await Promise.all(workers);
  return results;
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
  console.error("009-实现并发控制器 02-answer.js: 运行失败");
  throw error;
});
