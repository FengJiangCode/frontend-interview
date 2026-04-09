/**
 * 题目标题：实现深拷贝
 * 题目类型：手写题
 * 难度：中级
 *
 * 题目描述：
 * 请手写一个 deepClone 函数，实现对象和数组的深拷贝。
 * 修改拷贝后的结果时，原对象不应该受到影响。
 * 本题要求至少正确处理普通对象、数组以及基本类型。
 *
 * 举例说明：
 * 输入：
 * const source = { a: 1, b: { c: 2 }, d: [3, 4] }
 * const target = deepClone(source)
 * target.b.c = 100
 * target.d[0] = 999
 *
 * 输出：
 * source 仍然是 { a: 1, b: { c: 2 }, d: [3, 4] }
 *
 * 解释：
 * 嵌套对象和数组都应该复制出新的引用，不能和原对象共享。
 *
 * 作答要求：
 * 1. 正确区分基本类型与引用类型
 * 2. 至少支持对象和数组的递归拷贝
 * 3. 修改拷贝结果时不影响原值
 *
 * 测试说明：
 * 1. 直接在下方答题区补全实现
 * 2. 运行 node 01-question.js
 * 3. 对照控制台输出判断是否符合预期
 */

// TODO: 在这里完成你的实现
export function deepClone(value) {
  void value;
  throw new Error("TODO: 请在 01-question.js 中完成实现");
}

function runExample() {
  const source = {
    name: "Tom",
    profile: {
      age: 20,
    },
    tags: ["js", "frontend"],
  };

  const target = deepClone(source);
  target.profile.age = 99;
  target.tags[0] = "changed";

  const actual = source;
  const expected = {
    name: "Tom",
    profile: {
      age: 20,
    },
    tags: ["js", "frontend"],
  };

  console.log("题目：实现深拷贝");
  console.log("修改副本后的原对象：", actual);
  console.log("预期结果：", expected);
}

runExample();
