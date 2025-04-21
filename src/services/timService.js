/**
 * 腾讯云即时通讯IM服务封装
 */
import * as TIM from '../lib/tim';
import { formatDate } from '../utils/dateUtils';

// IM配置
const TIM_CONFIG = {
  SDKAppID: 1600079965, // 实际的应用ID
  logLevel: TIM.LOG_LEVEL.INFO
};

// 密钥信息（实际生产环境中应由服务端生成userSig）
const SECRET_KEY = 'ebcf82816948352f178ab661fc1a6ae4165615843afb5b41f58df74a92847cb4';

// 当前登录用户信息
let currentUserInfo = {
  userID: 'test-123456',
  userSig: 'eJwtzFELgjAUhuH-sttKzjbPdEIXQRBSF1FGdRltxaFcojPK6L9n6uX3vPB9WLbaBk9bsoSJANi422Ss83Shjr2t-IQLGaIacmVup6IgwxKuACDSWmFf7Kug0raOiKJNvXrK-xaFEoHHYtCKru17Dq6uH*9oY87z5b2JM93IbJFqDrvR4eiOs3UpU*X2KNMp*-4ABiwx2g__'
};

// 消息去重缓存
const sentMessageCache = new Set();

/**
 * 获取当前登录用户信息
 * @returns {Object} 用户信息
 */
export function getCurrentUserInfo() {
  return { ...currentUserInfo };
}

/**
 * 初始化TIM
 * @returns {Promise} 初始化结果
 */
export async function initTIM() {
  try {
    await TIM.initTIMSDK(TIM_CONFIG);
    console.log('TIM SDK初始化成功');
    return true;
  } catch (error) {
    console.error('TIM SDK初始化失败', error);
    return false;
  }
}

/**
 * 登录TIM
 * @param {string} userID 用户ID
 * @param {string} userSig 用户签名
 * @returns {Promise} 登录结果
 */
export async function loginTIM(userID = currentUserInfo.userID, userSig = currentUserInfo.userSig) {
  try {
    // 先检查是否已经登录
    if (TIM.isLogin()) {
      // 如果当前用户已登录，避免重复登录
      console.log('用户已登录，无需重复登录', { userID });
      return { userID, repeatLogin: true };
    }
    
    // 登录新用户
    const result = await TIM.login({ userID, userSig });
    console.log('TIM登录成功', result);
    return result;
  } catch (error) {
    console.error('TIM登录失败', error);
    throw error;
  }
}

/**
 * 登出TIM
 * @returns {Promise} 登出结果
 */
export async function logoutTIM() {
  try {
    const result = await TIM.logout();
    console.log('TIM登出成功');
    return result;
  } catch (error) {
    console.error('TIM登出失败', error);
    throw error;
  }
}

/**
 * 获取聊天用户列表
 * @returns {Promise<Array>} 用户列表
 */
export async function getChatUsers() {
  try {
    // 获取会话列表
    const conversationList = await TIM.getConversationList();
    
    // 转换为ChatContext需要的格式
    return conversationList.map(conversation => {
      const isGroup = conversation.type === 'GROUP';
      const profile = isGroup ? conversation.groupProfile : conversation.userProfile;
      
      return {
        id: isGroup ? conversation.groupID : conversation.userID,
        name: isGroup ? profile.name : profile.nick,
        avatar: profile.avatar,
        status: profile.statusType === 'Online' ? 'active' : 'offline',
        conversationID: conversation.conversationID,
        unreadCount: conversation.unreadCount || 0,
        lastMessage: conversation.lastMessage?.messageForShow || '',
        type: isGroup ? 'group' : 'user'
      };
    });
  } catch (error) {
    console.error('获取聊天用户列表失败', error);
    throw error;
  }
}

/**
 * 获取与指定用户的聊天消息
 * @param {string|number} userId 用户ID
 * @returns {Promise<Array>} 消息列表
 */
