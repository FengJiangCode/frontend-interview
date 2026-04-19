/**
 * 题目标题：实现数组转树
 * 题目类型：前端手写题
 * 难度：中级
 *
 * 题目描述：
 * 给定一个扁平数组 list，其中每一项都包含 id、parentId 和其他业务字段。
 * 请你实现一个 arrayToTree(list) 函数，把这组数据转换成树形结构。
 *
 * 根节点满足 parentId === null。
 * 返回结果需要是一个数组，数组中的每一项都是根节点。
 * 每个节点都需要带上 children 字段，且 children 始终是数组。
 *
 * 举例说明：
 * const list = [
 *   { id: 1, parentId: null, name: "部门A" },
 *   { id: 2, parentId: 1, name: "部门A-1" },
 *   { id: 3, parentId: 1, name: "部门A-2" },
 *   { id: 4, parentId: 2, name: "部门A-1-1" },
 *   { id: 5, parentId: null, name: "部门B" },
 * ];
 *
 * arrayToTree(list) 的结果应为：
 * [
 *   {
 *     id: 1,
 *     parentId: null,
 *     name: "部门A",
 *     children: [
 *       {
 *         id: 2,
 *         parentId: 1,
 *         name: "部门A-1",
 *         children: [
 *           {
 *             id: 4,
 *             parentId: 2,
 *             name: "部门A-1-1",
 *             children: [],
 *           },
 *         ],
 *       },
 *       {
 *         id: 3,
 *         parentId: 1,
 *         name: "部门A-2",
 *         children: [],
 *       },
 *     ],
 *   },
 *   {
 *     id: 5,
 *     parentId: null,
 *     name: "部门B",
 *     children: [],
 *   },
 * ]
 *
 * 作答要求：
 * 1. 尽量保证时间复杂度较优
 * 2. 不能写死层级
 * 3. 返回结果中每个节点都要有 children 数组
 * 4. 可以默认输入数据中的 id 唯一
 *
 * 测试说明：
 * 1. 直接在下方答题区补全实现
 * 2. 运行 node 01-question.js
 * 3. 对照“实际结果”和“预期结果”判断是否正确
 */

// TODO: 在这里完成你的实现
export function arrayToTree(list) {
  function Node (node = {id: null,parentId:null,name: null}){
    this.parentId = node.parentId
    this.id = node.id
    this.name = node.name
    this.children = []
  }

  const map = new Map()
  const roots = []

  for (let index = 0; index < list.length; index++) {
    const element = list[index];
    const node = new Node(element)

    map.set(node.id,node)
    
  }

  for (const [key,value] of map) {
    if (map.has(value.parentId)) {
      const parentNode = map.get(value.parentId)
      parentNode.children.push(value)
    }else{
      roots.push(value)
    }
  }

  return roots
  
}

function runExample() {
  const list = [
    { id: 1, parentId: null, name: "部门A" },
    { id: 2, parentId: 1, name: "部门A-1" },
    { id: 3, parentId: 1, name: "部门A-2" },
    { id: 4, parentId: 2, name: "部门A-1-1" },
    { id: 5, parentId: null, name: "部门B" },
  ];

  const actual = arrayToTree(list);
  const expected = [
    {
      id: 1,
      parentId: null,
      name: "部门A",
      children: [
        {
          id: 2,
          parentId: 1,
          name: "部门A-1",
          children: [
            {
              id: 4,
              parentId: 2,
              name: "部门A-1-1",
              children: [],
            },
          ],
        },
        {
          id: 3,
          parentId: 1,
          name: "部门A-2",
          children: [],
        },
      ],
    },
    {
      id: 5,
      parentId: null,
      name: "部门B",
      children: [],
    },
  ];

  console.log("题目：实现数组转树");
  console.log("测试输入：", JSON.stringify(list));
  console.log("实际结果：", JSON.stringify(actual, null, 2));
  console.log("预期结果：", JSON.stringify(expected, null, 2));
}

try {
  runExample();
} catch (error) {
  console.error("011-实现数组转树 01-question.js: 请先完成 TODO");
  console.error(error.message);
}
