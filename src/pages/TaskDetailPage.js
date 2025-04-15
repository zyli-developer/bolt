"use client"

import { useState, useEffect } from "react"
import { useParams, useNavigate } from "react-router-dom"
import { Typography, Button, Avatar, Tag, Spin, Divider, Tabs, Checkbox, Card, Row, Col, Timeline, Empty } from "antd"
import {
  ArrowLeftOutlined,
  EditOutlined,
  ShareAltOutlined,
  DeleteOutlined,
  PlusOutlined,
  FileTextOutlined,
  PlayCircleOutlined,
} from "@ant-design/icons"
import {
  LineChart,
  Line,
  ResponsiveContainer,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Radar,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
} from "recharts"
import taskService from "../services/taskService"
import { useChatContext } from "../contexts/ChatContext"

const { Title, Text, Paragraph } = Typography
const { TabPane } = Tabs

const TaskDetailPage = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const [task, setTask] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [activeTab, setActiveTab] = useState("overview")
  const [showRadarChart, setShowRadarChart] = useState(false)
  const [selectedAgents, setSelectedAgents] = useState({
    overall: true,
    agent1: false,
    agent2: false,
  })
  const { isChatOpen } = useChatContext()

  useEffect(() => {
    const fetchTaskDetail = async () => {
      try {
        setLoading(true)
        const data = await taskService.getTaskDetail(id)
        setTask(data)
        setError(null)
      } catch (err) {
        console.error(`获取任务详情失败 (ID: ${id}):`, err)
        setError("获取任务详情失败，请重试")
      } finally {
        setLoading(false)
      }
    }

    if (id) {
      fetchTaskDetail()
    }
  }, [id])

  const handleGoBack = () => {
    navigate(-1)
  }

  const toggleRadarChart = () => {
    setShowRadarChart(!showRadarChart)
  }

  const handleAgentChange = (agentKey) => {
    setSelectedAgents({
      ...selectedAgents,
      [agentKey]: !selectedAgents[agentKey],
    })
  }

  // 检查handleStartEvaluation函数的实现
  // 确保导航路径正确

  const handleStartEvaluation = () => {
    console.log("Starting evaluation for task ID:", id)
    navigate(`/tasks/evaluate/${id}`)
  }

  // Filter radar data based on selected agents
  const filteredRadarData = task?.chartData?.radar || [
    { name: "维度1", value: 70 },
    { name: "维度2", value: 80 },
    { name: "维度3", value: 60 },
    { name: "维度4", value: 90 },
    { name: "维度5", value: 75 },
    { name: "维度6", value: 85 },
  ]

  // Mock timeline data
  const timelineItems = [
    {
      date: "2025/12/01",
      time: "21:32",
      user: "Mike",
      action: "创建了任务",
    },
    {
      date: "2025/12/02",
      time: "09:15",
      user: "Jackson",
      action: "添加了场景",
    },
    {
      date: "2025/12/03",
      time: "14:45",
      user: "Rita",
      action: "更新了目标描述",
    },
  ]

  if (loading) {
    return (
      <div className={`task-detail-page ${isChatOpen ? "chat-open" : "chat-closed"}`}>
        <div className="loading-container">
          <Spin size="large" />
        </div>
      </div>
    )
  }

  if (error || !task) {
    return (
      <div className={`task-detail-page ${isChatOpen ? "chat-open" : "chat-closed"}`}>
        <div className="error-message">{error || "任务不存在"}</div>
        <Button type="primary" onClick={handleGoBack} icon={<ArrowLeftOutlined />}>
          返回
        </Button>
      </div>
    )
  }

  return (
    <div className={`task-detail-page ${isChatOpen ? "chat-open" : "chat-closed"}`}>
      {/* 页面头部 */}
      <div className="task-detail-header">
        <Button type="text" icon={<ArrowLeftOutlined />} onClick={handleGoBack} className="back-button" />
        <Title level={3} className="task-detail-title">
          {task.title}
        </Title>
        <div className="task-detail-actions">
          {/* 检查"开始测评"按钮是否正确绑定了handleStartEvaluation函数 */}
          <Button
            type="primary"
            icon={<PlayCircleOutlined />}
            className="action-button"
            onClick={handleStartEvaluation}
          >
            开始测评
          </Button>
          <Button icon={<EditOutlined />} className="action-button">
            编辑
          </Button>
          <Button icon={<ShareAltOutlined />} className="action-button">
            分享
          </Button>
          <Button icon={<DeleteOutlined />} danger className="action-button">
            删除
          </Button>
        </div>
      </div>

      {/* 任务元信息 */}
      <div className="task-detail-meta">
        <div className="task-detail-author">
          <Avatar size={40} src={task.author.avatar} className="author-avatar">
            {task.author.name.charAt(0)}
          </Avatar>
          <div className="author-info">
            <Text className="assigned-by">Assigned by</Text>
            <Text strong className="author-name">
              {task.author.name}
            </Text>
            <Text className="from-text">from</Text>
            <Text strong className="source-name">
              {task.source}
            </Text>
          </div>
        </div>
        <div className="task-detail-tags">
          {task.tags.map((tag, index) => (
            <Tag key={index} className="detail-tag">
              {tag}
            </Tag>
          ))}
        </div>
      </div>

      <Divider className="task-detail-divider" />

      {/* 任务内容区域 */}
      <div className="task-detail-content">
        <Tabs activeKey={activeTab} onChange={setActiveTab} className="task-detail-tabs">
          <TabPane tab="概览" key="overview">
            <Row gutter={[24, 24]} className="task-detail-overview">
              {/* 左侧信息区域 */}
              <Col xs={24} lg={16}>
                <Card title="任务详情" className="task-info-card">
                  <div className="task-info-item">
                    <Text strong className="info-label">
                      状态：
                    </Text>
                    <Text className="info-value">{task.status || "待启动"}</Text>
                  </div>
                  <div className="task-info-item">
                    <Text strong className="info-label">
                      目标：
                    </Text>
                    <Paragraph className="info-value">
                      {task.description ||
                        "目标目标目标目标目标目标目标目标目标目标目标目标目标目标目标目标目标目标目标目标"}
                    </Paragraph>
                  </div>
                  <div className="task-info-item">
                    <Text strong className="info-label">
                      权限：
                    </Text>
                    <Text className="info-value">
                      {task.permission === "workspace" ? "工作区" : task.permission === "community" ? "社区" : "个人"}
                    </Text>
                  </div>
                  <div className="task-info-item">
                    <Text strong className="info-label">
                      创建时间：
                    </Text>
                    <Text className="info-value">{task.createdAt || task.updatedAt}</Text>
                  </div>
                </Card>

                <Card title="任务组件" className="task-components-card">
                  <div className="task-components-list">
                    <div className="task-component-item active">
                      <div className="component-icon">
                        <FileTextOutlined />
                      </div>
                      <div className="component-title">场景</div>
                      <button className="component-close">×</button>
                    </div>

                    <div className="task-component-item add-item">
                      <div className="component-icon">
                        <PlusOutlined />
                      </div>
                      <div className="component-title">点击添加QA</div>
                    </div>

                    <div className="task-component-item add-item">
                      <div className="component-icon">
                        <PlusOutlined />
                      </div>
                      <div className="component-title">点击添加模板</div>
                    </div>
                  </div>
                </Card>
              </Col>

              {/* 右侧图表区域 */}
              <Col xs={24} lg={8}>
                <Card className="task-charts-card">
                  {showRadarChart ? (
                    <div className="detail-radar-chart-container">
                      <div className="chart-title">各维度得分</div>
                      <div className="radar-chart">
                        <ResponsiveContainer width="100%" height={250}>
                          <RadarChart data={filteredRadarData} outerRadius={90}>
                            <PolarGrid stroke="#e0e0e0" />
                            <PolarAngleAxis dataKey="name" tick={{ fontSize: 12, fill: "#8f9098" }} />
                            <PolarRadiusAxis
                              domain={[0, 100]}
                              tick={{ fontSize: 10, fill: "#8f9098" }}
                              axisLine={false}
                            />
                            {selectedAgents.overall && (
                              <Radar name="Overall" dataKey="value" stroke="#006ffd" fill="#006ffd" fillOpacity={0.2} />
                            )}
                            {selectedAgents.agent1 && (
                              <Radar
                                name="Agent 1"
                                dataKey="agent1"
                                stroke="#3ac0a0"
                                fill="#3ac0a0"
                                fillOpacity={0.2}
                              />
                            )}
                            {selectedAgents.agent2 && (
                              <Radar
                                name="Agent 2"
                                dataKey="agent2"
                                stroke="#ff7a45"
                                fill="#ff7a45"
                                fillOpacity={0.2}
                              />
                            )}
                          </RadarChart>
                        </ResponsiveContainer>
                      </div>
                      <div className="chart-agents">
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
                  ) : (
                    <div className="detail-line-chart-container">
                      <div className="chart-title">置信度爬升曲线</div>
                      <div className="line-chart">
                        <ResponsiveContainer width="100%" height={250}>
                          <LineChart
                            data={task.chartData?.line || []}
                            margin={{ top: 10, right: 10, left: 0, bottom: 10 }}
                          >
                            <CartesianGrid strokeDasharray="3 3" stroke="#eee" />
                            <XAxis
                              dataKey="month"
                              tick={{ fontSize: 12, fill: "#8f9098" }}
                              axisLine={{ stroke: "#e0e0e0" }}
                              tickLine={false}
                            />
                            <YAxis
                              domain={[0, 100]}
                              tick={{ fontSize: 12, fill: "#8f9098" }}
                              axisLine={false}
                              tickLine={false}
                            />
                            <Tooltip />
                            <Line
                              type="monotone"
                              dataKey="value"
                              stroke="#006ffd"
                              strokeWidth={2}
                              dot={{ r: 4, fill: "#006ffd" }}
                              activeDot={{ r: 6 }}
                            />
                          </LineChart>
                        </ResponsiveContainer>
                      </div>
                    </div>
                  )}

                  <div className="chart-footer">
                    <div className="chart-link">
                      <a
                        href="#"
                        onClick={(e) => {
                          e.preventDefault()
                          toggleRadarChart()
                        }}
                      >
                        {showRadarChart ? "收起" : "查看模板维度"} {showRadarChart ? "←" : "→"}
                      </a>
                    </div>
                    <div className="chart-info">
                      <div className="chart-time-author">
                        <span className="chart-time">{task.updatedAt}</span>
                        <span className="by-text">by</span>
                        <Avatar size={16} src={task.updatedBy?.avatar} className="updater-avatar">
                          {task.updatedBy?.name.charAt(0)}
                        </Avatar>
                        <span className="updater-name">{task.updatedBy?.name}</span>
                      </div>
                    </div>
                  </div>
                </Card>

                <Card title="活动记录" className="task-activity-card">
                  <Timeline>
                    {timelineItems.map((item, index) => (
                      <Timeline.Item key={index}>
                        <div className="timeline-content">
                          <div className="timeline-header">
                            <Text strong>{item.user}</Text>
                            <Text type="secondary">
                              {item.date} {item.time}
                            </Text>
                          </div>
                          <div className="timeline-body">{item.action}</div>
                        </div>
                      </Timeline.Item>
                    ))}
                  </Timeline>
                </Card>
              </Col>
            </Row>
          </TabPane>
          <TabPane tab="场景" key="scene">
            <div className="scene-content">
              <Empty description="暂无场景内容" />
            </div>
          </TabPane>
          <TabPane tab="QA" key="qa">
            <div className="qa-content">
              <Empty description="暂无QA内容" />
            </div>
          </TabPane>
          <TabPane tab="模板" key="template">
            <div className="template-content">
              <Empty description="暂无模板内容" />
            </div>
          </TabPane>
        </Tabs>
      </div>
    </div>
  )
}

export default TaskDetailPage
