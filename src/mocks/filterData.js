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

// 值选项 - 修改为与fieldOptions匹配的键
export const valueOptions = {
  // 经典的选项键
  场景: ["场景1", "场景2", "场景3", "场景4"],
  标签: ["标签1", "标签2", "标签3", "标签4"],
  作者: ["作者1", "作者2", "作者3", "作者4"],
  来源: ["来源1", "来源2", "来源3", "来源4"],
  
  // 新的字段选项
  confidence: ["高", "中", "低", "0.9", "0.8", "0.7", "0.6", "0.5"],
  scenario: ["聊天场景", "客服咨询", "文档编辑", "内容生成", "教育辅导", "医疗咨询", "金融咨询"],
  task: ["内容审核", "情感分析", "文本翻译", "图像识别", "语音识别", "对话管理", "推荐系统"],
  keyword: [
    "AI安全", 
    "大语言模型", 
    "自动驾驶", 
    "数据安全", 
    "隐私保护", 
    "医疗诊断", 
    "边界测试", 
    "负责任AI", 
    "模型鲁棒性", 
    "情感分析", 
    "多模态", 
    "增强学习", 
    "道德决策", 
    "生成对抗",
    "阈值调整",
    "偏见检测",
    "公平性",
    "可解释性",
    "对抗样本",
    "极端天气",
    "知识产权",
    "认知偏差",
    "模型评估",
    "风险感知",
    "安全部署"
  ],
  creator: ["张三", "李四", "王五", "赵六", "钱七", "孙八", "周九", "吴十"],
  created_at: ["今天", "昨天", "本周", "上周", "本月", "上月", "今年", "去年"]
}

// 字段名称映射 - 用于处理字段名称转换
export const fieldNameMap = {
  // 从API字段名到UI字段名
  confidence: "confidence",
  scenario: "scenario",
  task: "task",
  keyword: "keyword",
  creator: "creator",
  created_at: "created_at",
  
  // 处理可能的大小写或命名差异
  Confidence: "confidence",
  Scenario: "scenario",
  Task: "task",
  Keyword: "keyword",
  Creator: "creator",
  CreatedAt: "created_at",
  created_time: "created_at",
  
  // 从UI字段名到API字段名
  "场景": "scenario",
  "标签": "keyword",
  "作者": "creator",
  "来源": "source"
}

// 标准化字段名称
export const normalizeFieldName = (fieldName) => {
  if (!fieldName) return "keyword"; // 默认字段
  
  // 尝试从映射中获取规范化的字段名
  const normalizedName = fieldNameMap[fieldName] || fieldName.toLowerCase();
  
  // 如果在valueOptions中找不到这个字段，返回默认字段
  return valueOptions[normalizedName] ? normalizedName : "keyword";
};

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
