/**
 * 题目标题：实现深拷贝函数
 * 题目类型：手写题
 * 难度：中级
 *
 * 解题思路：
 * 深拷贝的核心是递归复制每一层数据，而不是只复制最外层引用。
 * 如果当前值不是对象或数组，直接返回原值。
 * 如果当前值是对象或数组，就创建新的容器，再递归拷贝每个字段。
 *
 * 时间复杂度：
 * O(n)
 *
 * 空间复杂度：
 * O(n)
 *
 * 复杂度如何计算：
 * 假设总共有 n 个需要遍历的字段，每个字段都会访问一次，所以时间复杂度是 O(n)。
 * 同时会创建一份新的数据结构，递归过程也需要额外栈空间，所以空间复杂度是 O(n)。
 *
 * 关键边界情况：
 * 1. 基本类型直接返回
 * 2. 正确区分对象和数组
 * 3. 处理多层嵌套
 * 4. 当前版本不处理循环引用和特殊对象
 *
 * 面试追问：
 * 1. 如何处理循环引用？
 * 2. 如何支持 Date、Map、Set？
 * 3. JSON 深拷贝和手写深拷贝的区别是什么？
 */

export function deepClone(target) {
  if (target === null || typeof target !== "object") {
    return target;
  }

  const result = Array.isArray(target) ? [] : {};

  for (const key in target) {
    result[key] = deepClone(target[key]);
  }

  return result;
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
  console.error("002-实现深拷贝 02-answer.js: 运行失败");
  throw error;
});
