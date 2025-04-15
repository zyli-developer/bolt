"use client"

import { useState, useEffect } from "react"
import { useParams, useNavigate } from "react-router-dom"
import { Typography, Button, Avatar, Tag, Spin, Divider, Tabs, Checkbox, Card, Row, Col, Timeline } from "antd"
import { ArrowLeftOutlined, EditOutlined, ShareAltOutlined, DeleteOutlined } from "@ant-design/icons"
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
import cardService from "../services/cardService"
import { useChatContext } from "../contexts/ChatContext"

const { Title, Text, Paragraph } = Typography
const { TabPane } = Tabs

const CardDetailPage = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const [card, setCard] = useState(null)
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
    const fetchCardDetail = async () => {
      try {
        setLoading(true)
        const data = await cardService.getCardDetail(id)
        setCard(data)
        setError(null)
      } catch (err) {
        console.error(`获取卡片详情失败 (ID: ${id}):`, err)
        setError("获取卡片详情失败，请重试")
      } finally {
        setLoading(false)
      }
    }

    if (id) {
      fetchCardDetail()
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

  // Filter radar data based on selected agents
  const filteredRadarData = card?.chartData?.radar || [
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
      action: "创建了卡片",
    },
    {
      date: "2025/12/02",
      time: "09:15",
      user: "Jackson",
      action: "更新了卡片",
    },
    {
      date: "2025/12/03",
      time: "14:45",
      user: "Rita",
      action: "添加了标签",
    },
  ]

  if (loading) {
    return (
      <div className={`card-detail-page ${isChatOpen ? "chat-open" : "chat-closed"}`}>
        <div className="loading-container">
          <Spin size="large" />
        </div>
      </div>
    )
  }

  if (error || !card) {
    return (
      <div className={`card-detail-page ${isChatOpen ? "chat-open" : "chat-closed"}`}>
        <div className="error-message">{error || "卡片不存在"}</div>
        <Button type="primary" onClick={handleGoBack} icon={<ArrowLeftOutlined />}>
          返回
        </Button>
      </div>
    )
  }

  return (
    <div className={`card-detail-page ${isChatOpen ? "chat-open" : "chat-closed"}`}>
      {/* 页面头部 */}
      <div className="card-detail-header">
        <Button type="text" icon={<ArrowLeftOutlined />} onClick={handleGoBack} className="back-button" />
        <Title level={3} className="card-detail-title">
          {card.title}
        </Title>
        <div className="card-detail-actions">
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

      {/* 卡片元信息 */}
      <div className="card-detail-meta">
        <div className="card-detail-author">
          <Avatar size={40} src={card.author.avatar} className="author-avatar">
            {card.author.name.charAt(0)}
          </Avatar>
          <div className="author-info">
            <Text className="by-text">by</Text>
            <Text strong className="author-name">
              {card.author.name}
            </Text>
            <Text className="from-text">from</Text>
            <Text strong className="source-name">
              {card.source}
            </Text>
          </div>
        </div>
        <div className="card-detail-tags">
          {card.tags.map((tag, index) => (
            <Tag key={index} className="detail-tag">
              {tag}
            </Tag>
          ))}
        </div>
      </div>

      <Divider className="card-detail-divider" />

      {/* 卡片内容区域 */}
      <div className="card-detail-content">
        <Tabs activeKey={activeTab} onChange={setActiveTab} className="card-detail-tabs">
          <TabPane tab="概览" key="overview">
            <Row gutter={[24, 24]} className="card-detail-overview">
              {/* 左侧信息区域 */}
              <Col xs={24} lg={16}>
                <Card title="问题概要" className="card-info-card">
                  <Paragraph className="info-value">{card.summary}</Paragraph>
                </Card>

                <Card title="可信度与评分" className="card-metrics-card">
                  <div className="detail-metrics">
                    <div className="detail-metric-item">
                      <div className="detail-metric-value">{card.credibility}%</div>
                      <div className="detail-metric-info">
                        <div className="detail-metric-label">Credibility</div>
                        <div
                          className={`detail-metric-change ${card.credibilityChange.startsWith("+") ? "positive" : "negative"}`}
                        >
                          {card.credibilityChange}
                        </div>
                      </div>
                    </div>

                    <div className="detail-metric-item">
                      <div className="detail-metric-value">{card.score}</div>
                      <div className="detail-metric-info">
                        <div className="detail-metric-label">Score</div>
                        <div
                          className={`detail-metric-change ${card.scoreChange.startsWith("+") ? "positive" : "negative"}`}
                        >
                          {card.scoreChange}
                        </div>
                      </div>
                    </div>
                  </div>
                </Card>

                <Card title="变更历史" className="card-changes-card">
                  {card.changes && card.changes.length > 0 ? (
                    <Timeline>
                      {card.changes.map((change, index) => (
                        <Timeline.Item key={index}>
                          <div className="change-item">{change}</div>
                        </Timeline.Item>
                      ))}
                    </Timeline>
                  ) : (
                    <div className="no-changes">暂无变更历史</div>
                  )}
                </Card>
              </Col>

              {/* 右侧图表区域 */}
              <Col xs={24} lg={8}>
                <Card className="card-charts-card">
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
                            data={card.chartData?.line || []}
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
                        <span className="chart-time">{card.updatedAt}</span>
                        <span className="by-text">by</span>
                        <Avatar size={16} src={card.updatedBy?.avatar} className="updater-avatar">
                          {card.updatedBy?.name.charAt(0)}
                        </Avatar>
                        <span className="updater-name">{card.updatedBy?.name}</span>
                      </div>
                    </div>
                  </div>
                </Card>

                <Card title="活动记录" className="card-activity-card">
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
          <TabPane tab="分析" key="analysis">
            <div className="analysis-content">
              <Card>
                <div style={{ textAlign: "center", padding: "40px 0" }}>分析内容正在开发中</div>
              </Card>
            </div>
          </TabPane>
          <TabPane tab="相关任务" key="tasks">
            <div className="related-tasks">
              <Card>
                <div style={{ textAlign: "center", padding: "40px 0" }}>相关任务正在开发中</div>
              </Card>
            </div>
          </TabPane>
        </Tabs>
      </div>
    </div>
  )
}

export default CardDetailPage
