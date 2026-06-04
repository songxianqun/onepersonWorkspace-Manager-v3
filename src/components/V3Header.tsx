import { useState } from "react"
import { Briefcase, Headphones, Network, PenTool } from "lucide-react"
import { useChatContext } from "@/App"

export type V3Tab = "employee" | "support"

interface Props {
  activeTab: V3Tab
}

type SupportRoleKey = "organizer" | "investment-manager" | "account-service" | "product-creation"

const tabLabels: Record<V3Tab, string> = {
  employee: "业务团队",
  support: "业务支持中心",
}

const agentImages = [
  "/aiworkspace/images/Avatar1.png",
  "/aiworkspace/images/Avatar2.png",
  "/aiworkspace/images/Avatar3.png",
  "/aiworkspace/images/Avatar4.png",
  "/aiworkspace/images/Avatar5.png",
  "/aiworkspace/images/Avatar6.png",
  "/aiworkspace/images/Avatar7.png",
]

const employeeNames = [
  "投行业务助理",
  "资管业务助理",
  "零售业务助理",
  "投资业务助理",
  "销交业务助理",
  "机构业务助理",
  "交叉验证助理",
]

const businessLines = ["资管", "投行", "零售", "投资", "销交", "机构", "交叉验证"]

const supportRoles = [
  { key: "organizer", label: "组织者", icon: Network },
  { key: "investment-manager", label: "投资经理", icon: Briefcase },
  { key: "account-service", label: "账户服务", icon: Headphones },
  { key: "product-creation", label: "产品创设", icon: PenTool },
] satisfies { key: SupportRoleKey; label: string; icon: typeof Network }[]

const supportAgentNames: Partial<Record<SupportRoleKey, string[]>> = {
  organizer: businessLines.map((line) => `${line}组织智能体`),
  "product-creation": businessLines.map((line) => `${line}产品创设智能体`),
}