export async function getChatMessages(userId) {
  if (!userId) {
    console.error('获取消息失败: userId不能为空');
    return [];
  }
  
  try {
    // 根据userId构建会话ID
    const isGroup = typeof userId === 'string' && userId.startsWith('GROUP');
    const pureId = String(userId).replace(/^(GROUP|C2C)/, '');
    const conversationID = isGroup ? `GROUP${pureId}` : `C2C${pureId}`;
    
    // 获取会话资料（如果不存在会创建）
    try {
      await TIM.getConversationProfile(conversationID);
    } catch (convError) {
      console.warn(`获取会话资料失败: ${conversationID}`, convError);
      // 即使获取会话失败也继续尝试获取消息
    }
    
    // 获取消息列表
    const messageList = await TIM.getMessageList({
      conversationID,
      count: 20
    });
    
    // 确保messageList是数组
    if (!Array.isArray(messageList)) {
      console.warn(`获取到的消息列表格式不正确: ${typeof messageList}`);
      return [];
    }
    
    // 标记消息已读
    try {
      await TIM.setMessageRead(conversationID);
    } catch (readError) {
      console.warn(`设置消息已读失败: ${conversationID}`, readError);
      // 设置已读失败不影响消息获取
    }
    
    // 转换为ChatContext需要的格式
    return messageList.map(message => ({
      id: message.ID || `temp-${Date.now()}-${Math.random()}`,
      sender: message.flow === 'in' ? 'other' : 'user',
      text: message.payload?.text || message.elements?.[0]?.content?.text || '',
      timestamp: formatDate(new Date(message.time * 1000))
    }));
  } catch (error) {
    console.error('获取聊天消息失败', error);
    return []; // 出错时返回空数组
  }
}

/**
 * 发送聊天消息
 * @param {string|number} userId 用户ID
 * @param {string} text 消息内容
 * @returns {Promise} 发送结果
 */
export async function sendMessage(userId, text) {
  try {
    // 生成消息唯一标识（用户ID + 消息内容 + 精确到秒的时间戳）
    const messageKey = `${userId}_${text}_${Math.floor(Date.now() / 1000)}`;
    
    // 检查是否已发送过该消息（5秒内相同内容）
    if (sentMessageCache.has(messageKey)) {
      console.warn('消息发送重复，已忽略', { userId, text });
      throw new Error('消息重复发送');
    }
    
    // 添加到缓存中
    sentMessageCache.add(messageKey);
    console.log('添加消息到缓存', messageKey);
    
    // 5秒后从缓存中移除
    setTimeout(() => {
      sentMessageCache.delete(messageKey);
      console.log('从缓存中移除消息', messageKey);
    }, 5000);
    
    // 根据userId构建会话ID和类型
    const isGroup = typeof userId === 'string' && userId.startsWith('GROUP');
    const pureId = String(userId).replace(/^(GROUP|C2C)/, '');
    
    // 发送文本消息
    const message = await TIM.sendTextMessage(text, pureId, isGroup);
    
    // 转换为ChatContext需要的格式
    return {
      id: message.ID,
      sender: 'user',
      text,
      timestamp: formatDate(new Date())
    };
  } catch (error) {
    console.error('发送消息失败', error);
    throw error;
  }
}

/**
 * 创建新会话
 * @param {string} type 会话类型，'C2C'或'GROUP'
 * @param {Object} params 参数
 * @returns {Promise} 创建结果
 */
export async function createNewChat(type, params) {
  try {
    let conversation;
    
    if (type === 'C2C') {
      conversation = await TIM.createC2CConversation(params.userID);
    } else if (type === 'GROUP') {
      conversation = await TIM.createGroupConversation(params.groupID);
    } else {
      throw new Error(`不支持的会话类型: ${type}`);
    }
    
    // 转换为ChatContext需要的格式
    const isGroup = type === 'GROUP';
    const profile = isGroup ? conversation.groupProfile : conversation.userProfile;
    
    return {
      id: isGroup ? conversation.groupID : conversation.userID,
      name: isGroup ? profile.name : profile.nick,
      avatar: profile.avatar,
      status: 'active',
      conversationID: conversation.conversationID,
      type: isGroup ? 'group' : 'user'
    };
  } catch (error) {
    console.error('创建新会话失败', error);
    throw error;
  }
}

/**
 * 添加事件监听
 * @param {string} eventName 事件名称
 * @param {Function} callback 回调函数
 */
export function addEventListener(eventName, callback) {
  try {
    // 使用TIM模块的addEventListener函数
    TIM.addEventListener(eventName, callback);
    console.log(`已添加事件监听: ${eventName}`);
  } catch (error) {
    console.error(`添加事件监听失败: ${eventName}`, error);
  }
}

/**
 * 移除事件监听
 * @param {string} eventName 事件名称
 * @param {Function} callback 回调函数
 */
export function removeEventListener(eventName, callback) {
  try {
    // 使用TIM模块的removeEventListener函数
    TIM.removeEventListener(eventName, callback);
    console.log(`已移除事件监听: ${eventName}`);
  } catch (error) {
    console.error(`移除事件监听失败: ${eventName}`, error);
  }
} 