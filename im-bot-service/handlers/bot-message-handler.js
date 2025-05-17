/**
 * 机器人消息处理器
 * 
 * 用于处理机器人收到的消息，并调用AI服务获取回复
 */

const { IM, Bots } = require('../config');
const logger = require('../utils/logger');
const imService = require('../services/im-service');
const aiService = require('../services/ai-service');
const { getBotUserSig } = require('../utils/initialize-bots');

// 消息缓存，用于防止重复处理同一条消息
// 结构: { messageId: { timestamp: Number, processed: Boolean } }
const messageCache = new Map();

// 缓存过期时间（毫秒），5分钟后清理
const CACHE_EXPIRATION = 5 * 60 * 1000;

/**
 * 生成消息唯一标识符
 * @param {string} fromAccount - 发送方账号
 * @param {string} toAccount - 接收方账号
 * @param {string} text - 消息文本
 * @param {number} timestamp - 消息时间戳
 * @returns {string} - 唯一标识符
 */
function generateMessageId(fromAccount, toAccount, text, timestamp) {
  // 结合发送方、接收方、消息内容和时间（精确到分钟）创建唯一标识
  const timeMinute = Math.floor(timestamp / 60000) * 60000;
  return `${fromAccount}_${toAccount}_${text}_${timeMinute}`;
}

/**
 * 清理过期的消息缓存
 */
function cleanupMessageCache() {
  const now = Date.now();
  let expiredCount = 0;
  for (const [messageId, data] of messageCache.entries()) {
    if (now - data.timestamp > CACHE_EXPIRATION) {
      messageCache.delete(messageId);
      expiredCount++;
    }
  }
  if (expiredCount > 0) {
    logger.info(`消息缓存清理----Cleaned up ${expiredCount} expired message(s) from cache. Current cache size: ${messageCache.size}`);
  }
}

// 定期清理缓存
setInterval(cleanupMessageCache, CACHE_EXPIRATION);

/**
 * 处理机器人收到的单聊消息
 * @param {Object} callbackBody - 回调请求体
 * @returns {Promise<void>}
 */
async function handleC2CMessage(callbackBody) {
  try {
    const fromAccount = callbackBody.From_Account;
    const toAccount = callbackBody.To_Account;
    const msgSeq = callbackBody.MsgSeq || 'unknown';
    
    logger.info(`[回调接收] 收到单聊消息----Received C2C message callback from=${fromAccount} to=${toAccount} msgSeq=${msgSeq}`);
    logger.debug(`[回调详情] 单聊消息内容----C2C message details: ${JSON.stringify(callbackBody)}`);
    
    // 检查接收方是否是机器人
    if (!toAccount.startsWith('@RBT#')) {
      logger.warn(`[回调处理] 消息未发送到机器人----Message not sent to a bot: ${toAccount}`);
      return;
    }
    
    // 检查发送方是否是机器人，防止循环对话
    if (fromAccount.startsWith('@RBT#')) {
      logger.warn(`[回调处理] 消息来自另一个机器人----Message from another bot, ignoring to prevent loops: ${fromAccount}`);
      return;
    }
    
    // 查找对应的机器人配置
    const botConfig = aiService.findBotConfig(toAccount);
    if (!botConfig) {
      logger.warn(`[回调处理] 未知机器人ID----Received message for unknown bot ID: ${toAccount}`);
      // 仍然处理消息，但使用默认配置
    } else {
      logger.info(`[回调处理] 找到机器人配置----Found bot config: ${botConfig.Name} (${botConfig.BotID}), AI Provider: ${botConfig.AIProvider || botConfig.Provider}`);
    }
    
    // 提取消息文本
    const msgBodyList = callbackBody.MsgBody || [];
    for (const msgBody of msgBodyList) {
      // 只处理文本消息
      if (msgBody.MsgType !== 'TIMTextElem') {
        logger.info(`[回调处理] 跳过非文本消息----Skipping non-text message type: ${msgBody.MsgType}`);
        continue;
      }
      
      const msgContent = msgBody.MsgContent || {};
      const text = msgContent.Text || '';
      
      if (!text.trim()) {
        logger.info(`[回调处理] 跳过空消息----Skipping empty message`);
        continue;
      }
      
      logger.info(`[回调处理] 收到用户消息----Received message from ${fromAccount}: "${text}"`);
      
      // 生成消息唯一标识符
      const msgTimestamp = callbackBody.MsgTimestamp || Date.now() / 1000;
      const messageId = generateMessageId(fromAccount, toAccount, text, msgTimestamp * 1000);
      logger.debug(`[回调处理] 消息ID----Generated message ID: ${messageId}`);
      
      // 检查消息是否已处理
      if (messageCache.has(messageId)) {
        logger.warn(`[回调处理] 消息重复----Duplicate message detected, skipping: ${messageId}`);
        continue;
      }
      
      // 将消息标记为正在处理
      messageCache.set(messageId, { 
        timestamp: Date.now(),
        processed: false
      });
      logger.info(`[回调处理] 开始处理消息----Started processing message ${messageId}`);
      
      try {
        // 调用AI服务获取回复
        logger.info(`[AI请求] 开始调用AI服务----Requesting AI response for message: "${text}"`);
        const startTime = Date.now();
        const aiResponse = await aiService.getAIResponse(text, fromAccount, botConfig);
        const endTime = Date.now();
        logger.info(`[AI响应] 收到AI回复----Received AI response after ${endTime - startTime}ms, length: ${aiResponse.length} chars`);
        
        // 记录完整的AI回复内容
        logger.info(`[AI响应] 单聊AI回复内容----C2C AI response content: "${aiResponse}"`);
        
        // 获取机器人的UserSig
        const botUserSig = getBotUserSig(toAccount);
        logger.debug(`[发送消息] 获取到UserSig----Got UserSig for bot ${toAccount}`);
        
        // 发送AI回复
        logger.info(`[发送消息] 开始发送回复----Sending response from ${toAccount} to ${fromAccount}`);
        const sendStartTime = Date.now();
        const sendResult = await imService.sendC2CTextMessage(
          toAccount,    // 机器人ID作为发送方
          fromAccount,  // 用户ID作为接收方
          aiResponse
        );
        const sendEndTime = Date.now();
        
        // 记录发送结果
        if (sendResult && sendResult.MsgSeq) {
          logger.info(`[发送消息] 回复消息发送成功----Response sent successfully, MsgSeq=${sendResult.MsgSeq}, took ${sendEndTime - sendStartTime}ms`);
        } else {
          logger.warn(`[发送消息] 回复消息发送成功但没有MsgSeq----Response sent but no MsgSeq returned`);
        }
        
        // 标记消息为已处理
        messageCache.set(messageId, { 
          timestamp: Date.now(),
          processed: true
        });
        
        // 记录完整处理时间
        const totalProcessingTime = Date.now() - messageCache.get(messageId).timestamp;
        logger.info(`[处理完成] 单聊消息处理完成----C2C message processing complete, total time: ${totalProcessingTime}ms`);
      } catch (error) {
        // 处理失败时仍保留缓存记录，防止重复处理
        messageCache.set(messageId, { 
          timestamp: Date.now(),
          processed: true,
          error: true
        });
        
        logger.error(`[处理失败] 单聊消息处理失败----Error processing C2C message: ${error.message}`, { error });
        throw error; // 重新抛出错误，让外层catch捕获
      }
    }
  } catch (error) {
    logger.error(`[异常捕获] 单聊消息处理异常----Exception in C2C message handling: ${error.message}`, { error });
    // 这里可以实现重试逻辑或其他错误处理
  }
}

