import { useState } from "react"
import { Send, Sparkles } from "lucide-react"
import { useChatContext } from "@/App"

export function AIChatInput() {
  const [value, setValue] = useState("")
  const { openChat } = useChatContext()

  const handleSend = () => {
    const msg = value.trim()
    if (!msg) return
    openChat({ name: "智能助手", image: "/images/agent-strategy.png" }, msg)
    setValue("")
  }

  return (
    <div className="fixed bottom-0 left-0 right-0 z-30 bg-gradient-to-t from-background via-background to-transparent pt-6 pb-5 px-6 lg:px-8">
      <div className="max-w-[1200px] mx-auto">
        <div className="flex items-center gap-4 bg-card border border-border rounded-2xl px-5 py-3.5 shadow-elevated transition-shadow focus-within:shadow-glow focus-within:border-primary/40">
          <Sparkles className="w-5 h-5 text-primary shrink-0" />
          <input
            type="text"
            value={value}
            onChange={(e) => setValue(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSend()}
            placeholder="开启我的一人团队工作台"
            className="flex-1 bg-transparent text-sm text-foreground placeholder:text-muted-foreground outline-none"
          />
          <button
            onClick={handleSend}
            disabled={!value.trim()}
            className="w-9 h-9 rounded-xl bg-primary text-primary-foreground flex items-center justify-center disabled:opacity-30 hover:bg-primary/90 transition-all shrink-0"
          >
            <Send className="w-4 h-4" />
          </button>
        </div>
        <p className="text-center text-[11px] text-muted-foreground/60 mt-2">
          AI 助手基于内部数据提供参考，重要决策请以实际数据为准
        </p>
      </div>
    </div>
  )
}
