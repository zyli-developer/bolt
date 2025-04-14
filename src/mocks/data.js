// 菜单数据
export const menuData = [
  {
    id: 1,
    title: "探索",
    path: "/explore",
    icon: "SearchOutlined",
    active: true,
  },
  {
    id: 2,
    title: "任务",
    path: "/tasks",
    icon: "FileOutlined",
    expanded: true,
    children: [
      {
        id: 21,
        title: "我的任务",
        path: "/tasks/my",
        icon: "FileOutlined",
      },
      {
        id: 22,
        title: "团队任务",
        path: "/tasks/team",
        icon: "FileOutlined",
      },
    ],
  },
  {
    id: 3,
    title: "资产",
    path: "/assets",
    icon: "AppstoreOutlined",
    expanded: false,
    children: [
      {
        id: 31,
        title: "模板",
        path: "/assets/templates",
        icon: "AppstoreOutlined",
      },
      {
        id: 32,
        title: "我的模板",
        path: "/assets/my-templates",
        icon: "AppstoreOutlined",
      },
      {
        id: 33,
        title: "别人的模板",
        path: "/assets/others-templates",
        icon: "AppstoreOutlined",
      },
    ],
  },
  {
    id: 4,
    title: "场景",
    path: "/scenes",
    icon: "AppstoreOutlined",
    expanded: false,
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
