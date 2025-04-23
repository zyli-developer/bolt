// 菜单数据
export const menuData = [
  {
    id: 1,
    title: "探索",
    path: "/explore",
    icon: "ExploreIcon",
    active: true,
  },
  {
    id: 2,
    title: "任务",
    path: "/tasks",
    icon: "TaskIcon",
  },
  {
    id: 3,
    title: "资产",
    path: "/assets",
    icon: "AppstoreOutlined",
  },
  {
    id: 4,
    title: "场景",
    path: "/scenes",
    icon: "AppstoreOutlined",
  },
]

// 聊天用户数据
export const chatUsers = [
  {
    id: 1,
    name: "Rita",
    avatar: null,
    status: "active",
  },
  {
    id: 2,
    name: "Jackson",
    avatar: null,
    status: "offline",
  },
  {
    id: 3,
    name: "财务部",
    avatar: null,
    status: "active",
  },
]

// Add more realistic mock chat messages
export const mockChatMessages = [
  {
    id: 1,
    sender: "other",
    text: "您好，有什么我可以帮助您的吗？",
    timestamp: "2025/12/3 21:45",
  },
  {
    id: 2,
    sender: "user",
    text: "我想了解一下关于AI安全评估的相关信息",
    timestamp: "2025/12/3 21:46",
  },
  {
    id: 3,
    sender: "other",
    text: "当然可以。我们提供全面的AI安全评估服务，包括模型安全性、数据隐私保护、系统鲁棒性等多个维度的测试和评估。您有具体想了解哪方面的内容吗？",
    timestamp: "2025/12/3 21:47",
  },
  {
    id: 4,
    sender: "user",
    text: "我主要关注模型安全性评估，特别是对于大语言模型的评估标准",
    timestamp: "2025/12/3 21:48",
  },
  {
    id: 5,
    sender: "other",
    text: "对于大语言模型的安全性评估，我们主要从以下几个方面进行：1. 输出安全性：评估模型是否会产生有害、不当或违规内容；2. 鲁棒性：测试模型对抗攻击的防御能力；3. 隐私保护：评估模型是否会泄露训练数据中的敏感信息；4. 偏见与公平性：检测模型输出是否存在偏见。我们可以根据您的具体需求定制评估方案。",
    timestamp: "2025/12/3 21:50",
  },
]

// 卡片数据
export const cardsData = [
  {
    id: 1,
    title: "一个很长的title一个很长的title一个很长的title一个很长的title一个很长的title一个很长的title...",
    author: {
      id: 2,
      name: "Jackson",
      avatar: null,
    },
    source: "Alibaba",
    tags: ["标签1", "标签2", "标签3"],
    summary:
      "问题概要\n客客概要客客概要概要客客概要客客概要客客概要客客概要客客概要客客概要客客概要客客概要客客概要客客概要客客概要客客概要",
    credibility: 100.0,
    credibilityChange: "+1.5%",
    score: 10.0,
    scoreChange: "-1.5%",
    chartData: {
      radar: [
        { name: "维度1", value: 70 },
        { name: "维度2", value: 80 },
        { name: "维度3", value: 60 },
        { name: "维度4", value: 90 },
        { name: "维度5", value: 75 },
        { name: "维度6", value: 85 },
      ],
      line: [
        { month: "08", value: 40 },
        { month: "09", value: 60 },
        { month: "10", value: 45 },
        { month: "11", value: 80 },
      ],
    },
    agents: {
      overall: true,
      agent1: true,
      agent2: false,
    },
    changes: ["Changed to XXX template", "Changed to XXX template", "Changed to XXX template"],
    updatedAt: "21:32, 12/01/2025",
    updatedBy: {
      id: 3,
      name: "Mike",
      avatar: null,
    },
  },
  {
    id: 2,
    title: "一个很长的title一个很长的title一个很长的title一个很长的title一个很长的title一个很长的title...",
    author: {
      id: 2,
      name: "Jackson",
      avatar: null,
    },
    source: "Alibaba",
    tags: ["标签1", "标签2", "标签3"],
    summary:
      "问题概要\n客客概要客客概要概要客客概要客客概要客客概要客客概要客客概要客客概要客客概要客客概要客客概要客客概要客客概要客客概要",
    credibility: 100.0,
    credibilityChange: "+1.5%",
    score: 10.0,
    scoreChange: "-1.5%",
    chartData: {
      radar: [
        { name: "维度1", value: 70 },
        { name: "维度2", value: 80 },
        { name: "维度3", value: 60 },
        { name: "维度4", value: 90 },
        { name: "维度5", value: 75 },
        { name: "维度6", value: 85 },
      ],
      line: [
        { month: "08", value: 40 },
        { month: "09", value: 60 },
        { month: "10", value: 45 },
        { month: "11", value: 80 },
      ],
    },
    changes: ["Changed to XXX template", "Changed to XXX template", "Changed to XXX template"],
    updatedAt: "21:32, 12/01/2025",
    updatedBy: {
      id: 3,
      name: "Mike",
      avatar: null,
    },
  },
  {
    id: 3,
    title: "一个很长的title一个很长的title一个很长的title一个很长的title一个很长的title一个很长的title...",
    author: {
      id: 2,
      name: "Jackson",
      avatar: null,
    },
    source: "Alibaba",
    tags: ["标签1", "标签2", "标签3"],
    summary:
      "问题概要\n客客概要客客概要概要客客概要客客概要客客概要客客概要客客概要客客概要客客概要客客概要客客概要客客概要客客概要客客概要",
    credibility: 100.0,
    credibilityChange: "+1.5%",
    score: 10.0,
    scoreChange: "-1.5%",
    chartData: {
      radar: [
        { name: "维度1", value: 70 },
        { name: "维度2", value: 80 },
        { name: "维度3", value: 60 },
        { name: "维度4", value: 90 },
        { name: "维度5", value: 75 },
        { name: "维度6", value: 85 },
      ],
      line: [
        { month: "08", value: 40 },
        { month: "09", value: 60 },
        { month: "10", value: 45 },
        { month: "11", value: 80 },
      ],
    },
    agents: {
      overall: true,
      agent1: true,
      agent2: false,
    },
    changes: ["Changed to XXX template", "Changed to XXX template", "Changed to XXX template"],
    updatedAt: "21:32, 12/01/2025",
    updatedBy: {
      id: 3,
      name: "Mike",
      avatar: null,
    },
  },
]

