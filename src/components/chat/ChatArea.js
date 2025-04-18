"use client"

import { useEffect, useRef, useState } from "react"
import {
  PlusOutlined,
  CloseOutlined,
  ArrowUpOutlined,
  SmileOutlined,
  PictureOutlined,
  FileOutlined,
  AudioOutlined,
  MoreOutlined,
} from "@ant-design/icons"
import { useChatContext } from "../../contexts/ChatContext"
import "./chat-area.css"

const ChatArea = () => {
  const { messages, activeUser, sendMessage, closeChat, loading } = useChatContext()
  const [inputValue, setInputValue] = useState("")
  const messagesEndRef = useRef(null)
  const messagesContainerRef = useRef(null)
  const [showScrollTop, setShowScrollTop] = useState(false)

  // 滚动到底部
  const scrollToBottom = () => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" })
    }
  }

  // 当消息更新时滚动到底部
  useEffect(() => {
    if (messages.length > 0) {
      scrollToBottom()
    }
  }, [messages])

  // 设置滚动监听器
  useEffect(() => {
    const container = messagesContainerRef.current

    const handleScroll = () => {
      if (container) {
        const shouldShow = container.scrollTop > 300
        if (shouldShow !== showScrollTop) {
          setShowScrollTop(shouldShow)
        }
      }
    }

    if (container) {
      container.addEventListener("scroll", handleScroll)
    }

    return () => {
      if (container) {
        container.removeEventListener("scroll", handleScroll)
      }
    }
  }, [showScrollTop])

  // 发送消息
  const handleSendMessage = () => {
    if (inputValue.trim()) {
      sendMessage(inputValue)
      setInputValue("")
    }
  }

  // 处理按键事件
  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage()
    }
  }

  // 滚动到顶部
  const scrollToTop = () => {
    const container = messagesContainerRef.current
    if (container) {
      container.scrollTo({
        top: 0,
        behavior: "smooth",
      })
    }
  }

  return (
    <div className="chat-container">
      {/* 聊天头部 */}
      <div className="chat-header">
        <div className="chat-user-info">
          <div className="chat-user-avatar">
            {activeUser.avatar ? (
              <img src={activeUser.avatar || "/placeholder.svg"} alt={activeUser.name} />
            ) : (
              activeUser.name.charAt(0)
            )}
          </div>
          <div className="chat-user-details">
            <div className="chat-user-name">{activeUser.name}</div>
            <div className="chat-user-status">
              <span className="status-dot"></span>
              <span className="status-text">Active</span>
            </div>
          </div>
        </div>
        <button className="chat-close-btn" onClick={closeChat} type="button">
          <CloseOutlined />
        </button>
      </div>

      {/* 聊天消息区域 */}
      <div className="chat-messages" ref={messagesContainerRef}>
        {loading ? (
          <div style={{ textAlign: "center", padding: "20px" }}>加载消息中...</div>
        ) : (
          <div className="messages-wrapper">
            {messages.map((message, index) => (
              <div
                key={index}
                className={`message-container ${message.sender === "user" ? "message-right" : "message-left"}`}
              >
                <div className={`message-bubble ${message.sender === "user" ? "message-user" : "message-other"}`}>
                  {message.text}
                </div>
                <div className="message-time">{message.timestamp}</div>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>
        )}
      </div>

      {/* 右侧功能区 */}
      <div className="chat-sidebar">
        <button className="sidebar-button" type="button">
          <PlusOutlined />
        </button>
        <div className="sidebar-divider"></div>
        <button className="sidebar-button" type="button">
          <SmileOutlined />
        </button>
        <button className="sidebar-button" type="button">
          <PictureOutlined />
        </button>
        <button className="sidebar-button" type="button">
          <FileOutlined />
        </button>
        <button className="sidebar-button" type="button">
          <AudioOutlined />
        </button>
        <button className="sidebar-button" type="button">
          <MoreOutlined />
        </button>
      </div>

      {/* 回到顶部按钮 */}
      {showScrollTop && (
        <button className="scroll-to-top visible" onClick={scrollToTop} type="button">
          <ArrowUpOutlined />
        </button>
      )}

      {/* 聊天输入区域 */}
      <div className="chat-input-wrapper">
        <div className="chat-input-container">
          <input
            className="chat-input-field"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="请输入文字"
          />
          <div className="chat-input-actions">
            <button className="chat-input-action" type="button">
              <PlusOutlined />
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ChatArea
