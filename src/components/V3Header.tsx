import { ChevronRight, LayoutDashboard, Headphones, CircleDot } from "lucide-react"
import { cn } from "@/lib/utils"
import { useChatContext } from "@/App"

export type V3Tab = "employee" | "support" | "collab"

interface Props {
  activeTab: V3Tab
  onTabChange: (tab: V3Tab) => void
}

const tabs: { key: V3Tab; label: string; icon: React.ElementType; dot?: boolean }[] = [
  { key: "employee", label: "员工端", icon: LayoutDashboard },
  { key: "support", label: "业务支持端", icon: Headphones, dot: true },
  { key: "collab", label: "协同端", icon: CircleDot, dot: true },
]

const agents = [
  { name: "投行业务助理", image: "/images/avatar-invest-banking.png" },
  { name: "资管业务助理", image: "/images/avatar-asset-mgmt.png" },
  { name: "零售业务助理", image: "/images/avatar-retail.png" },
  { name: "投资业务助理", image: "/images/avatar-investment.png" },
  { name: "销交业务助理", image: "/images/avatar-sales.png" },
  { name: "机构业务助理", image: "/images/avatar-institution.png" },
  { name: "交叉验证助理", image: "/images/avatar-crosscheck.png" },
]

export function V3Header({ activeTab, onTabChange }: Props) {
  const { openChat } = useChatContext()
  const hour = new Date().getHours()
  const greeting = hour < 12 ? "上午好" : hour < 18 ? "下午好" : "晚上好"

  const isEmployee = activeTab === "employee"

  return (
    <header
      className={cn(
        "border-b border-border bg-card shrink-0 transition-all duration-200",
        isEmployee ? "px-8 pt-5 pb-4" : "px-6 h-16 flex items-center gap-6"
      )}
    >
      {isEmployee ? (
        /* ── 员工端展开头部 ── */
        <>
          {/* 第一行：标题 + 问候 + Tab切换 */}
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-6">
              {/* Logo */}
              <div className="flex items-center gap-2.5">
                <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-primary to-primary/70 flex items-center justify-center shrink-0">
                  <span className="text-primary-foreground text-[10px] font-bold">V3</span>
                </div>
                <span className="text-lg font-bold text-foreground">员工工作台</span>
                <span className="text-xs px-2 py-0.5 rounded-full bg-success/12 text-success font-medium">在线</span>
              </div>
              {/* Tab 导航 */}
              <div className="flex items-center gap-1">
                {tabs.map((tab, i) => {
                  const Icon = tab.icon
                  const isActive = activeTab === tab.key
                  return (
                    <div key={tab.key} className="flex items-center">
                      <button
                        onClick={() => onTabChange(tab.key)}
                        className={cn(
                          "flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all duration-150 relative",
                          isActive
                            ? "bg-primary/10 text-primary"
                            : "text-muted-foreground hover:text-foreground hover:bg-muted"
                        )}
                      >
                        <Icon className="w-3.5 h-3.5" />
                        <span>{tab.label}</span>
                        {tab.dot && !isActive && (
                          <span className="absolute top-1 right-1 w-1.5 h-1.5 rounded-full bg-destructive" />
                        )}
                      </button>
                      {i < tabs.length - 1 && (
                        <ChevronRight className="w-3 h-3 text-border mx-0.5" />
                      )}
                    </div>
                  )
                })}
              </div>
            </div>
            {/* 右侧问候 + 用户 */}
            <div className="flex items-center gap-3">
              <span className="text-sm text-muted-foreground">
                {greeting}，张总 |{" "}
                {new Date().toLocaleDateString("zh-CN", {
                  month: "long",
                  day: "numeric",
                  weekday: "long",
                })}
              </span>
              <div className="flex items-center gap-1.5">
                <div className="w-7 h-7 rounded-full bg-primary/20 flex items-center justify-center">
                  <span className="text-xs font-bold text-primary">张</span>
                </div>
              </div>
            </div>
          </div>

          {/* 第二行：业务助理头像列 */}
          <div className="flex items-center gap-5 overflow-x-auto pb-1">
            {agents.map((agent) => (
              <button
                key={agent.name}
                onClick={() => openChat(agent)}
                className="flex flex-col items-center gap-1.5 group cursor-pointer shrink-0"
              >
                <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-border bg-card group-hover:border-primary/40 transition-all duration-300 group-hover:scale-105 shadow-card">
                  <img src={agent.image} alt={agent.name} className="w-full h-full object-cover" />
                </div>
                <span className="text-[11px] text-muted-foreground group-hover:text-primary transition-colors whitespace-nowrap">
                  {agent.name}
                </span>
              </button>
            ))}
          </div>
        </>
      ) : (
        /* ── 支持端/协同端紧凑头部 ── */
        <>
          {/* Logo */}
          <div className="flex items-center gap-2.5 shrink-0">
            <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-primary to-primary/70 flex items-center justify-center">
              <span className="text-primary-foreground text-[10px] font-bold">V3</span>
            </div>
            <div>
              <div className="text-sm font-bold text-foreground leading-none">智能体工作台</div>
              <div className="text-[10px] text-muted-foreground mt-0.5">三端协同版</div>
            </div>
          </div>

          <div className="h-5 w-px bg-border" />

          {/* Tab 导航 */}
          <div className="flex items-center gap-1">
            {tabs.map((tab, i) => {
              const Icon = tab.icon
              const isActive = activeTab === tab.key
              return (
                <div key={tab.key} className="flex items-center">
                  <button
                    onClick={() => onTabChange(tab.key)}
                    className={cn(
                      "flex items-center gap-2 px-4 py-2 rounded-lg text-sm transition-all duration-150 relative",
                      isActive
                        ? "bg-primary/10 text-primary font-semibold"
                        : "text-muted-foreground hover:text-foreground hover:bg-muted"
                    )}
                  >
                    <Icon className="w-4 h-4" />
                    <span>{tab.label}</span>
                    {tab.dot && !isActive && (
                      <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 rounded-full bg-destructive" />
                    )}
                  </button>
                  {i < tabs.length - 1 && (
                    <ChevronRight className="w-3.5 h-3.5 text-border mx-0.5" />
                  )}
                </div>
              )
            })}
          </div>

          {/* 右侧用户信息 */}
          <div className="ml-auto flex items-center gap-3">
            <div className="text-xs text-muted-foreground">
              {new Date().toLocaleDateString("zh-CN", {
                year: "numeric",
                month: "long",
                day: "numeric",
                weekday: "long",
              })}
            </div>
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-full bg-primary/20 flex items-center justify-center">
                <span className="text-xs font-bold text-primary">张</span>
              </div>
              <span className="text-sm text-foreground font-medium">张总</span>
            </div>
          </div>
        </>
      )}
    </header>
  )
}
