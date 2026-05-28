import { useState, useRef } from "react"
import { Bot, Send, Sparkles, X } from "lucide-react"
import { useChatContext } from "@/App"

interface TaskItem {
  id: number
  title: string
  desc: string
  agent: string
}

const todayTasks: TaskItem[] = [
  { id: 1, title: "恒瑞医药再融资方案复核", desc: "核对募集资金用途与招股书一致性", agent: "投行业务助理" },
  { id: 2, title: "某芯片企业IPO辅导进展", desc: "整理辅导期问题整改清单", agent: "投行业务助理" },
  { id: 3, title: "债券型产品风险评级更新", desc: "根据最新底层资产调整风险等级", agent: "资管业务助理" },
  { id: 4, title: "半导体行业周报", desc: "汇总本周行业政策变化及龙头公司公告", agent: "投资支持中心" },
  { id: 5, title: "高净值客户资产配置方案", desc: "根据最新市场研判调整股债配比建议", agent: "零售支持中心" },
]

interface AgentInfo {
  name: string
  tag?: string
  avatarType?: "bot" | "task" | "default"
}

interface Message {
  role: "user" | "assistant"
  content: string
  agentName?: string
  agentInfo?: AgentInfo
  animate?: boolean
}

const TASK_BOT_INFO: AgentInfo = {
  name: "今日任务",
  tag: "智能机器人",
  avatarType: "task",
}

// ── AI 人设回复生成器 ──

function buildDefaultGreeting(): string {
  const groups: Record<string, TaskItem[]> = {}
  for (const task of todayTasks) {
    if (!groups[task.agent]) groups[task.agent] = []
    groups[task.agent].push(task)
  }

  let result = `您好！我是**今日任务**助手。以下是有待办事项的业务助理任务汇总：\n\n`

  for (const [agent, tasks] of Object.entries(groups)) {
    result += `**${agent}**（${tasks.length}项待办）\n`
    tasks.forEach((task, idx) => {
      result += `${idx + 1}. ${task.title}：${task.desc}\n`
    })
    result += `\n`
  }

  result += `您可在下方对话框输入具体待办内容进行处理，也可围绕任务摘要继续追问。`

  return result
}

function buildGeneralReply(userInput: string): string {
  return `收到。正在根据「${userInput.length > 15 ? userInput.slice(0, 15) + "…" : userInput}」检索相关信息。

有想优先了解的方向吗？

👉 查看今日任务概览
👉 看看哪个条线进展最快`
}

// ── 今日任务机器人头像 ──
function RobotAvatarSVG({ className = "" }: { className?: string }) {
  return (
    <img
      src="/images/robot-task-avatar.jpg"
      alt="今日任务机器人"
      className={`rounded-full shrink-0 object-cover ${className}`}
    />
  )
}

// ── 渲染助手头像 ──
function AgentAvatar({ agentInfo, className = "" }: { agentInfo?: AgentInfo; className?: string }) {
  if (agentInfo?.avatarType === "task") {
    return <RobotAvatarSVG className={className} />
  }
  return (
    <div className={`rounded-full bg-primary/10 flex items-center justify-center shrink-0 ${className}`}>
      <Bot className="w-3.5 h-3.5 text-primary" />
    </div>
  )
}

// ── 渲染助手名称标签 ──
function AgentNameTag({ agentInfo }: { agentInfo?: AgentInfo }) {
  if (!agentInfo) return null
  return (
    <div className="flex items-center gap-1.5 mb-1.5">
      <span className="text-xs font-semibold text-zinc-700">{agentInfo.name}</span>
      {agentInfo.tag && (
        <span
          className="text-[10px] px-1.5 py-0.5 rounded-full text-white font-medium"
          style={{ backgroundColor: "#C9A96E" }}
        >
          {agentInfo.tag}
        </span>
      )}
    </div>
  )
}

