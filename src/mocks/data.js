export const menuData = [
  {
    id: 1,
    title: "主页",
    path: "/",
    icon: "HomeOutlined",
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
      },
      {
        id: 22,
        title: "团队任务",
        path: "/tasks/team",
      },
    ],
  },
  {
    id: 3,
    title: "联系人",
    path: "/contacts",
    icon: "TeamOutlined",
    expanded: false,
    children: [
      {
        id: 31,
        title: "Jackson",
        path: "/contacts/jackson",
      },
      {
        id: 32,
        title: "财务部",
        path: "/contacts/finance",
      },
    ],
  },
  {
    id: 4,
    title: "资产",
    path: "/assets",
    icon: "AppstoreOutlined",
    expanded: false,
    children: [
      {
        id: 41,
        title: "模板",
        path: "/assets/templates",
      },
      {
        id: 42,
        title: "场景",
        path: "/assets/scenes",
      },
    ],
  },
]

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
