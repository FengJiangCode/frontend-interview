/**
 * 题目标题：原型链判断题（10 题）
 * 题目类型：概念判断题（预测输出）
 * 难度：中级
 *
 * 题目描述：
 * 下面 10 个代码片段和加分题分别会输出什么？请先写出预判，再运行本文件对照。
 *
 * 与 `this` 那套不同，原型链的行为**不受严格模式影响**，所以每题只跑一次。
 *
 * 题面：
 *
 * 1. prototype 和 __proto__
 *    function Fn() {}
 *    const f = new Fn()
 *    f.prototype                                  // ?
 *    Object.getPrototypeOf(f) === Fn.prototype    // ?
 *    typeof Fn.prototype                          // ?
 *
 * 2. 原型链的尽头
 *    Object.getPrototypeOf(f) === Fn.prototype                // ?
 *    Object.getPrototypeOf(Fn.prototype) === Object.prototype // ?
 *    Object.getPrototypeOf(Object.prototype)                  // ?
 *
 * 3. 读走原型，写走自己
 *    Fn.prototype.tag = 'proto'
 *    f.tag                                        // ?
 *    f.tag = 'own'; f.tag                         // ?
 *    Fn.prototype.tag                             // ?
 *    f.hasOwnProperty('tag')                      // ?
 *
 * 4. 原型上的数组
 *    Fn.prototype.list = []
 *    a.list.push(1); b.list                       // ?
 *    a.list === b.list                            // ?
 *    a.list = [9]; b.list                         // ?
 *
 * 5. 修改原型 vs 重新赋值原型
 *    Fn.prototype.tag = 'old'; const f = new Fn()
 *    Fn.prototype.tag = 'new'; f.tag              // ?
 *    Fn.prototype = { tag: 'brand new' }; f.tag   // ?
 *    new Fn().tag                                 // ?
 *
 * 6. 函数自己的原型链
 *    Object.getPrototypeOf(Fn) === Function.prototype  // ?
 *    Object.getPrototypeOf(Fn) === Fn.prototype        // ?
 *
 * 7. instanceof 在查什么
 *    f instanceof Fn               // ?
 *    Fn.prototype = {}
 *    f instanceof Fn               // ?
 *    new Fn() instanceof Fn        // ?
 *
 * 8. constructor 会失效吗
 *    f.constructor === Fn              // ?
 *    Fn.prototype = {}
 *    f.constructor === Fn              // ?
 *    new Fn().constructor === Fn       // ?
 *    new Fn().constructor === Object   // ?
 *
 * 9. Object.create(null)
 *    Object.getPrototypeOf(bare)   // ?
 *    typeof bare.toString          // ?
 *    bare instanceof Object        // ?
 *
 * 10. in vs hasOwnProperty
 *     Fn.prototype.tag = 'proto'; f.own = 1
 *     'own' in f              // ?
 *     'tag' in f              // ?
 *     f.hasOwnProperty('own') // ?
 *     f.hasOwnProperty('tag') // ?
 *
 * 加分题：class 和普通函数挂方法有什么区别
 *     class C { m() {} }
 *     function Fn() {}
 *     Fn.prototype.m = function () {}
 *     typeof C                                          // ?
 *     C.prototype.constructor === C                     // ?
 *     ...getOwnPropertyDescriptor(C.prototype, 'm').enumerable   // ?
 *     ...getOwnPropertyDescriptor(Fn.prototype, 'm').enumerable  // ?
 *
 * 作答要求：
 * 1. 先在下方的「我的预判」区域写下答案，不要直接往下看
 * 2. 再运行 `node 01-question.js`
 * 3. 逐题对照，答错的去看 `02-answer.js` 里的归因
 *
 * 测试说明：
 * - 无依赖，直接 `node 01-question.js` 运行
 * - 每题的代码就是展示给你的那段，避免题面与执行代码不一致
 * - 结论见 `02-answer.js`
 */

// ===== 我的预判（先写这里，再运行）=====
//  1.
//  2.
//  3.
//  4.
//  5.
//  6.
//  7.
//  8.
//  9.
// 10.
// 加分.

// ===== 以下为运行区，先写完预判再往下看 =====

/**
 * 每道题的可执行函数体，返回一组 [说明, 值] 用于展示。
 */
