/**
 * 题目标题：实现缓存异步接口
 * 题目类型：手写题
 * 难度：高级
 *
 * 解题思路：
 * 这道题的难点在于同时管理三种状态：
 * - "首次请求"（无缓存、无 in-flight）：直接调用原函数，等待结果，写入缓存
 * - "已有缓存"：立即返回缓存值，同时在后台发起一次刷新请求（如果当前没有在跑的）
 * - "相同入参正在请求中"：复用已有的 in-flight Promise，不重复发起请求
 *
 * 需要两个 Map：
 * - cache：存已拿到的结果，key 是序列化后的入参
 * - pending：存正在进行中的 Promise，key 同上
 *
 * 关键流程：
 * 1. 序列化入参得到 key
 * 2. 无缓存 + 无 pending → 发起请求，结果回来后写 cache、删 pending
 * 3. 无缓存 + 有 pending → 直接返回 pending[key]（等同一个请求）
 * 4. 有缓存 + 无 pending → 立即返回 cache[key]，后台发起刷新请求
 * 5. 有缓存 + 有 pending → 立即返回 cache[key]，刷新请求已在跑，不重复发
 *
 * 时间复杂度：O(1)（每次调用是常数级 Map 查找）
 * 空间复杂度：O(n)（n 为不同入参的数量）
 *
 * 边界情况：
 * 1. 同一入参并发调用时，首次调用只发一个请求，其余等待
 * 2. 后台刷新请求完成后，下一次调用才能拿到新值
 * 3. 如果原函数抛错，应确保 pending 被清理，避免永久阻塞（本题不强要求，了解即可）
 *
 * 面试追问：
 * 1. 为什么需要 pending Map？光靠 cache Map 不行吗？
 *    → 没有 pending 的话，第一次并发调用时会发出多个重复请求；
 *      有缓存时也需要它来防止后台刷新重复触发。
 * 2. 后台刷新失败了怎么办？
 *    → 可以保留旧缓存不更新，或根据业务决定是否清除缓存，本题答案保留旧缓存。
 * 3. 如何给缓存加过期时间（TTL）？
 *    → 在 cache 里一同存入时间戳，取值时判断是否超时，超时则视为无缓存。
 * 4. 这个模式在现实中用在哪里？
 *    → SWR（stale-while-revalidate）策略：先返回旧数据保证响应速度，后台刷新保证最终一致性。
 */

function cacheApi(fn) {
  const cache = new Map()   // key -> 已缓存的结果
  const pending = new Map() // key -> 正在进行中的 Promise

  return async function (...args) {
    const key = JSON.stringify(args)

    if (!cache.has(key)) {
      // 无缓存
      if (pending.has(key)) {
        // 已有 in-flight 请求，直接复用
        return pending.get(key)
      }
      // 发起首次请求
      const promise = fn(...args).then((result) => {
        cache.set(key, result)
        pending.delete(key)
        return result
      })
      pending.set(key, promise)
      return promise
    }

    // 有缓存：立即返回旧值
    const cachedValue = cache.get(key)

    if (!pending.has(key)) {
      // 后台发起刷新，不 await
      const promise = fn(...args).then((result) => {
        cache.set(key, result)
        pending.delete(key)
        return result
      })
      pending.set(key, promise)
    }

    return cachedValue
  }
}

// ===== 以下为测试代码，请勿修改 =====

const mockApi = (() => {
  let id = 0
  return async (req) => {
    await new Promise((r) => setTimeout(r, 1000))
    return { req, id: id++ }
  }
})()

const cachedApi = cacheApi(mockApi);

(async () => {
  console.log('--- 第一次调用（无缓存，等待 1 秒）---')
  const r1 = await Promise.all([cachedApi('a'), cachedApi('b'), cachedApi('a')])
  console.log('实际：', r1)
  console.log('预期：', [{ req: 'a', id: 0 }, { req: 'b', id: 1 }, { req: 'a', id: 0 }])

  console.log('\n--- 第二次调用（有缓存，立即返回旧值）---')
  const r2 = await Promise.all([cachedApi('a'), cachedApi('b'), cachedApi('a')])
  console.log('实际：', r2)
  console.log('预期：', [{ req: 'a', id: 0 }, { req: 'b', id: 1 }, { req: 'a', id: 0 }])

  await new Promise((r) => setTimeout(r, 1000))

  console.log('\n--- 第三次调用（缓存已更新，立即返回新值）---')
  const r3 = await Promise.all([cachedApi('a'), cachedApi('b'), cachedApi('a')])
  console.log('实际：', r3)
  console.log('预期：', [{ req: 'a', id: 2 }, { req: 'b', id: 3 }, { req: 'a', id: 2 }])
})().catch((err) => {
  console.error('015-实现缓存异步接口 02-answer.js: 运行失败')
  throw err
})
