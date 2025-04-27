"use client"

import { useState, useMemo } from "react"
import { Avatar, Tag, Checkbox } from "antd"
import {
  LineChart,
  Line,
  ResponsiveContainer,
  XAxis,
  YAxis,
  Tooltip as RechartsTooltip,
  Radar,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
} from "recharts"
import CreateTaskModal from "../modals/CreateTaskModal"
import { useNavigate } from "react-router-dom"
import "./card.css"

const CardItem = ({ card }) => {
  const navigate = useNavigate()
  const [showRadarChart, setShowRadarChart] = useState(false)
  const [selectedAgents, setSelectedAgents] = useState({
    overall: card.agents?.overall || false,
    agent1: card.agents?.agent1 || false,
    agent2: card.agents?.agent2 || false,
  })
  const [isCreateTaskModalVisible, setIsCreateTaskModalVisible] = useState(false)

  const toggleRadarChart = () => {
    setShowRadarChart(!showRadarChart)
  }

  const handleAgentChange = (agentKey) => {
    setSelectedAgents({
      ...selectedAgents,
      [agentKey]: !selectedAgents[agentKey],
    })
  }

  const handleBranchClimbClick = () => {
    setIsCreateTaskModalVisible(true)
  }

  const handleModalCancel = () => {
    setIsCreateTaskModalVisible(false)
  }

  // Update the handleTitleClick function in CardItem.js
  const handleTitleClick = () => {
    // Navigate to the card detail page with state to track where we came from
    navigate(`/explore/detail/${card.id}`, { state: { from: "explore" } })
  }

  // Generate unique radar data for each card
  const generateUniqueRadarData = useMemo(() => {
    if (!card.chartData?.radar) return []

    return card.chartData.radar.map((item, index) => {
      // Create different values for each agent
      return {
        name: item.name,
        value: item.value,
        claude: Math.min(100, item.value * (1 + Math.sin(index * 0.5) * 0.2)),
        agent2: Math.min(100, item.value * (1 - Math.cos(index * 0.5) * 0.15)),
      }
    })
  }, [card.chartData?.radar])

  // Generate unique line data for each card
  const generateUniqueLineData = useMemo(() => {
    if (!card.chartData?.line) return []

    return card.chartData.line.map((item, index) => {
      // Create different values for each agent
      return {
        month: item.month,
        value: item.value,
        claude: Math.min(100, item.value * (1 + Math.sin(index * 0.7) * 0.1)),
        agent2: Math.min(100, item.value * (1 - Math.cos(index * 0.7) * 0.1)),
      }
    })
  }, [card.chartData?.line])

  // Filter radar data based on selected agents
  const filteredRadarData = useMemo(() => {
    // If no agents selected, return original data
    if (!selectedAgents.overall && !selectedAgents.agent1 && !selectedAgents.agent2) {
      return generateUniqueRadarData
    }

    return generateUniqueRadarData
  }, [generateUniqueRadarData, selectedAgents])

  return (
    <div className="card-item">
      {/* Card title and button */}
      <div className="card-header">
        <h2 className="card-title-text" onClick={handleTitleClick}>
          {card.title}
        </h2>
        <button className="branch-climb-button" onClick={handleBranchClimbClick}>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="share-icon"
          >
            <path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8" />
            <polyline points="16 6 12 2 8 6" />
            <line x1="12" y1="2" x2="12" y2="15" />
          </svg>
          分支爬升
        </button>
      </div>

      {/* Author info and tags */}
      <div className="card-meta">
        <div className="author-info">
          <Avatar size={20} src={card.author.avatar} className="author-avatar">
            {card.author.name.charAt(0)}
          </Avatar>
          <span className="by-text">by</span>
          <span className="author-name">{card.author.name}</span>
          <span className="from-text">from</span>
          <span className="source-name">{card.source}</span>
        </div>
        <div className="card-tags">
          {card.tags.map((tag, index) => (
            <Tag key={index} className="card-tag">
              {tag}
            </Tag>
          ))}
        </div>
      </div>

      <div className="card-divider"></div>

      {/* Card content - horizontal layout */}
      <div className="card-content-horizontal">
        {/* Left section - problem summary and metrics */}
        <div className={`card-left-section ${showRadarChart ? "with-radar" : ""}`}>
          <div className="card-summary">
            <h3 className="summary-title">问题概要</h3>
            <p className="summary-text">{card.summary}</p>
          </div>

          {/* Metrics section */}
          <div className="card-metrics">
            <div className="metrics-container">
              <div className="metric-item">
                <div className="metric-value">{card.credibility}%</div>
                <div className="metric-info">
                  <div className="metric-label">Credibility</div>
                  <div className={`metric-change ${card.credibilityChange.startsWith("+") ? "positive" : "negative"}`}>
                    {card.credibilityChange}
                  </div>
                </div>
              </div>

              <div className="metric-item">
                <div className="metric-value">{card.score}</div>
                <div className="metric-info">
                  <div className="metric-label">Score</div>
                  <div className={`metric-change ${card.scoreChange.startsWith("+") ? "positive" : "negative"}`}>
                    {card.scoreChange}
                  </div>
                </div>
              </div>
            </div>

            {/* Dimension score link */}
            <div className="dimension-link" onClick={toggleRadarChart}>
              <span>{showRadarChart ? "收起" : "各维度得分"}</span>
              <span className="dimension-arrow">{showRadarChart ? "←" : "→"}</span>
            </div>
          </div>
        </div>

        {/* Right section - charts */}
        <div className="card-right-section">
          {showRadarChart && (
            <div className="radar-chart-container">
              <div className="radar-chart-title">各维度得分</div>
              <div className="radar-chart">
                <ResponsiveContainer width="100%" height={180}>
                  <RadarChart data={filteredRadarData} outerRadius={60}>
                    <PolarGrid stroke="#e0e0e0" />
                    <PolarAngleAxis dataKey="name" tick={{ fontSize: 10, fill: "#8f9098" }} />
                    <PolarRadiusAxis domain={[0, 100]} tick={{ fontSize: 10, fill: "#8f9098" }} axisLine={false} />
                    {selectedAgents.overall && (
                      <Radar name="Overall" dataKey="value" stroke="#006ffd" fill="#006ffd" fillOpacity={0.2} />
                    )}
                    {selectedAgents.agent1 && (
                      <Radar name="Agent 1" dataKey="claude" stroke="#3ac0a0" fill="#3ac0a0" fillOpacity={0.2} />
                    )}
                    {selectedAgents.agent2 && (
                      <Radar name="Agent 2" dataKey="agent2" stroke="#ff7a45" fill="#ff7a45" fillOpacity={0.2} />
                    )}
                  </RadarChart>
                </ResponsiveContainer>
              </div>
              <div className="card-agents">
                <div className="agents-list">
                  <div className="agent-item">
                    <Checkbox checked={selectedAgents.overall} onChange={() => handleAgentChange("overall")}>
                      Overall
                    </Checkbox>
                  </div>
                  <div className="agent-item">
                    <Checkbox checked={selectedAgents.agent1} onChange={() => handleAgentChange("agent1")}>
                      Agent 1
                    </Checkbox>
                  </div>
                  <div className="agent-item">
                    <Checkbox checked={selectedAgents.agent2} onChange={() => handleAgentChange("agent2")}>
                      Agent 2
                    </Checkbox>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Line chart */}
          <div className={`line-chart-container ${showRadarChart ? "with-radar" : ""}`}>
            <div className="line-chart-title">置信度爬升曲线</div>
            <div className="line-chart">
              <ResponsiveContainer width="100%" height={180}>
                <LineChart data={generateUniqueLineData} margin={{ top: 5, right: 5, left: 0, bottom: 5 }}>
                  <XAxis
                    dataKey="month"
                    tick={{ fontSize: 10, fill: "#8f9098" }}
                    axisLine={{ stroke: "#e0e0e0" }}
                    tickLine={false}
                  />
                  <YAxis domain={[0, 100]} tick={{ fontSize: 10, fill: "#8f9098" }} axisLine={false} tickLine={false} />
                  <RechartsTooltip />
                  <Line
                    type="monotone"
                    dataKey="value"
                    stroke="#006ffd"
                    strokeWidth={2}
                    dot={{ r: 3, fill: "#006ffd" }}
                    activeDot={{ r: 5 }}
                  />
                  {selectedAgents.agent1 && (
                    <Line
                      type="monotone"
                      dataKey="claude"
                      stroke="#3ac0a0"
                      strokeWidth={2}
                      dot={{ r: 3, fill: "#3ac0a0" }}
                      activeDot={{ r: 5 }}
                    />
                  )}
                  {selectedAgents.agent2 && (
                    <Line
                      type="monotone"
                      dataKey="agent2"
                      stroke="#ff7a45"
                      strokeWidth={2}
                      dot={{ r: 3, fill: "#ff7a45" }}
                      activeDot={{ r: 5 }}
                    />
                  )}
                </LineChart>
              </ResponsiveContainer>
            </div>
            <div className="chart-info">
              <div className="chart-time-author">
                <span className="chart-time">{card.updatedAt}</span>
                <span className="by-text">by</span>
                <Avatar size={16} src={card.updatedBy.avatar} className="updater-avatar">
                  {card.updatedBy.name.charAt(0)}
                </Avatar>
                <span className="updater-name">{card.updatedBy.name}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Create Task Modal */}
      <CreateTaskModal visible={isCreateTaskModalVisible} onCancel={handleModalCancel} cardData={card} />
    </div>
  )
}

export default CardItem
