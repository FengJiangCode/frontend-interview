const demoTask = {
  id: "bug-001",
  title: "保存资料失败排查",
  userMessage:
    "线上用户反馈：登录后修改昵称并点击“保存资料”，页面提示“保存失败，请稍后重试”。请帮我定位原因并给出修复建议。",
};

const demoResources = {
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
};

const bugAnalysisSkill = {
  name: "Bug分析Skill",
  goal: "基于日志、源码和接口文档，定位保存资料失败的根因。",
  steps: ["读日志", "读相关源码", "对照接口文档", "输出结构化结论"],
  outputFormat: ["问题定位", "可能原因", "证据来源", "修复建议"],
};

const mcp = {
  listResources() {
    return Object.keys(demoResources);
  },
  readResource(name) {
    return demoResources[name];
  },
  search(keyword) {
    return Object.entries(demoResources)
      .filter(([, value]) => value.includes(keyword))
      .map(([name]) => name);
  },
};

function mockLlmPlan(task) {
  return {
    system: "你是一个排障 Agent 的决策模型。请先决定应该看哪些资源。",
    user: task.userMessage,
    result: {
      intent: "定位保存资料失败的根因",
      nextAction: "调用 Bug分析Skill，并优先查看 error.log、save-user.js、api-doc.md",
      chosenSkill: bugAnalysisSkill.name,
    },
  };
}

function mockLlmSummarize(skillResult) {
  return {
    system: "你是一个排障 Agent 的总结模型。请将证据整理成对工程师可执行的结论。",
    user: JSON.stringify(skillResult, null, 2),
    result: {
      diagnosis: "前端请求字段名写成了 nickName，而接口要求 nickname。",
      rootCause: "前后端字段约定不一致，导致后端校验失败并返回 400。",
      evidence: skillResult.evidence.join("；"),
      fix: "将 save-user.js 中的 nickName 改为 nickname，并补充接口契约校验测试。",
    },
  };
}

function runBugAnalysisSkill(task, mcpApi) {
  const resourceNames = mcpApi.listResources();
  const errorLog = mcpApi.readResource("error.log");
  const sourceCode = mcpApi.readResource("save-user.js");
  const apiDoc = mcpApi.readResource("api-doc.md");
  const nicknameMatches = mcpApi.search("nickname");

  return {
    taskId: task.id,
    touchedResources: resourceNames,
    evidence: [
      `error.log 显示后端返回 400，缺少 nickname 字段`,
      `save-user.js 实际发送的字段名是 nickName`,
      `api-doc.md 明确要求字段名必须是 nickname`,
      `MCP 搜索 "nickname" 命中了 error.log 和 api-doc.md`,
    ],
    parsed: {
      logClue: errorLog,
      codeClue: sourceCode,
      docClue: apiDoc,
      searchHits: nicknameMatches,
    },
  };
}

