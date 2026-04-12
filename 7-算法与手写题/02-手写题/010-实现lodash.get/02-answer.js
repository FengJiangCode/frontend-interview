/**
 * 题目标题：实现 lodash.get
 * 题目类型：前端手写题
 * 难度：中级
 *
 * 解题思路：
 * 这道题的关键在于先把 path 统一转换成数组路径，
 * 然后按顺序一层一层往下取值。
 *
 * 例如：
 * "a.b.c" -> ["a", "b", "c"]
 * "a[0].b" -> ["a", "0", "b"]
 *
 * 处理流程可以分成两步：
 * 1. 标准化路径，把字符串路径转换成数组
 * 2. 遍历路径，逐层读取对象属性
 *
 * 如果在中途取值失败，
 * 比如 current 为 null / undefined，
 * 或者已经取不到对应属性，
 * 就直接返回 defaultValue。
 *
 * 时间复杂度：
 * O(n)
 *
 * 空间复杂度：
 * O(n)
 *
 * 复杂度如何计算：
 * 假设 path 被拆分后有 n 段，
 * 路径解析和逐层访问都与路径长度线性相关，
 * 所以时间复杂度是 O(n)。
 *
 * 解析后的路径数组会占用 O(n) 额外空间，
 * 所以空间复杂度也是 O(n)。
 *
 * 关键边界情况：
 * 1. path 是数组时，不需要再解析
 * 2. object 为 null / undefined 时，直接返回 defaultValue
 * 3. 路径存在但值本身为 undefined 时，这里统一返回 defaultValue
 * 4. 需要支持数组下标路径，例如 a[0].b
 *
 * 面试追问：
 * 1. 如何区分“路径不存在”和“值本身就是 undefined”？
 * 2. 如果要实现 lodash.set，你会怎么写？
 * 3. 如果 path 写成 a..b 或者 [] 这种异常格式，你要怎么处理？
 */

function normalizePath(path) {
  if (Array.isArray(path)) {
    return path;
  }

  return String(path)
    .replace(/\[(\w+)\]/g, ".$1")
    .split(".")
    .filter(Boolean);
}

export function get(object, path, defaultValue) {
  const keys = normalizePath(path);
  let current = object;

  for (let i = 0; i < keys.length; i += 1) {
    if (current == null) {
      return defaultValue;
    }

    current = current[keys[i]];
  }

  return current === undefined ? defaultValue : current;
}

function runExample() {
  const obj = {
    a: {
      b: {
        c: 123,
      },
    },
    list: [
      { value: 1 },
      { value: 2 },
    ],
  };

  console.log("题目：实现 lodash.get");
  console.log('get(obj, "a.b.c", "default") =>', get(obj, "a.b.c", "default"));
  console.log('get(obj, ["a", "b", "c"], "default") =>', get(obj, ["a", "b", "c"], "default"));
  console.log('get(obj, "list[1].value", null) =>', get(obj, "list[1].value", null));
  console.log('get(obj, "a.b.d", "default") =>', get(obj, "a.b.d", "default"));
}

runExample();
