// 业务支持端 & 协同端 Mock 数据

export type Priority = "urgent" | "normal" | "watch"
export type ItemStatus = "pending" | "processing" | "done" | "escalated"
export type AgendaStatus = "pending" | "discussing" | "decided" | "issued" | "tracking" | "closed"
export type AgendaPriority = "high" | "medium" | "info"
export type TriggerType = "submitted" | "rule" | "proactive"
export type AgendaTrigger = "proactive" | "rule" | "escalated"

export interface WorkItem {
  id: string
  title: string
  businessLine: "资管" | "投行" | "零售"
  stage: "客户分析" | "业务分析" | "方案生成" | "客户服务" | "合同管理" | "准入"
  submitter: string
  submittedAt: string
  sourceType: TriggerType
  priority: Priority
  status: ItemStatus
  aiPrejudge: string
  aiAction: "handle" | "supplement" | "escalate"
  subject: {
    object: string
    action: string
    result: string
  }
  escalatedAgendaId?: string
}

export interface Agenda {
  id: string
  topic: string
  triggerType: AgendaTrigger
  agendaType: "conflict" | "resource" | "permission" | "risk" | "policy"
  priority: AgendaPriority
  status: AgendaStatus
  initiator: string
  initiatedAt: string
  deptInvolved: string[]
  coordinators: string[]
  description: string
  relatedItemIds: string[]
  decision?: string
  instructions?: { dept: string; content: string; deadline: string; trackStatus: "pending" | "done" | "overdue" }[]
}

export const workItems: WorkItem[] = [
  {
    id: "wi-001",
    title: "城商行债券投资方案 — 中信银行贵阳分行",
    businessLine: "资管",
    stage: "方案生成",
    submitter: "刘韵",
    submittedAt: "10分钟前",
    sourceType: "submitted",
    priority: "urgent",
    status: "pending",
    aiPrejudge: "现金流数据缺失，资产配置维度未填写，建议补录后重新提交",
    aiAction: "supplement",
    subject: {
      object: "华创证券资管条线-刘韵 与 中信银行贵阳分行-财务总监王某",
      action: "提交债券投资方案复核",
      result: "方案现金流数据缺失，待补录后重新进入复核流程",
    },
  },
  {
    id: "wi-002",
    title: "上市公司定增方案复核 — 贵州茅台",
    businessLine: "资管",
    stage: "客户分析",
    submitter: "张明",
    submittedAt: "35分钟前",
    sourceType: "submitted",
    priority: "urgent",
    status: "pending",
    aiPrejudge: "资产负债率连续2季度超过75%，应付账款账期延长，需人工核查资金压力",
    aiAction: "handle",
    subject: {
      object: "华创证券资管条线-张明 与 贵州茅台-董事会秘书李某",
      action: "提交定增方案客户分析复核",
      result: "客观指标异常，需支持中心人工研判后决定是否继续推进",
    },
  },
  {
    id: "wi-003",
    title: "新客户合同录入异常检测",
    businessLine: "资管",
    stage: "合同管理",
    submitter: "系统规则触发",
    submittedAt: "1小时前",
    sourceType: "rule",
    priority: "watch",
    status: "pending",
    aiPrejudge: "3份合同模板与统一模板不匹配，字段定义存在歧义，建议人工核对",
    aiAction: "handle",
    subject: {
      object: "资管存量客户合同库",
      action: "系统自动检测模板一致性",
      result: "发现3份合同使用旧版模板，字段不符合当前标准",
    },
  },
  {
    id: "wi-004",
    title: "IPO项目准入申请 — XX科技股份",
    businessLine: "投行",
    stage: "准入",
    submitter: "高瑾妮",
    submittedAt: "2小时前",
    sourceType: "submitted",
    priority: "normal",
    status: "pending",
    aiPrejudge: "材料完整度92%，缺少近3年现金流量表，其余核心指标符合准入要求，可进入复核",
    aiAction: "handle",
    subject: {
      object: "华创证券投行条线-高瑾妮 与 XX科技股份-CFO陈某",
      action: "提交IPO项目准入申请复核",
      result: "材料基本完整，AI预判可进入复核，支持中心确认后正式受理",
    },
  },
  {
    id: "wi-005",
    title: "城农商行存款委托产品方案 — 遵义农商行",
    businessLine: "投行",
    stage: "方案生成",
    submitter: "杨帆",
    submittedAt: "3小时前",
    sourceType: "submitted",
    priority: "normal",
    status: "processing",
    aiPrejudge: "方案结构完整，总资产规模与净息差数据匹配合理，建议直接处理",
    aiAction: "handle",
    subject: {
      object: "华创证券投行条线-杨帆 与 遵义农商行-行长赵某",
      action: "提交存款委托产品方案审核",
      result: "方案进入复核流程，支持中心处理中",
    },
  },
  {
    id: "wi-006",
    title: "高净值客户资产配置异常预警",
    businessLine: "零售",
    stage: "客户服务",
    submitter: "系统规则触发",
    submittedAt: "30分钟前",
    sourceType: "rule",
    priority: "watch",
    status: "pending",
    aiPrejudge: "客户近30天资产变动超过40%，银行存款大幅减少，监控到异常转移迹象，建议关注",
    aiAction: "handle",
    subject: {
      object: "零售高净值客户群",
      action: "系统自动监控资产变动",
      result: "发现5位客户资产异常变动，可能面临流失风险",
    },
  },
  {
    id: "wi-007",
    title: "股票质押业务客户分析 — 某上市公司实控人",
    businessLine: "资管",
    stage: "客户分析",
    submitter: "刘韵",
    submittedAt: "昨日16:30",
    sourceType: "submitted",
    priority: "urgent",
    status: "escalated",
    aiPrejudge: "涉及资管与投行双条线客户，策略存在潜在冲突，需高层协调统一对客口径",
    aiAction: "escalate",
    subject: {
      object: "华创证券资管条线-刘韵 与 某上市公司实控人",
      action: "提交股票质押客户分析",
      result: "发现与投行条线客户重叠，已提请协同端处理",
    },
    escalatedAgendaId: "ag-001",
  },
]

