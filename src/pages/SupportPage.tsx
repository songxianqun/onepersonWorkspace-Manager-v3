import { useRef, useState } from "react"
import { ChevronDown, Mic, Paperclip, Send } from "lucide-react"

interface TaskItem {
  id: number
  title: string
  desc: string
  agent: string
}

interface Message {
  role: "user" | "assistant"
  content: string
  animate?: boolean
}

const todayTasks: TaskItem[] = [
  { id: 1, title: "恒瑞医药再融资方案复核", desc: "核对募集资金用途与招股书一致性", agent: "投行业务助理" },
  { id: 2, title: "某芯片企业IPO辅导进展", desc: "整理辅导期问题整改清单", agent: "投行业务助理" },
  { id: 3, title: "债券型产品风险评级更新", desc: "根据最新底层资产调整风险等级", agent: "资管业务助理" },
  { id: 4, title: "半导体行业周报", desc: "汇总本周行业政策变化及龙头公司公告", agent: "投资支持中心" },
  { id: 5, title: "高净值客户资产配置方案", desc: "根据最新市场研判调整股债配比建议", agent: "零售支持中心" },
]

function groupTasksByAgent() {
  const groups: Record<string, TaskItem[]> = {}
  for (const task of todayTasks) {
    if (!groups[task.agent]) groups[task.agent] = []
    groups[task.agent].push(task)
  }
  return groups
}

function buildGeneralReply(userInput: string): string {
  return `收到。正在根据「${userInput.length > 15 ? userInput.slice(0, 15) + "…" : userInput}」检索相关信息。

有想优先了解的方向吗？

👉 查看今日任务概览
👉 看看哪个条线进展最快`
}

function buildTaskDetailReply(task: TaskItem): string {
  return `正在查看「${task.title}」的进一步信息。

业务归属：${task.agent}
待办事项：${task.desc}

建议先核对任务背景、责任人、资料缺口和下一步动作。如需继续处理，可以直接输入“生成处理方案”或“列出所需材料”。`
}

function RobotAvatar({ className = "" }: { className?: string }) {
  return (
    <img
      src="/images/robot-task-avatar.jpg"
      alt="今日任务机器人"
      className={`rounded-full shrink-0 object-cover ${className}`}
    />
  )
}

function renderText(text: string) {
  const parts = text.split(/(\*\*[^*]+\*\*)/g)
  return parts.map((part, i) => {
    if (part.startsWith("**") && part.endsWith("**")) {
      return <strong key={i} className="font-semibold text-zinc-900">{part.slice(2, -2)}</strong>
    }
    return part
  })
}

