# BD Copilot 前端面试材料

> 适用岗位：前端 / React Native / AI 应用前端
> 项目：滴滴国际化外卖 BD App 中的 BD Copilot（`soda-bd-i18n-drn` + `crm-agents`）
> 用法：先看「速记卡」和「三种讲法」，再按「高频问题」逐题练；最后用「STAR 故事」准备行为面。

---

## 0. 三种讲法

### 30 秒版

> BD Copilot 是给地推 BD 用的 AI 助手，用户可以用自然语言查门店数据、做经营分析、生成拜访计划。
> 前端在 RN/DRN App 里实现对话页，核心是三件事：乐观消息 + 3 秒轮询的状态机、A2UI 协议渲染、以及失败/超时/切会话的并发保护。
> 后端由网关负责会话和消息存储，Agent 服务用 LangGraph 做意图识别、查数和 A2UI 生成，前端只和网关交互。

### 2 分钟版

1. **业务**：BD 每天要查门店 KPI、找该拜访的商家、写拜访计划；Copilot 把“查数 + 分析 + 生成计划”压缩成一次对话。
2. **架构**：App → feidian 网关 → crm-agents（LangGraph）→ 回调网关 → App 轮询。
3. **前端**：
   - 发送时乐观插入 user + assistant 占位；
   - 网关返回 `answerMessageId` 后每 3 秒轮询 `getMessageDetail`；
   - 拿到 A2UI JSON 后由渲染器转成 RN 组件；
   - 切换会话、切后台、失败重试都有并发保护。
4. **难点**：不是画页面，而是“异步状态机 + 协议契约 + 失败降级”。
5. **结果**：用户不用跳出对话去查数，回答可以是表格、指标卡、图表，还能一键导入拜访计划。

### 5 分钟版

在 2 分钟版基础上，展开三块：

- **状态机**：`sendInFlight` vs `isLoading`、`isStale`、`requestSeq`、`pokeNow`；
- **A2UI**：协议消息、扁平组件树、数据绑定、catalog 白名单、三层 fallback；
- **工程化**：请求层、灰度、i18n、埋点、Langfuse trace。

---

## 1. 简历描述（可直接改）

- 负责滴滴国际化外卖 BD App 的 BD Copilot 前端：实现对话页、消息状态机、A2UI 协议渲染与交互闭环。
- 设计并实现“乐观消息 + 3s 轮询 + 超时/回前台补查”的异步链路，处理切会话、重复发送、后台挂起等并发场景。
- 实现 A2UI v0.9 渲染器：扁平组件树、JSON Pointer 数据绑定、迭代器绑定、10+ 业务组件、错误边界与 fallback。
- 落地一键导入拜访计划、消息反馈、@ 门店、会话列表等业务能力，打通“分析结果 → 业务动作”。
- 建立前端可观测性：API trace、入口埋点、性能阶段埋点，配合 Langfuse 定位 Agent/A2UI 问题。

> 如果你实际负责的范围更窄，按真实情况删减，不要把所有模块都写成自己做的。

---

## 2. 业务背景

### 2.1 用户是谁

- **BD**：地推/销售，负责门店签约、上线、经营提升、拜访。
- **BDM**：BD 的管理者，看团队和区域数据。
- 市场：BR（巴西）和 SSL（其他国家），业务规则不同。

### 2.2 他们每天做什么

- 查门店经营数据：完单量、曝光、转化、健康分、B 责取消、营销 burn；
- 找“该拜访谁”：KPI 短板、商家池、区域密度、路线；
- 拜访后复盘：单店一页纸、历史拜访、未闭环动作；
- 把计划落库：导入拜访计划。

### 2.3 Copilot 解决什么问题

把“打开多个报表 → 自己分析 → 写拜访计划 → 手工录入”压缩成：

```text
自然语言提问 → AI 查数/分析 → 表格/图表/路线 → 一键导入
```

---

## 3. 系统架构

### 3.1 三方分工