export function SupportPage() {
  const { openChat } = useChatContext()
  const [input, setInput] = useState("")
  const [messages, setMessages] = useState<Message[]>([
    { role: "assistant", content: buildDefaultGreeting(), agentInfo: TASK_BOT_INFO },
  ])
  const bottomRef = useRef<HTMLDivElement>(null)

  const scrollToBottom = () => {
    setTimeout(() => bottomRef.current?.scrollIntoView({ behavior: "smooth" }), 100)
  }

  const handleSend = () => {
    if (!input.trim()) return
    const text = input.trim()
    setInput("")
    setMessages((prev) => [...prev, { role: "user", content: text, animate: true }])
    setTimeout(() => {
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: buildGeneralReply(text), animate: true },
      ])
      scrollToBottom()
    }, 400)
  }

  // 重新发送今日任务消息
  const handleResendTaskSummary = () => {
    setMessages((prev) => [
      ...prev,
      { role: "assistant", content: buildDefaultGreeting(), agentInfo: TASK_BOT_INFO, animate: true },
    ])
    scrollToBottom()
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
                    animate: true,
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
                    animate: true,
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

  // 是否显示顶部今日任务入口（当有除默认消息外的其他消息时）
  const showTaskBotEntry = messages.length > 1

  return (
    <div className="h-full flex flex-col pt-6 px-0">
      <div className="flex-1 flex flex-col bg-white ring-1 ring-zinc-100/60 rounded-2xl overflow-hidden min-h-0">
        {/* 对话消息区 - 唯一滚动区域 */}
        <div className="flex-1 overflow-y-auto bg-white px-5 pt-6 pb-2 relative min-h-0">
            {/* 顶部固定今日任务入口 */}
            {showTaskBotEntry && (
              <div className="sticky top-0 z-10 mb-4 animate-slide-down">
                <button
                  onClick={handleResendTaskSummary}
                  className="w-full flex items-center gap-3 px-4 py-3 rounded-xl border border-amber-200 bg-gradient-to-r from-amber-50 to-orange-50 hover:from-amber-100 hover:to-orange-100 transition-all duration-300 hover:shadow-md group"
                >
                  <RobotAvatarSVG className="w-8 h-8" />
                  <div className="flex-1 text-left">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-semibold text-zinc-800">今日任务</span>
                      <span
                        className="text-[10px] px-1.5 py-0.5 rounded-full text-white font-medium"
                        style={{ backgroundColor: "#C9A96E" }}
                      >
                        智能机器人
                      </span>
                    </div>
                    <p className="text-xs text-zinc-500 mt-0.5">点击查看今日 5 项待办任务摘要</p>
                  </div>
                  <div className="w-7 h-7 rounded-full flex items-center justify-center bg-white/80 text-amber-600 group-hover:bg-white group-hover:scale-110 transition-all">
                    <Sparkles className="w-3.5 h-3.5" />
                  </div>
                </button>
              </div>
            )}

            {/* 消息列表 */}
            {messages.map((msg, i) => (
              <div
                key={i}
                className={`flex gap-2.5 mb-4 ${msg.role === "user" ? "flex-row-reverse" : ""} ${msg.animate ? "animate-fade-in-up" : ""}`}
              >
                {msg.role === "assistant" ? (
                  <AgentAvatar agentInfo={msg.agentInfo} className="w-7 h-7" />
                ) : (
                  <div className="w-7 h-7 rounded-full bg-primary/80 flex items-center justify-center text-white text-[10px] font-medium shrink-0">我</div>
                )}
                {msg.role === "assistant" && msg.agentInfo ? (
                  <div className="flex-1 min-w-0">
                    <AgentNameTag agentInfo={msg.agentInfo} />
                    <div className="max-w-[85%] rounded-2xl px-4 py-3 text-sm leading-relaxed bg-zinc-100 text-zinc-800 rounded-tl-sm">
                      {renderMessageContent(msg)}
                    </div>
                  </div>
                ) : (
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
                )}
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
  )
}
