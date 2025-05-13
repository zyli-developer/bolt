// 筛选系统数据

// 场景选项
export const fieldOptions = [
  "confidence", // 可信度
  "scenario",   // 场景
  "task",       // 任务
  "keyword",    // 关键词
  "creator",    // 创建者
  "created_at"  // 创建时间
]

// 操作符选项
export const operatorOptions = [
  "等于",
  "不等于",
  "大于",
  "大于等于",
  "小于",
  "小于等于",
  "包含",
  "不包含",
  "在范围内"
]

// 值选项
export const valueOptions = {
  场景: ["场景1", "场景2", "场景3", "场景4"],
  标签: ["标签1", "标签2", "标签3", "标签4"],
  作者: ["作者1", "作者2", "作者3", "作者4"],
  来源: ["来源1", "来源2", "来源3", "来源4"],
}

// 分组字段选项
export const groupFieldOptions = ["场景", "标签", "作者", "来源", "创建时间"]

// 排序字段选项
export const sortFieldOptions = [
  { value: "confidence", label: "可信度" },
  { value: "name", label: "名称" },
  { value: "created_at", label: "创建时间" },
  { value: "like_count", label: "点赞数" }
]

// 排序方向选项
export const sortDirectionOptions = [
  { value: "asc", label: "升序" },
  { value: "desc", label: "降序" }
]

// 初始筛选配置
export const initialFilterState = {
  visible: false,
  step: "filter", // 'filter', 'group', 'sort'
  filterConfig: {
    conditions: []
  },
  groupConfig: {
    fields: []
  },
  sortConfig: {
    fields: []
  }
}
