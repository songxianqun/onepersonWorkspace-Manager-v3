import { useState, useRef, createContext, useContext, useCallback, useEffect } from "react"
import { SupportPage } from "@/pages/SupportPage"
import { CollabPage } from "@/pages/CollabPage"
import { DesignSchemePage } from "@/pages/DesignSchemePage"
import { V3Header, type V3Tab } from "@/components/V3Header"

export interface AgentClickPayload {
  name: string
  image: string
  hasBadge: boolean
  badgeCount: number
  tab: V3Tab
}

export interface ChatContextType {
  isInChat: boolean
  agentName: string
  agentImage: string
  initialMessage: string
  openChat: (agent: { name: string; image: string }, message?: string) => void
  exitChat: () => void
  activeTab: V3Tab
  agentClickPayload: AgentClickPayload | null
  triggerAgentClick: (payload: AgentClickPayload) => void
  clearAgentClick: () => void
}

export const ChatContext = createContext<ChatContextType>({
  isInChat: false,
  agentName: "",
  agentImage: "",
  initialMessage: "",
  openChat: () => {},
  exitChat: () => {},
  activeTab: "employee",
  agentClickPayload: null,
  triggerAgentClick: () => {},
  clearAgentClick: () => {},
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
  const [agentClickPayload, setAgentClickPayload] = useState<AgentClickPayload | null>(null)
  const topRef = useRef<HTMLDivElement>(null)
  const chatRef = useRef<HTMLDivElement>(null)
  const iframeRef = useRef<HTMLIFrameElement>(null)

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

  const triggerAgentClick = useCallback((payload: AgentClickPayload) => {
    setAgentClickPayload(payload)
  }, [])

  const clearAgentClick = useCallback(() => {
    setAgentClickPayload(null)
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

  // 自动调整 iframe 高度以匹配内容，使滚动条出现在外层容器
  const syncIframeHeight = useCallback(() => {
    const iframe = iframeRef.current
    if (!iframe) return
    try {
      const doc = iframe.contentDocument || iframe.contentWindow?.document
      if (doc && doc.documentElement) {
        const scrollHeight = doc.documentElement.scrollHeight
        if (scrollHeight > 0) {
          iframe.style.height = scrollHeight + "px"
        }
      }
    } catch {
      // 跨域时忽略
    }
  }, [])

  const handleIframeLoad = useCallback(() => {
    // 首次用 rAF 确保 CSS 布局完成后再测量
    requestAnimationFrame(() => {
      syncIframeHeight()
    })

    // 多级延迟重试：应对图片/字体等资源导致的延迟渲染
    const delays = [100, 300, 800, 1500, 3000]
    const timers: ReturnType<typeof setTimeout>[] = []
    delays.forEach((ms) => {
      timers.push(setTimeout(syncIframeHeight, ms))
    })

    try {
      const doc = iframeRef.current?.contentDocument
      if (doc) {
        // MutationObserver 监听 DOM 变化
        const mutationObserver = new MutationObserver(() => {
          requestAnimationFrame(() => syncIframeHeight())
        })
        mutationObserver.observe(doc.body, { childList: true, subtree: true, attributes: true })

        // ResizeObserver 监听 body 尺寸变化（比 MutationObserver 更直接可靠）
        if (window.ResizeObserver) {
          const resizeObserver = new ResizeObserver(() => {
            requestAnimationFrame(() => syncIframeHeight())
          })
          resizeObserver.observe(doc.body)

          // 清理：iframe 重新加载时 observer 会重新创建，旧的在 doc 销毁后自动失效
        }
      }
    } catch {
      // 跨域时忽略
    }
  }, [syncIframeHeight])

  if (isPresentation) {
    return <DesignSchemePage />
  }

  return (
    <ChatContext.Provider value={{ ...chatState, openChat, exitChat, activeTab, agentClickPayload, triggerAgentClick, clearAgentClick }}>
      <div className="h-screen flex flex-col bg-background overflow-hidden">
        {/* 统一顶部导航 - 固定不滚动 */}
        <div style={{ paddingTop: "8px" }}>
          <V3Header activeTab={activeTab} onTabChange={handleTabChange} />
        </div>

        {/* 滚动容器 - 全宽，滚动条在页面边缘 */}
        <div className="flex-1 overflow-y-auto min-h-0" ref={topRef}>
          <div className="max-w-[1200px] mx-auto w-full" style={{ paddingBottom: "12px" }}>

            {/* 员工端：iframe 自动撑高 */}
            <div className={activeTab === "employee" ? "" : "hidden"}>
              <iframe
                ref={iframeRef}
                src="/aiworkspace/index.html"
                className="w-full border-0"
                style={{ background: "transparent", minHeight: "100px" }}
                title="员工端"
                onLoad={handleIframeLoad}
              />
            </div>

            {/* 业务支持端 */}
            <div className={`h-full relative ${activeTab === "support" ? "" : "hidden"}`} style={{ minHeight: "calc(100vh - 160px)" }}>
              <SupportPage />
            </div>

            {/* 协同端 */}
            <div className={`h-full relative ${activeTab === "collab" ? "" : "hidden"}`} style={{ minHeight: "calc(100vh - 160px)" }}>
              <CollabPage />
            </div>

          </div>
        </div>
      </div>
    </ChatContext.Provider>
  )
}

export default App
