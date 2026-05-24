import { useState, useRef, useEffect, useCallback } from "react"
import { Send, Sparkles, ArrowUp } from "lucide-react"
import { useChatContext } from "@/App"

interface Message {
  id: number
  role: "user" | "assistant"
  content: string
  time: string
}

const agentGreetings: Record<string, string> = {
  投行业务助理: "您好，张总。我是投行业务助理，可以帮您了解投行业务条线的最新动态和项目进展。请问有什么需要了解的？",
  资管业务助理: "您好，张总。我是资管业务助理，可以帮您查看资管业务的规模、收益和产品运作情况。",
  零售业务助理: "您好，张总。我是零售业务助理，可以帮您了解零售客户数据、渠道运营和营销活动效果。",
  投资业务助理: "您好，张总。我是投资业务助理，可以帮您分析投资组合表现、市场趋势和持仓情况。",
  销交业务助理: "您好，张总。我是销交业务助理，可以帮您了解销售交易业务数据和客户交易动态。",
  机构业务助理: "您好，张总。我是机构业务助理，可以帮您查看机构客户合作情况和业务拓展进展。",
  交叉验证助理: "您好，张总。我是交叉验证助理，可以帮您对业务数据进行交叉验证和合规检查。",
  审批助手: "您好，张总。我是审批助手。您当前有8项待审批事项，其中2项即将超期。需要我为您逐一概述吗？",
  风控合规助手: "您好，张总。我是风控合规助手。当前有3项合规风险和5项操作风险需要关注。需要我为您详细分析吗？",
  人才管理助手: "您好，张总。我是人才管理助手。当前团队在职386人，本月入职8人、离职3人。需要查看哪方面的队伍信息？",
  经营分析助手: "您好，张总。我是经营分析助手。本月总营收¥5,800万，同比增长12.3%。需要我分析具体的经营指标吗？",
  应急指挥助手: "您好，张总。我是应急指挥助手。当前有1项待处理事件，15项应急预案正常运行。需要了解什么？",
  决策分析助手: "您好，张总。我是决策分析助手，可以帮您综合分析各类数据，辅助战略决策制定。请问需要什么帮助？",
  风险监控助手: "您好，张总。我是风险监控助手，可以实时监控各类风险指标并预警风险事件。",
  人才评估助手: "您好，张总。我是人才评估助手，可以帮您进行团队能力评估和人才发展规划。",
  智能助手: "您好，张总。我是您的智能助手，可以帮您处理审批、查看经营数据、了解风险状况等。请问需要什么帮助？",
}

