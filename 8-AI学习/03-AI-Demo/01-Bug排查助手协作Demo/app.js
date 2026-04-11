const bugCases = [
  {
    id: "bug-001",
    title: "保存资料失败排查",
    userMessage:
      "线上用户反馈：登录后修改昵称并点击“保存资料”，页面提示“保存失败，请稍后重试”。请帮我定位原因并给出修复建议。",
    resources: {
      "error.log": `2026-04-11T10:02:11Z ERROR SaveProfile failed
requestId=req_8848
status=400
message=ValidationError: field "nickname" is required`,
      "save-user.js": `export async function saveUserProfile(formData) {
  return request("/api/profile/save", {
    method: "POST",
    body: JSON.stringify({
      nickName: formData.nickname,
      avatar: formData.avatar,
    }),
  });
}`,
      "api-doc.md": `POST /api/profile/save

Request Body:
- nickname: string, required
- avatar: string, optional

Validation Rule:
- nickname 不能为空`,
    },
    searchKeyword: "nickname",
    readOrder: ["error.log", "save-user.js", "api-doc.md"],
    reasoning: {
      intent: "定位保存资料失败的根因",
      nextAction: "调用 Bug分析Skill，并优先查看 error.log、save-user.js、api-doc.md",
      chosenSkill: "Bug分析Skill",
      skillType: "接口契约校验 + 日志分析",
    },
    summary: {
      diagnosis: "前端请求字段名写成了 nickName，而接口要求 nickname。",
      rootCause: "前后端字段约定不一致，导致后端校验失败并返回 400。",
      evidence: [
        'error.log 显示后端返回 400，缺少 nickname 字段',
        "save-user.js 实际发送的字段名是 nickName",
        "api-doc.md 明确要求字段名必须是 nickname",
      ],
      fix: "将 save-user.js 中的 nickName 改为 nickname，并补充接口契约校验测试。",
    },
  },
  {
    id: "bug-002",
    title: "列表页数据刷新不及时",
    userMessage:
      "运营反馈：后台刚修改完商品状态，用户回到列表页仍然看到旧状态，大约 30 秒后才恢复。请帮我判断是前端、缓存还是接口问题。",
    resources: {
      "network.log": `GET /api/products/list 200
x-cache-hit: true
age: 24
responseVersion: product-status-v12`,
      "product-list.js": `export async function fetchProductList() {
  return request("/api/products/list", {
    method: "GET",
    cache: "force-cache",
  });
}`,
      "cache-strategy.md": `列表查询接口接入 CDN 缓存
- 默认缓存 30 秒
- 后台修改商品状态后，不主动触发失效
- 前端会直接使用缓存响应`,
    },
    searchKeyword: "缓存",
    readOrder: ["network.log", "product-list.js", "cache-strategy.md"],
    reasoning: {
      intent: "判断列表状态延迟更新的根因",
      nextAction: "调用 Bug分析Skill，并优先查看 network.log、product-list.js、cache-strategy.md",
      chosenSkill: "Bug分析Skill",
      skillType: "网络日志分析 + 缓存策略核对",
    },
    summary: {
      diagnosis: "列表接口命中了 30 秒缓存，导致商品状态更新后短时间内仍显示旧数据。",
      rootCause: "前端请求允许直接用缓存响应，且后台更新后没有主动触发缓存失效。",
      evidence: [
        "network.log 显示 x-cache-hit=true，age=24",
        'product-list.js 使用了 cache: "force-cache"',
        "cache-strategy.md 说明列表接口默认缓存 30 秒且更新后不主动失效",
      ],
      fix: "将列表查询改为更合适的缓存策略，或在后台更新后主动清理相关缓存。",
    },
  },
];

const bugAnalysisSkill = {
  name: "Bug分析Skill",
  goal: "基于日志、源码和文档，定位问题根因并输出可执行结论。",
  steps: ["确认问题类型", "读取关键资源", "交叉验证证据", "输出结构化结论"],
  outputFormat: ["问题定位", "可能原因", "证据来源", "修复建议"],
};

