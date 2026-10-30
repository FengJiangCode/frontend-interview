/**
 * 题目标题：this 绑定关系判断题（10 题）
 * 题目类型：概念判断题（预测输出）
 * 难度：中级
 *
 * 解题思路：
 * 判断 this 只需要三个问题，按顺序问：
 *
 *   1. 这是箭头函数吗？        → 是：this 由定义时的词法作用域决定，直接结束判断
 *   2. 调用时前面有点号吗？    → 有：this 就是那个对象（隐式绑定）
 *   3. 都没命中？              → 看是否被 call/apply/bind 或 new 介入：
 *                               new > bind > 隐式 > 默认
 *
 * 三个最容易判断错的时刻：
 *   - 「取值」的瞬间：obj.fn 只是取一个函数引用，this 在那一刻就丢了
 *   - 「传参」的瞬间：把不带 thisArg 的方法当回调传出去，等于裸调用
 *   - 「定义」的瞬间：箭头函数在写下来的那一刻就锁死了 this
 *
 * 关键点：
 * - this 由调用方式决定，与函数「属于谁」无关
 * - 优先级：new > call/apply/bind > 隐式绑定 > 默认绑定
 * - 严格模式只影响一条：默认绑定从全局对象变成 undefined
 * - 箭头函数不在这个体系里，它认词法作用域
 * - class 体内部永远是严格模式，即使整个文件不是
 *
 * 关键边界情况：
 * - class 的方法被单独取出调用 → 必然抛错（严格模式），不会静默改到全局
 * - class 体不受外层严格/非严格影响，是语言规定
 * - bind 是永久绑定，之后 call/apply 都改不动；唯一能压住它的是 new
 *
 * 面试追问：
 * 1. 为什么 new 能压住 bind，bind 却压不住 new？
 *    → new 的优先级定义在规则链最顶层。bind 时指定的 this 在构造调用中被忽略。
 * 2. 事件监听回调里的 this 是什么？
 *    → 非箭头监听器：this 是触发事件的元素（由浏览器主动设置）。
 *      箭头监听器：外层作用域的 this。这也是 React 类组件要 bind(this) 的原因。
 * 3. 严格模式对 this 的影响到底有几处？
 *    → 只有默认绑定这一处：从全局对象变成 undefined。
 *      隐式绑定、显式绑定、new 绑定都不受严格模式影响。
 * 4. 怎么优雅地避免「丢 this」？
 *    → 用箭头函数定义回调、在构造函数里 bind、或者用 class fields 的箭头方法。
 */

// ===== 答案与归因 =====

const ANSWERS = [
  {
    id: 1,
    title: "默认绑定",
    sloppy: "globalThis（浏览器里是 window）",
    strict: "undefined",
    why: "裸调用，前面没有点号，走默认绑定。非严格下 this 指向全局对象，严格下是 undefined。",
    wrong: "说成「this 指向函数自己」或者「指向定义它的作用域」——都不对，this 和函数无关。",
  },
  {
    id: 2,
    title: "赋值丢 this",
    sloppy: "undefined",
    strict: "抛错",
    why: "`const f = obj.who` 是取值不是调用，隐式绑定根本没发生。之后 `f()` 是裸调用，退化成默认绑定。非严格下 this 是全局对象，取 `window.tag` 得到 undefined。",
    wrong: "以为 f 记住了 obj。函数不携带宿主信息，this 只在调用那一刻才确定。",
  },
  {
    id: 3,
    title: "当回调传参（forEach）",
    sloppy: "1",
    strict: "抛错",
    why: "把 obj.inc 作为实参传出去，到手的是一根「裸函数」。forEach 触发回调时没给它 thisArg，等于裸调用。非严格下 this 是全局对象，改的是 window.count（结果 NaN），obj.count 纹丝不动。",
    wrong: "以为 `obj.inc` 这种写法会把 obj 一起带过去。这正是「丢 this」在真实项目里最高发的场景。",
  },
  {
    id: 4,
    title: "箭头函数做回调",
    sloppy: "3",
    strict: "3",
    why: "箭头函数没有自己的 this，它用的是 inc 的 this，而 inc 是 obj.inc() 调用的，this 就是 obj。所以两次自增都落在 obj 上。",
    wrong: "以为箭头函数「也没有 this」所以也是 undefined。它不是没有，是不自己创建，直接借外层的。",
  },
  {
    id: 5,
    title: "箭头函数的 this 由谁决定",
    sloppy: "globalThis（浏览器里是 window）",
    strict: "undefined",
    why: "关键不是「等于什么」，而是「跟 obj 完全无关」。箭头函数认定义位置所在作用域的 this，这里是最外层，`obj.who()` 怎么调都没用。",
    wrong: "看到 `who: () => this` 写在 obj 里就以为 this 是 obj。箭头函数根本不看它被放在哪个对象里。",
  },
  {
    id: 6,
    title: "给箭头函数 call",
    sloppy: "undefined",
    strict: "抛错",
    why: "call 传进去的 { tag: 'obj' } 被彻底忽略。箭头函数的 this 在定义时就锁死了，call / apply / bind 三个全部无效。",
    wrong: "以为 call 是万能的。call 只能改普通函数的 this，对箭头函数一点作用都没有。",
  },
  {
    id: 7,
    title: "new 撞上 bind",
    sloppy: "instanceof Fn = true ，inst.tag = undefined",
    strict: "instanceof Fn = true ，inst.tag = undefined",
    why: "new 优先级最高，bind 指定的 { tag: 'bound' } 被丢弃，this 是新创建的实例。因为实例上没有 tag，所以是 undefined。",
    wrong: "以为 bind 会把构造函数锁死。bind 能压住 call/apply/隐式/默认，唯独压不住 new。",
  },
  {
    id: 8,
    title: "bind 之后还能改吗",
    sloppy: "a",
    strict: "a",
    why: "bind 产生的是「永久绑定」的函数，之后再用 call/apply 也改不动它的 this。",
    wrong: "以为后调用的 call 优先级更高。bind 之后就锁死了，比的是创建顺序不是调用顺序。",
  },
  {
    id: 9,
    title: "箭头函数嵌在对象方法里",
    sloppy: "obj",
    strict: "obj",
    why: "箭头函数认的是「代码上包着它的那个函数」get 的 this，也就是 obj，跟它被写在哪一层对象字面量（inner）毫无关系。",
    wrong: "被字形骗到，觉得箭头写在 inner 那一层所以是 'inner'。这个错觉来自「this 看对象嵌套层级」这个错误前提。",
  },
  {
    id: 10,
    title: "class 的方法",
    sloppy: "抛错",
    strict: "抛错",
    why: "class 体内部永远是严格模式，这是语言规定，不受文件是否 'use strict' 影响。所以裸调用时 this 是 undefined，不是 window，直接抛错。",
    wrong: "以为「整个文件是非严格的，所以 class 也是」——class 是例外。后果是代码不会静默改到全局，而是直接报错，反而更容易暴露问题。",
  },
];

