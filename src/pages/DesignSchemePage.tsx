import { useState } from "react"

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