/**
 * 处理机器人收到的群聊消息
 * @param {Object} callbackBody - 回调请求体
 * @returns {Promise<void>}
 */
async function handleGroupMessage(callbackBody) {
  try {
    const fromAccount = callbackBody.From_Account;
    const groupId = callbackBody.GroupId;
    const random = callbackBody.Random || 'unknown';
    
    logger.info(`[回调接收] 收到群聊消息----Received group message callback from=${fromAccount} groupId=${groupId} random=${random}`);
    logger.debug(`[回调详情] 群聊消息内容----Group message details: ${JSON.stringify(callbackBody)}`);
    
    // 检查发送方是否是机器人，防止循环对话
    if (fromAccount.startsWith('@RBT#')) {
      logger.warn(`[回调处理] 消息来自另一个机器人----Message from another bot, ignoring to prevent loops: ${fromAccount}`);
      return;
    }
    
    // 提取消息文本
    const msgBodyList = callbackBody.MsgBody || [];
    for (const msgBody of msgBodyList) {
      // 只处理文本消息
      if (msgBody.MsgType !== 'TIMTextElem') {
        logger.info(`[回调处理] 跳过非文本消息----Skipping non-text message type: ${msgBody.MsgType}`);
        continue;
      }
      
      const msgContent = msgBody.MsgContent || {};
      const text = msgContent.Text || '';
      
      if (!text.trim()) {
        logger.info(`[回调处理] 跳过空消息----Skipping empty message`);
        continue;
      }
      
      logger.info(`[回调处理] 收到群聊消息----Received group message from ${fromAccount} in group ${groupId}: "${text}"`);
      
      // 预先声明目标机器人与提问文本
      let targetBotConfig = null;
      let questionText = text;

      // 优先使用消息体中的 AtUserList 判断是否提及机器人
      let atBotFound = false;
      const atList = msgContent.AtUserList || [];
      logger.debug(`[回调处理] @用户列表----AtUserList: ${JSON.stringify(atList)}`);
      
      if (Array.isArray(atList) && atList.length > 0) {
        for (const bot of Bots) {
          const pureId = bot.BotID.startsWith('@') ? bot.BotID.substring(1) : bot.BotID;
          if (atList.includes(bot.BotID) || atList.includes(pureId)) {
            targetBotConfig = bot;
            atBotFound = true;
            logger.info(`[回调处理] 通过@用户列表找到机器人----Found bot ${bot.BotID} in AtUserList`);
            break;
          }
        }
      }

      // 第二步：文本精确匹配 BotID
      if (!atBotFound) {
        for (const bot of Bots) {
          const escapedId = bot.BotID.replace(/[.*+?^${}()|[\\]\\]/g, '\\$&');
          const botIdPattern = new RegExp(`@?${escapedId}(?=\\s|$)`, 'i');
          if (botIdPattern.test(text)) {
            targetBotConfig = bot;
            atBotFound = true;
            logger.info(`[回调处理] 通过文本匹配找到机器人ID----Found bot ${bot.BotID} by ID pattern match in text`);
            break;
          }
        }
      }

      // 第三步：文本匹配 Bot 名称 (昵称)
      if (!atBotFound) {
        for (const bot of Bots) {
          const escapedName = bot.Name.replace(/[.*+?^${}()|[\\]\\]/g, '\\$&');
          const namePattern = new RegExp(`@${escapedName}(?=\\s|$)`, 'i');
          if (namePattern.test(text)) {
            targetBotConfig = bot;
            logger.info(`[回调处理] 通过文本匹配找到机器人名称----Found bot ${bot.BotID} by name pattern match in text: @${bot.Name}`);
            break;
          }
        }
      }

      if (targetBotConfig) {
        // 清理文本中的@BotID/@Name
        const patterns = [];
        const escId = targetBotConfig.BotID.replace(/[.*+?^${}()|[\\]\\]/g, '\\$&');
        patterns.push(new RegExp(`@?${escId}(?=\\s|$)`, 'gi'));
        const escName = targetBotConfig.Name.replace(/[.*+?^${}()|[\\]\\]/g, '\\$&');
        patterns.push(new RegExp(`@${escName}(?=\\s|$)`, 'gi'));
        let cleaned = text;
        patterns.forEach(p => { cleaned = cleaned.replace(p, ''); });
        questionText = cleaned.trim();
        logger.info(`[回调处理] 清理后的问题文本----Cleaned question: "${questionText}"`);
      }
      
      if (!targetBotConfig) {
        logger.info(`[回调处理] 消息未提及机器人----No bot mentioned in group message, ignoring`);
        continue;
      }

      logger.info(`[回调处理] 群聊消息提及机器人----Bot ${targetBotConfig.BotID} (${targetBotConfig.Name}) was mentioned in group ${groupId}`);

      try {
        // 调用AI服务获取回复
        logger.info(`[AI请求] 开始调用AI服务----Requesting AI response for question: "${questionText}"`);
        const startTime = Date.now();
        const aiResponse = await aiService.getAIResponse(questionText, fromAccount, targetBotConfig);
        const endTime = Date.now();
        logger.info(`[AI响应] 收到AI回复----Received AI response after ${endTime - startTime}ms, length: ${aiResponse.length} chars`);
        
        // 记录完整的AI回复内容
        logger.info(`[AI响应] 群聊AI回复内容----Group AI response content: "${aiResponse}"`);
        
        // 获取机器人的UserSig
        const botUserSig = getBotUserSig(targetBotConfig.BotID);
        logger.debug(`[发送消息] 获取到UserSig----Got UserSig for bot ${targetBotConfig.BotID}`);
        
        // 发送AI回复到群
        try {
          logger.info(`[发送消息] 开始发送群聊回复----Sending group response from ${targetBotConfig.BotID} to group ${groupId}`);
          const sendStartTime = Date.now();
          const sendResult = await imService.sendGroupTextMessage(
            targetBotConfig.BotID, // 机器人账号作为发送方
            groupId,              // 群ID
            aiResponse            // 文本内容
          );
          const sendEndTime = Date.now();
          
          // 记录发送结果
          if (sendResult && sendResult.MsgTime) {
            logger.info(`[发送消息] 群聊回复消息发送成功----Group response sent successfully, MsgTime=${sendResult.MsgTime}, took ${sendEndTime - sendStartTime}ms`);
          } else {
            logger.warn(`[发送消息] 群聊回复消息发送成功但没有MsgTime----Group response sent but no MsgTime returned`);
          }
          
          // 记录完整处理时间
          const totalProcessingTime = sendEndTime - startTime;
          logger.info(`[处理完成] 群聊消息处理完成----Group message processing complete, total time: ${totalProcessingTime}ms`);
        } catch (sendErr) {
          logger.error(`[发送失败] 群聊消息发送失败----Failed to send group message: ${sendErr.message}`, { error: sendErr });
        }
      } catch (aiError) {
        logger.error(`[AI失败] 获取AI回复失败----Failed to get AI response: ${aiError.message}`, { error: aiError });
      }
    }
  } catch (error) {
    logger.error(`[异常捕获] 群聊消息处理异常----Exception in group message handling: ${error.message}`, { error });
  }
}

module.exports = {
  handleC2CMessage,
  handleGroupMessage
};
