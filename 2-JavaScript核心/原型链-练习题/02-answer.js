/**
 * 题目标题：原型链判断题（10 题 + 加分）
 * 题目类型：概念判断题（预测输出）
 * 难度：中级
 *
 * 解题思路：
 * 判断原型相关的输出，只需要抓住四句话：
 *
 *   1. 两个名字各归各位
 *      `prototype` 是**函数**才有的属性；`__proto__`（官方 API 是
 *      `Object.getPrototypeOf`）是**对象**才有的。实例上访问 `.prototype`
 *      永远是 undefined。
 *
 *   2. 读沿链找，写写自己
 *      读取属性时沿原型链往上找；赋值时**永远写在自己身上**，把原型上的同名
 *      属性遮蔽掉，而不是修改原型。
 *
 *   3. 原型链是「接线」，在 new 那一刻就接死了
 *      实例只持有原型对象的**引用**，不持有 `Fn.prototype` 这个「槽位」。
 *      所以修改原型属性实例立刻可见，但**重新赋值** `Fn.prototype = {}`
 *      不会追溯影响已有实例，只会影响之后新建的实例。
 *
 *   4. 链条尽头是 null
 *      普通对象的链条是 实例 → Fn.prototype → Object.prototype → null。
 *      `Object.create(null)` 造的对象没有这条链，连 toString 都没有。
 *
 * 关键点：
 * - 读走原型链，写写自己 —— 遮蔽（shadowing）是理解原型的关键
 * - `instanceof` 只做一件事：沿左操作数的原型链找右操作数的 prototype
 * - 给 `Fn.prototype` 重新赋值会让 `constructor` 指向错乱，需要手动补回
 * - 原型上不要放引用类型默认值，否则所有实例共享同一个对象
 * - `in` 沿原型链查，`hasOwnProperty` 只看自身
 * - class 的方法不可枚举，普通函数挂的方法可枚举
 *
 * 关键边界情况：
 * - `Fn.prototype = {}` 之后，老实例的 constructor 仍然是 Fn（老原型没变），
 *   但新实例的 constructor 变成了 Object —— 这是最容易判断错的一处
 * - `Object.create(null)` 造的对象没有 hasOwnProperty 方法，不能直接调用
 *
 * 面试追问：
 * 1. `instanceof` 和 `typeof` 的区别？
 *    → typeof 判断基本类型（对 null 返回 "object" 是历史遗留 bug）；
 *      instanceof 判断引用类型的原型链归属，且不适用于基本类型。
 * 2. 为什么推荐用 `Object.create(null)` 做字典？
 *    → 没有原型链，避免 `'toString' in dict` 这类原型污染导致的误判。
 * 3. 为什么 `for...in` 要配 `hasOwnProperty`？
 *    → `for...in` 会枚举原型链上的可枚举属性。
 * 4. 原型链的尽头为什么是 `null` 而不是 undefined？
 *    → null 表示「到此为止」，是规范定义的终点标记；继续往上取会得到 null，
 *      而链上查找失败返回的是 undefined，两者语义不同。
 */

// ===== 答案与归因 =====

