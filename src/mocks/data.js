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
  }
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
  id: "1",
  name: "Jackson",
  email: "Jackson@yahoo.com",
  avatar: null,
  workspace: "default",
  vip: false,
  phone: "13800138000",
  role: "user",
  preferences: {},
  last_login: { seconds: "1714377600" },
  created_at: { seconds: "1704067200" },
  updated_at: { seconds: "1714377600" }
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
  { 
    id: "1", 
    name: "Alibaba", 
    icon: "A", 
    role: "Owner", 
    current: true,
    domain: "alibaba.syntrusthub.app",
    description: "阿里巴巴工作区",
    members: 8,
    projects: 5,
    createdAt: { seconds: "1704067200" }
  },
  { 
    id: "2", 
    name: "Tencent", 
    icon: "T", 
    role: "Member", 
    current: false,
    domain: "tencent.syntrusthub.app",
    description: "腾讯工作区",
    members: 12,
    projects: 7,
    createdAt: { seconds: "1704153600" }
  },
  { 
    id: "3", 
    name: "Baidu", 
    icon: "B", 
    role: "Admin", 
    current: false,
    domain: "baidu.syntrusthub.app",
    description: "百度工作区",
    members: 5,
    projects: 3,
    createdAt: { seconds: "1704240000" }
  },
]

// 当前工作区数据
export const currentWorkspace = {
  id: "1",
  name: "Alibaba",
  icon: "A",
  role: "Owner",
  current: true,
  domain: "syntrusthub.agentour.app",
  members: 12,
  projects: 8,
  createdAt: { seconds: "1704067200" },
  description: "阿里巴巴集团工作区",
  settings: {
    allowPublicSharing: true,
    defaultPermission: "private",
  },
}

// 任务详情数据
export const taskDetailData = {
  title: "示例任务",
  author: {
    name: "Mike",
    avatar: "M"
  },
  source: "内部项目",
  tags: ["AI", "评估", "编程"],
  description: "这是一个示例任务描述",
  chartData: {
    radar: [
      { name: "准确性", value: 85 },
      { name: "效率", value: 90 },
      { name: "质量", value: 88 },
      { name: "速度", value: 92 }
    ],
    line: [
      { month: "1月", value: 85 },
      { month: "2月", value: 88 },
      { month: "3月", value: 92 },
      { month: "4月", value: 90 }
    ]
  }
};

// 任务注释数据
export const taskAnnotationData = [
  {
    key: '1',
    no: '1',
    title: '评估标准',
    content: 'GB xxxx 生成式人工智能评估标准v1.0',
    attachments: [
      { name: '评估标准.pdf', url: '#' },
      { name: '评估细则.docx', url: '#' }
    ],
    lastModifiedBy: {
      name: 'Mike',
      avatar: 'M'
    },
    modifiedTime: {
      hour: '13:28',
      date: '14/4/2025'
    }
  },
  {
    key: '2',
    no: '2',
    title: '评估方法',
    content: '基于 ISO/IEC 25010 的AI系统质量评估方法',
    attachments: [
      { name: '评估方法.pdf', url: '#' }
    ],
    lastModifiedBy: {
      name: 'Sarah',
      avatar: 'S'
    },
    modifiedTime: {
      hour: '15:45',
      date: '14/4/2025'
    }
  },
  {
    key: '3',
    no: '3',
    title: '测试用例',
    content: '包含安全性、可靠性、性能效率等维度的测试用例集',
    attachments: [
      { name: '测试用例.xlsx', url: '#' },
      { name: '测试数据.zip', url: '#' }
    ],
    lastModifiedBy: {
      name: 'David',
      avatar: 'D'
    },
    modifiedTime: {
      hour: '09:15',
      date: '15/4/2025'
    }
  }
];

// 卡片详情数据
export const cardDetailData = {
  title: "示例卡片",
  author: {
    name: "David",
    avatar: "D"
  },
  source: "研发部门",
  tags: ["开发", "测试", "部署"],
  chartData: {
    radar: [
      { name: "性能", value: 88 },
      { name: "可靠性", value: 92 },
      { name: "安全性", value: 85 },
      { name: "可维护性", value: 90 }
    ],
    line: [
      { month: "1月", value: 82 },
      { month: "2月", value: 85 },
      { month: "3月", value: 90 },
      { month: "4月", value: 88 }
    ]
  }
};

