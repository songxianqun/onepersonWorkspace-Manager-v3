import { useState, useRef, useEffect } from "react"
import { CheckCircle2, Bot, Send, Sparkles, X } from "lucide-react"
import { useChatContext } from "@/App"

interface TaskItem {
  id: number
  title: string
  desc: string
  type: string
  time: string
}

const todayTasks: TaskItem[] = [
  { id: 1, title: "贵州茅台定增方案待复核", desc: "投行部提交，需复核定价合理性及配售对象合规性", type: "review", time: "09:30" },
  { id: 2, title: "合同录入异常检测（3份）", desc: "系统自动识别出3份合同关键条款与模板存在偏差", type: "exception", time: "10:15" },
  { id: 3, title: "芯原半导体IPO材料补录催办", desc: "财务流水凭证及核心供应商访谈记录待补充", type: "todo", time: "11:00" },
  { id: 4, title: "蓝海企业授信报告风控退回", desc: "需补充目标企业所在行业最新周期分析数据", type: "urgent", time: "14:00" },
  { id: 5, title: "中银金租新能源研究服务路演安排", desc: "需协调研究所新能源领域研究员准备路演材料", type: "review", time: "15:30" },
]

const typeLabels: Record<string, string> = {
  review: "待复核",
  exception: "异常",
  todo: "待办",
  urgent: "紧急",
}

const typeColors: Record<string, string> = {
  review: "#C9A96E",
  exception: "#EF4444",
  todo: "#3B82F6",
  urgent: "#EF4444",
}

interface Message {
  role: "user" | "assistant"
  content: string
  agentName?: string
}

// ── AI 人设回复生成器 ──

function buildDefaultGreeting(): string {
  return `早上好。

今天共 **5 项** 任务需要关注，其中 **1 项标注为紧急**。建议上午先把最紧迫的解决掉，下午节奏会从容很多。

**需要紧急救火**
蓝海企业授信报告被风控退回了，下午前要补上行业周期分析数据。优先级最高，建议第一个处理。

**需要复核把关**
茅台定增方案和中银金租路演材料都涉及对外输出质量，需要你今天过一遍确认。

**系统异常排查**
有 3 份合同的关键条款被系统标记出与模板存在偏差，可能需要你人工判断一下。

**日常催办**
芯原半导体 IPO 材料补录还在等财务流水和访谈记录，适时催一下进度就好。

👉 处理蓝海企业授信报告
👉 复核贵州茅台定增方案
👉 查看那 3 份异常合同`
}

function buildTaskReply(task: TaskItem): string {
  const replies: Record<number, string> = {
    1: `好的，帮你梳理茅台定增方案。

核心关注两点：一是发行底价与近期均价的偏离度需控制在 20% 以内，二是配售对象名单要逐项核查关联方回避情况。

方案材料我这边都有，需要我逐一比对条款吗？

👉 检查定价偏离度
👉 核查配售对象名单
👉 生成复核报告初稿`,

    2: `这 3 份异常合同我调出来了。

系统标记的偏差主要集中在：违约责任条款、争议解决方式和保密义务范围。其中 1 份偏差较大，建议优先复核。

需要我按风险程度排序后逐一推送给你吗？

👉 先看偏差最大的那份
👉 批量标记为已知风险
👉 查看条款对比详情`,

    3: `芯原半导体这边，IPO 补录还差两块硬骨头。

财务流水凭证需要对方财务总监签字确认，供应商访谈记录那边也需要再跟进一次。已经在系统里发了催办提醒。

想让我再发一封正式催办函吗？

👉 发送正式催办函
👉 查看补录进度详情
👉 标记为本周跟踪`,

    4: `蓝海企业这个确实急。风控退回的核心原因是行业周期分析数据不足，最近行业报告我帮你扫描了一下，有几份最新的可以参考。

建议先补充数据再重新提交，避免反复打回。

👉 查看最新行业报告
👉 补充数据后重新提交
👉 联系风控沟通细节`,

    5: `中银金租的路演安排已经在协调了。

新能源领域的对口研究员有 3 位可选，其中刘博下周在上海正好有时间，建议优先安排。路演大纲我让助理先拟一版？

👉 确认刘博时间并排期
👉 查看路演大纲模板
👉 了解中银金租背景资料`,
  }
  return replies[task.id] || `收到，正在为您处理「${task.title}」。\n\n${task.desc}\n\n需要我帮您做什么？`
}