// 当前用户数据
export const currentUser = {
  id: 1,
  name: "Jackson",
  email: "Jackson@yahoo.com",
  avatar: null,
}

// 任务数据
export const tasksData = [
  {
    id: 101,
    title: "一个很长的title一个很长的title一个很长的title一个很长的title一个很长的title一个很长的title...",
    author: {
      id: 1,
      name: "Jackson",
      avatar: null,
    },
    source: "Alibaba",
    tags: ["标签1", "标签2", "标签3"],
    description: "目标目标目标目标目标目标目标目标目标目标目标目标目标目标目标目标目标目标目标目标",
    status: "待启动",
    credibility: 95.0,
    credibilityChange: "+0.5%",
    score: 9.5,
    scoreChange: "+0.5%",
    chartData: {
      radar: [
        { name: "维度1", value: 75 },
        { name: "维度2", value: 85 },
        { name: "维度3", value: 65 },
        { name: "维度4", value: 80 },
        { name: "维度5", value: 70 },
        { name: "维度6", value: 90 },
      ],
      line: [
        { month: "08", value: 50 },
        { month: "09", value: 65 },
        { month: "10", value: 70 },
        { month: "11", value: 85 },
      ],
    },
    permission: "workspace",
    type: "team",
    updatedAt: "20:15, 11/30/2025",
    updatedBy: {
      id: 1,
      name: "Mike",
      avatar: null,
    },
  },
  {
    id: 102,
    title: "一个很长的title一个很长的title一个很长的title一个很长的title一个很长的title一个很长的title...",
    author: {
      id: 1,
      name: "Jackson",
      avatar: null,
    },
    source: "Alibaba",
    tags: ["UI", "优化"],
    description: "优化现有用户界面，提升用户体验和交互效果，完善功能细节",
    status: "进行中",
    credibility: 85.0,
    credibilityChange: "+2.5%",
    score: 8.5,
    scoreChange: "+1.5%",
    chartData: {
      radar: [
        { name: "维度1", value: 65 },
        { name: "维度2", value: 75 },
        { name: "维度3", value: 85 },
        { name: "维度4", value: 70 },
        { name: "维度5", value: 80 },
        { name: "维度6", value: 75 },
      ],
      line: [
        { month: "08", value: 30 },
        { month: "09", value: 45 },
        { month: "10", value: 65 },
        { month: "11", value: 85 },
      ],
    },
    permission: "person",
    type: "my",
    updatedAt: "18:45, 12/01/2025",
    updatedBy: {
      id: 1,
      name: "Jackson",
      avatar: null,
    },
  },
  {
    id: 103,
    title: "一个很长的title一个很长的title一个很长的title一个很长的title一个很长的title一个很长的title...",
    author: {
      id: 2,
      name: "Rita",
      avatar: null,
    },
    source: "Alibaba",
    tags: ["数据", "分析"],
    description: "分析用户行为数据，提供优化建议和改进方案，提升产品转化率",
    status: "已完成",
    credibility: 92.0,
    credibilityChange: "+3.0%",
    score: 9.2,
    scoreChange: "+0.8%",
    chartData: {
      radar: [
        { name: "维度1", value: 80 },
        { name: "维度2", value: 90 },
        { name: "维度3", value: 75 },
        { name: "维度4", value: 85 },
        { name: "维度5", value: 95 },
        { name: "维度6", value: 70 },
      ],
      line: [
        { month: "08", value: 40 },
        { month: "09", value: 55 },
        { month: "10", value: 75 },
        { month: "11", value: 92 },
      ],
    },
    permission: "workspace",
    type: "team",
    updatedAt: "09:30, 12/02/2025",
    updatedBy: {
      id: 2,
      name: "Rita",
      avatar: null,
    },
  },
]

