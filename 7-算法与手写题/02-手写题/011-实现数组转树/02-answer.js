/**
 * 题目标题：实现数组转树
 * 题目类型：前端手写题
 * 难度：中级
 *
 * 解题思路：
 * 这道题的核心是先把每个节点都缓存起来，再建立父子关系。
 * 最稳妥的做法是使用 Map 记录 id 和节点的映射。
 *
 * 具体分成两步：
 * 1. 第一轮遍历：为每个原始节点创建一个带 children 的新节点，并存入 Map
 * 2. 第二轮遍历：如果当前节点是根节点，就放入结果数组；否则挂到父节点的 children 上
 *
 * 这种方式不依赖输入顺序。
 * 即使子节点先出现、父节点后出现，也能在第二轮遍历时正确建立关系。
 *
 * 时间复杂度：
 * O(n)
 *
 * 空间复杂度：
 * O(n)
 *
 * 复杂度如何计算：
 * 假设数组长度为 n。
 * 两轮遍历都是线性的，每个节点只处理常数次，所以时间复杂度是 O(n)。
 * Map 和新生成的树结构都需要额外存储 n 个节点，所以空间复杂度是 O(n)。
 *
 * 关键边界情况：
 * 1. 空数组应返回空数组
 * 2. 输入顺序可能是乱序，不能依赖父节点先出现
 * 3. 每个节点都需要有 children 字段，即使它没有子节点
 * 4. 如果 parentId 找不到对应父节点，这里默认把它当成根节点处理，避免节点丢失
 *
 * 面试追问：
 * 1. 如果要保留原数组引用，不希望创建新对象，你会怎么改？
 * 2. 如果要检测循环引用，应该在什么阶段做校验？
 * 3. 如果 parentId 可能为 undefined、0、""，根节点判断规则要怎么设计？
 */

export function arrayToTree(list) {
  if (!Array.isArray(list) || list.length === 0) {
    return [];
  }

  const nodeMap = new Map();
  const roots = [];

  for (const item of list) {
    nodeMap.set(item.id, {
      ...item,
      children: [],
    });
  }

  for (const item of list) {
    const currentNode = nodeMap.get(item.id);

    if (item.parentId === null) {
      roots.push(currentNode);
      continue;
    }

    const parentNode = nodeMap.get(item.parentId);

    if (!parentNode) {
      roots.push(currentNode);
      continue;
    }

    parentNode.children.push(currentNode);
  }

  return roots;
}

function runExample() {
  const orderedList = [
    { id: 1, parentId: null, name: "部门A" },
    { id: 2, parentId: 1, name: "部门A-1" },
    { id: 3, parentId: 1, name: "部门A-2" },
    { id: 4, parentId: 2, name: "部门A-1-1" },
    { id: 5, parentId: null, name: "部门B" },
  ];

  const unorderedList = [
    { id: 4, parentId: 2, name: "部门A-1-1" },
    { id: 2, parentId: 1, name: "部门A-1" },
    { id: 1, parentId: null, name: "部门A" },
    { id: 5, parentId: null, name: "部门B" },
    { id: 3, parentId: 1, name: "部门A-2" },
  ];

  console.log("题目：实现数组转树");
  console.log("有序输入结果：", JSON.stringify(arrayToTree(orderedList), null, 2));
  console.log("乱序输入结果：", JSON.stringify(arrayToTree(unorderedList), null, 2));
}

runExample();
