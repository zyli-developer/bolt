/**
 * API端点配置
 * 集中管理所有API端点
 */

const endpoints = {
  // 卡片相关（旧API，保留向后兼容）
  cards: {
    list: "/cards",
    detail: (id) => `/cards/${id}`,
    create: "/cards",
    update: (id) => `/cards/${id}`,
    delete: (id) => `/cards/${id}`,
  },

  // 探索相关 (API规范: /v1/syntrust/explorations)
  explorations: {
    list: "/v1/syntrust/explorations",
    detail: (id) => `/v1/syntrust/exploration/${id}`,
    search: "/v1/syntrust/explorations/search",
  },

  // 任务相关 (API规范: /v1/syntrust/tasks)
  tasks: {
    list: "/v1/syntrust/tasks",
    detail: (id) => `/v1/syntrust/task/${id}`,
    search: "/v1/syntrust/tasks/search",
    create: "/v1/syntrust/task",
    update: (id) => `/v1/syntrust/task/${id}`,
    delete: (id) => `/v1/syntrust/task/${id}`,
    qna: (id) => `/v1/syntrust/task/${id}/qna`,
    scenario: (id) => `/v1/syntrust/task/${id}/scenario`,
    flow: (id) => `/v1/syntrust/task/${id}/flow`,
    submitOptimization: "/v1/syntrust/task/optimization",
  },

  // 资产相关 (API规范: /v1/syntrust/assets)
  assets: {
    list: "/v1/syntrust/assets",
    detail: (id) => `/v1/syntrust/asset/${id}`,
    search: "/v1/syntrust/assets/search",
  },

  // 用户相关
  users: {
    current: "/users/current",
    list: "/users",
    detail: (id) => `/users/${id}`,
  },

  // 认证相关
  auth: {
    login: "/v1/syntrust/auth/login",
    logout: "/v1/syntrust/auth/logout",
    refresh: "/v1/syntrust/auth/refresh",
  },

  // 聊天相关
  chat: {
    messages: (userId) => `/chat/messages/${userId}`,
    send: "/chat/messages",
    users: "/chat/users",
  },

  // 菜单相关
  menu: {
    list: "/menu",
  },

  // 工作区相关
  workspace: {
    list: "/workspaces",
    current: "/workspaces/current",
    detail: (id) => `/workspaces/${id}`,
    switch: (id) => `/workspaces/${id}/switch`,
  },

  // 仪表盘相关
  dashboard: {
    overview: "/dashboard/overview",
    stats: "/dashboard/stats",
  },

  // 设置相关
  settings: {
    get: "/settings",
    update: "/settings",
  },

  // 评估相关
  evaluations: {
    byTask: (taskId) => `/evaluations/task/${taskId}`,
    detail: (id) => `/evaluations/${id}`,
    reevaluate: "/evaluations/reevaluate",
  },

  // 筛选相关
  filter: {
    saveView: "/filter/views",
    savedViews: "/filter/views",
    viewDetail: (id) => `/filter/views/${id}`,
    deleteView: (id) => `/filter/views/${id}`,
  },

  // 文件上传相关 (API规范: /v1/syntrust/attachments)
  attachments: {
    upload: "/v1/syntrust/attachments",
  },

  // 机器人对话相关 (API规范: /v1/rbt/chats)
  robotChat: {
    messages: (chatId) => `/v1/rbt/chats/${chatId}/messages`,
  },
}

export default endpoints
