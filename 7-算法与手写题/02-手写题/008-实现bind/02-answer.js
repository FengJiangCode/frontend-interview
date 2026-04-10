/**
 * 题目标题：实现 bind
 * 题目类型：手写题
 * 难度：中级
 *
 * 解题思路：
 * bind 的核心有三层：
 * 1. 返回一个新函数，而不是立刻执行
 * 2. 执行时需要把预置参数和调用参数拼接起来
 * 3. 如果新函数被 new 调用，this 应该指向新实例
 *
 * 第 3 点是面试里最常见的追问。
 * 处理方式通常是判断当前调用是否来自 new：
 * 如果 boundFn 的 this 是它自己的实例，就优先使用这个实例；
 * 否则才使用传入的 context。
 *
 * 此外，为了让 new 出来的实例还能拿到原函数原型上的方法，
 * 需要把 boundFn.prototype 连接到 fn.prototype。
 *
 * 时间复杂度：
 * O(m + n)
 *
 * 空间复杂度：
 * O(m + n)
 *
 * 复杂度如何计算：
 * 这里 m 表示预置参数数量，n 表示调用时传入的参数数量。
 * 每次执行时主要开销来自参数拼接，因此时间复杂度是 O(m + n)；
 * 额外空间也主要来自合并后的参数数组，因此是 O(m + n)。
 *
 * 关键边界情况：
 * 1. 预置参数需要和调用参数按顺序合并
 * 2. 普通调用时 this 应该绑定到 context
 * 3. new 调用时 this 应该指向新实例，而不是 context
 * 4. 需要继承原函数原型上的实例方法
 *
 * 面试追问：
 * 1. bind、call、apply 的区别是什么？
 * 2. 为什么 new 调用会覆盖 bind 绑定的 this？
 * 3. 如果要把它挂到 Function.prototype 上，应该注意什么？
 */

export function myBind(fn, context, ...presetArgs) {
  if (typeof fn !== "function") {
    throw new TypeError("fn must be a function");
  }

  function boundFn(...laterArgs) {
    const finalContext = this instanceof boundFn ? this : context;
    return fn.apply(finalContext, [...presetArgs, ...laterArgs]);
  }

  if (fn.prototype) {
    boundFn.prototype = Object.create(fn.prototype);
    boundFn.prototype.constructor = boundFn;
  }

  return boundFn;
}

function runExample() {
  function greet(greeting, punctuation) {
    return `${greeting}, ${this.name}${punctuation}`;
  }

  function Person(name, age) {
    this.name = name;
    this.age = age;
  }

  Person.prototype.getProfile = function () {
    return `${this.name}-${this.age}`;
  };

  const context = { name: "bind-demo" };
  const boundGreet = myBind(greet, context, "Hello");
  const BoundPerson = myBind(Person, { ignored: true }, "Alice");

  const actual = {
    callResult: boundGreet("!"),
    instanceName: new BoundPerson(20).name,
    instanceProfile: new BoundPerson(20).getProfile(),
  };

  const expected = {
    callResult: "Hello, bind-demo!",
    instanceName: "Alice",
    instanceProfile: "Alice-20",
  };

  console.log("题目：实现 bind");
  console.log("实际结果：", actual);
  console.log("预期结果：", expected);
}

runExample();
