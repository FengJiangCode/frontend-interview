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
 * 题目描述：
 * 请在这里描述题目的核心要求、输入输出约束和目标行为。
 *
 * 举例说明：
 * 输入：
 * 输出：
 * 解释：
 *
 * 作答要求：
 * 1. 先理解题意，再完成实现
 * 2. 尽量说明核心思路
 * 3. 如有更优解，可进一步优化
 *
 * 测试说明：
 * 1. 补全下方 TODO 实现
 * 2. 直接运行 node 01-question.js
 * 3. 对照下方 case 的“实际结果”和“预期结果”检查实现是否正确
 */

// TODO: 在这里完成你的实现
export function ${functionName}(...args) {
  throw new Error("TODO: 请在 01-question.js 中完成实现");
}

function runExample() {
  const input = undefined;

  try {
    const actual = ${functionName}(input);
    const expected = undefined;

    console.log("题目：${title}");
    console.log("测试用例输入:", input);
    console.log("实际结果:", actual);
    console.log("预期结果:", expected);
  } catch (error) {
    console.error("${title} 01-question.js: 运行失败");
    throw error;
  }
}

runExample();
`;

if (output) {
  fs.writeFileSync(output, content, "utf8");
} else {
  process.stdout.write(content);
}
