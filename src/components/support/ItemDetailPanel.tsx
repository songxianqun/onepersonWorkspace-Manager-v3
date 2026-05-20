import { X, Bot, User, Clock, Building2, ArrowUpRight } from "lucide-react"
import { type WorkItem } from "@/data/supportData"
import { cn } from "@/lib/utils"

interface Props {
  item: WorkItem
  onClose: () => void
}

export function ItemDetailPanel({ item, onClose }: Props) {
  return (
    <aside className="w-80 shrink-0 border-l border-border bg-card overflow-y-auto">
      {/* 头部 */}
      <div className="sticky top-0 bg-card border-b border-border px-4 py-3 flex items-center justify-between">
        <span className="text-sm font-semibold text-foreground">事项详情</span>
        <button
          onClick={onClose}
          className="w-7 h-7 rounded-lg flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-muted transition-all"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      <div className="p-4 space-y-4">
        {/* 标题 */}
        <div>
          <div className="text-sm font-semibold text-foreground leading-snug mb-2">{item.title}</div>
          <div className="flex flex-wrap gap-1.5">
            <span
              className={cn(
                "text-xs px-2 py-0.5 rounded-full font-medium",
                item.businessLine === "资管"
                  ? "bg-orange-500/10 text-orange-600"
                  : item.businessLine === "投行"
                  ? "bg-blue-500/10 text-blue-600"
                  : "bg-green-600/10 text-green-700"
              )}
            >
              {item.businessLine}
            </span>
            <span className="text-xs px-2 py-0.5 rounded-full bg-muted text-muted-foreground">{item.stage}</span>
            <span
              className={cn(
                "text-xs px-2 py-0.5 rounded-full font-medium",
                item.priority === "urgent"
                  ? "bg-destructive/10 text-destructive"
                  : item.priority === "normal"
                  ? "bg-warning/10 text-warning"
                  : "bg-blue-500/10 text-blue-600"
              )}
            >
              {item.priority === "urgent" ? "紧急" : item.priority === "normal" ? "普通" : "关注"}
            </span>
          </div>
        </div>

        <div className="h-px bg-border" />

        {/* 事项主体（三层无歧义描述） */}
        <div>
          <div className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-3">
            事项主体（对象-动作-结果）
          </div>
          <div className="space-y-2.5">
            <SubjectRow icon={Building2} label="对象" value={item.subject.object} />
            <SubjectRow icon={User} label="动作" value={item.subject.action} />
            <SubjectRow icon={Clock} label="结果" value={item.subject.result} />
          </div>
        </div>

        <div className="h-px bg-border" />

        {/* AI 预判详情 */}
        <div>
          <div className="flex items-center gap-1.5 mb-3">
            <Bot className="w-3.5 h-3.5 text-primary" />
            <span className="text-xs font-semibold text-primary uppercase tracking-wide">AI 预判结论</span>
          </div>
          <div className="bg-primary/5 border border-primary/15 rounded-lg p-3">
            <p className="text-xs text-foreground leading-relaxed">{item.aiPrejudge}</p>
          </div>
          <div className="mt-2.5 flex items-center gap-1.5 text-xs text-muted-foreground">
            <span>AI建议动作：</span>
            <span
              className={cn(
                "px-2 py-0.5 rounded font-medium",
                item.aiAction === "escalate"
                  ? "bg-destructive/10 text-destructive"
                  : item.aiAction === "supplement"
                  ? "bg-warning/10 text-warning"
                  : "bg-success/10 text-success"
              )}
            >
              {item.aiAction === "handle" ? "可直接处理" : item.aiAction === "supplement" ? "建议补录数据" : "建议提请协同"}
            </span>
          </div>
        </div>

        <div className="h-px bg-border" />

        {/* 元信息 */}
        <div className="space-y-2">
          <MetaRow label="提交人" value={item.submitter} />
          <MetaRow label="提交时间" value={item.submittedAt} />
          <MetaRow label="来源类型" value={item.sourceType === "submitted" ? "员工主动提交" : item.sourceType === "rule" ? "规则自动触发" : "支持人员主动介入"} />
          <MetaRow
            label="当前状态"
            value={item.status === "pending" ? "待处理" : item.status === "processing" ? "处理中" : item.status === "done" ? "已完成" : "已提请协同"}
          />
        </div>

        {item.escalatedAgendaId && (
          <>
            <div className="h-px bg-border" />
            <div className="flex items-center gap-2 p-3 bg-destructive/5 border border-destructive/20 rounded-lg">
              <ArrowUpRight className="w-4 h-4 text-destructive shrink-0" />
              <div>
                <div className="text-xs font-medium text-destructive">已升级至协同端</div>
                <div className="text-xs text-muted-foreground mt-0.5">议题 #{item.escalatedAgendaId}</div>
              </div>
            </div>
          </>
        )}

        <div className="h-px bg-border" />

        {/* 操作区 */}
        <div className="space-y-2">
          {item.sourceType === "rule" ? (
            <>
              <button className="w-full py-2 bg-primary text-primary-foreground rounded-lg text-sm font-medium hover:opacity-90 transition-opacity">
                主动介入处理
              </button>
              <button className="w-full py-2 bg-muted text-muted-foreground rounded-lg text-sm font-medium hover:text-foreground transition-colors">
                已知晓，继续观察
              </button>
            </>
          ) : item.status === "escalated" ? (
            <button className="w-full py-2 bg-muted text-muted-foreground rounded-lg text-sm font-medium hover:text-foreground transition-colors flex items-center justify-center gap-2">
              <ArrowUpRight className="w-4 h-4" />
              跳转查看协同端议题
            </button>
          ) : (
            <>
              <button className="w-full py-2 bg-primary text-primary-foreground rounded-lg text-sm font-medium hover:opacity-90 transition-opacity">
                确认处理
              </button>
              <button className="w-full py-2 bg-warning/10 text-warning border border-warning/20 rounded-lg text-sm font-medium hover:bg-warning/20 transition-colors">
                退回，请员工补录数据
              </button>
              <button className="w-full py-2 bg-destructive/10 text-destructive border border-destructive/20 rounded-lg text-sm font-medium hover:bg-destructive/20 transition-colors">
                提请协同端处理
              </button>
            </>
          )}
        </div>
      </div>
    </aside>
  )
}

function SubjectRow({ icon: Icon, label, value }: { icon: React.ElementType; label: string; value: string }) {
  return (
    <div className="flex gap-2">
      <div className="flex items-center gap-1 shrink-0 w-10">
        <Icon className="w-3 h-3 text-muted-foreground" />
        <span className="text-xs text-muted-foreground">{label}</span>
      </div>
      <p className="text-xs text-foreground leading-relaxed flex-1">{value}</p>
    </div>
  )
}

function MetaRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between text-xs">
      <span className="text-muted-foreground">{label}</span>
      <span className="text-foreground font-medium">{value}</span>
    </div>
  )
}
