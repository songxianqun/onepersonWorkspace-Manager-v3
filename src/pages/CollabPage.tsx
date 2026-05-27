import { useState, useRef, useEffect } from "react"
import { Bot, Send, Sparkles, X } from "lucide-react"
import { useChatContext } from "@/App"

// 👉 标签到 prompt 文本的映射
const hintToPrompt: Record<string, string> = {
  "请示事项": "本周待决策事项有哪些",
  "经营看板": "各条线经营进度如何",
  "风险提示": "当前需关注哪些风险",
  "队伍状况": "团队人员配置情况",
  "应急组织": "近期应急响应进展",
}

// ── AI 人设回复生成器 ──

function buildDefaultGreeting(): string {
  return `下午好。

协同管理助手已就位。今天跨部门的事项比较多，帮你梳理了几个关键维度：

👉 请示事项
👉 经营看板
👉 风险提示
👉 队伍状况
👉 应急组织

也可以直接输入你想了解的问题，我会用尽量简洁的方式呈现。`
}

const promptReplies: Record<string, string> = {
  "本周待决策事项有哪些":
    `本周有 **3 项** 需要你拍板：

• **跨部门资源协调方案** — 各部门意见已汇总，分歧主要在预算分摊比例
• **季度经营目标调整** — 建议已经出来，投行和资管条线变化较大
• **新客准入标准修订** — 修订稿等你过目

建议先看资源协调方案，涉及面最广。

👉 先看资源协调方案详情
👉 审批季度目标调整
👉 逐一过一遍`,

  "各条线经营进度如何":
    `各条线数据过了一遍，整体向稳：

• **投行** — 项目储备充裕，过会率保持 85%，节奏稳健
• **资管** — 规模环比涨 6%，核心产品表现不错
• **零售** — 新增客户达标 92%，还差一口气
• **投资** — 跑赢基准 1.2 个百分点，风控指标也都在线

零售条线可能需要稍微推一把。

👉 看看零售条线怎么提升
👉 查看各条线详细数据
👉 生成经营简报`,

  "当前需关注哪些风险":
    `当前有 **3 个风险点** 需要你心里有数：

• 债市最近波动加大，持仓久期可能要适当缩短
• 有两家授信客户评级下调预警，信用风险需要复核
• 合规那边发现一个流程漏洞，已经在修了

前两个比较紧迫，建议优先关注。

👉 查看债市影响分析
👉 复核下调评级客户
👉 了解流程修复进展`,

  "团队人员配置情况":
    `团队这边整体稳定：

• **128 人编制**，在岗 121，缺 7 个编制
• 本周新进 2 人，离职 1 人
• 下周有新员工合规培训

缺编岗位集中在投行和科技条线，招聘已经在推了。

👉 查看缺编岗位清单
👉 安排新员工培训事项
👉 看看各团队饱和度`,

  "近期应急响应进展":
    `近期应急响应都稳住了：

• 系统故障已修复，影响控制在 15 分钟，复盘报告在写
• 客户投诉升级已经处理完毕，满意度恢复
• 监管问询材料已提交，在等回复

都在跟踪范围内，暂无新增风险。

👉 查看应急复盘报告
👉 跟进监管回复进度
👉 看看应急响应记录`,
}

