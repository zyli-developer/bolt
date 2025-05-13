"use client"

import { useState } from "react"
import { Avatar, Tag, Checkbox } from "antd"
import { useNavigate } from "react-router-dom"
import {
  LineChart,
  Line,
  ResponsiveContainer,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as RechartsTooltip,
  Radar,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Area,
  AreaChart
} from "recharts"
import { FileTextOutlined, PlusOutlined } from "@ant-design/icons"
import CreateTaskModal from "../modals/CreateTaskModal"

const TaskCard = ({ task }) => {
  const navigate = useNavigate()
  const [showRadarChart, setShowRadarChart] = useState(false)
  const [selectedAgents, setSelectedAgents] = useState({
    overall: true,
    agent1: false,
    agent2: false,
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

  // Update the handleTitleClick function in TaskCard.js
  const handleTitleClick = () => {
    // 提取任务ID的数字部分，如果ID是"task101"格式，则提取"101"
    const numericId = task.id.toString().replace(/^task/i, "");
    // Navigate to the task detail page with state to track where we came from
    navigate(`/tasks/detail/${numericId}`, { state: { from: "tasks" } })
  }

  // Filter radar data based on selected agents
  const filteredRadarData = task.chartData?.radar || [
    { name: "维度1", value: 70 },
    { name: "维度2", value: 80 },
    { name: "维度3", value: 60 },
    { name: "维度4", value: 90 },
    { name: "维度5", value: 75 },
    { name: "维度6", value: 85 },
  ]

  const handleModalCancel = () => {
    setIsCreateTaskModalVisible(false)
  }

  return (
    <div className="task-card">
      {/* Card title */}
      <div className="task-card-header">
        <h2 className="task-card-title" onClick={handleTitleClick}>
          {task.title}
        </h2>
      </div>

      {/* Author info and tags */}
      <div className="task-card-meta">
        <div className="task-author-info">
          <Avatar size={32} src={task.author.avatar} className="task-author-avatar">
            {task.author.name.charAt(0)}
          </Avatar>
          <span className="task-assigned-text">Assigned by</span>
          <span className="task-author-name">{task.author.name}</span>
          <span className="task-from-text">from</span>
          <span className="task-source-name">{task.source}</span>
        </div>
        <div className="task-card-tags">
          {task.tags.map((tag, index) => (
            <Tag key={index} className="task-tag">
              {tag}
            </Tag>
          ))}
        </div>
      </div>

      <div className="task-card-divider"></div>

      {/* Card content - horizontal layout */}
      <div className="task-card-content">
        {/* Left section - task details */}
        <div className="task-card-left">
          <div className="task-details">
            <div className="task-detail-item">
              <span className="task-detail-label">状态：</span>
              <span className="task-detail-value">待启动</span>
            </div>

            <div className="task-detail-item">
              <span className="task-detail-label">目标：</span>
              <span className="task-detail-value">
                {task.description || "目标目标目标目标目标目标目标目标目标目标目标目标目标目标目标目标目标目标"}
              </span>
            </div>
          </div>

          {/* Action buttons */}
          <div className="task-actions">
            <div className="task-action-buttons">
              <div className="task-action-item active">
                <div className="task-action-icon">
                  <FileTextOutlined />
                </div>
                <div className="task-action-text">场景</div>
                <button className="task-action-close">×</button>
              </div>

              <div className="task-action-item add-item">
                <div className="task-action-icon">
                  <PlusOutlined />
                </div>
                <div className="task-action-text">添加QA</div>
              </div>

              <div className="task-action-item add-item">
                <div className="task-action-icon">
                  <PlusOutlined />
                </div>
                <div className="task-action-text">添模板</div>
              </div>
            </div>
            
            <div className="task-dimension-link">
              <a
                href="#"
                onClick={(e) => {
                  e.preventDefault()
                  toggleRadarChart()
                }}
              >
                {showRadarChart ? "收起" : "查看维度"} {showRadarChart ? "←" : "→"}
              </a>
            </div>
          </div>
        </div>

        {/* Right section - chart */}
        <div className="task-card-right">
          {showRadarChart && (
            <div className="task-radar-chart-container">
              <div className="task-chart-title">各维度得分</div>
              <div className="task-radar-chart">
                <ResponsiveContainer width="100%" height={130}>
                  <RadarChart data={filteredRadarData} outerRadius={45}>
                    <PolarGrid stroke="#e0e0e0" />
                    <PolarAngleAxis dataKey="name" tick={{ fontSize: 8, fill: "#8f9098" }} />
                    <PolarRadiusAxis domain={[0, 100]} tick={{ fontSize: 8, fill: "#8f9098" }} axisLine={false} />
                    {selectedAgents.overall && (
                      <Radar name="Overall" dataKey="value" stroke="var(--color-primary)" fill="var(--color-primary)" fillOpacity={0.2} />
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
              <div className="task-agents">
                <div className="task-agents-list">
                  <div className="task-agent-item">
                    <Checkbox checked={selectedAgents.overall} onChange={() => handleAgentChange("overall")}>
                      Overall
                    </Checkbox>
                  </div>
                  <div className="task-agent-item">
                    <Checkbox checked={selectedAgents.agent1} onChange={() => handleAgentChange("agent1")}>
                      Agent 1
                    </Checkbox>
                  </div>
                  <div className="task-agent-item">
                    <Checkbox checked={selectedAgents.agent2} onChange={() => handleAgentChange("agent2")}>
                      Agent 2
                    </Checkbox>
                  </div>
                </div>
              </div>
            </div>
          )}

          <div className="task-chart-container">
            <div className="task-chart-title">置信度爬升曲线</div>
            <div className="task-chart">
              <ResponsiveContainer width="100%" height={130}>
                <AreaChart data={task.chartData?.line || []} margin={{ top: 3, right: 3, left: 0, bottom: 3 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#eee" />
                  <XAxis
                    dataKey="month"
                    tick={{ fontSize: 8, fill: "#8f9098" }}
                    axisLine={{ stroke: "#e0e0e0" }}
                    tickLine={false}
                  />
                  <YAxis
                    domain={[0, 100]}
                    tick={{ fontSize: 8, fill: "#8f9098" }}
                    axisLine={false}
                    tickLine={false}
                  />
                  <RechartsTooltip />
                  <defs>
                    <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="var(--color-assist-1)" stopOpacity={0.6}/>
                      <stop offset="95%" stopColor="var(--color-assist-1)" stopOpacity={0.1}/>
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
                </AreaChart>
              </ResponsiveContainer>
            </div>
            
            <div className="task-chart-footer">
              <div className="task-chart-info">
                <div className="task-chart-time-author">
                  <span className="task-chart-time">{task.updatedAt}</span>
                  <span className="task-by-text">by</span>
                  <Avatar size={14} src={task.updatedBy?.avatar} className="task-updater-avatar">
                    {task.updatedBy?.name.charAt(0)}
                  </Avatar>
                  <span className="task-updater-name">{task.updatedBy?.name}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Create Task Modal */}
      <CreateTaskModal visible={isCreateTaskModalVisible} onCancel={handleModalCancel} cardData={task} />
    </div>
  )
}

export default TaskCard
