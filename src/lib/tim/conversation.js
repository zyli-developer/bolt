/**
 * 腾讯云即时通讯IM会话模块
 */
import { getTIMInstance } from './core';
import TencentCloudChat from '@tencentcloud/chat';

/**
 * 获取会话列表
 * @param {Object} options 可选，获取会话列表的选项
 * @returns {Promise<Array>} 会话列表
 */
export async function getConversationList(options) {
  const tim = getTIMInstance();
  if (!tim) {
    console.error('TIM SDK未初始化，无法获取会话列表');
    return [];
  }

  try {
    const imResponse = await tim.getConversationList(options);
    return imResponse.data.conversationList;
  } catch (error) {
    console.error('获取会话列表失败', error);
    return [];
  }
}

/**
 * 获取指定会话的详细资料
 * @param {String} conversationID 会话ID
 * @returns {Promise<Object>} 会话资料
 */
export async function getConversationProfile(conversationID) {
  const tim = getTIMInstance();
  if (!tim) {
    console.error('TIM SDK未初始化，无法获取会话资料');
    throw new Error('TIM SDK未初始化');
  }

  try {
    const imResponse = await tim.getConversationProfile(conversationID);
    return imResponse.data.conversation;
  } catch (error) {
    console.error(`获取会话资料失败: ${conversationID}`, error);
    throw error;
  }
}

/**
 * 删除会话
 * @param {String} conversationID 会话ID
 * @returns {Promise<Object>} 删除结果
 */
export async function deleteConversation(conversationID) {
  const tim = getTIMInstance();
  if (!tim) {
    console.error('TIM SDK未初始化，无法删除会话');
    throw new Error('TIM SDK未初始化');
  }

  try {
    const imResponse = await tim.deleteConversation(conversationID);
    return imResponse.data;
  } catch (error) {
    console.error(`删除会话失败: ${conversationID}`, error);
    throw error;
  }
}

/**
 * 获取会话未读消息总数
 * @returns {Promise<number>} 未读消息总数
 */
export async function getTotalUnreadMessageCount() {
  const tim = getTIMInstance();
  if (!tim) {
    throw new Error('TIM SDK未初始化，请先初始化SDK');
  }

  try {
    const imResponse = await tim.getTotalUnreadMessageCount();
    console.log('获取未读消息总数成功', imResponse.data);
    
    // 处理不同版本SDK返回格式的差异
    if (typeof imResponse.data === 'number') {
      return imResponse.data;
    } else if (typeof imResponse.data.count === 'number') {
      return imResponse.data.count;
    }
    
    return 0;
  } catch (error) {
    console.error('获取未读消息总数失败', error);
    // 发生错误时返回0
    return 0;
  }
}

/**
 * 创建C2C(单聊)会话
 * @param {String} userID 对方用户ID
 * @returns {Promise<Object>} 会话信息
 */
export async function createC2CConversation(userID) {
  const tim = getTIMInstance();
  if (!tim) {
    console.error('TIM SDK未初始化，无法创建会话');
    throw new Error('TIM SDK未初始化');
  }

  try {
    // 构建会话ID
    const conversationID = `C2C${userID}`;
    
    // 尝试获取已有会话
    try {
      const conversation = await getConversationProfile(conversationID);
      console.log('会话已存在，直接返回', conversation);
      return conversation;
    } catch (e) {
      console.log('会话不存在，将创建新会话');
    }
    
    // 创建新会话，通过发送一条空消息来触发会话创建
    // 构建一个自定义消息，用于创建会话但不显示给用户
    const hiddenMessage = tim.createCustomMessage({
      to: userID,
      conversationType: TencentCloudChat.TYPES.CONV_C2C,
      payload: {
        data: 'CONVERSATION_INIT', // 自定义标识，表示这是会话初始化消息
        description: '会话创建', 
        extension: ''
      }
    });
    
    // 发送消息以创建会话
    await tim.sendMessage(hiddenMessage);
    
    // 获取创建的会话
    const conversation = await getConversationProfile(conversationID);
    return conversation;
  } catch (error) {
    console.error(`创建C2C会话失败: ${userID}`, error);
    throw error;
  }
}

/**
 * 创建群聊会话
 * @param {String} groupID 群组ID
 * @returns {Promise<Object>} 会话信息
 */
export async function createGroupConversation(groupID) {
  const tim = getTIMInstance();
  if (!tim) {
    console.error('TIM SDK未初始化，无法创建群会话');
    throw new Error('TIM SDK未初始化');
  }

  try {
    // 构建会话ID
    const conversationID = `GROUP${groupID}`;
    
    // 尝试获取已有会话
    try {
      const conversation = await getConversationProfile(conversationID);
      console.log('群会话已存在，直接返回', conversation);
      return conversation;
    } catch (e) {
      console.log('群会话不存在，将创建新会话');
    }
    
    // 加入群组
    const joinGroupResult = await tim.joinGroup({ groupID });
    console.log('加入群组结果', joinGroupResult);
    
    // 获取创建的会话
    const conversation = await getConversationProfile(conversationID);
    return conversation;
  } catch (error) {
    console.error(`创建群会话失败: ${groupID}`, error);
    throw error;
  }
}

/**
 * 设置会话已读
 * @param {String} conversationID 会话ID
 * @returns {Promise<Object>} 设置结果
 */
export async function markConversationRead(conversationID) {
  const tim = getTIMInstance();
  if (!tim) {
    console.error('TIM SDK未初始化，无法设置会话已读');
    throw new Error('TIM SDK未初始化');
  }

  try {
    const imResponse = await tim.setMessageRead({ conversationID });
    return imResponse.data;
  } catch (error) {
    console.error(`设置会话已读失败: ${conversationID}`, error);
    throw error;
  }
} 