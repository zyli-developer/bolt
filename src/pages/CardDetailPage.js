"use client"

import { useState, useEffect } from "react"
import { useParams, useNavigate, useLocation } from "react-router-dom"
import {  Button, Avatar, Tag, Spin, Select, Checkbox, Breadcrumb, Switch, Steps, message, Tooltip } from "antd"
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
  FileTextOutlined,
  CloseCircleOutlined,
  SendOutlined,
} from "@ant-design/icons"
import {
  Area,
  AreaChart,
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
} from "recharts"
import taskService from "../services/taskService"
import { useChatContext } from "../contexts/ChatContext"
import CreateTaskModal from "../components/modals/CreateTaskModal"
import TimelineIcon from "../components/icons/TimelineIcon"

// 导入QA组件
import QASection from "../components/qa/QASection"
// 导入场景优化和模板优化组件
import SceneSection from "../components/scene/SceneSection"
import TemplateSection from "../components/template/TemplateSection"
// 导入再次测试组件
import TestConfirmation from "../components/task/TestConfirmation"
// 导入提交结果组件
import SubmitResultSection from "../components/task/SubmitResultSection"

// 导入样式覆盖
import "../styles/overrides/qa.css"
import "../styles/overrides/scene.css"
import "../styles/overrides/template.css"
import "../styles/overrides/retest.css"


const { Option } = Select


// 优化模式步骤组件
const STEP_TITLES = [
  '结果质询',
  'QA优化',
  '场景优化',
  '模版优化',
  '再次测试',
  '提交结果',
];

const OptimizationSteps = ({ currentStep, onStepChange }) => {
  const stepItems = STEP_TITLES.map(title => ({ title }));

  return (
    <div className="optimization-steps" style={{ 
      padding: "12px", 
      marginBottom: "12px", 
      backgroundColor: "#f8f9fa", 
      border: "1px solid #e9ecef", 
      borderRadius: "8px" 
    }}>
      <Steps 
        current={currentStep} 
        onChange={onStepChange}
        items={stepItems} 
        size="small"
        labelPlacement="vertical"
      />
    </div>
  );
};

// QA优化界面组件
const QAOptimizationSection = ({ comments = [] }) => {
  // 自定义样式
  const annotationTitleStyle = {
    fontSize: "16px",
    fontWeight: "500",
    margin: "0 0 8px 0",
    color: "rgba(0, 0, 0, 0.88)"
  };

  return (
    <div className="qa-optimization-content" style={{ width: "100%" }}>
      {/* 使用现有的QA组件 */}
      <QASection isEditable={true} />
    </div>
  );
};

// 场景优化界面组件
const SceneOptimizationSection = ({ comments = [] }) => {
  return (
    <div className="scene-optimization-content" style={{ width: "100%" }}>
      {/* 使用现有的场景组件，场景组件中已包含注释列表 */}
      <SceneSection isEditable={true} />
    </div>
  );
};

// 模板优化界面组件
const TemplateOptimizationSection = ({ comments = [] }) => {
  return (
    <div className="template-optimization-content" style={{ width: "100%" }}>
      {/* 使用现有的模板组件，模板组件中已包含注释列表 */}
      <TemplateSection isEditable={true} />
    </div>
  );
};

