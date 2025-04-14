"use client"

import { useEffect, useRef, useState } from "react"
import { Input, Button, Avatar, Typography } from "antd"
import { SendOutlined, PlusOutlined, CloseOutlined } from "@ant-design/icons"
import { useChatContext } from "../../contexts/ChatContext"

const { Text } = Typography

const ChatArea = () => {
  const { messages, activeUser, sendMessage, closeChat, loading } = useChatContext()
  const [inputValue, setInputValue] = useState("")
  const messagesEndRef = useRef(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const handleSendMessage = () => {
    if (inputValue.trim()) {
      sendMessage(inputValue)
      setInputValue("")
    }
  }

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage()
    }
  }

  return (
    <div className="chat-container">
      {/* 聊天头部 */}
      <div className="chat-header">
        <div className="chat-user-info">
          <Avatar size={40} src={activeUser.avatar} style={{ backgroundColor: "#f0f0f0" }}>
            {activeUser.name.charAt(0)}
          </Avatar>
          <div className="chat-user-details">
            <Text strong style={{ fontSize: 16 }}>
              {activeUser.name}
            </Text>
            <div className="chat-user-status">
              <span className="status-dot"></span>
              <Text type="secondary" className="status-text">
                Active
              </Text>
            </div>
          </div>
        </div>
        <Button
          type="text"
          icon={<CloseOutlined />}
          onClick={closeChat}
          className="chat-close-btn"
          style={{ color: "#8f9098" }}
        />
      </div>

      {/* 聊天消息区域 */}
      <div className="chat-messages">
        {loading ? (
          <div style={{ textAlign: "center", padding: "20px" }}>加载消息中...</div>
        ) : (
          messages.map((message, index) => (
            <div
              key={index}
              className={`message-container ${message.sender === "user" ? "message-right" : "message-left"}`}
            >
              <div className={`message-bubble ${message.sender === "user" ? "message-user" : "message-other"}`}>
                {message.text}
              </div>
              <div className="message-time">{message.timestamp}</div>
            </div>
          ))
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* 聊天输入区域 */}
      <div className="chat-input-wrapper">
        <div className="chat-input-container">
          <Input
            placeholder="请输入文字"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyPress={handleKeyPress}
            className="chat-input-field"
            suffix={
              <Button type="text" icon={<PlusOutlined />} className="chat-input-action" style={{ color: "#8f9098" }} />
            }
            bordered={false}
          />
          <Button
            type="primary"
            shape="circle"
            icon={<SendOutlined />}
            onClick={handleSendMessage}
            className="chat-send-btn"
            style={{ backgroundColor: "#006ffd" }}
          />
        </div>
      </div>
    </div>
  )
}

export default ChatArea