/** 加分题（需要浏览器环境，无法在 Node 里跑） */
const BONUS = {
  title: "事件监听里的 this",
  code: `btn.addEventListener('click', function () { console.log(this) })
btn.addEventListener('click', () => { console.log(this) })`,
  answer:
    "第一个打印 btn，第二个打印外层作用域的 this。addEventListener 会主动把非箭头监听器的 this 设成触发事件的元素——这算「浏览器主动做的显式绑定」。",
};

// ===== 以下为验证区：重新跑一遍每题，打印实际输出 =====

const CASES = {
  1: `
function who() { return this }
return who()
`,
  2: `
const obj = { tag: 'obj', who() { return this.tag } }
const f = obj.who
return f()
`,
  3: `
const obj = { count: 1, inc() { this.count++ } }
;[1, 2].forEach(obj.inc)
return obj.count
`,
  4: `
const obj = { count: 1, inc() { [1, 2].forEach(() => { this.count++ }) } }
obj.inc()
return obj.count
`,
  5: `
const obj = { tag: 'obj', who: () => this }
return obj.who()
`,
  6: `
const obj = { tag: 'obj' }
const f = () => this.tag
return f.call(obj)
`,
  7: `
function Fn() { return this }
const B = Fn.bind({ tag: 'bound' })
const inst = new B()
return 'instanceof Fn = ' + (inst instanceof Fn) + ' ，inst.tag = ' + inst.tag
`,
  8: `
function who() { return this.tag }
const A = who.bind({ tag: 'a' })
return A.call({ tag: 'b' })
`,
  9: `
const obj = {
  tag: 'obj',
  get() {
    return { tag: 'inner', who: () => this.tag }
  }
}
return obj.get().who()
`,
  10: `
class C {
  constructor() { this.count = 0 }
  inc() { this.count++ }
}
const c = new C()
const inc = c.inc
inc()
`,
};

function format(value) {
  if (value === undefined) return "undefined";
  if (value === globalThis) return "globalThis（浏览器里是 window）";
  if (typeof value === "number" && Number.isNaN(value)) return "NaN";
  if (value !== null && typeof value === "object") return JSON.stringify(value);
  return String(value);
}

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
  console.log("this 绑定判断题 · 答案与归因");
  console.log("");

  for (const item of ANSWERS) {
    const body = CASES[item.id];
    console.log("─".repeat(56));
    console.log("Q" + item.id + "  " + item.title);
    console.log("─".repeat(56));
    console.log("答案  非严格 → " + item.sloppy);
    console.log("      严格   → " + item.strict);
    console.log("实测  非严格 → " + describe(run(body, false)));
    console.log("      严格   → " + describe(run(body, true)));
    console.log("归因  " + item.why);
    console.log("易错  " + item.wrong);
    console.log("");
  }

  console.log("─".repeat(56));
  console.log("加分题：" + BONUS.title);
  console.log("─".repeat(56));
  console.log(BONUS.code);
  console.log("");
  console.log(BONUS.answer);
  console.log("");

  // 自检：实测与答案对不上就报错，避免解析和代码漂移。
  // 抛错的具体 message 会随引擎版本变化，所以只比对「是否抛错」。
  const matches = (actual, expected) =>
    expected === "抛错" ? actual.startsWith("抛错") : actual === expected;

  const mismatches = [];
  for (const item of ANSWERS) {
    const body = CASES[item.id];
    const actualSloppy = describe(run(body, false));
    const actualStrict = describe(run(body, true));

    if (!matches(actualSloppy, item.sloppy)) {
      mismatches.push("Q" + item.id + " 非严格：应为 " + item.sloppy + "，实测 " + actualSloppy);
    }
    if (!matches(actualStrict, item.strict)) {
      mismatches.push("Q" + item.id + " 严格：应为 " + item.strict + "，实测 " + actualStrict);
    }
  }

  if (mismatches.length > 0) {
    throw new Error("答案与实测输出不一致：\n" + mismatches.join("\n"));
  }
  console.log("自检通过：10 题的答案与实测输出一致。");
}

runExample().catch((error) => {
  console.error("运行失败");
  throw error;
});