// 检查evaluationsData中的taskId是否与tasksData中的id匹配

// 评估数据
export const evaluationsData = [
  {
    id: "752",
    taskId: 101,
    createdAt: "2023-06-15 14:30",
    progress: 100,
    models: [
      {
        name: "GPT-4评估模型",
        trustworthiness: 92,
        description:
          "该AI玩具在语音识别方面表现优秀，能够准确识别儿童的语音指令。安全性设计符合国际标准，无小零件脱落风险。交互体验流畅，响应速度快。建议改进的方面包括：增加更多教育内容、优化电池续航能力。总体评分：9.2/10",
        strengths: ["语音识别准确", "安全性高", "交互体验好"],
        weaknesses: ["教育内容有限", "电池续航一般"],
      },
      {
        name: "Claude评估模型",
        trustworthiness: 87,
        description:
          "这款AI玩具的语音交互系统反应灵敏，能够理解大部分儿童指令。安全材料使用符合标准，但某些边缘部分可能需要进一步圆润处理。教育内容丰富多样，适合目标年龄段儿童。建议改进：增强防水性能，优化充电接口设计。总体评分：8.7/10",
        strengths: ["语音交互灵敏", "教育内容丰富", "目标人群匹配度高"],
        weaknesses: ["边缘安全性需改进", "防水性能不足"],
      },
    ],
    optimizationHistory: [
      {
        id: 1,
        description: "添加了产品的详细材质信息和安全认证文档",
        result: "GPT-4评估模型置信度从88%提升至92%",
      },
      {
        id: 2,
        description: "补充了产品的用户测试反馈和使用场景说明",
        result: "Claude评估模型置信度从82%提升至87%",
      },
    ],
  },
  {
    id: "753",
    taskId: 102,
    createdAt: "2023-06-16 10:45",
    progress: 100,
    models: [
      {
        name: "GPT-4评估模型",
        trustworthiness: 88,
        description:
          "该AI玩具在语音识别方面表现良好，能够识别大部分儿童的语音指令。安全性设计基本符合标准，但有少量小零件可能存在脱落风险。交互体验较流畅，响应速度适中。建议改进的方面包括：增强安全性设计、优化语音识别准确度。总体评分：8.8/10",
        strengths: ["语音识别良好", "交互体验流畅", "教育内容丰富"],
        weaknesses: ["安全性有待提高", "响应速度不稳定"],
      },
      {
        name: "Claude评估模型",
        trustworthiness: 85,
        description:
          "这款AI玩具的语音交互系统基本可用，能够理解简单的儿童指令。安全材料使用符合基本标准，但整体设计需要改进。教育内容较为丰富，适合部分年龄段儿童。建议改进：提升安全性设计，优化语音识别系统。总体评分：8.5/10",
        strengths: ["教育内容多样", "基本功能完善", "价格合理"],
        weaknesses: ["安全性设计不足", "语音识别准确度低"],
      },
    ],
    optimizationHistory: [
      {
        id: 1,
        description: "添加了产品的安全测试报告",
        result: "GPT-4评估模型置信度从85%提升至88%",
      },
      {
        id: 2,
        description: "补充了产品的语音识别技术说明",
        result: "Claude评估模型置信度从80%提升至85%",
      },
    ],
  },
]

// 工作区数据
export const workspacesData = [
  { id: 1, name: "Alibaba", icon: "A", role: "Owner", current: true },
  { id: 2, name: "Tencent", icon: "T", role: "Member", current: false },
  { id: 3, name: "Baidu", icon: "B", role: "Admin", current: false },
]

// 当前工作区数据
export const currentWorkspace = {
  id: 1,
  name: "Alibaba",
  icon: "A",
  role: "Owner",
  domain: "syntrusthub.agentour.app",
  members: 12,
  projects: 8,
  createdAt: "2023-05-15",
  description: "阿里巴巴集团工作区",
  settings: {
    allowPublicSharing: true,
    defaultPermission: "private",
  },
}
