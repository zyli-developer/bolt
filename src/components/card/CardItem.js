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
  Area,
  AreaChart
} from "recharts"
import CreateTaskModal from "../modals/CreateTaskModal"
import { useNavigate } from "react-router-dom"
import "./card.css"

const CardItem = ({ card }) => {
  // 确保 card 对象存在且包含必要的属性
  const safeCard = useMemo(() => {
    if (!card) return {
      id: '',
      title: '未知标题',
      summary: '无概要信息',
      author: { name: '未知', avatar: null },
      source: '未知来源',
      tags: [],
      credibility: 0,
      credibilityChange: '+0%',
      score: 0,
      scoreChange: '+0%',
      chartData: { radar: [], line: [] },
      agents: { overall: false, agent1: false, agent2: false },
      qa: { question: '', answer: '' },
      questionDescription: '',
      answerDescription: ''
    };
    
    // 提供默认值以防属性不存在
    return {
      id: card.id || '',
      title: card.title || card.prompt || '未知标题',
      summary: card.summary || card.response_summary || '无概要信息',
      author: {
        name: card.author?.name || card.created_by || '未知',
        avatar: card.author?.avatar || null,
      },
      source: card.source || card.created_from || '未知来源',
      tags: card.tags || [],
      credibility: parseFloat(card.credibility || card.step?.[0]?.score?.[0]?.confidence || 0) || 0,
      credibilityChange: card.credibilityChange || '+0%',
      score: parseFloat(card.score || card.step?.[0]?.score?.[0]?.score || 0) * 10 || 0,
      scoreChange: card.scoreChange || '+0%',
      chartData: {
        radar: card.chartData?.radar || (card.step?.[0]?.score?.[0]?.dimension?.map(dim => ({
          name: dim.latitude,
          weight: parseFloat(dim.weight),
          value: parseFloat(dim.weight) * 100
        })) || []),
        line: card.chartData?.line || [
          { month: "08", value: 65 },
          { month: "09", value: 75 },
          { month: "10", value: 85 },
          { month: "11", value: parseFloat(card.step?.[0]?.score?.[0]?.score || 0) * 100 || 0 }
        ]
      },
      agents: card.agents || { overall: true, agent1: false, agent2: false },
      qa: card.qa || { 
        question: card.question || card.questionDescription || "",
        answer: card.answer || card.answerDescription || ""
      },
      questionDescription: card.questionDescription || card.qa?.question || card.question || "",
      answerDescription: card.answerDescription || card.qa?.answer || card.answer || ""
    };
  }, [card]);
  
  const navigate = useNavigate()
  const [showRadarChart, setShowRadarChart] = useState(false)
  const [selectedAgents, setSelectedAgents] = useState({
    overall: safeCard.agents?.overall || false,
    agent1: safeCard.agents?.agent1 || false,
    agent2: safeCard.agents?.agent2 || false,
  })
  const [isCreateTaskModalVisible, setIsCreateTaskModalVisible] = useState(false)
  const [completeCardData, setCompleteCardData] = useState({
    ...safeCard,
    questionDescription: safeCard.prompt || "基于卡片创建的问题描述。\n\n请在此处描述您想要测试或评估的内容。",
    answerDescription: safeCard.response_summary || safeCard.summary || "基于卡片创建的答案描述。\n\n请在此处描述预期的测试结果或评估标准。"
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

  const handleBranchClimbClick = () => {
    // 在点击"分支为新任务"按钮时，构建一个包含完整数据的对象
    // 正确映射字段名：问题描述(questionDescription)对应prompt，回答描述(answerDescription)对应response_summary
    const newCompleteCardData = {
      ...safeCard,
      questionDescription: safeCard.prompt || "基于卡片创建的问题描述。\n\n请在此处描述您想要测试或评估的内容。",
      answerDescription: safeCard.response_summary || safeCard.summary || "基于卡片创建的答案描述。\n\n请在此处描述预期的测试结果或评估标准。"
    };
    // 更新状态
    setCompleteCardData(newCompleteCardData)
    setIsCreateTaskModalVisible(true)
  }

  const handleModalCancel = () => {
    setIsCreateTaskModalVisible(false)
  }

  // Update the handleTitleClick function in CardItem.js
  const handleTitleClick = () => {
    // Navigate to the card detail page with state to track where we came from
    navigate(`/explore/detail/${safeCard.id}`, { state: { from: "explore" } })
  }

  // Generate unique radar data for each card
  const generateUniqueRadarData = useMemo(() => {
    if (!safeCard.chartData?.radar || safeCard.chartData.radar.length === 0) return []

    return safeCard.chartData.radar.map((item, index) => {
      // Create different values for each agent
      return {
        name: item.name,
        value: item.value,
        claude: Math.min(100, item.value * (1 + Math.sin(index * 0.5) * 0.2)),
        agent2: Math.min(100, item.value * (1 - Math.cos(index * 0.5) * 0.15)),
      }
    })
  }, [safeCard.chartData?.radar])

  // Generate unique line data for each card
  const generateUniqueLineData = useMemo(() => {
    if (!safeCard.chartData?.line || safeCard.chartData.line.length === 0) return []

    return safeCard.chartData.line.map((item, index) => {
      // Create different values for each agent
      return {
        month: item.month,
        value: item.value,
        claude: Math.min(100, item.value * (1 + Math.sin(index * 0.7) * 0.1)),
        agent2: Math.min(100, item.value * (1 - Math.cos(index * 0.7) * 0.1)),
      }
    })
  }, [safeCard.chartData?.line])

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
          {safeCard.title}
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
          分支为新任务
        </button>
      </div>

      {/* Author info and tags */}
      <div className="card-meta">
        <div className="author-info">
          <Avatar size={20} src={safeCard.author.avatar} className="author-avatar">
            {safeCard.author.name ? safeCard.author.name.charAt(0) : 'U'}
          </Avatar>
          <span className="by-text">by</span>
          <span className="author-name">{safeCard.author.name || '未知用户'}</span>
          <span className="from-text">from</span>
          <span className="source-name">{safeCard.source || '未知来源'}</span>
        </div>
        <div className="card-tags">
          {(safeCard.tags || []).map((tag, index) => (
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
            <p className="summary-text">{safeCard.summary}</p>
          </div>

          {/* Metrics section */}
          <div className="card-metrics">
            <div className="metrics-container">
              <div className="metric-item">
                <div className="metric-value" style={{ fontSize: '20px' }}>{safeCard.credibility.toFixed(1)}%</div>
                <div className="metric-info">
                  <div className="metric-label">可信度</div>
                  <div className={`metric-change ${(safeCard.credibilityChange || '').startsWith("+") ? "positive" : "negative"}`}>
                    {safeCard.credibilityChange || '+0%'}
                  </div>
                </div>
              </div>

              <div className="metric-item">
                <div className="metric-value" style={{ fontSize: '20px' }}>{safeCard.score.toFixed(1)}</div>
                <div className="metric-info">
                  <div className="metric-label">评分</div>
                  <div className={`metric-change ${(safeCard.scoreChange || '').startsWith("+") ? "positive" : "negative"}`}>
                    {safeCard.scoreChange || '+0%'}
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

        {showRadarChart && ( <div className="card-right-section">
         
            <div className="radar-chart-container">
              <div className="radar-chart-title">各维度得分</div>
              <div className="radar-chart">
                <ResponsiveContainer width="100%" height={130}>
                  <RadarChart data={filteredRadarData} outerRadius={45}>
                    <PolarGrid stroke="#e0e0e0" />
                    <PolarAngleAxis dataKey="name" tick={{ fontSize: 8, fill: "#8f9098" }} />
                    <PolarRadiusAxis domain={[0, 100]} tick={{ fontSize: 8, fill: "#8f9098" }} axisLine={false} />
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
        </div>
          )}
        {/* Right section - charts */}
        <div className="card-right-section">
          {/* {showRadarChart && (
            <div className="radar-chart-container">
              <div className="radar-chart-title">各维度得分</div>
              <div className="radar-chart">
                <ResponsiveContainer width="100%" height={130}>
                  <RadarChart data={filteredRadarData} outerRadius={45}>
                    <PolarGrid stroke="#e0e0e0" />
                    <PolarAngleAxis dataKey="name" tick={{ fontSize: 8, fill: "#8f9098" }} />
                    <PolarRadiusAxis domain={[0, 100]} tick={{ fontSize: 8, fill: "#8f9098" }} axisLine={false} />
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
          )} */}

          {/* Line chart */}
          <div className={`line-chart-container ${showRadarChart ? "with-radar" : ""}`}>
            <div className="line-chart-title">可信度爬升曲线</div>
            <div className="line-chart">
              <ResponsiveContainer width="100%" height={130}>
                <AreaChart data={generateUniqueLineData} margin={{ top: 3, right: 3, left: 0, bottom: 3 }}>
                  <XAxis
                    dataKey="month"
                    tick={{ fontSize: 8, fill: "#8f9098" }}
                    axisLine={{ stroke: "#e0e0e0" }}
                    tickLine={false}
                  />
                  <YAxis domain={[0, 100]} tick={{ fontSize: 8, fill: "#8f9098" }} axisLine={false} tickLine={false} />
                  <RechartsTooltip />
                  <defs>
                    <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="var(--color-assist-1)" stopOpacity={0.6}/>
                      <stop offset="95%" stopColor="var(--color-assist-1)" stopOpacity={0.1}/>
                    </linearGradient>
                    <linearGradient id="colorClaude" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#3ac0a0" stopOpacity={0.6}/>
                      <stop offset="95%" stopColor="#3ac0a0" stopOpacity={0.1}/>
                    </linearGradient>
                    <linearGradient id="colorAgent2" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#ff7a45" stopOpacity={0.6}/>
                      <stop offset="95%" stopColor="#ff7a45" stopOpacity={0.1}/>
                    </linearGradient>
                  </defs>
                  <Area
                    type="monotone"
                    dataKey="value"
                    stroke="var(--color-assist-1)"
                    strokeWidth={1.5}
                    fillOpacity={1}
                    fill="url(#colorValue)"
                    dot={{ r: 2.5, fill: "var(--color-assist-1)" }}
                    activeDot={{ r: 4 }}
                  />
                  {selectedAgents.agent1 && (
                    <Area
                      type="monotone"
                      dataKey="claude"
                      stroke="#3ac0a0"
                      strokeWidth={1.5}
                      fillOpacity={1}
                      fill="url(#colorClaude)"
                      dot={{ r: 2.5, fill: "#3ac0a0" }}
                      activeDot={{ r: 4 }}
                    />
                  )}
                  {selectedAgents.agent2 && (
                    <Area
                      type="monotone"
                      dataKey="agent2"
                      stroke="#ff7a45"
                      strokeWidth={1.5}
                      fillOpacity={1}
                      fill="url(#colorAgent2)"
                      dot={{ r: 2.5, fill: "#ff7a45" }}
                      activeDot={{ r: 4 }}
                    />
                  )}
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      </div>

      {/* Create task modal */}
      <CreateTaskModal
        visible={isCreateTaskModalVisible}
        onCancel={handleModalCancel}
        cardData={completeCardData}
      />
    </div>
  )
}

export default CardItem
