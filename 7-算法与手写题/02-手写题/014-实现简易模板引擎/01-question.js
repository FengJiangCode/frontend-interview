/**
 * 题目标题：实现简易模板引擎
 * 题目类型：手写题
 * 难度：中级
 *
 * 题目描述：
 * 实现 template(str) 函数，接收一个带有 {{ key }} 占位符的模板字符串，
 * 返回一个渲染函数。渲染函数接收数据对象，将模板中的占位符替换为对应值后返回结果字符串。
 * 占位符格式为 {{ key }}，花括号内侧允许有空格。
 *
 * 要求实现两个版本：
 * 1. 使用 String.prototype.replace
 * 2. 不使用 replace，手动遍历字符串
 *
 * 举例说明：
 * 输入：
 *   const tpl = template('<p>hey there {{ name }}, you are {{ age }} years old</p>')
 *   tpl({ name: 'Neo', age: 18 })
 * 输出：
 *   '<p>hey there Neo, you are 18 years old</p>'
 *
 * 作答要求：
 * 1. 先完成 replace 版本，再挑战不用 replace 的版本
 * 2. 注意同一占位符在模板中可能出现多次
 * 3. key 不存在于数据对象时，用空字符串替代
 *
 * 测试说明：
 * 1. 在下方 TODO 区域完成实现
 * 2. 运行 node 01-question.js
 * 3. 对照"实际结果"和"预期结果"判断是否正确
 */

// TODO: 版本一 —— 使用 replace
export function template(str) {
  return function (obj) {
    Object.entries(obj).forEach(([key, value]) => {
      str = str.replace(new RegExp(`\\{\\{\\s*${key}\\s*\\}\\}`, "g"), value);
    });

    return str;
  };
}

// TODO: 版本二 —— 不使用 replace
export function templateNoReplace(str) {
  throw new Error("TODO: 请完成手动遍历版本");
}

function runExample() {
  const cases = [
    {
      tpl: "<p>hey there {{ name }} {{ name }}</p>",
      data: { name: "Neo" },
      expected: "<p>hey there Neo Neo</p>",
    },
    {
      tpl: "Hello, {{name}}! You are {{age}} years old.",
      data: { name: "Alice", age: 30 },
      expected: "Hello, Alice! You are 30 years old.",
    },
    {
      tpl: "Hi {{ missing }}!",
      data: {},
      expected: "Hi !",
    },
  ];

  console.log("=== 版本一：replace ===");
  for (const { tpl, data, expected } of cases) {
    const actual = template(tpl)(data);
    console.log("实际:", actual);
    console.log("预期:", expected);
    console.log("通过:", actual === expected, "\n");
  }

  console.log("=== 版本二：不用 replace ===");
  for (const { tpl, data, expected } of cases) {
    const actual = templateNoReplace(tpl)(data);
    console.log("实际:", actual);
    console.log("预期:", expected);
    console.log("通过:", actual === expected, "\n");
  }
}

runExample();
