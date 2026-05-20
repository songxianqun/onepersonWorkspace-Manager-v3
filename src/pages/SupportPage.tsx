import { useState } from "react"
import {
  AlertCircle,
  Clock,
  Eye,
  CheckCircle2,
  ChevronRight,
  Bell,
  Filter,
  LayoutGrid,
  Bot,
  ChevronLeft,
} from "lucide-react"
import { workItems, type WorkItem, type Priority } from "@/data/supportData"
import { ItemDetailPanel } from "@/components/support/ItemDetailPanel"
import { PageChatBar } from "@/components/PageChatBar"
import { cn } from "@/lib/utils"
import { useChatContext } from "@/App"

// ─── 各部门智能体入口（与员工端保持一致） ─────────────────
const supportAgents = [
  { name: "投行业务助理", image: "/images/avatar-invest-banking.png" },
  { name: "资管业务助理", image: "/images/avatar-asset-mgmt.png" },
  { name: "零售业务助理", image: "/images/avatar-retail.png" },
  { name: "投资业务助理", image: "/images/avatar-investment.png" },
  { name: "销交业务助理", image: "/images/avatar-sales.png" },
  { name: "机构业务助理", image: "/images/avatar-institution.png" },
  { name: "交叉验证助理", image: "/images/avatar-crosscheck.png" },
]

// ─── 队列分组 ──────────────────────────────────────────
const queueGroups = [
  { key: "all", label: "全部事项", shortLabel: "全部", color: "text-foreground", dotColor: "bg-foreground/40" },
  { key: "资管", label: "资管支持中心", shortLabel: "资管", color: "text-orange-500", dotColor: "bg-orange-500" },
  { key: "投行", label: "投行支持中心", shortLabel: "投行", color: "text-blue-500", dotColor: "bg-blue-500" },
  { key: "零售", label: "零售支持中心", shortLabel: "零售", color: "text-green-600", dotColor: "bg-green-600" },
]

// ─── 风险预警 mock 数据 ──────────────────────────────────
const riskAlerts = [
  {
    id: "r1",
    level: "high" as const,
    title: "贵州茅台定增方案资产负债率持续偏高",
    detail: "连续2季度超75%，应付账款账期延长，资金压力信号明显，需在方案推进前完成客观数据核查",
    itemId: "wi-002",
    businessLine: "资管",
  },
  {
    id: "r2",
    level: "high" as const,
    title: "股票质押项目涉双条线客户，策略冲突风险",
    detail: "资管与投行条线在同一客户的对客口径尚未统一，继续推进存在内控合规风险，已提请协同处理",
    itemId: "wi-007",
    businessLine: "资管",
  },
  {
    id: "r3",
    level: "medium" as const,
    title: "IPO准入申请现金流量表缺失",
    detail: "材料完整度92%，关键财务数据不全，若进入复核流程后被退回将影响准入时效",
    itemId: "wi-004",
    businessLine: "投行",
  },
  {
    id: "r4",
    level: "medium" as const,
    title: "3份合同模板不符合当前标准",
    detail: "存量合同使用旧版模板，字段定义存在歧义，可能导致后续执行争议，建议尽快规范处理",
    itemId: "wi-003",
    businessLine: "资管",
  },
  {
    id: "r5",
    level: "watch" as const,
    title: "高净值客户资产异常转移监控",
    detail: "5位客户近30天资产变动超40%，存在潜在流失风险，当前仍在监控观察阶段",
    itemId: "wi-006",
    businessLine: "零售",
  },
]

const riskLevelConfig = {
  high: { label: "高风险", color: "text-destructive", bg: "bg-destructive/10", border: "border-destructive/25", dot: "bg-destructive" },
  medium: { label: "中风险", color: "text-warning", bg: "bg-warning/10", border: "border-warning/25", dot: "bg-warning" },
  watch: { label: "关注", color: "text-blue-500", bg: "bg-blue-500/10", border: "border-blue-500/20", dot: "bg-blue-500" },
}

// ─── 其他配置 ──────────────────────────────────────────
const priorityConfig: Record<Priority, { label: string; color: string; bg: string; icon: React.ElementType }> = {
  urgent: { label: "紧急", color: "text-destructive", bg: "bg-destructive/10", icon: AlertCircle },
  normal: { label: "待办", color: "text-warning", bg: "bg-warning/10", icon: Clock },
  watch: { label: "关注", color: "text-blue-500", bg: "bg-blue-500/10", icon: Eye },
}

