import { useState } from "react"
import { Users, MousePointerClick, CheckCircle } from "lucide-react"

export function DesignSchemePage() {
  const [activeTab, setActiveTab] = useState("architecture")

  const tabs = [
    { id: "architecture", label: "整体架构" },
    { id: "workspace", label: "工作台设计" },
  ]

  return (
    <div className="min-h-screen bg-[#f8f9fa] text-slate-800 overflow-y-auto">
      {/* 顶栏 */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-20">
        <div className="max-w-[1200px] mx-auto px-8 pt-6">
          <h1 className="text-2xl font-bold mb-2">员工工作台三端协同——设计方案</h1>
          <p className="text-sm text-slate-500 mb-6">基于518智能体项目会议纪要 · 公司级员工工作台三端建设</p>
          
          {/* Tabs */}
          <div className="flex gap-8 border-b border-transparent">
            {tabs.map((t) => (
              <button
                key={t.id}
                onClick={() => {
                  if (t.id === "workspace") {
                    window.open("https://workv2-igj2601lh.maozi.io/", "_blank", "noreferrer")
                    return
                  }
                  setActiveTab(t.id)
                }}
                className={`pb-3 font-medium text-sm transition-colors relative ${
                  activeTab === t.id && t.id !== "workspace" ? "text-blue-600" : "text-slate-500 hover:text-slate-800"
                }`}
              >
                {t.label}
                {activeTab === t.id && t.id !== "workspace" && (
                  <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-600" />
                )}
              </button>
            ))}
          </div>
        </div>
      </header>

      {/* 内容区域 */}
      <main className="max-w-[1200px] mx-auto px-8 py-8">
        {activeTab === "architecture" && <ArchitectureTab />}
      </main>
    </div>
  )
}

function ArchitectureTab() {
  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="text-sm text-slate-600 leading-relaxed max-w-4xl">
        三端不是独立系统，是同一平台上的三类角色视图。三端都基于公司自动驾驶大模型底座，是一体的。
      </div>

      {/* 架构图区域 */}
      <div className="bg-white rounded-xl p-8 border border-slate-200 shadow-sm">
        <div className="flex gap-6">
          
          {/* 员工端 */}
          <div className="flex-1 bg-teal-50/50 border border-teal-200 rounded-lg p-5 flex flex-col items-center text-center">
            <h3 className="text-teal-800 font-bold mb-1">员工端 (已建)</h3>
            <p className="text-xs text-slate-500 mb-3">客户经理角色</p>
            <div className="space-y-2 text-xs w-full">
              <p className="text-teal-700/80">顶部7个业务智能体</p>
              <p className="text-teal-700/80">专业AI团队服务</p>
              <p className="text-teal-700/80">业绩与绩效数据看板</p>
            </div>
            <div className="mt-auto pt-3 border-t border-teal-200/50 text-[11px] font-semibold text-teal-800 w-full">
              各条线牌照打开，人人可做业务
            </div>
          </div>

          {/* 业务支持端 */}
          <div className="flex-1 bg-amber-50/50 border border-amber-200 rounded-lg p-5 flex flex-col items-center text-center">
            <h3 className="text-amber-800 font-bold mb-1">业务支持端 (新建)</h3>
            <p className="text-xs text-slate-500 mb-3">业务支持角色</p>
            <div className="space-y-2 text-xs w-full">
              <p className="text-amber-700/80">顶部7个支持中心</p>
              <p className="text-amber-700/80">账户、产品、服务等业务支持应用</p>
              <p className="text-amber-700/80">AI机器人推送今日任务</p>
              <p className="text-amber-700/80">AI人机协作</p>
            </div>
            <div className="mt-auto pt-3 border-t border-amber-200/50 text-[11px] font-semibold text-amber-800 w-full">
              模型驱动下同步响应
            </div>
          </div>

          {/* 协同端 */}
          <div className="flex-1 bg-red-50/50 border border-red-200 rounded-lg p-5 flex flex-col items-center text-center">
            <h3 className="text-red-800 font-bold mb-1">协同端 (新建)</h3>
            <p className="text-xs text-slate-500 mb-3">组织者角色</p>
            <div className="space-y-2 text-xs w-full">
              <p className="text-red-700/80">顶部协同智能体入口</p>
              <p className="text-red-700/80">智能提示词卡片</p>
              <p className="text-red-700/80">AI对话 + 底部输入框</p>
            </div>
            <div className="mt-auto pt-3 border-t border-red-200/50 text-[11px] font-semibold text-red-800 w-full">
              业务协调、重大决策、战略资源调度
            </div>
          </div>
        </div>

        {/* 大模型底座 */}
        <div className="mt-6 w-full border-2 border-dashed border-indigo-300 bg-indigo-50/30 rounded-lg py-3 text-center text-sm font-bold text-indigo-600">
          公司自动驾驶大模型底座（三端一体）
        </div>
      </div>

      {/* 说明卡片 */}
      <div className="grid grid-cols-3 gap-6">
        <div className="bg-white p-5 rounded-lg border-t-2 border-t-teal-500 border-x border-b border-slate-200 shadow-sm">
          <div className="text-teal-600 font-bold text-xs mb-1">端一 · 客户经理角色</div>
          <h4 className="text-lg font-bold text-slate-800 mb-3">员工端</h4>
          <p className="text-xs text-slate-500 leading-relaxed">
            面向全员，特别是客户经理、投资经理、分支机构人员等一线实操角色。AI助理协作实现\u201C人机协同\u201D，将80%的标准化工作在员工端快速闭环，主动完成工作待办、发起业务请求等。
          </p>
        </div>
        <div className="bg-white p-5 rounded-lg border-t-2 border-t-amber-500 border-x border-b border-slate-200 shadow-sm">
          <div className="text-amber-600 font-bold text-xs mb-1">端二 · 业务支持角色</div>
          <h4 className="text-lg font-bold text-slate-800 mb-3">业务支持端</h4>
          <p className="text-xs text-slate-500 leading-relaxed">
            面向中后台业务支持角色。AI预处理工作项，员工进行账户、产品、服务等业务支持工作，人机协作，降低操作风险。
          </p>
        </div>
        <div className="bg-white p-5 rounded-lg border-t-2 border-t-red-500 border-x border-b border-slate-200 shadow-sm">
          <div className="text-red-600 font-bold text-xs mb-1">端三 · 组织者角色</div>
          <h4 className="text-lg font-bold text-slate-800 mb-3">协同端</h4>
          <p className="text-xs text-slate-500 leading-relaxed">
            面向业务部门领导和公司级高级领导等组织者。部门领导协调跨部门资源、解决业务冲突，公司高管进行重大决策、战略资源调度、复杂冲突裁决，决策后下发指令并追踪结果闭环。
          </p>
        </div>
      </div>
      
    </div>
  )
}