const CASES = [
  {
    id: 1,
    title: "prototype 和 __proto__",
    body: `
function Fn() {}
const f = new Fn()
return [
  ['f.prototype（实例上访问）', f.prototype],
  ['getPrototypeOf(f) === Fn.prototype', Object.getPrototypeOf(f) === Fn.prototype],
  ['typeof Fn.prototype', typeof Fn.prototype]
]
`,
  },
  {
    id: 2,
    title: "原型链的尽头",
    body: `
function Fn() {}
const f = new Fn()
return [
  ['f → Fn.prototype', Object.getPrototypeOf(f) === Fn.prototype],
  ['Fn.prototype → Object.prototype', Object.getPrototypeOf(Fn.prototype) === Object.prototype],
  ['Object.prototype 的原型（链条尽头）', Object.getPrototypeOf(Object.prototype)]
]
`,
  },
  {
    id: 3,
    title: "读走原型，写走自己",
    body: `
function Fn() {}
Fn.prototype.tag = 'proto'
const f = new Fn()
const fromProto = f.tag
f.tag = 'own'
return [
  ['赋值前读 f.tag（来自原型）', fromProto],
  ['赋值后读 f.tag', f.tag],
  ['原型上的 Fn.prototype.tag 变了吗', Fn.prototype.tag],
  ["f.hasOwnProperty('tag')", f.hasOwnProperty('tag')]
]
`,
  },
  {
    id: 4,
    title: "原型上的数组",
    body: `
function Fn() {}
Fn.prototype.list = []
const a = new Fn()
const b = new Fn()
a.list.push(1)
const afterPush = b.list
const sameRef = a.list === b.list
a.list = [9]
return [
  ['a.list.push(1) 之后 b.list', afterPush],
  ['a.list === b.list（同一个数组）', sameRef],
  ['改成 a.list = [9] 之后 b.list', b.list]
]
`,
  },
  {
    id: 5,
    title: "修改原型 vs 重新赋值原型",
    body: `
function Fn() {}
Fn.prototype.tag = 'old'
const f = new Fn()
Fn.prototype.tag = 'new'
const afterModify = f.tag
Fn.prototype = { tag: 'brand new' }
return [
  ['修改原型属性后 f.tag', afterModify],
  ['重新赋值原型后 f.tag（老实例）', f.tag],
  ['重新赋值原型后 new Fn().tag', new Fn().tag]
]
`,
  },
  {
    id: 6,
    title: "函数自己的原型链",
    body: `
function Fn() {}
return [
  ['getPrototypeOf(Fn) === Function.prototype', Object.getPrototypeOf(Fn) === Function.prototype],
  ['getPrototypeOf(Fn) === Fn.prototype', Object.getPrototypeOf(Fn) === Fn.prototype]
]
`,
  },
  {
    id: 7,
    title: "instanceof 在查什么",
    body: `
function Fn() {}
const f = new Fn()
const before = f instanceof Fn
Fn.prototype = {}
return [
  ['换原型前 f instanceof Fn', before],
  ['换原型后 f instanceof Fn', f instanceof Fn],
  ['换原型后 new Fn() instanceof Fn', new Fn() instanceof Fn]
]
`,
  },
  {
    id: 8,
    title: "constructor 会失效吗",
    body: `
function Fn() {}
const f = new Fn()
const beforeAssigned = f.constructor === Fn
Fn.prototype = {}
return [
  ['换原型前 f.constructor === Fn', beforeAssigned],
  ['换原型后 f.constructor === Fn（老实例）', f.constructor === Fn],
  ['换原型后 new Fn().constructor === Fn', new Fn().constructor === Fn],
  ['换原型后 new Fn().constructor === Object', new Fn().constructor === Object]
]
`,
  },
  {
    id: 9,
    title: "Object.create(null)",
    body: `
const bare = Object.create(null)
return [
  ['getPrototypeOf(bare)', Object.getPrototypeOf(bare)],
  ['typeof bare.toString', typeof bare.toString],
  ['bare instanceof Object', bare instanceof Object]
]
`,
  },
  {
    id: 10,
    title: "in vs hasOwnProperty",
    body: `
function Fn() {}
Fn.prototype.tag = 'proto'
const f = new Fn()
f.own = 1
return [
  ["'own' in f（自身）", 'own' in f],
  ["'tag' in f（原型上）", 'tag' in f],
  ["f.hasOwnProperty('own')", f.hasOwnProperty('own')],
  ["f.hasOwnProperty('tag')", f.hasOwnProperty('tag')]
]
`,
  },
  {
    id: 11,
    title: "加分：class 和普通函数挂方法的区别",
    body: `
class C { m() {} }
function Fn() {}
Fn.prototype.m = function () {}
return [
  ['typeof C', typeof C],
  ['C.prototype.constructor === C', C.prototype.constructor === C],
  ["class 方法 m 的 enumerable", Object.getOwnPropertyDescriptor(C.prototype, 'm').enumerable],
  ["普通函数挂的 m 的 enumerable", Object.getOwnPropertyDescriptor(Fn.prototype, 'm').enumerable]
]
`,
  },
];

/** 把值转成好读的字符串 */
function formatValue(value) {
  if (value === undefined) return "undefined";
  if (typeof value === "object" && value !== null) return JSON.stringify(value);
  return String(value);
}

/** 题目返回的是 [说明, 值] 数组，逐行展开 */
function lines(result) {
  if (!result.ok) return ["抛错 " + result.value];
  return result.value.map(
    ([label, value]) => label + "  →  " + formatValue(value),
  );
}

function run(body) {
  try {
    return { ok: true, value: new Function(body)() };
  } catch (error) {
    return { ok: false, value: error.constructor.name + ": " + error.message };
  }
}

async function runExample() {
  console.log("原型链判断题 · 先写预判，再看结果");
  console.log("（原型行为不受严格模式影响，所以每题只跑一次）");

  for (const item of CASES) {
    console.log("");
    console.log("─".repeat(60));
    console.log("Q" + item.id + "  " + item.title);
    console.log("─".repeat(60));
    for (const line of lines(run(item.body))) {
      console.log("  " + line);
    }
  }

  console.log("");
  console.log("─".repeat(60));
  console.log("对照完答案后，去 02-answer.js 看每题的归因。");
}

runExample().catch((error) => {
  console.error("运行失败");
  throw error;
});