const mockReplies: Record<string, string> = {
  审批: "【请示事项总结】\n\n当前共有 8项待审批，其中 2项即将超期：\n\n紧急事项：\n1. 关于申请增设华东分中心的请示 — 李明·运营部（即将超期，请今日处理）\n2. 关于采购智能风控系统的费用审批 — 王芳·科技部，¥1,280,000\n\n一般事项：\n3. Q3市场推广方案请示 — 赵强·市场部，¥580,000\n4. 调整客户分级管理制度 — 陈静·客户部\n5. 2025年度培训计划费用请示 — 周涛·人力资源部，¥320,000\n\n——————\n【AI 建议】\n1. 优先处理第1项（华东分中心），该请示已接近超期，且涉及战略布局\n2. 第2项智能风控系统采购建议结合科技部技术评估报告一并审批\n3. 建议将低金额事项（<50万）授权给分管副总审批，减轻您的审批压力\n\n需要我为您逐项展示详情或直接批复吗？",
  风险: "【风险提示总结】\n\n当前风险全景：\n• 合规风险 3项（高）\n• 操作风险 5项（中）\n• 市场风险 2项（中）\n• 本月已化解 12项\n\n重点关注事项：\n1. 反洗钱可疑交易报告 — 涉及金额¥5,200,000，合规部已初步识别异常模式\n2. 客户适当性管理不符 — 华东分中心3例高风险产品匹配不当\n3. 离职员工系统权限未清理 — 科技部发现2个账号仍有访问记录\n\n——————\n【AI 建议】\n1. 第1项建议今日内安排合规部负责人汇报，必要时启动SAR报告流程\n2. 第2项建议下发整改通知并限期7日内完成自查\n3. 第3项属于操作疏漏，建议科技部立即关闭账号并排查过去30天访问日志\n4. 整体建议：月底前组织一次合规专项会议，重点复盘适当性管理流程",
  经营: "【经营看板总结】\n\n核心指标：\n• 总营收：¥5,800万（同比+12.3%）\n• 净利润：¥1,680万（同比+8.7%）\n• 客户总量：12,458户（净增+256）\n• Q2目标完成率：78.5%（较Q1下降2.1%）\n\n分支机构排名：\n1. 华东分中心 ¥3,200万（领跑）\n2. 华南分中心 ¥2,800万\n3. 华北分中心 ¥2,100万\n4. 华中分中心 ¥1,900万\n5. 西南分中心 ¥1,600万（需关注）\n\n——————\n【AI 建议】\n1. 目标完成率下降2.1%，主因是西南分中心进度滞后，建议安排专项督导\n2. 营收增长强劲但利润率增速放缓（8.7% vs 12.3%），关注成本控制\n3. 建议Q2末启动经营分析复盘会，重点讨论下半年目标是否需要调整\n4. 华东分中心表现突出，可考虑推广其客户经营模式到其他区域",
  队伍: "【队伍状况总结】\n\n人员概况：\n• 在职总人数：386人（本月净增+5）\n• 本月入职：8人 | 离职：3人\n• 整体出勤率：96.2%（+0.3%）\n\n绩效分布：\n• 优秀：61人（15.8%）\n• 良好：113人（29.3%）\n• 一般：32人（8.3%）\n• 待改进：8人（2.1%）\n\n核心骨干状态：\n• 李明（运营总监）、王芳（科技部总经理）、陈静（客户部总经理）— 在岗\n• 赵强（市场部总经理）— 出差中\n• 周涛（合规总监）— 在岗\n\n——————\n【AI 建议】\n1. 离职3人均为一般岗位，暂无核心人才流失风险\n2. 「待改进」8人建议启动绩效辅导计划，避免累积为管理问题\n3. 建议关注运营部和科技部的加班数据，近期项目密集可能影响团队稳定性\n4. Q3有2位核心骨干合同到期，建议提前安排续签沟通",
  应急: "【应急组织总结】\n\n整体状态：运行正常\n• 应急预案总数：15项（均已更新至最新版本）\n• 本月完成演练：2次\n• 待处理事件：1项（已解决，分支机构网络中断，耗时45分钟）\n• 平均响应时效：15分钟\n\n预案演练情况：\n• 信息系统故障（一级）— 科技部 — 已演练\n• 重大客户投诉（二级）— 客户部 — 已演练\n• 舆情危机（一级）— 市场部 — 待演练\n• 自然灾害（三级）— 行政部 — 已演练\n\n——————\n【AI 建议】\n1. 舆情危机预案尚未演练，建议本月内安排（当前舆情环境敏感）\n2. 上次网络中断事件响应时间45分钟，超过15分钟目标，建议科技部优化应急响应流程\n3. 建议更新应急联系人名单，确认所有负责人手机畅通\n4. Q3建议新增「数据泄露应急预案」，当前缺少此项",
  投行: "【投行业务总结】\n\n• 在执行项目：12个\n• 本月新增立项：3个\n• 预计收入贡献：¥820万\n• 重点项目：某科技公司IPO辅导进入关键阶段\n\n——————\n【AI 建议】\n整体推进顺利，需关注监管政策变化对在审项目的影响。建议与监管部门保持沟通。",
  资管: "【资管业务总结】\n\n• 管理规模：¥186亿（+3.2%）\n• 产品数量：48只\n• 平均收益率：5.8%\n• 新发产品：2只募集中\n\n——————\n【AI 建议】\n关注固收类产品到期再投压力，建议提前布局替代产品策略。",
  零售: "【零售业务总结】\n\n• 零售客户数：89,432（+1,256）\n• 月活跃率：62.5%\n• 人均资产：¥45.8万\n• 本月新开户：1,256户\n\n——————\n【AI 建议】\n客户活跃度稳步提升，线上渠道转化率有改善空间，建议加大数字化运营投入。",
}

function getReply(msg: string): string {
  for (const [keyword, reply] of Object.entries(mockReplies)) {
    if (msg.includes(keyword)) return reply
  }
  return "收到您的问题，我正在分析相关数据。基于当前信息，各项指标运行正常。如需深入了解某个具体方面，请告诉我。"
}

function now() {
  return new Date().toLocaleTimeString("zh-CN", { hour: "2-digit", minute: "2-digit" })
}

