/**
 * 题目标题：基于时间分片的累加求和
 * 题目类型：手写题
 * 难度：中级
 *
 * 解题思路：
 * 核心问题是：如何在不阻塞主线程的前提下完成大量同步计算？
 *
 * 直接用 for 循环跑完 999999 次加法，虽然快，但整个过程是同步的——
 * JS 单线程在执行期间会完全占用主线程，页面无法响应任何用户操作。
 *
 * 时间分片的思路：
 * 1. 每批处理开始时记录时间戳
 * 2. 在 while 循环中持续累加，同时检查已耗时是否超过 15ms
 * 3. 超过 15ms，就用 setTimeout(fn, 0) 把剩余工作推入下一个宏任务队列
 *    ——这样当前宏任务结束，主线程得以处理渲染、事件等其他任务
 * 4. 下一轮宏任务继续，直到 i > n 时 resolve
 *
 * 为什么是宏任务而不是微任务？
 * 微任务（Promise.then、queueMicrotask）在当前宏任务结束后、下一次渲染前批量执行，
 * 不会让出给渲染和用户事件；宏任务（setTimeout）才真正"插队"到事件循环的下一轮，
 * 给浏览器一个喘息机会。
 *
 * 时间复杂度：O(n)
 * 空间复杂度：O(1)（只维护 sum 和 i 两个变量）
 *
 * 关键边界情况：
 * 1. n <= 0 时直接 resolve(0)
 * 2. 第一批如果已在 15ms 内跑完全部，直接 resolve，不会触发 setTimeout
 *
 * 面试常见追问：
 * Q: 能用 requestAnimationFrame 替代 setTimeout 吗？
 * A: 可以，rAF 在下一帧渲染前触发，天然和浏览器渲染节奏对齐，更适合动画场景；
 *    但 rAF 只在浏览器环境有，Node.js 没有，setTimeout 兼容性更好。
 *
 * Q: MessageChannel 和 setTimeout(fn, 0) 有什么区别？
 * A: setTimeout 有浏览器约定的最小 4ms 延迟（嵌套超过 5 层后），
 *    MessageChannel 没有这个限制，触发更快；React Scheduler 内部就是优先用 MessageChannel。
 *
 * Q: requestIdleCallback 适合这个场景吗？
 * A: 不太适合。rIC 是在浏览器空闲时才触发，如果页面一直有交互，
 *    rIC 可能迟迟得不到调用，不适合有明确完成预期的任务。
 */

export async function timeSliceSum(n) {
  if (n <= 0) return 0;

  return new Promise((resolve) => {
    let sum = 0;
    let i = 1;

    function processChunk() {
      const start = performance.now();

      while (i <= n) {
        sum += i;
        i++;
        if (performance.now() - start >= 15) {
          setTimeout(processChunk, 0);
          return;
        }
      }

      resolve(sum);
    }

    processChunk();
  });
}

// ---- 测试区 ----

async function runTests() {
  console.log("题目：基于时间分片的累加求和");

  const cases = [
    { n: 10, expected: 55 },
    { n: 100, expected: 5050 },
    { n: 1000, expected: 500500 },
  ];

  for (const { n, expected } of cases) {
    const result = await timeSliceSum(n);
    const pass = result === expected;
    console.log(
      `timeSliceSum(${n}) = ${result}，预期 ${expected}，${pass ? "✓ 通过" : "✗ 失败"}`
    );
  }

  const n = 999999;
  const expected = (n * (n + 1)) / 2;
  const t0 = performance.now();
  const result = await timeSliceSum(n);
  const elapsed = (performance.now() - t0).toFixed(0);
  const pass = result === expected;
  console.log(
    `timeSliceSum(${n}) = ${result}，预期 ${expected}，${pass ? "✓ 通过" : "✗ 失败"}（总耗时约 ${elapsed}ms）`
  );
}

runTests().catch((error) => {
  console.error("012-基于时间分片的累加求和 02-answer.js: 运行失败");
  throw error;
});