// 模型评估数据
export const modelEvaluationData = {
  "claude": {
    name: "Claude 3.5 Sonnet",
    tags: ["Programming", "Programming"],
    description:
      "该AI玩具在语音识别方面表现优秀，能够准确识别儿童的语音指令。安全性设计符合国际标准，无小零件脱落风险。交互体验流该AI玩具在语音识别方面表现优秀，能够准确识别儿童的语音指令。安全性设计符合国际标准，无小零件脱落风险。",
    score: 10.0,
    scoreChange: "-1.5%",
    credibility: 100.0,
    credibilityChange: "+1.5%",
    updatedAt: "21:32, 12/01/2025",
    updatedBy: "Mike",
    strengths: ["语音识别准确", "安全性高", "交互体验好"],
    weaknesses: ["语音识别准确", "安全性高", "交互体验好"],
  },
  "claude3.5": {
    name: "Claude 3.5",
    tags: ["Programming", "Programming"],
    description:
      "该AI玩具在语音识别方面表现优秀，能够准确识别儿童的语音指令。安全性设计符合国际标准，无小零件脱落风险。交互体验流该AI玩具在语音识别方面表现优秀，能够准确识别儿童的语音指令。安全性设计符合国际标准，无小零件脱落风险。",
    score: 10.0,
    scoreChange: "-1.5%",
    credibility: 100.0,
    credibilityChange: "+1.5%",
    updatedAt: "21:32, 12/01/2025",
    updatedBy: "Mike",
    strengths: ["语音识别准确", "安全性高", "交互体验好"],
    weaknesses: ["语音识别准确", "安全性高", "交互体验好"],
  },
  "claude3.6": {
    name: "Claude 3.6",
    tags: ["Programming", "Programming"],
    description:
      "该AI玩具在语音识别方面表现优秀，能够准确识别儿童的语音指令。安全性设计符合国际标准，无小零件脱落风险。交互体验流该AI玩具在语音识别方面表现优秀，能够准确识别儿童的语音指令。安全性设计符合国际标准，无小零件脱落风险。",
    score: 9.5,
    scoreChange: "+0.5%",
    credibility: 95.0,
    credibilityChange: "+1.0%",
    updatedAt: "20:15, 12/01/2025",
    updatedBy: "David",
    strengths: ["响应速度快", "准确率高", "多语言支持"],
    weaknesses: ["资源消耗大", "冷启动时间长"],
  },
  "claude3.7": {
    name: "Claude 3.7",
    tags: ["Programming", "Programming"],
    description:
      "Claude 3.7在复杂任务处理和推理方面表现出色，能够处理多步骤指令并保持上下文连贯性。在代码生成和编程辅助方面尤为突出，支持多种编程语言并能提供详细的解释。",
    score: 9.8,
    scoreChange: "+1.2%",
    credibility: 98.0,
    credibilityChange: "+2.5%",
    updatedAt: "19:45, 12/01/2025",
    updatedBy: "Emma",
    strengths: ["代码生成能力强", "推理深度好", "上下文理解准确"],
    weaknesses: ["处理速度可提升", "特定领域知识有限"],
  },
  "agent2": {
    name: "Agent 2",
    tags: ["Testing", "Evaluation"],
    description:
      "这款AI玩具的语音交互系统反应灵敏，能够理解大部分儿童指令。安全材料使用符合标准，但某些边缘部分可能需要进一步圆润处理。教育内容丰富多样，适合目标年龄段儿童。建议改进：增强防水性能，优化充电接口设计。",
    score: 8.7,
    scoreChange: "+0.5%",
    credibility: 87.0,
    credibilityChange: "+2.0%",
    updatedAt: "18:45, 12/02/2025",
    updatedBy: "Jackson",
    strengths: ["语音交互灵敏", "教育内容丰富", "目标人群匹配度高"],
    weaknesses: ["边缘安全性需改进", "防水性能不足"],
  },
  "deepseek": {
    name: "DeepSeek",
    tags: ["AI", "Large Model"],
    description:
      "DeepSeek在此任务中展现出优秀的理解能力和分析深度。模型能够准确把握问题核心，提供详实的解决方案。特别在代码生成和技术文档理解方面表现突出。建议在边缘场景的处理上进行优化。",
    score: 9.2,
    scoreChange: "+1.8%",
    credibility: 92.0,
    credibilityChange: "+3.0%",
    updatedAt: "20:15, 12/02/2025",
    updatedBy: "Sarah",
    strengths: ["理解准确", "分析深入", "解决方案可行"],
    weaknesses: ["边缘场景处理", "响应时间优化"],
  }
};