function TaskDock({
  isOpen,
  onToggle,
  onSelectTask,
}: {
  isOpen: boolean
  onToggle: () => void
  onSelectTask: (task: TaskItem) => void
}) {
  const groups = groupTasksByAgent()

  return (
    <div className="shrink-0 bg-white px-5 pb-3 pt-4">
      <button
        type="button"
        onClick={onToggle}
        className="w-full flex items-center gap-3 rounded-xl border border-amber-100 bg-amber-50/55 px-4 py-3 text-left transition-all hover:border-amber-200 hover:bg-amber-50"
      >
        <RobotAvatar className="h-8 w-8" />
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2">
            <span className="text-sm font-semibold text-zinc-800">今日任务</span>
            <span className="rounded-full bg-amber-50 px-1.5 py-0.5 text-[10px] font-medium text-amber-700 ring-1 ring-amber-100">
              智能机器人
            </span>
          </div>
          <p className="mt-0.5 text-xs text-zinc-500">
            点击{isOpen ? "收起" : "查看"}今日 {todayTasks.length} 项待办任务摘要
          </p>
        </div>
        <span className="flex h-7 w-7 items-center justify-center rounded-full bg-white text-amber-600">
          <ChevronDown className={`h-4 w-4 transition-transform ${isOpen ? "rotate-180" : ""}`} />
        </span>
      </button>

      {isOpen && (
        <div className="mt-2 max-h-[260px] overflow-y-auto rounded-xl border border-zinc-100 bg-white px-4 py-3 shadow-[0_10px_24px_rgba(15,23,42,0.06)]">
          <div className="space-y-3">
            {Object.entries(groups).map(([agent, tasks]) => (
              <section key={agent}>
                <h3 className="mb-1.5 text-xs font-semibold text-zinc-500">
                  {agent} <span className="font-normal text-zinc-600">（{tasks.length}项待办）</span>
                </h3>
                <div className="divide-y divide-zinc-100">
                  {tasks.map((task, index) => (
                    <button
                      key={task.id}
                      type="button"
                      onClick={() => onSelectTask(task)}
                      className="group flex w-full items-center gap-2 py-2 text-left"
                    >
                      <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-amber-50 text-xs font-semibold text-amber-700">
                        {index + 1}
                      </span>
                      <span className="min-w-0 flex-1">
                        <span className="block truncate text-sm font-medium text-zinc-900 group-hover:text-amber-700">
                          {task.title}
                        </span>
                        <span className="mt-0.5 block truncate text-xs text-zinc-500">{task.desc}</span>
                      </span>
                    </button>
                  ))}
                </div>
              </section>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

export function SupportPage() {
  const [input, setInput] = useState("")
  const [isTaskDockOpen, setIsTaskDockOpen] = useState(false)
  const [messages, setMessages] = useState<Message[]>([
    { role: "assistant", content: "您好！我是今日任务助手。可点击上方今日任务查看待办摘要，也可以直接在下方输入问题。" },
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

  const handleTaskClick = (task: TaskItem) => {
    const text = `${task.title}：${task.desc}`
    setIsTaskDockOpen(false)
    setMessages((prev) => [
      ...prev,
      { role: "user", content: text, animate: true },
      { role: "assistant", content: buildTaskDetailReply(task), animate: true },
    ])
    scrollToBottom()
  }

  return (
    <div className="h-full min-h-0 flex flex-col pt-4 px-0">
      <div className="flex-1 flex flex-col bg-white ring-1 ring-zinc-100/60 rounded-2xl overflow-hidden min-h-0">
        <TaskDock
          isOpen={isTaskDockOpen}
          onToggle={() => setIsTaskDockOpen((current) => !current)}
          onSelectTask={handleTaskClick}
        />

        <div className="flex-1 overflow-y-auto bg-white px-5 pt-6 pb-2 relative min-h-0">
          {messages.map((msg, i) => (
            <div
              key={i}
              className={`flex gap-2.5 mb-4 ${msg.role === "user" ? "flex-row-reverse" : ""} ${msg.animate ? "animate-fade-in-up" : ""}`}
            >
              {msg.role === "assistant" ? (
                <RobotAvatar className="w-7 h-7" />
              ) : (
                <div className="w-7 h-7 rounded-full bg-primary/80 flex items-center justify-center text-white text-[10px] font-medium shrink-0">我</div>
              )}
              {msg.role === "assistant" ? (
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-1.5 mb-1.5">
                    <span className="text-xs font-semibold text-zinc-700">今日任务</span>
                    <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-amber-50 text-amber-700 font-medium ring-1 ring-amber-100">
                      智能机器人
                    </span>
                  </div>
                  <div className="max-w-[85%] rounded-2xl px-4 py-3 text-sm leading-relaxed bg-zinc-100 text-zinc-800 rounded-tl-sm whitespace-pre-wrap">
                    {renderText(msg.content)}
                  </div>
                </div>
              ) : (
                <div className="max-w-[85%] rounded-2xl px-4 py-3 text-sm leading-relaxed bg-primary/85 text-white rounded-br-sm">
                  {msg.content}
                </div>
              )}
            </div>
          ))}

          <div ref={bottomRef} />
        </div>

        <div className="bg-white px-5 pb-4 pt-2 shrink-0">
          <div className="flex min-h-12 items-center gap-2 rounded-2xl border border-zinc-200 bg-white px-3 py-2 shadow-[0_8px_28px_rgba(15,23,42,0.06)] transition-colors focus-within:border-primary/35">
            <button
              type="button"
              className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl text-zinc-500 transition-colors hover:bg-zinc-50 hover:text-zinc-800"
              aria-label="添加附件"
            >
              <Paperclip className="h-4 w-4" />
            </button>
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSend()}
              placeholder="输入问题，或点击上方快捷追问"
              className="h-8 min-w-0 flex-1 bg-transparent text-sm text-zinc-800 outline-none placeholder:text-zinc-300"
            />
            <button
              type="button"
              className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl text-zinc-500 transition-colors hover:bg-zinc-50 hover:text-zinc-800"
              aria-label="语音输入"
            >
              <Mic className="h-4 w-4" />
            </button>
            <button
              onClick={handleSend}
              disabled={!input.trim()}
              className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full transition-all ${
                input.trim()
                  ? "bg-primary text-white shadow-sm hover:bg-primary/90"
                  : "bg-zinc-200 text-white cursor-not-allowed"
              }`}
              aria-label="发送"
            >
              <Send className="h-3.5 w-3.5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
