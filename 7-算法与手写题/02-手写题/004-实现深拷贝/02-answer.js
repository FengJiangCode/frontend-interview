/**
 * 题目标题：实现深拷贝
 * 题目类型：手写题
 * 难度：中级
 *
 * 解题思路：
 * 深拷贝的核心是递归复制每一层引用类型。
 * 如果当前值是基本类型，直接返回即可；
 * 如果当前值是数组，就创建新数组并递归处理每一项；
 * 如果当前值是普通对象，就创建新对象并递归处理每个属性。
 *
 * 本题先聚焦最常见面试版本：支持普通对象和数组。
 *
 * 时间复杂度：
 * O(n)
 *
 * 空间复杂度：
 * O(n)
 *
 * 复杂度如何计算：
 * 假设对象或数组中总共有 n 个需要遍历的成员，
 * 每个成员最多访问一次，并且递归过程中会创建对应的新结构，
 * 所以时间复杂度和额外空间复杂度都可以看作 O(n)。
 *
 * 关键边界情况：
 * 1. 基本类型应直接返回
 * 2. 数组和对象要分别创建新引用
 * 3. 嵌套层级较深时仍应递归处理
 *
 * 面试追问：
 * 1. 为什么展开运算符不是深拷贝？
 * 2. 如何处理循环引用？
 * 3. 如何扩展支持 Date、RegExp、Map、Set？
 */

export function deepClone(value) {
  if (value === null || typeof value !== "object") {
    return value;
  }

  if (Array.isArray(value)) {
    return value.map((item) => deepClone(item));
  }

  const result = {};

  Object.keys(value).forEach((key) => {
    result[key] = deepClone(value[key]);
  });

  return result;
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
