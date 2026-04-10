/**
 * 题目标题：实现深拷贝
 * 题目类型：手写题
 * 难度：中级
 *
 * 解题思路：
 * 深拷贝的核心是递归复制每一层引用类型，并且处理循环引用。
 * 如果当前值是基本类型，直接返回即可；
 * 如果当前值是数组，就创建新数组并递归处理每一项；
 * 如果当前值是普通对象，就创建新对象并递归处理每个属性；
 * 如果是 Date、RegExp、Map、Set 这类特殊对象，则按各自结构定制化拷贝。
 *
 * 为了覆盖常见面试追问，这里额外用 WeakMap 解决循环引用问题。
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
 * 4. 循环引用不能导致无限递归
 * 5. Date、RegExp、Map、Set 需要单独处理
 *
 * 面试追问：
 * 1. 为什么展开运算符不是深拷贝？
 *    因为展开运算符和 Object.assign 都只会拷贝第一层属性。
 *    如果属性值还是对象或数组，复制过去的仍然是同一个引用，
 *    所以修改嵌套层级的数据时，原对象仍然会受到影响。
 * 2. 如何处理循环引用？
 *    可以用 WeakMap 记录“原对象 -> 拷贝对象”的映射。
 *    递归时如果发现当前对象已经拷贝过，就直接返回之前的拷贝结果，
 *    这样既能避免无限递归，也能保持循环引用结构。
 * 3. 如何扩展支持 Date、RegExp、Map、Set？
 *    需要先判断具体类型，再分别做定制化拷贝。
 *    比如 Date 可以用 new Date(value)，
 *    RegExp 可以用 new RegExp(value.source, value.flags)，
 *    Map 需要遍历键值对后递归拷贝 value，
 *    Set 需要遍历成员后递归添加。
 *
 * 追问答案补充：
 * 1. 为什么 JSON.parse(JSON.stringify(obj)) 也不是真正完整的深拷贝？
 *    因为它会丢失 undefined、Symbol、函数、RegExp 等特殊值，
 *    Date 也会被转成字符串，而且遇到循环引用会直接报错。
 * 2. 面试里这道题应该先写到什么程度？
 *    一般先写出“支持基本类型、对象、数组”的递归版本，
 *    再主动补一句：如果要支持循环引用和特殊对象类型，
 *    可以继续引入 WeakMap 和类型判断扩展。
 */

export function deepClone(value, cache = new WeakMap()) {
  if (value === null || typeof value !== "object") {
    return value;
  }

  if (cache.has(value)) {
    return cache.get(value);
  }

  if (value instanceof Date) {
    return new Date(value.getTime());
  }

  if (value instanceof RegExp) {
    const clonedRegExp = new RegExp(value.source, value.flags);
    clonedRegExp.lastIndex = value.lastIndex;
    return clonedRegExp;
  }

  if (value instanceof Map) {
    const clonedMap = new Map();
    cache.set(value, clonedMap);

    value.forEach((mapValue, mapKey) => {
      clonedMap.set(
        deepClone(mapKey, cache),
        deepClone(mapValue, cache),
      );
    });

    return clonedMap;
  }

  if (value instanceof Set) {
    const clonedSet = new Set();
    cache.set(value, clonedSet);

    value.forEach((item) => {
      clonedSet.add(deepClone(item, cache));
    });

    return clonedSet;
  }

  if (Array.isArray(value)) {
    const clonedArray = [];
    cache.set(value, clonedArray);

    value.forEach((item, index) => {
      clonedArray[index] = deepClone(item, cache);
    });

    return clonedArray;
  }

  const result = Object.create(Object.getPrototypeOf(value));
  cache.set(value, result);

  Reflect.ownKeys(value).forEach((key) => {
    result[key] = deepClone(value[key], cache);
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
    createdAt: new Date("2024-01-01T00:00:00.000Z"),
    pattern: /deep-clone/gi,
    meta: new Map([
      ["level", 1],
      ["owner", { name: "Tom" }],
    ]),
    skillSet: new Set(["js", { field: "frontend" }]),
  };
  source.self = source;

  const target = deepClone(source);
  target.profile.age = 99;
  target.tags[0] = "changed";
  target.createdAt.setFullYear(2030);
  target.pattern.lastIndex = 2;
  target.meta.get("owner").name = "Jerry";

  const clonedSetObject = [...target.skillSet].find(
    (item) => typeof item === "object",
  );
  clonedSetObject.field = "backend";

  console.log("题目：实现深拷贝");
  console.log("基础对象拷贝：", source.profile.age === 20 && source.tags[0] === "js");
  console.log("循环引用处理：", target.self === target);
  console.log(
    "Date / RegExp 处理：",
    source.createdAt.getFullYear() === 2024 && target.pattern instanceof RegExp,
  );
  console.log(
    "Map / Set 处理：",
    source.meta.get("owner").name === "Tom" &&
      [...source.skillSet].some(
        (item) => typeof item === "object" && item.field === "frontend",
      ),
  );
}

runExample();
