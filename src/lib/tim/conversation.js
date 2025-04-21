/**
 * 腾讯云即时通讯IM会话模块
 */
import { getTIMInstance } from './core';

/**
 * 获取会话列表
 * @returns {Promise<Array>} 会话列表
 */
export async function getConversationList() {
  const tim = getTIMInstance();
  if (!tim) {
    throw new Error('TIM SDK未初始化，请先初始化SDK');
  }

  try {
    const imResponse = await tim.getConversationList();
    console.log(`获取会话列表成功，共 ${imResponse.data.conversationList.length} 个会话`);
    return imResponse.data.conversationList;
  } catch (error) {
    console.error('获取会话列表失败', error);
    throw error;
  }
}

/**
 * 获取指定会话
 * @param {string} conversationID 会话ID
 * @returns {Promise<Object>} 会话对象
 */
export async function getConversationProfile(conversationID) {
  const tim = getTIMInstance();
  if (!tim) {
    throw new Error('TIM SDK未初始化，请先初始化SDK');
  }

  try {
    const imResponse = await tim.getConversationProfile(conversationID);
    console.log('获取会话资料成功', imResponse.data.conversation);
    return imResponse.data.conversation;
  } catch (error) {
    console.error('获取会话资料失败', error);
    throw error;
  }
}

/**
 * 删除会话
 * @param {string} conversationID 会话ID
 * @returns {Promise<Object>} 结果
 */
export async function deleteConversation(conversationID) {
  const tim = getTIMInstance();
  if (!tim) {
    throw new Error('TIM SDK未初始化，请先初始化SDK');
  }

  try {
    const imResponse = await tim.deleteConversation(conversationID);
    console.log('删除会话成功', conversationID);
    return imResponse.data;
  } catch (error) {
    console.error('删除会话失败', error);
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
 * 创建C2C会话
 * @param {string} userID 用户ID
 * @returns {Promise<Object>} 会话对象
 */
export async function createC2CConversation(userID) {
  const tim = getTIMInstance();
  if (!tim) {
    throw new Error('TIM SDK未初始化，请先初始化SDK');
  }

  const conversationID = `C2C${userID}`;
  
  try {
    // 主动获取会话信息，如果会话不存在，SDK会自动创建
    const conversation = await getConversationProfile(conversationID);
    return conversation;
  } catch (error) {
    console.error('创建C2C会话失败', error);
    throw error;
  }
}

/**
 * 创建群组会话
 * @param {string} groupID 群组ID
 * @returns {Promise<Object>} 会话对象
 */
export async function createGroupConversation(groupID) {
  const tim = getTIMInstance();
  if (!tim) {
    throw new Error('TIM SDK未初始化，请先初始化SDK');
  }

  const conversationID = `GROUP${groupID}`;
  
  try {
    // 主动获取会话信息，如果会话不存在，SDK会自动创建
    const conversation = await getConversationProfile(conversationID);
    return conversation;
  } catch (error) {
    console.error('创建群组会话失败', error);
    throw error;
  }
} 