export function AIChatInline() {
  const { agentName, agentImage, initialMessage, exitChat } = useChatContext()

  const [messages, setMessages] = useState<Message[]>(() => {
    const greeting = agentGreetings[agentName] || agentGreetings["智能助手"]
    const initial: Message[] = [
      { id: 1, role: "assistant", content: greeting, time: now() },
    ]
    if (initialMessage) {
      initial.push({ id: 2, role: "user", content: initialMessage, time: now() })
      initial.push({ id: 3, role: "assistant", content: getReply(initialMessage), time: now() })
    }
    return initial
  })

  const [input, setInput] = useState("")
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const nextId = useRef(messages.length + 1)

  const scrollToEnd = useCallback(() => {
    setTimeout(() => {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
    }, 50)
  }, [])

  useEffect(() => {
    scrollToEnd()
  }, [messages, scrollToEnd])

  const handleSend = () => {
    const msg = input.trim()
    if (!msg) return
    setInput("")

    const uid = nextId.current++
    const aid = nextId.current++
    setMessages((prev) => [...prev, { id: uid, role: "user", content: msg, time: now() }])

    setTimeout(() => {
      setMessages((prev) => [...prev, { id: aid, role: "assistant", content: getReply(msg), time: now() }])
    }, 500)
  }

  return (
    <div className="min-h-screen flex flex-col bg-background">
      {/* Chat Header */}
      <div className="sticky top-0 z-10 bg-card/95 backdrop-blur border-b border-border px-6 lg:px-8 py-3">
        <div className="max-w-[1200px] mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full overflow-hidden border border-border">
              <img src={agentImage} alt={agentName} className="w-full h-full object-cover" />
            </div>
            <div>
              <div className="text-sm font-medium text-foreground">{agentName}</div>
              <div className="text-[11px] text-muted-foreground flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-success inline-block" />
                在线
              </div>
            </div>
          </div>
          <button
            onClick={exitChat}
            className="flex items-center gap-1.5 text-sm font-medium text-muted-foreground hover:text-primary transition-colors"
          >
            <ArrowUp className="w-4 h-4 -rotate-90" />
            <span>返回工作台</span>
          </button>
        </div>
      </div>

      {/* Messages Area */}
      <div className="flex-1 px-6 lg:px-8 py-6">
        <div className="max-w-[1200px] mx-auto space-y-5">
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex gap-3 ${msg.role === "user" ? "flex-row-reverse" : ""}`}
            >
              <div className="w-8 h-8 rounded-full shrink-0 flex items-center justify-center overflow-hidden mt-0.5">
                {msg.role === "assistant" ? (
                  <img src={agentImage} alt="" className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full bg-gradient-primary flex items-center justify-center text-primary-foreground text-xs font-bold">
                    张
                  </div>
                )}
              </div>
              <div
                className={`max-w-[70%] rounded-2xl px-4 py-3 text-sm leading-relaxed ${
                  msg.role === "user"
                    ? "bg-primary text-primary-foreground rounded-tr-md"
                    : "bg-card border border-border text-foreground rounded-tl-md shadow-card"
                }`}
              >
                <div className="whitespace-pre-wrap">{msg.content}</div>
                <div
                  className={`text-[10px] mt-2 ${
                    msg.role === "user" ? "text-primary-foreground/60" : "text-muted-foreground"
                  }`}
                >
                  {msg.time}
                </div>
              </div>
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Fixed Input */}
      <div className="sticky bottom-0 bg-gradient-to-t from-background via-background to-transparent pt-4 pb-4 px-6 lg:px-8">
        <div className="max-w-[1200px] mx-auto">
          <div className="flex items-center gap-4 bg-card border border-border rounded-2xl px-5 py-3.5 shadow-elevated focus-within:shadow-glow focus-within:border-primary/40 transition-shadow">
            <Sparkles className="w-5 h-5 text-primary shrink-0" />
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSend()}
              placeholder={`向${agentName}提问...`}
              className="flex-1 bg-transparent text-sm text-foreground placeholder:text-muted-foreground outline-none"
            />
            <button
              onClick={handleSend}
              disabled={!input.trim()}
              className="w-9 h-9 rounded-xl bg-primary text-primary-foreground flex items-center justify-center disabled:opacity-30 hover:bg-primary/90 transition-all shrink-0"
            >
              <Send className="w-4 h-4" />
            </button>
          </div>
          <p className="text-center text-[11px] text-muted-foreground/60 mt-2">
            AI 助手基于内部数据提供参考，重要决策请以实际数据为准
          </p>
        </div>
      </div>
    </div>
  )
}
