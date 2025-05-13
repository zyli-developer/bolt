"use client"

import { useState, useEffect, useRef, useContext } from "react"
import { useParams, useNavigate, useLocation } from "react-router-dom"
import {  Button, Avatar, Tag, Spin, Select, Checkbox, Breadcrumb, Switch, Steps, message, Tooltip } from "antd"
import {
  ArrowLeftOutlined,
  StarOutlined,
  StarFilled,
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
import cardService from "../services/cardService"
import { useChatContext } from "../contexts/ChatContext"
import CreateTaskModal from "../components/modals/CreateTaskModal"
import TimelineIcon from "../components/icons/TimelineIcon"
import AnnotationModal from "../components/annotations/AnnotationModal"

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
import "../styles/overrides/evaluation.css"

// 导入右键菜单和讨论模态框组件
import TextContextMenu from "../components/context/TextContextMenu"
import DiscussModal from "../components/modals/DiscussModal"
import ShareModal from "../components/modals/ShareModal"
import { OptimizationContext } from "../contexts/OptimizationContext"

// 导入通用评论列表组件
import CommentsList from "../components/common/CommentsList";

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
      backgroundColor: "var(--color-bg-layout)", 
      border: "1px solid var(--color-border-secondary)", 
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
    color: "var(--color-text-base)"
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

// 自定义QASection包装组件
const CustomQASection = (props) => {
  // 使用React.forwardRef传递ref等
  return <QASection {...props} customTitleRender={(title) => (
    <div style={{ 
      fontSize: "16px", 
      fontWeight: "500", 
      margin: "0 0 8px 0", 
      color: "var(--color-text-base)" 
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
  
  // 添加关注和分享相关状态
  const [isFollowing, setIsFollowing] = useState(false)
  const [isShareModalVisible, setIsShareModalVisible] = useState(false)
  
  // 使用全局优化模式上下文
  const { 
    isOptimizationMode, setIsOptimizationMode,
    currentOptimizationStep, setCurrentOptimizationStep,
    currentStepComments: comments, setComments, addComment
  } = useContext(OptimizationContext);
  
  // 保留本地状态存储
  const [savedData, setSavedData] = useState({})
  const [isTesting, setIsTesting] = useState(false);
  const [testProgress, setTestProgress] = useState(0);
  const [isTaskStarted, setIsTaskStarted] = useState(false);
  
  // 添加右键菜单和讨论模态框相关状态
  const [contextMenu, setContextMenu] = useState(null);
  const [selectedText, setSelectedText] = useState('');
  const [discussModalVisible, setDiscussModalVisible] = useState(false);
  const [annotationModalVisible, setAnnotationModalVisible] = useState(false);
  const evaluationTextRef = useRef(null);

  // 添加注释展开状态
  const [expandedComment, setExpandedComment] = useState(null);
  
  // 添加连续选择相关状态
  const [isMultiSelectActive, setIsMultiSelectActive] = useState(false);
  const [selectedTexts, setSelectedTexts] = useState([]);
  const [selectionRanges, setSelectionRanges] = useState([]);
  
  // 临时多选模式（按Ctrl/Command键触发）
  const [isMultiSelectTempMode, setIsMultiSelectTempMode] = useState(false);
  
  // 添加用于模态框显示的文本状态
  const [selectedModalText, setSelectedModalText] = useState('');
  
  // 处理注释展开切换
  const handleCommentToggle = (id) => {
    setExpandedComment(expandedComment === id ? null : id);
  };

  // Determine if we came from explore or tasks
  const isFromExplore = location.pathname.includes("/explore") || location.state?.from === "explore"
  const parentPath = isFromExplore ? "/explore" : "/tasks"
  const parentLabel = isFromExplore ? "探索" : "任务"

  // 切换优化模式
  const toggleOptimizationMode = (checked) => {
    setIsOptimizationMode(checked);
    // 重置到第一步
    setCurrentOptimizationStep(0);
    
    // 关闭连续选择模式并清除高亮
    if (isMultiSelectActive) {
      setIsMultiSelectActive(false);
      clearAllHighlights();
    }
    
    // 设置body的类，以便全局样式生效
    if (checked) {
      document.body.classList.add('optimization-mode');
    } else {
      document.body.classList.remove('optimization-mode');
    }
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
    
    // 关闭连续选择模式并清除高亮
    if (isMultiSelectActive) {
      setIsMultiSelectActive(false);
      clearAllHighlights();
    }
    
    console.log("数据已保存", currentData);
  };

  // 保存并进入下一步
  const saveAndNext = () => {
    // 先保存当前数据
    saveCurrentData();
    
    // 关闭连续选择模式并清除高亮
    if (isMultiSelectActive) {
      setIsMultiSelectActive(false);
      clearAllHighlights();
    }
    
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
      
      // 关闭连续选择模式并清除高亮
      if (isMultiSelectActive) {
        setIsMultiSelectActive(false);
        clearAllHighlights();
      }
    }
    
    // 注意：不再需要在这里设置注释数据，因为现在使用全局上下文
    // 各组件会从OptimizationContext中读取并更新自己所需的数据
  };

  // 返回按钮处理函数
  const handleBack = () => {
    // 关闭连续选择模式并清除高亮
    if (isMultiSelectActive) {
      setIsMultiSelectActive(false);
      clearAllHighlights();
    }
    
    // 关闭优化模式
    setIsOptimizationMode(false);
  };

  // 上一步按钮处理函数
  const handlePrevStep = () => {
    if (currentOptimizationStep > 0) {
      saveCurrentData(); // 先保存当前步骤数据
      
      // 关闭连续选择模式并清除高亮
      if (isMultiSelectActive) {
        setIsMultiSelectActive(false);
        clearAllHighlights();
      }
      
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
        let cardData;
        
        // 检查ID格式，确定使用哪个API获取数据
        // 如果ID是数字格式（如"1001"），则使用getExplorationDetail
        // 否则使用getCardDetail
        if (/^\d+$/.test(id)) {
          // 获取探索详情
          const response = await cardService.getExplorationDetail(id);
          cardData = response.exploration || response;
        } else {
          // 获取普通卡片详情
          cardData = await cardService.getCardDetail(id);
        }
        
        // 获取模型评估数据
        const evaluationData = await taskService.getAllModelEvaluations();
        
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
    switch (modelKey) {
      case 'claude3.5':
        return 'var(--color-primary)';
      case 'claude3.6':
        return 'var(--color-assist-1)';
      case 'claude3.7':
        return 'var(--color-assist-2)';
      case 'agent2':
        return 'var(--color-assist-1)';
      case 'deepseek':
        return 'var(--color-heavy)';
      default:
        return 'var(--color-primary)';
    }
  };

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
          {attachments.map((file, index) => (
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
    // 关闭连续选择模式并清除高亮
    if (isMultiSelectActive) {
      setIsMultiSelectActive(false);
      clearAllHighlights();
    }
    
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
    // 关闭连续选择模式并清除高亮
    if (isMultiSelectActive) {
      setIsMultiSelectActive(false);
      clearAllHighlights();
    }
    
    // 模拟提交测试结果到服务器
    message.success('测试结果已成功提交');
    
    // 提交后，您可以选择重置优化模式或跳转到其他页面
    // 这里示例为重置到第一步
    setTimeout(() => {
      setCurrentOptimizationStep(0);
    }, 1500);
  };

  // 处理文本选择事件
  const handleTextSelection = (event) => {
    // 仅在优化模式下启用右键菜单
    if (!isOptimizationMode) return;
    
    // 获取选中的文本
    const selection = window.getSelection();
    const selectedText = selection.toString().trim();
    
    const isModifierKeyPressed = event.ctrlKey || event.metaKey; // 检测Ctrl/Command键
    
    // 如果有选中文本，显示右键菜单或进行连续选择
    if (selectedText) {
      // 创建选择的范围信息
      const range = selection.getRangeAt(0);
      const newSelectionRange = {
        range: range.cloneRange(),
        text: selectedText
      };
      
      // 检查此文本是否已被高亮，避免重复选择
      const hasHighlight = range.commonAncestorContainer.closest?.('.text-highlight-selection');
      if (hasHighlight) {
        // 如果已经是高亮元素，仅显示右键菜单，不进行其他处理
        event.preventDefault();
        setContextMenu({
          x: event.clientX,
          y: event.clientY
        });
        return;
      }
      
      // 连续选择模式处理
      if (isMultiSelectActive || isMultiSelectTempMode || isModifierKeyPressed) {
        event.preventDefault();
        
        // 检查文本是否已存在于选择列表中
        if (!selectedTexts.includes(selectedText)) {
          // 添加到已选择的文本列表
          setSelectedTexts(prev => [...prev, selectedText]);
          setSelectionRanges(prev => [...prev, newSelectionRange]);
          
          // 应用高亮样式，保持选中状态
          applyHighlightToSelection(range, selectedText);
        }
      } else {
        // 普通选择，清除之前的选择
        clearAllHighlights();
        setSelectedTexts([selectedText]);
        setSelectionRanges([newSelectionRange]);
        
        // 对第一次选中的文本也应用高亮
        applyHighlightToSelection(range, selectedText);
      }
      
      // 显示右键菜单
      event.preventDefault();
      setSelectedText(selectedText);
      setContextMenu({
        x: event.clientX,
        y: event.clientY
      });
    }
  };
  
  // 应用高亮样式到选中文本
  const applyHighlightToSelection = (range, text) => {
    if (!range) return;
    
    // 创建高亮元素
    const highlightEl = document.createElement('span');
    highlightEl.className = 'text-highlight-selection';
    highlightEl.textContent = text;
    
    // 清除原有内容，插入高亮元素
    range.deleteContents();
    range.insertNode(highlightEl);
  };
  
  // 清除所有高亮
  const clearAllHighlights = () => {
    // 清除所有高亮元素
    const highlights = document.querySelectorAll('.text-highlight-selection');
    highlights.forEach(el => {
      const parent = el.parentNode;
      if (parent) {
        // 将高亮元素替换为其文本内容
        const textNode = document.createTextNode(el.textContent);
        parent.replaceChild(textNode, el);
        parent.normalize(); // 合并相邻的文本节点
      }
    });
    
    // 重置选择状态
    setSelectedTexts([]);
    setSelectionRanges([]);
  };

  // 打开添加观点模态框前的处理
  const handleOpenAnnotationModal = () => {
    // 如果是连续选择模式，合并所有选中的文本
    // 确保不会重复添加最后选中的文本
    const textToShow = (isMultiSelectActive || isMultiSelectTempMode) && selectedTexts.length > 0
      ? Array.from(new Set(selectedTexts)).join('\n\n') // 使用Set去重
      : selectedText;
    
    // 设置要在模态框中显示的文本
    console.log('textToShow', textToShow);
    setSelectedModalText(textToShow);
    
    // 显示模态框
    setAnnotationModalVisible(true);
  };

  // 处理右键菜单项点击
  const handleContextMenuAction = (action) => {
    switch (action) {
      case 'discuss':
        // 如果处于连续选择模式，合并所有选中的文本
        if ((isMultiSelectActive || isMultiSelectTempMode) && selectedTexts.length > 0) {
          // 使用Set去重，确保不会重复添加最后选中的文本
          const combinedText = Array.from(new Set(selectedTexts)).join('\n\n');
          setSelectedText(combinedText);
        }
        setDiscussModalVisible(true);
        
        // 讨论后关闭连续选择模式
        setIsMultiSelectActive(false);
        break;
      case 'annotate':
        // 打开添加观点模态框
        handleOpenAnnotationModal();
        
        // 添加观点后关闭连续选择模式
        setIsMultiSelectActive(false);
        break;
      case 'select':
        // 切换连续选择模式
        setIsMultiSelectActive(!isMultiSelectActive);
        
        // 如果当前有选中的文本，且正在开启连续选择模式，保留当前选中的文本
        // 只有在关闭连续选择模式时才清除高亮
        if (isMultiSelectActive) {
          // 关闭连续选择模式时清除所有高亮
          clearAllHighlights();
        }
        // 如果是开启连续选择模式，且右键菜单是因为选中文本出现的，保留该文本高亮
        else if (selectedText) {
          // 当前选中文本已经加入了selectedTexts中，不需要额外操作
          // 关闭右键菜单后文本会保持高亮状态
        }
        break;
      default:
        break;
    }
  };

  // 全局点击事件，用于关闭右键菜单
  useEffect(() => {
    // 全局右键点击事件处理
    const handleGlobalContextMenu = (event) => {
      // 先检查是否在已高亮元素上右键
      const isHighlightedText = event.target.closest('.text-highlight-selection');
      
      if (isHighlightedText) {
        // 在已高亮文本上右键，显示右键菜单，但不再添加到已选择列表
        event.preventDefault();
        setContextMenu({
          x: event.clientX,
          y: event.clientY
        });
        return;
      }
      
      // 检查是否在可选择文本的元素上
      const isSelectableText = 
        event.target.closest('.evaluation-text') || 
        event.target.closest('.message-bubble') ||
        event.target.closest('.qa-section') ||
        event.target.closest('.scene-section') ||
        event.target.closest('.template-section');
      
      if (isSelectableText && isOptimizationMode) {
        handleTextSelection(event);
      } else {
        // 不是在已高亮的文本上右键，也不是在可选择的文本上右键，则关闭菜单
        setContextMenu(null);
      }
    };
    
    // 全局点击处理
    const handleGlobalClick = (e) => {
      // 点击其他区域关闭右键菜单，但不清除选择
      if (contextMenu) {
        setContextMenu(null);
      }
      
      // 检查是否点击了高亮元素
      const isClickOnHighlight = e.target.closest('.text-highlight-selection');
      if (isClickOnHighlight) {
        return; // 点击高亮文本时不清除高亮
      }
      
      // 如果不是连续选择模式，且不是临时多选模式，且不是按着Ctrl/Command键，点击其他区域时清除高亮
      if (!isMultiSelectActive && !isMultiSelectTempMode && !(e.ctrlKey || e.metaKey)) {
        clearAllHighlights();
      }
    };
    
    // 监听键盘事件，处理Ctrl/Command键
    const handleKeyDown = (e) => {
      if ((e.ctrlKey || e.metaKey) && !isMultiSelectActive) {
        // Ctrl/Command键按下，临时进入多选模式
        document.body.classList.add('multi-select-temp');
        
        // 如果用户按下了Ctrl/Command，启用临时多选模式功能
        setIsMultiSelectTempMode(true);
      }
    };
    
    const handleKeyUp = (e) => {
      if (!e.ctrlKey && !e.metaKey) {
        // Ctrl/Command键释放，如果不是永久多选模式，清除临时标记
        if (!isMultiSelectActive) {
          document.body.classList.remove('multi-select-temp');
          
          // 释放键时，关闭临时多选模式
          setIsMultiSelectTempMode(false);
        }
      }
    };
    
    // 添加事件监听
    document.addEventListener('click', handleGlobalClick);
    document.addEventListener('contextmenu', handleGlobalContextMenu);
    document.addEventListener('keydown', handleKeyDown);
    document.addEventListener('keyup', handleKeyUp);
    
    // 组件卸载时移除监听
    return () => {
      document.removeEventListener('click', handleGlobalClick);
      document.removeEventListener('contextmenu', handleGlobalContextMenu);
      document.removeEventListener('keydown', handleKeyDown);
      document.removeEventListener('keyup', handleKeyUp);
    };
  }, [contextMenu, isOptimizationMode, isMultiSelectActive, isMultiSelectTempMode, selectedTexts, clearAllHighlights]);

  // 组件卸载时清理body上的类
  useEffect(() => {
    return () => {
      document.body.classList.remove('optimization-mode');
      document.body.classList.remove('multi-select-temp');
    };
  }, []);

  // 处理添加注释的逻辑
  const handleSaveAnnotation = (data) => {
    try {
      // 如果是多选模式，使用合并的文本
      const textToSave = isMultiSelectActive || isMultiSelectTempMode ? selectedTexts.join('\n\n') : selectedText;
      
      if (!textToSave) {
        message.error('请选择文本');
        return;
      }

      const annotationData = {
        ...data,
        selectedText: textToSave,
        id: `comment-${Date.now()}`, // 生成唯一ID
        time: new Date().toISOString()
      };

      // 添加到全局上下文中
      addComment(annotationData);
      
      setAnnotationModalVisible(false);
      setContextMenu(null);
      
      // 清除高亮和选择
      if (isMultiSelectActive || isMultiSelectTempMode) {
        clearAllHighlights();
      }
      
      message.success('添加成功');
    } catch (error) {
      console.error('添加注释失败', error);
      message.error('添加失败');
    }
  };

  // 添加一个mouseup事件处理函数，用于处理在连续选择状态下无需右键也能自动高亮
  useEffect(() => {
    const handleAutoSelection = (event) => {
      // 只在连续选择模式下启用自动选择高亮
      if (!isMultiSelectActive) return;
      
      // 从window获取当前选区
      const selection = window.getSelection();
      const selectedText = selection.toString().trim();
      
      // 如果有选中文本
      if (selectedText) {
        // 创建选择的范围信息
        const range = selection.getRangeAt(0);
        
        // 检查此文本是否已被高亮，避免重复选择
        const hasHighlight = range.commonAncestorContainer.closest?.('.text-highlight-selection');
        if (hasHighlight) return; // 如果已经是高亮元素，不再处理
        
        // 检查该文本是否已经在选中列表中，避免重复添加
        if (selectedTexts.includes(selectedText)) return;
        
        // 添加到已选择的文本列表，使用Set避免重复
        setSelectedTexts(prev => [...new Set([...prev, selectedText])]);
        
        // 应用高亮样式，保持选中状态
        applyHighlightToSelection(range, selectedText);
      }
    };
    
    // 仅在连续选择模式下添加监听
    if (isMultiSelectActive) {
      document.addEventListener('mouseup', handleAutoSelection);
    }
    
    return () => {
      document.removeEventListener('mouseup', handleAutoSelection);
    };
  }, [isMultiSelectActive, selectedTexts]);

  // 处理关注切换
  const handleToggleFollow = () => {
    setIsFollowing(prev => !prev);
    message.success(isFollowing ? '已取消关注' : '已关注');
  };
  
  // 处理分享按钮点击
  const handleShare = () => {
    setIsShareModalVisible(true);
  };
  
  // 关闭分享模态框
  const handleCloseShareModal = () => {
    setIsShareModalVisible(false);
  };
  
  // 为ShareModal组件格式化当前选中的模型
  const getFormattedModels = () => {
    if (!evaluationData) return [];
    
    return selectedModels.map(modelKey => ({
      label: evaluationData[modelKey]?.name || modelKey,
      value: modelKey
    }));
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
    <div className={`card-detail-page ${isChatOpen ? "chat-open" : "chat-closed"} ${isMultiSelectActive ? 'multi-select-mode' : ''}`}>
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
              <Tag key={index} className="task-dimension-tag">
                {tag}
              </Tag>
            ))}
          </div>
          <div className="task-actions-top">
            <Button 
              icon={isFollowing ? <StarFilled /> : <StarOutlined />} 
              className={`follow-button ${isFollowing ? 'following' : ''}`}
              onClick={handleToggleFollow}
              size="small" 
              style={{ 
                height: "24px", 
                padding: "0 8px",
                transition: "all 0.3s",
                backgroundColor: isFollowing ? "var(--color-primary-bg)" : "transparent",
                borderColor: isFollowing ? "var(--color-primary-border)" : "var(--color-border-secondary)",
                color: isFollowing ? "var(--color-primary-text)" : "inherit"
              }}
            >
              {isFollowing ? '已关注' : '关注'}
            </Button>
            <Button 
              icon={<ShareAltOutlined />} 
              className="share-button" 
              onClick={handleShare}
              size="small" 
              style={{ height: "24px", padding: "0 8px" }}
            >
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
                                <div className={`model-panel-content ${isOptimizationMode ? 'optimization-mode' : ''}`} style={{ padding: "0 8px 8px" }}>
                                  <div className={`evaluation-content ${isOptimizationMode ? 'optimization-mode' : ''}`} style={{ padding: "8px" }}>
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
                    </div>
                  </div>
                  
                  {/* 右侧注释列表 - 始终显示 */}
                  <div className="comments-section" style={{ 
                    flex: 1, 
                    backgroundColor: 'var(--color-bg-container)',
                    borderRadius: '8px',
                    maxHeight: 'calc(100vh - 320px)',
                    overflow: 'hidden'
                  }}>
                    <CommentsList 
                      comments={comments} 
                      title="注释列表"
                      expandedId={expandedComment}
                      onToggleExpand={handleCommentToggle}
                    />
                  </div>
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
                    <div className={`model-panel-content ${isOptimizationMode ? 'optimization-mode' : ''}`} style={{ padding: "0 8px 8px" }}>
                      <div className={`evaluation-content ${isOptimizationMode ? 'optimization-mode' : ''}`} style={{ padding: "8px" }}>
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
                    backgroundColor: 'var(--color-primary)',
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
                    border: '1px solid var(--color-border-secondary)',
                    background: isOptimizationMode ? 'var(--color-primary-bg)' : 'var(--color-bg-container)',
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
                      backgroundColor: 'var(--color-primary)',
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
                      backgroundColor: 'var(--color-primary)',
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
                    border: '1px solid var(--color-border-secondary)',
                    background: isOptimizationMode ? 'var(--color-primary-bg)' : 'var(--color-bg-container)'
                  }}
                >
                  <SettingOutlined style={{ fontSize: '14px' }} />
                  <span>优化模式</span>
                  <Switch 
                    size="small" 
                    checked={isOptimizationMode}
                    onChange={toggleOptimizationMode}
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
            backgroundColor: 'var(--color-primary)',
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
                border: '1px solid var(--color-border-secondary)',
                background: isOptimizationMode ? 'var(--color-primary-bg)' : 'var(--color-bg-container)'
              }}
            >
              <SettingOutlined style={{ fontSize: '14px' }} />
              <span>优化模式</span>
              <Switch 
                size="small" 
                checked={isOptimizationMode}
                onChange={toggleOptimizationMode}
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
      
      {/* 右键菜单 */}
      {contextMenu && (
        <TextContextMenu
          x={contextMenu.x}
          y={contextMenu.y}
          onAction={handleContextMenuAction}
          onClose={() => setContextMenu(null)}
          isMultiSelectActive={isMultiSelectActive}
        />
      )}
      
      {/* 讨论模态框 */}
      <DiscussModal
        visible={discussModalVisible}
        onClose={() => {
          setDiscussModalVisible(false);
          // 关闭讨论窗口后，如果是连续选择模式，清除所有高亮
          if (isMultiSelectActive) {
            clearAllHighlights();
          }
        }}
        selectedText={(isMultiSelectActive || isMultiSelectTempMode) && selectedTexts.length > 0
          ? Array.from(new Set(selectedTexts)).join('\n\n') // 使用Set去重
          : selectedText}
      />

      {/* 添加观点模态框 */}
      <AnnotationModal
        visible={annotationModalVisible}
        onClose={() => {
          setAnnotationModalVisible(false);
          clearAllHighlights();
        }}
        onSave={handleSaveAnnotation}
        selectedText={selectedModalText}
        initialContent={selectedModalText}
      />
      
      {/* 分享模态框 */}
      <ShareModal
        visible={isShareModalVisible}
        onCancel={handleCloseShareModal}
        taskId={id}
        taskTitle={card?.title}
        availableModels={getFormattedModels()}
      />
    </div>
  )
}

export default CardDetailPage