// 截图样式：AI 建议文字 + 右侧彩色一键按钮
const aiActionConfig: Record<string, { suggest: string; btnLabel: string; btnClass: string }> = {
  supplement: {
    suggest: "建议补录",
    btnLabel: "一键打回补录",
    btnClass: "bg-destructive text-white hover:bg-destructive/90",
  },
  handle: {
    suggest: "建议通过",
    btnLabel: "一键复核通过",
    btnClass: "bg-green-600 text-white hover:bg-green-600/90",
  },
  escalate: {
    suggest: "建议协同",
    btnLabel: "一键提请协同",
    btnClass: "bg-destructive text-white hover:bg-destructive/90",
  },
}

// 规则知会专属：介入按钮
const ruleActionConfig = {
  suggest: "建议介入",
  btnLabel: "一键主动介入",
  btnClass: "bg-orange-500 text-white hover:bg-orange-500/90",
}

// ─── 主页面 ────────────────────────────────────────────
export function SupportPage() {
  const { openChat } = useChatContext()
  const [activeQueue, setActiveQueue] = useState("all")
  const [selectedItem, setSelectedItem] = useState<WorkItem | null>(null)
  const [filterStatus, setFilterStatus] = useState<"all" | "pending" | "watch">("all")
  const [sidebarCollapsed, setSidebarCollapsed] = useState(true)
  const [mainTab, setMainTab] = useState<"risk" | "items">("items")

  const filteredItems = workItems.filter((item) => {
    const lineMatch = activeQueue === "all" || item.businessLine === activeQueue
    const statusMatch =
      filterStatus === "all"
        ? true
        : filterStatus === "pending"
        ? item.priority !== "watch" && item.status !== "done"
        : item.sourceType === "rule" || item.priority === "watch"
    return lineMatch && statusMatch
  })

  // 风险预警：按当前队列筛选
  const visibleRisks = riskAlerts.filter(
    (r) => activeQueue === "all" || r.businessLine === activeQueue
  )

  const stats = {
    urgent: workItems.filter((i) => i.priority === "urgent" && i.status !== "done").length,
    normal: workItems.filter((i) => i.priority === "normal" && i.status !== "done").length,
    watch: workItems.filter((i) => i.priority === "watch").length,
    done: workItems.filter((i) => i.status === "done").length,
  }

  const getQueueCount = (key: string) => {
    if (key === "all") return workItems.filter((i) => i.status !== "done").length
    return workItems.filter((i) => i.businessLine === key && i.status !== "done").length
  }

  return (
    <div className="flex flex-col h-full overflow-hidden">
      <div className="flex flex-1 overflow-hidden">

        {/* ── 左侧可折叠侧边栏 ── */}
        <aside
          className={cn(
            "shrink-0 border-r border-border bg-card flex flex-col transition-all duration-200 overflow-hidden",
            sidebarCollapsed ? "w-14" : "w-52"
          )}
        >
          {/* 折叠/展开按钮 */}
          <div className={cn("flex items-center border-b border-border px-2 py-3", sidebarCollapsed ? "justify-center" : "justify-between px-3")}>
            {!sidebarCollapsed && (
              <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">工作队列</span>
            )}
            <button
              onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
              className="w-7 h-7 rounded-lg flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-muted transition-all"
              title={sidebarCollapsed ? "展开侧边栏" : "收起侧边栏"}
            >
              {sidebarCollapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
            </button>
          </div>

          <div className="flex-1 overflow-y-auto py-2">
            {/* 队列分组 */}
            <div className={cn("space-y-0.5", sidebarCollapsed ? "px-1.5" : "px-2")}>
              {queueGroups.map((g) => {
                const count = getQueueCount(g.key)
                const isActive = activeQueue === g.key
                return (
                  <button
                    key={g.key}
                    onClick={() => setActiveQueue(g.key)}
                    title={sidebarCollapsed ? `${g.label}（${count}）` : undefined}
                    className={cn(
                      "w-full rounded-lg transition-all duration-150 relative",
                      sidebarCollapsed
                        ? "flex items-center justify-center h-10"
                        : "flex items-center justify-between px-3 py-2.5 text-sm",
                      isActive
                        ? "bg-primary/10 text-primary font-medium"
                        : "text-muted-foreground hover:bg-muted hover:text-foreground"
                    )}
                  >
                    {sidebarCollapsed ? (
                      /* 折叠态：彩色圆点 + 角标 */
                      <div className="relative">
                        <div className={cn("w-2.5 h-2.5 rounded-full", isActive ? "bg-primary" : g.dotColor)} />
                        {count > 0 && (
                          <span className="absolute -top-1.5 -right-2 text-[9px] font-bold text-destructive leading-none">
                            {count}
                          </span>
                        )}
                      </div>
                    ) : (
                      /* 展开态：文字 + 数字 */
                      <>
                        <span className={cn("truncate text-sm", isActive ? "" : g.color)}>{g.label}</span>
                        {count > 0 && (
                          <span className={cn(
                            "text-xs px-1.5 py-0.5 rounded-full font-medium shrink-0",
                            isActive ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"
                          )}>
                            {count}
                          </span>
                        )}
                      </>
                    )}
                  </button>
                )
              })}
            </div>

            {/* 分隔线 */}
            <div className="h-px bg-border mx-2 my-3" />

            {/* 规则知会 */}
            <div className={cn(sidebarCollapsed ? "px-1.5" : "px-2")}>
              {!sidebarCollapsed && (
                <div className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wide mb-1.5 px-1">规则知会</div>
              )}
              <button
                onClick={() => { setActiveQueue("all"); setFilterStatus("watch") }}
                title={sidebarCollapsed ? `自动监控（${stats.watch}）` : undefined}
                className={cn(
                  "w-full rounded-lg transition-all duration-150",
                  sidebarCollapsed ? "flex items-center justify-center h-10" : "flex items-center justify-between px-3 py-2.5",
                  filterStatus === "watch"
                    ? "bg-blue-500/10 text-blue-600 font-medium"
                    : "text-muted-foreground hover:bg-muted hover:text-foreground"
                )}
              >
                {sidebarCollapsed ? (
                  <div className="relative">
                    <Bell className="w-4 h-4" />
                    {stats.watch > 0 && (
                      <span className="absolute -top-1.5 -right-2 text-[9px] font-bold text-blue-500 leading-none">{stats.watch}</span>
                    )}
                  </div>
                ) : (
                  <>
                    <span className="text-sm">自动监控</span>
                    <span className="text-xs px-1.5 py-0.5 rounded-full bg-blue-500/10 text-blue-600 font-medium">{stats.watch}</span>
                  </>
                )}
              </button>
            </div>

            {/* 分隔线 */}
            <div className="h-px bg-border mx-2 my-3" />

            {/* 今日完成 */}
            <div className={cn(sidebarCollapsed ? "px-1.5" : "px-2")}>
              {!sidebarCollapsed && (
                <div className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wide mb-1.5 px-1">今日完成</div>
              )}
              <div
                title={sidebarCollapsed ? `今日已完成 ${stats.done + 12} 项` : undefined}
                className={cn(
                  "rounded-lg bg-success/8",
                  sidebarCollapsed ? "flex items-center justify-center h-10" : "px-3 py-2.5"
                )}
              >
                {sidebarCollapsed ? (
                  <div className="relative">
                    <CheckCircle2 className="w-4 h-4 text-success" />
                    <span className="absolute -top-1.5 -right-2 text-[9px] font-bold text-success leading-none">{stats.done + 12}</span>
                  </div>
                ) : (
                  <>
                    <span className="text-sm font-semibold text-success">{stats.done + 12}</span>
                    <span className="text-xs text-muted-foreground ml-1">项已处理</span>
                  </>
                )}
              </div>
            </div>
          </div>
        </aside>

        {/* ── 中间主内容区 ── */}
        <main className="flex-1 overflow-y-auto min-w-0">

          {/* 智能体入口行（无标题，与员工端一致） */}
          <div className="border-b border-border bg-card px-5 py-3">
            <div className="flex items-center gap-5 overflow-x-auto pb-1">
              {supportAgents.map((agent) => (
                <button
                  key={agent.name}
                  onClick={() => openChat(agent)}
                  className="flex flex-col items-center gap-1.5 group shrink-0"
                >
                  <div className="w-10 h-10 rounded-full overflow-hidden border-2 border-border bg-card group-hover:border-primary/40 group-hover:scale-105 transition-all duration-300 shadow-sm">
                    <img src={agent.image} alt={agent.name} className="w-full h-full object-cover" />
                  </div>
                  <span className="text-[11px] text-muted-foreground group-hover:text-primary transition-colors whitespace-nowrap">
                    {agent.name}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* Tab 切换：带统计数字 */}
          <div className="px-5 pt-3 sticky top-0 z-10 bg-background/95 backdrop-blur-sm border-b border-border">
            <div className="flex items-center gap-0">
              <TabBtn
                active={mainTab === "risk"}
                label="风险提示"
                count={visibleRisks.length}
                countColor={visibleRisks.filter(r => r.level === "high").length > 0 ? "text-destructive" : "text-warning"}
                onClick={() => setMainTab("risk")}
              />
              <TabBtn
                active={mainTab === "items"}
                label="事项列表"
                count={filteredItems.length}
                onClick={() => setMainTab("items")}
              />
              {/* 事项筛选（仅在事项 tab 显示，右对齐） */}
              {mainTab === "items" && (
                <div className="ml-auto flex items-center gap-1.5 pb-1">
                  <FilterBtn active={filterStatus === "all"} icon={LayoutGrid} label="全部" onClick={() => setFilterStatus("all")} />
                  <FilterBtn active={filterStatus === "pending"} icon={Filter} label="待处理" onClick={() => setFilterStatus("pending")} />
                  <FilterBtn active={filterStatus === "watch"} icon={Bell} label="规则知会" onClick={() => setFilterStatus("watch")} blue />
                </div>
              )}
            </div>
          </div>

          <div className="p-5 space-y-3">
            {/* ── 风险提示 tab ── */}
            {mainTab === "risk" && visibleRisks.map((r) => {
              const cfg = riskLevelConfig[r.level]
              return (
                <div
                  key={r.id}
                  className={cn("flex items-start gap-3 p-4 rounded-xl border", cfg.bg, cfg.border)}
                >
                  <div className={cn("mt-1.5 w-2 h-2 rounded-full shrink-0", cfg.dot)} />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1 flex-wrap">
                      <span className={cn("text-xs font-semibold", cfg.color)}>{cfg.label}</span>
                      <span className={cn(
                        "text-[10px] px-1.5 py-0.5 rounded font-medium",
                        r.businessLine === "资管" ? "bg-orange-500/10 text-orange-600"
                        : r.businessLine === "投行" ? "bg-blue-500/10 text-blue-600"
                        : "bg-green-600/10 text-green-700"
                      )}>
                        {r.businessLine}
                      </span>
                      <span className="text-sm font-medium text-foreground">{r.title}</span>
                    </div>
                    <p className="text-xs text-muted-foreground leading-relaxed">{r.detail}</p>
                  </div>
                  <div className="flex items-center gap-1.5 shrink-0 mt-0.5">
                    {r.level === "high" && (
                      <button className="text-xs px-2.5 py-1.5 rounded-lg bg-destructive/10 text-destructive border border-destructive/20 hover:bg-destructive/20 transition-colors font-medium">
                        立即处置
                      </button>
                    )}
                    <button className="text-xs px-2.5 py-1.5 rounded-lg bg-muted text-muted-foreground hover:text-foreground transition-colors">
                      关联事项
                    </button>
                  </div>
                </div>
              )
            })}

            {/* ── 事项列表 tab ── */}
            {mainTab === "items" && (
              <>
                {filteredItems.length === 0 && (
                  <div className="text-center py-16 text-muted-foreground text-sm">暂无事项</div>
                )}
                {filteredItems.map((item) => (
                  <WorkItemCard
                    key={item.id}
                    item={item}
                    isSelected={selectedItem?.id === item.id}
                    onClick={() => setSelectedItem(item.id === selectedItem?.id ? null : item)}
                  />
                ))}
              </>
            )}
          </div>
        </main>

        {/* ── 右侧详情面板 ── */}
        {selectedItem && (
          <ItemDetailPanel item={selectedItem} onClose={() => setSelectedItem(null)} />
        )}
      </div>

      {/* 底部对话输入栏 */}
      <PageChatBar
        context="support"
        agentName="业务支持助手"
        placeholder="向 AI 提问，例如：分析当前高风险事项，或帮我起草提请协同申请…"
      />
    </div>
  )
}

// ─── FilterBtn ─────────────────────────────────────────
function FilterBtn({ active, icon: Icon, label, onClick, blue }: {
  active: boolean; icon: React.ElementType; label: string; onClick: () => void; blue?: boolean
}) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-medium transition-all",
        active
          ? blue ? "bg-blue-500 text-white" : "bg-primary text-primary-foreground"
          : "bg-muted text-muted-foreground hover:text-foreground"
      )}
    >
      <Icon className="w-3 h-3" />
      {label}
    </button>
  )
}

