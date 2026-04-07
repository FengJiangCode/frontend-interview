#!/usr/bin/env node

import fs from "node:fs";

function getArg(name, fallback = "") {
  const prefix = `--${name}=`;
  const value = process.argv.find((arg) => arg.startsWith(prefix));
  return value ? value.slice(prefix.length) : fallback;
}

const title = getArg("title", "题目标题");
const type = getArg("type", "算法题");
const difficulty = getArg("difficulty", "中级");
const functionName = getArg("functionName", "solution");
const output = getArg("output");

const content = `/**
 * 题目标题：${title}
 * 题目类型：${type}
 * 难度：${difficulty}
 *
 * 解题思路：
 * 请在这里说明为什么这样解题，以及核心推导过程。
 *
 * 时间复杂度：
 *
 * 空间复杂度：
 *
 * 复杂度如何计算：
 * 请在这里说明循环层数、辅助数据结构、递归深度等如何影响复杂度。
 *
 * 关键边界情况：
 * 1.
 * 2.
 *
 * 面试追问：
 * 1.
 * 2.
 */

export function ${functionName}(...args) {
  void args;
  throw new Error("Not implemented");
}

function runExample() {
  console.log("${title} 02-answer.js 已运行");
  console.log("请在这里补充最优解示例调用，观察执行结果");
}

runExample();
`;

if (output) {
  fs.writeFileSync(output, content, "utf8");
} else {
  process.stdout.write(content);
}