```text
App（RN/DRN）
  │ 只调网关
  ▼
feidian 网关 / BFF
  │ 会话、消息、状态、历史、幂等
  ▼
crm-agents（Python + LangGraph）
  │ 意图、鉴权、查数、分析、A2UI 生成
  ▼
LLM / 数据服务
```

关键边界：

- App **不直接调 Agent**；
- Agent **不保存会话**；
- 网关是会话和消息的唯一权威；
- Agent 只负责“生成回答”。

### 3.2 技术栈（前端）

| 维度   | 选型                           |
| ------ | ------------------------------ |
| 框架   | React Native 0.77.2 + DRN      |
| 语言   | TypeScript                     |
| 状态   | Zustand 5                      |
| UI     | `@didi/go-design-react-native` |
| 路由   | `@didi/drn-router`             |
| 表单   | Formily 2.3                    |
| 图表   | ECharts 6                      |
| 国际化 | i18next + 翻译平台             |
| 低码   | Fuxi                           |
| 埋点   | Omega                          |
| 配置   | Apollo                         |

### 3.3 前端目录（Copilot 相关）

```text
src/pages/food/pages/copilotChat/
├── index.tsx                 页面编排
├── constants.ts              catalogId、预设问题、消息上限
├── services/copilotApi.ts    网关接口
├── store/useChatStore.ts     状态机
├── hooks/                    @门店、欢迎页、欢迎语
└── components/               Header、列表、气泡、输入栏、弹窗

src/plugins/bdCopilotA2ui/
├── A2UIv09Renderer.tsx       协议渲染器
├── resolver.ts               数据绑定
├── chartAdapter.ts           图表数据适配
└── components/               11 个 A2UI 组件
```

---

## 4. 核心链路

```text
用户发送
  → App 本地插入 user + assistant(generating)
  → sendMessage(content, shopId, conversationId?)
  → 网关创建 question/answer(status=1)
  → 返回 conversationId + answerMessageId
  → 网关异步调 Agent /bd_copilot_chat_async
  → Agent 生成后回调网关
  → 网关更新 answer(status=2, content=A2UI JSON)
  → App 每 3s 轮询 getMessageDetail
  → 渲染 A2UI / 显示失败重试
```

### 4.1 状态

| status | 含义   |
| ------ | ------ |
| 1      | 生成中 |
| 2      | 成功   |
| 3      | 失败   |

### 4.2 关键错误

| errno | 含义                    |
| ----- | ----------------------- |
| 90001 | 会话失效/不属于当前用户 |
| 10001 | Agent 参数错误          |
| 10002 | Agent 内部错误          |

### 4.3 内容协议

AI 消息的 `content` 是字符串：

```json
{
  "type": "a2ui",
  "data": [
    {
      "version": "v0.9",
      "createSurface": {
        "surfaceId": "main",
        "catalogId": "aibd/bd-copilot@v0.1"
      }
    },
    {
      "version": "v0.9",
      "updateDataModel": { "path": "/report", "value": {} }
    },
    { "version": "v0.9", "updateComponents": { "components": [] } }
  ],
  "fallbackText": "..."
}
```

---

## 5. 关键技术点

### 5.1 状态机与并发

**核心字段**

| 字段                    | 作用             |
| ----------------------- | ---------------- |
| `isLoading`             | 从发送到轮询结束 |
| `sendInFlight`          | 只覆盖发送握手   |
| `messages`              | 当前会话消息     |
| `activeConversationId`  | 当前会话         |
| `preMsgSeq` / `hasMore` | 历史分页         |
| `requestSeq`            | 丢弃过期历史响应 |

**保护机制**

- 乐观 UI：一次 set 插入 user + assistant；
- 90001 → 新建会话；
- 发送失败 → 删除 assistant 占位，用户消息标 failed；
- `isStale()` → 切会话后旧轮询不回写；
- `inFlight / pendingResync / terminated` → 防并发、防终态复活；
- `requestSeq` → 切会话后旧历史响应不落地。

**要能说的取舍**

- 轮询简单、可恢复，但有延迟和无效请求；
- 不用 WebSocket/SSE 的原因：网关已有消息表和状态位，轮询实现成本最低；
- 代价：首字延迟取决于整条 Agent + A2UI 生成。

