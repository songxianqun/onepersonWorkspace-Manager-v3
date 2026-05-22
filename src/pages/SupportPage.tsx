import { useState } from "react"
import {
  AlertCircle,
  Clock,
  Eye,
  Bell,
  Filter,
  LayoutGrid,
  Bot,
  AlertTriangle,
  MessageSquarePlus,
  FileText,
  History,
  MessagesSquare,
  PanelLeftClose,
} from "lucide-react"
import { workItems, trackItems, type WorkItem, type TrackItem, type Priority } from "@/data/supportData"
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

// ─── 侧边栏 mock 数据 ──────────────────────────────────
const sidebarWorkTips = [
  { id: 1, text: "贵州茅台定增方案待复核", urgent: true },
  { id: 2, text: "合同录入异常检测（3份）", urgent: false },
  { id: 3, text: "IPO材料补录催办", urgent: false },
]
const sidebarHistoryItems = [
  { id: 1, text: "城商行债券方案 — 中信银行", time: "今日" },
  { id: 2, text: "股票质押客户分析提请协同", time: "昨日" },
  { id: 3, text: "零售高净值客户预警处置", time: "5月19日" },
]
const sidebarHistorySessions = [
  { id: 1, text: "分析贵州茅台定增合规风险" },
  { id: 2, text: "起草跨条线协同申请" },
  { id: 3, text: "IPO准入材料完整度核查" },
  { id: 4, text: "资管模型指标精简方案讨论" },
]

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
  const [activeQueue] = useState("all")
  const [selectedItem, setSelectedItem] = useState<WorkItem | null>(null)
  const [filterStatus, setFilterStatus] = useState<"all" | "pending" | "watch">("all")
  const [sidebarCollapsed, setSidebarCollapsed] = useState(true)
  const [mainTab, setMainTab] = useState<"items" | "board">("items")

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

  return (
    <div className="flex flex-col h-full overflow-hidden">
      <div className="flex flex-1 overflow-hidden">

        {/* ── 左侧 Gemini 风格侧边栏 ── */}
        <aside
          className={cn(
            "shrink-0 border-r border-border bg-card flex flex-col transition-all duration-250 overflow-hidden",
            sidebarCollapsed ? "w-0" : "w-60"
          )}
        >
          {/* 顶部：收起按钮 */}
          <div className="flex items-center justify-between px-3 py-3 shrink-0">
            <span className="text-sm font-semibold text-foreground">业务支持助手</span>
            <button
              onClick={() => setSidebarCollapsed(true)}
              className="w-7 h-7 rounded-lg flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-muted transition-all"
            >
              <PanelLeftClose className="w-4 h-4" />
            </button>
          </div>

          {/* 新建会话 */}
          <div className="px-3 mb-2 shrink-0">
            <button
              onClick={() => openChat({ name: "业务支持助手", image: "/images/avatar-invest-banking.png" })}
              className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl bg-muted/60 hover:bg-muted text-sm text-foreground font-medium transition-all group"
            >
              <MessageSquarePlus className="w-4 h-4 text-primary shrink-0" />
              新建会话
            </button>
          </div>

          <div className="flex-1 overflow-y-auto px-3 space-y-4 pb-4">
            {/* 工作提示 */}
            <div>
              <div className="flex items-center gap-1.5 px-1 mb-1.5">
                <FileText className="w-3.5 h-3.5 text-muted-foreground" />
                <span className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wide">工作提示</span>
              </div>
              <div className="space-y-0.5">
                {sidebarWorkTips.map((tip) => (
                  <button
                    key={tip.id}
                    className="w-full flex items-center gap-2 px-2 py-1.5 rounded-lg text-left hover:bg-muted transition-colors group"
                  >
                    {tip.urgent && <span className="w-1.5 h-1.5 rounded-full bg-destructive shrink-0" />}
                    <span className={cn(
                      "text-xs truncate",
                      tip.urgent ? "text-foreground font-medium" : "text-muted-foreground group-hover:text-foreground"
                    )}>
                      {tip.text}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            {/* 历史事项 */}
            <div>
              <div className="flex items-center gap-1.5 px-1 mb-1.5">
                <History className="w-3.5 h-3.5 text-muted-foreground" />
                <span className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wide">历史事项</span>
              </div>
              <div className="space-y-0.5">
                {sidebarHistoryItems.map((item) => (
                  <button
                    key={item.id}
                    className="w-full flex items-center justify-between px-2 py-1.5 rounded-lg text-left hover:bg-muted transition-colors group"
                  >
                    <span className="text-xs text-muted-foreground group-hover:text-foreground truncate flex-1">{item.text}</span>
                    <span className="text-[10px] text-muted-foreground/60 shrink-0 ml-2">{item.time}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* 历史会话 */}
            <div>
              <div className="flex items-center gap-1.5 px-1 mb-1.5">
                <MessagesSquare className="w-3.5 h-3.5 text-muted-foreground" />
                <span className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wide">历史会话</span>
              </div>
              <div className="space-y-0.5">
                {sidebarHistorySessions.map((s) => (
                  <button
                    key={s.id}
                    className="w-full px-2 py-1.5 rounded-lg text-left hover:bg-muted transition-colors group"
                  >
                    <span className="text-xs text-muted-foreground group-hover:text-foreground truncate block">{s.text}</span>
                  </button>
                ))}
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

          {/* Tab 切换 */}
          <div className="px-5 pt-3 sticky top-0 z-10 bg-background/95 backdrop-blur-sm border-b border-border">
            <div className="flex items-center gap-0">
              <TabBtn
                active={mainTab === "items"}
                label="工作提示"
                count={filteredItems.length}
                onClick={() => setMainTab("items")}
              />
              <TabBtn
                active={mainTab === "board"}
                label="事项看板"
                count={trackItems.length}
                onClick={() => setMainTab("board")}
              />
              {/* 工作提示筛选（右对齐） */}
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
            {/* ── 工作提示 tab ── */}
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

            {/* ── 事项看板 tab ── */}
            {mainTab === "board" && (
              <>
                {trackItems.map((item) => (
                  <TrackItemCard key={item.id} item={item} />
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

        {/* 事项标题 */}
        <div className="mb-3">
          <div className="text-sm font-semibold text-foreground leading-snug">
            {item.title}
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

// ─── TrackItemCard ─────────────────────────────────────
function TrackItemCard({ item }: { item: TrackItem }) {
  const statusConfig = {
    normal:  { label: "正常", dot: "bg-green-500",     text: "text-green-600" },
    at_risk: { label: "风险", dot: "bg-destructive",   text: "text-destructive" },
    blocked: { label: "阻塞", dot: "bg-orange-500",    text: "text-orange-600" },
    done:    { label: "完成", dot: "bg-muted-foreground", text: "text-muted-foreground" },
  }
  const typeLabel = { project: "项目", product: "产品", task: "任务" }
  const relationLabel = { owner: "负责人", participant: "参与者", watcher: "关注" }

  const sCfg = statusConfig[item.status]

  return (
    <div className={cn(
      "bg-card border border-border rounded-xl overflow-hidden hover:shadow-sm transition-all",
      (item.status === "at_risk" || item.status === "blocked") && "border-l-4",
      item.status === "at_risk" && "border-l-destructive",
      item.status === "blocked" && "border-l-orange-500",
    )}>
      <div className="px-4 py-3">
        {/* 第一行：标签 + 时间 */}
        <div className="flex items-center gap-1.5 mb-1.5">
          <span className="text-[10px] font-medium px-1.5 py-0.5 rounded bg-muted text-muted-foreground">
            {typeLabel[item.type]}
          </span>
          <span className="text-[10px] font-medium px-1.5 py-0.5 rounded bg-primary/10 text-primary">
            {relationLabel[item.relation]}
          </span>
          <span className="flex items-center gap-1 ml-1">
            <span className={cn("w-1.5 h-1.5 rounded-full shrink-0", sCfg.dot)} />
            <span className={cn("text-[10px] font-medium", sCfg.text)}>{sCfg.label}</span>
          </span>
          <span className="text-[10px] text-muted-foreground ml-auto">{item.updatedAt}</span>
        </div>

        {/* 第二行：标题 */}
        <div className="text-sm font-semibold text-foreground leading-snug mb-2.5">
          {item.title}
        </div>

        {/* 第三行：进度条 + 处理人 + 请示状态，三者同行 */}
        <div className="flex items-center gap-3 mb-2.5">
          {/* 进度 */}
          <div className="flex items-center gap-1.5 flex-1 min-w-0">
            <div className="w-20 h-1 bg-muted rounded-full overflow-hidden shrink-0">
              <div
                className={cn("h-full rounded-full", item.status === "at_risk" ? "bg-destructive" : item.status === "blocked" ? "bg-orange-500" : "bg-primary")}
                style={{ width: `${item.progressPercent}%` }}
              />
            </div>
            <span className="text-[10px] text-muted-foreground shrink-0">{item.progressPercent}% · {item.progressLabel}</span>
          </div>
          {/* 处理人 */}
          <span className="text-[10px] text-muted-foreground shrink-0">{item.handler}</span>
          {/* 请示状态 */}
          {item.needsEscalation && !item.escalationSubmitted && (
            <span className="text-[10px] font-medium text-orange-600 bg-orange-500/10 px-1.5 py-0.5 rounded-full shrink-0">待请示</span>
          )}
          {item.escalationSubmitted && (
            <span className="text-[10px] font-medium text-primary bg-primary/10 px-1.5 py-0.5 rounded-full shrink-0">已请示</span>
          )}
        </div>

        {/* 第四行：风险提示（仅有风险时显示） */}
        {item.hasRisk && item.riskDesc && (
          <div className="flex items-start gap-1.5 mb-2.5 px-2.5 py-1.5 rounded-lg bg-destructive/5 border border-destructive/15">
            <AlertTriangle className="w-3 h-3 text-destructive shrink-0 mt-0.5" />
            <span className="text-xs text-destructive leading-relaxed">{item.riskDesc}</span>
          </div>
        )}

        {/* 第五行：AI研判 */}
        <div className="flex items-start gap-1.5 pt-2 border-t border-border/60">
          <Bot className="w-3.5 h-3.5 text-primary shrink-0 mt-0.5" />
          <span className="text-xs text-muted-foreground leading-relaxed">
            <span className="font-semibold text-primary">AI · </span>{item.aiJudge}
          </span>
        </div>
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