function buildAgentReply(name: string, hasBadge: boolean, agentTasks: TaskItem[]): string {
  if (!hasBadge) {
    return `这个时段「${name}」这边没有待办任务，整体情况平稳。

需要我帮你看看其他方向，还是进去逛逛？

👉 看看其他智能体
👉 进入${name}`
  }

  const taskLines = agentTasks.map((t) => `• **${t.title}** — ${t.desc.slice(0, 30)}…`).join("\n")

  return `「${name}」这边整理了 **${agentTasks.length} 项**待跟进：

${taskLines}

在这里快速处理，还是进入${name}深度办理？

👉 留在这里快速处理
👉 进入${name}`
}

function buildGeneralReply(userInput: string): string {
  return `收到。正在根据「${userInput.length > 15 ? userInput.slice(0, 15) + "…" : userInput}」检索相关信息。

有想优先了解的方向吗？

👉 查看今日任务概览
👉 看看哪个条线进展最快`
}

export function SupportPage() {
  const { agentClickPayload, clearAgentClick, openChat } = useChatContext()
  const [dismissed, setDismissed] = useState<Set<number>>(new Set())
  const [input, setInput] = useState("")
  const [messages, setMessages] = useState<Message[]>([
    { role: "assistant", content: buildDefaultGreeting() },
  ])
  const bottomRef = useRef<HTMLDivElement>(null)
  const visibleTasks = todayTasks.filter((t) => !dismissed.has(t.id))

  const scrollToBottom = () => {
    setTimeout(() => bottomRef.current?.scrollIntoView({ behavior: "smooth" }), 100)
  }

  // 监听智能体头像点击
  useEffect(() => {
    if (!agentClickPayload || agentClickPayload.tab !== "support") return

    const { name, hasBadge } = agentClickPayload
    clearAgentClick()

    const agentTasks = hasBadge
      ? visibleTasks.filter((_, idx) => (name === "投行支持中心" ? idx < 2 : idx >= 2 && idx < 5))
      : []

    const reply = buildAgentReply(name, hasBadge, agentTasks)
    setMessages((prev) => [...prev, { role: "assistant", content: reply, agentName: name }])
    scrollToBottom()
  }, [agentClickPayload, clearAgentClick, visibleTasks])

  const handleTaskClick = (task: TaskItem) => {
    setMessages((prev) => [
      ...prev,
      { role: "user", content: task.title },
    ])
    setTimeout(() => {
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: buildTaskReply(task) },
      ])
      scrollToBottom()
    }, 350)
  }

  const handleDismissTask = (taskId: number) => {
    setDismissed((prev) => new Set([...prev, taskId]))
  }

  const handleSend = () => {
    if (!input.trim()) return
    const text = input.trim()
    setInput("")
    setMessages((prev) => [...prev, { role: "user", content: text }])
    setTimeout(() => {
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: buildGeneralReply(text) },
      ])
      scrollToBottom()
    }, 400)
  }

  // 智能体跳转
  const handleJumpToAgent = (agentName: string) => {
    const agentImages = [
      "/aiworkspace/images/Avatar1.png",
      "/aiworkspace/images/Avatar2.png",
      "/aiworkspace/images/Avatar3.png",
      "/aiworkspace/images/Avatar4.png",
      "/aiworkspace/images/Avatar5.png",
      "/aiworkspace/images/Avatar6.png",
      "/aiworkspace/images/Avatar7.png",
    ]
    const supportNames = [
      "投行支持中心", "资管支持中心", "零售支持中心",
      "投资支持中心", "销交支持中心", "机构支持中心", "交叉验证中心",
    ]
    const idx = supportNames.indexOf(agentName)
    if (idx >= 0) {
      openChat({ name: agentName, image: agentImages[idx] })
    }
  }

  // 渲染消息内容，支持 👉 快捷追问标签和 【】 操作按钮
  const renderMessageContent = (msg: Message) => {
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

    // 处理粗体 **text**
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

        {/* 【】兼容旧版操作按钮 */}
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
                    content: "好的，继续在当前页面。可以直接点击任务卡片或输入问题。",
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
                    content: "好的，就在这里处理。你可以直接点击下方的任务卡片查看详情，也可以输入问题让我帮你操作。",
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
          {/* 对话消息区 */}
          <div className="flex-1 overflow-y-auto bg-white px-5 pt-6 pb-2">
            {/* 消息列表 */}
            {messages.map((msg, i) => (
              <div key={i} className={`flex gap-2.5 mb-4 ${msg.role === "user" ? "flex-row-reverse" : ""}`}>
                {msg.role === "assistant" ? (
                  <div className="w-7 h-7 rounded-full bg-primary/10 flex items-center justify-center shrink-0 mt-0.5">
                    <Bot className="w-3.5 h-3.5 text-primary" />
                  </div>
                ) : (
                  <div className="w-7 h-7 rounded-full bg-primary/80 flex items-center justify-center text-white text-[10px] font-medium shrink-0">我</div>
                )}
                <div className={`max-w-[85%] rounded-2xl px-4 py-3 text-sm leading-relaxed ${
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

            {/* 任务列表（参考员工端样式） */}
            {visibleTasks.length > 0 ? (
              <div className="space-y-2 pl-11 mb-4">
                {visibleTasks.map((task, idx) => (
                  <button
                    key={task.id}
                    onClick={() => handleTaskClick(task)}
                    className="w-full text-left group"
                  >
                    <div
                      className="flex gap-2.5 items-start p-3 rounded-lg transition-all hover:shadow-md"
                      style={{
                        background: "linear-gradient(135deg, #FFF9F0 0%, #FFF5E6 100%)",
                        borderLeft: `3px solid ${typeColors[task.type]}`,
                      }}
                    >
                      <span
                        className="shrink-0 w-5 h-5 rounded-full flex items-center justify-center text-white text-[11px] font-semibold mt-0.5"
                        style={{ background: "linear-gradient(135deg, #C9A96E 0%, #E8D4A8 50%, #C9A96E 100%)" }}
                      >
                        {idx + 1}
                      </span>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-0.5">
                          <span className="text-sm font-medium text-zinc-800">{task.title}</span>
                          <span
                            className="text-[10px] px-1.5 py-0.5 rounded-full text-white font-medium"
                            style={{ backgroundColor: typeColors[task.type] }}
                          >
                            {typeLabels[task.type]}
                          </span>
                        </div>
                        <p className="text-xs text-zinc-500 leading-relaxed">{task.desc}</p>
                      </div>
                      <div className="flex items-center gap-1.5 shrink-0 mt-0.5">
                        <span className="text-[10px] text-zinc-400">{task.time}</span>
                        <button
                          onClick={(e) => {
                            e.stopPropagation()
                            handleDismissTask(task.id)
                          }}
                          className="w-6 h-6 rounded-full flex items-center justify-center text-zinc-300 hover:text-green-500 hover:bg-green-50 transition-all opacity-0 group-hover:opacity-100"
                        >
                          <CheckCircle2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            ) : (
              <div className="pl-11 text-center py-12">
                <CheckCircle2 className="w-10 h-10 text-zinc-300 mx-auto mb-3" />
                <p className="text-sm text-zinc-400">今日任务已全部处理完毕</p>
              </div>
            )}
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
