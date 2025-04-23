"use client"

import { useState, useEffect } from "react"
import { useParams, useNavigate, useLocation } from "react-router-dom"
import { Typography, Button, Avatar, Tag, Spin, Select, Checkbox, Breadcrumb } from "antd"
import {
  ArrowLeftOutlined,
  StarOutlined,
  ShareAltOutlined,
  LikeOutlined,
  CommentOutlined,
  ForkOutlined,
  SettingOutlined,
  PlusOutlined,
  MinusOutlined,
} from "@ant-design/icons"
import {
  Area,
  AreaChart,
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
const { Option } = Select

const CardDetailPage = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const location = useLocation()
  const [card, setCard] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [selectedModels, setSelectedModels] = useState(['claude3.5', 'claude3.6', 'claude3.7'])
  const [selectedChartModels, setSelectedChartModels] = useState({
    'claude3.5': true,
    'claude3.6': true,
    'claude3.7': true,
    agent2: false,
    deepseek: false,
  })
  const { isChatOpen } = useChatContext()
  const [expandedModel, setExpandedModel] = useState(false)

  // Determine if we came from explore or tasks
  const isFromExplore = location.pathname.includes("/explore") || location.state?.from === "explore"
  const parentPath = isFromExplore ? "/explore" : "/tasks"
  const parentLabel = isFromExplore ? "探索" : "任务"

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

  // Mock evaluation data based on real evaluation data structure
  const mockEvaluationData = {
    "claude3.5": {
      name: "Claude 3.5",
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
    "claude3.6": {
      name: "Claude 3.6",
      tags: ["Programming", "Programming"],
      description:
        "该AI玩具在语音识别方面表现优秀，能够准确识别儿童的语音指令。安全性设计符合国际标准，无小零件脱落风险。交互体验流该AI玩具在语音识别方面表现优秀，能够准确识别儿童的语音指令。安全性设计符合国际标准，无小零件脱落风险。",
      score: 9.5,
      scoreChange: "+0.5%",
      credibility: 95.0,
      credibilityChange: "+1.0%",
      updatedAt: "20:15, 12/01/2025",
      updatedBy: "David",
      history: "完成了全面的性能评估和用户体验测试",
      strengths: ["响应速度快", "准确率高", "多语言支持"],
      weaknesses: ["资源消耗大", "冷启动时间长"],
    },
    "claude3.7": {
      name: "Claude 3.7",
      tags: ["Programming", "Programming"],
      description:
        "Claude 3.7在复杂任务处理和推理方面表现出色，能够处理多步骤指令并保持上下文连贯性。在代码生成和编程辅助方面尤为突出，支持多种编程语言并能提供详细的解释。",
      score: 9.8,
      scoreChange: "+1.2%",
      credibility: 98.0,
      credibilityChange: "+2.5%",
      updatedAt: "19:45, 12/01/2025",
      updatedBy: "Emma",
      history: "根据最新的基准测试更新了评估结果",
      strengths: ["代码生成能力强", "推理深度好", "上下文理解准确"],
      weaknesses: ["处理速度可提升", "特定领域知识有限"],
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
    deepseek: {
      name: "DeepSeek",
      tags: ["AI", "Large Model"],
      description:
        "DeepSeek在此任务中展现出优秀的理解能力和分析深度。模型能够准确把握问题核心，提供详实的解决方案。特别在代码生成和技术文档理解方面表现突出。建议在边缘场景的处理上进行优化。",
      score: 9.2,
      scoreChange: "+1.8%",
      credibility: 92.0,
      credibilityChange: "+3.0%",
      updatedAt: "20:15, 12/02/2025",
      updatedBy: "Sarah",
      history: "完成了全部测试用例的验证",
      strengths: ["理解准确", "分析深入", "解决方案可行"],
      weaknesses: ["边缘场景处理", "响应时间优化"],
    }
  };

  const currentEvaluation = mockEvaluationData[selectedModels[0]] || mockEvaluationData.agent2;

  // 获取所有可用的模型选项
  const modelOptions = Object.keys(mockEvaluationData);

  // 处理全选/取消全选
  const handleSelectAll = (checked) => {
    setSelectedModels(checked ? modelOptions : []);
    setSelectedChartModels(
      Object.fromEntries(
        modelOptions.map(model => [model, checked])
      )
    );
  };

  // 修改模型选择处理函数
  const handleModelChange = (values) => {
    setSelectedModels(values);
    setSelectedChartModels(
      Object.fromEntries(
        modelOptions.map(model => [model, values.includes(model)])
      )
    );
  };

  const handleChartModelChange = (modelKey) => {
    setSelectedChartModels((prev) => ({
      ...prev,
      [modelKey]: !prev[modelKey],
    }))
  }

  const toggleModelPanel = (modelKey) => {
    setExpandedModel(modelKey);
  }

  // Prepare enhanced chart data with multiple model series
  const getEnhancedChartData = () => {
    if (!card || !card.chartData) return { radar: [], line: [] }

    // Enhanced radar data with multiple model values
    const enhancedRadar = card.chartData.radar.map((item, index) => ({
      name: item.name,
      value: item.value,
      'claude3.5': Math.min(100, item.value * (1 + Math.sin(index) * 0.2)),
      'claude3.6': Math.min(100, item.value * (1 + Math.cos(index) * 0.15)),
      'claude3.7': Math.min(100, item.value * (1 + Math.sin(index + 0.5) * 0.1)),
      agent2: Math.min(100, item.value * (1 - Math.cos(index) * 0.15)),
      deepseek: Math.min(100, item.value * (1 + Math.sin(index + 1) * 0.2)),
    }))

    // Enhanced line data with multiple model values
    const enhancedLine = card.chartData.line.map((item, index) => ({
      month: item.month,
      value: item.value,
      'claude3.5': Math.min(100, item.value * (1 + Math.sin(index) * 0.1)),
      'claude3.6': Math.min(100, item.value * (1 + Math.cos(index) * 0.12)),
      'claude3.7': Math.min(100, item.value * (1 + Math.sin(index + 0.5) * 0.08)),
      agent2: Math.min(100, item.value * (1 - Math.cos(index) * 0.1)),
      deepseek: Math.min(100, item.value * (1 + Math.sin(index + 1) * 0.12)),
    }))

    return { radar: enhancedRadar, line: enhancedLine }
  }

  const enhancedChartData = getEnhancedChartData()

  const getModelColor = (modelKey) => {
    // Implement your logic to determine the color based on the model
    // For example, you can use a switch statement or a mapping function
    switch (modelKey) {
      case 'claude3.5':
        return '#3ac0a0';
      case 'claude3.6':
        return '#006ffd';
      case 'claude3.7':
        return '#722ed1';
      case 'agent2':
        return '#ff7a45';
      case 'deepseek':
        return '#722ed1';
      default:
        return '#8f9098';
    }
  }

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
      {/* 隐藏头部的community/workspace/peison的tab */}
      <div className="hide-tabs-nav" style={{ display: 'none' }}>
        {/* 这里本应显示tab，但现在设置为不显示 */}
      </div>
      
      {/* 面包屑导航 */}
      <div className="task-detail-breadcrumb" style={{ marginBottom: "4px" }}>
        <Breadcrumb
          items={[
            {
              title: <ArrowLeftOutlined onClick={handleGoBack} className="breadcrumb-arrow" style={{ fontSize: "12px" }} />,
            },
            {
              title: (
                <span onClick={() => navigate(parentPath)} className="breadcrumb-parent" style={{ fontSize: "12px" }}>
                  {parentLabel}
                </span>
              ),
            },
            {
              title: <span className="breadcrumb-current" style={{ fontSize: "12px" }}>父任务</span>,
            },
          ]}
        />
      </div>

      {/* 卡片标题和信息 */}
      <div className="task-detail-title-section" style={{ padding: "6px", marginBottom: "4px" }}>
        <h1 className="task-title" style={{ fontSize: "18px", margin: "0 0 4px 0" }}>{card.title}</h1>
        <div className="task-creator-section" style={{ padding: "4px", gap: "8px" }}>
          <div className="task-creator-info" style={{ gap: "8px" }}>
            <Avatar size={28} className="creator-avatar">
              {card.author?.name?.charAt(0)}
            </Avatar>
            <span className="creator-text" style={{ fontSize: "12px" }}>
              by <span className="creator-name">{card.author?.name}</span> from{" "}
              <span className="creator-source">{card.source}</span>
            </span>
          </div>
          <div className="task-tags" style={{ gap: "4px" }}>
            {card.tags.map((tag, index) => (
              <Tag key={index} className="task-dimension-tag" style={{ fontSize: "10px", padding: "0 4px", margin: "0" }}>
                {tag}
              </Tag>
            ))}
          </div>
          <div className="task-actions-top">
            <Button icon={<StarOutlined />} className="follow-button" size="small" style={{ height: "24px", padding: "0 8px" }}>
              关注
            </Button>
            <Button icon={<ShareAltOutlined />} className="share-button" size="small" style={{ height: "24px", padding: "0 8px" }}>
              分享
            </Button>
          </div>
        </div>
      </div>

      {/* 评估结果和图表区域 - 左右结构 */}
      <div className="evaluation-charts-wrapper" style={{ gap: "4px", marginTop: "4px" }}>
        {/* 左侧评估区域 */}
        <div className="evaluation-left-section" style={{ flex: "0 0 400px", gap: "4px" }}>
          <div className="evaluation-section" style={{ padding: "8px", marginBottom: "4px" }}>
            <div className="evaluation-header" style={{ marginBottom: "8px" }}>
              <div className="evaluation-title" style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                <span style={{ fontSize: "14px", fontWeight: "500" }}>评估结果</span>
                <Select
                  mode="multiple"
                  value={selectedModels}
                  onChange={handleModelChange}
                  className="model-selector"
                  maxTagCount={2}
                  maxTagTextLength={10}
                  style={{ minWidth: "270px", flex: 1 }}
                  dropdownRender={(menu) => (
                    <>
                      <div className="select-all-option" onClick={() => handleSelectAll(selectedModels.length < modelOptions.length)} style={{ padding: "4px 8px" }}>
                        <Checkbox checked={selectedModels.length === modelOptions.length}>
                          全选
                        </Checkbox>
                      </div>
                      {menu}
                    </>
                  )}
                >
                  <Option value="claude3.5">Claude 3.5</Option>
                  <Option value="claude3.6">Claude 3.6</Option>
                  <Option value="claude3.7">Claude 3.7</Option>
                  <Option value="agent2">Agent 2</Option>
                  <Option value="deepseek">DeepSeek</Option>
                </Select>
              </div>
            </div>

            <div className="evaluation-model-info" style={{ gap: "4px" }}>
              {selectedModels.map(modelKey => (
                <div className="model-panel" key={modelKey} style={{ marginBottom: "4px" }}>
                  <div className="model-panel-header" onClick={() => toggleModelPanel(modelKey)} style={{ padding: "8px" }}>
                    <div className="model-panel-left">
                      <Avatar size={32} className="model-avatar" style={{ background: getModelColor(modelKey) }}>
                        {mockEvaluationData[modelKey].name.charAt(0)}
                      </Avatar>
                      <div className="model-info">
                        <div className="model-name" style={{ fontSize: "14px" }}>
                          {mockEvaluationData[modelKey].name}
                          <span className="model-usage" style={{ fontSize: "12px", marginLeft: "4px" }}>128k</span>
                        </div>
                        <div className="model-tags" style={{ gap: "4px" }}>
                          {mockEvaluationData[modelKey].tags.map((tag, index) => (
                            <span key={index} className="model-tag" style={{ padding: "0 4px", fontSize: "11px" }}>
                              {tag}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                    <div className="model-panel-icon">
                      {expandedModel === modelKey ? <MinusOutlined /> : <PlusOutlined />}
                    </div>
                  </div>
                  
                  {expandedModel === modelKey && (
                    <div className="model-panel-content" style={{ padding: "0 8px 8px" }}>
                      <div className="evaluation-content" style={{ padding: "8px" }}>
                        <p className="evaluation-text" style={{ fontSize: "12px", margin: 0, lineHeight: "1.4" }}>{mockEvaluationData[modelKey].description}</p>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* 右侧图表区域 */}
        <div className="evaluation-right-section" style={{ gap: "4px" }}>
          {/* 折线图区域 */}
          <div className="line-chart-section" style={{ padding: "8px" }}>
            <div className="chart-legend" style={{ marginBottom: "8px", gap: "8px" }}>
              {selectedModels.map(modelKey => (
                <div className="legend-item" key={modelKey} style={{ gap: "4px" }}>
                  <span className="legend-color" style={{ backgroundColor: getModelColor(modelKey), width: "10px", height: "10px" }}></span>
                  <span className="legend-label" style={{ fontSize: "12px" }}>{mockEvaluationData[modelKey].name}</span>
                </div>
              ))}
            </div>

            <div className="line-chart-container" style={{ height: "150px", marginTop: "4px" }}>
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart 
                  data={enhancedChartData.line} 
                  margin={{ top: 2, right: 5, left: 0, bottom: 2 }}
                >
                  {/* 渐变定义 */}
                  <defs>
                    {Object.keys(mockEvaluationData).map(modelKey => (
                      <linearGradient key={modelKey} id={`color${modelKey}`} x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor={getModelColor(modelKey)} stopOpacity={0.2}/>
                        <stop offset="95%" stopColor={getModelColor(modelKey)} stopOpacity={0}/>
                      </linearGradient>
                    ))}
                  </defs>
                  <CartesianGrid 
                    vertical={false} 
                    horizontal={true}
                    stroke="#f0f0f0"
                  />
                  <XAxis 
                    dataKey="month" 
                    axisLine={false}
                    tickLine={false}
                    tick={{ fontSize: 10, fill: '#8f9098' }}
                  />
                  <YAxis 
                    hide={true}
                    domain={[0, 'dataMax + 20']}
                  />
                  <Tooltip 
                    cursor={false}
                    contentStyle={{
                      background: '#fff',
                      border: 'none',
                      boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
                      borderRadius: '4px',
                      padding: '4px 8px'
                    }}
                  />
                  {selectedModels.map(modelKey => (
                    <Area
                      key={modelKey}
                      type="monotone"
                      dataKey={modelKey}
                      name={mockEvaluationData[modelKey].name}
                      stroke={getModelColor(modelKey)}
                      strokeWidth={1.5}
                      fill={`url(#color${modelKey})`}
                      dot={false}
                    />
                  ))}
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* 评分和雷达图区域 */}
          <div className="score-radar-section" style={{ gap: "8px", padding: "8px" }}>
            <div className="metrics-section" style={{ gap: "8px", minWidth: "150px" }}>
              <div className="metric-item" style={{ padding: "8px" }}>
                <div className="metric-label" style={{ fontSize: "12px", marginBottom: "4px" }}>综合得分</div>
                <div className="metric-value" style={{ fontSize: "20px" }}>{currentEvaluation.score}</div>
                <div className={`metric-change ${currentEvaluation.scoreChange.startsWith("+") ? "positive" : "negative"}`} style={{ fontSize: "12px" }}>
                  {currentEvaluation.scoreChange}
                </div>
              </div>

              <div className="metric-item" style={{ padding: "8px" }}>
                <div className="metric-label" style={{ fontSize: "12px", marginBottom: "4px" }}>各维度得分</div>
                <div className="metric-value" style={{ fontSize: "20px" }}>{currentEvaluation.credibility}%</div>
                <div className={`metric-change ${currentEvaluation.credibilityChange.startsWith("+") ? "positive" : "negative"}`} style={{ fontSize: "12px" }}>
                  {currentEvaluation.credibilityChange}
                </div>
              </div>
            </div>

            {/* 雷达图 */}
            <div className="radar-chart-content" style={{ height: "220px" }}>
              <ResponsiveContainer width="100%" height="100%">
                <RadarChart data={enhancedChartData.radar}>
                  <PolarGrid stroke="#e0e0e0" />
                  <PolarAngleAxis dataKey="name" tick={{ fontSize: 10, fill: "#8f9098" }} />
                  <PolarRadiusAxis domain={[0, 100]} tick={{ fontSize: 9, fill: "#8f9098" }} axisLine={false} />
                  {selectedModels.map(modelKey => (
                    <Radar 
                      key={modelKey}
                      name={mockEvaluationData[modelKey].name} 
                      dataKey={modelKey} 
                      stroke={getModelColor(modelKey)} 
                      fill={getModelColor(modelKey)} 
                      fillOpacity={0.2} 
                    />
                  ))}
                </RadarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* 历史记录区域 */}
          <div className="history-section-wrapper" style={{ padding: "8px" }}>
            <div className="history-section" style={{ gap: "4px" }}>
              <div className="history-time" style={{ fontSize: "12px" }}>{currentEvaluation.updatedAt}</div>
              <div className="history-author" style={{ fontSize: "12px" }}>
                by <span>{currentEvaluation.updatedBy}</span>
              </div>
              <div className="history-content" style={{ fontSize: "12px", lineHeight: "1.4", marginTop: "4px" }}>{currentEvaluation.history}</div>
            </div>
          </div>
        </div>
      </div>

      {/* 底部按钮区域 */}
      <div className="task-footer-actions" style={{ display: 'flex', justifyContent: 'center', gap: '8px', marginTop: '8px', padding: '8px 0' }}>
        <Button 
          icon={<LikeOutlined />} 
          className="action-button like-button"
          style={{ 
            borderRadius: '20px', 
            display: 'flex',
            alignItems: 'center',
            gap: '4px',
            padding: '0 12px',
            height: '32px',
            fontSize: '12px'
          }}
        >
          点赞
        </Button>
        <Button 
          icon={<CommentOutlined />} 
          className="action-button comment-button"
          style={{ 
            borderRadius: '20px',
            display: 'flex',
            alignItems: 'center',
            gap: '4px',
            padding: '0 12px',
            height: '32px',
            fontSize: '12px'
          }}
        >
          评论
        </Button>
        <Button 
          icon={<ForkOutlined />} 
          className="action-button fork-button" 
          type="primary"
          style={{ 
            borderRadius: '20px',
            display: 'flex',
            alignItems: 'center',
            gap: '4px',
            padding: '0 12px',
            height: '32px',
            backgroundColor: '#006ffd',
            fontWeight: 500,
            fontSize: '12px'
          }}
        >
          分支为新任务
        </Button>
        <Button 
          icon={<SettingOutlined />} 
          className="action-button optimize-button"
          style={{ 
            borderRadius: '20px',
            display: 'flex',
            alignItems: 'center',
            gap: '4px',
            padding: '0 12px',
            height: '32px',
            fontSize: '12px'
          }}
        >
          优化模式
        </Button>
      </div>
    </div>
  )
}

export default CardDetailPage
