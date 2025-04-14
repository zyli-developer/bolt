"use client"

import { useState } from "react"
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

  const toggleRadarChart = () => {
    setShowRadarChart(!showRadarChart)
  }

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

      {/* 卡片内容 - 新的单列布局 */}
      <div className="card-content-new">
        {/* 问题概要 */}
        <div className="card-summary">
          <h3 className="summary-title">问题概要</h3>
          <p className="summary-text">{card.summary}</p>
        </div>

        {/* 指标和图表区域 */}
        <div className="card-metrics-charts">
          {/* 左侧指标 */}
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

          {/* 中间雷达图 - 条件渲染 */}
          {showRadarChart && (
            <div className="radar-chart-container">
              <div className="radar-chart-title">各维度得分</div>
              <div className="radar-chart-new">
                <ResponsiveContainer width="100%" height={200}>
                  <RadarChart data={card.chartData.radar} outerRadius={70}>
                    <PolarGrid />
                    <PolarAngleAxis dataKey="name" />
                    <PolarRadiusAxis domain={[0, 100]} />
                    <Radar name="Value" dataKey="value" stroke="#006ffd" fill="#006ffd" fillOpacity={0.2} />
                  </RadarChart>
                </ResponsiveContainer>
              </div>

              {/* Agent 兼容性 */}
              {card.agents && (
                <div className="card-agents-new">
                  <div className="agents-list-new">
                    <div className="agent-item-new">
                      <Checkbox checked={card.agents.overall}>Overall</Checkbox>
                    </div>
                    <div className="agent-item-new">
                      <Checkbox checked={card.agents.agent1}>Agent 1</Checkbox>
                    </div>
                    <div className="agent-item-new">
                      <Checkbox checked={card.agents.agent2}>Agent 2</Checkbox>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* 右侧置信度爬升曲线 */}
          <div className="trend-section-new">
            <div className="trend-title">置信度爬升曲线</div>
            <div className="line-chart-container-new">
              <ResponsiveContainer width="100%" height={120}>
                <LineChart data={card.chartData.line} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                  <XAxis dataKey="month" />
                  <YAxis domain={[0, 100]} />
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