const ANSWERS = [
  {
    id: 1,
    title: "prototype 和 __proto__",
    expect: ["undefined", "true", "object"],
    why: "prototype 是函数才有的属性。实例上访问 .prototype 得到 undefined——实例有的是 __proto__。两者在链条上处在不同位置，别混。",
    wrong: "以为实例也能通过 .prototype 拿到原型。实例要用 Object.getPrototypeOf(f) 或 f.__proto__。",
  },
  {
    id: 2,
    title: "原型链的尽头",
    expect: ["true", "true", "null"],
    why: "完整链条：f → Fn.prototype → Object.prototype → null。Object.prototype 是所有人共同的祖先，它的原型是 null，表示「到头了」。",
    wrong: "以为链条尽头是 undefined。规范定义的是 null；链上查找失败才是 undefined，两者语义不同。",
  },
  {
    id: 3,
    title: "读走原型，写走自己",
    expect: ["proto", "own", "proto", "true"],
    why: "读操作沿原型链往上找，写操作永远写在自己身上。f.tag = 'own' 不是「修改原型上的 tag」，而是在 f 自身上新建属性把原型遮蔽掉，所以原型纹丝不动。",
    wrong: "以为 f.tag = 'own' 会改到原型上，所有实例一起变。只有通过 Fn.prototype.tag = ... 才会改到原型。",
  },
  {
    id: 4,
    title: "原型上的数组",
    expect: ["[1]", "true", "[1]"],
    why: "a.list 从来没被赋值过，一直指向原型上那同一个数组，所以 push 是往公共数组里塞，b.list 一起变。而 a.list = [9] 是赋值，给 a 自己加属性脱离原型，b 不受影响。",
    wrong: "把 a.list.push(1) 和 a.list = [9] 当成一回事。前者改共享对象，后者加自身属性——这是原型上不该放引用类型的原因。",
  },
  {
    id: 5,
    title: "修改原型 vs 重新赋值原型",
    expect: ["new", "new", "brand new"],
    why: "修改原型属性（Fn.prototype.tag = 'new'）实例通过引用立刻可见。但重新赋值整个原型（Fn.prototype = {}）时，f 的 __proto__ 还指着老的，切不断，所以仍是 'new'；只有之后新建的实例才挂到新原型上。",
    wrong: "以为换掉 Fn.prototype 会同步影响所有已有实例。原型链在 new 那一刻就接死了，实例只持有原型的引用，不持有它的「槽位」。",
  },
  {
    id: 6,
    title: "函数自己的原型链",
    expect: ["true", "false"],
    why: "函数自己也是对象，所以它也有 __proto__，指向 Function.prototype。而 Fn.prototype 是给它造出来的实例用的，两回事。",
    wrong: "把 Fn.__proto__ 和 Fn.prototype 当成两个名字的同一个东西。前者是「Fn 是谁的实例」，后者是「Fn 造出来的实例长什么样」。",
  },
  {
    id: 7,
    title: "instanceof 在查什么",
    expect: ["true", "false", "true"],
    why: "instanceof 只做一件事：沿左操作数的原型链往上找，看有没有出现 Fn.prototype 这个对象。换原型后，f 的链上还是老原型，找不到新对象；新造的实例挂在新的 {} 上。",
    wrong: "以为 instanceof 会看实例是不是「由这个函数构造的」。它只看原型链，不记录构造历史。",
  },
  {
    id: 8,
    title: "constructor 会失效吗",
    expect: ["true", "true", "false", "true"],
    why: "最绕的一题。f 是老实例，__proto__ 指向老原型，而老原型上的 constructor 确实还是 Fn，所以仍是 true。新实例挂在新原型 {} 上，这个新对象没有自己的 constructor，沿链从 Object.prototype 继承到 Object。",
    wrong: "以为换原型后所有实例的 constructor 都会变。老实例完全不受影响——这正是「接线」语义的直接后果。",
  },
  {
    id: 9,
    title: "Object.create(null)",
    expect: ["null", "undefined", "false"],
    why: "造出来的对象没有原型链，所以连 toString 这种 Object.prototype 上的方法都没有，也不是 Object 的实例。常用来做纯字典，避免原型污染导致的误判。",
    wrong: "以为所有对象都有 Object.prototype 兜底。Object.create(null) 是唯一的例外。",
  },
  {
    id: 10,
    title: "in vs hasOwnProperty",
    expect: ["true", "true", "true", "false"],
    why: "in 会沿原型链查，所以原型上的 tag 也算 true；hasOwnProperty 只看自身，所以 tag 是 false。这是遍历对象时区分「自己的」和「继承来的」的关键。",
    wrong: "用 in 判断属性是否存在。原型上任何属性都会让它返回 true，常见于「判断配置项有没有配」的场景出错。",
  },
  {
    id: 11,
    title: "加分：class 和普通函数挂方法的区别",
    expect: ["function", "true", "false", "true"],
    why: "class 里定义的方法是不可枚举的，而用 Fn.prototype.m = ... 挂上去的方法是普通赋值，可枚举。所以 for...in 遍历实例时，普通函数挂的原型方法会被遍历出来，class 的不会。",
    wrong: "以为 class 方法只是语法糖、没有实质区别。可枚举性这个差别直接决定 for...in 的行为。",
  },
];

