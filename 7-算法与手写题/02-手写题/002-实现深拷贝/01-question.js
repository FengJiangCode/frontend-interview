/**
 * 题目标题：实现深拷贝函数
 * 题目类型：手写题
 * 难度：中级
 *
 * 题目描述：
 * 请手写一个 deepClone 函数，用来实现对象或数组的深拷贝。
 * 修改拷贝后的结果时，原始对象不应该受到影响。
 *
 * 举例说明：
 * 输入：
 * const obj = {
 *   name: "test",
 *   info: { age: 18 },
 *   list: [1, 2, { value: 3 }]
 * };
 *
 * const copied = deepClone(obj);
 * copied.info.age = 20;
 * copied.list[2].value = 99;
 *
 * 输出：
 * obj.info.age 仍然是 18
 * obj.list[2].value 仍然是 3
 *
 * 解释：
 * 如果只是浅拷贝，修改 copied 内部嵌套对象时，原对象也会被改掉。
 *
 * 作答要求：
 * 1. 使用 JavaScript 实现
 * 2. 正确处理对象和数组
 * 3. 至少支持基本嵌套场景
 *
 * 测试说明：
 * 1. 直接在下方答题区补全实现
 * 2. 运行 node 01-question.js
 * 3. 对照“实际结果”和“预期结果”判断是否正确
 */

// TODO: 在这里完成你的实现
export function deepClone(target) {
  throw new Error("TODO: 请实现 deepClone 函数");
}

function runExample() {
  const source = {
    name: "test",
    info: { age: 18 },
    list: [1, 2, { value: 3 }],
  };

  const copied = deepClone(source);

  copied.info.age = 20;
  copied.list[2].value = 99;

  console.log("题目：实现深拷贝函数");
  console.log("原对象：", source);
  console.log("拷贝后对象：", copied);
  console.log("预期结果：source.info.age === 18 且 source.list[2].value === 3");
}

runExample().catch((error) => {
  console.error("002-实现深拷贝 01-question.js: 运行失败");
  throw error;
});