// 注释列表组件
const CommentsList = ({ comments = [] }) => {
  if (!comments || comments.length === 0) return null;
  
  return (
    <div className="comments-list" style={{ padding: "8px" }}>
      <div className="comments-header" style={{ marginBottom: "8px" }}>
        <span style={{ fontSize: "14px", fontWeight: "500" }}>注释列表</span>
      </div>
      <div className="comments-content">
        {comments.map((comment, index) => (
          <div key={index} className="comment-item" style={{ marginBottom: "8px", padding: "8px", background: "#f9f9f9", borderRadius: "4px" }}>
            <div className="comment-header" style={{ display: "flex", alignItems: "center", marginBottom: "4px" }}>
              <Avatar size={20} className="commenter-avatar">
                {comment.author?.charAt(0)}
              </Avatar>
              <span className="commenter-name" style={{ marginLeft: "4px", fontSize: "12px", fontWeight: "bold" }}>
                {comment.author}
              </span>
              <span className="comment-time" style={{ marginLeft: "8px", fontSize: "11px", color: "#8f9098" }}>
                {comment.time}
              </span>
            </div>
            <p className="comment-text" style={{ fontSize: "12px", margin: "0", lineHeight: "1.4" }}>
              {comment.text}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

// 自定义QASection包装组件
const CustomQASection = (props) => {
  // 使用React.forwardRef传递ref等
  return <QASection {...props} customTitleRender={(title) => (
    <div style={{ 
      fontSize: "16px", 
      fontWeight: "500", 
      margin: "0 0 8px 0", 
      color: "rgba(0, 0, 0, 0.88)" 
    }}>
      {title}
    </div>
  )} />;
};

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
  const [selectedModel, setSelectedModel] = useState("claude")
  const [evaluationData, setEvaluationData] = useState({})
  const [isCreateTaskModalVisible, setIsCreateTaskModalVisible] = useState(false)
  // 新增状态
  const [isOptimizationMode, setIsOptimizationMode] = useState(false)
  const [currentOptimizationStep, setCurrentOptimizationStep] = useState(0)
  const [comments, setComments] = useState([])
  const [savedData, setSavedData] = useState({})
  const [isTesting, setIsTesting] = useState(false);
  const [testProgress, setTestProgress] = useState(0);
  const [isTaskStarted, setIsTaskStarted] = useState(false);

  // Determine if we came from explore or tasks
  const isFromExplore = location.pathname.includes("/explore") || location.state?.from === "explore"
  const parentPath = isFromExplore ? "/explore" : "/tasks"
  const parentLabel = isFromExplore ? "探索" : "任务"

  // 切换优化模式
  const toggleOptimizationMode = (checked) => {
    setIsOptimizationMode(checked);
    // 重置到第一步
    setCurrentOptimizationStep(0);
  };

  // 保存当前修改的数据
  const saveCurrentData = () => {
    // 收集当前数据
    const currentData = {
      step: currentOptimizationStep,
      models: selectedModels,
      comments: comments,
      // 其他需要保存的数据
    };
    
    // 更新savedData状态
    setSavedData(prev => ({
      ...prev,
      [currentOptimizationStep]: currentData
    }));
    
    console.log("数据已保存", currentData);
  };

  // 保存并进入下一步
  const saveAndNext = () => {
    // 先保存当前数据
    saveCurrentData();
    
    // 进入下一步，确保不会超出步骤范围
    if (currentOptimizationStep < STEP_TITLES.length - 1) {
      setCurrentOptimizationStep(currentOptimizationStep + 1);
    } else {
      // 如果是最后一步，则完成优化
      message.success('优化已完成');
    }
  };

  // 步骤变更处理
  const handleStepChange = (current) => {
    setCurrentOptimizationStep(current);
    // 记录当前步骤数据，用于返回时恢复
    if (current !== currentOptimizationStep) {
      // 如果是切换到不同步骤，保存当前步骤的数据
      saveCurrentData();
    }
    
    // 根据步骤加载不同数据
    if (current === 0) {
      // 结果质询步骤的注释
      setComments([
        { author: 'Jackson', time: '2025-04-24 09:45', text: '这个模型在语音识别方面表现优秀，尤其是对儿童语音的识别准确率比预期高' },
        { author: 'Alice', time: '2025-04-24 10:12', text: '安全性设计符合国际标准，没有发现明显漏洞' }
      ]);
    } else if (current === 1) {
      // QA优化步骤的注释
      setComments([
        { author: 'Bob', time: '2025-04-25 11:30', text: '建议优化错误处理机制，当前在特殊情况下可能会返回不明确的错误信息' }
      ]);
    } else if (current === 2 || current === 3) {
      // 场景优化和模板优化步骤不需要设置注释，因为组件内部已有注释功能
      setComments([]);
    } else {
      // 其他步骤暂无注释
      setComments([]);
    }
  };

  // 返回按钮处理函数
  const handleBack = () => {
    // 关闭优化模式
    setIsOptimizationMode(false);
  };

  // 上一步按钮处理函数
  const handlePrevStep = () => {
    if (currentOptimizationStep > 0) {
      saveCurrentData(); // 先保存当前步骤数据
      setCurrentOptimizationStep(currentOptimizationStep - 1);
    } else {
      // 如果已经是第一步，则关闭优化模式
      setIsOptimizationMode(false);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true)
        const [cardData, evaluationData] = await Promise.all([
          taskService.getCardDetail(id),
          taskService.getAllModelEvaluations()
        ])
        setCard(cardData)
        setEvaluationData(evaluationData)
        
        // 如果是从探索页面进入，默认设置一些注释数据
        if (isFromExplore) {
          setComments([
            { author: 'Jackson', time: '2025-04-24 09:45', text: '这个模型在语音识别方面表现优秀，尤其是对儿童语音的识别准确率比预期高' },
            { author: 'Alice', time: '2025-04-24 10:12', text: '安全性设计符合国际标准，没有发现明显漏洞' }
          ]);
        }
        
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
  }, [id, isFromExplore])

  const handleGoBack = () => {
    navigate(-1)
  }

  const currentEvaluation = evaluationData[selectedModel] || evaluationData.claude

  // 获取所有可用的模型选项
  const modelOptions = Object.keys(evaluationData);

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

  // 处理分支为新任务按钮点击
  const handleForkTask = () => {
    setIsCreateTaskModalVisible(true)
  }

  // 处理取消创建任务
  const handleCancelCreateTask = () => {
    setIsCreateTaskModalVisible(false)
  }

  // 添加注释数据，确保数据始终可用
  const defaultAnnotationData = [
    {
      key: '1',
      no: '1',
      title: '内容安全',
      content: '确保内容对所有年龄段用户安全',
      attachments: [
        { name: '安全标准.pdf', url: '#' },
        { name: '检查清单.doc', url: '#' }
      ],
      lastModifiedBy: { name: 'Lisa', avatar: 'L' },
      modifiedTime: { hour: '09:30', date: '11/28' }
    },
    {
      key: '2',
      no: '2',
      title: '隐私保护',
      content: '用户数据收集和处理合规性',
      attachments: [
        { name: '隐私政策.pdf', url: '#' }
      ],
      lastModifiedBy: { name: 'Mike', avatar: 'M' },
      modifiedTime: { hour: '14:25', date: '11/27' }
    },
    {
      key: '3',
      no: '3',
      title: '响应速度',
      content: '系统响应时间需控制在200ms内',
      attachments: [
        { name: '性能测试.xlsx', url: '#' }
      ],
      lastModifiedBy: { name: 'Tom', avatar: 'T' },
      modifiedTime: { hour: '16:40', date: '11/26' }
    }
  ];

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

  // 任务注释数据对象，包含columns和data
  const taskAnnotationData = {
    columns: annotationColumns,
    data: defaultAnnotationData
  };

  // 添加测试进度的定时器
  useEffect(() => {
    let timer;
    if (isTesting && testProgress < 100) {
      timer = setInterval(() => {
        setTestProgress(prev => {
          const next = prev + 1;
          if (next >= 100) {
            clearInterval(timer);
            // 测试完成后自动进入结果页面
            setCurrentOptimizationStep(5);
            setIsTesting(false);
          }
          return next;
        });
      }, 100);
    }
    return () => timer && clearInterval(timer);
  }, [isTesting, testProgress]);

  // 开始测试方法
  const handleStartTest = () => {
    setIsTesting(true);
    setTestProgress(0);
    
    // 模拟测试进度，完成后自动跳转到下一步
    const timer = setInterval(() => {
      setTestProgress(prev => {
        const next = prev + 1;
        if (next >= 100) {
          clearInterval(timer);
          // 测试完成后自动进入结果页面
          setCurrentOptimizationStep(5);
          setIsTesting(false);
        }
        return next;
      });
    }, 100);
  };
  
  // 处理提交测试结果
  const handleSubmitResults = () => {
    // 模拟提交测试结果到服务器
    message.success('测试结果已成功提交');
    
    // 提交后，您可以选择重置优化模式或跳转到其他页面
    // 这里示例为重置到第一步
    setTimeout(() => {
      setCurrentOptimizationStep(0);
    }, 1500);
  };

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
            }
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

      {/* 评估结果和图表区域 - 左右结构或优化模式结构 */}
      <div className="evaluation-charts-wrapper" style={{ gap: "4px", marginTop: "4px", flexDirection: isOptimizationMode ? "column" : "row" }}>
        {isOptimizationMode ? (
          // 优化模式界面
          <>
            {/* 优化模式步骤条 */}
            <OptimizationSteps 
              currentStep={currentOptimizationStep} 
              onStepChange={handleStepChange} 
            />
            
            {/* 优化模式内容区域 */}
            <div className="optimization-content" style={{ display: "flex", gap: "4px" }}>
              {currentOptimizationStep === 0 ? (
                // 结果质询界面
                <>
                  {/* 左侧和中间区域 - 与原评估区域相同 */}
                  <div style={{ flex: comments.length > 0 ? 2 : 3, display: "flex", flexDirection: "row", gap: "4px" }}>
                    {/* 左侧评估区域 */}
                    <div className="evaluation-left-section" style={{ flex: 1, gap: "4px" }}>
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
                              style={{ minWidth: "200px", flex: 1 }}
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
                                    {evaluationData[modelKey]?.name.charAt(0)}
                                  </Avatar>
                                  <div className="model-info">
                                    <div className="model-name" style={{ fontSize: "14px" }}>
                                      {evaluationData[modelKey]?.name}
                                      <span className="model-usage" style={{ fontSize: "12px", marginLeft: "4px" }}>128k</span>
                                    </div>
                                    <div className="model-tags" style={{ gap: "4px" }}>
                                      {evaluationData[modelKey]?.tags.map((tag, index) => (
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
                                    <p className="evaluation-text" style={{ fontSize: "12px", margin: 0, lineHeight: "1.4" }}>{evaluationData[modelKey]?.description}</p>
                                  </div>
                                </div>
                              )}
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>

                    {/* 中部图表区域 */}
                    <div className="evaluation-right-section" style={{ gap: "4px", flex: 1 }}>
                      {/* 折线图区域 */}
                      <div className="line-chart-section" style={{ padding: "8px" }}>
                        <div className="chart-legend" style={{ marginBottom: "8px", gap: "8px" }}>
                          {selectedModels.map(modelKey => (
                            <div className="legend-item" key={modelKey} style={{ gap: "4px" }}>
                              <span className="legend-color" style={{ backgroundColor: getModelColor(modelKey), width: "10px", height: "10px" }}></span>
                              <span className="legend-label" style={{ fontSize: "12px" }}>{evaluationData[modelKey]?.name}</span>
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
                                {Object.keys(evaluationData).map(modelKey => (
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
                              <RechartsTooltip 
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
                                  name={evaluationData[modelKey]?.name}
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
                                  name={evaluationData[modelKey]?.name} 
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
                  
                  {/* 右侧注释列表 - 只在有注释时显示 */}
                  {comments.length > 0 && (
                    <div className="comments-section" style={{ flex: 1 }}>
                      <CommentsList comments={comments} />
                    </div>
                  )}
                </>
              ) : currentOptimizationStep === 1 ? (
                // QA优化界面
                <QAOptimizationSection comments={comments} />
              ) : currentOptimizationStep === 2 ? (
                // 场景优化界面
                <SceneOptimizationSection comments={comments} />
              ) : currentOptimizationStep === 3 ? (
                // 模板优化界面
                <TemplateOptimizationSection comments={comments} />
              ) : currentOptimizationStep === 4 ? (
                // 再次测试界面
                <div style={{ width: "100%", display: "flex", flex: 1 }}>
                  <TestConfirmation
                    isTesting={isTesting}
                    testProgress={testProgress}
                    task={card}
                    isTaskStarted={isTaskStarted}
                    TimelineIcon={TimelineIcon}
                    currentStep={4}
                    onPrevious={handleBack}
                    onStartTest={handleStartTest}
                    QASection={QASection}
                    SceneSection={SceneSection}
                    TemplateSection={TemplateSection}
                    annotationColumns={taskAnnotationData.columns}
                    annotationData={taskAnnotationData.data}
                  />
                </div>
              ) : currentOptimizationStep === 5 ? (
                // 提交结果界面
                <div style={{ width: "100%", display: "flex", flex: 1 }}>
                  <SubmitResultSection
                    task={card}
                  />
                </div>
              ) : (
                // 其他步骤(未实现)的通用界面
                <div style={{ flex: 1, display: "flex", justifyContent: "center", alignItems: "center", padding: "40px" }}>
                  <div style={{ textAlign: "center" }}>
                    <h3 style={{ fontSize: "18px", marginBottom: "16px" }}>
                      {STEP_TITLES[currentOptimizationStep]}界面
                    </h3>
                    <p style={{ color: "#666" }}>该功能正在开发中，敬请期待...</p>
                  </div>
                </div>
              )}
            </div>
          </>
        ) : (
          // 原始布局
          <>
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
                        {evaluationData[modelKey]?.name.charAt(0)}
            </Avatar>
                      <div className="model-info">
                        <div className="model-name" style={{ fontSize: "14px" }}>
                          {evaluationData[modelKey]?.name}
                          <span className="model-usage" style={{ fontSize: "12px", marginLeft: "4px" }}>128k</span>
                        </div>
                        <div className="model-tags" style={{ gap: "4px" }}>
                          {evaluationData[modelKey]?.tags.map((tag, index) => (
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
                        <p className="evaluation-text" style={{ fontSize: "12px", margin: 0, lineHeight: "1.4" }}>{evaluationData[modelKey]?.description}</p>
                      </div>
                    </div>
                  )}
                </div>
                ))}
              </div>
            </div>
          </div>

        {/* 右侧图表区域 */}
        <div className="evaluation-right-section" style={{ gap: "4px", flex: 1 }}>
          {/* 折线图区域 */}
          <div className="line-chart-section" style={{ padding: "8px" }}>
            <div className="chart-legend" style={{ marginBottom: "8px", gap: "8px" }}>
              {selectedModels.map(modelKey => (
                <div className="legend-item" key={modelKey} style={{ gap: "4px" }}>
                  <span className="legend-color" style={{ backgroundColor: getModelColor(modelKey), width: "10px", height: "10px" }}></span>
                  <span className="legend-label" style={{ fontSize: "12px" }}>{evaluationData[modelKey]?.name}</span>
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
                    {Object.keys(evaluationData).map(modelKey => (
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
                  <RechartsTooltip 
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
                      name={evaluationData[modelKey]?.name}
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
                      name={evaluationData[modelKey]?.name} 
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
          </>
        )}
      </div>

      {/* 底部按钮区域 */}
      <div className="task-footer-actions" style={{ display: 'flex', justifyContent: 'center', gap: '8px', marginTop: '8px', padding: '8px 0', maxWidth: '100%', width: '100%' }}>
        {isOptimizationMode ? (
          // 优化模式下的按钮
          <>
            {currentOptimizationStep === 5 ? (
              // 提交结果阶段的按钮布局
              <>
                <Button 
                  className="action-button generate-report-button"
                  onClick={() => {
                    message.info('生成报告功能开发中');
                  }}
                  style={{ 
                    borderRadius: '20px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '4px',
                    padding: '0 12px',
                    height: '32px',
                    fontSize: '12px',
                    flex: 2
                  }}
                >
                  <FileTextOutlined />
                  生成报告
                </Button>
                <Button 
                  className="action-button cancel-optimization-button"
                  onClick={() => {
                    setIsOptimizationMode(false);
                  }}
                  style={{ 
                    borderRadius: '20px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '4px',
                    padding: '0 12px',
                    height: '32px',
                    fontSize: '12px',
                    flex: 2
                  }}
                >
                  <CloseCircleOutlined />
                  放弃此次优化
                </Button>
                <Button 
                  type="primary"
                  className="action-button submit-result-button"
                  onClick={handleSubmitResults}
                  style={{ 
                    borderRadius: '20px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '4px',
                    padding: '0 12px',
                    height: '32px',
                    backgroundColor: '#006ffd',
                    fontWeight: 500,
                    fontSize: '12px',
                    flex: 1
                  }}
                >
                  <SendOutlined />
                  提交优化结果
                </Button>
                <div 
                  className="action-button optimize-mode"
                  style={{ 
                    borderRadius: '20px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px',
                    padding: '0 12px',
                    height: '32px',
                    fontSize: '12px',
                    border: '1px solid #d9d9d9',
                    background: isOptimizationMode ? '#e6f7ff' : 'white',
                    flex: 1
                  }}
                >
                  <SettingOutlined style={{ fontSize: '14px' }} />
                  <span>优化模式</span>
                  <Switch 
                    size="small" 
                    checked={isOptimizationMode}
                    onChange={toggleOptimizationMode}
                    style={{ marginLeft: '4px' }}
                  />
                </div>
              </>
            ) : (
              // 其他步骤的常规按钮
              <>
                <Button 
                  icon={<ArrowLeftOutlined />} 
                  className="action-button back-button"
                  onClick={currentOptimizationStep === 0 ? handleBack : handlePrevStep}
                  style={{ 
                    borderRadius: '20px', 
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px',
                    padding: '0 12px',
                    height: '32px',
                    fontSize: '12px',
                    flex: 1
                  }}
                >
                  {currentOptimizationStep === 0 ? '返回' : '上一步'}
                </Button>
                <Button 
                  className="action-button save-button"
                  onClick={saveCurrentData}
                  style={{ 
                    borderRadius: '20px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '4px',
                    padding: '0 12px',
                    height: '32px',
                    fontSize: '12px',
                    flex: 1
                  }}
                >
                  保存
                </Button>
                {currentOptimizationStep === 4 ? (
                  // 再次测试步骤特有的按钮
                  <Button 
                    type="primary"
                    className="action-button start-test-button"
                    onClick={handleStartTest}
                    style={{ 
                      borderRadius: '20px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '4px',
                      padding: '0 12px',
                      height: '32px',
                      backgroundColor: '#006ffd',
                      fontWeight: 500,
                      fontSize: '12px',
                      flex: 2
                    }}
                    disabled={isTesting}
                  >
                    {isTesting ? (
                      <>
                        <Spin size="small" style={{ marginRight: '8px' }} />
                        测试中...({testProgress}%)
                      </>
                    ) : '确认无误，开始测试'}
                  </Button>
                ) : (
                  // 其他步骤的常规按钮
                  <Button 
                    type="primary"
                    className="action-button save-next-button"
                    onClick={saveAndNext}
                    style={{ 
                      borderRadius: '20px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '4px',
                      padding: '0 12px',
                      height: '32px',
                      backgroundColor: '#006ffd',
                      fontWeight: 500,
                      fontSize: '12px',
                      flex: 2
                    }}
                  >
                    {currentOptimizationStep < 5 ? '保存并进入下一步' : '保存并完成'}
                  </Button>
                )}
                <div 
                  className="action-button optimize-mode"
                  style={{ 
                    borderRadius: '20px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px',
                    padding: '0 12px',
                    height: '32px',
                    fontSize: '12px',
                    border: '1px solid #d9d9d9',
                    background: isOptimizationMode ? '#e6f7ff' : 'white',
                    flex: 1
                  }}
                >
                  <SettingOutlined style={{ fontSize: '14px' }} />
                  <span>优化模式</span>
                  <Switch 
                    size="small" 
                    checked={isOptimizationMode}
                    onChange={toggleOptimizationMode}
                    style={{ marginLeft: '4px' }}
                  />
                </div>
              </>
            )}
          </>
        ) : (
          // 非优化模式下的原始按钮
          <>
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
          onClick={handleForkTask}
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
            <div 
              className="action-button optimize-mode"
          style={{ 
            borderRadius: '20px',
            display: 'flex',
            alignItems: 'center',
            gap: '4px',
            padding: '0 12px',
            height: '32px',
                fontSize: '12px',
                border: '1px solid #d9d9d9',
                background: isOptimizationMode ? '#e6f7ff' : 'white'
              }}
            >
              <SettingOutlined style={{ fontSize: '14px' }} />
              <span>优化模式</span>
              <Switch 
                size="small" 
                checked={isOptimizationMode}
                onChange={toggleOptimizationMode}
                style={{ marginLeft: '4px' }}
              />
            </div>
          </>
        )}
      </div>

      {/* 创建任务模态框 */}
      <CreateTaskModal
        visible={isCreateTaskModalVisible}
        onCancel={handleCancelCreateTask}
        cardData={card}
      />
    </div>
  )
}

export default CardDetailPage
