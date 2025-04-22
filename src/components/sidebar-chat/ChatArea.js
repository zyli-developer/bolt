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
import CreateChatModal from "./CreateChatModal"
import "./sidebar-chat.css"

const ChatArea = () => {
  const { 
    messages, 
    activeUser, 
    sendMessage, 
    closeChat, 
    loading, 
    createNewChat, 
    chatUsers,
    switchActiveUser,
  } = useChatContext()

  const [inputValue, setInputValue] = useState("")
  const messagesEndRef = useRef(null)
  const messagesContainerRef = useRef(null)
  const textareaRef = useRef(null)
  const [showScrollTop, setShowScrollTop] = useState(false)
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false)

  // 滚动到底部
  const scrollToBottom = () => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" })
    }
  }

  // 当消息更新时滚动到底部
  useEffect(() => {
    if (messages && messages.length > 0) {
      scrollToBottom()
    }
  }, [messages])

  // 自动调整textarea高度
  useEffect(() => {
    const textarea = textareaRef.current;
    if (textarea) {
      textarea.style.height = 'auto';
      const newHeight = Math.min(150, Math.max(70, textarea.scrollHeight));
      textarea.style.height = `${newHeight}px`;
    }
  }, [inputValue]);

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
      e.preventDefault(); // 阻止默认的换行行为
      handleSendMessage();
    }
    // 允许Shift+Enter进行换行
  }

  // 处理创建新会话
  const handleCreateChat = (type, params) => {
    createNewChat(type, params)
    setIsCreateModalOpen(false)
  }

  // 处理切换会话 - 使用新的 switchActiveUser 函数
  const handleUserChange = (user) => {
    if (user) {
      // 复制用户对象，避免修改原始对象
      const userToSwitch = { ...user };
      
      // 如果没有id但有conversationID，从conversationID中提取
      if (!userToSwitch.id && userToSwitch.conversationID) {
        const prefix = userToSwitch.conversationID.startsWith('C2C') ? 'C2C' : 'GROUP';
        userToSwitch.id = userToSwitch.conversationID.substring(prefix.length);
        userToSwitch.type = prefix === 'C2C' ? 'user' : 'group';
        console.log(`本地提取用户ID: ${userToSwitch.id}，来自conversationID: ${userToSwitch.conversationID}`);
      }
      
      switchActiveUser(userToSwitch);
    } else {
      console.warn('尝试切换到空的用户对象');
    }
  };

  // 检查消息数组是否有效
  const validMessages = Array.isArray(messages) ? messages : [];

  // 确保每个消息都有唯一的key
  const getMessageKey = (message, index) => {
    if (message.id) return message.id;
    if (message.timestamp) return `msg-${message.timestamp}-${index}`;
    return `msg-${Date.now()}-${index}-${Math.random().toString(36).substr(2, 9)}`;
  };

  // 确保每个用户都有唯一的key
  const getUserKey = (user, index) => {
    // 如果有id直接使用
    if (user.id) return `user-${user.id}`;
    
    // 如果有conversationID，从中提取id
    if (user.conversationID) {
      const prefix = user.conversationID.startsWith('C2C') ? 'C2C' : 'GROUP';
      const extractedId = user.conversationID.substring(prefix.length);
      return `user-${prefix}-${extractedId}`;
    }
    
    // 最后的备选方案
    return `user-${index}-${Math.random().toString(36).substr(2, 9)}`;
  };

  // 打印调试信息
  useEffect(() => {
    console.log('ChatArea渲染，消息数量:', validMessages.length, '活跃用户:', activeUser);
  }, [validMessages.length, activeUser]);

  return (
    <div className="chat-container">
      {/* 聊天头部 */}
      <div className="chat-header">
        <div className="chat-user-info">
          <div className="chat-user-avatar">
            {activeUser && activeUser.avatar ? (
              <img src={activeUser.avatar} alt={activeUser?.name || 'User'} />
            ) : (
              <span>{activeUser?.name?.charAt(0) || '?'}</span>
            )}
          </div>
          <div className="chat-user-details">
            <div className="chat-user-name">{activeUser?.name || '未知用户'}</div>
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
        ) : validMessages.length === 0 ? (
          <div style={{ textAlign: "center", padding: "20px", color: "#999" }}>暂无消息，开始聊天吧</div>
        ) : (
          <div className="messages-wrapper">
            {validMessages.map((message, index) => (
              <div
                key={getMessageKey(message, index)}
                className={`message-container ${message.sender === "user" ? "message-right" : "message-left"}`}
              >
                <div className={`message-bubble ${message.sender === "user" ? "message-user" : "message-other"} ${message.pending ? 'pending' : ''} ${message.error ? 'error' : ''}`}>
                  {message.text}
                  {message.pending && <span className="message-status">发送中...</span>}
                  {message.error && (
                    <span className="message-status error" title={message.errorMessage || "发送失败"}>
                      发送失败 {message.errorMessage ? `(${message.errorMessage.substring(0, 20)}${message.errorMessage.length > 20 ? '...' : ''})` : ''}
                    </span>
                  )}
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
        <button className="sidebar-button" type="button" onClick={() => setIsCreateModalOpen(true)}>
          <PlusOutlined />
        </button>
        <div className="sidebar-divider"></div>
        <div className="sidebar-chat-users">
          {chatUsers.map((user, index) => (
            <div 
              key={getUserKey(user, index)}
              className={`sidebar-chat-user ${activeUser?.id === user.id ? 'active' : ''}`}
              onClick={() => handleUserChange(user)}
            >
              <div className="sidebar-chat-avatar">
                {user.avatar ? (
                  <img src={user.avatar} alt={user.name} />
                ) : (
                  <span>{user.name?.charAt(0) || '?'}</span>
                )}
                {user.unreadCount > 0 && (
                  <span className="unread-badge">{user.unreadCount}</span>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 聊天输入区域 */}
      <div className="chat-input-wrapper">
        <div className="chat-input-container">
          <textarea
            className="chat-input-field"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={handleKeyPress}
            placeholder="请输入文字"
            rows={3}
            ref={textareaRef}
          />
          <div className="chat-input-actions">
            <button className="chat-input-action" type="button" onClick={() => setIsCreateModalOpen(true)}>
              <PlusOutlined />
            </button>
            <button 
              className="chat-input-send-btn" 
              type="button" 
              onClick={handleSendMessage}
              disabled={!inputValue.trim()}
            >
              <ArrowUpOutlined />
            </button>
          </div>
        </div>
      </div>

      {/* 创建新会话模态窗口 */}
      {isCreateModalOpen && <CreateChatModal onClose={() => setIsCreateModalOpen(false)} onCreate={handleCreateChat} />}
    </div>
  )
}

export default ChatArea
