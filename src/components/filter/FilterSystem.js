"use client"

import { useState, useEffect } from "react"
import { Button, Popover, message, Input } from "antd"
import { FilterOutlined, GroupOutlined, SearchOutlined, PlusOutlined, ImportOutlined } from "@ant-design/icons"
import FilterCard from "./FilterCard"
import GroupCard from "./GroupCard"
import SortCard from "./SortCard"
import SortIcon from "../icons/SortIcon"
import filterService from "../../services/filterService"
import { initialFilterState } from "../../mocks/filterData"
import { useLocation } from "react-router-dom"
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
 * @param {Object} props.currentFilter - 当前筛选条件
 * @param {Object} props.currentSort - 当前排序条件 
 * @param {Function} props.onImportSuccess - 导入成功回调
 */
const FilterSystem = ({ onFilterChange, onSortChange, currentFilter, currentSort, onImportSuccess }) => {
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
  const location = useLocation()
  const buttonContainerRef = useRef(null)

  // 检查是否在任务页面
  const isTaskPage = location.pathname.startsWith('/tasks')

  // 初始化时，如果有外部传入的筛选或排序条件，更新状态
  useEffect(() => {
    if (currentFilter) {
      setState(prev => ({
        ...prev,
        filterConfig: {
          ...prev.filterConfig,
          conditions: convertApiFilterToUiFilter(currentFilter)
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
    }
  }, [currentSort]);

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

      // 创建筛选表达式并添加到列表
      filterList.exprs.push({
        field: condition.field.toLowerCase(),
        op,
        values: Array.isArray(condition.value) ? condition.value : [condition.value]
      });
    });

    return filterList;
  };

  // 将API筛选条件转换为UI筛选条件
  const convertApiFilterToUiFilter = (apiFilter) => {
    if (!apiFilter || !apiFilter.exprs) return [];
    
    // 将API筛选表达式转换为UI筛选条件
    return apiFilter.exprs.map((expr, index) => {
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

      return {
        id: `filter${index + 1}`,
        field: expr.field,
        operator,
        value: expr.values.length > 1 ? expr.values : expr.values[0]
      };
    });
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

  // 保存视图配置
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
      
      // 调用保存API
      await filterService.saveView({
        filterConfig: apiFilter,
        groupConfig,
        sortConfig: apiSort,
      })

      message.success("视图保存成功")
      closePopover()
    } catch (error) {
      console.error("保存视图失败:", error)
      message.error("保存视图失败，请重试")
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
      {isCreateTaskModalVisible && (
        <CreateTaskModal 
          visible={isCreateTaskModalVisible} 
          onCancel={handleModalCancel} 
        />
      )}
      
      {/* 导入任务模态框 */}
      {isImportTaskModalVisible && (
        <ImportTaskModal 
          visible={isImportTaskModalVisible} 
          onCancel={handleImportModalCancel}
          onSuccess={handleImportSuccess}
        />
      )}
    </div>
  )
}

export default FilterSystem