function WorkspaceTab() {
  return (
    <div className="animate-in fade-in duration-500">
      <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm flex flex-col" style={{ height: "calc(100vh - 160px)" }}>
        <div className="bg-slate-100 border-b border-slate-200 px-4 py-2 flex items-center gap-2 shrink-0">
          <div className="flex gap-1.5">
            <div className="w-3 h-3 rounded-full bg-red-400"></div>
            <div className="w-3 h-3 rounded-full bg-amber-400"></div>
            <div className="w-3 h-3 rounded-full bg-green-400"></div>
          </div>
          <span className="text-xs text-slate-500 font-medium ml-2">工作台原型预览</span>
          <a
            href="https://workv2-igj2601lh.maozi.io/"
            target="_blank"
            rel="noreferrer"
            className="ml-auto text-xs text-blue-500 hover:underline"
          >
            在新标签页打开
          </a>
        </div>
        <iframe
          src="https://workv2-igj2601lh.maozi.io/"
          className="w-full flex-1 border-none bg-slate-50"
          title="工作台原型"
        />
      </div>
    </div>
  )
}

function TerminalTab({ type }: { type: 'employee' | 'support' | 'collab' }) {
  const configs = {
    employee: {
      title: "员工端",
      url: "https://aiworkspace-bsged01m2.maozi.io/?tab=employee",
      object: "面向全员，特别是前台业务人员、投资经理、分支机构人员等一线实操角色。",
      actions: "发起各类业务请求、查询数据、使用 AI 助理起草报告、处理日常标准化工作流。",
      results: "实现\u201C人机协同\u201D，提升单兵作战效率，将 80% 的标准化、日常化工作在员工端实现快速闭环，无需流转。"
    },
    support: {
      title: "业务支持端",
      url: "https://aiworkspace-bsged01m2.maozi.io/?tab=support",
      object: "面向各条线支持中心人员（如质控、合规、审批节点负责人等中后台角色）。",
      actions: "集中接单处理、对复杂工单进行复核与质控、监控业务指标与风险预警、规则前置介入（不管人，只管业务动作）。",
      results: "形成统一的业务视图，提升业务流转透明度，实现人工兜底与专业把关，降低操作风险。"
    },
    collab: {
      title: "协同端",
      url: "https://aiworkspace-bsged01m2.maozi.io/?tab=collab",
      object: "面向业务部门领导与公司级高级领导。",
      actions: "小圆桌协同：协调跨部门资源、解决业务冲突，由业务部门领导直接协同处理。大圆桌协同：涉及公司级重大决策、战略资源调度、复杂冲突裁决，由高级领导决策。小圆桌无法解决时自动升级至大圆桌。决策后生成议题，下发指令并追踪执行闭环。",
      results: "建立分层协同机制：部门级问题在小圆桌内快速闭环，公司级复杂问题升级大圆桌由高层裁决。打破部门壁垒，对复杂项目与突发事件进行高层次决策，通过指令拆解下发形成全流程追踪与闭环响应。"
    }
  }

  const { title, url, object, actions, results } = configs[type]

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      
      {/* 嵌入原页面 */}
      <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm flex flex-col h-[650px]">
        <div className="bg-slate-100 border-b border-slate-200 px-4 py-2 flex items-center gap-2 shrink-0">
          <div className="flex gap-1.5">
            <div className="w-3 h-3 rounded-full bg-red-400"></div>
            <div className="w-3 h-3 rounded-full bg-amber-400"></div>
            <div className="w-3 h-3 rounded-full bg-green-400"></div>
          </div>
          <span className="text-xs text-slate-500 font-medium ml-2">系统视图预览 - {title}</span>
          <a href={url} target="_blank" rel="noreferrer" className="ml-auto text-xs text-blue-500 hover:underline">
            在新标签页打开
          </a>
        </div>
        {/* 使用 iframe 嵌入实际页面 */}
        <iframe src={url} className="w-full flex-1 border-none bg-slate-50" title={`${title} Preview`}></iframe>
      </div>

      {/* 设计要点说明 */}
      <div className="bg-white rounded-xl p-8 border border-slate-200 shadow-sm">
        <h3 className="text-lg font-bold mb-6 text-slate-800 flex items-center gap-2">
          <span className="w-1.5 h-5 bg-blue-600 rounded-full"></span>
          设计要点与定位
        </h3>
        
        <div className="grid grid-cols-3 gap-6">
          <div className="bg-blue-50/50 p-5 rounded-lg border border-blue-100">
            <div className="flex items-center gap-2 text-blue-800 font-semibold mb-3">
              <Users className="w-5 h-5" />
              面向对象 (Object)
            </div>
            <p className="text-sm text-slate-600 leading-relaxed">{object}</p>
          </div>
          
          <div className="bg-amber-50/50 p-5 rounded-lg border border-amber-100">
            <div className="flex items-center gap-2 text-amber-800 font-semibold mb-3">
              <MousePointerClick className="w-5 h-5" />
              主要操作 (Action)
            </div>
            <p className="text-sm text-slate-600 leading-relaxed">{actions}</p>
          </div>

          <div className="bg-emerald-50/50 p-5 rounded-lg border border-emerald-100">
            <div className="flex items-center gap-2 text-emerald-800 font-semibold mb-3">
              <CheckCircle className="w-5 h-5" />
              期望结果 (Result)
            </div>
            <p className="text-sm text-slate-600 leading-relaxed">{results}</p>
          </div>
        </div>
      </div>
    </div>
  )
}