function createMcpForCase(currentCase) {
  return {
    listResources() {
      return Object.keys(currentCase.resources);
    },
    readResource(name) {
      return currentCase.resources[name];
    },
    search(keyword) {
      return Object.entries(currentCase.resources)
        .filter(([, value]) => value.includes(keyword))
        .map(([name]) => name);
    },
  };
}

function mockLlmPlan(currentCase) {
  return {
    system: "你是排障 Agent 的规划模型。请基于用户问题选择分析路径和可调用能力。",
    user: currentCase.userMessage,
    context: {
      availableSkill: bugAnalysisSkill.name,
      availableTools: ["mcp.listResources", "mcp.readResource", "mcp.search"],
    },
    result: currentCase.reasoning,
  };
}

function mockLlmSummarize(skillResult, currentCase) {
  return {
    system: "你是排障 Agent 的总结模型。请根据证据整理成工程师可执行的诊断结果。",
    user: JSON.stringify(skillResult, null, 2),
    context: {
      outputFormat: bugAnalysisSkill.outputFormat,
      taskType: currentCase.reasoning.skillType,
    },
    result: {
      diagnosis: currentCase.summary.diagnosis,
      rootCause: currentCase.summary.rootCause,
      evidence: currentCase.summary.evidence.join("；"),
      fix: currentCase.summary.fix,
    },
  };
}

function runBugAnalysisSkill(currentCase, mcp) {
  const touchedResources = [];
  const parsed = {};

  currentCase.readOrder.forEach((name) => {
    touchedResources.push(name);
    parsed[name] = mcp.readResource(name);
  });

  const searchHits = mcp.search(currentCase.searchKeyword);

  return {
    taskId: currentCase.id,
    skillName: bugAnalysisSkill.name,
    touchedResources,
    evidence: currentCase.summary.evidence,
    parsed,
    search: {
      keyword: currentCase.searchKeyword,
      hits: searchHits,
    },
  };
}

function createSteps(currentCase) {
  const mcp = createMcpForCase(currentCase);

  return [
    {
      id: "agent-receive",
      actor: "agent",
      label: "Agent 接收用户问题，确认目标并准备进入规划阶段",
      run() {
        return {
          status: "Agent 已接收任务，准备让 LLM 先规划排查路径。",
          agentDecision: {
            task: currentCase.title,
            decision: "先规划，再决定调用哪个 Skill 和哪些工具。",
            nextStage: "llm-plan",
          },
        };
      },
    },
    {
      id: "llm-plan",
      actor: "llm",
      label: "LLM 生成分析计划，告诉 Agent 应该调用什么 Skill、看哪些资源",
      run() {
        const llmCall = mockLlmPlan(currentCase);
        return {
          llmCall,
          agentDecision: {
            chosenSkill: llmCall.result.chosenSkill,
            skillType: llmCall.result.skillType,
            plannedResources: currentCase.readOrder,
          },
          status: "LLM 已给出分析计划，Agent 准备调用 Bug分析Skill。",
        };
      },
    },
    {
      id: "skill-start",
      actor: "skill",
      label: "Agent 调用 Bug分析Skill，Skill 准备按稳定套路执行排查",
      run() {
        return {
          skillOutput: {
            skillName: bugAnalysisSkill.name,
            goal: bugAnalysisSkill.goal,
            steps: bugAnalysisSkill.steps,
            outputFormat: bugAnalysisSkill.outputFormat,
          },
          toolTrace: [
            `Agent -> Skill: ${bugAnalysisSkill.name}`,
            `Skill 计划读取资源: ${currentCase.readOrder.join(", ")}`,
          ],
          status: "Skill 已启动，接下来会通过 MCP 调资源，而不是凭经验直接猜答案。",
        };
      },
    },
    {
      id: "mcp-read",
      actor: "mcp",
      label: "Skill 通过 MCP 列资源、读取关键文件、搜索关键字并汇总证据",
      run() {
        const skillResult = runBugAnalysisSkill(currentCase, mcp);
        return {
          mcpCall: {
            listResources: {
              args: {},
              result: mcp.listResources(),
            },
            readResource: currentCase.readOrder.map((name) => ({
              args: { name },
              resultPreview: mcp.readResource(name).slice(0, 120),
            })),
            search: {
              args: { keyword: currentCase.searchKeyword },
              result: mcp.search(currentCase.searchKeyword),
            },
          },
          skillOutput: skillResult,
          toolTrace: [
            ...currentCase.readOrder.map((name) => `Skill -> MCP.readResource("${name}")`),
            `Skill -> MCP.search("${currentCase.searchKeyword}")`,
          ],
          activeResource: currentCase.readOrder[1] || currentCase.readOrder[0],
          status: "MCP 已返回外部证据，Skill 正在把证据整理成结构化分析结果。",
        };
      },
    },
    {
      id: "llm-summary",
      actor: "llm",
      label: "LLM 基于 Skill 产出的证据整理最终诊断、原因和修复建议",
      run(state) {
        const summary = mockLlmSummarize(state.skillOutput, currentCase);
        return {
          llmCall: summary,
          finalReport: summary.result,
          agentDecision: {
            summaryMode: "基于证据总结，而不是凭空推断",
            resultReady: true,
          },
          activeResource: currentCase.readOrder.at(-1),
          status: "LLM 已完成总结，Agent 可以输出面向工程师的最终排障结论。",
        };
      },
    },
    {
      id: "agent-finish",
      actor: "agent",
      label: "Agent 汇总结果并结束本轮排查",
      run(state) {
        return {
          finalReport: state.finalReport,
          agentDecision: {
            done: true,
            outputSections: bugAnalysisSkill.outputFormat,
            takeaway: "Agent 负责流程，LLM 负责推理与总结，Skill 负责方法，MCP 负责外部能力接入。",
          },
          activeResource: currentCase.readOrder[0],
          status: "排查完成。你现在可以切换另一个 case，对比同一协作链路在不同问题上的表现。",
        };
      },
    },
  ];
}

