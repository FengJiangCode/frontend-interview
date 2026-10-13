/**
 * 题目标题：实现缓存异步接口
 * 题目类型：手写题
 * 难度：高级
 *
 * 题目描述：
 * 请实现 cacheApi 函数，它接受一个异步函数 fn，返回一个带缓存能力的包装函数。
 *
 * 缓存行为要求：
 * 1. 第一次调用：没有缓存，行为和调用原始异步函数完全相同（等待结果返回）
 * 2. 有缓存后：立即返回缓存值，同时在后台发起新请求更新缓存
 * 3. 相同入参：同一时刻最多只发起一个请求（多次调用会复用同一个 in-flight 请求）
 * 4. 缓存以入参为 key（用 JSON.stringify 序列化）
 *
 * 使用示例：
 *
 * const cachedApi = cacheApi(mockApi);
 *
 * // 第一次调用，无缓存，等待 1 秒后输出
 * await Promise.all([cachedApi('a'), cachedApi('b'), cachedApi('a')])
 * // => [ { req: 'a', id: 0 }, { req: 'b', id: 1 }, { req: 'a', id: 0 } ]
 * // 注意：两个 cachedApi('a') 只发起了一次真实请求
 *
 * // 第二次调用，有缓存，立即返回旧值，后台更新缓存
 * await Promise.all([cachedApi('a'), cachedApi('b'), cachedApi('a')])
 * // => [ { req: 'a', id: 0 }, { req: 'b', id: 1 }, { req: 'a', id: 0 } ]（马上输出）
 *
 * // 等后台更新完成（1秒）后再调用，拿到新缓存值
 * await Promise.all([cachedApi('a'), cachedApi('b'), cachedApi('a')])
 * // => [ { req: 'a', id: 2 }, { req: 'b', id: 3 }, { req: 'a', id: 2 } ]（马上输出）
 *
 * 作答要求：
 * 1. 第一次调用无缓存时，等待真实结果返回
 * 2. 有缓存时，立即返回缓存值并在后台刷新
 * 3. 同一时刻对相同入参最多只有一个 in-flight 请求
 * 4. 不同入参之间互不影响
 *
 * 测试说明：
 * 1. 在下方 TODO 区域补全实现
 * 2. 运行 node 01-question.js
 * 3. 对照控制台输出判断是否符合预期
 */

// TODO: 在这里完成你的实现
function cacheApi(fn) {
  const map = new Map();

  return function (...args) {
    const key = JSON.stringify(args);
    if (!map.has(key)) {
      map.set(key, fn(...args));
    }
    return map.get(key);
  };
}

// ===== 以下为测试代码，请勿修改 =====

const mockApi = (() => {
  let id = 0;
  return async (req) => {
    await new Promise((r) => setTimeout(r, 1000));
    return { req, id: id++ };
  };
})();

const cachedApi = cacheApi(mockApi);

(async () => {
  console.log("--- 第一次调用（无缓存，等待 1 秒）---");
  const r1 = await Promise.all([
    cachedApi("a"),
    cachedApi("b"),
    cachedApi("a"),
  ]);
  console.log("实际：", r1);
  console.log("预期：", [
    { req: "a", id: 0 },
    { req: "b", id: 1 },
    { req: "a", id: 0 },
  ]);

  console.log("\n--- 第二次调用（有缓存，立即返回旧值）---");
  const r2 = await Promise.all([
    cachedApi("a"),
    cachedApi("b"),
    cachedApi("a"),
  ]);
  console.log("实际：", r2);
  console.log("预期：", [
    { req: "a", id: 0 },
    { req: "b", id: 1 },
    { req: "a", id: 0 },
  ]);

  await new Promise((r) => setTimeout(r, 1000));

  console.log("\n--- 第三次调用（缓存已更新，立即返回新值）---");
  const r3 = await Promise.all([
    cachedApi("a"),
    cachedApi("b"),
    cachedApi("a"),
  ]);
  console.log("实际：", r3);
  console.log("预期：", [
    { req: "a", id: 2 },
    { req: "b", id: 3 },
    { req: "a", id: 2 },
  ]);
})().catch((err) => {
  console.error("015-实现缓存异步接口 01-question.js: 请先完成 TODO");
  console.error(err.message);
});
