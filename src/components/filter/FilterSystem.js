"use client"

import { useState } from "react"
import { Button, Popover, message } from "antd"
import { FilterOutlined, GroupOutlined } from "@ant-design/icons"
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
    popoverVisible: false,
  })
  const [loading, setLoading] = useState(false)

  // 显示指定步骤的弹窗
  const showPopover = (step) => {
    setState((prevState) => ({
      ...prevState,
      step,
      popoverVisible: true,
    }))
  }

  // 关闭弹窗
  const closePopover = () => {
    setState((prevState) => ({
      ...prevState,
      popoverVisible: false,
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

  // 获取当前步骤的内容
  const getStepContent = () => {
    const { step, filterConfig, groupConfig, sortConfig } = state

    switch (step) {
      case "filter":
        return (
          <FilterCard
            config={filterConfig}
            onConfigChange={updateFilterConfig}
            onNext={() => handleStepChange("next")}
          />
        )
      case "group":
        return (
          <GroupCard
            config={groupConfig}
            onConfigChange={updateGroupConfig}
            onPrev={() => handleStepChange("prev")}
            onNext={() => handleStepChange("next")}
          />
        )
      case "sort":
        return (
          <SortCard
            config={sortConfig}
            onConfigChange={updateSortConfig}
            onPrev={() => handleStepChange("prev")}
            onSave={handleSave}
            loading={loading}
          />
        )
      default:
        return null
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

  // 筛选系统弹窗内容
  const popoverContent = <div className="filter-card">{getStepContent()}</div>

  return (
    <>
      <div className="toolbar-left">
        <Popover
          content={popoverContent}
          visible={state.popoverVisible}
          onVisibleChange={(visible) => {
            if (!visible) closePopover()
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
      </div>
      <div className="toolbar-right">
        <Button icon={<GroupOutlined />} className="group-button" onClick={() => showPopover("group")}>
          Group <span className="group-count">{getGroupCount()}</span>
        </Button>
        <Button icon={<SortIcon />} className="sort-button" onClick={() => showPopover("sort")}>
          Sort
        </Button>
      </div>
    </>
  )
}

export default FilterSystem
