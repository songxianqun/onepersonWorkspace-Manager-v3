import { AlertTriangle, Clock, FileCheck, TrendingUp, ChevronRight } from "lucide-react"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { useChatContext } from "@/App"

const tips = [
  {
    type: "visit",
    icon: Clock,
    title: "今日14:00 拜访气派科技董秘",
    desc: "讨论新一轮再融资（定增）事宜，请提前准备同行业近期定增案例及报价方案。",
    badge: "日程",
    badgeVariant: "secondary" as const,
    time: "今日",
    chatMsg: "帮我准备气派科技拜访的材料和同行业定增案例",
  },
  {
    type: "sales",
    icon: TrendingUp,
    title: "3名高净值客户的固收产品即将到期",
    desc: "总计到期金额￥15,000,000，建议重点推荐下周新发行的「稳健盈」系列理财产品。",
    badge: "销售",
    badgeVariant: "success" as const,
    time: "10分钟前",
    chatMsg: "帮我生成一份发给这3位高净值客户的产品推荐话术",
  },
  {
    type: "todo",
    icon: FileCheck,
    title: "芯原半导体IPO项目需补充资料",
    desc: "财务组反馈需补充提交近三年完整的财务流水凭证及核心供应商访谈记录。",
    badge: "待办",
    badgeVariant: "default" as const,
    time: "30分钟前",
    chatMsg: "列出芯原半导体IPO项目还缺少的具体财务资料清单",
  },
  {
    type: "rework",
    icon: AlertTriangle,
    title: "提交的《蓝海企业授信报告》被风控退回",
    desc: "风控中心提示需补充目标企业所在行业的最新周期分析数据，请修改后重新提交。",
    badge: "退回",
    badgeVariant: "destructive" as const,
    time: "1小时前",
    chatMsg: "帮我搜集蓝海企业所在行业的最新周期分析数据",
  },
  {
    type: "opportunity",
    icon: TrendingUp,
    title: "挖掘到一条新的投行业务线索",
    desc: "系统监测到您负责跟进的「星云科技」近期发生实控人变更，可能存在并购重组机会。",
    badge: "商机",
    badgeVariant: "warning" as const,
    time: "2小时前",
    chatMsg: "帮我分析星云科技实控人变更可能带来的并购重组机会",
  },
]

export function WorkTips() {
  const { openChat } = useChatContext()

  const handleTipClick = (tip: (typeof tips)[0]) => {
    const agentMap: Record<string, { name: string; image: string }> = {
      visit: { name: "投行业务助理", image: "/images/avatar-invest-banking.png" },
      sales: { name: "零售业务助理", image: "/images/avatar-retail.png" },
      todo: { name: "投行业务助理", image: "/images/avatar-invest-banking.png" },
      rework: { name: "交叉验证助理", image: "/images/avatar-crosscheck.png" },
      opportunity: { name: "机构业务助理", image: "/images/avatar-institution.png" },
    }
    const agent = agentMap[tip.type] || agentMap.todo
    openChat(agent, tip.chatMsg)
  }

  return (
    <div className="w-full max-w-[1200px] mx-auto px-6 lg:px-8 mb-6 mt-6">
      <Card className="animate-fade-in w-full border-0 shadow-sm ring-1 ring-border">
      <div className="p-5">
        <div className="flex items-center justify-between mb-4">
          <div className="section-title">
            <div className="badge-dot" />
            今日任务
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
    </div>
  )
}
