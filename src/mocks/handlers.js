import { rest } from "msw"
import {
  menuData,
  chatUsers,
  cardsData,
  currentUser,
  tasksData,
  evaluationsData,
  workspacesData,
  currentWorkspace,
} from "./data"

export const handlers = [
  // 获取菜单数据
  rest.get("/api/menu", (req, res, ctx) => {
    return res(ctx.status(200), ctx.json(menuData))
  }),

  // 获取聊天用户列表
  rest.get("/api/chat/users", (req, res, ctx) => {
    return res(ctx.status(200), ctx.json(chatUsers))
  }),

  // 获取聊天消息
  rest.get("/api/chat/messages/:userId", (req, res, ctx) => {
    const { userId } = req.params

    // 模拟消息数据
    const messages = [
      {
        id: 1,
        sender: "other",
        text: "123456789012345678901234",
        timestamp: "2025/12/3 21:52",
      },
      {
        id: 2,
        sender: "user",
        text: "123456789012345678901234",
        timestamp: "2025/12/3 21:52",
      },
    ]

    return res(ctx.status(200), ctx.json(messages))
  }),

  // 发送消息
  rest.post("/api/chat/messages", (req, res, ctx) => {
    const { text, userId } = req.body

    // 模拟发送消息
    const message = {
      id: Date.now(),
      sender: "user",
      text,
      timestamp: new Date().toISOString(),
    }

    return res(ctx.status(201), ctx.json(message))
  }),

  // 获取卡片列表 - 修改为支持scope参数
  rest.get("/api/cards", (req, res, ctx) => {
    // 获取scope参数
    const scope = req.url.searchParams.get("scope") || "community"

    // 根据scope过滤数据
    let filteredCards = [...cardsData]

    if (scope === "workspace") {
      // 模拟工作区范围的卡片 - 只返回source为Alibaba的卡片
      filteredCards = cardsData.filter((card) => card.source === "Alibaba")
    } else if (scope === "personal") {
      // 模拟个人范围的卡片 - 只返回author.id为当前用户ID的卡片
      filteredCards = cardsData.filter((card) => card.author.id === currentUser.id)
    }
    // community范围返回所有卡片

    // 模拟分页
    const page = Number.parseInt(req.url.searchParams.get("page") || "1")
    const limit = Number.parseInt(req.url.searchParams.get("limit") || "10")
    const startIndex = (page - 1) * limit
    const endIndex = startIndex + limit

    // 返回分页后的数据
    return res(ctx.status(200), ctx.json(filteredCards.slice(startIndex, endIndex)))
  }),

  // 获取卡片详情
  rest.get("/api/cards/:id", (req, res, ctx) => {
    const { id } = req.params
    const card = cardsData.find((card) => card.id === Number.parseInt(id))

    if (!card) {
      return res(ctx.status(404), ctx.json({ message: "卡片不存在" }))
    }

    return res(ctx.status(200), ctx.json(card))
  }),

  // 获取当前用户
  rest.get("/api/users/current", (req, res, ctx) => {
    return res(ctx.status(200), ctx.json(currentUser))
  }),

  // 获取用户列表
  rest.get("/api/users", (req, res, ctx) => {
    return res(ctx.status(200), ctx.json([currentUser, ...chatUsers]))
  }),

  // 获取任务列表
  rest.get("/api/tasks", (req, res, ctx) => {
    const type = req.url.searchParams.get("type")

    // 根据类型筛选任务
    let filteredTasks = [...tasksData]
    if (type === "my") {
      filteredTasks = tasksData.filter((task) => task.author.id === currentUser.id)
    } else if (type === "team") {
      filteredTasks = tasksData.filter((task) => task.permission === "workspace")
    }

    return res(ctx.status(200), ctx.json(filteredTasks))
  }),

  // 创建任务
  rest.post("/api/tasks", async (req, res, ctx) => {
    const taskData = await req.json()

    // 生成新任务ID
    const newId = tasksData.length > 0 ? Math.max(...tasksData.map((t) => t.id)) + 1 : 1001

    // 创建新任务对象
    const newTask = {
      ...taskData,
      id: newId,
      updatedAt: new Date()
        .toLocaleString("zh-CN", {
          hour: "2-digit",
          minute: "2-digit",
          year: "numeric",
          month: "2-digit",
          day: "2-digit",
        })
        .replace(/\//g, "/"),
      updatedBy: currentUser,
    }

    // 添加到任务数据中
    tasksData.push(newTask)

    return res(ctx.status(201), ctx.json(newTask))
  }),

  // 获取任务详情
  rest.get("/api/tasks/:id", (req, res, ctx) => {
    const { id } = req.params
    const task = tasksData.find((task) => task.id === Number.parseInt(id))

    if (!task) {
      return res(ctx.status(404), ctx.json({ message: "任务不存在" }))
    }

    return res(ctx.status(200), ctx.json(task))
  }),

  // 获取评估数据
  rest.get("/api/evaluations/task/:taskId", (req, res, ctx) => {
    const { taskId } = req.params
    const evaluation = evaluationsData.find((item) => item.taskId === Number.parseInt(taskId))

    if (!evaluation) {
      return res(ctx.status(404), ctx.json({ message: "评估数据不存在" }))
    }

    return res(ctx.status(200), ctx.json(evaluation))
  }),

  // 获取评估详情
  rest.get("/api/evaluations/:id", (req, res, ctx) => {
    const { id } = req.params
    const evaluation = evaluationsData.find((item) => item.id === id)

    if (!evaluation) {
      return res(ctx.status(404), ctx.json({ message: "评估数据不存在" }))
    }

    return res(ctx.status(200), ctx.json(evaluation))
  }),

  // 重新评估
  rest.post("/api/evaluations/reevaluate", async (req, res, ctx) => {
    const { evaluationId, optimizationInput } = await req.json()
    const evaluation = evaluationsData.find((item) => item.id === evaluationId)

    if (!evaluation) {
      return res(ctx.status(404), ctx.json({ message: "评估数据不存在" }))
    }

    // 模拟重新评估，返回相同的数据
    return res(ctx.status(200), ctx.json(evaluation))
  }),

  // 在 handlers 数组中添加工作区相关的 API 处理程序

  // 获取工作区列表
  rest.get("/api/workspaces", (req, res, ctx) => {
    return res(ctx.status(200), ctx.json(workspacesData))
  }),

  // 获取当前工作区
  rest.get("/api/workspaces/current", (req, res, ctx) => {
    return res(ctx.status(200), ctx.json(currentWorkspace))
  }),

  // 获取工作区详情
  rest.get("/api/workspaces/:id", (req, res, ctx) => {
    const { id } = req.params
    const workspace = workspacesData.find((ws) => ws.id === Number.parseInt(id))

    if (!workspace) {
      return res(ctx.status(404), ctx.json({ message: "工作区不存在" }))
    }

    // 如果请求的是当前工作区，返回详细信息
    if (workspace.id === currentWorkspace.id) {
      return res(ctx.status(200), ctx.json(currentWorkspace))
    }

    // 否则返回基本信息
    return res(ctx.status(200), ctx.json(workspace))
  }),

  // 切换当前工作区
  rest.post("/api/workspaces/switch/:id", (req, res, ctx) => {
    const { id } = req.params
    const workspace = workspacesData.find((ws) => ws.id === Number.parseInt(id))

    if (!workspace) {
      return res(ctx.status(404), ctx.json({ message: "工作区不存在" }))
    }

    // 更新当前工作区
    workspacesData.forEach((ws) => {
      ws.current = ws.id === Number.parseInt(id)
    })

    return res(ctx.status(200), ctx.json({ success: true, workspace }))
  }),
]
