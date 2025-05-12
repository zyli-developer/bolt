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
  Radar,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
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
    // Navigate to the task detail page with state to track where we came from
    navigate(`/tasks/detail/${task.id}`, { state: { from: "tasks" } })
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
            <h3 className="task-section-title">任务详情</h3>

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
                <div className="task-action-text">点击添加QA</div>
              </div>

              <div className="task-action-item add-item">
                <div className="task-action-icon">
                  <PlusOutlined />
                </div>
                <div className="task-action-text">点击添加模板</div>
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
                {showRadarChart ? "收起模板维度" : "查看模板维度"} {showRadarChart ? "←" : "→"}
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
                <ResponsiveContainer width="100%" height={180}>
                  <RadarChart data={filteredRadarData} outerRadius={60}>
                    <PolarGrid stroke="#e0e0e0" />
                    <PolarAngleAxis dataKey="name" tick={{ fontSize: 10, fill: "#8f9098" }} />
                    <PolarRadiusAxis domain={[0, 100]} tick={{ fontSize: 10, fill: "#8f9098" }} axisLine={false} />
                    {selectedAgents.overall && (
                      <Radar name="Overall" dataKey="value" stroke="#006ffd" fill="#006ffd" fillOpacity={0.2} />
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
              <ResponsiveContainer width="100%" height={180}>
                <LineChart data={task.chartData?.line || []} margin={{ top: 5, right: 5, left: 0, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#eee" />
                  <XAxis
                    dataKey="month"
                    tick={{ fontSize: 10, fill: "#8f9098" }}
                    axisLine={{ stroke: "#e0e0e0" }}
                    tickLine={false}
                  />
                  <YAxis
                    domain={[0, 100]}
                    tick={{ fontSize: 10, fill: "#8f9098" }}
                    axisLine={false}
                    tickLine={false}
                  />
                  <Line
                    type="monotone"
                    dataKey="value"
                    stroke="#006ffd"
                    strokeWidth={2}
                    dot={{ r: 3, fill: "#006ffd" }}
                    activeDot={{ r: 5 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
            
            <div className="task-chart-footer">
              <div className="task-chart-info">
                <div className="task-chart-time-author">
                  <span className="task-chart-time">{task.updatedAt}</span>
                  <span className="task-by-text">by</span>
                  <Avatar size={16} src={task.updatedBy?.avatar} className="task-updater-avatar">
                    {task.updatedBy?.name.charAt(0)}
                  </Avatar>
                  <span className="task-updater-name">{task.updatedBy?.name}</span>
                  <span className="task-from-text">from</span>
                  <span className="task-source-name">{task.source}</span>
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
