"use client"

import { useState, useEffect } from "react"
import { Button, Popover, message, Input, Modal, Table, Checkbox, Space, Progress } from "antd"
import { FilterOutlined, GroupOutlined, SearchOutlined, PlusOutlined, ImportOutlined, FileTextOutlined } from "@ant-design/icons"
import FilterCard from "./FilterCard"
import GroupCard from "./GroupCard"
import SortCard from "./SortCard"
import SortIcon from "../icons/SortIcon"
import { VIEW_TYPES } from "../../utils/viewManager"
import { addViewToMenu, getMenuData } from "../../utils/menuManager"
import { initialFilterState, normalizeFieldName } from "../../mocks/filterData"
import { useLocation, useNavigate } from "react-router-dom"
import { useRef } from "react"
import CreateTaskModal from "../modals/CreateTaskModal"
import ImportTaskModal from "../modals/ImportTaskModal"
import useStyles from "../../styles/components/filter/filter-system"
import "./filter-system.css"

/**
 * 筛选系统组件，处理API规范中的筛选、排序功能
 * @param {Object} props 
 * @param {Function} props.onFilterChange - 筛选变更回调
 * @param {Function} props.onSortChange - 排序变更回调
 * @param {Function} props.onViewChange - 视图变更回调
 * @param {Function} props.onImportSuccess - 导入成功回调
 * @param {Function} props.onGenerateReport - 生成报告回调
 * @param {Object} props.currentFilter - 当前筛选条件
 * @param {Object} props.currentSort - 当前排序条件 
 * @param {Object} props.currentView - 当前视图
 */