### 5.2 轮询与超时

- 间隔：3s；
- 超时：303s（demo 20s）；
- 超时判定放在响应之后，避免后台挂起导致墙上时钟误判；
- 回前台：`resyncPollingOnForeground()` 立即补查；
- 页面恢复：`resumePollingIfNeeded()` 检查 generating 消息；
- 切会话：`stopAllPolling()`，旧轮询 `isStale` 停止。

### 5.3 会话、历史、持久化

- 会话 ID：网关签发，前端持久化 24h；
- 恢复：`restoreActiveConversation()` → 拉历史 → 恢复轮询；
- 历史：每页 10 条，游标 `preMsgSeq`，上限 100 条；
- 去重：按 messageId；
- 切换：停轮询、清列表、拉历史、恢复未完成轮询。

### 5.4 A2UI / SDUI

**协议**

- `createSurface`：创建渲染面；
- `updateDataModel`：写数据；
- `updateComponents`：下发扁平组件列表。

**渲染**

```text
messages
  → extractComponents
  → id → node map
  → root
  → buildDataStore
  → renderNode
      ├─ 静态 children: string[]（id 引用）
      ├─ 迭代器: { componentId, path } + scope
      └─ 属性绑定: { path: "/report/xxx" }
```

**11 个组件**

`Column / Row / RichText / Divider / DataTable / OrderedList / MetricGroup / Card / Tag / Button / Chart`

**catalog**

- `catalogId = aibd/bd-copilot@v0.1`；
- 后端 catalog JSON 是组件白名单 + JSON Schema；
- 客户端发送 catalogId，Agent 按它选 catalog、拼 prompt、校验输出；
- 找不到 catalog → 回退到第一个可用 catalog 并告警；
- 新增组件 → 新 catalogId + 前端 renderer 同步。

**三层 fallback**

1. Schema 校验失败 → 回灌错误重试（最多 2 次）；
2. 仍失败 / 数据不足 / 异常 → fallback catalog + `fallbackText`；
3. 前端渲染异常 / 未知组件 → ErrorBoundary / 局部 fallback。

### 5.5 请求层

- 网关点分名：`feidian.bdCopilot.sendMessage`；
- 公共参数：`ticket / locale / country / timezone / bizId / bundle_version`；
- 401 → SSO；
- 错误 → `DeviceEventEmitter` → `GlobalErrorToast`；
- 环境：sim / pre / production；
- 幂等：`idempotentKey`；
- trace：`traceId` / `Didi-Header-Rid`。

### 5.6 RN / DRN

要能解释：

- DRN 是滴滴的 RN 容器；
- `LoadingScreen` 做初始化后 `router.replace`；
- `@didi/drn-router` 管理路由；
- `@didi/unify-bridge`、`@didi/drn-soda-bd-turbo` 提供原生能力；
- `useRNContainerStateChange` 而不是 RN `AppState`；
- `Popup` 必须 `renderMode="provider"`；
- iOS/Android 键盘、返回键、safe area 差异；
- 为什么消息列表用 `ScrollView` 而不是 `FlatList`。

### 5.7 性能

- `memo` + 稳定引用；
- Zustand selector 粒度订阅；
- 事件回调用 `getState()`，不订阅；
- 消息上限 100；
- 页面 lazy、Tab 懒加载；
- 延迟渲染消息中心；
- `InteractionManager` 推迟非紧急任务；
- A2UI ErrorBoundary 限制故障范围。

### 5.8 可观测性

- 埋点：入口曝光/点击、API trace、性能阶段；
- trace 串联 App → 网关 → Agent；
- Langfuse 看 intent / analysis / A2UI；
- 典型排查：
  - 一直转圈 → status 一直 1 / 回调失败；
  - 有回复但纯文本 → A2UI fallback；
  - 门店上下文丢失 → `[SHOP ...]` 编码；
  - 会话串了 → conversationId / stale 判断。

---

## 6. STAR 故事

### 故事 1：轮询状态机与并发保护

