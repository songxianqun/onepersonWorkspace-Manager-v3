import { useState } from "react"
import { Users, MousePointerClick, CheckCircle, ArrowRight } from "lucide-react"

export function DesignSchemePage() {
  const [activeTab, setActiveTab] = useState("architecture")

  const tabs = [
    { id: "architecture", label: "整体架构" },
    { id: "employee", label: "员工端" },
    { id: "support", label: "业务支持端" },
    { id: "collab", label: "协同端" },
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
                onClick={() => setActiveTab(t.id)}
                className={`pb-3 font-medium text-sm transition-colors relative ${
                  activeTab === t.id ? "text-blue-600" : "text-slate-500 hover:text-slate-800"
                }`}
              >
                {t.label}
                {activeTab === t.id && (
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
        {activeTab === "employee" && <TerminalTab type="employee" />}
        {activeTab === "support" && <TerminalTab type="support" />}
        {activeTab === "collab" && <TerminalTab type="collab" />}
      </main>
    </div>
  )
}

function ArchitectureTab() {
  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="text-sm text-slate-600 leading-relaxed max-w-4xl">
        三端不是独立系统，是同一平台上的三类角色视图，三端的协同不是串联，是平行可交叉的。
      </div>

      {/* 架构图区域 */}
      <div className="bg-white rounded-xl p-8 border border-slate-200 shadow-sm relative overflow-hidden">
        
        {/* 顶部关联箭头 (直接提请) */}
        <div className="relative h-12 mb-2">
          <div className="absolute top-4 left-[16%] right-[16%] border-t-2 border-dashed border-red-300 rounded-t-[40px] h-12"></div>
          <div className="absolute top-1 left-1/2 -translate-x-1/2 bg-white px-2 text-[11px] text-red-500 font-medium">直接提请 (重大决策/跨部门协同/资源申请等)</div>
          <div className="absolute top-3 right-[15.5%] w-2 h-2 border-t-2 border-r-2 border-red-300 rotate-45 bg-white"></div>
        </div>

        {/* 核心三端块 */}
        <div className="flex gap-6 relative z-10">
          
          {/* 员工端 */}
          <div className="flex-1 bg-teal-50/50 border border-teal-200 rounded-lg p-5 flex flex-col items-center justify-center text-center">
            <h3 className="text-teal-800 font-bold mb-3">员工端 (已建)</h3>
            <div className="space-y-1.5 text-xs text-teal-700/80">
              <p>业务智能体</p>
              <p>工作提示</p>
              <p>可公共使用的AI团队</p>
            </div>
            <div className="mt-auto pt-3 border-t border-amber-200/50 text-[11px] font-semibold text-amber-800 w-full">
              各条线牌照打开，人人可做业务
            </div>
          </div>

          {/* 箭头连接 1 */}
          <div className="flex flex-col justify-center items-center gap-4 w-24 shrink-0">
            <div className="flex flex-col items-center text-[10px] text-slate-500 font-medium w-full relative">
              <span className="mb-1 text-teal-600">主动提交事项</span>
              <div className="w-full h-px bg-teal-600 relative">
                <div className="absolute right-0 top-1/2 -translate-y-1/2 w-1.5 h-1.5 border-t border-r border-teal-600 rotate-45"></div>
              </div>
            </div>
            <div className="flex flex-col items-center text-[10px] text-slate-400 w-full relative">
              <div className="w-full h-px border-t border-dashed border-slate-400 relative">
                <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1.5 h-1.5 border-b border-l border-slate-400 rotate-45"></div>
              </div>
              <span className="mt-1">规则触达/知会</span>
            </div>
          </div>

          {/* 业务支持端 */}
          <div className="flex-[1.2] bg-amber-50/50 border border-amber-200 rounded-lg p-5 flex flex-col items-center text-center">
            <h3 className="text-amber-800 font-bold mb-3">业务支持端 (新建)</h3>
            <div className="space-y-1.5 text-xs text-amber-700/80 mb-3">
              <p>各条线支持中心智能体</p>
              <p>质控/复核/合规/技术等业务支持工作提示</p>
              <p>事项看板 + 风险预警 </p>
            </div>
            <div className="mt-auto pt-3 border-t border-amber-200/50 text-[11px] font-semibold text-amber-800 w-full">
              不管人，只管业务动作
            </div>
          </div>

          {/* 箭头连接 2 */}
          <div className="flex flex-col justify-center items-center gap-4 w-24 shrink-0">
            <div className="flex flex-col items-center text-[10px] text-slate-500 font-medium w-full relative">
              <span className="mb-1 text-red-600">提请协同</span>
              <div className="w-full h-px bg-red-600 relative">
                <div className="absolute right-0 top-1/2 -translate-y-1/2 w-1.5 h-1.5 border-t border-r border-red-600 rotate-45"></div>
              </div>
            </div>
            <div className="flex flex-col items-center text-[10px] text-slate-400 w-full relative">
              <span className="mb-1">规则知会</span>
              <div className="w-full h-px border-t border-dashed border-slate-400 relative">
                <div className="absolute right-0 top-1/2 -translate-y-1/2 w-1.5 h-1.5 border-t border-r border-slate-400 rotate-45"></div>
              </div>
            </div>
            <div className="flex flex-col items-center text-[10px] text-blue-600 font-medium w-full relative">
              <div className="w-full h-px bg-blue-600 relative">
                <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1.5 h-1.5 border-b border-l border-blue-600 rotate-45"></div>
              </div>
              <span className="mt-1">决策/指令下发</span>
            </div>
          </div>

          {/* 协同端 */}
          <div className="flex-[1.2] bg-red-50/50 border border-red-200 rounded-lg p-5 flex flex-col items-center text-center">
            <h3 className="text-red-800 font-bold mb-3">协同端 (新建)</h3>
            <div className="space-y-1.5 text-xs text-red-700/80 mb-3">
              <p><span className="font-bold">小圆桌协同</span> — 部门领导级</p>
              <p>协调解决跨条线事项</p>
              <p>资源协调 / 业务冲突解决</p>
              <div className="border-t border-dashed border-red-200 my-1.5" />
              <p><span className="font-bold">大圆桌协同</span> — 公司级高层</p>
              <p>重大决策 / 战略资源调度</p>
              <p>复杂冲突裁决 / 指令下发</p>
            </div>
            <div className="mt-auto pt-3 border-t border-red-200/50 text-[11px] font-semibold text-red-800 w-full">
              小圆桌 → 大圆桌升级机制<br/>决策 → 指令下发 → 结果追踪
            </div>
          </div>
        </div>

        {/* AI 预判预处理层 */}
        <div className="mt-6 mx-auto w-[60%] border-2 border-dashed border-indigo-300 bg-indigo-50/30 rounded-lg py-2.5 text-center text-[11px] font-bold text-indigo-600 relative z-0">
          AI 预判预处理层 (贯穿三端)
        </div>
      </div>

      {/* 说明卡片 */}
      <div className="grid grid-cols-3 gap-6">
        <div className="bg-white p-5 rounded-lg border-t-2 border-t-teal-500 border-x border-b border-slate-200 shadow-sm">
          <div className="text-teal-600 font-bold text-xs mb-1">端一 · 已建</div>
          <h4 className="text-lg font-bold text-slate-800 mb-3">员工端</h4>
          <p className="text-xs text-slate-500 leading-relaxed">
            面向全员，特别是前台业务人员、投资经理、分支机构人员等一线实操角色。AI助理协作实现“人机协同”，将80%的标准化工作在员工端快速闭环，主动完成工作待办、发起业务请求等。
          </p>
        </div>
        <div className="bg-white p-5 rounded-lg border-t-2 border-t-amber-500 border-x border-b border-slate-200 shadow-sm">
          <div className="text-amber-600 font-bold text-xs mb-1">端二 · 新建</div>
          <h4 className="text-lg font-bold text-slate-800 mb-3">业务支持端</h4>
          <p className="text-xs text-slate-500 leading-relaxed">
            面向中后台支持角色（如质控、复核、合规、风控、技术、财务等）。AI预处理工作项，员工进行复核、质控、系统开发支持等业务支持工作，监控风险预警。形成统一业务视图，降低操作风险。
          </p>
        </div>
        <div className="bg-white p-5 rounded-lg border-t-2 border-t-red-500 border-x border-b border-slate-200 shadow-sm">
          <div className="text-red-600 font-bold text-xs mb-1">端三 · 新建</div>
          <h4 className="text-lg font-bold text-slate-800 mb-3">协同端</h4>
          <p className="text-xs text-slate-500 leading-relaxed">
            面向业务部门领导和公司级高级领导。以请示事项为单元，分为<b>小圆桌协同</b>（部门领导级协调跨部门资源、解决业务冲突）和<b>大圆桌协同</b>（公司级高层进行重大决策、战略资源调度、复杂冲突裁决）。小圆桌无法解决时自动升级至大圆桌。决策后下发指令并追踪结果闭环。
          </p>
        </div>
      </div>

      {/* 闭环流程 */}
      <div className="bg-white border border-slate-200 shadow-sm rounded-xl p-6">
        <div className="space-y-6">
          
          {/* 闭环一 */}
          <div className="bg-slate-50 border border-slate-100 rounded-lg p-5">
            <div className="flex items-center gap-3 mb-4">
              <h5 className="font-bold text-slate-800 text-sm">闭环一：员工独立完成</h5>
              <span className="text-[10px] bg-teal-100 text-teal-700 px-2 py-0.5 rounded-full font-medium">最常见</span>
            </div>
            <div className="flex items-center gap-2">
              <FlowBox text="员工发起业务" />
              <ArrowRight className="w-4 h-4 text-slate-300" />
              <FlowBox text="AI 智能体处理" bg="bg-indigo-50 text-indigo-700 border-indigo-200" />
              <ArrowRight className="w-4 h-4 text-slate-300" />
              <FlowBox text="员工确认/输出" />
              <ArrowRight className="w-4 h-4 text-slate-300" />
              <FlowBox text="完成" bg="bg-teal-50 text-teal-700 border-teal-200" />
            </div>
            <p className="text-xs text-slate-400 mt-3">支持端在后台自动感知（规则触达），不介入处理</p>
          </div>

          {/* 闭环二 */}
          <div className="bg-slate-50 border border-slate-100 rounded-lg p-5">
            <div className="flex items-center gap-3 mb-4">
              <h5 className="font-bold text-slate-800 text-sm">闭环二：员工 → 支持中心协同</h5>
              <span className="text-[10px] bg-amber-100 text-amber-700 px-2 py-0.5 rounded-full font-medium">需质控/复核</span>
            </div>
            <div className="flex items-center gap-2 flex-wrap">
              <FlowBox text="员工主动提交工单" />
              <ArrowRight className="w-4 h-4 text-slate-300" />
              <FlowBox text="AI 预判 + 分类路由" bg="bg-indigo-50 text-indigo-700 border-indigo-200" />
              <ArrowRight className="w-4 h-4 text-slate-300" />
              <FlowBox text="支持中心看板接单" bg="bg-amber-50 text-amber-700 border-amber-200" />
              <ArrowRight className="w-4 h-4 text-slate-300" />
              <FlowBox text="决策/质控/复核" bg="bg-amber-50 text-amber-700 border-amber-200" />
              <ArrowRight className="w-4 h-4 text-slate-300" />
              <FlowBox text="完成" bg="bg-teal-50 text-teal-700 border-teal-200" />
            </div>
            <p className="text-xs text-slate-400 mt-3">支持端也可主动前置介入（规则触发），无需等待员工提交</p>
          </div>

          {/* 闭环三 */}
          <div className="bg-slate-50 border border-slate-100 rounded-lg p-5">
            <div className="flex items-center gap-3 mb-4">
              <h5 className="font-bold text-slate-800 text-sm">闭环三：支持中心 → 圆桌会议协同</h5>
              <span className="text-[10px] bg-red-100 text-red-700 px-2 py-0.5 rounded-full font-medium">跨部门/资源申请</span>
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <FlowBox text="支持端/员工提请协同" bg="bg-amber-50 text-amber-700 border-amber-200" />
                <ArrowRight className="w-4 h-4 text-slate-300" />
                <FlowBox text="规则研判 + 议题生成" bg="bg-indigo-50 text-indigo-700 border-indigo-200" />
                <ArrowRight className="w-4 h-4 text-slate-300" />
                <FlowBox text="小圆桌协同" bg="bg-blue-50 text-blue-700 border-blue-300" />
                <ArrowRight className="w-4 h-4 text-slate-300" />
                <FlowBox text="业务部门领导协调解决" bg="bg-blue-50 text-blue-700 border-blue-200" />
                <ArrowRight className="w-4 h-4 text-slate-300" />
                <FlowBox text="协调完成" bg="bg-teal-50 text-teal-700 border-teal-200" />
              </div>
              {/* 两个向下箭头 */}
              <div className="flex mt-1">
                <span className="w-[194px] shrink-0" />
                <span className="w-[156px] shrink-0 flex justify-center">
                  <svg className="w-4 h-4 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 5v14m0 0l-4-4m4 4l4-4" />
                  </svg>
                </span>
                <span className="w-[100px] shrink-0" />
                <span className="w-[172px] shrink-0 flex justify-center">
                  <svg className="w-4 h-4 text-orange-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 5v14m0 0l-4-4m4 4l4-4" />
                  </svg>
                </span>
              </div>
              <div className="flex items-center gap-2 flex-wrap">
                <span className="w-[194px] shrink-0" />
                <span className="w-[156px] shrink-0" />
                <span className="text-[10px] bg-red-100 text-red-600 px-1.5 py-0.5 rounded font-semibold -mt-1">直达大圆桌</span>
                <span className="w-[100px] shrink-0" />
                <span className="text-[10px] bg-orange-100 text-orange-600 px-1.5 py-0.5 rounded font-semibold -mt-1">未解决升级</span>
                <span className="w-[0px]" />
              </div>
              <div className="flex items-center gap-2 flex-wrap mt-1">
                <span className="w-[194px] shrink-0" />
                <span className="w-[156px] shrink-0" />
                <FlowBox text="升级至大圆桌协同" bg="bg-red-50 text-red-700 border-red-300" />
                <ArrowRight className="w-4 h-4 text-slate-300" />
                <FlowBox text="公司级高级领导决策" bg="bg-red-50 text-red-700 border-red-200" />
                <ArrowRight className="w-4 h-4 text-slate-300" />
                <FlowBox text="指令下发至相关端" bg="bg-blue-50 text-blue-700 border-blue-200" />
              </div>
            </div>
            <p className="text-xs text-slate-400 mt-3">三个闭环可并行触发，不强制串联。员工端也可直接提请协同端（越级申请）。</p>
          </div>

        </div>
      </div>
      
    </div>
  )
}

function FlowBox({ text, bg = "bg-white text-slate-700 border-slate-200" }: { text: string, bg?: string }) {
  return (
    <div className={`px-4 py-2 border rounded shadow-sm text-xs font-medium whitespace-nowrap ${bg}`}>
      {text}
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
      results: "实现“人机协同”，提升单兵作战效率，将 80% 的标准化、日常化工作在员工端实现快速闭环，无需流转。"
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
