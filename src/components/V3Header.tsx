import { useState } from "react"
import { useChatContext } from "@/App"

export type V3Tab = "employee" | "support" | "collab"

interface Props {
  activeTab: V3Tab
  onTabChange: (tab: V3Tab) => void
}

const tabs: { key: V3Tab; label: string }[] = [
  { key: "employee", label: "员工端" },
  { key: "support", label: "业务支持端" },
  { key: "collab", label: "协同端" },
]

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

const supportNames = [
  "投行支持中心",
  "资管支持中心",
  "零售支持中心",
  "投资支持中心",
  "销交支持中心",
  "机构支持中心",
  "交叉验证中心",
]

const collabNames = [
  "机构业务协同",
  "销售业务协同",
  "跨部门协同",
  "投行业务协同",
  "资管业务协同",
  "零售业务协同",
  "交叉验证协同",
]

const namesMap: Record<V3Tab, string[]> = {
  employee: employeeNames,
  support: supportNames,
  collab: collabNames,
}

/** 各端角标配置：索引 -> 数量 */
const badgeMap: Record<V3Tab, Record<number, number>> = {
  employee: {},
  support: { 0: 2, 1: 3 },
  collab: { 0: 3, 1: 5 },
}

export function V3Header({ activeTab, onTabChange }: Props) {
  const { openChat, triggerAgentClick } = useChatContext()
  const names = namesMap[activeTab]
  const badges = badgeMap[activeTab]
  const [hoveredIdx, setHoveredIdx] = useState<number | null>(null)

  const handleAgentClick = (i: number) => {
    const name = names[i]
    const image = agentImages[i]
    const badgeCount = badges[i] ?? 0
    const hasBadge = badgeCount > 0

    if (activeTab === "employee") {
      // 员工端保持原有行为
      openChat({ name, image })
    } else {
      // 业务支持端 / 协同端：触发智能体点击事件
      triggerAgentClick({ name, image, hasBadge, badgeCount, tab: activeTab })
    }
  }

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
          alignItems: "center",
          gap: "12px",
        }}
      >
        {/* 左侧：标题（上）+ Tab（下） */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "flex-start",
            gap: "6px",
            flexShrink: 0,
          }}
        >
          {/* 上：Logo + 员工工作台 */}
          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <span style={{ fontSize: "28px" }}>📊</span>
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
          {/* 下：三端 Tab 切换 */}
          <div style={{ display: "flex", alignItems: "center", gap: "4px" }}>
            {tabs.map((tab, i) => {
              const isActive = activeTab === tab.key
              return (
                <div key={tab.key} style={{ display: "flex", alignItems: "center" }}>
                  <button
                    onClick={() => onTabChange(tab.key)}
                    style={{
                      padding: "4px 10px",
                      borderRadius: "12px",
                      fontSize: "13px",
                      cursor: "pointer",
                      border: "none",
                      background: isActive
                        ? "linear-gradient(135deg, #C9A96E, #E8D5A3)"
                        : "transparent",
                      color: isActive ? "#fff" : "#888",
                      fontWeight: isActive ? 600 : 400,
                      transition: "all 0.3s",
                    }}
                  >
                    {tab.label}
                  </button>
                  {i < tabs.length - 1 && (
                    <span style={{ color: "#ddd", margin: "0 3px", fontSize: "12px" }}>
                      |
                    </span>
                  )}
                </div>
              )
            })}
          </div>
        </div>

        {/* 竖线分隔 */}
        <div
          style={{
            width: "2px",
            height: "110px",
            background:
              "linear-gradient(180deg, transparent 0%, #e8e8e8 15%, #e8e8e8 85%, transparent 100%)",
            flexShrink: 0,
            margin: "0 5px",
          }}
        />

        {/* 右侧：7 个智能体头像（均匀平铺） */}
        <div
          style={{
            display: "flex",
            alignItems: "flex-start",
            flex: 1,
            justifyContent: "space-around",
          }}
        >
          {agentImages.map((img, i) => {
            const badgeCount = badges[i]
            const hasBadge = badgeCount !== undefined
            return (
              <button
                key={names[i]}
                onClick={() => handleAgentClick(i)}
                onMouseEnter={() => setHoveredIdx(i)}
                onMouseLeave={() => setHoveredIdx(null)}
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
                  background:
                    hoveredIdx === i ? "rgba(201, 169, 110, 0.1)" : "transparent",
                  transform: hoveredIdx === i ? "translateY(-5px)" : "none",
                  position: "relative",
                }}
              >
                {/* 头像容器（用于角标定位） */}
                <div style={{ position: "relative" }}>
                  <img
                    src={img}
                    alt={names[i]}
                    style={{
                      width: "64px",
                      height: "64px",
                      borderRadius: "50%",
                      objectFit: "cover",
                      border:
                        hoveredIdx === i ? "3px solid #C9A96E" : "3px solid transparent",
                      transition: "all 0.3s ease",
                      boxShadow: hoveredIdx === i
                        ? "0 8px 25px rgba(201, 169, 110, 0.4)"
                        : "0 4px 15px rgba(0,0,0,0.12)",
                    }}
                  />
                  {/* 角标 */}
                  {hasBadge && (
                    <span
                      style={{
                        position: "absolute",
                        top: "-2px",
                        right: "-2px",
                        minWidth: "18px",
                        height: "18px",
                        background: "#EF4444",
                        color: "#fff",
                        fontSize: "11px",
                        fontWeight: 600,
                        borderRadius: "50%",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        padding: "0 4px",
                        boxShadow: "0 2px 6px rgba(239, 68, 68, 0.4)",
                        border: "2px solid #fff",
                      }}
                    >
                      {badgeCount}
                    </span>
                  )}
                </div>
                <span
                  style={{
                    fontSize: "13px",
                    color: hoveredIdx === i ? "#8B7355" : "#666",
                    whiteSpace: "nowrap",
                    textAlign: "center",
                    fontWeight: 500,
                    transition: "color 0.3s",
                  }}
                >
                  {names[i]}
                </span>
              </button>
            )
          })}
        </div>
      </div>
    </section>
  )
}