export const agendas: Agenda[] = [
  {
    id: "ag-001",
    topic: "资管投行双条线共同客户策略协调",
    triggerType: "escalated",
    agendaType: "conflict",
    priority: "high",
    status: "discussing",
    initiator: "刘韵（资管支持中心）",
    initiatedAt: "2026-05-19 14:30",
    deptInvolved: ["资管条线", "投行条线", "合规部"],
    coordinators: ["陶总", "华总"],
    description:
      "贵州茅台同时为资管条线存量客户和投行潜在客户，两条线在资产配置建议和对客策略上存在冲突，需高层协调统一对客口径及资源分配，避免内部竞争影响客户关系。",
    relatedItemIds: ["wi-007", "wi-002"],
  },
  {
    id: "ag-002",
    topic: "算力资源申请 — 资管模型630节点保障",
    triggerType: "proactive",
    agendaType: "resource",
    priority: "high",
    status: "pending",
    initiator: "温从余（研发中心）",
    initiatedAt: "2026-05-19 09:00",
    deptInvolved: ["研发中心", "财务部"],
    coordinators: ["华总", "汤总"],
    description:
      "630上线节点倒计时42天，当前内部算力不足以支撑资管27个模型+投行模型的并发训练和推理需求，需申请扩充GPU资源或采购外部云算力，涉及预算审批，金额预计超过授权上限。",
    relatedItemIds: [],
  },
  {
    id: "ag-003",
    topic: "零售智能体数据权限跨部门开放申请",
    triggerType: "proactive",
    agendaType: "permission",
    priority: "medium",
    status: "pending",
    initiator: "朱东飞（零售条线）",
    initiatedAt: "2026-05-18 16:00",
    deptInvolved: ["零售条线", "数据治理团队", "合规部"],
    coordinators: ["李秀敏总"],
    description:
      "零售智能体客户分析模型需要调用资管和投行条线的存量客户数据（银行存款配额、应付账款等核心指标），涉及跨条线数据权限，需数据治理团队和合规部门审批授权，否则零售模型的客户分析维度将不完整。",
    relatedItemIds: [],
  },
  {
    id: "ag-004",
    topic: "【规则知会】投行IPO项目关键指标异常监控",
    triggerType: "rule",
    agendaType: "risk",
    priority: "info",
    status: "tracking",
    initiator: "系统规则触发",
    initiatedAt: "2026-05-18 10:15",
    deptInvolved: ["投行条线", "风控部"],
    coordinators: ["彭书记"],
    description:
      "AI监控发现某IPO项目资产负债率连续3周超过阈值（当前82%，预警线75%），现金流量净额持续为负，按重大事项规则自动知会协同端，供领导知晓，投行条线正在跟进处理，暂无需额外决策。",
    relatedItemIds: [],
  },
  {
    id: "ag-005",
    topic: "各条线模型标准体系与指标精简决策",
    triggerType: "proactive",
    agendaType: "policy",
    priority: "high",
    status: "decided",
    initiator: "陶总（会议指示转化）",
    initiatedAt: "2026-05-18 12:30",
    deptInvolved: ["资管条线", "投行条线", "零售条线", "研发中心"],
    coordinators: ["陶总", "周伟总"],
    description:
      "依据5月18日会议精神，各条线现有200余个指标过于冗杂，需按照'资产负债、现金流、资产配置'三个本质维度做减法，精简至核心可用指标，形成公司级统一标准，由陶总和周伟总牵头决策。",
    relatedItemIds: [],
    decision:
      "各条线一周内完成指标精简，保留与本质维度直接相关的核心指标，剔除万得行业分类、商业模式等旧框架指标。由研发中心统一更新数据治理标准，各条线业务负责人签字确认。",
    instructions: [
      { dept: "资管条线", content: "按资产负债/现金流/资产配置三维重构27个模型，剔除旧框架维度", deadline: "2026-05-25", trackStatus: "pending" },
      { dept: "投行条线", content: "统一术语体系，清理歧义词汇，明确四个核心模型边界", deadline: "2026-05-25", trackStatus: "pending" },
      { dept: "零售条线", content: "参照投行/资管方法论重构零售模型，明确三端角色与业务闭环", deadline: "2026-05-25", trackStatus: "pending" },
      { dept: "研发中心", content: "配合各条线完成200+指标减法，更新自动驾驶大模型数据标准", deadline: "2026-05-27", trackStatus: "pending" },
    ],
  },
]
