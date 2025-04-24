"use client"

import { useState } from "react"
import { Button, Popover, message, Input } from "antd"
import { FilterOutlined, GroupOutlined, SearchOutlined } from "@ant-design/icons"
import FilterCard from "./FilterCard"
import GroupCard from "./GroupCard"
import SortCard from "./SortCard"
import SortIcon from "../icons/SortIcon"
import filterService from "../../services/filterService"
import { initialFilterState } from "../../mocks/filterData"
import "./filter-system.css"

const FilterSystem = () => {
  // 状态管理
  const [state, setState] = useState({
    ...initialFilterState,
    activePopover: null, // 'filter', 'group', 'sort' 或 null
    searchValue: '', // 添加搜索值状态
  })
  const [loading, setLoading] = useState(false)

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
    // 这里可以添加搜索逻辑
    console.log('搜索:', value || state.searchValue);
  }

  // 保存视图配置
  const handleSave = async () => {
    try {
      setLoading(true)
      const { filterConfig, groupConfig, sortConfig } = state

      // 调用保存API
      await filterService.saveView({
        filterConfig,
        groupConfig,
        sortConfig,
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
    <div className="filter-system-container" style={{ display: 'flex', justifyContent: 'space-between', width: '100%' }}>
      <div className="toolbar-left" style={{ display: 'flex', gap: '8px' }}>
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
          <Button icon={<FilterOutlined />} className="filter-button" onClick={() => showPopover("filter")}>
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
          <Button icon={<GroupOutlined />} className="group-button" onClick={() => showPopover("group")}>
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
          <Button icon={<SortIcon />} className="sort-button" onClick={() => showPopover("sort")}>
            Sort {getSortCount() > 0 && <span className="filter-count">{getSortCount()}</span>}
          </Button>
        </Popover>
      </div>
      
      <div className="toolbar-right">
        <Input
          placeholder="搜索感兴趣的任务"
          suffix={<SearchOutlined style={{ color: '#8c8c8c', fontSize: '16px' }} />}
          value={state.searchValue}
          onChange={handleSearchChange}
          onPressEnter={() => handleSearch()}
          style={{ 
            width: '240px', 
            borderRadius: '30px',
            padding: '8px 16px',
            border: '1px solid #d9d9d9',
            boxShadow: 'none',
            fontSize: '14px',
            color: '#8c8c8c'
          }}
          allowClear={false}
        />
      </div>
    </div>
  )
}

export default FilterSystem