function buildPromptHintReply(hint: string): string {
  const quickReplies: Record<string, string> = {
    "先看资源协调方案详情": `资源协调方案的核心分歧在预算分摊比例。

投行和资管认为按收入占比分摊合理，零售和投资则认为应按实际使用量核算。两边各有道理，我整理了各方的论证材料。

建议开一个短会拍板，我帮你约时间？

👉 帮我约一个协调会
👉 先看各方论证详细材料`,

    "审批季度目标调整": `季度目标调整主要涉及两条线：

**投行条线** — 全年过会目标上调 5%，依据是上半年储备项目超预期
**资管条线** — 规模目标下调 3%，考虑到近期市场波动

如果认可这个方向，我帮你生成审批表。

👉 生成目标调整审批表
👉 先看看各条线详细预测`,

    "看看零售条线怎么提升": `零售条线距达标还差 8 个百分点，差距主要在新增机构客户这块。

建议下周加大机构拜访密度，配合线上获客活动一起推。我整理了几个可行的方案。

👉 查看机构拜访计划
👉 安排线上获客活动
👉 先看看其他条线`,

    "查看债市影响分析": `最近两周债市波动加大，主要受宏观政策预期影响。

目前公司持仓平均久期偏长，建议缩短 0.5-1 年以控制风险敞口。我汇总了张策略团队给的最新建议。

👉 看看策略团队建议
👉 生成风险应对方案
👉 关注信用风险`,

    "查看缺编岗位清单": `7 个缺编岗位分布：
• 投行条线 3 个（承做岗）
• 科技条线 2 个（开发岗）
• 合规条线 1 个
• 运营条线 1 个

投行 3 个岗位已有候选人进入终面，预计下周能定。

👉 查看候选人详情
👉 推进科技条线招聘
👉 看看新员工培训计划`,

    "查看应急复盘报告": `系统故障复盘报告初稿已出：
• 故障原因：数据库连接池耗尽
• 影响范围：交易系统约 15 分钟不可用
• 改进措施：已增加连接池容量并加入自动扩容策略

需要补充的内容还有运维响应时间线，运维那边在整理。

👉 补充运维响应时间线
👉 审批复盘报告
👉 查看应急改进措施`,
  }

  return quickReplies[hint] || `好的，关于「${hint}」我正在整理相关信息。

有更具体的方向吗？`
}

function buildAgentReply(name: string, hasBadge: boolean): string {
  if (!hasBadge) {
    return `这个时段「${name}」这边没有需要关注的协同事项，整体运行平稳。

需要看看别的方向吗？

👉 看看其他智能体
👉 进入${name}`
  }

  const badgeContent: Record<string, string> = {
    "机构业务协同": `「机构业务协同」这边有 **3 项** 在推进：

• 某央企年金管理机构招标在跟
• 两家保险公司委外账户要续约
• 新机构客户尽调材料在准备中

在这里快速查看，还是进入机构业务协同深度办理？

👉 留在这里快速查看
👉 进入机构业务协同`,

    "销售业务协同": `「销售业务协同」这边有 **5 项** 在推进：

• 3 家重点客户拜访排期中
• 新产品推介材料要定稿
• 区域销售目标分解待确认

在这里快速查看，还是进入销售业务协同深度办理？

👉 留在这里快速查看
👉 进入销售业务协同`,
  }

  return badgeContent[name] || `「${name}」正在为您检索协同事项...

👉 留在这里查看
👉 进入${name}`
}

function buildGeneralReply(userInput: string): string {
  return `收到。正在根据「${userInput.length > 15 ? userInput.slice(0, 15) + "…" : userInput}」汇总相关信息。

有想优先了解的方向吗？

👉 查看协同事项概览
👉 看看各条线进展`
}