export function V3Header({ activeTab }: Props) {
  const { openChat } = useChatContext()
  const [hoveredIdx, setHoveredIdx] = useState<number | null>(null)
  const [activeSupportRole, setActiveSupportRole] = useState<SupportRoleKey | null>(null)

  const handleEmployeeAgentClick = (i: number) => {
    openChat({ name: employeeNames[i], image: agentImages[i] })
  }

  const handleSupportRoleClick = (role: SupportRoleKey) => {
    setActiveSupportRole((current) => (current === role ? null : role))
  }

  const supportNames = activeSupportRole ? supportAgentNames[activeSupportRole] : undefined

  return (
    <section
      style={{
        background: "#fff",
        borderRadius: "16px",
        padding: "15px 20px",
        width: "100%",
        maxWidth: "1200px",
        marginLeft: "auto",
        marginRight: "auto",
        boxShadow: "0 4px 20px rgba(0,0,0,0.05)",
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "flex-start",
          alignItems: "stretch",
          gap: "12px",
        }}
      >
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "flex-start",
            justifyContent: "center",
            gap: "10px",
            flexShrink: 0,
            width: "210px",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <span style={{ display: "inline-flex", justifyContent: "center", width: "28px", fontSize: "28px" }}>📊</span>
            <span
              style={{
                fontSize: "22px",
                fontWeight: 600,
                color: "#333",
              }}
            >
              员工工作台
            </span>
          </div>
          <div style={{ display: "flex", alignItems: "center", paddingLeft: "38px", width: "100%" }}>
            <span
              style={{
                display: "inline-flex",
                alignItems: "center",
                justifyContent: "center",
                minWidth: "96px",
                height: "32px",
                padding: "0 16px",
                borderRadius: "999px",
                fontSize: "13px",
                background: "linear-gradient(135deg, #C9A96E, #E8D5A3)",
                color: "#fff",
                fontWeight: 600,
                boxShadow: "0 8px 18px rgba(201, 169, 110, 0.24)",
              }}
            >
              {tabLabels[activeTab]}
            </span>
          </div>
        </div>

        <div
          style={{
            width: "2px",
            background:
              "linear-gradient(180deg, transparent 0%, #e8e8e8 15%, #e8e8e8 85%, transparent 100%)",
            flexShrink: 0,
            margin: "8px 5px",
          }}
        />

        {activeTab === "employee" ? (
          <div
            style={{
              display: "flex",
              alignItems: "flex-start",
              flex: 1,
              justifyContent: "space-around",
            }}
          >
            {agentImages.map((img, i) => (
              <AgentAvatarButton
                key={employeeNames[i]}
                image={img}
                name={employeeNames[i]}
                isHovered={hoveredIdx === i}
                onClick={() => handleEmployeeAgentClick(i)}
                onMouseEnter={() => setHoveredIdx(i)}
                onMouseLeave={() => setHoveredIdx(null)}
              />
            ))}
          </div>
        ) : (
          <div className="flex flex-1 flex-col justify-center gap-3">
            <div className={`grid grid-cols-4 ${supportNames ? "gap-2" : "gap-3"}`}>
              {supportRoles.map((role) => {
                const Icon = role.icon
                const isActive = activeSupportRole === role.key
                return (
                  <button
                    key={role.key}
                    onClick={() => handleSupportRoleClick(role.key)}
                    className={`flex items-center justify-center rounded-2xl border text-center transition-all ${
                      supportNames
                        ? "min-h-[46px] flex-row gap-2 px-3 py-2"
                        : "min-h-[78px] flex-col gap-2 px-4 py-3"
                    } ${
                      isActive
                        ? "border-primary/30 bg-primary text-white shadow-md"
                        : "border-zinc-100 bg-zinc-50 text-zinc-900 shadow-sm hover:border-primary/20 hover:bg-primary/5"
                    }`}
                  >
                    <span className={`flex items-center justify-center rounded-full ${
                      supportNames ? "h-7 w-7" : "h-10 w-10"
                    } ${isActive ? "bg-white/18" : "bg-white"}`}>
                      <Icon className={`${supportNames ? "h-4 w-4" : "h-5 w-5"} ${isActive ? "text-white" : "text-amber-700"}`} />
                    </span>
                    <span className="text-sm font-semibold">{role.label}</span>
                  </button>
                )
              })}
            </div>

            {supportNames && (
              <div className="flex items-start justify-around border-t border-zinc-100 pt-3">
                {supportNames.map((name, i) => (
                  <AgentAvatarButton
                    key={name}
                    image={agentImages[i]}
                    name={name}
                    isHovered={hoveredIdx === i}
                    onClick={() => openChat({ name, image: agentImages[i] })}
                    onMouseEnter={() => setHoveredIdx(i)}
                    onMouseLeave={() => setHoveredIdx(null)}
                  />
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </section>
  )
}

interface AgentAvatarButtonProps {
  image: string
  name: string
  isHovered: boolean
  onClick: () => void
  onMouseEnter: () => void
  onMouseLeave: () => void
}

function AgentAvatarButton({
  image,
  name,
  isHovered,
  onClick,
  onMouseEnter,
  onMouseLeave,
}: AgentAvatarButtonProps) {
  return (
    <button
      onClick={onClick}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: "6px",
        cursor: "pointer",
        transition: "all 0.3s ease",
        padding: "4px 0",
        borderRadius: "12px",
        border: "none",
        background: isHovered ? "rgba(201, 169, 110, 0.1)" : "transparent",
        transform: isHovered ? "translateY(-5px)" : "none",
        position: "relative",
      }}
    >
      <img
        src={image}
        alt={name}
        style={{
          width: "64px",
          height: "64px",
          borderRadius: "50%",
          objectFit: "cover",
          border: isHovered ? "3px solid #C9A96E" : "3px solid transparent",
          transition: "all 0.3s ease",
          boxShadow: isHovered
            ? "0 8px 25px rgba(201, 169, 110, 0.4)"
            : "0 4px 15px rgba(0,0,0,0.12)",
        }}
      />
      <span
        style={{
          fontSize: "13px",
          color: isHovered ? "#8B7355" : "#666",
          whiteSpace: "nowrap",
          textAlign: "center",
          fontWeight: 500,
          transition: "color 0.3s",
        }}
      >
        {name}
      </span>
    </button>
  )
}
