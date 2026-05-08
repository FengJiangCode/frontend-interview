/**
 * 题目标题：实现简易模板引擎
 * 题目类型：手写题
 * 难度：中级
 *
 * 解题思路（replace 版本）：
 * 用正则 /\{\{\s*(\w+)\s*\}\}/g 全局匹配占位符，捕获组取出 key，
 * 在 replacer 函数中查找 data[key]，不存在时 fallback 为 ""。
 *
 * 解题思路（手动遍历版本）：
 * 逐字符扫描，遇到 "{{" 时切换到"收集 key"模式，遇到 "}}" 时完成替换。
 * 普通字符直接追加到结果字符串。
 *
 * 时间复杂度：O(n)，n 为模板字符串长度
 *
 * 空间复杂度：O(n)，输出字符串长度与输入同阶
 *
 * 关键边界情况：
 * 1. 同一 key 出现多次 → replace 用 /g 标志，手动版每次遇到 {{ 都处理
 * 2. key 不存在于 data → fallback 为 ""，避免输出 "undefined"
 * 3. 占位符内侧空格 → 正则用 \s*，手动版用 trim()
 *
 * 面试追问：
 * 1. 如果模板里有嵌套表达式（如 {{ a.b }}）怎么扩展？
 *    → key 改用 a.b，查值时按 . 拆分逐层访问对象（类似 lodash.get）
 * 2. 如果要支持 XSS 转义（浏览器场景）怎么处理？
 *    → 在写入结果前对值做 HTML 实体转义（& → &amp; 等）
 */

// 版本一：replace
export function template(str) {
  return function (data) {
    return str.replace(/\{\{\s*(\w+)\s*\}\}/g, (_, key) => data[key] ?? "");
  };
}

// 版本二：手动遍历
export function templateNoReplace(str) {
  return function (data) {
    let result = "";
    let i = 0;
    while (i < str.length) {
      if (str[i] === "{" && str[i + 1] === "{") {
        let j = i + 2;
        while (j < str.length && !(str[j] === "}" && str[j + 1] === "}")) {
          j++;
        }
        const key = str.slice(i + 2, j).trim();
        result += data[key] ?? "";
        i = j + 2;
      } else {
        result += str[i];
        i++;
      }
    }
    return result;
  };
}

function runExample() {
  const tpl = template('<p>hey there {{ name }} {{ name }}</p>');
  console.log(tpl({ name: 'Neo' }));
  // <p>hey there Neo Neo</p>

  const tpl2 = templateNoReplace('<p>hey there {{ name }} {{ name }}</p>');
  console.log(tpl2({ name: 'Neo' }));
  // <p>hey there Neo Neo</p>
}

runExample();
