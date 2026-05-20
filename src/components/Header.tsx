import { useChatContext } from "@/App"

const agents = [
  { name: "投行业务助理", image: "/images/avatar-invest-banking.png" },
  { name: "资管业务助理", image: "/images/avatar-asset-mgmt.png" },
  { name: "零售业务助理", image: "/images/avatar-retail.png" },
  { name: "投资业务助理", image: "/images/avatar-investment.png" },
  { name: "销交业务助理", image: "/images/avatar-sales.png" },
  { name: "机构业务助理", image: "/images/avatar-institution.png" },
  { name: "交叉验证助理", image: "/images/avatar-crosscheck.png" },
]

export function Header() {
  const { openChat } = useChatContext()
  const hour = new Date().getHours()
  const greeting = hour < 12 ? "上午好" : hour < 18 ? "下午好" : "晚上好"

  return (
    <header className="px-8 pt-6 pb-4 max-w-[1200px] mx-auto w-full">
      {/* Title Row */}
      <div className="flex items-center justify-between mb-5">
        <h1 className="text-xl font-bold text-foreground">组织者工作台</h1>
        <div className="text-sm text-muted-foreground">
          {greeting}，张总 |{" "}
          {new Date().toLocaleDateString("zh-CN", {
            year: "numeric",
            month: "long",
            day: "numeric",
            weekday: "long",
          })}
        </div>
      </div>

      {/* Agent Row */}
      <div className="flex items-center gap-5 overflow-x-auto pb-2">
        {agents.map((agent) => (
          <button
            key={agent.name}
            onClick={() => openChat(agent)}
            className="flex flex-col items-center gap-2 group cursor-pointer shrink-0"
          >
            <div className="w-14 h-14 rounded-full overflow-hidden border-2 border-border bg-card group-hover:border-primary/40 transition-all duration-300 group-hover:scale-105 shadow-card">
              <img
                src={agent.image}
                alt={agent.name}
                className="w-full h-full object-cover"
              />
            </div>
            <span className="text-xs text-muted-foreground group-hover:text-primary transition-colors whitespace-nowrap">
              {agent.name}
            </span>
          </button>
        ))}
      </div>
    </header>
  )
}