**S**：生成耗时不可控，用户会切会话、切后台、重复点击。

**T**：保证不串会话、不重复、不误判超时。

**A**：

- 乐观插入 user + assistant；
- `sendInFlight` 与 `isLoading` 分离；
- `isStale()` 阻止旧轮询回写；
- `inFlight / pendingResync / terminated` 防并发；
- 回前台 `pokeNow()` 补查；
- `requestSeq` 丢弃旧历史响应。

**R**：消息稳定、切会话无脏写、超时可控。

### 故事 2：A2UI 渲染与 catalog 契约

**S**：RN 不适合 Markdown，LLM 输出不可控。

**T**：让 LLM 安全地生成可渲染 UI。

**A**：

- 协议解析、扁平组件树、数据绑定、迭代器；
- catalog 白名单 + JSON Schema；
- 后端生成后校验、回灌重试、fallback；
- 前端 ErrorBoundary + 未知组件降级；
- catalogId 版本握手。

**R**：组件可扩展、前后端可独立发版、坏输出不白屏。

### 故事 3：一键导入拜访计划

**S**：用户看完推荐路线还要手工录入，链路断裂。

**T**：从 AI 回答直接完成业务动作。

**A**：

- A2UI Button 携带 `import_visit_plan` action；
- 前端校验 merchants（itemId、shopId、ISO 日期、order）；
- 弹窗确认 → `batchSaveVisitPlan`；
- 用 assistant messageId 做幂等；
- 部分失败展示 failedList。

**R**：分析 → 行动闭环，减少手工操作。

### 故事 4：线上问题定位

**S**：用户反馈“一直转圈”或“回复是纯文本”。

**T**：快速定位是 App、网关还是 Agent。

**A**：

- 用 traceId 串三端日志；
- 看 `getMessageDetail` 状态；
- 看 Agent 回调是否成功；
- 看 Langfuse 的 intent / analysis / A2UI 节点；
- 前端看 fallbackText 与 A2UI JSON。

**R**：把问题定位到具体环节，而不是盲改前端。

---

## 7. 高频面试题与参考答案

### 7.1 架构 / 业务

**Q1：介绍一下 BD Copilot。**

> 见「2 分钟版」。重点说清三方分工和“为什么 App 不直接调 Agent”。

**Q2：为什么需要网关，不让前端直接调 Agent？**

> 会话/消息存储、鉴权、幂等、历史组装、多端一致性都在网关；Agent 无状态，方便扩缩容。

**Q3：Copilot 和普通 Chat 有什么区别？**

> 不只是聊天：要查业务数据、做分析、生成结构化 UI，还要能触发业务动作（导入拜访计划）。

### 7.2 状态机 / 并发

**Q4：为什么用轮询，不用 WebSocket/SSE？**

> 网关已有消息表和状态位；轮询实现简单、可恢复、跨端一致。代价是延迟和无效请求。如果要做流式，需要网关支持 SSE/WS 并改造消息落库。

**Q5：如何保证消息不丢、不重、不乱序？**

> 发送幂等 `idempotentKey`；本地乐观消息 + serverMessageId 关联；历史按 msgSeq 排序；切会话用 `requestSeq` 和 `isStale` 丢弃过期响应；消息按 id 去重。

**Q6：切换会话时，旧轮询怎么处理？**

> `stopAllPolling()`；轮询闭包带会话快照，`isStale()` 为 true 时不回写；历史请求用 `requestSeq` 丢弃。

**Q7：App 切后台再回来，怎么避免误判超时？**

> 超时在响应之后判定；`pokeNow()` 重置超时基准并立即补查；回前台用容器事件触发。

**Q8：`isLoading` 和 `sendInFlight` 为什么要分开？**

> `sendInFlight` 只锁发送握手，避免轮询期间不能切会话；`isLoading` 覆盖整个生成期，锁输入。

### 7.3 A2UI / SDUI

**Q9：A2UI 是什么？**

> 开放协议（v0.9），用 JSON 描述 UI；本项目在其上定义了内部 catalog。

