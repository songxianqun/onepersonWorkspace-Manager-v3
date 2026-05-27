import { useState } from "react"
import { Send, Sparkles, X } from "lucide-react"

interface Props {
  placeholder?: string
  agentName?: string
  /** 传入后会在面板头部显示角色标识 */
  context?: "support" | "collab"
}

export function PageChatBar({ placeholder, agentName: _agentName = "智能助手", context: _context = "support" }: Props) {
  const [input, setInput] = useState("")

  const handleSend = () => {
    const msg = input.trim()
    if (!msg) return
    setInput("")
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
