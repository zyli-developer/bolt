"use client"

import { createContext, useContext, useState, useEffect } from "react"
import { formatDate } from "../utils/dateUtils"
import chatService from "../services/chatService"

const ChatContext = createContext()

export const useChatContext = () => useContext(ChatContext)

export const ChatProvider = ({ children }) => {
  const [isChatOpen, setIsChatOpen] = useState(false)
  const [activeUser, setActiveUser] = useState({
    id: 1,
    name: "Rita",
    avatar: null,
    status: "active",
  })
  const [messages, setMessages] = useState([])
  const [chatUsers, setChatUsers] = useState([])
  const [loading, setLoading] = useState(false)

  // 获取聊天用户列表
  useEffect(() => {
    const fetchChatUsers = async () => {
      try {
        const users = await chatService.getChatUsers()
        setChatUsers(users)
        if (users.length > 0 && !activeUser) {
          setActiveUser(users[0])
        }
      } catch (error) {
        console.error("获取聊天用户失败:", error)
      }
    }

    fetchChatUsers()
  }, [])

  // 获取与当前活跃用户的聊天消息
  useEffect(() => {
    if (activeUser && activeUser.id) {
      const fetchMessages = async () => {
        setLoading(true)
        try {
          const messages = await chatService.getChatMessages(activeUser.id)
          setMessages(messages)
        } catch (error) {
          console.error("获取聊天消息失败:", error)
        } finally {
          setLoading(false)
        }
      }

      fetchMessages()
    }
  }, [activeUser])

  const toggleChat = () => {
    setIsChatOpen(!isChatOpen)
  }

  const closeChat = () => {
    setIsChatOpen(false)
  }

  const sendMessage = async (text) => {
    if (!activeUser) return

    const newMessage = {
      id: messages.length + 1,
      sender: "user",
      text,
      timestamp: formatDate(new Date()),
    }
    setMessages([...messages, newMessage])

    try {
      // 调用API发送消息
      await chatService.sendMessage(activeUser.id, text)

      // 模拟AI回复
      setTimeout(() => {
        const aiResponse = {
          id: messages.length + 2,
          sender: "other",
          text: `收到您的消息: "${text}"`,
          timestamp: formatDate(new Date()),
        }
        setMessages((prev) => [...prev, aiResponse])
      }, 1000)
    } catch (error) {
      console.error("发送消息失败:", error)
    }
  }

  const changeActiveUser = (user) => {
    setActiveUser(user)
  }

  return (
    <ChatContext.Provider
      value={{
        isChatOpen,
        toggleChat,
        closeChat,
        activeUser,
        changeActiveUser,
        messages,
        sendMessage,
        chatUsers,
        loading,
      }}
    >
      {children}
    </ChatContext.Provider>
  )
}
