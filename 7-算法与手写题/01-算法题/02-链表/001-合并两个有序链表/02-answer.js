/**
 * 题目标题：合并两个有序链表
 * 题目类型：算法题
 * 难度：简单
 *
 * 解题思路：
 * 这道题是链表题里的经典入门题。
 * 因为两个链表本身已经有序，
 * 所以每次只需要比较当前两个节点的值，
 * 把较小的那个接到结果链表后面即可。
 *
 * 为了统一处理头节点，通常会引入一个虚拟头节点 dummy。
 * 这样无论当前接的是哪个链表的节点，
 * 都只需要移动 tail 指针，不需要单独判断“结果链表是不是还没开始”。
 *
 * 当某一条链表先走完时，
 * 另一条链表剩余部分本身已经有序，
 * 直接接到结果链表末尾即可。
 *
 * 时间复杂度：
 * O(n + m)
 *
 * 空间复杂度：
 * O(1)
 *
 * 复杂度如何计算：
 * 假设两条链表长度分别为 n 和 m，
 * 在合并过程中，每个节点最多只会被访问和连接一次，
 * 所以总时间复杂度是 O(n + m)。
 * 额外只使用了几个指针变量，没有使用与输入规模相关的额外结构，
 * 因此空间复杂度是 O(1)。
 *
 * 关键边界情况：
 * 1. 其中一条链表为空时，应直接返回另一条链表
 * 2. 两条链表都为空时，应返回空链表
 * 3. 有重复值时也要正确合并，比如 [1, 2] 和 [1, 3]
 *
 * 面试追问：
 * 1. 为什么链表题里经常使用虚拟头节点？
 * 2. 这道题递归写法怎么写？优缺点是什么？
 * 3. 为什么这道题的额外空间复杂度可以是 O(1)？
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

export function mergeTwoLists(list1, list2) {
  const dummy = new ListNode();
  let tail = dummy;
  let left = list1;
  let right = list2;

  while (left && right) {
    if (left.val <= right.val) {
      tail.next = left;
      left = left.next;
    } else {
      tail.next = right;
      right = right.next;
    }

    tail = tail.next;
  }

  tail.next = left || right;

  return dummy.next;
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

runExample();
