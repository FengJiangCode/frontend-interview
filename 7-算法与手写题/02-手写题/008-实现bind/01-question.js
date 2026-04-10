/**
 * 题目标题：实现 bind
 * 题目类型：手写题
 * 难度：中级
 *
 * 题目描述：
 * 请手写一个 myBind 函数，功能类似于原生的 bind。
 * 它接收一个函数、一个要绑定的 this，以及若干预置参数，
 * 返回一个新的函数。这个新函数在执行时需要正确合并参数，
 * 并把 this 指向绑定对象。
 *
 * 同时还要考虑一个高频追问：
 * 如果返回的新函数被当作构造函数用 new 调用，
 * this 应该指向新实例，而不是继续指向传入的 context。
 *
 * 举例说明：
 * 输入：
 * const bound = myBind(sum, context, 1);
 *
 * bound(2, 3)
 *
 * 输出：
 * 正确拿到绑定后的 this，并返回参数合并后的结果
 *
 * 解释：
 * bind 的核心不只是“改 this”，
 * 还包括“预置参数”和“构造调用优先级”。
 *
 * 作答要求：
 * 1. 正确绑定 this
 * 2. 支持预置参数
 * 3. 支持调用时继续传参
 * 4. 支持 new 调用时忽略绑定的 context
 *
 * 测试说明：
 * 1. 直接在下方答题区补全实现
 * 2. 运行 node 01-question.js
 * 3. 对照控制台输出判断是否符合预期
 */

// TODO: 在这里完成你的实现
export function myBind(fn, context, ...presetArgs) {
  return function () {
    Object.call(context, ...presetArgs);
  };
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

try {
  runExample();
} catch (error) {
  console.error("008-实现bind 01-question.js: 请先完成 TODO");
  console.error(error.message);
}