**Q10：为什么不用 Markdown/HTML？**

> RN 不适合 Markdown；HTML 不可控、有安全风险；A2UI 是白名单组件 + Schema 校验。

**Q11：组件树为什么是扁平的？**

> id 引用、易增量更新、渲染器只需维护 map。

**Q12：数据绑定怎么实现？**

> `{path}` + JSON Pointer；绝对路径查 dataStore，相对路径查迭代 scope。

**Q13：如何保证 LLM 生成的 UI 安全？**

> catalog 白名单；组件不输出任意 HTML；Schema 校验；前端未知组件降级。

**Q14：catalogId 有什么用？**

> 客户端声明支持的组件集；服务端按它选 catalog、拼 prompt、校验；老客户端继续用老 catalog。

**Q15：新增一个 A2UI 组件要改哪些地方？**

> 后端 catalog JSON、prompt/examples、前端 renderer case、组件实现、CSS、fixture；不兼容变更用新 catalogId。

### 7.4 RN / 性能

**Q16：RN 和 Web 在这个项目里的差异？**

> 无 DOM、JS 样式、原生 bridge、路由/容器、键盘/滚动/安全区、列表虚拟化差异。

**Q17：为什么消息列表用 ScrollView？**

> 需要精确 `scrollToEnd` 和 prepend 视口补偿；消息上限 100，虚拟化收益有限。

**Q18：如何避免不必要的重渲染？**

> Zustand selector、memo、稳定引用、事件回调 `getState()`、消息上限、懒加载。

**Q19：长消息/大表格怎么处理？**

> 消息上限、表格横向滚动、A2UI 渲染错误边界、必要时限制行数/列数。

### 7.5 工程 / 可观测性

**Q20：线上问题怎么定位？**

> traceId 串 App/网关/Agent；看 status、回调、Langfuse、fallbackText。

**Q21：为什么没有单元测试？**

> 项目以 prompt/业务迭代为主，现有测试是 Node 检查脚本 + 人工场景矩阵；如果要补，优先补状态机纯函数和 resolver。

**Q22：如果重做，你会改什么？**

> 引入流式；把 catalog 作为单一契约自动生成前端类型；补状态机单测；减少轮询无效请求。

---

## 8. 白板 / 手写准备

### 8.1 画时序图

```text
App → 网关 → Agent → 网关 → App
```

要能标出：question/answer 落库、status=1、回调、status=2、轮询。

### 8.2 写轮询伪代码

```ts
async function poll(answerId) {
  let start = Date.now();
  let inFlight = false;
  let terminated = false;

  const tick = async () => {
    if (inFlight) return;
    inFlight = true;
    try {
      const res = await getMessageDetail(answerId);
      if (res.data.status === 2) return finishSuccess(res.data.content);
      if (res.data.status === 3) return finishFailed();
      if (Date.now() - start > TIMEOUT) return finishFailed();
      timer = setTimeout(tick, 3000);
    } finally {
      inFlight = false;
    }
  };
  tick();
}
```

### 8.3 写 A2UI renderNode 伪代码

```ts
function renderNode(node, map, data, scope) {
  const children = renderChildren(node, map, data, scope)
  switch (node.component) {
    case 'Column': return <Column gap={resolve(node.gap)}>{children}</Column>
    case 'DataTable': return <DataTable rows={resolve(node.rows)} />
    case 'Button': return <Button action={resolve(node.action)} />
    default: return fallback()
  }
}
```

### 8.4 设计题

- 设计一个支持分页的消息列表；
- 设计一个 catalog 版本兼容方案；
- 设计一个“发送失败重试”的幂等方案；
- 设计一个 A2UI 渲染错误降级方案。

---

## 9. 量化数据（回答时用）

