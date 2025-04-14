import { rest } from "msw"
import { menuData, chatUsers, cardsData, currentUser } from "./data"

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

  // 获取卡片列表
  rest.get("/api/cards", (req, res, ctx) => {
    return res(ctx.status(200), ctx.json(cardsData))
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
]