const FilterSystem = ({ onFilterChange, onSortChange, onViewChange, onImportSuccess, onGenerateReport, currentFilter, currentSort, currentView }) => {
  const { styles } = useStyles()
  // 状态管理
  const [state, setState] = useState({
    ...initialFilterState,
    activePopover: null, // 'filter', 'group', 'sort' 或 null
    searchValue: '', // 添加搜索值状态
  })
  const [loading, setLoading] = useState(false)
  const [isCreateTaskModalVisible, setIsCreateTaskModalVisible] = useState(false)
  const [isImportTaskModalVisible, setIsImportTaskModalVisible] = useState(false)
  const [isReportModalVisible, setIsReportModalVisible] = useState(false)
  const [reportTasks, setReportTasks] = useState([])
  const [selectedReportTasks, setSelectedReportTasks] = useState([])
  const location = useLocation()
  const navigate = useNavigate()
  const buttonContainerRef = useRef(null)
  // 添加报告生成进度状态
  const [reportProgress, setReportProgress] = useState(0)

  // 路由信息
  const isTaskPage = location.pathname === '/tasks'
  
  // 生成报告模态框状态
  const [reportModalVisible, setReportModalVisible] = useState(false)
  const [availableTasks, setAvailableTasks] = useState([])
  const [selectedTaskIds, setSelectedTaskIds] = useState([])
  const [reportModalLoading, setReportModalLoading] = useState(false)
  
  // 模拟获取可用于生成报告的任务
  useEffect(() => {
    if (reportModalVisible && isTaskPage) {
      // 模拟从API获取已完成的任务数据
      const mockCompletedTasks = [
        { id: '1', title: '分析用户反馈数据', status: 'completed', result: '已完成分析' },
        { id: '2', title: '生成月度销售报告', status: 'completed', result: '销售额增长15%' },
        { id: '3', title: '优化推荐算法', status: 'completed', result: '准确率提升8%' },
        { id: '4', title: '用户行为分析', status: 'completed', result: '用户留存率提升' },
        { id: '5', title: '数据可视化报告', status: 'completed', result: '生成了10张图表' },
      ];
      
      setAvailableTasks(mockCompletedTasks);
    }
  }, [reportModalVisible, isTaskPage]);
  
  // 报告模态框列配置
  const reportColumns = [
    {
      title: '选择',
      dataIndex: 'selection',
      render: (_, record) => (
        <Checkbox
          checked={selectedTaskIds.includes(record.id)}
          onChange={(e) => {
            if (e.target.checked) {
              setSelectedTaskIds([...selectedTaskIds, record.id]);
            } else {
              setSelectedTaskIds(selectedTaskIds.filter(id => id !== record.id));
            }
          }}
        />
      ),
    },
    {
      title: '任务ID',
      dataIndex: 'id',
    },
    {
      title: '任务名称',
      dataIndex: 'title',
    },
    {
      title: '任务状态',
      dataIndex: 'status',
      render: (status) => (
        <span style={{ color: status === 'completed' ? '#52c41a' : '#1890ff' }}>
          {status === 'completed' ? '已完成' : status}
        </span>
      ),
    },
    {
      title: '结果摘要',
      dataIndex: 'result',
    },
  ];
  
  // 初始化时输出调试信息
  useEffect(() => {
    console.log("FilterSystem组件初始化:");
    console.log("- currentFilter:", currentFilter);
    console.log("- currentSort:", currentSort);
    console.log("- 组件初始状态:", state);
  }, []);

  // 初始化时，如果有外部传入的筛选或排序条件，更新状态
  useEffect(() => {
    if (currentFilter) {
      console.log("FilterSystem收到currentFilter更新:", currentFilter);
      
      try {
        // 处理不同格式的筛选条件
        let processedFilter = currentFilter;
        
        // 如果是数组格式，需要处理成标准格式
        if (Array.isArray(currentFilter)) {
          const mergedExprs = [];
          currentFilter.forEach(filter => {
            if (filter.exprs && Array.isArray(filter.exprs)) {
              mergedExprs.push(...filter.exprs);
            }
          });
          
          if (mergedExprs.length > 0) {
            processedFilter = { exprs: mergedExprs };
          }
        }
        
        // 转换为UI条件并更新状态
        const uiConditions = convertApiFilterToUiFilter(processedFilter);
        
        console.log("转换后的UI筛选条件:", uiConditions);
        
        setState(prev => ({
          ...prev,
          filterConfig: {
            ...prev.filterConfig,
            conditions: uiConditions
          }
        }));
      } catch (error) {
        console.error("处理筛选条件出错:", error);
      }
    } else if (currentFilter === null) {
      // 如果currentFilter为null，清空筛选条件
      console.log("FilterSystem收到清空筛选条件请求");
      setState(prev => ({
        ...prev,
        filterConfig: {
          ...prev.filterConfig,
          conditions: []
        }
      }));
    }
  }, [currentFilter]);

  useEffect(() => {
    if (currentSort) {
      setState(prev => ({
        ...prev,
        sortConfig: {
          ...prev.sortConfig,
          fields: [{
            id: 'sort1',
            field: currentSort.field,
            direction: currentSort.desc ? 'desc' : 'asc'
          }]
        }
      }));
    } else if (currentSort === null) {
      // 如果currentSort为null，清空排序条件
      setState(prev => ({
        ...prev,
        sortConfig: {
          ...prev.sortConfig,
          fields: []
        }
      }));
    }
  }, [currentSort]);

  // 将API筛选条件转换为UI筛选条件
  const convertApiFilterToUiFilter = (apiFilter) => {
    if (!apiFilter || !apiFilter.exprs) {
      console.log("转换API筛选条件失败: 无效的条件格式", apiFilter);
      return [];
    }
    
    console.log("转换API筛选条件为UI筛选条件:", apiFilter);
    
    // 将API筛选表达式转换为UI筛选条件
    return apiFilter.exprs.map((expr, index) => {
      // 标准化字段名称
      const normalizedField = normalizeFieldName(expr.field);
      
      // 确定UI操作符
      let operator;
      switch(expr.op) {
        case "EQ": operator = "等于"; break;
        case "NEQ": operator = "不等于"; break;
        case "GT": operator = "大于"; break;
        case "GTE": operator = "大于等于"; break;
        case "LT": operator = "小于"; break;
        case "LTE": operator = "小于等于"; break;
        case "LIKE": operator = "包含"; break;
        case "NOT_IN": operator = "不包含"; break;
        case "RANGE": operator = "在范围内"; break;
        default: operator = "等于";
      }

      // 确保values是数组且有值
      const values = Array.isArray(expr.values) ? expr.values : 
                    (expr.values ? [expr.values] : []);
      
      console.log(`筛选条件 ${index + 1}: 原字段=${expr.field}, 标准化字段=${normalizedField}, 操作符=${operator}, 值=`, values);
      
      // 返回UI格式的筛选条件，同时包含value和values属性
      return {
        id: `filter${index + 1}`,
        field: normalizedField,
        operator,
        value: values.length === 1 ? values[0] : values,  // 保留value属性以兼容旧代码
        values: values  // 同时设置values属性
      };
    });
  };

  // 将UI筛选条件转换为API筛选条件
  const convertUiFilterToApiFilter = (uiFilter) => {
    if (!uiFilter || uiFilter.length === 0) return null;
    
    // 创建API规范的FilterList结构
    const filterList = {
      exprs: []
    };

    // 将UI筛选条件转换为API筛选表达式
    uiFilter.forEach(condition => {
      // 确定操作符类型
      let op;
      switch(condition.operator) {
        case "等于": op = "EQ"; break;
        case "不等于": op = "NEQ"; break;
        case "大于": op = "GT"; break;
        case "大于等于": op = "GTE"; break;
        case "小于": op = "LT"; break;
        case "小于等于": op = "LTE"; break;
        case "包含": op = "LIKE"; break;
        case "不包含": op = "NOT_IN"; break;
        case "在范围内": op = "RANGE"; break;
        default: op = "EQ";
      }

      // 标准化字段名称
      const fieldName = normalizeFieldName(condition.field);
      
      // 确保有值
      const values = condition.values || [];
      if (values.length === 0) return; // 跳过没有值的条件
      
      // 创建筛选表达式并添加到列表
      filterList.exprs.push({
        field: fieldName,
        op,
        values: values
      });
    });

    return filterList.exprs.length > 0 ? filterList : null;
  };

  // 显示指定的弹窗
  const showPopover = (popoverType) => {
    setState((prevState) => ({
      ...prevState,
      step: popoverType, // 设置当前步骤为弹窗类型
      activePopover: popoverType, // 设置活动弹窗
    }))
  }

  // 关闭弹窗
  const closePopover = () => {
    setState((prevState) => ({
      ...prevState,
      activePopover: null,
    }))
  }

  // 步骤控制
  const handleStepChange = (direction) => {
    setState((prevState) => {
      const currentStep = prevState.step
      let nextStep = currentStep

      if (direction === "next") {
        if (currentStep === "filter") nextStep = "group"
        else if (currentStep === "group") nextStep = "sort"
      } else if (direction === "prev") {
        if (currentStep === "group") nextStep = "filter"
        else if (currentStep === "sort") nextStep = "group"
      }

      return {
        ...prevState,
        step: nextStep,
        activePopover: nextStep, // 更新活动弹窗
      }
    })
  }

  // 更新筛选配置
  const updateFilterConfig = (config) => {
    setState((prevState) => ({
      ...prevState,
      filterConfig: config,
    }))

    // 将UI筛选配置转换为API筛选格式，并调用父组件回调
    if (onFilterChange) {
      const apiFilter = convertUiFilterToApiFilter(config.conditions);
      onFilterChange(apiFilter);
    }
  }

  // 更新分组配置
  const updateGroupConfig = (config) => {
    setState((prevState) => ({
      ...prevState,
      groupConfig: config,
    }))
  }

  // 更新排序配置
  const updateSortConfig = (config) => {
    setState((prevState) => ({
      ...prevState,
      sortConfig: config,
    }))

    // 将UI排序配置转换为API排序格式，并调用父组件回调
    if (onSortChange && config.fields.length > 0) {
      const sortField = config.fields[0];
      const apiSort = {
        field: sortField.field,
        desc: sortField.direction === 'desc'
      };
      onSortChange(apiSort);
    } else if (onSortChange) {
      // 如果没有排序字段，传递默认排序（按创建时间降序）
      onSortChange({ field: "created_at", desc: true });
    }
  }

  // 处理搜索值变化
  const handleSearchChange = (e) => {
    setState((prevState) => ({
      ...prevState,
      searchValue: e.target.value,
    }))
  }

  // 处理搜索提交
  const handleSearch = (value) => {
    const searchText = value || state.searchValue;
    
    // 如果有搜索文本，创建一个"包含"筛选条件
    if (searchText && onFilterChange) {
      const searchFilter = {
        exprs: [{
          field: "keyword", // 使用关键词字段进行搜索
          op: "LIKE",
          values: [searchText]
        }]
      };
      onFilterChange(searchFilter);
    }
    
    console.log('搜索:', searchText);
  }

  // 显示创建任务模态框
  const showCreateTaskModal = () => {
    setIsCreateTaskModalVisible(true)
  }

  // 隐藏创建任务模态框
  const handleModalCancel = () => {
    setIsCreateTaskModalVisible(false)
  }

  // 显示导入任务模态框
  const showImportTaskModal = () => {
    setIsImportTaskModalVisible(true)
  }
  
  // 隐藏导入任务模态框
  const handleImportModalCancel = () => {
    setIsImportTaskModalVisible(false)
  }
  
  // 导入任务成功后的回调
  const handleImportSuccess = () => {
    // 如果父组件提供了onImportSuccess回调，则使用父组件的回调
    if (onImportSuccess) {
      onImportSuccess();
    } 
    // 否则使用旧的方式，通过onFilterChange触发数据刷新
    else if (onFilterChange) {
      onFilterChange(null) // 清空筛选条件，重新加载全部数据
    }
  }

  // 获取当前视图类型
  const getViewType = () => {
    return isTaskPage ? VIEW_TYPES.TASK : VIEW_TYPES.EXPLORATION;
  }

  // 刷新当前页面的菜单数据，而不刷新整个页面
  const refreshMenuData = () => {
    // 获取当前路径
    const currentPath = location.pathname;
    
    // 重新导航到当前路径，并传递特殊标志以保留当前筛选条件
    navigate(currentPath, {
      state: {
        refreshMenu: true,
        preserveFilters: true,
        filterParams: currentFilter,
        sortParams: currentSort
      },
      replace: true // 替换当前历史记录，不创建新的历史记录
    });
  };
  
  // 修改保存视图配置的处理函数
  const handleSave = async () => {
    try {
      setLoading(true)
      const { filterConfig, groupConfig, sortConfig } = state

      // 将UI配置转换为API格式
      const apiFilter = convertUiFilterToApiFilter(filterConfig.conditions);
      
      // 构建排序参数
      let apiSort = null;
      if (sortConfig.fields.length > 0) {
        const sortField = sortConfig.fields[0];
        apiSort = {
          field: sortField.field,
          desc: sortField.direction === 'desc'
        };
      }

      // 调用父组件的回调函数
      if (onFilterChange) {
        onFilterChange(apiFilter);
      }
      
      if (onSortChange) {
        onSortChange(apiSort || { field: "created_at", desc: true });
      }
      
      // 将视图保存到菜单
      const viewType = isTaskPage ? 'task' : 'exploration';
      const viewData = {
        filterParams: apiFilter,
        sortParams: apiSort
      };
      
      const result = addViewToMenu(viewType, viewData);
      
      message.success(`视图已保存为"${result.menuItem.title}"`);
      closePopover();
      
      // 刷新菜单，不刷新整个页面
      refreshMenuData();
    } catch (error) {
      console.error("保存视图失败:", error)
      message.error(error.message || "保存视图配置失败，请重试")
    } finally {
      setLoading(false)
    }
  }

  // 获取筛选条件数量
  const getFilterCount = () => {
    return state.filterConfig.conditions.length
  }

  // 获取分组条件数量
  const getGroupCount = () => {
    return state.groupConfig.fields.length
  }

  // 获取排序条件数量
  const getSortCount = () => {
    return state.sortConfig.fields.length
  }

  // 筛选卡片内容
  const filterCardContent = (
    <div className="filter-card">
      <FilterCard
        config={state.filterConfig}
        onConfigChange={updateFilterConfig}
        onNext={() => handleStepChange("next")}
      />
    </div>
  )

  // 分组卡片内容
  const groupCardContent = (
    <div className="filter-card">
      <GroupCard
        config={state.groupConfig}
        onConfigChange={updateGroupConfig}
        onPrev={() => handleStepChange("prev")}
        onNext={() => handleStepChange("next")}
      />
    </div>
  )

  // 排序卡片内容
  const sortCardContent = (
    <div className="filter-card">
      <SortCard
        config={state.sortConfig}
        onConfigChange={updateSortConfig}
        onPrev={() => handleStepChange("prev")}
        onSave={handleSave}
        loading={loading}
      />
    </div>
  )

  // 显示生成报告模态框
  const showReportModal = () => {
    setReportModalVisible(true);
  };
  
  // 处理生成报告
  const handleGenerateReport = () => {
    // 如果没有选择任务，创建一个演示报告
    const isDemo = selectedTaskIds.length === 0;
    
    if (isDemo) {
      console.log('没有选择任务，将创建演示报告');
      // 继续执行，但会创建一个演示报告
    } else {
      console.log('已选择 ', selectedTaskIds.length, ' 个任务生成报告');
    }
    
    setReportModalLoading(true);
    setReportProgress(0);
    
    // 创建进度更新间隔
    const progressInterval = setInterval(() => {
      setReportProgress(prev => {
        // 确保进度不超过99%（最后一步在完成时设为100%）
        const newProgress = prev + 10;
        return newProgress >= 99 ? 99 : newProgress;
      });
    }, 1000);
    
    // 添加10秒延迟，模拟报告生成过程
    setTimeout(() => {
      clearInterval(progressInterval);
      setReportProgress(100);
      
      try {
        // 直接在FilterSystem组件中生成报告
        console.log('直接在FilterSystem中生成报告，选中的任务ID:', selectedTaskIds);
        
        // 存储生成的报告
        let generatedReports = [];
        
        if (isDemo) {
          // 创建演示报告
          const demoReportId = `report-demo-${Date.now()}`;
          const timestamp = new Date().toISOString();
          generatedReports = [
            {
              id: demoReportId,
              taskId: 'demo-123',
              name: '演示报告 - 系统性能分析',
              title: '演示报告 - 系统性能分析',
              type: 'report',
              content: '这是一个演示报告，用于展示报告功能。实际报告将包含更详细的分析数据和评估结果。',
              created_at: timestamp,
              createdAt: timestamp,
              created_by: '系统',
              created_from: '演示数据',
              response_summary: '系统性能分析表明，当前配置下性能表现良好，响应时间在可接受范围内。',
              summary: '系统性能分析表明，当前配置下性能表现良好，响应时间在可接受范围内。',
              keywords: ['演示', '系统性能', '分析报告'],
              dimensions: ['性能', '响应时间', '资源利用率'],
              chartData: {
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
              },
              sourceTask: {
                id: 'demo-123',
                title: '系统性能分析',
                status: 'completed',
                result: '性能良好'
              }
            }
          ];
        } else {
          // 为每个选中的任务生成报告
          generatedReports = selectedTaskIds.map(taskId => {
            // 查找任务数据
            const taskData = availableTasks.find(task => task.id === taskId);
            if (!taskData) {
              console.warn(`找不到任务数据: ${taskId}`);
              return null;
            }
            
            const reportId = `report-${Date.now()}-${taskId}`;
            const timestamp = new Date().toISOString();
            const reportTitle = `${taskData.title} - 分析报告`;
            
            // 创建报告对象
            return {
              id: reportId,
              taskId: taskId,
              name: reportTitle,
              title: reportTitle,
              type: 'report',
              content: `这是任务 "${taskData.title}" 的分析报告，评估结果: ${taskData.result}`,
              created_at: timestamp,
              createdAt: timestamp,
              created_by: '系统',
              created_from: '任务分析',
              response_summary: `${taskData.title}分析报告显示，${taskData.result}`,
              summary: `${taskData.title}分析报告显示，${taskData.result}`,
              keywords: ['任务分析', taskData.title, '报告'],
              dimensions: ['评估', '分析', '性能'],
              chartData: {
                radar: [
                  { name: "准确性", value: 85 + Math.floor(Math.random() * 10) },
                  { name: "流畅性", value: 90 - Math.floor(Math.random() * 10) },
                  { name: "创新性", value: 70 + Math.floor(Math.random() * 15) },
                  { name: "可靠性", value: 80 + Math.floor(Math.random() * 10) },
                  { name: "安全性", value: 95 - Math.floor(Math.random() * 5) }
                ],
                line: [
                  { month: "1月", value: 65 + Math.floor(Math.random() * 10) },
                  { month: "2月", value: 70 + Math.floor(Math.random() * 10) },
                  { month: "3月", value: 75 + Math.floor(Math.random() * 10) },
                  { month: "4月", value: 80 + Math.floor(Math.random() * 10) },
                  { month: "5月", value: 85 + Math.floor(Math.random() * 10) },
                  { month: "6月", value: 90 + Math.floor(Math.random() * 5) }
                ]
              },
              sourceTask: taskData
            };
          }).filter(report => report !== null); // 过滤掉null值
        }
        
        // 保存报告数据到localStorage
        const existingReportsJson = localStorage.getItem('task_reports') || '[]';
        const existingReports = JSON.parse(existingReportsJson);
        
        // 添加新生成的报告
        const updatedReports = [...existingReports, ...generatedReports];
        
        // 保存回localStorage
        localStorage.setItem('task_reports', JSON.stringify(updatedReports));
        console.log(`已生成 ${generatedReports.length} 份报告并保存，报告详情:`, generatedReports);
        
        // 触发自定义事件，通知所有相关组件刷新报告数据
        const reportEvent = new CustomEvent('reportsUpdated', {
          detail: { timestamp: Date.now(), reports: generatedReports }
        });
        window.dispatchEvent(reportEvent);
        
        // 更新localStorage中的一个特殊标记，以触发Storage事件
        localStorage.setItem('reports_last_updated', Date.now().toString());
        
        // 强制确保跨页面通信 - 轮询更新localstorage以触发storage事件
        let updateCount = 0;
        const forceUpdateInterval = setInterval(() => {
          localStorage.setItem('reports_force_update', `${Date.now()}_${updateCount}`);
          updateCount++;
          if (updateCount >= 5) {
            clearInterval(forceUpdateInterval);
          }
        }, 500); // 每500ms更新一次，连续更新5次
        
        // 也调用父组件传入的回调（如果有）
        if (onGenerateReport) {
          onGenerateReport(isDemo ? [] : selectedTaskIds);
        }
        
        // 延迟关闭模态框
        setTimeout(() => {
          setReportModalLoading(false);
          setReportModalVisible(false);
          setSelectedTaskIds([]);
          setReportProgress(0);
          message.success(`已成功生成 ${generatedReports.length} 份报告，可在资产页查看`);
        }, 500);
      } catch (error) {
        console.error('生成报告失败:', error);
        setReportModalLoading(false);
        setReportProgress(0);
        message.error('生成报告失败: ' + error.message);
      }
    }, 10000); // 延迟10秒
  };
  
  // 全选/取消全选
  const handleSelectAllTasks = (e) => {
    if (e.target.checked) {
      setSelectedTaskIds(availableTasks.map(task => task.id));
    } else {
      setSelectedTaskIds([]);
    }
  };

  return (
    <div className={styles.filterSystemContainer}>
      <div className={styles.toolbarLeft}>
        <Popover
          content={filterCardContent}
          visible={state.activePopover === "filter"}
          onVisibleChange={(visible) => {
            if (visible) showPopover("filter")
            else if (state.activePopover === "filter") closePopover()
          }}
          trigger="click"
          placement="bottomLeft"
          overlayClassName="filter-popover"
          destroyTooltipOnHide
        >
          <Button 
            icon={<FilterOutlined />} 
            className={styles.filterButton} 
            onClick={() => showPopover("filter")}
          >
            Filter <span className="filter-count">{getFilterCount()}</span>
          </Button>
        </Popover>
        
        <Popover
          content={groupCardContent}
          visible={state.activePopover === "group"}
          onVisibleChange={(visible) => {
            if (visible) showPopover("group")
            else if (state.activePopover === "group") closePopover()
          }}
          trigger="click"
          placement="bottomLeft"
          overlayClassName="filter-popover"
          destroyTooltipOnHide
        >
          <Button 
            icon={<GroupOutlined />} 
            className={styles.groupButton} 
            onClick={() => showPopover("group")}
          >
            Group <span className="group-count">{getGroupCount()}</span>
          </Button>
        </Popover>
        
        <Popover
          content={sortCardContent}
          visible={state.activePopover === "sort"}
          onVisibleChange={(visible) => {
            if (visible) showPopover("sort")
            else if (state.activePopover === "sort") closePopover()
          }}
          trigger="click"
          placement="bottomLeft"
          overlayClassName="filter-popover"
          destroyTooltipOnHide
        >
          <Button 
            icon={<SortIcon />} 
            className={styles.sortButton} 
            onClick={() => showPopover("sort")}
          >
            Sort {getSortCount() > 0 && <span className="filter-count">{getSortCount()}</span>}
          </Button>
        </Popover>
      </div>
      
      <div className={styles.toolbarRight} ref={buttonContainerRef}>
        <Input
          placeholder="搜索感兴趣的任务"
          suffix={<SearchOutlined style={{ color: '#8c8c8c', fontSize: '16px' }} onClick={() => handleSearch()} />}
          value={state.searchValue}
          onChange={handleSearchChange}
          onPressEnter={() => handleSearch()}
          className={styles.searchInput}
          allowClear={false}
        />
        
        {isTaskPage && (
          <>
            {/* 添加生成报告按钮 */}
            <Button 
              className={styles.generateReportButton}
              type="default" 
              icon={<FileTextOutlined />} 
              onClick={showReportModal}
            >
              生成报告
            </Button>
            
            <Button 
              className={styles.importTaskButton}
              type="default" 
              icon={<ImportOutlined />} 
              onClick={showImportTaskModal}
            >
              导入数据
            </Button>
            
            <Button 
              className={styles.createTaskButton}
              type="primary" 
              icon={<PlusOutlined />} 
              onClick={showCreateTaskModal}
            >
              新建任务
            </Button>
          </>
        )}
      </div>
      
      {/* 创建任务模态框 */}
      <CreateTaskModal
        visible={isCreateTaskModalVisible}
        onCancel={handleModalCancel}
      />
      
      {/* 导入任务模态框 */}
      <ImportTaskModal
        visible={isImportTaskModalVisible}
        onCancel={handleImportModalCancel}
        onImport={handleImportSuccess}
      />
      
      {/* 生成报告模态框 */}
      <Modal
        title="生成报告"
        open={reportModalVisible}
        onCancel={() => {
          if (!reportModalLoading) {
            setReportModalVisible(false);
            setSelectedTaskIds([]);
            setReportProgress(0);
          }
        }}
        footer={[
          <Button 
            key="cancel" 
            onClick={() => {
              if (!reportModalLoading) {
                setReportModalVisible(false);
                setSelectedTaskIds([]);
                setReportProgress(0);
              }
            }}
            disabled={reportModalLoading}
          >
            取消
          </Button>,
          <Button 
            key="submit" 
            type="primary" 
            loading={reportModalLoading}
            onClick={handleGenerateReport}
            disabled={reportModalLoading}
          >
            {reportModalLoading ? `生成中(${reportProgress}%)` : (selectedTaskIds.length === 0 ? '生成演示报告' : '生成报告')}
          </Button>,
        ]}
        width={800}
      >
        {reportModalLoading && (
          <div style={{ marginBottom: 16 }}>
            <Progress percent={reportProgress} status="active" />
            <p style={{ textAlign: 'center', marginTop: 8 }}>
              正在生成报告，请稍候...
            </p>
          </div>
        )}
        
        {!reportModalLoading && (
          <>
            <div style={{ marginBottom: 16 }}>
              <Space>
                <Checkbox 
                  onChange={handleSelectAllTasks}
                  checked={selectedTaskIds.length === availableTasks.length && availableTasks.length > 0}
                  indeterminate={selectedTaskIds.length > 0 && selectedTaskIds.length < availableTasks.length}
                >
                  全选
                </Checkbox>
                <span>已选择 {selectedTaskIds.length} 个任务</span>
              </Space>
            </div>
            <div className="report-modal-table">
              <Table 
                columns={reportColumns} 
                dataSource={availableTasks}
                rowKey="id"
                pagination={false}
                size="small"
              />
            </div>
            <div style={{ marginTop: 16 }}>
              <p>说明：选择已完成的任务生成报告，报告将展示在资产页面中</p>
            </div>
          </>
        )}
      </Modal>
    </div>
  )
}

export default FilterSystem