// ─── WorkItemCard ──────────────────────────────────────
function WorkItemCard({ item, isSelected, onClick }: {
  item: WorkItem; isSelected: boolean; onClick: () => void
}) {
  const pCfg = priorityConfig[item.priority]
  const isRule = item.sourceType === "rule"

  // 左侧竖线颜色
  const borderColorMap: Record<Priority, string> = {
    urgent: "border-l-destructive",
    normal: "border-l-green-600",
    watch: "border-l-orange-500",
  }

  // AI 操作配置：规则知会固定用介入，其余用 aiActionConfig
  const aiCfg = isRule ? ruleActionConfig : (aiActionConfig[item.aiAction] ?? aiActionConfig.handle)

  return (
    <div
      onClick={onClick}
      className={cn(
        "group bg-card border border-border border-l-4 rounded-xl overflow-hidden cursor-pointer transition-all duration-200",
        borderColorMap[item.priority],
        isSelected ? "shadow-md ring-1 ring-primary/20" : "hover:shadow-sm hover:border-primary/30"
      )}
    >
      {/* 卡片主体 */}
      <div className="px-4 pt-3 pb-2">
        {/* 顶行：优先级 badge + 业务线 + 来源 + 时间 */}
        <div className="flex items-center gap-1.5 mb-2">
          <span className={cn("text-[10px] font-bold px-1.5 py-0.5 rounded-sm", pCfg.bg, pCfg.color)}>
            {pCfg.label}
          </span>
          <span className={cn(
            "text-[10px] px-1.5 py-0.5 rounded-sm font-medium",
            item.businessLine === "资管" ? "bg-orange-500/10 text-orange-600"
            : item.businessLine === "投行" ? "bg-blue-500/10 text-blue-600"
            : "bg-green-600/10 text-green-700"
          )}>
            {item.businessLine}
          </span>
          {isRule && (
            <span className="text-[10px] px-1.5 py-0.5 rounded-sm bg-orange-500/10 text-orange-600 font-medium">
              规则知会
            </span>
          )}
          {item.status === "escalated" && (
            <span className="text-[10px] px-1.5 py-0.5 rounded-sm bg-destructive/10 text-destructive font-medium">
              已提请协同
            </span>
          )}
          <span className="text-[10px] text-muted-foreground ml-auto">{item.submittedAt}</span>
        </div>

        {/* 三层文字（无背景框） */}
        <div className="space-y-0.5 mb-3">
          <div className="text-xs text-muted-foreground leading-relaxed">
            对象：{item.subject.object}
          </div>
          <div className="text-xs font-semibold text-foreground leading-relaxed">
            动作：{item.subject.action}
          </div>
          <div className="text-xs text-foreground leading-relaxed">
            结果：{item.subject.result}
          </div>
        </div>

        {/* AI 建议条（分割线 + 机器人图标 + 建议文字 + 彩色按钮） */}
        <div className="flex items-center gap-2 pt-2 border-t border-border/60">
          <Bot className="w-3.5 h-3.5 text-primary shrink-0" />
          <span className="text-xs flex-1 min-w-0">
            <span className="font-semibold text-primary">{aiCfg.suggest}</span>
            <span className="text-muted-foreground"> · {isRule ? item.aiPrejudge : item.aiPrejudge}</span>
          </span>
          <button
            onClick={(e) => e.stopPropagation()}
            className={cn(
              "text-xs px-3 py-1.5 rounded-lg font-semibold shrink-0 transition-all active:scale-95",
              aiCfg.btnClass
            )}
          >
            {aiCfg.btnLabel}
          </button>
        </div>
      </div>

      {/* 底部次操作栏 */}
      <div className="flex items-center gap-3 px-4 py-1.5 bg-muted/30 border-t border-border/50">
        <button
          onClick={(e) => { e.stopPropagation(); onClick() }}
          className="text-[11px] text-muted-foreground hover:text-foreground transition-colors"
        >
          查看详情
        </button>
        <span className="text-border text-[11px]">·</span>
        <button
          onClick={(e) => e.stopPropagation()}
          className="text-[11px] text-muted-foreground hover:text-foreground transition-colors"
        >
          补充备注
        </button>
        {item.status === "escalated" && (
          <>
            <span className="text-border text-[11px]">·</span>
            <button
              onClick={(e) => e.stopPropagation()}
              className="text-[11px] text-primary hover:text-primary/80 transition-colors"
            >
              查看议题
            </button>
          </>
        )}
      </div>
    </div>
  )
}

// ─── TabBtn ────────────────────────────────────────────
function TabBtn({ active, label, count, countColor, onClick }: {
  active: boolean; label: string; count?: number; countColor?: string; onClick: () => void
}) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "flex items-center gap-1.5 px-4 py-2.5 text-sm font-medium transition-all border-b-2 -mb-px",
        active
          ? "text-primary border-primary"
          : "text-muted-foreground border-transparent hover:text-foreground hover:border-border"
      )}
    >
      {label}
      {count !== undefined && (
        <span className={cn(
          "text-xs px-1.5 py-0.5 rounded-full font-semibold",
          active
            ? countColor ? `${countColor} bg-current/10` : "text-primary bg-primary/10"
            : "text-muted-foreground bg-muted"
        )}>
          {count}
        </span>
      )}
    </button>
  )
}