// 探索卡片数据 - 符合 Protocol Buffers API 规范
export const explorationCardsData = [
  {
    id: "1001",
    prompt: "AI玩具安全性评估：儿童语音交互系统的隐私保护与内容安全",
    response_summary: "本评估针对面向3-8岁儿童的AI语音交互玩具进行全面安全性分析，重点关注隐私保护、内容过滤和数据安全。评估发现该产品在语音识别准确性和响应速度方面表现优秀，但在数据存储加密和家长控制功能方面存在不足。",
    created_by: "Jackson",
    created_from: "Alibaba",
    created_at: { seconds: 1714377600 },
    step: [
      {
        agent: "GPT-4",
        score: [
          {
            version: "1.0",
            confidence: "0.925",
            score: "0.92",
            consumed_points: 100,
            description: "该AI玩具在语音识别方面表现优秀，能够准确识别儿童的语音指令。安全性设计符合国际标准，无小零件脱落风险。交互体验流畅，响应速度快。",
            dimension: [
              { latitude: "语音识别", weight: 0.85 },
              { latitude: "内容安全", weight: 0.78 },
              { latitude: "隐私保护", weight: 0.65 },
              { latitude: "数据加密", weight: 0.70 },
              { latitude: "家长控制", weight: 0.60 },
              { latitude: "系统稳定", weight: 0.88 }
            ],
            updated_at: { seconds: 1714377600 }
          }
        ],
        reason: "综合评估结果良好，但在隐私保护和家长控制方面需要改进"
      },
      {
        agent: "Claude",
        score: [
          {
            version: "1.0",
            confidence: "0.910",
            score: "0.91",
            consumed_points: 95,
            description: "该AI玩具的内容过滤功能表现良好，但数据存储加密方面存在安全风险。语音识别准确度较高，适合目标年龄段儿童使用。",
            dimension: [
              { latitude: "语音识别", weight: 0.88 },
              { latitude: "内容安全", weight: 0.82 },
              { latitude: "隐私保护", weight: 0.62 },
              { latitude: "数据加密", weight: 0.65 },
              { latitude: "家长控制", weight: 0.63 },
              { latitude: "系统稳定", weight: 0.85 }
            ],
            updated_at: { seconds: 1714377610 }
          }
        ],
        reason: "内容过滤功能表现良好，但数据安全方面需要加强"
      },
      {
        agent: "DeepSeek",
        score: [
          {
            version: "1.0",
            confidence: "0.895",
            score: "0.90",
            consumed_points: 90,
            description: "产品在交互体验和语音识别方面符合儿童使用需求，但隐私保护策略存在漏洞，家长控制功能不够完善。",
            dimension: [
              { latitude: "语音识别", weight: 0.87 },
              { latitude: "内容安全", weight: 0.80 },
              { latitude: "隐私保护", weight: 0.60 },
              { latitude: "数据加密", weight: 0.68 },
              { latitude: "家长控制", weight: 0.58 },
              { latitude: "系统稳定", weight: 0.86 }
            ],
            updated_at: { seconds: 1714377620 }
          }
        ],
        reason: "交互体验优秀，但隐私保护和家长控制功能需要改进"
      },
      {
        agent: "Agent2",
        score: [
          {
            version: "1.0",
            confidence: "0.880",
            score: "0.88",
            consumed_points: 85,
            description: "该AI玩具适合3-8岁儿童使用，语音识别和内容安全方面表现不错，但数据加密和隐私保护措施不够全面，存在数据泄露风险。",
            dimension: [
              { latitude: "语音识别", weight: 0.83 },
              { latitude: "内容安全", weight: 0.79 },
              { latitude: "隐私保护", weight: 0.58 },
              { latitude: "数据加密", weight: 0.62 },
              { latitude: "家长控制", weight: 0.56 },
              { latitude: "系统稳定", weight: 0.84 }
            ],
            updated_at: { seconds: 1714377630 }
          }
        ],
        reason: "适合目标年龄段儿童使用，但数据安全和隐私保护需要改进"
      }
    ],
    title: "AI玩具安全性评估：儿童语音交互系统的隐私保护与内容安全",
    author: {
      id: "1",
      name: "Jackson",
      avatar: null
    },
    source: "Alibaba",
    tags: ["安全性", "儿童", "语音交互"],
    summary: "本评估针对面向3-8岁儿童的AI语音交互玩具进行全面安全性分析，重点关注隐私保护、内容过滤和数据安全。评估发现该产品在语音识别准确性和响应速度方面表现优秀，但在数据存储加密和家长控制功能方面存在不足。",
    credibility: 92.5,
    credibilityChange: "+1.5%",
    score: 9.2,
    scoreChange: "+0.8%",
    chartData: {
      radar: [
        { name: "语音识别", weight: 0.85, value: 85 },
        { name: "内容安全", weight: 0.78, value: 78 },
        { name: "隐私保护", weight: 0.65, value: 65 },
        { name: "数据加密", weight: 0.70, value: 70 },
        { name: "家长控制", weight: 0.60, value: 60 },
        { name: "系统稳定", weight: 0.88, value: 88 }
      ],
      line: [
        { month: "08", value: 65 },
        { month: "09", value: 72 },
        { month: "10", value: 80 },
        { month: "11", value: 92 }
      ]
    },
    agents: {
      overall: true,
      agent1: true,
      agent2: false
    }
  },
  {
    id: "1002",
    prompt: "大型语言模型在医疗诊断辅助中的可靠性与伦理评估",
    response_summary: "本研究评估了大型语言模型在医疗诊断辅助中的可靠性和伦理问题。研究表明，当前模型在常见疾病诊断建议方面准确率达到87%，但在罕见病识别和紧急情况处理方面存在明显不足。同时，模型在医疗隐私保护和知情同意等伦理方面需要进一步完善。",
    created_by: "Rita",
    created_from: "医疗AI研究中心",
    created_at: { seconds: 1714291200 },
    step: [
      {
        agent: "Claude",
        score: [
          {
            version: "1.0",
            confidence: "0.87",
            score: "0.87",
            consumed_points: 85,
            description: "该模型在医疗诊断辅助方面表现良好，但在罕见病识别和紧急情况处理方面存在不足。",
            dimension: [
              { latitude: "诊断准确", weight: 0.87 },
              { latitude: "罕见病识别", weight: 0.62 },
              { latitude: "紧急处理", weight: 0.58 },
              { latitude: "隐私保护", weight: 0.75 },
              { latitude: "知情同意", weight: 0.70 },
              { latitude: "医患沟通", weight: 0.82 }
            ],
            updated_at: { seconds: 1714291200 }
          }
        ],
        reason: "在常见疾病诊断方面表现良好，但罕见病识别和紧急情况处理需要改进"
      },
      {
        agent: "GPT-4",
        score: [
          {
            version: "1.0",
            confidence: "0.890",
            score: "0.89",
            consumed_points: 90,
            description: "该大语言模型在常见疾病诊断方面准确率高，医患沟通能力强，但在罕见病识别和紧急情况处理方面表现欠佳。",
            dimension: [
              { latitude: "诊断准确", weight: 0.89 },
              { latitude: "罕见病识别", weight: 0.65 },
              { latitude: "紧急处理", weight: 0.60 },
              { latitude: "隐私保护", weight: 0.78 },
              { latitude: "知情同意", weight: 0.73 },
              { latitude: "医患沟通", weight: 0.85 }
            ],
            updated_at: { seconds: 1714291210 }
          }
        ],
        reason: "诊断准确率良好，但需要加强罕见病识别能力"
      },
      {
        agent: "DeepSeek",
        score: [
          {
            version: "1.0",
            confidence: "0.855",
            score: "0.86",
            consumed_points: 82,
            description: "模型在医疗诊断辅助中具有一定可靠性，但伦理问题处理不够完善，特别是在知情同意和隐私保护方面。",
            dimension: [
              { latitude: "诊断准确", weight: 0.86 },
              { latitude: "罕见病识别", weight: 0.61 },
              { latitude: "紧急处理", weight: 0.57 },
              { latitude: "隐私保护", weight: 0.72 },
              { latitude: "知情同意", weight: 0.68 },
              { latitude: "医患沟通", weight: 0.80 }
            ],
            updated_at: { seconds: 1714291220 }
          }
        ],
        reason: "医疗诊断辅助可靠性尚可，但伦理问题处理需要改进"
      },
      {
        agent: "Agent2",
        score: [
          {
            version: "1.0",
            confidence: "0.850",
            score: "0.85",
            consumed_points: 80,
            description: "该模型可以辅助医生进行常见疾病诊断，但在处理复杂和罕见病例时准确率下降明显，医疗伦理方面需要加强。",
            dimension: [
              { latitude: "诊断准确", weight: 0.85 },
              { latitude: "罕见病识别", weight: 0.59 },
              { latitude: "紧急处理", weight: 0.55 },
              { latitude: "隐私保护", weight: 0.73 },
              { latitude: "知情同意", weight: 0.67 },
              { latitude: "医患沟通", weight: 0.81 }
            ],
            updated_at: { seconds: 1714291230 }
          }
        ],
        reason: "可辅助常见疾病诊断，但复杂病例处理和伦理方面有待提高"
      }
    ],
    title: "大型语言模型在医疗诊断辅助中的可靠性与伦理评估",
    author: {
      id: "2",
      name: "Rita",
      avatar: null
    },
    source: "医疗AI研究中心",
    tags: ["医疗", "伦理", "诊断"],
    summary: "本研究评估了大型语言模型在医疗诊断辅助中的可靠性和伦理问题。研究表明，当前模型在常见疾病诊断建议方面准确率达到87%，但在罕见病识别和紧急情况处理方面存在明显不足。同时，模型在医疗隐私保护和知情同意等伦理方面需要进一步完善。",
    credibility: 87.0,
    credibilityChange: "+2.3%",
    score: 8.7,
    scoreChange: "+1.2%",
    chartData: {
      radar: [
        { name: "诊断准确", weight: 0.87, value: 87 },
        { name: "罕见病识别", weight: 0.62, value: 62 },
        { name: "紧急处理", weight: 0.58, value: 58 },
        { name: "隐私保护", weight: 0.75, value: 75 },
        { name: "知情同意", weight: 0.70, value: 70 },
        { name: "医患沟通", weight: 0.82, value: 82 }
      ],
      line: [
        { month: "08", value: 70 },
        { month: "09", value: 75 },
        { month: "10", value: 82 },
        { month: "11", value: 87 }
      ]
    },
    agents: {
      overall: true,
      agent1: false,
      agent2: true
    }
  },
  {
    id: "1003",
    prompt: "自动驾驶AI系统在极端天气条件下的安全性与决策能力评估",
    response_summary: "本评估针对三款市场领先的自动驾驶AI系统在暴雨、大雾、暴雪等极端天气条件下的表现进行了系统测试。结果显示，所有系统在标准天气条件下表现良好，但在能见度低于50米的环境中，决策准确率显著下降，存在安全隐患。建议加强传感器融合和极端天气适应性训练。",
    created_by: "David",
    created_from: "交通安全研究院",
    created_at: { seconds: 1714204800 },
    step: [
      {
        agent: "DeepSeek",
        score: [
          {
            version: "1.0",
            confidence: "0.94",
            score: "0.94",
            consumed_points: 120,
            description: "自动驾驶系统在标准天气条件下表现良好，但在极端天气条件下存在决策准确率下降的问题。",
            dimension: [
              { latitude: "标准天气", weight: 0.95 },
              { latitude: "暴雨条件", weight: 0.78 },
              { latitude: "大雾条件", weight: 0.65 },
              { latitude: "暴雪条件", weight: 0.62 },
              { latitude: "夜间行驶", weight: 0.85 },
              { latitude: "紧急制动", weight: 0.90 }
            ],
            updated_at: { seconds: 1714204800 }
          }
        ],
        reason: "在标准天气条件下表现优秀，但极端天气条件下需要改进"
      },
      {
        agent: "GPT-4",
        score: [
          {
            version: "1.0",
            confidence: "0.935",
            score: "0.94",
            consumed_points: 115,
            description: "自动驾驶系统在标准天气和夜间行驶中表现出色，紧急制动反应迅速，但在暴雨、大雾和暴雪等极端条件下感知能力下降。",
            dimension: [
              { latitude: "标准天气", weight: 0.94 },
              { latitude: "暴雨条件", weight: 0.76 },
              { latitude: "大雾条件", weight: 0.63 },
              { latitude: "暴雪条件", weight: 0.60 },
              { latitude: "夜间行驶", weight: 0.86 },
              { latitude: "紧急制动", weight: 0.91 }
            ],
            updated_at: { seconds: 1714204810 }
          }
        ],
        reason: "标准条件下表现优异，但极端天气条件下感知能力需要提升"
      },
      {
        agent: "Claude",
        score: [
          {
            version: "1.0",
            confidence: "0.925",
            score: "0.93",
            consumed_points: 110,
            description: "评测的自动驾驶系统在良好天气条件和应急响应方面表现出色，但在极端天气条件下传感器性能和决策质量明显下降。",
            dimension: [
              { latitude: "标准天气", weight: 0.93 },
              { latitude: "暴雨条件", weight: 0.75 },
              { latitude: "大雾条件", weight: 0.62 },
              { latitude: "暴雪条件", weight: 0.61 },
              { latitude: "夜间行驶", weight: 0.84 },
              { latitude: "紧急制动", weight: 0.89 }
            ],
            updated_at: { seconds: 1714204820 }
          }
        ],
        reason: "标准天气下性能良好，但极端天气条件下传感器性能需要提升"
      },
      {
        agent: "Agent2",
        score: [
          {
            version: "1.0",
            confidence: "0.915",
            score: "0.92",
            consumed_points: 105,
            description: "自动驾驶系统在一般道路和天气条件下可靠性高，但在极端天气条件下，特别是能见度低于50米时，决策能力显著降低。",
            dimension: [
              { latitude: "标准天气", weight: 0.92 },
              { latitude: "暴雨条件", weight: 0.74 },
              { latitude: "大雾条件", weight: 0.60 },
              { latitude: "暴雪条件", weight: 0.59 },
              { latitude: "夜间行驶", weight: 0.83 },
              { latitude: "紧急制动", weight: 0.88 }
            ],
            updated_at: { seconds: 1714204830 }
          }
        ],
        reason: "一般条件下可靠性高，但极端天气下决策能力有待提高"
      }
    ],
    title: "自动驾驶AI系统在极端天气条件下的安全性与决策能力评估",
    author: {
      id: "3",
      name: "David",
      avatar: null
    },
    source: "交通安全研究院",
    tags: ["自动驾驶", "安全", "极端天气"],
    summary: "本评估针对三款市场领先的自动驾驶AI系统在暴雨、大雾、暴雪等极端天气条件下的表现进行了系统测试。结果显示，所有系统在标准天气条件下表现良好，但在能见度低于50米的环境中，决策准确率显著下降，存在安全隐患。建议加强传感器融合和极端天气适应性训练。",
    credibility: 94.0,
    credibilityChange: "+3.5%",
    score: 9.4,
    scoreChange: "+1.8%",
    chartData: {
      radar: [
        { name: "标准天气", weight: 0.95, value: 95 },
        { name: "暴雨条件", weight: 0.78, value: 78 },
        { name: "大雾条件", weight: 0.65, value: 65 },
        { name: "暴雪条件", weight: 0.62, value: 62 },
        { name: "夜间行驶", weight: 0.85, value: 85 },
        { name: "紧急制动", weight: 0.90, value: 90 }
      ],
      line: [
        { month: "08", value: 75 },
        { month: "09", value: 82 },
        { month: "10", value: 88 },
        { month: "11", value: 94 }
      ]
    },
    agents: {
      overall: true,
      agent1: false,
      agent2: true
    }
  }
];

