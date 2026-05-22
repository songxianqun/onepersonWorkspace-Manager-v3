import { useState } from "react"
import {
  AlertTriangle,
  Users,
  Database,
  ShieldAlert,
  FileCheck,
  Zap,
  CheckCircle2,
  Clock,
  Send,
  ArrowRight,
  ChevronDown,
  ChevronUp,
  Circle,
  BarChart3,
  Siren,
  ChevronRight,
  TrendingUp,
  TrendingDown,
  Activity,
  Shield,
  Plus,
  Filter,
  ArrowUpRight,
} from "lucide-react"
import { agendas, type Agenda, type AgendaPriority, type AgendaStatus } from "@/data/supportData"
import { PageChatBar } from "@/components/PageChatBar"
import { cn } from "@/lib/utils"

// ─── 顶部导航模块配置 ────────────────────────────────
type CollabSection = "agenda" | "business" | "risk" | "team" | "emergency"

const sectionConfig: {
  key: CollabSection
  label: string
  sub: string
  icon: React.ElementType
  badgeText: string
  badgeVariant: "danger" | "success" | "warning" | "info"
  accentFrom: string
  accentTo: string
}[] = [
  {
    key: "agenda",
    label: "请示事项",
    sub: "审批待办、请示流转、签署确认",
    icon: FileCheck,
    badgeText: "待处理",
    badgeVariant: "danger",
    accentFrom: "from-[hsl(28,85%,55%)]",
    accentTo: "to-[hsl(38,90%,60%)]",
  },
  {
    key: "business",
    label: "经营看板",
    sub: "经营指标、业绩趋势、目标达成",
    icon: BarChart3,
    badgeText: "营收+12.3%",
    badgeVariant: "success",
    accentFrom: "from-[hsl(152,60%,42%)]",
    accentTo: "to-[hsl(165,55%,48%)]",
  },
  {
    key: "risk",
    label: "风险提示",
    sub: "合规风险、操作风险、市场风险预警",
    icon: Shield,
    badgeText: "3项高风险",
    badgeVariant: "danger",
    accentFrom: "from-[hsl(0,72%,55%)]",
    accentTo: "to-[hsl(15,80%,55%)]",
  },
  {
    key: "team",
    label: "队伍状况",
    sub: "人员变动、绩效分布、核心骨干",
    icon: Users,
    badgeText: "5人变动",
    badgeVariant: "warning",
    accentFrom: "from-[hsl(250,55%,55%)]",
    accentTo: "to-[hsl(270,50%,60%)]",
  },
  {
    key: "emergency",
    label: "应急组织",
    sub: "应急预案、突发事件、演练状态",
    icon: Siren,
    badgeText: "运行正常",
    badgeVariant: "success",
    accentFrom: "from-[hsl(200,70%,50%)]",
    accentTo: "to-[hsl(215,65%,55%)]",
  },
]

const badgeStyle: Record<string, string> = {
  danger: "bg-destructive/12 text-destructive",
  success: "bg-success/12 text-success",
  warning: "bg-warning/12 text-warning",
  info: "bg-blue-500/12 text-blue-600",
}

// ─── 议题相关配置 ────────────────────────────────────
const agendaTypeConfig: Record<string, { label: string; icon: React.ElementType; color: string; bg: string }> = {
  conflict: { label: "跨部门冲突", icon: Users, color: "text-orange-600", bg: "bg-orange-500/10" },
  resource: { label: "资源申请", icon: Zap, color: "text-purple-600", bg: "bg-purple-500/10" },
  permission: { label: "数据权限", icon: Database, color: "text-blue-600", bg: "bg-blue-500/10" },
  risk: { label: "风险知会", icon: ShieldAlert, color: "text-destructive", bg: "bg-destructive/10" },
  policy: { label: "制度决策", icon: FileCheck, color: "text-green-600", bg: "bg-green-500/10" },
}

const priorityConfig: Record<AgendaPriority, { label: string; color: string; bg: string }> = {
  high: { label: "高优", color: "text-destructive", bg: "bg-destructive/10" },
  medium: { label: "中优", color: "text-warning", bg: "bg-warning/10" },
  info: { label: "知会", color: "text-blue-500", bg: "bg-blue-500/10" },
}

const statusConfig: Record<AgendaStatus, { label: string; color: string; icon: React.ElementType }> = {
  pending: { label: "待讨论", color: "text-muted-foreground", icon: Clock },
  discussing: { label: "讨论中", color: "text-warning", icon: Circle },
  decided: { label: "已决策", color: "text-success", icon: CheckCircle2 },
  issued: { label: "已下发", color: "text-primary", icon: Send },
  tracking: { label: "执行追踪", color: "text-blue-500", icon: ArrowRight },
  closed: { label: "已关闭", color: "text-muted-foreground", icon: CheckCircle2 },
}

const triggerLabel: Record<string, { label: string; color: string }> = {
  proactive: { label: "主动发起", color: "text-primary" },
  rule: { label: "规则知会", color: "text-blue-500" },
  escalated: { label: "事项升级", color: "text-destructive" },
}

