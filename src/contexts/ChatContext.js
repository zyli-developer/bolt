"use client"

import { createContext, useContext, useState } from "react"
import { formatDate } from "../utils/dateUtils"

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
  const [messages, setMessages] = useState([
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
  ])

  const toggleChat = () => {
    setIsChatOpen(!isChatOpen)
  }

  const closeChat = () => {
    setIsChatOpen(false)
  }

  const sendMessage = (text) => {
    const newMessage = {
      id: messages.length + 1,
      sender: "user",
      text,
      timestamp: formatDate(new Date()),
    }
    setMessages([...messages, newMessage])

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
  }

  return (
    <ChatContext.Provider
      value={{
        isChatOpen,
        toggleChat,
        closeChat,
        activeUser,
        messages,
        sendMessage,
      }}
    >
      {children}
    </ChatContext.Provider>
  )
}
