"use client"

import { useState, useEffect } from "react"
import { useParams, useNavigate, useLocation } from "react-router-dom"
import { Typography, Button, Avatar, Tag, Spin, Breadcrumb, Select, Checkbox } from "antd"
import {
  ArrowLeftOutlined,
  StarOutlined,
  ShareAltOutlined,
  LikeOutlined,
  CommentOutlined,
  ForkOutlined,
  SettingOutlined,
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
const { Option } = Select

const TaskDetailPage = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const location = useLocation()
  const [task, setTask] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [selectedModel, setSelectedModel] = useState("claude")
  const [selectedChartModels, setSelectedChartModels] = useState({
    overall: true,
    claude: true,
    agent2: false,
  })
  const { isChatOpen } = useChatContext()

  // Determine if we came from explore or tasks
  const isFromExplore = location.pathname.includes("/explore") || location.state?.from === "explore"
  const parentPath = isFromExplore ? "/explore" : "/tasks"
  const parentLabel = isFromExplore ? "探索" : "任务"

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

  const handleModelChange = (value) => {
    setSelectedModel(value)
  }

  const handleChartModelChange = (modelKey) => {
    setSelectedChartModels((prev) => ({
      ...prev,
      [modelKey]: !prev[modelKey],
    }))
  }

  // Mock evaluation data
  const evaluationData = {
    claude: {
      name: "Claude 3.5 Sonnet",
      tags: ["Programming", "Programming"],
      description:
        "该AI玩具在语音识别方面表现优秀，能够准确识别儿童的语音指令。安全性设计符合国际标准，无小零件脱落风险。交互体验流该AI玩具在语音识别方面表现优秀，能够准确识别儿童的语音指令。安全性设计符合国际标准，无小零件脱落风险。",
      score: 10.0,
      scoreChange: "-1.5%",
      credibility: 100.0,
      credibilityChange: "+1.5%",
      updatedAt: "21:32, 12/01/2025",
      updatedBy: "Mike",
      history:
        "修改了模板修改了模板修改了模板修改了模板修改了模板修改了模板修改了模板修改了模板修改了模板修改了模板修改了模板修改了模板",
      strengths: ["语音识别准确", "安全性高", "交互体验好"],
      weaknesses: ["语音识别准确", "安全性高", "交互体验好"],
    },
    agent2: {
      name: "Agent 2",
      tags: ["Testing", "Evaluation"],
      description:
        "这款AI玩具的语音交互系统反应灵敏，能够理解大部分儿童指令。安全材料使用符合标准，但某些边缘部分可能需要进一步圆润处理。教育内容丰富多样，适合目标年龄段儿童。建议改进：增强防水性能，优化充电接口设计。",
      score: 8.7,
      scoreChange: "+0.5%",
      credibility: 87.0,
      credibilityChange: "+2.0%",
      updatedAt: "18:45, 12/02/2025",
      updatedBy: "Jackson",
      history: "添加了产品的详细材质信息和安全认证文档",
      strengths: ["语音交互灵敏", "教育内容丰富", "目标人群匹配度高"],
      weaknesses: ["边缘安全性需改进", "防水性能不足"],
    },
  }

  const currentEvaluation = evaluationData[selectedModel] || evaluationData.claude

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
      {/* 隐藏头部的community/workspace/peison的tab */}
      <div className="hide-tabs-nav" style={{ display: 'none' }}>
        {/* 这里本应显示tab，但现在设置为不显示 */}
      </div>
      
      {/* 面包屑导航 */}
      <div className="task-detail-breadcrumb">
        <Breadcrumb
          items={[
            {
              title: <ArrowLeftOutlined onClick={handleGoBack} className="breadcrumb-arrow" />,
            },
            {
              title: (
                <span onClick={() => navigate(parentPath)} className="breadcrumb-parent">
                  {parentLabel}
                </span>
              ),
            },
            {
              title: <span className="breadcrumb-current">父任务</span>,
            },
          ]}
        />
      </div>

      {/* 任务标题和信息 */}
      <div className="task-detail-title-section">
        <h1 className="task-title">{task.title}</h1>
        <div className="task-creator-section">
          <div className="task-creator-info">
            <Avatar size={40} className="creator-avatar">
              {task.author?.name?.charAt(0)}
            </Avatar>
            <span className="creator-text">
              by <span className="creator-name">{task.author?.name}</span> from{" "}
              <span className="creator-source">{task.source}</span>
            </span>
          </div>
          <div className="task-tags">
            {task.tags.map((tag, index) => (
              <Tag key={index} className="task-dimension-tag">
                {tag}
              </Tag>
            ))}
          </div>
          <div className="task-actions-top">
            <Button icon={<StarOutlined />} className="follow-button">
              关注
            </Button>
            <Button icon={<ShareAltOutlined />} className="share-button">
              分享
            </Button>
          </div>
        </div>
      </div>

      {/* 评估结果和图表区域 - 左右结构 */}
      <div className="evaluation-charts-wrapper">
        {/* 评估结果区域 */}
        <div className="evaluation-section">
          <div className="evaluation-header">
            <div className="evaluation-title">
              <span>Claude 评估结果</span>
              <Select defaultValue={selectedModel} onChange={handleModelChange} className="model-selector">
                <Option value="claude">Claude</Option>
                <Option value="agent2">Agent 2</Option>
              </Select>
            </div>
          </div>

          <div className="evaluation-model-info">
            <div className="model-avatar-section">
              <Avatar size={64} className="model-avatar">
                {currentEvaluation.name.charAt(0)}
              </Avatar>
              <div className="model-details">
                <div className="model-name">{currentEvaluation.name}</div>
                <div className="model-tags">
                  {currentEvaluation.tags.map((tag, index) => (
                    <Tag key={index} className="model-tag">
                      {tag}
                    </Tag>
                  ))}
                </div>
              </div>
            </div>

            <div className="evaluation-content">
              <p className="evaluation-text">{currentEvaluation.description}</p>

              <div className="metrics-section">
                <div className="metric-item">
                  <div className="metric-label">综合得分</div>
                  <div className="metric-value">{currentEvaluation.score}</div>
                  <div
                    className={`metric-change ${currentEvaluation.scoreChange.startsWith("+") ? "positive" : "negative"}`}
                  >
                    {currentEvaluation.scoreChange}
                  </div>
                  <div className="metric-name">Score</div>
                </div>

                <div className="metric-item">
                  <div className="metric-label">各维度得分</div>
                  <div className="metric-value">{currentEvaluation.credibility}%</div>
                  <div
                    className={`metric-change ${currentEvaluation.credibilityChange.startsWith("+") ? "positive" : "negative"}`}
                  >
                    {currentEvaluation.credibilityChange}
                  </div>
                  <div className="metric-name">Credibility</div>
                </div>
              </div>
            </div>
          </div>

          <div className="evaluation-details">
            <div className="strengths-weaknesses-wrapper">
              <div className="strengths-section">
                <h3>优势</h3>
                <ul>
                  {currentEvaluation.strengths.map((strength, index) => (
                    <li key={index}>{strength}</li>
                  ))}
                </ul>
              </div>

              <div className="weaknesses-section">
                <h3>不足</h3>
                <ul>
                  {currentEvaluation.weaknesses.map((weakness, index) => (
                    <li key={index}>{weakness}</li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>

        {/* 图表区域 - 同时显示折线图和雷达图 */}
        <div className="charts-section">
          <div className="chart-header">
            <div className="chart-model-selector">
              <Checkbox checked={selectedChartModels.overall} onChange={() => handleChartModelChange("overall")}>
                Overall
              </Checkbox>
              <Checkbox checked={selectedChartModels.claude} onChange={() => handleChartModelChange("claude")}>
                Claude
              </Checkbox>
              <Checkbox checked={selectedChartModels.agent2} onChange={() => handleChartModelChange("agent2")}>
                Agent 2
              </Checkbox>
            </div>
          </div>

          {/* 折线图区域 */}
          <div>
            <div className="chart-title">置信度爬升曲线</div>
            <div className="line-chart-container">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={task.chartData?.line || []} margin={{ top: 10, right: 10, left: 0, bottom: 10 }}>
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
                  {selectedChartModels.overall && (
                    <Line
                      type="monotone"
                      dataKey="value"
                      name="Overall"
                      stroke="#006ffd"
                      strokeWidth={2}
                      dot={{ r: 4, fill: "#006ffd" }}
                      activeDot={{ r: 6 }}
                    />
                  )}
                  {selectedChartModels.claude && (
                    <Line
                      type="monotone"
                      dataKey="claude"
                      name="Claude"
                      stroke="#3ac0a0"
                      strokeWidth={2}
                      dot={{ r: 4, fill: "#3ac0a0" }}
                      activeDot={{ r: 6 }}
                    />
                  )}
                  {selectedChartModels.agent2 && (
                    <Line
                      type="monotone"
                      dataKey="agent2"
                      name="Agent 2"
                      stroke="#ff7a45"
                      strokeWidth={2}
                      dot={{ r: 4, fill: "#ff7a45" }}
                      activeDot={{ r: 6 }}
                    />
                  )}
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* 历史记录和雷达图区域 */}
          <div className="radar-chart-container">
            {/* 历史记录 */}
            <div className="history-section-wrapper">
              <div className="history-section">
                <div className="history-time">{currentEvaluation.updatedAt}</div>
                <div className="history-author">
                  by <span>{currentEvaluation.updatedBy}</span>
                </div>
                <div className="history-content">{currentEvaluation.history}</div>
              </div>
            </div>

            {/* 雷达图 */}
            <div className="radar-chart-content">
              <div className="chart-title">各维度得分</div>
              <ResponsiveContainer width="100%" height="100%">
                <RadarChart data={task.chartData?.radar || []} outerRadius={90}>
                  <PolarGrid stroke="#e0e0e0" />
                  <PolarAngleAxis dataKey="name" tick={{ fontSize: 12, fill: "#8f9098" }} />
                  <PolarRadiusAxis domain={[0, 100]} tick={{ fontSize: 10, fill: "#8f9098" }} axisLine={false} />
                  {selectedChartModels.overall && (
                    <Radar name="Overall" dataKey="value" stroke="#006ffd" fill="#006ffd" fillOpacity={0.2} />
                  )}
                  {selectedChartModels.claude && (
                    <Radar name="Claude" dataKey="claude" stroke="#3ac0a0" fill="#3ac0a0" fillOpacity={0.2} />
                  )}
                  {selectedChartModels.agent2 && (
                    <Radar name="Agent 2" dataKey="agent2" stroke="#ff7a45" fill="#ff7a45" fillOpacity={0.2} />
                  )}
                </RadarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      </div>

      {/* 底部按钮区域 */}
      <div className="task-footer-actions">
        <Button icon={<LikeOutlined />} className="action-button like-button">
          点赞
        </Button>
        <Button icon={<CommentOutlined />} className="action-button comment-button">
          评论
        </Button>
        <Button icon={<ForkOutlined />} className="action-button fork-button" type="primary">
          分支为新任务
        </Button>
        <Button icon={<SettingOutlined />} className="action-button optimize-button">
          优化模式
        </Button>
      </div>
    </div>
  )
}

export default TaskDetailPage
