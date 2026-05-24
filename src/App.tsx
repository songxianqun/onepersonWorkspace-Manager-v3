import { useState, useRef, createContext, useContext, useCallback, useEffect } from "react"
import { WorkTips } from "@/components/WorkTips"
import { AIAssistants } from "@/components/AIAssistants"
import { PerformancePanel } from "@/components/PerformancePanel"
import { AIChatInline } from "@/components/AIChatInline"
import { AIChatInput } from "@/components/AIChatInput"
import { V3Header, type V3Tab } from "@/components/V3Header"
import { SupportPage } from "@/pages/SupportPage"
import { CollabPage } from "@/pages/CollabPage"
import { DesignSchemePage } from "@/pages/DesignSchemePage"
// import { ArrowUp } from "lucide-react"

interface ChatContextType {
  isInChat: boolean
  agentName: string
  agentImage: string
  initialMessage: string
  openChat: (agent: { name: string; image: string }, message?: string) => void
  exitChat: () => void
}

export const ChatContext = createContext<ChatContextType>({
  isInChat: false,
  agentName: "",
  agentImage: "",
  initialMessage: "",
  openChat: () => {},
  exitChat: () => {},
})

export function useChatContext() {
  return useContext(ChatContext)
}

function App() {
  const [activeTab, setActiveTab] = useState<V3Tab>(() => {
    const params = new URLSearchParams(window.location.search)
    const tabParam = params.get("tab") as V3Tab | null
    return tabParam && ["employee", "support", "collab"].includes(tabParam)
      ? tabParam
      : "employee"
  })
  const [chatState, setChatState] = useState({
    isInChat: false,
    agentName: "",
    agentImage: "",
    initialMessage: "",
  })
  const topRef = useRef<HTMLDivElement>(null)
  const chatRef = useRef<HTMLDivElement>(null)

  const isPresentation = new URLSearchParams(window.location.search).get("page") === "presentation"

  const openChat = useCallback(
    (agent: { name: string; image: string }, message?: string) => {
      setChatState({
        isInChat: true,
        agentName: agent.name,
        agentImage: agent.image,
        initialMessage: message || "",
      })
      setTimeout(() => {
        chatRef.current?.scrollIntoView({ behavior: "smooth" })
      }, 100)
    },
    []
  )

  const exitChat = useCallback(() => {
    setChatState((s) => ({ ...s, isInChat: false }))
    setTimeout(() => {
      topRef.current?.scrollIntoView({ behavior: "smooth" })
    }, 50)
  }, [])

  const handleTabChange = (tab: V3Tab) => {
    setActiveTab(tab)
    const url = new URL(window.location.href)
    url.searchParams.set("tab", tab)
    window.history.replaceState({ tab }, "", url.toString())
    // 切换 tab 时退出对话状态
    if (tab !== "employee") {
      setChatState((s) => ({ ...s, isInChat: false }))
    }
  }

  useEffect(() => {
    const handlePopState = () => {
      const params = new URLSearchParams(window.location.search)
      const tabParam = params.get("tab") as V3Tab | null
      if (tabParam && ["employee", "support", "collab"].includes(tabParam)) {
        setActiveTab(tabParam)
      }
    }
    window.addEventListener("popstate", handlePopState)
    return () => window.removeEventListener("popstate", handlePopState)
  }, [])

  if (isPresentation) {
    return <DesignSchemePage />
  }

  return (
    <ChatContext.Provider value={{ ...chatState, openChat, exitChat }}>
      <div className="h-screen flex flex-col bg-background overflow-hidden">
        {/* 统一顶部导航 */}
        <V3Header activeTab={activeTab} onTabChange={handleTabChange} />

        {/* 内容区：三端共用同一个 flex-1 容器，通过 hidden 切换，避免高度重排 */}
        <div className="flex-1 overflow-hidden relative min-h-0">

          {/* 员工端 */}
          <div className={`absolute inset-0 ${activeTab === "employee" ? "" : "hidden"}`} ref={topRef}>
            <div className={chatState.isInChat ? "hidden" : "h-full overflow-y-auto"}>
              <WorkTips />
              <PerformancePanel />
              <AIAssistants />
              <AIChatInput />
            </div>

            {chatState.isInChat && (
              <div className="h-full overflow-y-auto" ref={chatRef}>
                <AIChatInline />
              </div>
            )}

            
          </div>

          {/* 业务支持端 */}
          <div className={`absolute inset-0 ${activeTab === "support" ? "" : "hidden"}`}>
            <SupportPage />
          </div>

          {/* 协同端 */}
          <div className={`absolute inset-0 ${activeTab === "collab" ? "" : "hidden"}`}>
            <CollabPage />
          </div>

        </div>
      </div>
    </ChatContext.Provider>
  )
}

export default App