// 任务卡片数据 - 符合 Protocol Buffers API 规范
export const taskCardsData = [
  {
    id: "101",
    prompt: "开发儿童AI玩具安全评估框架",
    response_summary: "建立一套针对3-12岁儿童AI玩具的安全评估框架，包括隐私保护、内容安全、物理安全和交互设计四个维度的评估标准和测试方法。",
    created_by: "Jackson",
    created_from: "Alibaba",
    created_at: { seconds: 1714377600 },
    status: "进行中",
    step: [
      {
        agent: "GPT-4",
        score: [
          {
            version: "1.0",
            confidence: "0.95",
            score: "0.95",
            consumed_points: 110,
            description: "该评估框架全面覆盖了儿童AI玩具的安全性评估维度，包括隐私保护、内容安全、物理安全和交互设计。",
            dimension: [
              { latitude: "隐私保护", weight: 0.85 },
              { latitude: "内容安全", weight: 0.90 },
              { latitude: "物理安全", weight: 0.95 },
              { latitude: "交互设计", weight: 0.80 },
              { latitude: "数据处理", weight: 0.75 },
              { latitude: "合规性", weight: 0.92 }
            ],
            updated_at: { seconds: 1714377600 }
          }
        ],
        reason: "评估框架设计全面，涵盖了儿童AI玩具安全性的关键维度"
      },
      {
        agent: "Claude",
        score: [
          {
            version: "1.0",
            confidence: "0.93",
            score: "0.93",
            consumed_points: 105,
            description: "框架结构合理，评估维度全面，特别是在物理安全方面的标准制定非常详细，但数据处理部分可以进一步细化。",
            dimension: [
              { latitude: "隐私保护", weight: 0.83 },
              { latitude: "内容安全", weight: 0.92 },
              { latitude: "物理安全", weight: 0.97 },
              { latitude: "交互设计", weight: 0.82 },
              { latitude: "数据处理", weight: 0.72 },
              { latitude: "合规性", weight: 0.90 }
            ],
            updated_at: { seconds: 1714377610 }
          }
        ],
        reason: "物理安全标准制定详细，但数据处理部分需要细化"
      },
      {
        agent: "DeepSeek",
        score: [
          {
            version: "1.0",
            confidence: "0.92",
            score: "0.92",
            consumed_points: 100,
            description: "评估框架在合规性方面考虑全面，覆盖了国际主要儿童隐私保护法规，但交互设计部分的评估标准可以更加具体化。",
            dimension: [
              { latitude: "隐私保护", weight: 0.87 },
              { latitude: "内容安全", weight: 0.88 },
              { latitude: "物理安全", weight: 0.94 },
              { latitude: "交互设计", weight: 0.76 },
              { latitude: "数据处理", weight: 0.78 },
              { latitude: "合规性", weight: 0.95 }
            ],
            updated_at: { seconds: 1714377620 }
          }
        ],
        reason: "合规性考虑全面，但交互设计评估标准需要更具体"
      },
      {
        agent: "Agent2",
        score: [
          {
            version: "1.0",
            confidence: "0.90",
            score: "0.90",
            consumed_points: 95,
            description: "框架整体设计合理，尤其是内容安全维度的评估方法详尽，但在隐私保护方面的加密标准仍有提升空间。",
            dimension: [
              { latitude: "隐私保护", weight: 0.80 },
              { latitude: "内容安全", weight: 0.93 },
              { latitude: "物理安全", weight: 0.92 },
              { latitude: "交互设计", weight: 0.83 },
              { latitude: "数据处理", weight: 0.76 },
              { latitude: "合规性", weight: 0.89 }
            ],
            updated_at: { seconds: 1714377630 }
          }
        ],
        reason: "内容安全评估方法详尽，隐私保护加密标准需要提升"
      }
    ],
    title: "开发儿童AI玩具安全评估框架",
    author: {
      id: "1",
      name: "Jackson",
      avatar: null
    },
    source: "Alibaba",
    tags: ["儿童安全", "AI玩具", "评估框架"],
    summary: "建立一套针对3-12岁儿童AI玩具的安全评估框架，包括隐私保护、内容安全、物理安全和交互设计四个维度的评估标准和测试方法。",
    credibility: 95.0,
    credibilityChange: "+2.5%",
    score: 9.5,
    scoreChange: "+0.8%",
    chartData: {
      radar: [
        { name: "隐私保护", weight: 0.85, value: 85 },
        { name: "内容安全", weight: 0.90, value: 90 },
        { name: "物理安全", weight: 0.95, value: 95 },
        { name: "交互设计", weight: 0.80, value: 80 },
        { name: "数据处理", weight: 0.75, value: 75 },
        { name: "合规性", weight: 0.92, value: 92 }
      ],
      line: [
        { month: "08", value: 75 },
        { month: "09", value: 82 },
        { month: "10", value: 88 },
        { month: "11", value: 95 }
      ]
    },
    agents: {
      overall: true,
      agent1: true,
      agent2: false
    }
  },
  {
    id: "102",
    prompt: "医疗AI系统伦理评估工具开发",
    response_summary: "开发一套针对医疗AI系统的伦理评估工具，重点关注患者隐私保护、知情同意、诊断透明度和医患关系等伦理问题，为医疗AI系统的伦理审查提供标准化工具。",
    created_by: "Rita",
    created_from: "医疗AI研究中心",
    created_at: { seconds: 1714291200 },
    status: "待启动",
    step: [
      {
        agent: "Claude",
        score: [
          {
            version: "1.0",
            confidence: "0.85",
            score: "0.85",
            consumed_points: 95,
            description: "该伦理评估工具关注了医疗AI系统的关键伦理问题，包括患者隐私保护、知情同意、诊断透明度和医患关系。",
            dimension: [
              { latitude: "隐私保护", weight: 0.80 },
              { latitude: "知情同意", weight: 0.75 },
              { latitude: "诊断透明", weight: 0.85 },
              { latitude: "医患关系", weight: 0.90 },
              { latitude: "数据安全", weight: 0.82 },
              { latitude: "算法公平", weight: 0.78 }
            ],
            updated_at: { seconds: 1714291200 }
          }
        ],
        reason: "评估工具设计合理，但在知情同意和隐私保护方面需要进一步完善"
      },
      {
        agent: "GPT-4",
        score: [
          {
            version: "1.0",
            confidence: "0.87",
            score: "0.87",
            consumed_points: 100,
            description: "评估工具在医患关系维度的指标设计非常细致，但算法公平性评估的方法学支持不足，需要补充更多验证案例。",
            dimension: [
              { latitude: "隐私保护", weight: 0.82 },
              { latitude: "知情同意", weight: 0.78 },
              { latitude: "诊断透明", weight: 0.87 },
              { latitude: "医患关系", weight: 0.93 },
              { latitude: "数据安全", weight: 0.84 },
              { latitude: "算法公平", weight: 0.74 }
            ],
            updated_at: { seconds: 1714291210 }
          }
        ],
        reason: "医患关系维度设计细致，算法公平性评估方法学支持不足"
      },
      {
        agent: "DeepSeek",
        score: [
          {
            version: "1.0",
            confidence: "0.83",
            score: "0.83",
            consumed_points: 90,
            description: "评估工具能够有效识别诊断透明度问题，但知情同意流程的评估标准过于简化，缺乏针对不同患者群体的调整机制。",
            dimension: [
              { latitude: "隐私保护", weight: 0.81 },
              { latitude: "知情同意", weight: 0.70 },
              { latitude: "诊断透明", weight: 0.88 },
              { latitude: "医患关系", weight: 0.87 },
              { latitude: "数据安全", weight: 0.80 },
              { latitude: "算法公平", weight: 0.76 }
            ],
            updated_at: { seconds: 1714291220 }
          }
        ],
        reason: "诊断透明度评估有效，知情同意评估缺乏针对性"
      },
      {
        agent: "Agent2",
        score: [
          {
            version: "1.0",
            confidence: "0.80",
            score: "0.80",
            consumed_points: 85,
            description: "该工具在数据安全评估方面提供了详细的检查清单，但在算法公平性和医患关系维度的量化指标有待完善。",
            dimension: [
              { latitude: "隐私保护", weight: 0.79 },
              { latitude: "知情同意", weight: 0.73 },
              { latitude: "诊断透明", weight: 0.82 },
              { latitude: "医患关系", weight: 0.84 },
              { latitude: "数据安全", weight: 0.88 },
              { latitude: "算法公平", weight: 0.72 }
            ],
            updated_at: { seconds: 1714291230 }
          }
        ],
        reason: "数据安全评估详细，算法公平性量化指标有待完善"
      }
    ],
    title: "医疗AI系统伦理评估工具开发",
    author: {
      id: "2",
      name: "Rita",
      avatar: null
    },
    source: "医疗AI研究中心",
    tags: ["医疗AI", "伦理", "评估工具"],
    summary: "开发一套针对医疗AI系统的伦理评估工具，重点关注患者隐私保护、知情同意、诊断透明度和医患关系等伦理问题，为医疗AI系统的伦理审查提供标准化工具。",
    credibility: 85.0,
    credibilityChange: "+3.5%",
    score: 8.5,
    scoreChange: "+1.5%",
    chartData: {
      radar: [
        { name: "隐私保护", weight: 0.80, value: 80 },
        { name: "知情同意", weight: 0.75, value: 75 },
        { name: "诊断透明", weight: 0.85, value: 85 },
        { name: "医患关系", weight: 0.90, value: 90 },
        { name: "数据安全", weight: 0.82, value: 82 },
        { name: "算法公平", weight: 0.78, value: 78 }
      ],
      line: [
        { month: "08", value: 65 },
        { month: "09", value: 72 },
        { month: "10", value: 78 },
        { month: "11", value: 85 }
      ]
    },
    agents: {
      overall: true,
      agent1: false,
      agent2: true
    }
  },
  {
    id: "103",
    prompt: "自动驾驶AI系统安全评估标准研究",
    response_summary: "研究制定自动驾驶AI系统的安全评估标准，包括感知能力、决策逻辑、极端情况处理和系统鲁棒性等方面，为自动驾驶技术的安全监管提供科学依据。",
    created_by: "David",
    created_from: "交通安全研究院",
    created_at: { seconds: 1714204800 },
    status: "已完成",
    step: [
      {
        agent: "DeepSeek",
        score: [
          {
            version: "1.0",
            confidence: "0.92",
            score: "0.92",
            consumed_points: 105,
            description: "该安全评估标准全面覆盖了自动驾驶AI系统的关键安全维度，包括感知能力、决策逻辑、极端情况处理和系统鲁棒性。",
            dimension: [
              { latitude: "感知能力", weight: 0.88 },
              { latitude: "决策逻辑", weight: 0.92 },
              { latitude: "极端处理", weight: 0.85 },
              { latitude: "系统鲁棒", weight: 0.90 },
              { latitude: "安全冗余", weight: 0.95 },
              { latitude: "人机交互", weight: 0.87 }
            ],
            updated_at: { seconds: 1714204800 }
          }
        ],
        reason: "评估标准研究全面，为自动驾驶技术的安全监管提供了科学依据"
      },
      {
        agent: "GPT-4",
        score: [
          {
            version: "1.0",
            confidence: "0.94",
            score: "0.94",
            consumed_points: 110,
            description: "研究在极端情况处理评估方面提出了创新方法，特别是对恶劣天气、复杂道路等场景下的系统行为评估非常系统。",
            dimension: [
              { latitude: "感知能力", weight: 0.90 },
              { latitude: "决策逻辑", weight: 0.93 },
              { latitude: "极端处理", weight: 0.95 },
              { latitude: "系统鲁棒", weight: 0.92 },
              { latitude: "安全冗余", weight: 0.94 },
              { latitude: "人机交互", weight: 0.88 }
            ],
            updated_at: { seconds: 1714204810 }
          }
        ],
        reason: "极端情况处理评估方法创新，系统性强"
      },
      {
        agent: "Claude",
        score: [
          {
            version: "1.0",
            confidence: "0.90",
            score: "0.90",
            consumed_points: 100,
            description: "评估标准在安全冗余设计方面尤为突出，但人机交互评估指标可以进一步细化，特别是驾驶员接管场景的评估。",
            dimension: [
              { latitude: "感知能力", weight: 0.87 },
              { latitude: "决策逻辑", weight: 0.90 },
              { latitude: "极端处理", weight: 0.86 },
              { latitude: "系统鲁棒", weight: 0.89 },
              { latitude: "安全冗余", weight: 0.96 },
              { latitude: "人机交互", weight: 0.82 }
            ],
            updated_at: { seconds: 1714204820 }
          }
        ],
        reason: "安全冗余设计评估突出，人机交互评估需要细化"
      },
      {
        agent: "Agent2",
        score: [
          {
            version: "1.0",
            confidence: "0.89",
            score: "0.89",
            consumed_points: 95,
            description: "研究在决策逻辑评估方面提供了详细的测试用例和评分标准，但在感知能力验证的量化指标上还有提升空间。",
            dimension: [
              { latitude: "感知能力", weight: 0.82 },
              { latitude: "决策逻辑", weight: 0.95 },
              { latitude: "极端处理", weight: 0.84 },
              { latitude: "系统鲁棒", weight: 0.88 },
              { latitude: "安全冗余", weight: 0.92 },
              { latitude: "人机交互", weight: 0.85 }
            ],
            updated_at: { seconds: 1714204830 }
          }
        ],
        reason: "决策逻辑评估详细完善，感知能力验证指标有提升空间"
      }
    ],
    title: "自动驾驶AI系统安全评估标准研究",
    author: {
      id: "3",
      name: "David",
      avatar: null
    },
    source: "交通安全研究院",
    tags: ["自动驾驶", "安全标准", "AI评估"],
    summary: "研究制定自动驾驶AI系统的安全评估标准，包括感知能力、决策逻辑、极端情况处理和系统鲁棒性等方面，为自动驾驶技术的安全监管提供科学依据。",
    credibility: 92.0,
    credibilityChange: "+4.0%",
    score: 9.2,
    scoreChange: "+1.2%",
    chartData: {
      radar: [
        { name: "感知能力", weight: 0.88, value: 88 },
        { name: "决策逻辑", weight: 0.92, value: 92 },
        { name: "极端处理", weight: 0.85, value: 85 },
        { name: "系统鲁棒", weight: 0.90, value: 90 },
        { name: "安全冗余", weight: 0.95, value: 95 },
        { name: "人机交互", weight: 0.87, value: 87 }
      ],
      line: [
        { month: "08", value: 75 },
        { month: "09", value: 82 },
        { month: "10", value: 88 },
        { month: "11", value: 92 }
      ]
    },
    agents: {
      overall: true,
      agent1: true,
      agent2: false
    }
  }
];