// ─── 主页面 ──────────────────────────────────────────
export function CollabPage() {
  const [activeSection, setActiveSection] = useState<CollabSection>("agenda")
  const [selectedId, setSelectedId] = useState<string | null>(null)

  const agendaPendingCount = agendas.filter(a => !["closed"].includes(a.status)).length

  const chatPlaceholder: Record<CollabSection, string> = {
    agenda: "向 AI 提问，例如：摘要当前请示事项，或帮我起草批复意见…",
    business: "向 AI 提问，例如：分析本月营收趋势，或哪个分中心目标完成率最低…",
    risk: "向 AI 提问，例如：列出当前高风险项，或帮我起草整改通知…",
    team: "向 AI 提问，例如：查看本月人员变动，或绩效待改进人员有哪些…",
    emergency: "向 AI 提问，例如：哪些预案尚未演练，或帮我更新应急联系人名单…",
  }

  return (
    <div className="h-full flex flex-col">
      {/* 整体可滚动区域：导航卡片 + 内容 */}
      <div className="flex-1 overflow-y-auto">
        {/* 顶部五模块导航卡片（不吸顶，随页面滚动） */}
        <div className="border-b border-border bg-card px-6 py-4">
          <div className="grid grid-cols-5 gap-3 max-w-[1400px]">
            {sectionConfig.map((sec) => {
              const Icon = sec.icon
              const isActive = activeSection === sec.key
              // agenda 卡片动态badge
              const badgeText = sec.key === "agenda"
                ? `${agendaPendingCount}项待处理`
                : sec.badgeText
              return (
                <button
                  key={sec.key}
                  onClick={() => setActiveSection(sec.key)}
                  className={cn(
                    "group relative text-left rounded-xl p-3.5 border transition-all duration-200 overflow-hidden",
                    isActive
                      ? "border-primary/30 bg-primary/5 shadow-sm"
                      : "border-border bg-background hover:border-primary/20 hover:bg-muted/40"
                  )}
                >
                  {/* 顶部渐变条 */}
                  <div
                    className={cn(
                      "absolute top-0 left-0 right-0 h-0.5 rounded-t-xl bg-gradient-to-r opacity-0 transition-opacity duration-200",
                      sec.accentFrom,
                      sec.accentTo,
                      isActive ? "opacity-100" : "group-hover:opacity-60"
                    )}
                  />
                  <div className="flex items-start gap-2.5">
                    {/* 图标 */}
                    <div
                      className={cn(
                        "relative shrink-0 w-10 h-10 rounded-xl overflow-hidden border transition-all duration-200",
                        isActive ? "border-primary/20 scale-105" : "border-border group-hover:scale-105"
                      )}
                    >
                      <div className={cn("absolute inset-0 bg-gradient-to-br opacity-20", sec.accentFrom, sec.accentTo)} />
                      <div className="absolute inset-0 flex items-center justify-center">
                        <Icon className={cn("w-5 h-5", isActive ? "text-primary" : "text-muted-foreground group-hover:text-foreground")} />
                      </div>
                    </div>
                    {/* 文字 */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-1.5 mb-0.5 flex-wrap">
                        <span className={cn("text-sm font-semibold", isActive ? "text-primary" : "text-foreground")}>
                          {sec.label}
                        </span>
                        <span className={cn("text-[10px] px-1.5 py-0.5 rounded-full font-medium", badgeStyle[sec.badgeVariant])}>
                          {badgeText}
                        </span>
                      </div>
                      <p className="text-[11px] text-muted-foreground leading-relaxed line-clamp-2">{sec.sub}</p>
                    </div>
                    <ChevronRight
                      className={cn(
                        "w-3.5 h-3.5 shrink-0 mt-1 transition-all duration-200",
                        isActive ? "text-primary" : "text-muted-foreground/30 group-hover:text-muted-foreground"
                      )}
                    />
                  </div>
                </button>
              )
            })}
          </div>
        </div>

        {/* 内容区（随整体页面滚动） */}
        {activeSection === "agenda" && (
          <AgendaSection
            selectedId={selectedId}
            setSelectedId={setSelectedId}
          />
        )}
        {activeSection === "business" && <BusinessSection />}
        {activeSection === "risk" && <RiskSection />}
        {activeSection === "team" && <TeamSection />}
        {activeSection === "emergency" && <EmergencySection />}
      </div>

      {/* 底部对话输入栏 */}
      <PageChatBar
        context="collab"
        agentName="决策分析助手"
        placeholder={chatPlaceholder[activeSection]}
      />
    </div>
  )
}

// ─── 请示事项 ─────────────────────────────────────────
function AgendaSection({
  selectedId,
  setSelectedId,
}: {
  selectedId: string | null
  setSelectedId: (id: string | null) => void
}) {
  const filtered = agendas
  const selected = agendas.find((a) => a.id === selectedId) || null

  return (
    <div className="flex">
      <div className="flex-1 flex flex-col min-w-0">
        {/* 区块标题 */}
        <div className="shrink-0 border-b border-border px-6 py-3 bg-background/80 flex items-center gap-2">
          <FileCheck className="w-4 h-4 text-primary" />
          <span className="text-base font-bold text-foreground">请示事项</span>
          <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-destructive/10 text-destructive">
            {agendas.filter(a => !["closed"].includes(a.status)).length}
          </span>
        </div>
        <div className="p-5 space-y-3">
          {filtered.map((agenda) => (
            <AgendaCard
              key={agenda.id}
              agenda={agenda}
              isSelected={selectedId === agenda.id}
              onClick={() => setSelectedId(agenda.id === selectedId ? null : agenda.id)}
            />
          ))}
        </div>
      </div>
      {selected && <AgendaDetailPanel agenda={selected} onClose={() => setSelectedId(null)} />}
    </div>
  )
}

// ─── 经营看板 ─────────────────────────────────────────
function BusinessSection() {
  const metrics = [
    { label: "本月总营收", value: "¥5,800万", change: "+12.3%", up: true },
    { label: "净利润", value: "¥1,680万", change: "+8.7%", up: true },
    { label: "客户总量", value: "12,458户", change: "+256", up: true },
    { label: "Q2目标完成率", value: "78.5%", change: "-2.1%", up: false },
  ]
  const branches = [
    { name: "华东分中心", revenue: "¥3,200万", progress: 92, color: "bg-success" },
    { name: "华南分中心", revenue: "¥2,800万", progress: 80, color: "bg-primary" },
    { name: "华北分中心", revenue: "¥2,100万", progress: 68, color: "bg-primary" },
    { name: "华中分中心", revenue: "¥1,900万", progress: 62, color: "bg-warning" },
    { name: "西南分中心", revenue: "¥1,600万", progress: 48, color: "bg-destructive" },
  ]
  const aiAdvice = [
    "目标完成率下降2.1%，主因是西南分中心进度滞后，建议安排专项督导",
    "营收增长强劲但利润率增速放缓（8.7% vs 12.3%），关注成本控制",
    "建议Q2末启动经营分析复盘会，重点讨论下半年目标是否需要调整",
    "华东分中心表现突出，可考虑推广其客户经营模式到其他区域",
  ]
  return (
    <div className="p-6">
      <div className="max-w-[1200px] space-y-5">
        <SectionTitle icon={BarChart3} title="经营看板" sub="本月核心经营指标概览" />
        <div className="grid grid-cols-4 gap-4">
          {metrics.map((m) => (
            <div key={m.label} className="bg-card border border-border rounded-xl p-4">
              <div className="text-xs text-muted-foreground mb-2">{m.label}</div>
              <div className="text-2xl font-bold text-foreground mb-1">{m.value}</div>
              <div className={cn("flex items-center gap-1 text-sm font-medium", m.up ? "text-success" : "text-destructive")}>
                {m.up ? <TrendingUp className="w-3.5 h-3.5" /> : <TrendingDown className="w-3.5 h-3.5" />}
                {m.change}
              </div>
            </div>
          ))}
        </div>
        <div className="bg-card border border-border rounded-xl p-5">
          <div className="text-sm font-semibold mb-4">分支机构业绩排名</div>
          <div className="space-y-3.5">
            {branches.map((b, i) => (
              <div key={b.name} className="flex items-center gap-4">
                <span className="text-xs text-muted-foreground w-4">{i + 1}</span>
                <span className="text-sm text-foreground w-24 shrink-0">{b.name}</span>
                <div className="flex-1 bg-muted rounded-full h-2 overflow-hidden">
                  <div className={cn("h-full rounded-full transition-all", b.color)} style={{ width: `${b.progress}%` }} />
                </div>
                <span className="text-sm font-medium text-foreground w-20 text-right">{b.revenue}</span>
                <span className="text-xs text-muted-foreground w-10 text-right">{b.progress}%</span>
              </div>
            ))}
          </div>
        </div>
        <AIAdviceCard advice={aiAdvice} />
      </div>
    </div>
  )
}

// ─── 风险提示 ─────────────────────────────────────────
function RiskSection() {
  const risks = [
    { level: "高", type: "合规风险", title: "反洗钱可疑交易报告", desc: "涉及金额¥5,200,000，合规部已初步识别异常模式", dept: "合规部", color: "text-destructive", bg: "bg-destructive/8", border: "border-destructive/20" },
    { level: "高", type: "合规风险", title: "客户适当性管理不符", desc: "华东分中心3例高风险产品匹配不当，需整改", dept: "客户部", color: "text-destructive", bg: "bg-destructive/8", border: "border-destructive/20" },
    { level: "高", type: "操作风险", title: "离职员工系统权限未清理", desc: "科技部发现2个账号仍有访问记录，安全隐患", dept: "科技部", color: "text-destructive", bg: "bg-destructive/8", border: "border-destructive/20" },
    { level: "中", type: "操作风险", title: "分支机构网络安全基线不达标", desc: "3个分支机构网络配置低于安全基线要求", dept: "科技部", color: "text-warning", bg: "bg-warning/8", border: "border-warning/20" },
    { level: "中", type: "市场风险", title: "固收产品到期集中再投压力", desc: "下季度有¥12亿固收产品到期，再投方向待定", dept: "资管条线", color: "text-warning", bg: "bg-warning/8", border: "border-warning/20" },
  ]
  const aiAdvice = [
    "第1项建议今日内安排合规部负责人汇报，必要时启动SAR报告流程",
    "第2项建议下发整改通知并限期7日内完成自查，通报华东分中心",
    "第3项属于操作疏漏，建议科技部立即关闭账号并排查过去30天访问日志",
    "整体建议：月底前组织一次合规专项会议，重点复盘适当性管理流程",
  ]
  return (
    <div className="p-6">
      <div className="max-w-[1200px] space-y-5">
        <SectionTitle icon={Shield} title="风险提示" sub="当前风险全景概览" />
        <div className="grid grid-cols-3 gap-4">
          <RiskStat label="高风险" value={3} color="text-destructive" bg="bg-destructive/8" />
          <RiskStat label="中风险" value={5} color="text-warning" bg="bg-warning/8" />
          <RiskStat label="本月已化解" value={12} color="text-success" bg="bg-success/8" />
        </div>
        <div className="space-y-3">
          {risks.map((r, i) => (
            <div key={i} className={cn("bg-card border rounded-xl p-4 flex gap-4", r.border)}>
              <div className={cn("shrink-0 px-2.5 py-1 rounded-lg text-xs font-bold self-start mt-0.5", r.bg, r.color)}>
                {r.level}
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-sm font-semibold text-foreground">{r.title}</span>
                  <span className="text-xs px-2 py-0.5 bg-muted rounded text-muted-foreground">{r.type}</span>
                  <span className="text-xs px-2 py-0.5 bg-muted rounded text-muted-foreground">{r.dept}</span>
                </div>
                <p className="text-xs text-muted-foreground">{r.desc}</p>
              </div>
              <button className={cn("shrink-0 self-center px-3 py-1.5 rounded-lg text-xs font-medium border transition-colors", r.bg, r.color, r.border, "hover:opacity-80")}>
                处置
              </button>
            </div>
          ))}
        </div>
        <AIAdviceCard advice={aiAdvice} />
      </div>
    </div>
  )
}

// ─── 队伍状况 ─────────────────────────────────────────
function TeamSection() {
  const overview = [
    { label: "在职总人数", value: "386人", sub: "本月净增+5" },
    { label: "本月入职", value: "8人", sub: "" },
    { label: "本月离职", value: "3人", sub: "" },
    { label: "整体出勤率", value: "96.2%", sub: "+0.3%" },
  ]
  const performance = [
    { label: "优秀", value: 61, pct: "15.8%", color: "bg-success" },
    { label: "良好", value: 113, pct: "29.3%", color: "bg-primary" },
    { label: "一般", value: 32, pct: "8.3%", color: "bg-warning" },
    { label: "待改进", value: 8, pct: "2.1%", color: "bg-destructive" },
  ]
  const keyPeople = [
    { name: "李明", role: "运营总监", status: "在岗", ok: true },
    { name: "王芳", role: "科技部总经理", status: "在岗", ok: true },
    { name: "陈静", role: "客户部总经理", status: "在岗", ok: true },
    { name: "赵强", role: "市场部总经理", status: "出差中", ok: false },
    { name: "周涛", role: "合规总监", status: "在岗", ok: true },
  ]
  const aiAdvice = [
    "离职3人均为一般岗位，暂无核心人才流失风险",
    "「待改进」8人建议启动绩效辅导计划，避免累积为管理问题",
    "建议关注运营部和科技部的加班数据，近期项目密集可能影响团队稳定性",
    "Q3有2位核心骨干合同到期，建议提前安排续签沟通",
  ]
  return (
    <div className="p-6">
      <div className="max-w-[1200px] space-y-5">
        <SectionTitle icon={Users} title="队伍状况" sub="人员变动与绩效分布" />
        <div className="grid grid-cols-4 gap-4">
          {overview.map((o) => (
            <div key={o.label} className="bg-card border border-border rounded-xl p-4">
              <div className="text-xs text-muted-foreground mb-2">{o.label}</div>
              <div className="text-2xl font-bold text-foreground">{o.value}</div>
              {o.sub && <div className="text-xs text-success mt-1">{o.sub}</div>}
            </div>
          ))}
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-card border border-border rounded-xl p-5">
            <div className="text-sm font-semibold mb-4">绩效分布</div>
            <div className="space-y-3">
              {performance.map((p) => (
                <div key={p.label} className="flex items-center gap-3">
                  <span className="text-xs text-muted-foreground w-12 shrink-0">{p.label}</span>
                  <div className="flex-1 bg-muted rounded-full h-2 overflow-hidden">
                    <div className={cn("h-full rounded-full", p.color)} style={{ width: `${(p.value / 386) * 100 * 3}%`, maxWidth: "100%" }} />
                  </div>
                  <span className="text-sm font-medium text-foreground w-8">{p.value}</span>
                  <span className="text-xs text-muted-foreground w-10 text-right">{p.pct}</span>
                </div>
              ))}
            </div>
          </div>
          <div className="bg-card border border-border rounded-xl p-5">
            <div className="text-sm font-semibold mb-4">核心骨干状态</div>
            <div className="space-y-2.5">
              {keyPeople.map((p) => (
                <div key={p.name} className="flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <div className="w-7 h-7 rounded-full bg-muted flex items-center justify-center text-xs font-bold text-muted-foreground">
                      {p.name[0]}
                    </div>
                    <div>
                      <div className="text-sm font-medium text-foreground">{p.name}</div>
                      <div className="text-xs text-muted-foreground">{p.role}</div>
                    </div>
                  </div>
                  <span className={cn("text-xs px-2 py-0.5 rounded-full font-medium", p.ok ? "bg-success/10 text-success" : "bg-warning/10 text-warning")}>
                    {p.status}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
        <AIAdviceCard advice={aiAdvice} />
      </div>
    </div>
  )
}

// ─── 应急组织 ─────────────────────────────────────────
type EmergencyPriority = "high" | "medium"
type EmergencyType = "突发事件处置" | "内部协调处置" | "合规监管响应" | "舆情危机处置"

interface EmergencyEvent {
  id: string
  priority: EmergencyPriority
  type: EmergencyType
  title: string
  desc: string
  source: string
  time: string
  timeline: { time: string; content: string; done: boolean }[]
}

const emergencyEvents: EmergencyEvent[] = [
  {
    id: "em-001",
    priority: "high",
    type: "突发事件处置",
    title: "客户董事长临时到访，讨论再融资",
    desc: "资管员工张三接到气派科技董秘电话，董事长将在2小时后到公司拜访，希望讨论新一轮再融资（定增）事宜。该客户原由投行部负责，但董秘临时联系了资管员工张三。",
    source: "公司大圆桌",
    time: "2026-05-21 09:30",
    timeline: [
      { time: "09:30", content: "资管员工张三收到客户董秘来电，记录需求", done: true },
      { time: "09:45", content: "上报协同端，发起跨部门协调申请", done: true },
      { time: "10:00", content: "投行部确认接待方案，资管部配合协助", done: false },
      { time: "11:30", content: "董事长到访，联合接待", done: false },
    ],
  },
  {
    id: "em-002",
    priority: "high",
    type: "内部协调处置",
    title: "证监会派出机构临时来公司进行政策宣导",
    desc: "今日上午，公司接到辖区证监局通知，为贯彻最新《国九条》及配套政策，证监局将于今日下午派员来公司进行专题宣导，要求公司全体高管、投行业务全体骨干参加。预计宣导时长2小时，之后设有互动答疑环节。",
    source: "公司大圆桌",
    time: "2026-05-21 10:15",
    timeline: [
      { time: "10:15", content: "收到证监局通知，记录宣导安排", done: true },
      { time: "10:30", content: "通知全体高管及投行骨干，确认出席名单", done: true },
      { time: "13:30", content: "证监局人员到场，专题宣导开始", done: false },
      { time: "15:30", content: "互动答疑，整理会议纪要", done: false },
    ],
  },
  {
    id: "em-003",
    priority: "medium",
    type: "合规监管响应",
    title: "反洗钱可疑交易报告逾期预警",
    desc: "合规部系统检测到一笔涉及¥5,200,000的可疑交易，按规定需在48小时内完成SAR报告提交。当前已过36小时，仍未完成审核流程，存在逾期合规风险。",
    source: "合规系统",
    time: "2026-05-20 21:00",
    timeline: [
      { time: "昨日 21:00", content: "系统自动识别可疑交易，发起预警", done: true },
      { time: "今日 08:00", content: "合规专员开始审核，收集相关凭证", done: true },
      { time: "今日 14:00", content: "提交合规总监审批", done: false },
      { time: "今日 17:00", content: "SAR报告提交至监管系统（截止时间）", done: false },
    ],
  },
]

function EmergencySection() {
  const [filter, setFilter] = useState<"all" | "high">("all")
  const [expandedIds, setExpandedIds] = useState<Set<string>>(new Set())

  const toggleExpand = (id: string) => {
    setExpandedIds(prev => {
      const next = new Set(prev)
      next.has(id) ? next.delete(id) : next.add(id)
      return next
    })
  }

  const displayed = filter === "high"
    ? emergencyEvents.filter(e => e.priority === "high")
    : emergencyEvents

  const highCount = emergencyEvents.filter(e => e.priority === "high").length

  const priorityLabel: Record<EmergencyPriority, { label: string; color: string; bg: string; border: string }> = {
    high: { label: "高优先", color: "text-destructive", bg: "bg-destructive/10", border: "border-l-destructive" },
    medium: { label: "中优先", color: "text-warning", bg: "bg-warning/10", border: "border-l-warning" },
  }

  const typeColor: Record<EmergencyType, string> = {
    "突发事件处置": "text-orange-600 bg-orange-500/10",
    "内部协调处置": "text-blue-600 bg-blue-500/10",
    "合规监管响应": "text-destructive bg-destructive/10",
    "舆情危机处置": "text-purple-600 bg-purple-500/10",
  }

  return (
    <div className="p-5 space-y-4">
      {/* 顶部标题栏 */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <Siren className="w-4 h-4 text-destructive" />
          <span className="text-base font-bold text-foreground">待处理应急事件</span>
          <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-muted text-foreground">
            {emergencyEvents.length} 件
          </span>
          <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-destructive/10 text-destructive">
            高优先 {highCount}
          </span>
        </div>
        <div className="flex items-center gap-2">
          <div className="flex items-center border border-border rounded-lg overflow-hidden text-xs">
            <button
              onClick={() => setFilter("all")}
              className={cn(
                "px-3 py-1.5 flex items-center gap-1 transition-colors",
                filter === "all" ? "bg-muted text-foreground font-medium" : "text-muted-foreground hover:bg-muted/50"
              )}
            >
              <Filter className="w-3 h-3" />
              全部类型
            </button>
            <button
              onClick={() => setFilter("high")}
              className={cn(
                "px-3 py-1.5 transition-colors border-l border-border",
                filter === "high" ? "bg-destructive/10 text-destructive font-medium" : "text-muted-foreground hover:bg-muted/50"
              )}
            >
              仅看紧急
            </button>
          </div>
          <button className="flex items-center gap-1.5 px-3 py-1.5 bg-destructive text-destructive-foreground rounded-lg text-xs font-semibold hover:opacity-90 transition-opacity">
            <Plus className="w-3.5 h-3.5" />
            发起应急事项
          </button>
        </div>
      </div>

      {/* 事件卡片列表 */}
      <div className="space-y-3">
        {displayed.map((ev) => {
          const pCfg = priorityLabel[ev.priority]
          const isExpanded = expandedIds.has(ev.id)
          return (
            <div
              key={ev.id}
              className={cn(
                "bg-card border border-l-4 rounded-xl overflow-hidden",
                pCfg.border,
                "border-border"
              )}
            >
              <div className="px-5 pt-4 pb-3">
                {/* 顶行：优先级 + 类型 + 来源 + 跳转 */}
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-1.5">
                    <span className={cn("text-[10px] font-bold px-1.5 py-0.5 rounded-sm", pCfg.bg, pCfg.color)}>
                      {pCfg.label}
                    </span>
                    <span className={cn("text-[10px] font-medium px-1.5 py-0.5 rounded-sm", typeColor[ev.type])}>
                      {ev.type}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] text-muted-foreground">来源 {ev.source}</span>
                    <button className="w-6 h-6 rounded-lg bg-muted flex items-center justify-center hover:bg-primary/10 hover:text-primary transition-colors">
                      <ArrowUpRight className="w-3.5 h-3.5 text-muted-foreground" />
                    </button>
                  </div>
                </div>

                {/* 标题 */}
                <div className="text-sm font-semibold text-foreground mb-1.5 leading-snug">
                  {ev.title}
                </div>

                {/* 描述 */}
                <p className="text-xs text-muted-foreground leading-relaxed">
                  {ev.desc}
                </p>

                {/* 时间轴展开按钮 */}
                <button
                  onClick={() => toggleExpand(ev.id)}
                  className="mt-3 flex items-center gap-1 text-[11px] text-muted-foreground hover:text-primary transition-colors"
                >
                  <Clock className="w-3 h-3" />
                  <span>事件响应时间轴</span>
                  {isExpanded ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
                </button>

                {/* 时间轴内容 */}
                {isExpanded && (
                  <div className="mt-3 pl-2 border-l-2 border-border space-y-2.5">
                    {ev.timeline.map((t, i) => (
                      <div key={i} className="flex items-start gap-3">
                        <div className={cn(
                          "w-2 h-2 rounded-full mt-1 shrink-0 -ml-[5px]",
                          t.done ? "bg-primary" : "bg-border"
                        )} />
                        <div className="flex items-start gap-2 flex-1">
                          <span className="text-[10px] text-muted-foreground shrink-0 mt-0.5 w-16">{t.time}</span>
                          <span className={cn("text-xs leading-relaxed", t.done ? "text-foreground" : "text-muted-foreground")}>
                            {t.content}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

// ─── 公共子组件 ───────────────────────────────────────
function SectionTitle({ icon: Icon, title, sub }: { icon: React.ElementType; title: string; sub: string }) {
  return (
    <div className="flex items-center gap-3">
      <div className="w-9 h-9 rounded-xl bg-primary/10 flex items-center justify-center">
        <Icon className="w-5 h-5 text-primary" />
      </div>
      <div>
        <div className="text-base font-bold text-foreground">{title}</div>
        <div className="text-xs text-muted-foreground">{sub}</div>
      </div>
    </div>
  )
}

function RiskStat({ label, value, color, bg }: { label: string; value: number; color: string; bg: string }) {
  return (
    <div className={cn("rounded-xl p-4 flex items-center gap-3", bg)}>
      <span className={cn("text-3xl font-bold", color)}>{value}</span>
      <span className="text-sm text-muted-foreground">{label}</span>
    </div>
  )
}

function AIAdviceCard({ advice }: { advice: string[] }) {
  return (
    <div className="bg-primary/4 border border-primary/15 rounded-xl p-5">
      <div className="flex items-center gap-2 mb-3">
        <div className="w-5 h-5 rounded bg-primary/20 flex items-center justify-center">
          <span className="text-[10px] font-bold text-primary">AI</span>
        </div>
        <span className="text-sm font-semibold text-primary">AI 建议</span>
      </div>
      <div className="space-y-2">
        {advice.map((a, i) => (
          <div key={i} className="flex gap-2.5 text-sm text-foreground">
            <span className="shrink-0 text-primary font-bold">{i + 1}.</span>
            <span className="leading-relaxed">{a}</span>
          </div>
        ))}
      </div>
    </div>
  )
}

// ─── 议题卡片 ─────────────────────────────────────────
function AgendaCard({ agenda, isSelected, onClick }: { agenda: Agenda; isSelected: boolean; onClick: () => void }) {
  const typeCfg = agendaTypeConfig[agenda.agendaType]
  const pCfg = priorityConfig[agenda.priority]

  // AI 建议文本（根据优先级和类型生成）
  const aiSuggests: Record<string, string> = {
    "ag-001": "建议召集条线负责人协商",
    "ag-002": "建议提交财务部审批",
    "ag-003": "建议数据治理团队先行评估",
    "ag-004": "无需决策，可知晓归档",
    "ag-005": "建议本周内召集各条线确认指标精简方案",
  }
  const aiSuggest = aiSuggests[agenda.id] ?? "建议安排专项讨论"

  return (
    <div
      onClick={onClick}
      className={cn(
        "group bg-card border border-l-4 rounded-xl overflow-hidden cursor-pointer transition-all duration-200",
        agenda.priority === "high" ? "border-l-destructive" :
        agenda.priority === "medium" ? "border-l-warning" : "border-l-blue-400",
        isSelected ? "border-primary shadow-md ring-1 ring-primary/20" : "border-border hover:border-primary/30 hover:shadow-sm",
        agenda.priority === "info" && !isSelected && "opacity-80"
      )}
    >
      {/* 卡片主体 */}
      <div className="px-4 pt-3 pb-2">
        {/* 顶行：优先级 + 类型 + 时间 */}
        <div className="flex items-center gap-1.5 mb-2">
          <span className={cn("text-[10px] font-bold px-1.5 py-0.5 rounded-sm", pCfg.bg, pCfg.color)}>
            {pCfg.label}
          </span>
          <span className={cn("text-[10px] px-1.5 py-0.5 rounded-sm font-medium", typeCfg.bg, typeCfg.color)}>
            {typeCfg.label}
          </span>
          <span className="text-[10px] text-muted-foreground ml-auto">{agenda.initiatedAt}</span>
        </div>

        {/* 标题 */}
        <div className="text-sm font-semibold text-foreground group-hover:text-primary transition-colors leading-snug mb-1.5">
          {agenda.topic}
        </div>

        {/* 摘要描述 */}
        <p className="text-xs text-muted-foreground leading-relaxed line-clamp-2 mb-3">
          {agenda.description}
        </p>

        {/* AI 建议条 */}
        <div className="flex items-center gap-2 px-3 py-2 bg-primary/5 border border-primary/15 rounded-lg mb-3">
          <div className="w-4 h-4 rounded bg-primary/20 flex items-center justify-center shrink-0">
            <span className="text-[9px] font-bold text-primary">AI</span>
          </div>
          <span className="text-xs text-foreground">
            <span className="font-semibold text-primary">AI建议：</span>
            {aiSuggest}
          </span>
        </div>

        {/* 操作按钮行 */}
        <div className="flex items-center gap-2 flex-wrap">
          {agenda.priority === "info" ? (
            <button
              onClick={(e) => e.stopPropagation()}
              className="px-3 py-1.5 bg-blue-500/10 text-blue-600 border border-blue-500/20 rounded-lg text-xs font-semibold hover:bg-blue-500/20 transition-colors"
            >
              已知晓
            </button>
          ) : (
            <>
              <button
                onClick={(e) => e.stopPropagation()}
                className="px-3 py-1.5 bg-primary text-primary-foreground rounded-lg text-xs font-semibold hover:opacity-90 transition-opacity"
              >
                批准执行
              </button>
              <button
                onClick={(e) => e.stopPropagation()}
                className="px-3 py-1.5 bg-background text-foreground border border-border rounded-lg text-xs font-medium hover:bg-muted transition-colors"
              >
                批注意见
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  )
}

// ─── 议题详情面板 ─────────────────────────────────────
function AgendaDetailPanel({ agenda, onClose }: { agenda: Agenda; onClose: () => void }) {
  const [showInstructions, setShowInstructions] = useState(true)
  const typeCfg = agendaTypeConfig[agenda.agendaType]
  const TypeIcon = typeCfg.icon
  const pCfg = priorityConfig[agenda.priority]
  const sCfg = statusConfig[agenda.status]

  return (
    <aside className="w-96 shrink-0 border-l border-border bg-card">
      <div className="bg-card border-b border-border px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className={cn("p-1.5 rounded-lg", typeCfg.bg)}>
            <TypeIcon className={cn("w-3.5 h-3.5", typeCfg.color)} />
          </div>
          <span className="text-sm font-semibold">议题详情</span>
        </div>
        <button onClick={onClose} className="w-7 h-7 rounded-lg flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-muted transition-all">✕</button>
      </div>
      <div className="p-4 space-y-4">
        <div>
          <div className="text-sm font-semibold leading-snug mb-2.5">{agenda.topic}</div>
          <div className="flex flex-wrap gap-1.5">
            <span className={cn("text-xs px-2 py-0.5 rounded-full font-medium", pCfg.bg, pCfg.color)}>{pCfg.label}</span>
            <span className={cn("text-xs px-2 py-0.5 rounded-full bg-muted", sCfg.color)}>{sCfg.label}</span>
            <span className={cn("text-xs px-2 py-0.5 rounded-full bg-muted", typeCfg.color)}>{typeCfg.label}</span>
          </div>
        </div>
        <div className="h-px bg-border" />
        <div className="space-y-2">
          <MetaRow label="发起人" value={agenda.initiator} />
          <MetaRow label="发起时间" value={agenda.initiatedAt} />
          <MetaRow label="触发方式" value={agenda.triggerType === "proactive" ? "主动发起" : agenda.triggerType === "rule" ? "规则知会" : "事项升级"} />
        </div>
        <div className="h-px bg-border" />
        <div>
          <div className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-2">议题背景</div>
          <p className="text-xs text-foreground leading-relaxed">{agenda.description}</p>
        </div>
        <div className="h-px bg-border" />
        <div>
          <div className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-2.5">参与方</div>
          <div className="mb-2">
            <div className="text-xs text-muted-foreground mb-1.5">涉及部门</div>
            <div className="flex flex-wrap gap-1.5">{agenda.deptInvolved.map((d) => <span key={d} className="text-xs px-2 py-0.5 bg-muted rounded text-foreground">{d}</span>)}</div>
          </div>
          <div>
            <div className="text-xs text-muted-foreground mb-1.5">协调领导</div>
            <div className="flex flex-wrap gap-1.5">{agenda.coordinators.map((c) => <span key={c} className="text-xs px-2 py-0.5 bg-primary/10 rounded text-primary font-medium">{c}</span>)}</div>
          </div>
        </div>
        {agenda.decision && (
          <>
            <div className="h-px bg-border" />
            <div>
              <div className="flex items-center gap-1.5 mb-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-success" />
                <span className="text-xs font-semibold text-success uppercase tracking-wide">决策结论</span>
              </div>
              <div className="bg-success/5 border border-success/20 rounded-lg p-3">
                <p className="text-xs text-foreground leading-relaxed">{agenda.decision}</p>
              </div>
            </div>
          </>
        )}
        {agenda.instructions && agenda.instructions.length > 0 && (
          <>
            <div className="h-px bg-border" />
            <div>
              <button onClick={() => setShowInstructions(!showInstructions)} className="w-full flex items-center justify-between mb-2">
                <div className="flex items-center gap-1.5">
                  <Send className="w-3.5 h-3.5 text-primary" />
                  <span className="text-xs font-semibold text-primary uppercase tracking-wide">指令执行追踪</span>
                </div>
                {showInstructions ? <ChevronUp className="w-3.5 h-3.5 text-muted-foreground" /> : <ChevronDown className="w-3.5 h-3.5 text-muted-foreground" />}
              </button>
              {showInstructions && (
                <div className="space-y-2">
                  {agenda.instructions.map((ins, i) => (
                    <div key={i} className={cn("p-3 rounded-lg border text-xs", ins.trackStatus === "done" ? "bg-success/5 border-success/20" : ins.trackStatus === "overdue" ? "bg-destructive/5 border-destructive/20" : "bg-muted border-border")}>
                      <div className="flex items-center justify-between mb-1">
                        <span className="font-medium text-foreground">{ins.dept}</span>
                        <span className={cn("px-1.5 py-0.5 rounded text-xs font-medium", ins.trackStatus === "done" ? "bg-success/15 text-success" : ins.trackStatus === "overdue" ? "bg-destructive/15 text-destructive" : "bg-muted text-muted-foreground")}>
                          {ins.trackStatus === "done" ? "已完成" : ins.trackStatus === "overdue" ? "已逾期" : "执行中"}
                        </span>
                      </div>
                      <p className="text-muted-foreground leading-relaxed mb-1">{ins.content}</p>
                      <div className="flex items-center gap-1 text-muted-foreground">
                        <Clock className="w-3 h-3" />
                        <span>截止 {ins.deadline}</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </>
        )}
        <div className="h-px bg-border" />
        <div className="space-y-2">
          {agenda.priority === "info" ? (
            <button className="w-full py-2 bg-blue-500/10 text-blue-600 border border-blue-500/20 rounded-lg text-sm font-medium hover:bg-blue-500/20 transition-colors">已知晓，无需处理</button>
          ) : agenda.status === "decided" || agenda.status === "issued" ? (
            <button className="w-full py-2 bg-primary text-primary-foreground rounded-lg text-sm font-medium hover:opacity-90 transition-opacity flex items-center justify-center gap-2">
              <Send className="w-4 h-4" />下发/更新执行指令
            </button>
          ) : (
            <>
              <button className="w-full py-2 bg-primary text-primary-foreground rounded-lg text-sm font-medium hover:opacity-90 transition-opacity">批准执行</button>
              <div className="flex gap-2">
                <button className="flex-1 py-2 bg-background text-destructive border border-destructive/40 rounded-lg text-sm font-semibold hover:bg-destructive/5 transition-colors">驳回</button>
                <button className="flex-1 py-2 bg-background text-foreground border border-border rounded-lg text-sm font-medium hover:bg-muted transition-colors">转交</button>
                <button className="flex-1 py-2 bg-background text-foreground border border-border rounded-lg text-sm font-medium hover:bg-muted transition-colors">批注意见</button>
              </div>
            </>
          )}
        </div>
      </div>
    </aside>
  )
}

function MetaRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-start justify-between text-xs gap-4">
      <span className="text-muted-foreground shrink-0">{label}</span>
      <span className="text-foreground font-medium text-right">{value}</span>
    </div>
  )
}