// ===== 以下为验证区：重新跑一遍每题，打印实际输出 =====

const CASES = {
  1: `
function Fn() {}
const f = new Fn()
return [
  ['f.prototype（实例上访问）', f.prototype],
  ['getPrototypeOf(f) === Fn.prototype', Object.getPrototypeOf(f) === Fn.prototype],
  ['typeof Fn.prototype', typeof Fn.prototype]
]
`,
  2: `
function Fn() {}
const f = new Fn()
return [
  ['f → Fn.prototype', Object.getPrototypeOf(f) === Fn.prototype],
  ['Fn.prototype → Object.prototype', Object.getPrototypeOf(Fn.prototype) === Object.prototype],
  ['Object.prototype 的原型（链条尽头）', Object.getPrototypeOf(Object.prototype)]
]
`,
  3: `
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
  4: `
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
  5: `
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
  6: `
function Fn() {}
return [
  ['getPrototypeOf(Fn) === Function.prototype', Object.getPrototypeOf(Fn) === Function.prototype],
  ['getPrototypeOf(Fn) === Fn.prototype', Object.getPrototypeOf(Fn) === Fn.prototype]
]
`,
  7: `
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
  8: `
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
  9: `
const bare = Object.create(null)
return [
  ['getPrototypeOf(bare)', Object.getPrototypeOf(bare)],
  ['typeof bare.toString', typeof bare.toString],
  ['bare instanceof Object', bare instanceof Object]
]
`,
  10: `
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
  11: `
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
};

function formatValue(value) {
  if (value === undefined) return "undefined";
  if (typeof value === "object" && value !== null) return JSON.stringify(value);
  return String(value);
}

function run(body) {
  try {
    return { ok: true, value: new Function(body)() };
  } catch (error) {
    return { ok: false, value: error.constructor.name + ": " + error.message };
  }
}

async function runExample() {
  console.log("原型链判断题 · 答案与归因");
  console.log("");

  for (const item of ANSWERS) {
    const actual = run(CASES[item.id]);
    const values = actual.ok ? actual.value.map(([, v]) => formatValue(v)) : ["抛错"];

    console.log("─".repeat(60));
    console.log("Q" + item.id + "  " + item.title);
    console.log("─".repeat(60));
    console.log("实测  " + values.join("  |  "));
    console.log("归因  " + item.why);
    console.log("易错  " + item.wrong);
    console.log("");
  }

  console.log("─".repeat(60));
  console.log("一句话总结：读沿原型链找，写写自己；原型链在 new 那一刻接死，");
  console.log("之后换掉 Fn.prototype 不追溯已有实例。");
  console.log("");

  // 自检：实测与答案对不上就报错，避免解析和代码漂移
  const mismatches = [];
  for (const item of ANSWERS) {
    const actual = run(CASES[item.id]);
    if (!actual.ok) {
      mismatches.push("Q" + item.id + " 抛错：" + actual.value);
      continue;
    }
    const values = actual.value.map(([, v]) => formatValue(v));
    if (values.length !== item.expect.length) {
      mismatches.push("Q" + item.id + " 项数不符：应为 " + item.expect.length + "，实测 " + values.length);
      continue;
    }
    values.forEach((value, i) => {
      if (value !== item.expect[i]) {
        mismatches.push("Q" + item.id + " 第 " + (i + 1) + " 项：应为 " + item.expect[i] + "，实测 " + value);
      }
    });
  }

  if (mismatches.length > 0) {
    throw new Error("答案与实测输出不一致：\n" + mismatches.join("\n"));
  }
  console.log("自检通过：11 题的答案与实测输出逐项一致。");
}

runExample().catch((error) => {
  console.error("运行失败");
  throw error;
});
