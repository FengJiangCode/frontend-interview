/**
 * 题目标题：合并两个有序链表
 * 题目类型：算法题
 * 难度：简单
 *
 * 题目描述：
 * 将两个升序链表合并为一个新的升序链表并返回。
 * 新链表应当仍然是升序的，
 * 并且由给定的两个链表的所有节点组成。
 *
 * 举例说明：
 * 输入：
 * list1 = [1, 2, 4]
 * list2 = [1, 3, 4]
 *
 * 输出：
 * [1, 1, 2, 3, 4, 4]
 *
 * 解释：
 * 每次从两个链表的头节点中选较小的那个接到结果链表后面，
 * 最后再把剩余节点直接接上即可。
 *
 * 作答要求：
 * 1. 尽量使用迭代方式实现
 * 2. 时间复杂度尽量做到 O(n + m)
 * 3. 说明为什么虚拟头节点在链表题里很常见
 *
 * 测试说明：
 * 1. 直接在下方答题区补全实现
 * 2. 运行 node 01-question.js
 * 3. 对照“实际结果”和“预期结果”判断是否正确
 */

class ListNode {
  constructor(val = 0, next = null) {
    this.val = val;
    this.next = next;
  }
}

function createLinkedList(arr) {
  const dummy = new ListNode();
  let current = dummy;

  for (let i = 0; i < arr.length; i += 1) {
    current.next = new ListNode(arr[i]);
    current = current.next;
  }

  return dummy.next;
}

function linkedListToArray(head) {
  const result = [];
  let current = head;

  while (current) {
    result.push(current.val);
    current = current.next;
  }

  return result;
}

// TODO: 在这里完成你的实现
export function mergeTwoLists(list1, list2) {
  const newList = new ListNode()
  let newlistCurrent = newList
  let list1Current = list1
  let list2Current = list2

  while(list1Current || list2Current){
    if (list1Current && list2Current) {
      if(list1Current.val >= list2Current.val){
        newlistCurrent.next = list2Current
        list2Current = list2Current.next
        newlistCurrent = newlistCurrent.next
      } else {
        newlistCurrent.next = list1Current
        list1Current = list1Current.next
        newlistCurrent = newlistCurrent.next
      }
    }else if(list1Current){
      newlistCurrent.next = list1Current
      list1Current = list1Current.next
      newlistCurrent = newlistCurrent.next
    } else if(list2Current){
      newlistCurrent.next = list2Current
      list2Current = list2Current.next
      newlistCurrent = newlistCurrent.next

    }
  }

  return newList.next
}

function runExample() {
  const list1 = createLinkedList([1, 2, 4]);
  const list2 = createLinkedList([1, 3, 4]);
  const actual = linkedListToArray(mergeTwoLists(list1, list2));
  const expected = [1, 1, 2, 3, 4, 4];

  console.log("题目：合并两个有序链表");
  console.log("测试用例输入:", {
    list1: [1, 2, 4],
    list2: [1, 3, 4],
  });
  console.log("实际结果:", actual);
  console.log("预期结果:", expected);
}

try {
  runExample();
} catch (error) {
  console.error("001-合并两个有序链表 01-question.js: 请先完成 TODO");
  console.error(error.message);
}
