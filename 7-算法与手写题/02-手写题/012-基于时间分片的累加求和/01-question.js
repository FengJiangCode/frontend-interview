/**
 * 题目标题：基于时间分片的累加求和
 * 题目类型：手写题
 * 难度：中级
 *
 * 题目描述：
 * 请手写一个 timeSliceSum 函数，计算从 1 到 n（n < 1,000,000）的累加和。
 *
 * 约束：
 * 1. 单次处理时间不得超过 15 毫秒，以避免阻塞主线程
 * 2. 每批处理时尽可能多地完成累加，超过 15ms 后将剩余任务推迟到下一个宏任务
 * 3. 不能直接用数学公式 (n*(n+1))/2 一次性得出结果，必须模拟逐步累加
 * 4. 累加完成后通过 Promise resolve 返回最终结果
 *
 * 举例说明：
 * 输入：n = 100
 * 输出：5050
 *
 * 输入：n = 10
 * 输出：55
 *
 * 作答要求：
 * 1. 在下方 TODO 区域补全实现
 * 2. 运行 node 01-question.js
 * 3. 对照控制台输出判断是否符合预期
 */

// TODO: 在这里完成你的实现
export async function timeSliceSum(n) {
  return new Promise((resolve, reject) => {
    let sum = 0;

    function add(x) {
      const start = performance.now();
      while (x > 0 && performance.now() - start <= 15) {
        sum = sum + x;
        x--;
      }
      if (x <= 0) {
        resolve(sum);
      } else {
        setTimeout(() => add(x));
      }
    }

    add(n);
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
      `timeSliceSum(${n}) = ${result}，预期 ${expected}，${pass ? "✓ 通过" : "✗ 失败"}`,
    );
  }

  // 大数测试：验证不会长时间阻塞（计时仅供参考，不作为断言）
  const n = 999999;
  const expected = (n * (n + 1)) / 2;
  const t0 = performance.now();
  const result = await timeSliceSum(n);
  const elapsed = (performance.now() - t0).toFixed(0);
  const pass = result === expected;
  console.log(
    `timeSliceSum(${n}) = ${result}，预期 ${expected}，${pass ? "✓ 通过" : "✗ 失败"}（总耗时约 ${elapsed}ms）`,
  );
}

runTests().catch((error) => {
  console.error("012-基于时间分片的累加求和 01-question.js: 请先完成 TODO");
  console.error(error.message);
});
