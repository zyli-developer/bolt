"use client"

import React, { createContext, useContext, useState, useEffect, useRef } from "react"
import { formatDate } from "../utils/dateUtils"
import * as timService from "../services/timService"
import { notification } from "antd"
import { TIM_EVENT } from "../lib/tim/constants"

const ChatContext = createContext()

export const useChatContext = () => useContext(ChatContext)

export const ChatProvider = ({ children }) => {
  const [isChatOpen, setIsChatOpen] = useState(false)
  const [activeUser, setActiveUser] = useState(null)
  const [messages, setMessages] = useState([])
  const [chatUsers, setChatUsers] = useState([])
  const [loading, setLoading] = useState(false)
  const [initialized, setInitialized] = useState(false)
  const [sdkReady, setSdkReady] = useState(false)
  const sendingMessageRef = useRef(false)

  // 初始化TIM
  useEffect(() => {
    const initializeChat = async () => {
      try {
        // 初始化TIM SDK
        const initResult = await timService.initTIM();
        if (!initResult) {
          console.error("TIM SDK初始化失败");
          return;
        }
        
        // 添加SDK_READY事件监听
        timService.addEventListener(TIM_EVENT.SDK_READY, () => {
          console.log("SDK已准备就绪");
          setSdkReady(true);
        });

        // 添加SDK_NOT_READY事件监听
        timService.addEventListener(TIM_EVENT.SDK_NOT_READY, () => {
          console.log("SDK未准备就绪");
          setSdkReady(false);
        });
        
        // 登录TIM
        await timService.loginTIM();
        setInitialized(true);
        console.log("TIM登录成功，等待SDK Ready");
      } catch (error) {
        console.error("聊天初始化失败:", error);
      }
    };

    initializeChat();
    
    // 组件卸载时清理
    return () => {
      if (initialized) {
        timService.removeEventListener(TIM_EVENT.SDK_READY, () => {});
        timService.removeEventListener(TIM_EVENT.SDK_NOT_READY, () => {});
        timService.logoutTIM().catch(err => {
          console.error("登出失败:", err);
        });
      }
    };
  }, []);

  // 监听新消息事件
  useEffect(() => {
    if (!initialized) return;
    
    // 添加消息接收监听器
    const handleMessageReceived = event => {
      console.log('收到新消息:', event);
      // 检查消息是否属于当前活跃会话
      if (activeUser && event.data) {
        const newMessages = event.data.filter(msg => {
          // 根据消息的conversationID判断是否属于当前会话
          const isGroupMessage = msg.conversationType === 'GROUP';
          const msgFromId = isGroupMessage ? `GROUP${msg.to}` : `C2C${msg.from}`;
          const msgToId = isGroupMessage ? `GROUP${msg.to}` : `C2C${msg.to}`;
          
          const currentConvID = activeUser.conversationID || 
                               (activeUser.type === 'group' ? `GROUP${activeUser.id}` : `C2C${activeUser.id}`);
          
          return msgFromId === currentConvID || msgToId === currentConvID;
        });
        
        if (newMessages.length > 0) {
          // 转换消息格式并添加到当前消息列表
          const formattedMessages = newMessages.map(msg => ({
            id: msg.ID || `tmp-${Date.now()}-${Math.random()}`,
            sender: msg.flow === 'in' ? 'other' : 'user',
            text: msg.payload?.text || msg.elements?.[0]?.content?.text || '',
            timestamp: formatDate(new Date(msg.time * 1000))
          }));
          
          setMessages(prev => [...prev, ...formattedMessages]);
        }
      }
    };
    
    // 添加会话列表更新监听器
    const handleConversationListUpdated = event => {
      console.log('会话列表更新:', event);
      // 刷新会话列表
      if (sdkReady) {
        timService.getChatUsers().then(users => {
          if (Array.isArray(users) && users.length > 0) {
            setChatUsers(users);
          }
        }).catch(err => {
          console.error("获取会话列表失败:", err);
        });
      }
    };
    
    // 注册事件监听
    timService.addEventListener(TIM_EVENT.MESSAGE_RECEIVED, handleMessageReceived);
    timService.addEventListener(TIM_EVENT.CONVERSATION_LIST_UPDATED, handleConversationListUpdated);
    
    // 清理函数
    return () => {
      timService.removeEventListener(TIM_EVENT.MESSAGE_RECEIVED, handleMessageReceived);
      timService.removeEventListener(TIM_EVENT.CONVERSATION_LIST_UPDATED, handleConversationListUpdated);
    };
  }, [initialized, activeUser, sdkReady]);

  // 获取聊天用户列表 - 仅在SDK就绪后执行
  useEffect(() => {
    if (!initialized || !sdkReady) return;
    
    console.log("SDK已就绪，开始获取会话列表");
    const fetchChatUsers = async () => {
      try {
        // 获取聊天用户
        const users = await timService.getChatUsers();
        
        // 确保用户列表有效
        if (Array.isArray(users) && users.length > 0) {
          setChatUsers(users);
          
          // 从会话列表中查找ID为@RBT#001的用户
          const robotUser = users.find(user => user.id === "@RBT#001");
          
          if (robotUser) {
            // 如果找到机器人用户，设置为活跃用户
            setActiveUser(robotUser);
            setIsChatOpen(true); // 自动打开聊天窗口
          } else if (users.length > 0) {
            // 如果没找到但有其他用户，设置第一个用户为活跃用户
            setActiveUser(users[0]);
          }
        } else {
          console.log("没有聊天用户可用，创建默认用户");
          // 创建一个默认用户
          const defaultUser = {
            id: "@RBT#001",
            name: "智能助手",
            avatar: null,
            status: "active",
            type: "user"
          };
          
          // 尝试创建默认会话
          try {
            await timService.createNewChat('C2C', { userID: defaultUser.id });
            setChatUsers([defaultUser]);
            setActiveUser(defaultUser);
          } catch (err) {
            console.error("创建默认会话失败:", err);
            setChatUsers([]);
          }
        }
      } catch (error) {
        console.error("获取聊天用户失败:", error);
        setChatUsers([]);
      }
    };

    fetchChatUsers();
  }, [initialized, sdkReady]);

  // 获取与当前活跃用户的聊天消息
  useEffect(() => {
    if (!initialized || !sdkReady || !activeUser || !activeUser.id) return;
    
    const fetchMessages = async () => {
      setLoading(true);
      try {
        const messages = await timService.getChatMessages(activeUser.id);
        setMessages(Array.isArray(messages) ? messages : []);
      } catch (error) {
        console.error("获取聊天消息失败:", error);
        setMessages([]); // 出错时设置为空数组
      } finally {
        setLoading(false);
      }
    };

    fetchMessages();
  }, [activeUser, initialized, sdkReady]);

  const toggleChat = () => {
    setIsChatOpen(!isChatOpen);
  };

  const closeChat = () => {
    setIsChatOpen(false);
  };

  // 发送消息
  const sendMessage = async (message) => {
    console.log('发送消息调用栈:', new Error().stack);
    // 检查是否有正在发送的消息
    if (!message || !message.trim() || !activeUser || !activeUser.id || !sdkReady || sendingMessageRef.current) return;
    
    // 标记为正在发送
    sendingMessageRef.current = true;
    
    try {
      // 生成本地消息ID
      const localMsgId = `local-${Date.now()}`;
      console.log("发送消息:", message);
      // 先添加到本地UI
      setMessages(prev => [...prev, {
        id: localMsgId,
        sender: 'user',
        text: message,
        timestamp: formatDate(new Date()),
        pending: true // 标记为待发送状态
      }]);
      
      // 发送消息
      const sentMessage = await timService.sendMessage(activeUser.id, message);
      
      // 更新本地消息状态
      setMessages(prev => prev.map(msg => 
        msg.id === localMsgId 
          ? { ...msg, id: sentMessage.id || msg.id, pending: false } 
          : msg
      ));
      
      // 不再手动获取消息列表，完全依靠事件监听更新
    } catch (error) {
      console.error("发送消息失败:", error);
      
      // 更新本地消息状态为发送失败
      setMessages(prev => prev.map(msg => 
        msg.pending ? { ...msg, error: true, pending: false } : msg
      ));
      
      notification.error({
        message: "发送失败",
        description: error.message || "消息发送失败，请稍后重试"
      });
    } finally {
      // 设置一个延迟，防止快速连续点击
      setTimeout(() => {
        sendingMessageRef.current = false;
      }, 300);
    }
  };

  const createChat = async (type, params) => {
    if (!initialized) return null;
    
    try {
      return await timService.createNewChat(type, params);
    } catch (error) {
      console.error("创建聊天失败:", error);
      return null;
    }
  };
  
  // 为了兼容性保留原函数名
  const createNewChat = async (type, params) => {
    return createChat(type, params);
  };

  return (
    <ChatContext.Provider
      value={{
        isChatOpen,
        toggleChat,
        closeChat,
        activeUser,
        setActiveUser,
        messages,
        sendMessage,
        chatUsers,
        loading,
        createChat,
        createNewChat // 为了兼容性添加旧函数名
      }}
    >
      {children}
    </ChatContext.Provider>
  )
}
