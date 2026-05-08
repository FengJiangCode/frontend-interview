/**
 * 题目标题：对象扁平化
 * 题目类型：手写题
 * 难度：中级
 *
 * 解题思路：
 * DFS 递归遍历整棵对象/数组树，维护一个 prefix 记录当前路径。
 * - 遇到 null / undefined → 直接返回，不写入结果
 * - 遇到数组 → 遍历下标，路径拼接为 prefix[i]
 * - 遇到普通对象 → 遍历 key，路径拼接为 prefix.key（prefix 为空时直接用 key）
 * - 遇到原始值 → 说明已到叶子节点，写入 result[prefix] = value
 *
 * 时间复杂度：O(n)，n 为所有节点总数（每个节点访问一次）
 *
 * 空间复杂度：O(d)，d 为最大嵌套深度（递归调用栈）；结果对象本身 O(n)
 *
 * 复杂度如何计算：
 * - 每个叶子节点都会被访问且只被访问一次 → O(n)
 * - 递归深度等于对象最大嵌套层数 → O(d) 栈空间
 *
 * 关键边界情况：
 * 1. null 的 typeof 是 "object"，必须在对象分支之前先判断 === null
 * 2. 顶层为数组时 prefix 初始为空，路径应为 "[0]" 而非 ".[0]"
 * 3. false / 0 / "" 是合法的叶子值，不能用 if (value) 过滤
 *
 * 面试追问：
 * 1. 如果输入有循环引用怎么处理？
 *    → 用 WeakSet 记录已访问对象，遇到重复对象跳过或抛错
 * 2. 能写一个 unflatten，把扁平对象还原回嵌套结构吗？
 *    → 按路径拆分 key（分割 . 和 []），逐段在结果对象上建路径
 * 3. 如果 key 本身含有 . 或 [] 字符怎么办？
 *    → 需要转义或改用数组路径 + 序列化方案（如 lodash 的路径规范）
 */

export function flatten(input, prefix = "", result = {}) {
  if (input === null || input === undefined) return result;

  if (Array.isArray(input)) {
    input.forEach((item, index) => {
      const key = prefix ? `${prefix}[${index}]` : `[${index}]`;
      flatten(item, key, result);
    });
  } else if (typeof input === "object") {
    Object.keys(input).forEach((k) => {
      const key = prefix ? `${prefix}.${k}` : k;
      flatten(input[k], key, result);
    });
  } else {
    // 原始值叶子节点（number / string / boolean）
    result[prefix] = input;
  }

  return result;
}

function runExample() {
  const input = {
    a: 1,
    b: [1, 2, { c: true }, [3]],
    d: { e: 2, f: 3 },
    g: null,
  };

  console.log("题目：对象扁平化");
  console.log(flatten(input));
  /*
  预期输出：
  {
    a: 1,
    'b[0]': 1,
    'b[1]': 2,
    'b[2].c': true,
    'b[3][0]': 3,
    'd.e': 2,
    'd.f': 3
  }
  */

  console.log("\n--- 顶层数组 ---");
  console.log(flatten([1, [2, 3]]));
  // { '[0]': 1, '[1][0]': 2, '[1][1]': 3 }

  console.log("\n--- 含 undefined ---");
  console.log(flatten({ a: undefined, b: 1 }));
  // { b: 1 }

  console.log("\n--- 假值不丢弃 ---");
  console.log(flatten({ a: 0, b: false, c: "" }));
  // { a: 0, b: false, c: '' }
}

runExample();
