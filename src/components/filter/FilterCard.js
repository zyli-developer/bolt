"use client"
import { Button, Select, Tag } from "antd"
import { PlusOutlined } from "@ant-design/icons"
import CloseIcon from "../icons/CloseIcon"
import { fieldOptions, operatorOptions, valueOptions } from "../../mocks/filterData"

const { Option } = Select

// 删除原来的硬编码数据
// const fieldOptions = ["场景", "标签", "作者", "来源"]
// const operatorOptions = ["等于", "不等于", "包含", "不包含"]
// const valueOptions = {
//  场景: ["场景1", "场景2", "场景3", "场景4"],
//  标签: ["标签1", "标签2", "标签3", "标签4"],
//  作者: ["作者1", "作者2", "作者3", "作者4"],
//  来源: ["来源1", "来源2", "来源3", "来源4"],
// }

const FilterCard = ({ config, onConfigChange, onNext }) => {
  // 添加新条件
  const addCondition = () => {
    const newCondition = {
      field: "场景",
      operator: "等于",
      values: [],
      id: Date.now().toString(),
    }

    onConfigChange({
      ...config,
      conditions: [...config.conditions, newCondition],
    })
  }

  // 移除条件
  const removeCondition = (id) => {
    onConfigChange({
      ...config,
      conditions: config.conditions.filter((condition) => condition.id !== id),
    })
  }

  // 更新条件字段
  const updateConditionField = (id, field) => {
    onConfigChange({
      ...config,
      conditions: config.conditions.map((condition) =>
        condition.id === id ? { ...condition, field, values: [] } : condition,
      ),
    })
  }

  // 更新条件操作符
  const updateConditionOperator = (id, operator) => {
    onConfigChange({
      ...config,
      conditions: config.conditions.map((condition) => (condition.id === id ? { ...condition, operator } : condition)),
    })
  }

  // 更新条件值
  const updateConditionValues = (id, values) => {
    onConfigChange({
      ...config,
      conditions: config.conditions.map((condition) => (condition.id === id ? { ...condition, values } : condition)),
    })
  }

  return (
    <div>
      <div className="filter-card-header">
        <h3 className="filter-card-title">设置筛选条件</h3>
      </div>
      <div className="filter-card-content">
        {config.conditions.map((condition) => (
          <div key={condition.id} className="filter-condition">
            <div className="filter-condition-field">
              <Select
                value={condition.field}
                onChange={(value) => updateConditionField(condition.id, value)}
                style={{ width: "100%" }}
              >
                {fieldOptions.map((option) => (
                  <Option key={option} value={option}>
                    {option}
                  </Option>
                ))}
              </Select>
            </div>
            <div className="filter-condition-operator">
              <Select
                value={condition.operator}
                onChange={(value) => updateConditionOperator(condition.id, value)}
                style={{ width: "100%" }}
              >
                {operatorOptions.map((option) => (
                  <Option key={option} value={option}>
                    {option}
                  </Option>
                ))}
              </Select>
            </div>
            <div className="filter-condition-value">
              <Select
                mode="multiple"
                value={condition.values}
                onChange={(values) => updateConditionValues(condition.id, values)}
                style={{ width: "100%" }}
                placeholder="请选择值"
                tagRender={(props) => (
                  <Tag color="blue" closable={props.closable} onClose={props.onClose} style={{ marginRight: 3 }}>
                    {props.value}
                  </Tag>
                )}
              >
                {valueOptions[condition.field]?.map((option) => (
                  <Option key={option} value={option}>
                    {option}
                  </Option>
                ))}
              </Select>
            </div>
            <div className="filter-condition-remove" onClick={() => removeCondition(condition.id)}>
              <CloseIcon />
            </div>
          </div>
        ))}

        <a className="filter-add-condition" onClick={addCondition}>
          <PlusOutlined /> 新条件
        </a>

        <div className="filter-actions">
          <Button type="primary" className="filter-next-btn" onClick={onNext}>
            下一项
          </Button>
        </div>
      </div>
    </div>
  )
}

export default FilterCard