const caseSelect = document.querySelector("#case-select");
const taskText = document.querySelector("#task-text");
const statusText = document.querySelector("#status-text");
const agentPanel = document.querySelector("#agent-panel");
const timelineList = document.querySelector("#timeline-list");
const toolTraceList = document.querySelector("#tool-trace");
const llmCallBlock = document.querySelector("#llm-call");
const skillOutputBlock = document.querySelector("#skill-output");
const mcpCallBlock = document.querySelector("#mcp-call");
const resourceTabs = document.querySelector("#resource-tabs");
const resourceContent = document.querySelector("#resource-content");
const finalReport = document.querySelector("#final-report");
const startButton = document.querySelector("#start-btn");
const stepButton = document.querySelector("#step-btn");
const resetButton = document.querySelector("#reset-btn");
const actorCards = {
  agent: document.querySelector("#agent-card"),
  llm: document.querySelector("#llm-card"),
  skill: document.querySelector("#skill-card"),
  mcp: document.querySelector("#mcp-card"),
};

const state = {
  currentCaseId: bugCases[0].id,
  currentStep: -1,
  status: "等待开始。先观察 Agent 如何规划，再观察 Skill 和 MCP 如何配合。",
  llmCall: null,
  mcpCall: null,
  skillOutput: null,
  finalReport: null,
  activeResource: null,
  agentDecision: null,
  toolTrace: [],
};

function getCurrentCase() {
  return bugCases.find((item) => item.id === state.currentCaseId);
}

function getSteps() {
  return createSteps(getCurrentCase());
}

function pretty(value) {
  return value ? JSON.stringify(value, null, 2) : "暂无数据";
}

function renderCaseSelect() {
  caseSelect.innerHTML = "";

  bugCases.forEach((item) => {
    const option = document.createElement("option");
    option.value = item.id;
    option.textContent = item.title;
    option.selected = item.id === state.currentCaseId;
    caseSelect.appendChild(option);
  });
}

function renderResourceTabs() {
  const currentCase = getCurrentCase();
  resourceTabs.innerHTML = "";

  Object.keys(currentCase.resources).forEach((name) => {
    const button = document.createElement("button");
    button.type = "button";
    button.className = `resource-tab${state.activeResource === name ? " active" : ""}`;
    button.textContent = name;
    button.addEventListener("click", () => {
      state.activeResource = name;
      render();
    });
    resourceTabs.appendChild(button);
  });
}

