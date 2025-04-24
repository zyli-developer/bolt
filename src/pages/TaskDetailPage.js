"use client"

import { useState, useEffect } from "react"
import { useParams, useNavigate, useLocation } from "react-router-dom"
import { Typography, Button, Avatar, Tag, Spin, Breadcrumb, Select, Checkbox, Timeline, Table, Collapse, Tooltip } from "antd"
import {
  ArrowLeftOutlined,
  StarOutlined,
  ShareAltOutlined,
  LikeOutlined,
  CommentOutlined,
  ForkOutlined,
  SettingOutlined,
  CaretRightOutlined,
  CaretDownOutlined,
} from "@ant-design/icons"
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
import taskService from "../services/taskService"
import { useChatContext } from "../contexts/ChatContext"
import TimelineIcon from "../components/icons/TimelineIcon"
import { taskAnnotationData } from "../mocks/data"
import StartTaskIcon from "../components/icons/StartTaskIcon"
import QASection from "../components/qa/QASection"
import SceneSection from '../components/scene/SceneSection'
import TemplateSection from '../components/template/TemplateSection'

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
  const [isScoreExpanded, setIsScoreExpanded] = useState(false);
  const [isAnnotationExpanded, setIsAnnotationExpanded] = useState(true);
  const [activeSection, setActiveSection] = useState('overview')
  const [evaluationData, setEvaluationData] = useState({})

  // Determine if we came from explore or tasks
  const isFromExplore = location.pathname.includes("/explore") || location.state?.from === "explore"
  const parentPath = isFromExplore ? "/explore" : "/tasks"
  const parentLabel = isFromExplore ? "探索" : "任务"

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true)
        const [taskData, evaluationData] = await Promise.all([
          taskService.getTaskDetail(id),
          taskService.getAllModelEvaluations()
        ])
        setTask(taskData)
        setEvaluationData(evaluationData)
        setError(null)
      } catch (err) {
        console.error(`获取数据失败 (ID: ${id}):`, err)
        setError("获取数据失败，请重试")
      } finally {
        setLoading(false)
      }
    }

    if (id) {
      fetchData()
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

  const currentEvaluation = evaluationData[selectedModel] || evaluationData.claude

  // 注释表格列定义
  const annotationColumns = [
    {
      title: 'No.',
      dataIndex: 'no',
      key: 'no',
      width: 50,
      render: (text) => (
        <div style={{ display: 'flex', justifyContent: 'center' }}>
          <Avatar size={24} style={{ background: '#006ffd', fontSize: '12px' }}>{text}</Avatar>
        </div>
      ),
    },
    {
      title: '标题',
      dataIndex: 'title',
      key: 'title',
      width: 100,
      ellipsis: true,
    },
    {
      title: '内容',
      dataIndex: 'content',
      key: 'content',
      width: 200,
      ellipsis: true,
      render: (text) => (
        <Tooltip title={text}>
          <a href="#" style={{ color: '#006ffd' }}>{text}</a>
        </Tooltip>
      ),
    },
    {
      title: '附件',
      dataIndex: 'attachments',
      key: 'attachments',
      width: 140,
      ellipsis: true,
      render: (attachments) => (
        <div style={{ display: 'flex', gap: '8px', overflow: 'hidden' }}>
          {attachments.map((file, index) => (
            <Tag key={index} style={{ cursor: 'pointer', whiteSpace: 'nowrap' }}>
              <a href={file.url} style={{ color: '#006ffd' }}>{file.name}</a>
            </Tag>
          ))}
        </div>
      ),
    },
    {
      title: '最近修改',
      dataIndex: 'lastModifiedBy',
      key: 'lastModifiedBy',
      width: 100,
      render: (modifier) => (
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Avatar size={24}>{modifier.avatar}</Avatar>
          <span>{modifier.name}</span>
        </div>
      ),
    },
    {
      title: '修改时间',
      dataIndex: 'modifiedTime',
      key: 'modifiedTime',
      width: 86,
      align: 'right',
      render: (time) => (
        <div style={{ color: '#8f9098', fontSize: '12px' }}>
          <div>{time.hour}</div>
          <div>{time.date}</div>
        </div>
      ),
    },
  ];

  // 使用 mock 数据
  const annotationData = taskAnnotationData;

  // 渲染右侧内容的函数
  const renderContent = () => {
    switch (activeSection) {
      case 'overview':
        return (
          <>
            {/* 积分说明区域 */}
            <div className="score-section" style={{
              background: '#EAF2FF',
              padding: '16px',
              borderRadius: '12px',
              marginBottom: '24px'
            }}>
              <div 
                style={{ 
                  display: 'flex', 
                  alignItems: 'center',
                  marginBottom: isScoreExpanded ? '8px' : 0,
                  cursor: 'pointer'
                }}
                onClick={() => setIsScoreExpanded(!isScoreExpanded)}
              >
                <span style={{ 
                  fontSize: '14px',
                  fontWeight: '500'
                }}>积分消耗说明</span>
                {isScoreExpanded ? 
                  <CaretDownOutlined style={{ marginLeft: '4px', color: '#8f9098' }} /> :
                  <CaretRightOutlined style={{ marginLeft: '4px', color: '#8f9098' }} />
                }
              </div>
              {isScoreExpanded && (
                <div style={{ fontSize: '14px', color: '#8f9098' }}>
                  <div>根据此任务的配置，预计每次测试消耗XXX积分*。</div>
                  <div style={{ marginTop: '4px' }}>
                    <span>*根据配置参数动态计算，</span>
                    <a href="#" style={{ color: '#006FFD' }}>了解计算规则&gt;&gt;</a>
                  </div>
                </div>
              )}
            </div>

            {/* 任务信息区域 */}
            <div className="task-info-section" style={{ marginBottom: '24px' }}>
              <div className="info-row" style={{ 
                display: 'flex',
                marginBottom: '16px'
              }}>
                <div style={{ width: '80px', color: '#8f9098' }}>任务名称</div>
                <div style={{ flex: 1 }}>{task.title}</div>
              </div>
              <div className="info-row" style={{ 
                display: 'flex',
                marginBottom: '16px'
              }}>
                <div style={{ width: '80px', color: '#8f9098' }}>创建人</div>
                <div style={{ flex: 1, display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <Avatar size={24}>{task.author?.name?.charAt(0)}</Avatar>
                  <span>{task.author?.name}</span>
                </div>
              </div>
              <div className="info-row" style={{ 
                display: 'flex',
                marginBottom: '16px'
              }}>
                <div style={{ width: '80px', color: '#8f9098' }}>描述</div>
                <div style={{ flex: 1 }}>{task.description}</div>
              </div>
              <div className="info-row" style={{ 
                display: 'flex',
                marginBottom: '16px'
              }}>
                <div style={{ width: '80px', color: '#8f9098' }}>关键词</div>
                <div style={{ flex: 1 }}>
                  {task.tags.map((tag, index) => (
                    <Tag key={index} style={{ borderRadius: '12px', marginRight: '8px' }}>{tag}</Tag>
                  ))}
                </div>
              </div>
            </div>

            {/* 注释表格区域 */}
            <div className="annotation-section">
              <div 
                style={{ 
                  display: 'flex', 
                  alignItems: 'center',
                  marginBottom: '16px',
                  cursor: 'pointer'
                }}
                onClick={() => setIsAnnotationExpanded(!isAnnotationExpanded)}
              >
                <span style={{ 
                  fontSize: '14px',
                  fontWeight: '500'
                }}>注释</span>
                {isAnnotationExpanded ? 
                  <CaretDownOutlined style={{ marginLeft: '4px', color: '#8f9098' }} /> :
                  <CaretRightOutlined style={{ marginLeft: '4px', color: '#8f9098' }} />
                }
              </div>
              
              {isAnnotationExpanded && (
                <Table
                  columns={annotationColumns}
                  dataSource={annotationData}
                  pagination={false}
                  size="small"
                  style={{ 
                    marginTop: '8px',
                    width: '676px'
                  }}
                  scroll={{ x: 676 }}
                />
              )}
            </div>
          </>
        );
      case 'qa':
        return (
          <div className="qa-section" style={{ 
            background: '#FAFAFA',
            borderRadius: '12px',
            margin: '-24px'
          }}>
            <QASection isEditable={false} />
          </div>
        );
      case 'scene':
        return (
          <div className="scene-section">
            <h2>场景内容</h2>
            <SceneSection isEditable={false} />
          </div>
        );
      case 'template':
        return (
          <div className="template-section">
            <TemplateSection isEditable={false} />
          </div>
        );
      default:
        return null;
    }
  };

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
            }
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

      {/* 下半部分 - 上下结构 */}
      <div className="task-detail-bottom-section" >
        {/* 步骤导航 */}
        <div className="steps-navigation" style={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          padding: '0 24px',
          height: '62px',
          alignItems: 'center',
          background: '#FAFAFA',
          borderRadius: '12px 12px 0 0'
        }}>
          {[
            { step: 1, label: '编辑QA' },
            { step: 2, label: '编辑场景' },
            { step: 3, label: '编辑模板' },
            { step: 4, label: '确认测试' },
            { step: 5, label: '提交结果' }
          ].map((item) => (
            <div key={item.step} className="step" style={{ 
              display: 'flex', 
              flexDirection: 'column', 
              alignItems: 'center',
              gap: '4px'
            }}>
              <div style={{ 
                width: '20px',
                height: '20px',
                borderRadius: '50%',
                border: '1px solid #8f9098',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '12px',
                fontWeight: 700,
                color: '#8f9098'
              }}>{item.step}</div>
              <div style={{ 
                fontSize: '12px',
                fontWeight: 700,
                color: '#8f9098'
              }}>{item.label}</div>
                  </div>
          ))}
                    </div>

        {/* 主要内容区域 */}
        <div className="main-content" style={{ 
          display: 'flex',
          minHeight: 'calc(100vh - 300px)',
          background: '#FAFAFA',
          borderRadius: '0 0 12px 12px'
        }}>
          {/* 左侧导航菜单 */}
          <div className="left-menu" style={{ 
            width: '110px',
            borderRight: '1px solid #f0f0f0',
            padding: '16px 0'
          }}>
            {/* 任务概览标题 */}
            <div style={{
              padding: '0 0 40px',
              fontSize: '14px',
              fontWeight: 600,
              color: '#000'
            }}>
              任务概览
                    </div>

            <Timeline>
              {[
                { key: 'overview', label: '概览' },
                { key: 'qa', label: 'QA' },
                { key: 'scene', label: '场景' },
                { key: 'template', label: '模板' }
              ].map((item) => (
                <Timeline.Item
                  key={item.key}
                  dot={
                    <div 
                      style={{
                        width: '24px',
                        height: '24px',
                        borderRadius: '4px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        background: activeSection === item.key ? '#f0f7ff' : '#f9f9f9',
                        cursor: 'pointer'
                      }}
                      onClick={() => setActiveSection(item.key)}
                    >
                      <TimelineIcon active={activeSection === item.key} />
                    </div>
                  }
                  style={{ 
                    padding: '0 0 32px'
                  }}
                  color={activeSection === item.key ? '#006ffd' : '#8f9098'}
                >
                  <div
                    style={{ 
                      color: activeSection === item.key ? '#006ffd' : '#8f9098',
                      fontSize: '14px',
                      cursor: 'pointer',
                      marginLeft: '8px'
                    }}
                    onClick={() => setActiveSection(item.key)}
                  >
                    {item.label}
                        </div>
                      </Timeline.Item>
                    ))}
                  </Timeline>
          </div>

          {/* 右侧内容区域 */}
          <div className="right-content" style={{ 
            flex: 1,
            padding: '24px'
          }}>
            {renderContent()}
            </div>
            </div>

        {/* 底部按钮区域 */}
        <div style={{
          width: '812px',
          margin: '16px auto',
          backgroundColor: '#006ffd',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          borderRadius: '12px',
          border: '1px solid transparent'
        }}>
          <Button 
            type="primary" 
            size="large"
            icon={<StartTaskIcon />}
            style={{
              backgroundColor: 'transparent',
              border: 'none',
              color: '#fff',
              fontSize: '16px',
              fontWeight: '500',
              height: '36px',
              display: 'flex',
              alignItems: 'center',
              gap: '10px'
            }}
          >
            开始任务
          </Button>
            </div>
      </div>

      <style jsx global>{`
        .ant-timeline-item-head.ant-timeline-item-head-custom {
          background: #f9f9f9 !important;
          padding: 0;
          border: none;
        }
      `}</style>
    </div>
  )
}

export default TaskDetailPage
