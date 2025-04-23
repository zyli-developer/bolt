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

// 卡片数据 - 更新为每个卡片都有不同的数据
export const cardsData = [
  {
    id: 1,
    title: "AI玩具安全性评估：儿童语音交互系统的隐私保护与内容安全",
    author: {
      id: 2,
      name: "Jackson",
      avatar: null,
    },
    source: "Alibaba",
    tags: ["安全性", "儿童", "语音交互"],
    summary:
      "本评估针对面向3-8岁儿童的AI语音交互玩具进行全面安全性分析，重点关注隐私保护、内容过滤和数据安全。评估发现该产品在语音识别准确性和响应速度方面表现优秀，但在数据存储加密和家长控制功能方面存在不足。",
    credibility: 92.5,
    credibilityChange: "+1.5%",
    score: 9.2,
    scoreChange: "+0.8%",
    chartData: {
      radar: [
        { name: "语音识别", value: 85 },
        { name: "内容安全", value: 78 },
        { name: "隐私保护", value: 65 },
        { name: "数据加密", value: 70 },
        { name: "家长控制", value: 60 },
        { name: "系统稳定", value: 88 },
      ],
      line: [
        { month: "08", value: 65 },
        { month: "09", value: 72 },
        { month: "10", value: 80 },
        { month: "11", value: 92 },
      ],
    },
    agents: {
      overall: true,
      agent1: true,
      agent2: false,
    },
    changes: ["更新了隐私保护评估标准", "添加了COPPA合规性检查", "优化了内容过滤测试方法"],
    updatedAt: "21:32, 12/01/2025",
    updatedBy: {
      id: 3,
      name: "Mike",
      avatar: null,
    },
  },
  {
    id: 2,
    title: "大型语言模型在医疗诊断辅助中的可靠性与伦理评估",
    author: {
      id: 3,
      name: "Rita",
      avatar: null,
    },
    source: "医疗AI研究中心",
    tags: ["医疗", "伦理", "诊断"],
    summary:
      "本研究评估了大型语言模型在医疗诊断辅助中的可靠性和伦理问题。研究表明，当前模型在常见疾病诊断建议方面准确率达到87%，但在罕见病识别和紧急情况处理方面存在明显不足。同时，模型在医疗隐私保护和知情同意等伦理方面需要进一步完善。",
    credibility: 87.0,
    credibilityChange: "+2.3%",
    score: 8.7,
    scoreChange: "+1.2%",
    chartData: {
      radar: [
        { name: "诊断准确", value: 87 },
        { name: "罕见病识别", value: 62 },
        { name: "紧急处理", value: 58 },
        { name: "隐私保护", value: 75 },
        { name: "知情同意", value: 70 },
        { name: "医患沟通", value: 82 },
      ],
      line: [
        { month: "08", value: 70 },
        { month: "09", value: 75 },
        { month: "10", value: 82 },
        { month: "11", value: 87 },
      ],
    },
    changes: ["增加了罕见病诊断测试集", "完善了医疗伦理评估框架", "添加了医患沟通效果评估"],
    updatedAt: "18:45, 12/02/2025",
    updatedBy: {
      id: 4,
      name: "Sarah",
      avatar: null,
    },
  },
  {
    id: 3,
    title: "自动驾驶AI系统在极端天气条件下的安全性与决策能力评估",
    author: {
      id: 5,
      name: "David",
      avatar: null,
    },
    source: "交通安全研究院",
    tags: ["自动驾驶", "安全", "极端天气"],
    summary:
      "本评估针对三款市场领先的自动驾驶AI系统在暴雨、大雾、暴雪等极端天气条件下的表现进行了系统测试。结果显示，所有系统在标准天气条件下表现良好，但在能见度低于50米的环境中，决策准确率显著下降，存在安全隐患。建议加强传感器融合和极端天气适应性训练。",
    credibility: 94.0,
    credibilityChange: "+3.5%",
    score: 9.4,
    scoreChange: "+1.8%",
    chartData: {
      radar: [
        { name: "标准天气", value: 95 },
        { name: "暴雨条件", value: 78 },
        { name: "大雾条件", value: 65 },
        { name: "暴雪条件", value: 62 },
        { name: "夜间行驶", value: 85 },
        { name: "紧急制动", value: 90 },
      ],
      line: [
        { month: "08", value: 75 },
        { month: "09", value: 82 },
        { month: "10", value: 88 },
        { month: "11", value: 94 },
      ],
    },
    agents: {
      overall: true,
      agent1: false,
      agent2: true,
    },
    changes: ["扩展了极端天气测试场景", "优化了传感器数据分析方法", "增加了紧急制动测试项目"],
    updatedAt: "09:15, 12/03/2025",
    updatedBy: {
      id: 6,
      name: "Alex",
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

// 任务数据 - 更新为每个任务都有不同的数据
export const tasksData = [
  {
    id: 101,
    title: "开发儿童AI玩具安全评估框架",
    author: {
      id: 1,
      name: "Jackson",
      avatar: null,
    },
    source: "Alibaba",
    tags: ["儿童安全", "AI玩具", "评估框架"],
    description:
      "建立一套针对3-12岁儿童AI玩具的安全评估框架，包括隐私保护、内容安全、物理安全和交互设计四个维度的评估标准和测试方法。",
    status: "进行中",
    credibility: 95.0,
    credibilityChange: "+2.5%",
    score: 9.5,
    scoreChange: "+0.8%",
    chartData: {
      radar: [
        { name: "隐私保护", value: 85 },
        { name: "内容安全", value: 90 },
        { name: "物理安全", value: 95 },
        { name: "交互设计", value: 80 },
        { name: "数据处理", value: 75 },
        { name: "合规性", value: 92 },
      ],
      line: [
        { month: "08", value: 75 },
        { month: "09", value: 82 },
        { month: "10", value: 88 },
        { month: "11", value: 95 },
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
    title: "医疗AI系统伦理评估工具开发",
    author: {
      id: 3,
      name: "Rita",
      avatar: null,
    },
    source: "医疗AI研究中心",
    tags: ["医疗AI", "伦理", "评估工具"],
    description:
      "开发一套针对医疗AI系统的伦理评估工具，重点关注患者隐私保护、知情同意、诊断透明度和医患关系等伦理问题，为医疗AI系统的伦理审查提供标准化工具。",
    status: "待启动",
    credibility: 85.0,
    credibilityChange: "+3.5%",
    score: 8.5,
    scoreChange: "+1.5%",
    chartData: {
      radar: [
        { name: "隐私保护", value: 80 },
        { name: "知情同意", value: 75 },
        { name: "诊断透明", value: 85 },
        { name: "医患关系", value: 90 },
        { name: "数据安全", value: 82 },
        { name: "算法公平", value: 78 },
      ],
      line: [
        { month: "08", value: 65 },
        { month: "09", value: 72 },
        { month: "10", value: 78 },
        { month: "11", value: 85 },
      ],
    },
    permission: "person",
    type: "my",
    updatedAt: "18:45, 12/01/2025",
    updatedBy: {
      id: 3,
      name: "Rita",
      avatar: null,
    },
  },
  {
    id: 103,
    title: "自动驾驶AI系统安全评估标准研究",
    author: {
      id: 5,
      name: "David",
      avatar: null,
    },
    source: "交通安全研究院",
    tags: ["自动驾驶", "安全标准", "AI评估"],
    description:
      "研究制定自动驾驶AI系统的安全评估标准，包括感知能力、决策逻辑、极端情况处理和系统鲁棒性等方面，为自动驾驶技术的安全监管提供科学依据。",
    status: "已完成",
    credibility: 92.0,
    credibilityChange: "+4.0%",
    score: 9.2,
    scoreChange: "+1.2%",
    chartData: {
      radar: [
        { name: "感知能力", value: 88 },
        { name: "决策逻辑", value: 92 },
        { name: "极端处理", value: 85 },
        { name: "系统鲁棒", value: 90 },
        { name: "安全冗余", value: 95 },
        { name: "人机交互", value: 87 },
      ],
      line: [
        { month: "08", value: 75 },
        { month: "09", value: 82 },
        { month: "10", value: 88 },
        { month: "11", value: 92 },
      ],
    },
    permission: "workspace",
    type: "team",
    updatedAt: "09:30, 12/02/2025",
    updatedBy: {
      id: 5,
      name: "David",
      avatar: null,
    },
  },
]

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
