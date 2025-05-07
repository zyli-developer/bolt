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
      // 先清空消息列表，避免显示上一个会话的消息
      setMessages([]);
      
      try {
        console.log(`开始获取用户(${activeUser.id})的聊天消息`);
        const messages = await timService.getChatMessages(activeUser.id);
        
        if (Array.isArray(messages)) {
          console.log(`获取到${messages.length}条消息`, messages.length > 0 ? messages[0] : '无消息');
          setMessages(messages);
        } else {
          console.warn('获取到的消息不是数组:', messages);
          setMessages([]);
        }
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
    if (!message || !message.trim()) {
      console.warn("消息为空，不发送");
      return;
    }
    
    if (!activeUser || !activeUser.id) {
      console.error("没有选择聊天对象，无法发送消息");
      notification.error({
        message: "发送失败",
        description: "请先选择聊天对象"
      });
      return;
    }
    
    if (!sdkReady) {
      console.error("SDK未准备就绪，无法发送消息");
      notification.error({
        message: "发送失败",
        description: "通信服务未就绪，请稍后再试"
      });
      return;
    }
    
    if (sendingMessageRef.current) {
      console.warn("有消息正在发送中，请稍候");
      return;
    }
    
    // 标记为正在发送
    sendingMessageRef.current = true;
    
    try {
      // 生成本地消息ID
      const localMsgId = `local-${Date.now()}`;
      console.log("发送消息:", message, "到用户:", activeUser.id);
      
      // 先添加到本地UI
      setMessages(prev => [...prev, {
        id: localMsgId,
        sender: 'user',
        text: message,
        timestamp: formatDate(new Date()),
        pending: true // 标记为待发送状态
      }]);
      
      // 确保聊天窗口打开
      setIsChatOpen(true);
      
      // 发送消息
      const sentMessage = await timService.sendMessage(activeUser.id, message);
      console.log("消息发送成功，更新本地消息状态", sentMessage);
      
      // 更新本地消息状态
      setMessages(prev => prev.map(msg => 
        msg.id === localMsgId 
          ? { 
              ...msg, 
              id: sentMessage.id || msg.id, 
              pending: false,
              timestamp: sentMessage.timestamp || msg.timestamp 
            } 
          : msg
      ));
      
      // 确保消息成功发送后立即刷新消息列表
      setTimeout(async () => {
        try {
          const messages = await timService.getChatMessages(activeUser.id);
          if (Array.isArray(messages) && messages.length > 0) {
            setMessages(messages);
          }
        } catch (error) {
          console.error("获取最新消息失败:", error);
        }
      }, 500);
      
    } catch (error) {
      console.error("发送消息失败:", error);
      
      // 更新本地消息状态为发送失败
      setMessages(prev => prev.map(msg => 
        msg.pending ? { ...msg, error: true, pending: false, errorMessage: error.message } : msg
      ));
      
      let errorMessage = "消息发送失败，请稍后重试";
      
      // 针对特定错误提供更友好的提示
      if (error.message && error.message.includes('TIM SDK未初始化')) {
        errorMessage = "通信服务未就绪，请刷新页面后重试";
      } else if (error.message && error.message.includes('重复发送')) {
        errorMessage = "请勿频繁发送相同消息";
      }
      
      notification.error({
        message: "发送失败",
        description: error.message || errorMessage
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

  /**
   * 切换当前活跃聊天用户
   * @param {Object} user 用户对象
   */
  const switchActiveUser = (user) => {
    if (!user) {
      console.warn('用户对象为空，无法切换聊天');
      return;
    }
    
    // 如果没有id但有conversationID，从conversationID中提取id
    if (!user.id && user.conversationID) {
      // conversationID格式为 "C2C{userId}" 或 "GROUP{groupId}"
      const prefix = user.conversationID.startsWith('C2C') ? 'C2C' : 'GROUP';
      user.id = user.conversationID.substring(prefix.length);
      user.type = prefix === 'C2C' ? 'user' : 'group';
      console.log(`从conversationID(${user.conversationID})中提取ID: ${user.id}`);
    }
    
    if (!user.id) {
      console.warn('用户对象缺少ID，无法切换聊天', user);
      return;
    }
    
    const isChangingUser = activeUser?.id !== user.id;
    console.log(`切换聊天用户: ${user.id}`, { isChangingUser, user });
    
    // 先清空消息，避免旧消息闪现
    if (isChangingUser) {
      setMessages([]);
      setLoading(true);
    }
    
    // 设置活跃用户
    setActiveUser(user);
    
    // 如果是新用户，确保立即获取消息
    if (isChangingUser && sdkReady) {
      // 使用一个小延迟确保activeUser状态已更新
      setTimeout(async () => {
        try {
          const messages = await timService.getChatMessages(user.id);
          if (Array.isArray(messages)) {
            setMessages(messages);
          }
        } catch (error) {
          console.error("获取聊天消息失败:", error);
        } finally {
          setLoading(false);
        }
      }, 100);
    }
    
    // 打开聊天窗口
    setIsChatOpen(true);
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
        createNewChat, // 为了兼容性添加旧函数名
        setMessages,
        setLoading,
        setIsChatOpen, // 添加这个函数到 context 中
        switchActiveUser // 添加用户切换函数
      }}
    >
      {children}
    </ChatContext.Provider>
  )
}