| 指标           | 数值                                           |
| -------------- | ---------------------------------------------- |
| 轮询间隔       | 3s                                             |
| 生产轮询超时   | 303s                                           |
| 消息上限       | 100 条                                         |
| 历史分页       | 10 条/页                                       |
| 会话列表分页   | 20 条/页                                       |
| A2UI 组件      | 11 个                                          |
| catalog        | `aibd/bd-copilot@v0.1`（catalogVersion 0.3.0） |
| A2UI 生成重试  | 最多 2 次                                      |
| A2UI 生成超时  | 180s                                           |
| Agent 异步超时 | 300s                                           |
| 多语言         | zh-CN / en-US / pt-BR / es-MX / es-CO          |
| RN / React     | RN 0.77.2 / React 18.3.1                       |

> 不要在面试里编造你没做过的指标；不确定的数字就说“大致/约”。

---

## 10. 可能的追问与诚实回答

### Q：为什么不用 WebSocket？

> 网关已有消息表和状态位，轮询实现成本最低、可恢复、跨端一致。WebSocket 需要网关支持长连接、消息推送、断线重连和落库顺序，改造成本更高。当前没有流式需求，所以轮询是合理取舍。

### Q：为什么不用 Redux？

> 这个场景状态集中在单个 store，Zustand 的 selector 粒度订阅、非组件 `getState()`、持久化都更轻；团队也在用 Zustand。Redux 的样板代码和 Provider 包裹在这个页面没有收益。

### Q：为什么没有单元测试？

> 项目历史以 prompt/业务快速迭代为主，现有验证是 Node 检查脚本 + 人工场景矩阵。如果要补，我会优先补状态机纯函数、resolver、网关 mock，而不是 UI 快照。

### Q：你负责哪部分？

> 按真实情况回答。建议说清“我负责 Copilot 前端页面/状态机/A2UI 渲染中的哪些”，不要把整个 App 都说成自己做的。

### Q：最大的挑战？

> 不是 UI，而是异步状态机和协议契约：切会话/切后台/重试时的并发，以及 LLM 输出不可控时的降级。

### Q：如果重做？

> 1）引入流式；2）catalog 作为唯一契约自动生成前端类型；3）补状态机单测；4）减少无效轮询；5）把 action 协议做得更通用，而不是页面 switch。

---

## 11. 反问面试官

1. 这个岗位更偏业务交付，还是基础设施/平台？
2. 团队如何处理 AI 输出的可控性和评测？
3. 前端在 AI 应用里的边界：只做渲染，还是也参与 prompt/协议设计？
4. 有没有流式/多模态的规划？
5. 工程质量上，测试和可观测性的现状如何？
6. RN/DRN 之外，团队是否有 Web/跨端计划？

---

## 12. 3 天复习计划

### Day 1：架构与链路

- 背熟 30 秒/2 分钟版；
- 手画三方架构图和一次请求时序图；
- 能说清 status / errno / content 协议。

### Day 2：状态机与 A2UI

- 手写轮询伪代码；
- 讲清 `sendInFlight` / `isLoading` / `isStale` / `requestSeq`；
- 讲清 A2UI 渲染流程、catalogId、三层 fallback；
- 准备“新增组件要改哪些地方”。

### Day 3：模拟问答

- 按第 7 节逐题自问自答；
- 用 STAR 讲 2 个故事；
- 准备 3 个“如果重做/不足”的诚实回答；
- 打开 demo 演示一次发送 → 轮询 → 切场景。

---

## 13. 速记卡（面试前 5 分钟看）

```text
三方：App → 网关 → Agent
前端：乐观 UI + 3s 轮询 + A2UI 渲染
状态：1 生成中 / 2 成功 / 3 失败
超时：303s；回前台 pokeNow
并发：sendInFlight / isLoading / isStale / requestSeq
A2UI：createSurface + updateDataModel + updateComponents
组件：11 个；catalog aibd/bd-copilot@v0.1
降级：Schema 校验 → 重试 → fallbackText
安全：catalog 白名单，不输出任意 HTML
RN：DRN 容器 / bridge / go-design / ScrollView / Popup provider
可观测：traceId → 网关 → Agent → Langfuse
```

---

## 14. 最后一句

面试时不要只讲“我用了什么”，要讲：

> **为什么这么设计、替代方案是什么、失败时怎么办、怎么验证。**

这四点，比背 API 更能体现工程能力。
