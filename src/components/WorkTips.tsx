import { AlertTriangle, Clock, FileCheck, TrendingUp, ChevronRight } from "lucide-react"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { useChatContext } from "@/App"

const tips = [
  {
    type: "urgent",
    icon: AlertTriangle,
    title: "3笔大额资金审批待处理",
    desc: "涉及金额共计￥2,850,000.00，其中1笔超过审批时限，请尽快处理。",
    badge: "紧急",
    badgeVariant: "destructive" as const,
    time: "10分钟前",
    chatMsg: "帮我看看待处理的大额资金审批详情",
  },
  {
    type: "risk",
    icon: AlertTriangle,
    title: "合规风险预警：某分支机构客户投诉率上升12%",
    desc: "近30日该机构投诉量较上月同期增长明显，建议关注并安排核查。",
    badge: "风险",
    badgeVariant: "warning" as const,
    time: "30分钟前",
    chatMsg: "分析一下分支机构客户投诉率上升的风险情况",
  },
  {
    type: "progress",
    icon: TrendingUp,
    title: "Q2重点项目「数字化转型」进度更新至68%",
    desc: "已完成基础架构搭建和数据迁移，下阶段将启动业务模块开发。",
    badge: "进展",
    badgeVariant: "success" as const,
    time: "1小时前",
    chatMsg: "告诉我数字化转型项目的详细经营进展",
  },
  {
    type: "approval",
    icon: FileCheck,
    title: "5项人事审批待签署",
    desc: "包含2项晋升审批、1项调岗申请、2项离职交接确认。",
    badge: "待办",
    badgeVariant: "default" as const,
    time: "2小时前",
    chatMsg: "帮我查看待签署的人事审批详情",
  },
  {
    type: "schedule",
    icon: Clock,
    title: "今日14:00 季度经营分析会",
    desc: "参会人员已确认8人，会议材料已上传，请提前审阅财务报告。",
    badge: "日程",
    badgeVariant: "secondary" as const,
    time: "今日",
    chatMsg: "帮我准备季度经营分析会的要点",
  },
]

export function WorkTips() {
  const { openChat } = useChatContext()

  const handleTipClick = (tip: (typeof tips)[0]) => {
    const agentMap: Record<string, { name: string; image: string }> = {
      urgent: { name: "审批助手", image: "/images/agent-approval.png" },
      risk: { name: "风控合规助手", image: "/images/agent-risk.png" },
      progress: { name: "经营分析助手", image: "/images/agent-business.png" },
      approval: { name: "审批助手", image: "/images/agent-approval.png" },
      schedule: { name: "战略决策助手", image: "/images/agent-strategy.png" },
    }
    const agent = agentMap[tip.type] || agentMap.urgent
    openChat(agent, tip.chatMsg)
  }

  return (
    <Card className="mx-8 mb-6 animate-fade-in max-w-[1200px] xl:mx-auto">
      <div className="p-5">
        <div className="flex items-center justify-between mb-4">
          <div className="section-title">
            <div className="badge-dot" />
            工作提示
          </div>
          <Button variant="ghost" size="sm" className="text-primary">
            查看全部
            <ChevronRight className="w-4 h-4 ml-1" />
          </Button>
        </div>

        <div className="space-y-2">
          {tips.map((tip, index) => {
            const Icon = tip.icon
            return (
              <div
                key={index}
                onClick={() => handleTipClick(tip)}
                className="flex items-start gap-3 p-3 rounded-lg bg-secondary/40 hover:bg-secondary transition-colors cursor-pointer group"
              >
                <div className="mt-0.5">
                  <Icon
                    className={`w-4 h-4 ${
                      tip.type === "urgent"
                        ? "text-destructive"
                        : tip.type === "risk"
                          ? "text-warning"
                          : tip.type === "progress"
                            ? "text-success"
                            : "text-primary"
                    }`}
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-0.5">
                    <span className="text-sm font-medium text-foreground">
                      {tip.title}
                    </span>
                    <Badge variant={tip.badgeVariant}>{tip.badge}</Badge>
                  </div>
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    {tip.desc}
                  </p>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <span className="text-xs text-muted-foreground">
                    {tip.time}
                  </span>
                  <span className="text-xs text-primary opacity-0 group-hover:opacity-100 transition-opacity">
                    点击咨询 AI &rarr;
                  </span>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </Card>
  )
}
