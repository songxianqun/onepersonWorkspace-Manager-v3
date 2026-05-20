import { useState } from "react"
import { BarChart2, ChevronRight, ChevronDown, ChevronUp } from "lucide-react"

const kpiCards = [
  {
    icon: "💰",
    title: "客户总资产",
    hint: "点击选择时间段查看明细",
  },
  {
    icon: "📈",
    title: "客户带来的总收入",
    hint: "点击选择时间段查看明细",
  },
  {
    icon: "💵",
    title: "维护客户的总成本",
    hint: "点击选择时间段查看明细",
  },
]

export function PerformancePanel() {
  const [expanded, setExpanded] = useState(false)
  const [startDate, setStartDate] = useState("2026-01-01")
  const [endDate, setEndDate] = useState("2026-01-31")
  const [calculated, setCalculated] = useState(true)

  return (
    <div className="px-8 pb-4 max-w-[1200px] mx-auto">
      {/* 标题 + 收起展开按钮 */}
      <button
        onClick={() => setExpanded(!expanded)}
        className="flex items-center justify-between w-full mb-4 group"
      >
        <div className="flex items-center gap-2">
          <BarChart2 className="w-[18px] h-[18px] text-foreground" />
          <span className="text-base font-bold text-foreground">业绩与绩效</span>
        </div>
        <div className="w-7 h-7 rounded-lg flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-muted transition-all">
          {expanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
        </div>
      </button>

      {expanded && (
        <>
          {/* ── 业绩看板 ── */}
          <div className="mb-1">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-1 h-4 rounded-full bg-[hsl(var(--warning))]" />
              <span className="text-sm font-semibold text-foreground">业绩看板</span>
            </div>

            <div className="grid grid-cols-3 gap-3">
              {kpiCards.map((card) => (
                <button
                  key={card.title}
                  className="group flex items-center gap-4 bg-card border border-border rounded-xl px-5 py-4 text-left hover:border-primary/30 hover:shadow-sm transition-all duration-200"
                >
                  <span className="text-2xl shrink-0">{card.icon}</span>
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-semibold text-foreground mb-1">{card.title}</div>
                    <div className="text-xs text-muted-foreground">{card.hint}</div>
                  </div>
                  <ChevronRight className="w-4 h-4 text-muted-foreground/40 group-hover:text-primary/50 transition-colors shrink-0" />
                </button>
              ))}
            </div>
          </div>

          {/* ── 预计绩效收入 ── */}
          <div className="mt-5">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-1 h-4 rounded-full bg-[hsl(var(--warning))]" />
              <span className="text-sm font-semibold text-foreground">预计绩效收入</span>
            </div>

            <div className="bg-card border border-border rounded-xl px-6 py-5">
              <div className="flex items-center gap-8">
                {/* 时间段选择 */}
                <div className="flex items-center gap-3 flex-1">
                  <span className="text-sm text-muted-foreground whitespace-nowrap shrink-0">选择时间段：</span>
                  <input
                    type="date"
                    value={startDate}
                    onChange={(e) => { setStartDate(e.target.value); setCalculated(false) }}
                    className="px-3 py-2 rounded-lg border border-border bg-background text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary/50 transition-all"
                  />
                  <span className="text-sm text-muted-foreground">至</span>
                  <input
                    type="date"
                    value={endDate}
                    onChange={(e) => { setEndDate(e.target.value); setCalculated(false) }}
                    className="px-3 py-2 rounded-lg border border-border bg-background text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary/50 transition-all"
                  />
                  <button
                    onClick={() => setCalculated(true)}
                    className="px-5 py-2 rounded-lg bg-[hsl(38,80%,52%)] hover:bg-[hsl(38,80%,48%)] text-white text-sm font-medium transition-all duration-150 shadow-sm"
                  >
                    计算
                  </button>
                </div>

                {/* 计算结果 */}
                {calculated && (
                  <div className="shrink-0 bg-background border border-border rounded-xl px-6 py-4 min-w-[200px] space-y-3">
                    <div className="flex items-center justify-between gap-6">
                      <span className="text-sm text-muted-foreground">客户带来的收入</span>
                      <span className="text-sm font-bold text-foreground">30万元</span>
                    </div>
                    <div className="h-px bg-border" />
                    <div className="flex items-center justify-between gap-6">
                      <span className="text-sm text-muted-foreground">预计可获得绩效奖金</span>
                      <span className="text-base font-bold text-[hsl(38,80%,45%)]">6万元</span>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  )
}