const steps = [
  {
    id: "agent-receive",
    actor: "agent",
    label: "Agent 接收用户问题，确认目标是定位保存失败根因",
    run() {
      return {
        status: "Agent 已接收任务，准备询问 LLM：下一步该怎么做。",
      };
    },
  },
  {
    id: "llm-plan",
    actor: "llm",
    label: "LLM 基于任务描述，建议 Agent 调用 Bug分析Skill 并先查看日志/源码/接口文档",
    run() {
      return {
        llmCall: mockLlmPlan(demoTask),
        status: "LLM 已返回执行建议：先调 Skill，再经由 MCP 读取关键资源。",
      };
    },
  },
  {
    id: "skill-start",
    actor: "skill",
    label: "Agent 调用 Bug分析Skill，Skill 开始按固定步骤做排查",
    run() {
      return {
        skillOutput: {
          skillName: bugAnalysisSkill.name,
          goal: bugAnalysisSkill.goal,
          steps: bugAnalysisSkill.steps,
          outputFormat: bugAnalysisSkill.outputFormat,
        },
        status: "Skill 已启动，接下来会通过 MCP 读取资源而不是凭空猜测。",
      };
    },
  },
  {
    id: "mcp-read",
    actor: "mcp",
    label: "Skill 通过 MCP 列资源、读日志、读源码、读接口文档、搜索关键字",
    run() {
      const skillResult = runBugAnalysisSkill(demoTask, mcp);
      return {
        mcpCall: {
          listResources: mcp.listResources(),
          readResource: ["error.log", "save-user.js", "api-doc.md"],
          search: {
            keyword: "nickname",
            hits: mcp.search("nickname"),
          },
        },
        skillOutput: skillResult,
        activeResource: "save-user.js",
        status: "MCP 已提供外部证据，Skill 正在把证据整理成结构化分析。",
      };
    },
  },
  {
    id: "llm-summary",
    actor: "llm",
    label: "LLM 基于 Skill 的结构化结果，组织最终诊断和修复建议",
    run(state) {
      const summary = mockLlmSummarize(state.skillOutput);
      return {
        llmCall: summary,
        finalReport: summary.result,
        activeResource: "api-doc.md",
        status: "LLM 已完成总结，Agent 可以输出面向工程师的最终结论。",
      };
    },
  },
  {
    id: "agent-finish",
    actor: "agent",
    label: "Agent 汇总最终结果，完成一次真实感更强的协作链路",
    run(state) {
      return {
        finalReport: state.finalReport,
        activeResource: "error.log",
        status: "排查完成：Agent 负责流程，LLM 负责决策与总结，Skill 负责方法，MCP 负责接入外部资源。",
      };
    },
  },
];

const taskText = document.querySelector("#task-text");
const statusText = document.querySelector("#status-text");
const timelineList = document.querySelector("#timeline-list");
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
  currentStep: -1,
  status: "等待开始。你会看到一条更像真实 Agent 系统的调用链。",
  llmCall: null,
  mcpCall: null,
  skillOutput: null,
  finalReport: null,
  activeResource: "error.log",
};

function pretty(value) {
  return value ? JSON.stringify(value, null, 2) : "暂无数据";
}

function renderResourceTabs() {
  resourceTabs.innerHTML = "";

  Object.keys(demoResources).forEach((name) => {
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

function renderActorState() {
  Object.values(actorCards).forEach((card) => card.classList.remove("active"));

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
  taskText.textContent = demoTask.userMessage;
  statusText.textContent = state.status;
  llmCallBlock.textContent = pretty(state.llmCall);
  skillOutputBlock.textContent = pretty(state.skillOutput);
  mcpCallBlock.textContent = pretty(state.mcpCall);
  resourceContent.textContent = demoResources[state.activeResource];
  renderResourceTabs();
  renderTimeline();
  renderActorState();
  renderReport();
}

function resetState() {
  state.currentStep = -1;
  state.status = "等待开始。你会看到一条更像真实 Agent 系统的调用链。";
  state.llmCall = null;
  state.mcpCall = null;
  state.skillOutput = null;
  state.finalReport = null;
  state.activeResource = "error.log";
  render();
}

function applyStep(index) {
  const step = steps[index];
  const result = step.run(state);

  state.currentStep = index;
  state.status = result.status || state.status;

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

  if (result.activeResource) {
    state.activeResource = result.activeResource;
  }

  render();
}

async function playAll() {
  resetState();

  for (let index = 0; index < steps.length; index += 1) {
    applyStep(index);
    await new Promise((resolve) => {
      setTimeout(resolve, 700);
    });
  }
}

function playNextStep() {
  const nextIndex = state.currentStep + 1;

  if (nextIndex >= steps.length) {
    state.status = "已经执行到最后一步了，可以点重置后重新观察。";
    render();
    return;
  }

  applyStep(nextIndex);
}

startButton.addEventListener("click", playAll);
stepButton.addEventListener("click", playNextStep);
resetButton.addEventListener("click", resetState);

resetState();