export function CollabPage() {
  const { agentClickPayload, clearAgentClick, openChat } = useChatContext()
  const [input, setInput] = useState("")
  const bottomRef = useRef<HTMLDivElement>(null)
  const [messages, setMessages] = useState<{ role: "user" | "assistant"; content: string; agentName?: string }[]>([
    { role: "assistant", content: buildDefaultGreeting() },
  ])

  const scrollToBottom = () => {
    setTimeout(() => bottomRef.current?.scrollIntoView({ behavior: "smooth" }), 100)
  }

  // 监听智能体头像点击
  useEffect(() => {
    if (!agentClickPayload || agentClickPayload.tab !== "collab") return

    const { name, hasBadge } = agentClickPayload
    clearAgentClick()

    const reply = buildAgentReply(name, hasBadge)
    setMessages((prev) => [...prev, { role: "assistant", content: reply, agentName: name }])
    scrollToBottom()
  }, [agentClickPayload, clearAgentClick])

  // 智能体跳转
  const handleJumpToAgent = (agentName: string) => {
    const collabNames = [
      "机构业务协同", "销售业务协同", "跨部门协同",
      "投行业务协同", "资管业务协同", "零售业务协同", "交叉验证协同",
    ]
    const agentImages = [
      "/aiworkspace/images/Avatar1.png",
      "/aiworkspace/images/Avatar2.png",
      "/aiworkspace/images/Avatar3.png",
      "/aiworkspace/images/Avatar4.png",
      "/aiworkspace/images/Avatar5.png",
      "/aiworkspace/images/Avatar6.png",
      "/aiworkspace/images/Avatar7.png",
    ]
    const idx = collabNames.indexOf(agentName)
    if (idx >= 0) {
      openChat({ name: agentName, image: agentImages[idx] })
    }
  }

  const handleSend = () => {
    if (!input.trim()) return
    const text = input.trim()
    setInput("")
    setMessages((prev) => [...prev,
      { role: "user", content: text },
      { role: "assistant", content: buildGeneralReply(text) },
    ])
    scrollToBottom()
  }

  // 👉 快捷追问点击：先检查是否为提示词入口，再查快捷回复
  const handlePromptHint = (hint: string) => {
    const mappedPrompt = hintToPrompt[hint]
    if (mappedPrompt) {
      setMessages((prev) => [...prev,
        { role: "user", content: mappedPrompt },
        { role: "assistant", content: promptReplies[mappedPrompt] || `正在查询「${hint}」，请稍候…` },
      ])
      scrollToBottom()
      return
    }

    setMessages((prev) => [
      ...prev,
      { role: "user", content: hint },
    ])
    setTimeout(() => {
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: buildPromptHintReply(hint) },
      ])
      scrollToBottom()
    }, 350)
  }

  // 渲染消息内容，支持 👉 快捷追问标签和 【】 操作按钮
  const renderMessageContent = (msg: { role: string; content: string; agentName?: string }) => {
    const lines = msg.content.split("\n")
    const textParts: string[] = []
    const hints: string[] = []
    let hasLegacyActions = false

    for (const line of lines) {
      const trimmed = line.trim()
      if (trimmed.startsWith("👉")) {
        hints.push(trimmed.replace(/^👉\s*/, ""))
      } else if (trimmed.startsWith("【")) {
        hasLegacyActions = true
        textParts.push(line)
      } else {
        textParts.push(line)
      }
    }

    const renderText = (text: string) => {
      const parts = text.split(/(\*\*[^*]+\*\*)/g)
      return parts.map((part, i) => {
        if (part.startsWith("**") && part.endsWith("**")) {
          return <strong key={i} className="font-semibold text-zinc-900">{part.slice(2, -2)}</strong>
        }
        return part
      })
    }

    return (
      <>
        <div className="whitespace-pre-wrap">{renderText(textParts.join("\n"))}</div>

        {hints.length > 0 && (
          <div className="flex flex-wrap gap-2 mt-3">
            {hints.map((hint, i) => (
              <button
                key={i}
                onClick={() => handlePromptHint(hint)}
                className="inline-flex items-center gap-1 px-3 py-1.5 bg-primary/8 text-primary text-xs rounded-full hover:bg-primary/15 transition-colors"
              >
                <span className="text-[10px]">👉</span> {hint}
              </button>
            ))}
          </div>
        )}

        {hasLegacyActions && msg.role === "assistant" && (
          <div className="flex gap-2 mt-3">
            {msg.content.includes("【跳转") && (
              <button
                onClick={() => {
                  const match = msg.content.match(/【跳转至([^】]+)】/)
                  handleJumpToAgent(match ? match[1] : msg.agentName || "")
                }}
                className="px-3 py-1.5 bg-primary text-white text-xs rounded-full hover:bg-primary/90 transition-colors"
              >
                跳转
              </button>
            )}
            {msg.content.includes("【取消】") && (
              <button
                onClick={() => {
                  setMessages((prev) => [...prev, {
                    role: "assistant",
                    content: "好的，继续在当前页面。可以直接点击快捷查询或输入问题。",
                  }])
                  scrollToBottom()
                }}
                className="px-3 py-1.5 bg-zinc-200 text-zinc-700 text-xs rounded-full hover:bg-zinc-300 transition-colors"
              >
                取消
              </button>
            )}
            {msg.content.includes("【留在当前") && (
              <button
                onClick={() => {
                  setMessages((prev) => [...prev, {
                    role: "assistant",
                    content: "好的，就在这里查看。你可以直接点击快捷查询或输入问题。",
                  }])
                  scrollToBottom()
                }}
                className="px-3 py-1.5 bg-zinc-200 text-zinc-700 text-xs rounded-full hover:bg-zinc-300 transition-colors"
              >
                留在当前
              </button>
            )}
            {msg.content.includes("【进入") && (
              <button
                onClick={() => {
                  const match = msg.content.match(/进入([^】]+)/)
                  handleJumpToAgent(match ? match[1] : msg.agentName || "")
                }}
                className="px-3 py-1.5 bg-primary text-white text-xs rounded-full hover:bg-primary/90 transition-colors"
              >
                进入
              </button>
            )}
          </div>
        )}
      </>
    )
  }

  return (
    <div className="h-full flex flex-col">
      <div className="flex-1 overflow-y-auto min-h-0 pt-6 px-0">
        <div className="flex flex-col bg-white ring-1 ring-zinc-100/60 rounded-2xl overflow-hidden min-h-full">
          <div className="flex-1 overflow-y-auto bg-white px-5 pt-6 pb-2">
            {/* 消息列表 */}
            {messages.map((msg, i) => (
              <div key={i} className={`flex gap-2.5 mb-4 ${msg.role === "user" ? "flex-row-reverse" : ""}`}>
                <div className="w-6 h-6 rounded-full shrink-0 flex items-center justify-center mt-0.5">
                  {msg.role === "assistant" ? (
                    <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center">
                      <Bot className="w-3.5 h-3.5 text-primary" />
                    </div>
                  ) : (
                    <div className="w-6 h-6 rounded-full bg-primary/80 flex items-center justify-center text-white text-[10px] font-medium">我</div>
                  )}
                </div>
                <div className={`max-w-[75%] rounded-2xl px-3.5 py-2.5 text-sm leading-relaxed ${
                  msg.role === "user"
                    ? "bg-primary/85 text-white rounded-br-sm"
                    : "bg-zinc-100 text-zinc-800 rounded-tl-sm"
                }`}>
                  {msg.role === "user" ? (
                    <span>{msg.content}</span>
                  ) : (
                    renderMessageContent(msg)
                  )}
                </div>
              </div>
            ))}

            <div ref={bottomRef} />
          </div>

          {/* 输入栏 */}
          <div className="px-5 py-4 border-t border-zinc-100 bg-white shrink-0">
            <div className="flex items-center gap-3 bg-zinc-100 rounded-full px-4 py-2.5">
              <Sparkles className="w-4 h-4 text-zinc-400 shrink-0" />
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSend()}
                placeholder="输入问题，或点击上方快捷追问"
                className="flex-1 bg-transparent text-sm text-zinc-700 placeholder:text-zinc-300 outline-none"
              />
              {input && (
                <button onClick={() => setInput("")} className="w-5 h-5 rounded-full flex items-center justify-center text-zinc-400 hover:text-zinc-600 transition-colors">
                  <X className="w-3 h-3" />
                </button>
              )}
              <button
                onClick={handleSend}
                disabled={!input.trim()}
                className="w-8 h-8 rounded-full bg-primary text-white flex items-center justify-center disabled:opacity-30 hover:bg-primary/90 transition-all shrink-0"
              >
                <Send className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
