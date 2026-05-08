/**
 * 题目标题：对象扁平化
 * 题目类型：手写题
 * 难度：中级
 *
 * 题目描述：
 * 实现 flatten(input) 函数，input 为任意嵌套的 Object 或 Array，
 * 返回扁平化后的对象，key 使用点/括号路径表示。
 * 值为 null 或 undefined 的字段直接丢弃（不出现在结果中）。
 *
 * 路径规则：
 * - 对象的字段用点号连接：parent.child
 * - 数组的下标用方括号：arr[0]
 * - 混合嵌套时组合两者：b[2].c、b[3][0]
 *
 * 举例说明：
 * 输入：
 *   {
 *     a: 1,
 *     b: [1, 2, { c: true }, [3]],
 *     d: { e: 2, f: 3 },
 *     g: null,
 *   }
 * 输出：
 *   {
 *     "a": 1,
 *     "b[0]": 1,
 *     "b[1]": 2,
 *     "b[2].c": true,
 *     "b[3][0]": 3,
 *     "d.e": 2,
 *     "d.f": 3,
 *   }
 *
 * 作答要求：
 * 1. 先理解路径拼接规则，再动手写
 * 2. 注意区分数组下标和对象字段的路径格式
 * 3. null / undefined 值应在递归过程中过滤，不写入结果
 *
 * 测试说明：
 * 1. 在下方 TODO 区域完成实现
 * 2. 运行 node 01-question.js
 * 3. 对照"实际结果"和"预期结果"判断是否正确
 */

// TODO: 在这里完成你的实现
export function flatten(input) {
  const res = {};

  function fn(input, key) {
    if (input === null || input === undefined) {
      return;
    } else if (typeof input === "object") {
      if (Array.isArray(input)) {
        input.forEach((value, index) => {
          fn(value, key + `[${index}]`);
        });
      } else {
        Object.entries(input).forEach(([k, value]) => {
          const newKey = key ? `${key}.${k}` : k;
          fn(value, newKey);
        });
      }
    } else {
      res[key] = input;
    }
  }

  fn(input, "");

  return res;
}

function runExample() {
  const input = {
    a: 1,
    b: [1, 2, { c: true }, [3]],
    d: { e: 2, f: 3 },
    g: null,
  };

  const actual = flatten(input);

  const expected = {
    a: 1,
    "b[0]": 1,
    "b[1]": 2,
    "b[2].c": true,
    "b[3][0]": 3,
    "d.e": 2,
    "d.f": 3,
  };

  console.log("题目：对象扁平化");
  console.log("实际结果:", actual);
  console.log("预期结果:", expected);
  console.log("是否一致:", JSON.stringify(actual) === JSON.stringify(expected));

  // 追加边界用例
  console.log("\n--- 边界：顶层为数组 ---");
  console.log(flatten([1, [2, 3]]));
  // 预期: { "[0]": 1, "[1][0]": 2, "[1][1]": 3 }

  console.log("\n--- 边界：含 undefined ---");
  console.log(flatten({ a: undefined, b: 1 }));
  // 预期: { "b": 1 }
}

runExample();
