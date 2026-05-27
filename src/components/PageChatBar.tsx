import { useState, useRef, useEffect } from "react"
import { Send, Sparkles, X, ChevronDown, Bot } from "lucide-react"
import { cn } from "@/lib/utils"

interface Message {
  id: number
  role: "user" | "assistant"
  content: string
  time: string
}

const mockReplies: [string, string][] = [
  ["请示", "【请示事项摘要】\n当前共有 8 项待审批，其中 2 项即将超期。建议优先处理「增设华东分中心」审批请示。\n\n需要我逐项展示详情或直接起草批复意见吗？"],
  ["风险", "【风险提示】\n当前 3 项高风险：反洗钱可疑交易、适当性管理不符、离职员工权限未清理。\n\n建议今日安排合规部汇报第一项，其余两项可下发整改通知。"],
  ["经营", "【经营看板】\n本月总营收 ¥5,800万（+12.3%），Q2 目标完成率 78.5%（-2.1%）。\n\n西南分中心进度滞后是主因，建议安排专项督导。"],
  ["协同", "【协同事项】\n当前有 3 项高优议题需要您关注：资管投行客户冲突、算力资源申请、零售数据权限。\n\n需要我帮您起草协调意见或发起圆桌讨论吗？"],
  ["事项", "【待处理事项】\n当前支持中心队列中有 8 项待处理事项，其中 3 项紧急、5 项普通。\n\nAI 已完成预处理，建议您优先处理资管条线的债券投资方案复核。"],
  ["提请", "好的，我来帮您起草提请协同申请。请确认以下信息：\n\n1. 议题主题\n2. 涉及部门\n3. 需要协调的资源或决策\n\n您可以直接告诉我，我将生成结构化的协同申请单。"],
  ["分析", "正在分析相关数据……\n\n基于当前指标，建议关注以下三个核心维度：资产负债情况、现金流情况、当前资产配置情况。详细分析报告正在生成中。"],
]

function getReply(msg: string): string {
  for (const [kw, reply] of mockReplies) {
    if (msg.includes(kw)) return reply
  }
  return "收到您的问题，我正在基于当前业务数据进行分析。请稍候，或者您可以告诉我更具体的需求方向。"
}

function now() {
  return new Date().toLocaleTimeString("zh-CN", { hour: "2-digit", minute: "2-digit" })
}

interface Props {
  placeholder?: string
  agentName?: string
  /** 传入后会在面板头部显示角色标识 */
  context?: "support" | "collab"
}

export function PageChatBar({ placeholder, agentName = "智能助手", context = "support" }: Props) {
  const [input, setInput] = useState("")
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 1,
      role: "assistant",
      content:
        context === "support"
          ? "您好，我是业务支持助手。您可以向我提问当前事项详情、请我帮您起草处理意见，或提请协同申请。"
          : "您好，我是决策分析助手。您可以向我查询经营数据、风险摘要，或请我帮您起草协同议题和决策意见。",
      time: now(),
    },
  ])
  const nextId = useRef(2)
  const bottomRef = useRef<HTMLDivElement>(null)

  // 向外暴露的方法：让 SupportPage/CollabPage 可以追加消息
  const addMessage = (role: "user" | "assistant", content: string) => {
    const id = nextId.current++
    setMessages((prev) => [...prev, { id, role, content, time: now() }])
    setTimeout(() => {
      bottomRef.current?.scrollIntoView({ behavior: "smooth" })
    }, 50)
  }

  PageChatBar.addMessage = addMessage

  const handleSend = () => {
    const msg = input.trim()
    if (!msg) return
    setInput("")
    const uid = nextId.current++
    setMessages((prev) => [...prev, { id: uid, role: "user", content: msg, time: now() }])
    setTimeout(() => {
      const aid = nextId.current++
      setMessages((prev) => [...prev, { id: aid, role: "assistant", content: getReply(msg), time: now() }])
    }, 500)
    setTimeout(() => {
      bottomRef.current?.scrollIntoView({ behavior: "smooth" })
    }, 50)
  }

  return (
    <>
      {/* 底部输入栏 - 简洁悬浮 */}
      <div className="fixed bottom-0 left-0 right-0 z-50 bg-gradient-to-t from-background via-background/95 to-transparent pt-6 pb-5 px-6 lg:px-8">
        <div className="max-w-[1200px] mx-auto">
          <div className="flex items-center gap-3 bg-white/80 backdrop-blur-xl border border-border/60 rounded-full px-4 py-2.5 shadow-sm">
            <Sparkles className="w-4 h-4 text-primary/60 shrink-0" />
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSend()}
              placeholder={placeholder || "向 AI 助手提问，或输入处理指令…"}
              className="flex-1 bg-transparent text-sm text-foreground placeholder:text-muted-foreground/60 outline-none"
            />
            {input && (
              <button
                onClick={() => setInput("")}
                className="w-5 h-5 rounded-full flex items-center justify-center text-muted-foreground hover:text-foreground transition-colors"
              >
                <X className="w-3 h-3" />
              </button>
            )}
            <button
              onClick={handleSend}
              disabled={!input.trim()}
              className="w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center disabled:opacity-30 hover:bg-primary/90 transition-all shrink-0 shadow-sm"
            >
              <Send className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </>
  )
}
