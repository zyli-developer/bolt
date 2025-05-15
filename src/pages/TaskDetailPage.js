"use client"

import { useState, useEffect } from "react"
import { useParams, useNavigate, useLocation } from "react-router-dom"
import { Typography, Button, Avatar, Tag, Spin, Breadcrumb, Select, Checkbox, Timeline, Table, Collapse, Tooltip, message, Progress, Switch } from "antd"
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
  PlusOutlined,
  MinusOutlined,
  CheckOutlined,
} from "@ant-design/icons"
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
  AreaChart,
} from "recharts"
import taskService from "../services/taskService"
import cardService from "../services/cardService"
import { useChatContext } from "../contexts/ChatContext"
import TimelineIcon from "../components/icons/TimelineIcon"
import { taskAnnotationData } from "../mocks/data"
import StartTaskIcon from "../components/icons/StartTaskIcon"
import QASection from "../components/qa/QASection"
import SceneSection from '../components/scene/SceneSection'
import TemplateSection from '../components/template/TemplateSection'
import TestConfirmation from "../components/task/TestConfirmation"
import useTaskDetailStyles from '../styles/pages/TaskDetailPage'

const { Title, Text, Paragraph } = Typography
const { Option } = Select

const TaskDetailPage = () => {
  const { styles } = useTaskDetailStyles()
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
  const [currentStep, setCurrentStep] = useState(0)
  const [isTaskStarted, setIsTaskStarted] = useState(false)
  const [evaluationData, setEvaluationData] = useState({})
  const [testProgress, setTestProgress] = useState(0);
  const [isTesting, setIsTesting] = useState(false);
  const [isOptimizeMode, setIsOptimizeMode] = useState(false);

  // 添加QA、场景和模板的内容数据
  const [qaContent] = useState([
    '已完成所有必要的QA配置',
    '已设置合适的评估标准',
    '已确认评估指标的权重'
  ]);

  const [sceneContent] = useState([
    '已配置测试场景参数',
    '已设置场景交互规则',
    '已确认场景覆盖范围'
  ]);

  const [templateContent] = useState([
    '已选择合适的测试模板',
    '已完成模板参数配置',
    '已确认输出格式正确'
  ]);

  // Determine if we came from explore or tasks
  const isFromExplore = location.pathname.includes("/explore") || location.state?.from === "explore"
  const parentPath = isFromExplore ? "/explore" : "/tasks"
  const parentLabel = isFromExplore ? "探索" : "任务"

  // 添加用于评估结果的状态
  const [selectedModels, setSelectedModels] = useState(['claude3.5', 'claude3.6', 'claude3.7']);
  const [expandedModel, setExpandedModel] = useState(false);
  const [enhancedChartData, setEnhancedChartData] = useState({ radar: [], line: [] });

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
          <Avatar size={24} style={{ background: 'var(--color-primary)', fontSize: '12px' }}>{text}</Avatar>
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
          <a href="#" style={{ color: 'var(--color-primary)' }}>{text}</a>
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
          {Array.isArray(attachments) && attachments.map((file, index) => (
            <Tag key={index} style={{ cursor: 'pointer', whiteSpace: 'nowrap' }}>
              <a href={file.url} style={{ color: 'var(--color-primary)' }}>{file.name}</a>
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
        <div style={{ color: 'var(--color-text-tertiary)', fontSize: '12px' }}>
          <div>{time.hour}</div>
          <div>{time.date}</div>
        </div>
      ),
    },
  ];

  // 使用任务数据中的注释或默认注释
  const [annotationData, setAnnotationData] = useState(defaultAnnotationData);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true)
        
        let taskData;
        // 获取任务详情，直接使用ID
          taskData = await taskService.getTaskDetail(id);
          // 如果是任务API返回的数据，从task字段中获取
          if (taskData && taskData.task) {
            taskData = taskData.task;
        }
        
        // 确保taskData有基本结构
        taskData = taskData || {};
        taskData.tags = taskData.tags || [];
        taskData.author = taskData.author || { name: '未知用户' };
        taskData.title = taskData.title || '未命名任务';
        taskData.description = taskData.description || '暂无描述';
        taskData.source = taskData.source || '未知来源';
        taskData.chartData = taskData.chartData || {
          radar: [
            { name: "维度1", value: 80 },
            { name: "维度2", value: 75 },
            { name: "维度3", value: 85 },
            { name: "维度4", value: 70 },
            { name: "维度5", value: 90 },
            { name: "维度6", value: 85 }
          ],
          line: [
            { month: "08", value: 70 },
            { month: "09", value: 75 },
            { month: "10", value: 82 },
            { month: "11", value: 88 }
          ]
        };
        
        // 确保templateData正确设置
        if (!taskData.templateData && taskData.step) {
          if (typeof taskData.step === 'object' && !Array.isArray(taskData.step) && taskData.step.templateData) {
            taskData.templateData = taskData.step.templateData;
          }
        }
        
        // 获取评估数据
        const evaluationData = await taskService.getAllModelEvaluations();
        
        console.log("获取到的任务数据:", taskData);
        setTask(taskData)

        // 设置注释数据，添加保护措施防止undefined使用map
        if (taskData && taskData.annotations) {
          setAnnotationData(taskData.annotations);
        } else if (taskAnnotationData) {
          setAnnotationData(taskAnnotationData);
        }

        // 如果没有评估数据，提供默认数据
        if (!evaluationData || Object.keys(evaluationData).length === 0) {
          const defaultEvaluationData = {
            'claude3.5': {
              name: 'Claude 3.5',
              score: '92',
              scoreChange: '+2.5',
              credibility: '88',
              credibilityChange: '+3.2',
              tags: ['大语言模型', '文本生成'],
              description: 'Claude 3.5 是一个功能强大的大语言模型，擅长文本生成、问答和内容创作。',
              updatedAt: '2023-11-25 09:30',
              updatedBy: 'Alex Chen',
              history: '上次评估后，模型在流畅性和创新性方面有显著提升，但安全性略有下降。'
            },
            'claude3.6': {
              name: 'Claude 3.6',
              score: '95',
              scoreChange: '+4.2',
              credibility: '91',
              credibilityChange: '+5.5',
              tags: ['增强型AI', '多模态'],
              description: 'Claude 3.6 是新一代增强型AI，支持多模态输入和更强的推理能力。',
              updatedAt: '2023-12-10 14:20',
              updatedBy: 'Sarah Wang',
              history: '本次迭代中，模型在所有维度都有全面提升，特别是在准确性和可靠性方面。'
            },
            'claude3.7': {
              name: 'Claude 3.7',
              score: '97',
              scoreChange: '+1.8',
              credibility: '93',
              credibilityChange: '+2.1',
              tags: ['AGI', '专家系统'],
              description: 'Claude 3.7 是最新研发的接近AGI的模型，拥有专家级知识和超强推理能力。',
              updatedAt: '2024-01-05 16:45',
              updatedBy: 'Mike Johnson',
              history: '作为最新模型，3.7在创新性和安全性方面取得了突破，但资源消耗较大。'
            }
          };
          setEvaluationData(defaultEvaluationData);
        } else {
          setEvaluationData(evaluationData);
        }

        // 初始化增强图表数据
        if (taskData && taskData.chartData) {
          setEnhancedChartData(getEnhancedChartData(taskData.chartData));
        } else {
          // 使用默认图表数据
          setEnhancedChartData(getEnhancedChartData());
        }

        setError(null)
      } catch (err) {
        console.error(`获取数据失败 (ID: ${id}):`, err)
        setError("获取数据失败，请重试")
        
        // 设置一些默认数据，防止界面崩溃
        setTask({
          title: '加载失败的任务',
          author: { name: '未知用户' },
          source: '未知来源',
          tags: ['加载失败'],
          description: '无法加载任务数据，请刷新页面重试',
          chartData: {
            radar: [],
            line: []
          }
        });
      } finally {
        setLoading(false)
      }
    }

    if (id) {
      fetchData()
    }
  }, [id])

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
            setCurrentStep(5);
            setIsTesting(false);
          }
          return next;
        });
      }, 100);
    }
    return () => timer && clearInterval(timer);
  }, [isTesting, testProgress]);

  const handleGoBack = () => {
    navigate(-1)
  }

  const handleModelChange = (value) => {
    // 检查参数类型，区分单选/多选
    if (Array.isArray(value)) {
      // 多选模式 - 用于结果页面
      setSelectedModels(value);
    } else {
      // 单选模式 - 原有功能
      setSelectedModel(value);
    }
  };

  const handleChartModelChange = (modelKey) => {
    setSelectedChartModels((prev) => ({
      ...prev,
      [modelKey]: !prev[modelKey],
    }))
  }

  const currentEvaluation = evaluationData[selectedModel] || evaluationData.claude

  // 渲染右侧内容的函数
  const renderContent = () => {
    if (isTaskStarted) {
      switch (currentStep) {
        case 1:
          return (
            <div className="qa-section" style={{
              background: 'var(--color-bg-container)',
              borderRadius: '12px',
            }}>
              <QASection 
                isEditable={true} 
                taskId={task?.id}
                prompt={task?.prompt} 
                response={task?.response_summary}
              />
            </div>
          );
        case 2:
          return (
            <div className="scene-section">
              <SceneSection 
                isEditable={true} 
                taskId={task?.id}
                scenario={task?.scenario}
              />
            </div>
          );
        case 3:
          return (
            <div className="template-section">
              <TemplateSection 
                isEditable={true} 
                taskId={task?.id}
                steps={task?.templateData ? { templateData: task.templateData, ...task?.step } : task?.step}
              />
            </div>
          );
        case 4:
          return renderConfirmTest();
        case 5:
          return renderResultPage();
        default:
          return null;
      }
    }

    // 未开始任务时显示原有内容
    switch (activeSection) {
      case 'overview':
        return (
          <>
            {/* 积分说明区域 */}
            <div className="score-section" style={{
              background: 'var(--color-primary-bg)',
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
                  <CaretDownOutlined style={{ marginLeft: '4px', color: 'var(--color-text-tertiary)' }} /> :
                  <CaretRightOutlined style={{ marginLeft: '4px', color: 'var(--color-text-tertiary)' }} />
                }
              </div>
              {isScoreExpanded && (
                <div style={{ fontSize: '14px', color: 'var(--color-text-tertiary)' }}>
                  <div>根据此任务的配置，预计每次测试消耗XXX积分*。</div>
                  <div style={{ marginTop: '4px' }}>
                    <span>*根据配置参数动态计算，</span>
                    <a href="#" style={{ color: 'var(--color-primary)' }}>了解计算规则&gt;&gt;</a>
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
                <div style={{ width: '80px', color: 'var(--color-text-tertiary)' }}>任务名称</div>
                <div style={{ flex: 1 }}>{task?.title}</div>
              </div>
              <div className="info-row" style={{
                display: 'flex',
                marginBottom: '16px'
              }}>
                <div style={{ width: '80px', color: 'var(--color-text-tertiary)' }}>创建人</div>
                <div style={{ flex: 1, display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <Avatar size={24}>{task?.author?.name?.charAt(0)}</Avatar>
                  <span>{task?.author?.name}</span>
                </div>
              </div>
              <div className="info-row" style={{
                display: 'flex',
                marginBottom: '16px'
              }}>
                <div style={{ width: '80px', color: 'var(--color-text-tertiary)' }}>描述</div>
                <div style={{ flex: 1 }}>{task?.description}</div>
              </div>
              <div className="info-row" style={{
                display: 'flex',
                marginBottom: '16px'
              }}>
                <div style={{ width: '80px', color: 'var(--color-text-tertiary)' }}>关键词</div>
                <div style={{ flex: 1 }}>
                  {Array.isArray(task?.tags) && task?.tags.map((tag, index) => (
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
                  <CaretDownOutlined style={{ marginLeft: '4px', color: 'var(--color-text-tertiary)' }} /> :
                  <CaretRightOutlined style={{ marginLeft: '4px', color: 'var(--color-text-tertiary)' }} />
                }
              </div>

              {isAnnotationExpanded && (
                <div>
                  {loading ? (
                    <div style={{ padding: '20px 0', textAlign: 'center' }}>
                      <Spin size="small" />
                      <div style={{ marginTop: '8px', color: 'var(--color-text-tertiary)', fontSize: '12px' }}>
                        加载注释数据...
                      </div>
                    </div>
                  ) : (
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
                      locale={{ emptyText: '暂无注释数据' }}
                    />
                  )}
                </div>
              )}
            </div>
          </>
        );
      case 'qa':
        return (
          <div className="qa-section" style={{
            background: 'var(--color-bg-container)',
            borderRadius: '12px',
          }}>
            <QASection 
              isEditable={false} 
              taskId={task?.id}
              prompt={task?.prompt} 
              response={task?.response_summary}
            />
          </div>
        );
      case 'scene':
        return (
          <div className="scene-section">
            <SceneSection 
              isEditable={false} 
              taskId={task?.id}
              scenario={task?.scenario}
            />
          </div>
        );
      case 'template':
        return (
          <div className="template-section">
            <TemplateSection 
              isEditable={false} 
              taskId={task?.id}
              steps={task?.templateData ? { templateData: task.templateData, ...task?.step } : task?.step}
            />
          </div>
        );
      case 'result':
        return renderResultPage();
      default:
        return null;
    }
  };

  // 添加开始任务的处理函数
  const handleStartTask = () => {
    setIsTaskStarted(true);
    setCurrentStep(1);
    setActiveSection('qa');
  };

  // 修改步骤导航的渲染
  const steps = [
    { step: 1, label: '编辑QA' },
    { step: 2, label: '编辑场景' },
    { step: 3, label: '编辑模板' },
    { step: 4, label: '确认测试' },
    { step: 5, label: '提交结果' }
  ];

  // 添加按钮处理函数
  const handleBack = () => {
    setIsTaskStarted(false);
    setCurrentStep(0);
    setActiveSection('overview');
  };

  const handleSave = async () => {
    // TODO: 实现保存逻辑
    message.success('保存成功');
  };

  const handleSaveAndNext = async () => {
    try {
      // TODO: 实现保存逻辑
      await handleSave();
      // 切换到下一步
      const nextStep = currentStep + 1;
      setCurrentStep(nextStep);
      // 根据步骤切换页面
      switch (nextStep) {
        case 2:
          setActiveSection('scene');
          break;
        case 3:
          setActiveSection('template');
          break;
        case 4:
          setActiveSection('confirm');
          break;
        case 5:
          setActiveSection('result');
          break;
        default:
          break;
      }
    } catch (error) {
      message.error('保存失败');
    }
  };

  // 渲染确认测试页面
  const renderConfirmTest = () => {
    if (isTesting) {
      return (
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          height: '400px'
        }}>
          <Progress type="circle" percent={testProgress} />
          <div style={{ marginTop: '24px' }}>测试进行中，请稍候...</div>
        </div>
      );
    }

    return (
      <TestConfirmation
        isTesting={isTesting}
        testProgress={testProgress}
        task={task || {}}
        isTaskStarted={isTaskStarted}
        TimelineIcon={TimelineIcon}
        currentStep={4}
        onPrevious={handleBack}
        onStartTest={() => {
          setIsTesting(true);
          setTestProgress(0);
        }}
        QASection={QASection}
        SceneSection={SceneSection}
        TemplateSection={TemplateSection}
        annotationColumns={taskAnnotationData.columns}
        annotationData={taskAnnotationData.data}
      />
    );
  };

  // 处理全选/取消全选
  const handleSelectAll = (checked) => {
    const modelOptions = Object.keys(evaluationData || {});
    setSelectedModels(checked ? modelOptions : []);
  };

  // 切换模型面板展开/折叠
  const toggleModelPanel = (modelKey) => {
    setExpandedModel(expandedModel === modelKey ? false : modelKey);
  };

  // 获取模型颜色
  const getModelColor = (modelKey) => {
    switch (modelKey) {
      case 'claude3.5':
        return 'var(--color-success)';
      case 'claude3.6':
        return 'var(--color-primary)';
      case 'claude3.7':
        return 'var(--color-heavy)';
      case 'agent2': 
        return 'var(--color-assist-1)';
      case 'deepseek':
        return 'var(--color-heavy)';
      default:
        return 'var(--color-text-tertiary)';
    }
  };

  // 准备增强图表数据
  const getEnhancedChartData = (chartData) => {
    if (!chartData) {
      // 如果没有图表数据，提供默认数据
      const defaultChartData = {
        radar: [
          { name: "准确性", value: 85 },
          { name: "流畅性", value: 90 },
          { name: "创新性", value: 70 },
          { name: "可靠性", value: 80 },
          { name: "安全性", value: 95 }
        ],
        line: [
          { month: "1月", value: 65 },
          { month: "2月", value: 70 },
          { month: "3月", value: 75 },
          { month: "4月", value: 80 },
          { month: "5月", value: 85 },
          { month: "6月", value: 90 }
        ]
      };
      chartData = defaultChartData;
    }

    // 增强雷达图数据
    const enhancedRadar = (chartData.radar || []).map((item, index) => ({
      name: item.name,
      value: item.value,
      'claude3.5': Math.min(100, item.value * (1 + Math.sin(index) * 0.2)),
      'claude3.6': Math.min(100, item.value * (1 + Math.cos(index) * 0.15)),
      'claude3.7': Math.min(100, item.value * (1 + Math.sin(index + 0.5) * 0.1)),
      agent2: Math.min(100, item.value * (1 - Math.cos(index) * 0.15)),
      deepseek: Math.min(100, item.value * (1 + Math.sin(index + 1) * 0.2)),
    }));

    // 增强折线图数据
    const enhancedLine = (chartData.line || []).map((item, index) => ({
      month: item.month,
      value: item.value,
      'claude3.5': Math.min(100, item.value * (1 + Math.sin(index) * 0.1)),
      'claude3.6': Math.min(100, item.value * (1 + Math.cos(index) * 0.12)),
      'claude3.7': Math.min(100, item.value * (1 + Math.sin(index + 0.5) * 0.08)),
      agent2: Math.min(100, item.value * (1 - Math.cos(index) * 0.1)),
      deepseek: Math.min(100, item.value * (1 + Math.sin(index + 1) * 0.12)),
    }));

    return { radar: enhancedRadar, line: enhancedLine };
  };

  // 渲染结果页面
  const renderResultPage = () => {
    const modelOptions = Object.keys(evaluationData || {});
    const currentEvaluation = evaluationData?.[selectedModel] || evaluationData?.claude3;

    if (!task || !enhancedChartData || !currentEvaluation) {
      return (
        <div style={{ textAlign: 'center', padding: '40px 0' }}>
          <Spin size="large" />
          <div style={{ marginTop: '16px' }}>加载评估结果...</div>
        </div>
      );
    }

    return (
      <div className="evaluation-charts-wrapper" style={{ gap: "4px", marginTop: "4px" }}>
        {/* 左侧评估区域 */}
        <div className="evaluation-left-section" style={{ flex: "0 0 400px", gap: "4px" }}>
          <div className="evaluation-section" style={{ padding: "8px" }}>
            <div className="evaluation-header" style={{ marginBottom: "8px" }}>
              <div className="evaluation-title" style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                <span style={{ fontSize: "14px", fontWeight: "500" }}>评估结果</span>
                <Select
                  mode="multiple"
                  value={selectedModels || []}
                  onChange={handleModelChange}
                  className="model-selector"
                  maxTagCount={2}
                  maxTagTextLength={10}
                  style={{ minWidth: "270px", flex: 1 }}
                  dropdownRender={(menu) => (
                    <>
                      <div className="select-all-option" onClick={() => handleSelectAll(selectedModels?.length < modelOptions?.length)} style={{ padding: "4px 8px" }}>
                        <Checkbox checked={selectedModels?.length === modelOptions?.length}>
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
              {Array.isArray(selectedModels) && selectedModels.map(modelKey => {
                if (!evaluationData || !evaluationData[modelKey]) return null;
                return (
                <div className="model-panel" key={modelKey} style={{ marginBottom: "4px" }}>
                  <div className="model-panel-header" onClick={() => toggleModelPanel(modelKey)} style={{ padding: "8px" }}>
                    <div className="model-panel-left">
                      <Avatar size={32} className="model-avatar" style={{ background: getModelColor(modelKey) }}>
                          {evaluationData[modelKey]?.name?.charAt(0) || '?'}
                      </Avatar>
                      <div className="model-info">
                        <div className="model-name" style={{ fontSize: "14px" }}>
                            {evaluationData[modelKey]?.name || 'Unknown Model'}
                          <span className="model-usage" style={{ fontSize: "12px", marginLeft: "4px" }}>128k</span>
                        </div>
                        <div className="model-tags" style={{ gap: "4px" }}>
                            {Array.isArray(evaluationData[modelKey]?.tags) && evaluationData[modelKey]?.tags.map((tag, index) => (
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
                          <p className="evaluation-text" style={{ fontSize: "12px", margin: 0, lineHeight: "1.4" }}>{evaluationData[modelKey]?.description || '暂无描述'}</p>
                      </div>
                    </div>
                  )}
                </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* 右侧图表区域 */}
        <div className="evaluation-right-section" style={{ gap: "4px" }}>
          {/* 折线图区域 */}
          <div className="line-chart-section" style={{ padding: "8px" }}>
            <div className="chart-legend" style={{ marginBottom: "8px", gap: "8px" }}>
              {Array.isArray(selectedModels) && selectedModels.map(modelKey => (
                <div className="legend-item" key={modelKey} style={{ gap: "4px" }}>
                  <span className="legend-color" style={{ backgroundColor: getModelColor(modelKey), width: "10px", height: "10px" }}></span>
                  <span className="legend-label" style={{ fontSize: "12px" }}>{evaluationData?.[modelKey]?.name || modelKey}</span>
                </div>
              ))}
            </div>

            <div className="line-chart-container" style={{ height: "150px", marginTop: "4px" }}>
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart
                  data={enhancedChartData?.line || []}
                  margin={{ top: 2, right: 5, left: 0, bottom: 2 }}
                >
                  {/* 渐变定义 */}
                  <defs>
                    {Object.keys(evaluationData || {}).map(modelKey => (
                      <linearGradient key={modelKey} id={`color${modelKey}`} x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor={getModelColor(modelKey)} stopOpacity={0.2} />
                        <stop offset="95%" stopColor={getModelColor(modelKey)} stopOpacity={0} />
                      </linearGradient>
                    ))}
                  </defs>
                  <CartesianGrid
                    vertical={false}
                    horizontal={true}
                    stroke="var(--color-border-secondary)"
                  />
                  <XAxis
                    dataKey="month"
                    axisLine={false}
                    tickLine={false}
                    tick={{ fontSize: 10, fill: 'var(--color-text-tertiary)' }}
                  />
                  <YAxis
                    hide={true}
                    domain={[0, 'dataMax + 20']}
                  />
                  <RechartsTooltip
                    cursor={false}
                    contentStyle={{
                      background: 'var(--color-bg-container)',
                      border: 'none',
                      boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
                      borderRadius: '4px',
                      padding: '4px 8px'
                    }}
                  />
                  {Array.isArray(selectedModels) && selectedModels.map(modelKey => (
                    <Area
                      key={modelKey}
                      type="monotone"
                      dataKey={modelKey}
                      name={evaluationData?.[modelKey]?.name || modelKey}
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
            <div className="metrics-section" style={{ gap: "8px", minWidth: "70px" }}>
              <div className="metric-item" style={{ padding: "8px" }}>
                <div className="metric-label" style={{ fontSize: "12px", marginBottom: "4px" }}>综合得分</div>
                <div className="metric-value" style={{ fontSize: "20px" }}>{currentEvaluation?.score || 'N/A'}</div>
                <div className={`metric-change ${currentEvaluation?.scoreChange?.startsWith("+") ? "positive" : "negative"}`} style={{ fontSize: "12px" }}>
                  {currentEvaluation?.scoreChange || '0'}
                </div>
              </div>

              <div className="metric-item" style={{ padding: "8px" }}>
                <div className="metric-label" style={{ fontSize: "12px", marginBottom: "4px" }}>各维度得分</div>
                <div className="metric-value" style={{ fontSize: "20px" }}>{currentEvaluation?.credibility || 'N/A'}%</div>
                <div className={`metric-change ${currentEvaluation?.credibilityChange?.startsWith("+") ? "positive" : "negative"}`} style={{ fontSize: "12px" }}>
                  {currentEvaluation?.credibilityChange || '0'}
                </div>
              </div>
            </div>

            {/* 雷达图 */}
            <div className="radar-chart-content" style={{ height: "220px" }}>
              <ResponsiveContainer width="100%" height="100%">
                <RadarChart data={enhancedChartData?.radar || []}>
                  <PolarGrid stroke="var(--color-border-secondary)" />
                  <PolarAngleAxis dataKey="name" tick={{ fontSize: 10, fill: "var(--color-text-tertiary)" }} />
                  <PolarRadiusAxis domain={[0, 100]} tick={{ fontSize: 9, fill: "var(--color-text-tertiary)" }} axisLine={false} />
                  {Array.isArray(selectedModels) && selectedModels.map(modelKey => (
                    <Radar
                      key={modelKey}
                      name={evaluationData?.[modelKey]?.name || modelKey}
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
              <div className="history-time" style={{ fontSize: "12px" }}>{currentEvaluation?.updatedAt || '未知时间'}</div>
              <div className="history-author" style={{ fontSize: "12px" }}>
                by <span>{currentEvaluation?.updatedBy || '未知用户'}</span>
              </div>
              <div className="history-content" style={{ fontSize: "12px", lineHeight: "1.4", marginTop: "4px" }}>{currentEvaluation?.history || '暂无历史记录'}</div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  // 检查步骤是否有数据
  const hasStepData = (stepNumber) => {
    if (!task) return false;
    
    switch (stepNumber) {
      case 1: // QA步骤
        return Boolean(task.prompt || task.response_summary);
      case 2: // 场景步骤
        return Boolean(task.scenario);
      case 3: // 模板步骤
        return Boolean(task.templateData || (task.step && (typeof task.step === 'object' || Array.isArray(task.step))));
      case 4: // 确认测试步骤 - 前三个步骤有数据即可
        return hasStepData(1) && hasStepData(2) && hasStepData(3);
      case 5: // 结果步骤
        return Boolean(task.status === 'completed' || task.evaluations?.length > 0);
      default:
        return false;
    }
  };

  // 修改处理步骤点击的函数
  const handleStepClick = (stepNumber) => {
    // 只有在任务已经开始后才允许点击进行跳转
    if (!isTaskStarted) return;

    // 允许点击已完成的步骤、当前步骤，以及已有数据的后续步骤
    if (stepNumber <= currentStep || hasStepData(stepNumber)) {
      setCurrentStep(stepNumber);

      // 根据步骤设置activeSection
      switch (stepNumber) {
        case 1:
          setActiveSection('qa');
          break;
        case 2:
          setActiveSection('scene');
          break;
        case 3:
          setActiveSection('template');
          break;
        case 4:
          setActiveSection('confirm');
          break;
        case 5:
          setActiveSection('result');
          break;
        default:
          break;
      }
    }
  };

  // 添加完成任务的处理函数
  const handleCompleteTask = async () => {
    try {
      setLoading(true);
      // 更新任务状态为completed
      const updatedTaskData = {
        ...task,
        status: "completed"
      };
      
      // 调用taskService的更新任务方法
      await taskService.updateTask(id, updatedTaskData);
      
      // 更新本地状态
      setTask(updatedTaskData);
      
      // 显示成功消息
      message.success("任务已成功完成！");
      
      // 可选：导航回任务列表
      // navigate("/tasks");
    } catch (error) {
      console.error("完成任务失败:", error);
      message.error("完成任务失败，请重试");
    } finally {
      setLoading(false);
    }
  };
  
  // 添加提交结果的处理函数
  const handleSubmitResults = async () => {
    try {
      setLoading(true);
      
      // 生成本次测试结果的数据
      const testResultData = {
        taskId: id,
        createdAt: new Date().toISOString(),
        models: selectedModels.map(modelKey => {
          const model = evaluationData[modelKey] || {};
          return {
            name: model.name || modelKey,
            trustworthiness: parseInt(model.credibility) || 85,
            description: model.description || "模型评估描述",
            strengths: ["评估优势1", "评估优势2"],
            weaknesses: ["评估弱点1", "评估弱点2"]
          };
        }),
        optimizationHistory: [
          {
            id: Date.now(),
            description: `进行了最新一轮测试，使用了${selectedModels.length}个模型`,
            result: `平均置信度从${task.credibility || 85}%变为${enhancedChartData.radar?.[0]?.value || 88}%`
          }
        ]
      };
      
      // 如果有优化模式，调用优化结果提交方法
      if (isOptimizeMode) {
        // 创建优化数据
        const optimizationData = {
          sourceTaskId: id,
          title: `优化: ${task.title || ""}`,
          result: testResultData,
          models: selectedModels
        };
        
        await taskService.submitOptimizationResult(optimizationData);
      } else {
        // 直接更新任务数据中的测试结果
        const updatedTaskData = {
          ...task,
          evaluations: [...(task.evaluations || []), testResultData]
        };
        
        await taskService.updateTask(id, updatedTaskData);
        
        // 更新本地状态
        setTask(updatedTaskData);
      }
      
      // 显示成功消息
      message.success("测试结果已成功提交！");
      
      // 可选：导航到结果页面
      // setActiveSection('result');
    } catch (error) {
      console.error("提交测试结果失败:", error);
      message.error("提交测试结果失败，请重试");
    } finally {
      setLoading(false);
    }
  };

  // 添加生成报告的处理函数
  const handleGenerateReport = () => {
    message.info("报告生成功能正在开发中...");
  };

  // 渲染底部按钮
  const renderFooterButtons = () => {
    if (!isTaskStarted) {
      // 根据任务状态显示不同的按钮文本
      let buttonText = "开始任务";
      if (task.status === "running") {
        buttonText = "继续任务";
      } else if (task.status === "completed") {
        buttonText = "重新开始任务";
      }
      
      return (
        <Button
          type="primary"
          size="large"
          icon={<StartTaskIcon />}
          onClick={handleStartTask}
          className={styles.startTaskButton}
        >
          {buttonText}
        </Button>
      );
    }

    if (currentStep === 5) {
      return (
        <>
          <Button
            type="primary"
            size="large"
            onClick={handleCompleteTask}
            className={`${styles.primaryButton} ${styles.flexButton}`}
            icon={<CheckOutlined />}
          >
            完成任务
          </Button>
          <Button
            size="large"
            onClick={handleSubmitResults}
            className={styles.flexButton}
          >
            提交结果
          </Button>
          <Button
            size="large"
            onClick={handleGenerateReport}
            className={styles.flexButton}
          >
            生成报告
          </Button>
          <div className={styles.optimizeModeContainer} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span>优化模式</span>
            <Switch
              checked={isOptimizeMode}
              onChange={setIsOptimizeMode}
              size="small"
            />
          </div>
        </>
      );
    }

    if (currentStep === 4) {
      if (isTesting) {
        return null; // 测试进行中不显示按钮
      }
      return (
        <>
          <Button
            size="large"
            onClick={() => {
              setCurrentStep(3);
              setActiveSection('template');
            }}
            className={styles.flexButton}
          >
            上一步
          </Button>
          <Button
            type="primary"
            size="large"
            onClick={() => {
              setIsTesting(true);
              setTestProgress(0);
            }}
            className={`${styles.primaryButton} ${styles.flexButton2}`}
          >
            确认无误，开始测试
          </Button>
        </>
      );
    }

    return (
      <>
        <Button
          size="large"
          onClick={() => {
            if (currentStep === 1) {
              // 从QA页面返回到任务概览
              handleBack();
            } else {
              // 其他步骤的返回逻辑
              const prevStep = currentStep - 1;
              setCurrentStep(prevStep);
              switch (prevStep) {
                case 1:
                  setActiveSection('qa');
                  break;
                case 2:
                  setActiveSection('scene');
                  break;
                case 3:
                  setActiveSection('template');
                  break;
                default:
                  break;
              }
            }
          }}
          className={styles.flexButton}
        >
          {currentStep === 1 ? '返回' : '上一步'}
        </Button>
        <Button
          size="large"
          onClick={handleSave}
          className={styles.flexButton}
        >
          保存
        </Button>
        <Button
          type="primary"
          size="large"
          onClick={handleSaveAndNext}
          className={`${styles.primaryButton} ${styles.flexButton2}`}
        >
          保存并进入下一步
        </Button>
      </>
    );
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
      <div className={styles.hideTabsNav}>
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
        <h1 className="task-title">{task?.title}</h1>
        <div className="task-creator-section">
          <div className="task-creator-info">
            <Avatar size={24} className="creator-avatar">
              {task?.author?.name?.charAt(0)}
            </Avatar>
            <span className="creator-text">
              by <span className="creator-name">{task?.author?.name}</span> from{" "}
              <span className="creator-source">{task?.source}</span>
            </span>
          </div>
          <div className="task-tags">
            {Array.isArray(task?.tags) && task?.tags.map((tag, index) => (
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
      <div className={styles.taskDetailBottomSection}>
        {/* 步骤导航 */}
        <div className={styles.stepsNavigation}>
          {steps.map((item) => {
            // 判断步骤状态：当前步骤、已完成步骤、未完成步骤
            const isCurrentStep = currentStep === item.step;
            const isCompletedStep = currentStep > item.step;
            const hasData = hasStepData(item.step);
            // 步骤可点击条件：任务已开始 且 (是当前步骤 或 已完成步骤 或 已有数据的步骤)
            const isClickable = isTaskStarted && (isCurrentStep || isCompletedStep || hasData);

            return (
              <div key={item.step} className={`step ${isCurrentStep ? 'current-step' : ''} ${hasData ? 'has-data' : ''}`} style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: '4px',
                cursor: isClickable ? 'pointer' : 'default',
                opacity: isTaskStarted ? (isClickable ? 1 : 0.7) : (isCurrentStep ? 1 : 0.7)
              }}
                onClick={() => isClickable ? handleStepClick(item.step) : null}
              >
                <div className="step-icon" style={{
                  width: '20px',
                  height: '20px',
                  borderRadius: '50%',
                  border: `1px solid ${isCurrentStep ? 'var(--color-primary)' : isCompletedStep ? 'var(--color-primary)' : hasData ? 'var(--color-success)' : 'var(--color-text-tertiary)'}`,
                  background: isCurrentStep ? 'var(--color-primary)' : isCompletedStep ? 'var(--color-primary-bg)' : hasData ? 'var(--color-success-bg)' : '#fff',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '12px',
                  fontWeight: 700,
                  color: isCurrentStep ? '#fff' : isCompletedStep ? 'var(--color-primary)' : hasData ? 'var(--color-success)' : 'var(--color-text-tertiary)'
                }}>
                  {isCompletedStep ? <CheckOutlined style={{ fontSize: '12px' }} /> : item.step}
                </div>
                <div className="step-label" style={{
                  fontSize: '12px',
                  fontWeight: 700,
                  color: isCurrentStep ? 'var(--color-primary)' : isCompletedStep ? 'var(--color-primary)' : hasData ? 'var(--color-success)' : 'var(--color-text-tertiary)'
                }}>{item.label}</div>
              </div>
            );
          })}
        </div>

        {/* 主要内容区域 */}
        <div className={styles.mainContent}>
          {/* 左侧导航菜单 - 仅在未开始任务时显示 */}
          {!isTaskStarted && (
            <div className="left-menu" style={{
              width: '110px',
              padding: '16px 0px 16px 16px'
            }}>
              {/* 任务概览标题 */}
              <div style={{
                padding: '0 0 40px',
                fontSize: '14px',
                fontWeight: 600,
                color: 'var(--color-text-base)'
              }}>
                任务概览
              </div>

              <Timeline>
                {[
                  { key: 'overview', label: '概览' },
                  { key: 'qa', label: 'QA' },
                  { key: 'scene', label: '场景' },
                  { key: 'template', label: '模板' },
                  // 当任务状态为completed时才显示结果选项
                  ...(task.status === 'running' || task.status === 'completed' ? [{ key: 'result', label: '结果' }] : [])
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
                          background: activeSection === item.key ? 'var(--color-primary-bg)' : '#f9f9f9',
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
                    color={activeSection === item.key ? 'var(--color-primary)' : 'var(--color-text-tertiary)'}
                  >
                    <div
                      style={{
                        color: activeSection === item.key ? 'var(--color-primary)' : 'var(--color-text-tertiary)',
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
          )}

          {/* 右侧内容区域 */}
          <div className="right-content" style={{
            flex: 1,
          }}>
            {renderContent()}
          </div>
        </div>

        {/* 修改底部按钮区域 */}
        <div style={{
          margin: '16px auto',
          display: 'flex',
          gap: '12px',
          justifyContent: 'center'
        }}>
          {renderFooterButtons()}
        </div>
      </div>

      <style jsx global>{`
        .ant-timeline-item-head.ant-timeline-item-head-custom {
          background: var(--color-bg-container) !important;
          padding: 0;
          border: none;
        }
        
        /* 步骤导航样式 */
        .steps-navigation {
          position: relative;
          display: flex;
          justify-content: space-between;
          margin-bottom: 16px;
        }
        
        .step {
          transition: all 0.3s ease;
          position: relative;
          z-index: 1;
          padding: 8px 10px;
          margin: 0 2px;
          border-radius: 8px;
        }
        .step:hover {
          background-color: ${isTaskStarted ? 'var(--color-primary-bg)' : 'transparent'};
        }
        .step.has-data:hover {
          background-color: ${isTaskStarted ? 'var(--color-success-bg)' : 'transparent'};
        }
        .step-icon {
          transition: all 0.3s ease;
          position: relative;
          z-index: 2;
          box-shadow: 0 0 0 4px rgba(255, 255, 255, 0.9);
        }
        .step:hover .step-icon {
          transform: ${isTaskStarted ? 'scale(1.1)' : 'none'};
          box-shadow: 0 0 0 4px rgba(var(--color-primary-rgb), 0.3);
        }
        .step.has-data:hover .step-icon {
          transform: ${isTaskStarted ? 'scale(1.1)' : 'none'};
          box-shadow: 0 0 0 4px rgba(var(--color-success-rgb), 0.3);
        }
        .step-label {
          transition: all 0.3s ease;
          margin-top: 4px;
        }
        .step:hover .step-label {
          color: ${isTaskStarted ? 'var(--color-primary)' : ''};
        }
        .step.has-data:hover .step-label {
          color: ${isTaskStarted ? 'var(--color-success)' : ''};
        }
        
        .current-step .step-icon {
          animation: pulse 1.5s infinite;
        }
        .current-step.has-data .step-icon {
          animation: pulseSuccess 1.5s infinite;
        }
        
        @keyframes pulse {
          0% {
            box-shadow: 0 0 0 0 rgba(var(--color-primary-rgb), 0.4);
          }
          70% {
            box-shadow: 0 0 0 6px rgba(var(--color-primary-rgb), 0);
          }
          100% {
            box-shadow: 0 0 0 0 rgba(var(--color-primary-rgb), 0);
          }
        }
        
        @keyframes pulseSuccess {
          0% {
            box-shadow: 0 0 0 0 rgba(var(--color-success-rgb), 0.4);
          }
          70% {
            box-shadow: 0 0 0 6px rgba(var(--color-success-rgb), 0);
          }
          100% {
            box-shadow: 0 0 0 0 rgba(var(--color-success-rgb), 0);
          }
        }
        
        /* 评估结果页面样式 */
        .evaluation-charts-wrapper {
          display: flex;
          flex-wrap: wrap;
          gap: 8px;
        }
        .evaluation-left-section, .evaluation-right-section {
          padding: 8px;
          background: #fff;
          border-radius: 8px;
          box-shadow: 0 1px 2px rgba(0,0,0,0.03);
        }
        .evaluation-left-section {
          flex: 0 0 380px;
        }
        .evaluation-right-section {
          flex: 1;
          min-width: 300px;
          display: flex;
          flex-direction: column;
          gap: 8px;
        }
        .model-panel-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          cursor: pointer;
          padding: 8px;
          border-radius: 4px;
          transition: background-color 0.3s;
        }
        .model-panel-header:hover {
          background-color: var(--color-primary-bg);
        }
        .model-panel-left {
          display: flex;
          align-items: center;
          gap: 8px;
        }
        .model-info {
          flex: 1;
        }
        .model-tags {
          display: flex;
          flex-wrap: wrap;
          gap: 4px;
        }
        .model-tag {
          background: #f0f0f0;
          border-radius: 10px;
          padding: 0 6px;
        }
        .chart-legend {
          display: flex;
          flex-wrap: wrap;
        }
        .legend-item {
          display: flex;
          align-items: center;
          margin-right: 12px;
        }
        .legend-color {
          border-radius: 50%;
          margin-right: 4px;
        }
        .metrics-section {
          display: flex;
          flex-wrap: wrap;
        }
        .metric-item {
          background: #f9f9f9;
          border-radius: 4px;
          flex: 1;
          min-width: 120px;
        }
        .positive {
          color: var(--color-success);
        }
        .negative {
          color: var(--color-error);
        }
        .score-radar-section {
          display: flex;
          flex-wrap: wrap;
        }
        
        @media (max-width: 768px) {
          .evaluation-charts-wrapper {
            flex-direction: column;
          }
          .evaluation-left-section {
            flex: 0 0 auto;
            width: 100%;
          }
          .score-radar-section {
            flex-direction: column;
          }
        }
      `}</style>
    </div>
  )
}

export default TaskDetailPage
