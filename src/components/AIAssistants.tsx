import {
  Search,
  Users,
  FileText,
  Headphones,
  ChevronRight,
} from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { useChatContext } from "@/App"

const assistants = [
  {
    id: "customer-analysis",
    name: "客户分析助手",
    image: "/images/agent-business.png",
    icon: Users,
    title: "客户分析",
    desc: "全面分析客户资产负债、现金流、资产配置三个本质维度",
    stat: "12个客户",
    statVariant: "default" as const,
    chatPrompt: "帮我对当前跟进客户进行全面分析，重点从资产负债情况、现金流情况、当前资产配置三个维度出发，给出客户画像和机会判断。",
    accent: "from-[hsl(200,70%,50%)] to-[hsl(215,65%,55%)]",
  },
  {
    id: "business-analysis",
    name: "业务分析助手",
    image: "/images/agent-approval.png",
    icon: Search,
    title: "业务分析",
    desc: "挖掘业务机会，分析可行性与竞争态势",
    stat: "5个机会",
    statVariant: "success" as const,
    chatPrompt: "帮我分析当前业务管道中的机会，按照可行性和潜在收益排序，说明每个机会的核心推进逻辑和风险点。",
    accent: "from-[hsl(28,85%,55%)] to-[hsl(38,90%,60%)]",
  },
  {
    id: "plan-generation",
    name: "方案生成助手",
    image: "/images/agent-risk.png",
    icon: FileText,
    title: "方案生成",
    desc: "基于客户分析结果快速生成个性化业务方案",
    stat: "制定方案",
    statVariant: "warning" as const,
    chatPrompt: "基于已有的客户分析结果，帮我生成一份完整的业务方案，包括产品建议、定价策略、推进步骤和预期收益。",
    accent: "from-[hsl(38,90%,55%)] to-[hsl(45,95%,60%)]",
  },
  {
    id: "customer-service",
    name: "客户服务助手",
    image: "/images/agent-talent.png",
    icon: Headphones,
    title: "客户服务",
    desc: "跟踪服务进度，高效做好客户日常维护",
    stat: "8条跟进",
    statVariant: "destructive" as const,
    chatPrompt: "帮我梳理当前需要跟进的客户服务事项，按优先级排序，给出每项的跟进建议和话术要点。",
    accent: "from-[hsl(250,55%,55%)] to-[hsl(270,50%,60%)]",
  },
]

export function AIAssistants() {
  const { openChat } = useChatContext()

  const handleClick = (item: (typeof assistants)[number]) => {
    openChat({ name: item.name, image: item.image }, item.chatPrompt)
  }

  return (
    <div className="w-full max-w-[1200px] mx-auto px-6 lg:px-8 pb-32">
      <div className="section-title mb-5">
        <div className="badge-dot" />
        AI 团队
      </div>

      {/* 2×2 grid */}
      <div className="grid grid-cols-2 gap-4">
        {assistants.map((item, i) => (
          <AssistantCard key={item.id} item={item} index={i} onClick={() => handleClick(item)} />
        ))}
      </div>
    </div>
  )
}

interface AssistantCardProps {
  item: (typeof assistants)[number]
  index: number
  onClick: () => void
  className?: string
}

function AssistantCard({ item, index, onClick, className = "" }: AssistantCardProps) {
  const Icon = item.icon

  return (
    <button
      onClick={onClick}
      className={`group relative bg-card border border-border rounded-2xl p-5 text-left cursor-pointer transition-all duration-300 hover:shadow-card-hover hover:-translate-y-1.5 overflow-hidden animate-fade-in ${className}`}
      style={{ animationDelay: `${index * 80}ms` }}
    >
      {/* Accent top bar */}
      <div className={`absolute top-0 left-0 right-0 h-1 rounded-t-2xl bg-gradient-to-r ${item.accent} opacity-50 group-hover:opacity-100 transition-opacity duration-300`} />

      <div className="flex items-center gap-4">
        {/* Avatar with icon badge */}
        <div className="relative shrink-0">
          <div className="w-12 h-12 rounded-2xl overflow-hidden border border-border group-hover:border-primary/30 transition-all duration-300 group-hover:scale-110 shadow-card">
            <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
          </div>
          <div className={`absolute -bottom-1 -right-1 w-5 h-5 rounded-lg bg-gradient-to-br ${item.accent} flex items-center justify-center shadow-sm`}>
            <Icon className="w-2.5 h-2.5 text-primary-foreground" />
          </div>
        </div>

        {/* Text content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <span className="text-sm font-semibold text-foreground group-hover:text-primary transition-colors">
              {item.title}
            </span>
            <Badge variant={item.statVariant} className="text-[10px]">
              {item.stat}
            </Badge>
          </div>
          <div className="text-xs text-muted-foreground">{item.desc}</div>
        </div>

        {/* Arrow indicator */}
        <ChevronRight className="w-4 h-4 text-muted-foreground/30 group-hover:text-primary group-hover:translate-x-0.5 transition-all duration-200 shrink-0" />
      </div>
    </button>
  )
}
