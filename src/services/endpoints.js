/**
 * API端点配置
 * 集中管理所有API端点
 */

const endpoints = {
  // 卡片相关
  cards: {
    list: "/cards",
    detail: (id) => `/cards/${id}`,
    create: "/cards",
    update: (id) => `/cards/${id}`,
    delete: (id) => `/cards/${id}`,
  },

  // 用户相关
  users: {
    current: "/users/current",
    list: "/users",
    detail: (id) => `/users/${id}`,
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
    detail: (id) => `/workspaces/${id}`,
  },

  // 任务相关
  tasks: {
    list: "/tasks",
    detail: (id) => `/tasks/${id}`,
    create: "/tasks",
    update: (id) => `/tasks/${id}`,
    delete: (id) => `/tasks/${id}`,
  },

  // 评估相关
  evaluations: {
    byTask: (taskId) => `/evaluations/task/${taskId}`,
    detail: (id) => `/evaluations/${id}`,
    reevaluate: "/evaluations/reevaluate",
  },
}

export default endpoints
