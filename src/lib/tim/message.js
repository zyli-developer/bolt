/**
 * 腾讯云即时通讯IM消息模块
 */
import { getTIMInstance } from './core';
import { CONVERSATION_TYPE, MESSAGE_TYPE } from './constants';
import TencentCloudChat from '@tencentcloud/chat';

// 消息发送防重复缓存 - SDK层面
const messageDeduplicationCache = new Map();

/**
 * 发送文本消息
 * @param {string} text 文本内容
 * @param {string} to 接收方ID
 * @param {boolean} isGroup 是否群聊
 * @returns {Promise<Object>} 消息对象
 */
export async function sendTextMessage(text, to, isGroup = false) {
  const tim = getTIMInstance();
  if (!tim) {
    console.error('TIM SDK未初始化，无法发送消息');
    throw new Error('TIM SDK未初始化');
  }

  const conversationType = isGroup ? CONVERSATION_TYPE.GROUP : CONVERSATION_TYPE.C2C;
  
  // 生成消息唯一键
  const messageKey = `${to}_${conversationType}_${text}_${Date.now().toString().substring(0, 10)}`;
  
  // 检查是否有重复发送（3秒内相同内容到相同接收方）
  if (messageDeduplicationCache.has(messageKey)) {
    console.warn('SDK层检测到重复消息，已阻止发送', { to, text });
    // 返回缓存的消息，避免重复发送
    return messageDeduplicationCache.get(messageKey);
  }
  
  try {
    console.log('开始创建文本消息', { to, isGroup });
    
    // 使用TencentCloudChat.TYPES而不是tim.TYPES
    const convType = isGroup ? TencentCloudChat.TYPES.CONV_GROUP : TencentCloudChat.TYPES.CONV_C2C;
    
    // 创建文本消息
    const message = tim.createTextMessage({
      to,
      conversationType: convType,
      payload: {
        text
      }
    });

    console.log('文本消息创建成功，开始发送');
    
    // 发送消息
    const imResponse = await tim.sendMessage(message);
    console.log('发送文本消息成功', imResponse.data.message);
    
    // 将消息存入缓存
    messageDeduplicationCache.set(messageKey, imResponse.data.message);
    
    // 3秒后清除缓存
    setTimeout(() => {
      messageDeduplicationCache.delete(messageKey);
    }, 3000);
    
    return imResponse.data.message;
  } catch (error) {
    console.error('发送文本消息失败', error);
    throw error;
  }
}

/**
 * 获取消息列表
 * @param {Object} params 参数
 * @returns {Promise<Array>} 消息列表
 */
export async function getMessageList(params) {
  const tim = getTIMInstance();
  if (!tim) {
    console.error('TIM SDK未初始化，无法获取消息列表');
    throw new Error('TIM SDK未初始化');
  }

  const { conversationID, count = 15, nextReqMessageID } = params;
  console.log('getMessageList调用参数:', { conversationID, count, nextReqMessageID });
  
  try {
    // 调用SDK的getMessageList接口获取消息列表
    console.log('开始调用SDK的getMessageList接口');
    const imResponse = await tim.getMessageList({
      conversationID,
      count,
      ...(nextReqMessageID ? { nextReqMessageID } : {})
    });
    
    // 详细打印结果
    console.log(`获取消息列表成功，会话ID: ${conversationID}，响应:`, {
      messageList: imResponse.data.messageList.length,
      isCompleted: imResponse.data.isCompleted,
      nextReqMessageID: imResponse.data.nextReqMessageID
    });
    
    // 打印第一条消息的详情(如果有)
    if (imResponse.data.messageList.length > 0) {
      const firstMsg = imResponse.data.messageList[0];
      console.log('第一条消息示例:', {
        ID: firstMsg.ID,
        type: firstMsg.type,
        from: firstMsg.from,
        to: firstMsg.to,
        flow: firstMsg.flow,
        time: new Date(firstMsg.time * 1000).toLocaleString(),
        payload: firstMsg.payload,
        elements: firstMsg.elements
      });
    }
    
    return imResponse.data.messageList;
  } catch (error) {
    console.error('获取消息列表失败', error);
    throw error;
  }
}

/**
 * 设置消息已读
 * @param {string} conversationID 会话ID
 * @returns {Promise<Object>} 结果
 */
export async function setMessageRead(conversationID) {
  const tim = getTIMInstance();
  if (!tim) {
    console.error('TIM SDK未初始化，无法设置消息已读');
    throw new Error('TIM SDK未初始化');
  }

  try {
    console.log(`设置会话消息已读: ${conversationID}`);
    const imResponse = await tim.setMessageRead({ conversationID });
    return imResponse.data;
  } catch (error) {
    console.error('设置消息已读失败', error);
    throw error;
  }
} 