function renderTimeline() {
  const steps = getSteps();
  timelineList.innerHTML = "";

  steps.forEach((step, index) => {
    const item = document.createElement("li");
    item.textContent = step.label;

    if (index === state.currentStep) {
      item.classList.add("current");
    }

    timelineList.appendChild(item);
  });
}

function renderToolTrace() {
  toolTraceList.innerHTML = "";
  const items = state.toolTrace.length ? state.toolTrace : ["暂无调用轨迹，先开始执行。"];

  items.forEach((entry) => {
    const item = document.createElement("li");
    item.textContent = entry;
    toolTraceList.appendChild(item);
  });
}

function renderActorState() {
  Object.values(actorCards).forEach((card) => card.classList.remove("active"));
  const steps = getSteps();

  if (state.currentStep < 0) {
    return;
  }

  actorCards[steps[state.currentStep].actor].classList.add("active");
}

function renderReport() {
  const report = state.finalReport || {
    diagnosis: "-",
    rootCause: "-",
    evidence: "-",
    fix: "-",
  };

  finalReport.innerHTML = `
    <div>
      <h3>问题定位</h3>
      <p>${report.diagnosis}</p>
    </div>
    <div>
      <h3>可能原因</h3>
      <p>${report.rootCause}</p>
    </div>
    <div>
      <h3>证据来源</h3>
      <p>${report.evidence}</p>
    </div>
    <div>
      <h3>修复建议</h3>
      <p>${report.fix}</p>
    </div>
  `;
}

function render() {
  const currentCase = getCurrentCase();

  taskText.textContent = currentCase.userMessage;
  statusText.textContent = state.status;
  agentPanel.textContent = pretty(state.agentDecision);
  llmCallBlock.textContent = pretty(state.llmCall);
  skillOutputBlock.textContent = pretty(state.skillOutput);
  mcpCallBlock.textContent = pretty(state.mcpCall);
  resourceContent.textContent = currentCase.resources[state.activeResource] || "暂无资源内容";
  renderCaseSelect();
  renderResourceTabs();
  renderTimeline();
  renderToolTrace();
  renderActorState();
  renderReport();
}

function resetState() {
  const currentCase = getCurrentCase();
  state.currentStep = -1;
  state.status = "等待开始。先观察 Agent 如何规划，再观察 Skill 和 MCP 如何配合。";
  state.llmCall = null;
  state.mcpCall = null;
  state.skillOutput = null;
  state.finalReport = null;
  state.agentDecision = {
    currentCase: currentCase.title,
    note: "还没开始执行。建议先点开始排查，或者用单步执行慢慢看。",
  };
  state.toolTrace = [];
  state.activeResource = Object.keys(currentCase.resources)[0];
  render();
}

function applyStep(index) {
  const steps = getSteps();
  const step = steps[index];
  const result = step.run(state);

  state.currentStep = index;
  state.status = result.status || state.status;

  if (result.agentDecision) {
    state.agentDecision = result.agentDecision;
  }

  if (result.llmCall) {
    state.llmCall = result.llmCall;
  }

  if (result.mcpCall) {
    state.mcpCall = result.mcpCall;
  }

  if (result.skillOutput) {
    state.skillOutput = result.skillOutput;
  }

  if (result.finalReport) {
    state.finalReport = result.finalReport;
  }

  if (result.toolTrace) {
    state.toolTrace = result.toolTrace;
  }

  if (result.activeResource) {
    state.activeResource = result.activeResource;
  }

  render();
}

async function playAll() {
  resetState();
  const steps = getSteps();

  for (let index = 0; index < steps.length; index += 1) {
    applyStep(index);
    await new Promise((resolve) => {
      setTimeout(resolve, 700);
    });
  }
}

function playNextStep() {
  const steps = getSteps();
  const nextIndex = state.currentStep + 1;

  if (nextIndex >= steps.length) {
    state.status = "已经执行到最后一步了，可以点重置后重新观察，或者切换另一个 case。";
    render();
    return;
  }

  applyStep(nextIndex);
}

caseSelect.addEventListener("change", (event) => {
  state.currentCaseId = event.target.value;
  resetState();
});
startButton.addEventListener("click", playAll);
stepButton.addEventListener("click", playNextStep);
resetButton.addEventListener("click", resetState);

resetState();
