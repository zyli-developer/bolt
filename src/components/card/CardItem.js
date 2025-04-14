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

const CardItem = ({ card }) => {
  const [showRadarChart, setShowRadarChart] = useState(false)
  const [selectedAgents, setSelectedAgents] = useState({
    overall: card.agents?.overall || false,
    agent1: card.agents?.agent1 || false,
    agent2: card.agents?.agent2 || false,
  })

  const toggleRadarChart = () => {
    setShowRadarChart(!showRadarChart)
  }

  const handleAgentChange = (agentKey) => {
    setSelectedAgents({
      ...selectedAgents,
      [agentKey]: !selectedAgents[agentKey],
    })
  }

  // 根据选中的Agent过滤雷达图数据
  const filteredRadarData = useMemo(() => {
    if (!card.chartData?.radar) return []

    // 如果没有选中任何Agent，返回原始数据
    if (!selectedAgents.overall && !selectedAgents.agent1 && !selectedAgents.agent2) {
      return card.chartData.radar
    }

    // 根据选中的Agent过滤数据
    // 这里假设每个维度有overall, agent1, agent2三个值
    // 实际实现可能需要根据真实数据结构调整
    return card.chartData.radar.map((item) => {
      const newItem = { name: item.name }

      if (selectedAgents.overall) newItem.overall = item.value
      if (selectedAgents.agent1) newItem.agent1 = item.value * 0.9 // 模拟不同agent的值
      if (selectedAgents.agent2) newItem.agent2 = item.value * 0.8 // 模拟不同agent的值

      return newItem
    })
  }, [card.chartData?.radar, selectedAgents])

  return (
    <div className="card-item">
      {/* 卡片标题 */}
      <div className="card-title">
        <h2>{card.title}</h2>
      </div>

      {/* 作者信息和标签 */}
      <div className="card-author">
        <div className="author-info">
          <Avatar size={24} src={card.author.avatar} className="author-avatar">
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

      {/* 卡片内容 - 水平布局 */}
      <div className="card-content-horizontal">
        {/* 左侧内容：问题概要和指标 */}
        <div className="card-left-section">
          {/* 问题概要 */}
          <div className="card-summary">
            <h3 className="summary-title">问题概要</h3>
            <p className="summary-text">{card.summary}</p>
          </div>

          {/* 指标区域 */}
          <div className="card-metrics-new">
            <div className="metric-item-new">
              <div className="metric-value-new">{card.credibility}%</div>
              <div className="metric-info">
                <div className="metric-label">Credibility</div>
                <div className={`metric-change ${card.credibilityChange.startsWith("+") ? "positive" : "negative"}`}>
                  {card.credibilityChange}
                </div>
              </div>
            </div>

            <div className="metric-item-new">
              <div className="metric-value-new">{card.score}</div>
              <div className="metric-info">
                <div className="metric-label">Score</div>
                <div className={`metric-change ${card.scoreChange.startsWith("+") ? "positive" : "negative"}`}>
                  {card.scoreChange}
                </div>
              </div>
            </div>

            {/* 各维度得分链接/收起链接 */}
            <div className="dimension-link" onClick={toggleRadarChart}>
              {showRadarChart ? (
                <>
                  <span>收起</span>
                  <span className="dimension-arrow">←</span>
                </>
              ) : (
                <>
                  <span>各维度得分</span>
                  <span className="dimension-arrow">→</span>
                </>
              )}
            </div>
          </div>
        </div>

        {/* 右侧内容：图表区域 */}
        <div className="card-right-section">
          {showRadarChart ? (
            /* 雷达图和折线图水平布局 */
            <div className="charts-horizontal-layout">
              {/* 雷达图区域 */}
              <div className="radar-chart-section">
                <div className="radar-chart-title">各维度得分</div>
                <div className="radar-chart-new">
                  <ResponsiveContainer width="100%" height={180}>
                    <RadarChart data={filteredRadarData} outerRadius={60}>
                      <PolarGrid />
                      <PolarAngleAxis dataKey="name" tick={{ fontSize: 10 }} />
                      <PolarRadiusAxis domain={[0, 100]} tick={{ fontSize: 10 }} />
                      {selectedAgents.overall && (
                        <Radar name="Overall" dataKey="overall" stroke="#006ffd" fill="#006ffd" fillOpacity={0.2} />
                      )}
                      {selectedAgents.agent1 && (
                        <Radar name="Agent 1" dataKey="agent1" stroke="#3ac0a0" fill="#3ac0a0" fillOpacity={0.2} />
                      )}
                      {selectedAgents.agent2 && (
                        <Radar name="Agent 2" dataKey="agent2" stroke="#ff7a45" fill="#ff7a45" fillOpacity={0.2} />
                      )}
                    </RadarChart>
                  </ResponsiveContainer>
                </div>

                {/* Agent 兼容性 */}
                {card.agents && (
                  <div className="card-agents-new">
                    <div className="agents-list-new">
                      <div className="agent-item-new">
                        <Checkbox checked={selectedAgents.overall} onChange={() => handleAgentChange("overall")}>
                          Overall
                        </Checkbox>
                      </div>
                      <div className="agent-item-new">
                        <Checkbox checked={selectedAgents.agent1} onChange={() => handleAgentChange("agent1")}>
                          Agent 1
                        </Checkbox>
                      </div>
                      <div className="agent-item-new">
                        <Checkbox checked={selectedAgents.agent2} onChange={() => handleAgentChange("agent2")}>
                          Agent 2
                        </Checkbox>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* 置信度爬升曲线 */}
              <div className="trend-section-new">
                <div className="trend-title">置信度爬升曲线</div>
                <div className="line-chart-container-new">
                  <ResponsiveContainer width="100%" height={180}>
                    <LineChart data={card.chartData.line} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                      <XAxis dataKey="month" tick={{ fontSize: 10 }} />
                      <YAxis domain={[0, 100]} tick={{ fontSize: 10 }} />
                      <RechartsTooltip />
                      <Line type="monotone" dataKey="value" stroke="#006ffd" strokeWidth={2} dot={{ r: 3 }} />
                    </LineChart>
                  </ResponsiveContainer>
                  <div className="chart-footer-new">
                    <div className="chart-time">{card.updatedAt} by</div>
                    <Avatar size={16} src={card.updatedBy.avatar} className="updater-avatar">
                      {card.updatedBy.name.charAt(0)}
                    </Avatar>
                    <span className="updater-name">{card.updatedBy.name}</span>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            /* 只显示置信度爬升曲线 */
            <div className="trend-section-new trend-section-only">
              <div className="trend-title">置信度爬升曲线</div>
              <div className="line-chart-container-new">
                <ResponsiveContainer width="100%" height={200}>
                  <LineChart data={card.chartData.line} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                    <XAxis dataKey="month" tick={{ fontSize: 10 }} />
                    <YAxis domain={[0, 100]} tick={{ fontSize: 10 }} />
                    <RechartsTooltip />
                    <Line type="monotone" dataKey="value" stroke="#006ffd" strokeWidth={2} dot={{ r: 3 }} />
                  </LineChart>
                </ResponsiveContainer>
                <div className="chart-footer-new">
                  <div className="chart-time">{card.updatedAt} by</div>
                  <Avatar size={16} src={card.updatedBy.avatar} className="updater-avatar">
                    {card.updatedBy.name.charAt(0)}
                  </Avatar>
                  <span className="updater-name">{card.updatedBy.name}</span>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* 分支爬升按钮 */}
      <div className="card-action-button-new">
        <button className="branch-climb-button-new">
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
    </div>
  )
}

export default CardItem