// 资产模拟数据 - 更新并丰富内容
export const assetData = [
  {
    id: "asset-template-001",
    name: "通用评估模板",
    response_summary: "这是一个通用评估模板，适用于各类AI系统的评估和测试，包含了对模型能力、安全性和可用性的全面评估指标。",
    created_by: "赵明",
    created_from: "Alibaba",
    created_at: "2023-10-15T08:30:00Z",
    keywords: ["评估", "模板", "AI系统", "安全性"],
    dimensions: [],
    type: "template",
    usage_count: 128,
    confidence: 0.92,
    score: 0.88
  },
  {
    id: "asset-template-002",
    name: "对话系统评估框架",
    response_summary: "专为对话系统设计的评估框架，包含流畅度、一致性、信息准确性和用户体验等关键指标的评估方法。",
    created_by: "李华",
    created_from: "community",
    created_at: "2023-09-22T10:15:00Z",
    keywords: ["对话系统", "评估", "流畅度", "用户体验"],
    dimensions: [],
    type: "template",
    usage_count: 86,
    confidence: 0.85,
    score: 0.79
  },
  {
    id: "asset-template-003",
    name: "代码生成评估规范",
    response_summary: "一套用于评估代码生成模型的标准规范，涵盖代码质量、功能正确性、安全性和可读性等多个维度。",
    created_by: "张伟",
    created_from: "workspace",
    created_at: "2023-11-05T14:20:00Z",
    keywords: ["代码生成", "评估", "质量", "安全性"],
    dimensions: [],
    type: "template",
    usage_count: 64,
    confidence: 0.88,
    score: 0.85
  },
  {
    id: "asset-template-004",
    name: "多模态模型评估套件",
    response_summary: "针对处理图像、文本和音频的多模态AI模型的评估套件，提供标准化的测试流程和评分标准。",
    created_by: "王芳",
    created_from: "Alibaba",
    created_at: "2023-10-28T09:40:00Z",
    keywords: ["多模态", "评估", "图像", "音频", "文本"],
    dimensions: [],
    type: "template",
    usage_count: 45,
    confidence: 0.80,
    score: 0.76
  },
  {
    id: "asset-scene-001",
    name: "客服对话场景",
    response_summary: "模拟电商客服对话的场景，包含商品咨询、订单查询、退换货处理等多种客服情境，适用于对话模型的训练和评估。",
    created_by: "陈琳",
    created_from: "workspace",
    created_at: "2023-11-10T11:30:00Z",
    keywords: [],
    dimensions: ["客服", "电商", "对话", "咨询"],
    type: "scene",
    usage_count: 112,
    confidence: 0.94,
    score: 0.90
  },
  {
    id: "asset-scene-002",
    name: "金融分析场景",
    response_summary: "金融领域的数据分析场景，涵盖市场分析、风险评估、投资建议等金融业务场景，适合评估模型在金融领域的专业能力。",
    created_by: "刘强",
    created_from: "community",
    created_at: "2023-09-18T15:45:00Z",
    keywords: [],
    dimensions: ["金融", "分析", "风险评估", "投资"],
    type: "scene",
    usage_count: 78,
    confidence: 0.87,
    score: 0.82
  },
  {
    id: "asset-scene-003",
    name: "医疗咨询场景",
    response_summary: "包含常见医疗咨询、症状分析和健康建议的医疗场景，用于评估模型在医疗健康领域的知识准确性和责任边界把握。",
    created_by: "张伟",
    created_from: "Alibaba",
    created_at: "2023-10-05T13:20:00Z",
    keywords: [],
    dimensions: ["医疗", "咨询", "健康", "症状"],
    type: "scene",
    usage_count: 93,
    confidence: 0.89,
    score: 0.86
  },
  {
    id: "asset-scene-004",
    name: "教育辅导场景",
    response_summary: "涵盖K12和高等教育的学习辅导场景，包含答疑解惑、知识讲解和学习规划等教育应用场景。",
    created_by: "王芳",
    created_from: "workspace",
    created_at: "2023-11-15T10:10:00Z",
    keywords: [],
    dimensions: ["教育", "辅导", "K12", "答疑"],
    type: "scene",
    usage_count: 65,
    confidence: 0.82,
    score: 0.78
  },
  {
    id: "asset-mix-001",
    name: "代码审查助手",
    response_summary: "集成了代码审查模板和开发场景的综合资产，帮助开发团队提高代码质量和安全性。",
    created_by: "马超",
    created_from: "community",
    created_at: "2023-10-20T16:15:00Z",
    keywords: ["代码审查", "开发", "质量"],
    dimensions: ["编程", "安全", "团队协作"],
    type: "template",
    usage_count: 58,
    confidence: 0.91,
    score: 0.87
  },
  {
    id: "asset-mix-002",
    name: "旅游规划助手",
    response_summary: "结合旅游场景和行程规划模板的资产，为用户提供个性化的旅游建议和详细行程安排。",
    created_by: "林小",
    created_from: "Alibaba",
    created_at: "2023-09-30T09:25:00Z",
    keywords: ["旅游", "规划", "行程"],
    dimensions: ["出行", "预算", "景点"],
    type: "scene",
    usage_count: 72,
    confidence: 0.84,
    score: 0.81
  },
  {
    id: "asset-mix-003",
    name: "法律咨询框架",
    response_summary: "法律咨询场景与法律建议模板的组合资产，适用于提供基础法律信息和指导的AI系统。",
    created_by: "郑重",
    created_from: "workspace",
    created_at: "2023-11-08T14:50:00Z",
    keywords: ["法律", "咨询", "建议"],
    dimensions: ["合同", "纠纷", "权益"],
    type: "template",
    usage_count: 44,
    confidence: 0.83,
    score: 0.79
  },
  {
    id: "asset-mix-004",
    name: "内容创作助手",
    response_summary: "融合内容创作场景和创意写作模板的资产，帮助用户进行文章、脚本和创意内容的创作。",
    created_by: "Jackson",
    created_from: "community",
    created_at: "2023-10-12T11:40:00Z",
    keywords: ["创作", "写作", "内容"],
    dimensions: ["创意", "文章", "脚本"],
    type: "scene",
    usage_count: 87,
    confidence: 0.86,
    score: 0.83
  },
  {
    id: "asset-template-005",
    name: "安全防护评估标准",
    response_summary: "为大型语言模型提供的安全防护评估标准，包括输入过滤、敏感内容检测、越狱防护等多种安全测试方法。",
    created_by: "李安",
    created_from: "Alibaba",
    created_at: "2023-12-01T10:20:00Z",
    keywords: ["安全", "防护", "越狱", "敏感信息"],
    dimensions: [],
    type: "template",
    usage_count: 102,
    confidence: 0.96,
    score: 0.93
  },
  {
    id: "asset-template-006",
    name: "模型幻觉评估框架",
    response_summary: "专门用于评估大语言模型幻觉问题的框架，提供事实性验证、自洽性检测和不确定性标识的评估方法。",
    created_by: "张学",
    created_from: "community",
    created_at: "2023-11-25T15:10:00Z",
    keywords: ["幻觉", "事实性", "自洽性", "不确定性"],
    dimensions: [],
    type: "template",
    usage_count: 76,
    confidence: 0.89,
    score: 0.85
  },
  {
    id: "asset-scene-005",
    name: "技术支持场景",
    response_summary: "IT技术支持场景集合，包含软件问题诊断、硬件故障排查、网络配置指导等多种技术支持情境。",
    created_by: "王技",
    created_from: "workspace",
    created_at: "2023-10-18T14:30:00Z",
    keywords: [],
    dimensions: ["IT支持", "故障排查", "技术指导", "配置帮助"],
    type: "scene",
    usage_count: 89,
    confidence: 0.90,
    score: 0.88
  },
  {
    id: "asset-scene-006",
    name: "学术写作辅助场景",
    response_summary: "针对学术写作的辅助场景，包含论文结构建议、文献引用规范、学术表达优化等方面的指导。",
    created_by: "Jackson",
    created_from: "Alibaba",
    created_at: "2023-11-28T09:40:00Z",
    keywords: [],
    dimensions: ["学术", "写作", "论文", "引用"],
    type: "scene",
    usage_count: 63,
    confidence: 0.86,
    score: 0.82
  }
];
