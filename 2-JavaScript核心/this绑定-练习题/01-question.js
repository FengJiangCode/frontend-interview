/**
 * 题目标题：this 绑定关系判断题（10 题）
 * 题目类型：概念判断题（预测输出）
 * 难度：中级
 *
 * 题目描述：
 * 下面 10 个代码片段分别会输出什么？请先写出预判，再运行本文件对照。
 * 每道题都会同时打印「非严格模式」和「严格模式」两套结果 ——
 * 这两套结果的差异本身就是高频考点，不要只看一套。
 *
 * 题面：
 *
 * 1. 默认绑定
 *    function who() { return this }
 *    who()
 *
 * 2. 赋值丢 this
 *    const obj = { tag: 'obj', who() { return this.tag } }
 *    const f = obj.who
 *    f()
 *
 * 3. 当回调传参
 *    const obj = { count: 1, inc() { this.count++ } }
 *    ;[1, 2].forEach(obj.inc)
 *    obj.count
 *
 * 4. 箭头函数做回调
 *    const obj = { count: 1, inc() { [1, 2].forEach(() => { this.count++ }) } }
 *    obj.inc()
 *    obj.count
 *
 * 5. 箭头函数的 this 由谁决定
 *    const obj = { tag: 'obj', who: () => this }
 *    obj.who()
 *
 * 6. 给箭头函数 call
 *    const obj = { tag: 'obj' }
 *    const f = () => this.tag
 *    f.call(obj)
 *
 * 7. new 撞上 bind
 *    function Fn() { return this }
 *    const B = Fn.bind({ tag: 'bound' })
 *    const inst = new B()
 *    inst instanceof Fn   // ?
 *    inst.tag             // ?
 *
 * 8. bind 之后还能改吗
 *    function who() { return this.tag }
 *    const A = who.bind({ tag: 'a' })
 *    A.call({ tag: 'b' })
 *
 * 9. 箭头函数嵌在对象方法里
 *    const obj = {
 *      tag: 'obj',
 *      get() {
 *        return { tag: 'inner', who: () => this.tag }
 *      }
 *    }
 *    obj.get().who()
 *
 * 10. class 的方法
 *     class C {
 *       constructor() { this.count = 0 }
 *       inc() { this.count++ }
 *     }
 *     const c = new C()
 *     const inc = c.inc
 *     inc()
 *
 * 作答要求：
 * 1. 先在下方的「我的预判」区域写下 10 个答案，不要直接往下看
 * 2. 再运行 `node 01-question.js`
 * 3. 逐题对照，答错的去看 `02-answer.js` 里的归因
 *
 * 测试说明：
 * - 无依赖，直接 `node 01-question.js` 运行
 * - 严格模式的结果通过在函数体前拼接 `'use strict'` 得到。
 *   用 Function 构造函数是为了保证「被测函数本身是严格/非严格」完全由我们控制，
 *   不受本文件所处的 ESM 模块（ESM 恒为严格模式）影响
 * - 结论见 `02-answer.js`
 */

// ===== 我的预判（先写这里，再运行）=====
//  1.
//  2.
//  3.
//  4.
//  5.
//  6.
//  7. instanceof Fn = ___ ; inst.tag = ___
//  8.
//  9.
// 10.

// ===== 以下为运行区，先写完预判再往下看 =====

/**
 * 每道题的可执行函数体。最后一个表达式用 return 交给运行器捕获。
 * 展示给用户看的代码就是这个 body 本身，避免题面与执行代码不一致。
 */
const CASES = [
  {
    id: 1,
    title: "默认绑定",
    body: `
function who() { return this }
return who()
`,
  },
  {
    id: 2,
    title: "赋值丢 this",
    body: `
const obj = { tag: 'obj', who() { return this.tag } }
const f = obj.who
return f()
`,
  },
  {
    id: 3,
    title: "当回调传参（forEach）",
    body: `
const obj = { count: 1, inc() { this.count++ } }
;[1, 2].forEach(obj.inc)
return obj.count
`,
  },
  {
    id: 4,
    title: "箭头函数做回调",
    body: `
const obj = { count: 1, inc() { [1, 2].forEach(() => { this.count++ }) } }
obj.inc()
return obj.count
`,
  },
  {
    id: 5,
    title: "箭头函数的 this 由谁决定",
    body: `
const obj = { tag: 'obj', who: () => this }
return obj.who()
`,
  },
  {
    id: 6,
    title: "给箭头函数 call",
    body: `
const obj = { tag: 'obj' }
const f = () => this.tag
return f.call(obj)
`,
  },
  {
    id: 7,
    title: "new 撞上 bind",
    body: `
function Fn() { return this }
const B = Fn.bind({ tag: 'bound' })
const inst = new B()
return 'instanceof Fn = ' + (inst instanceof Fn) + ' ，inst.tag = ' + inst.tag
`,
  },
  {
    id: 8,
    title: "bind 之后还能改吗",
    body: `
function who() { return this.tag }
const A = who.bind({ tag: 'a' })
return A.call({ tag: 'b' })
`,
  },
  {
    id: 9,
    title: "箭头函数嵌在对象方法里",
    body: `
const obj = {
  tag: 'obj',
  get() {
    return { tag: 'inner', who: () => this.tag }
  }
}
return obj.get().who()
`,
  },
  {
    id: 10,
    title: "class 的方法",
    body: `
class C {
  constructor() { this.count = 0 }
  inc() { this.count++ }
}
const c = new C()
const inc = c.inc
inc()
`,
  },
];

/** 把返回值转成好读的字符串 */
function format(value) {
  if (value === undefined) return "undefined";
  if (value === globalThis) return "globalThis（浏览器里是 window）";
  if (typeof value === "number" && Number.isNaN(value)) return "NaN";
  if (value !== null && typeof value === "object") return JSON.stringify(value);
  return String(value);
}

/**
 * 用 Function 构造函数执行。
 * 默认的 Function 代码体是非严格的，只有显式写上 'use strict' 才变严格，
 * 所以这里能精确控制「被测函数」的严格性。
 */
function run(body, strict) {
  try {
    const source = strict ? "'use strict';\n" + body : body;
    return { ok: true, value: new Function(source)() };
  } catch (error) {
    return { ok: false, value: error.constructor.name + ": " + error.message };
  }
}

function describe(result) {
  return result.ok ? format(result.value) : "抛错 " + result.value;
}

async function runExample() {
  console.log("this 绑定判断题 · 先写预判，再看结果");
  console.log("（非严格 = 浏览器普通 script；严格 = 'use strict' 或 ESM 模块）");

  for (const item of CASES) {
    console.log("");
    console.log("─".repeat(56));
    console.log("Q" + item.id + "  " + item.title);
    console.log("─".repeat(56));
    console.log(item.body.trim());
    console.log("");
    console.log("  非严格模式 → " + describe(run(item.body, false)));
    console.log("  严格模式   → " + describe(run(item.body, true)));
  }

  console.log("");
  console.log("─".repeat(56));
  console.log("对照完答案后，去 02-answer.js 看每题的归因。");
}

runExample().catch((error) => {
  console.error("运行失败");
  throw error;
});
