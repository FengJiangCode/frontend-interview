/**
 * 题目标题：实现 lodash.get
 * 题目类型：前端手写题
 * 难度：中级
 *
 * 目标描述：
 * 请手写实现一个 get(object, path, defaultValue) 方法，
 * 行为尽量接近 lodash 的 _.get。
 *
 * 它需要支持：
 * 1. 通过字符串路径安全取值，比如 "a.b.c"
 * 2. 通过带数组下标的字符串路径取值，比如 "a[0].b"
 * 3. 通过数组路径取值，比如 ["a", "b", "c"]
 * 4. 当路径不存在时，返回 defaultValue
 *
 * 示例：
 * const obj = {
 *   a: {
 *     b: {
 *       c: 123,
 *     },
 *   },
 * };
 *
 * get(obj, "a.b.c"); // 123
 * get(obj, ["a", "b", "c"]); // 123
 * get(obj, "a.b.d", "default"); // "default"
 *
 * 再比如：
 * const obj2 = {
 *   a: [
 *     { b: 1 },
 *     { b: 2 },
 *   ],
 * };
 *
 * get(obj2, "a[0].b"); // 1
 * get(obj2, "a[1].b"); // 2
 * get(obj2, "a[2].b", null); // null
 *
 * 作答要求：
 * 1. 支持字符串路径和数组路径
 * 2. 支持对象和数组的混合访问
 * 3. 取值失败时返回 defaultValue
 * 4. 不要依赖第三方库
 *
 * 测试说明：
 * 1. 直接在下方答题区补全实现
 * 2. 运行 node 01-question.js
 * 3. 对照“实际结果”和“预期结果”判断是否正确
 */

// TODO: 在这里完成你的实现
export function get(object, path, defaultValue) {
  if (typeof path === 'string') {
    path = String(path)
    .replace(/\[(\w+)\]/g, ".$1")
    .split(".")
    .filter(Boolean);
  }
  
  let current = object
  
  for (let index = 0; index < path.length; index++) {
    const key = path[index];
    if ( current === undefined || current ===null) {
      return defaultValue
    }
    current = current[key]
  }

  return current === undefined ? defaultValue : current
}

function runExample() {
  const obj = {
    a: {
      b: {
        c: 123,
      },
    },
  };

  const actual = get(obj, "a.b.c", "default");
  const expected = 123;

  console.log("题目：实现 lodash.get");
  console.log("测试用例输入:", JSON.stringify(obj), 'path = "a.b.c"');
  console.log("实际结果:", actual);
  console.log("预期结果:", expected);
}

try {
  runExample();
} catch (error) {
  console.error("010-实现lodash.get 01-question.js: 请先完成 TODO");
  console.error(error.message);
}
