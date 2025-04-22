/**
 * 机器人消息处理器
 * 
 * 用于处理机器人收到的消息，并调用AI服务获取回复
 */

const { IM, Bots } = require('../config');
const logger = require('../utils/logger');
const imService = require('../services/im-service');
const aiService = require('../services/ai-service');

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
  for (const [messageId, data] of messageCache.entries()) {
    if (now - data.timestamp > CACHE_EXPIRATION) {
      messageCache.delete(messageId);
    }
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
    logger.info('处理机器人收到的单聊消息');
    const fromAccount = callbackBody.From_Account;
    const toAccount = callbackBody.To_Account;
    
    // 检查接收方是否是机器人
    if (!toAccount.startsWith('@RBT#')) {
      logger.warn(`消息未发送到机器人----Message not sent to a bot: ${toAccount}`);
      return;
    }
    
    // 检查发送方是否是机器人，防止循环对话
    if (fromAccount.startsWith('@RBT#')) {
      logger.warn(`消息来自另一个机器人----Message from another bot, ignoring to prevent loops: ${fromAccount}`);
      return;
    }
    
    // 查找对应的机器人配置
    const botConfig = aiService.findBotConfig(toAccount);
    if (!botConfig) {
      logger.warn(`处理单聊消息----Received message for unknown bot ID: ${toAccount}`);
      // 仍然处理消息，但使用默认配置
    } else {
      logger.info(`处理单聊消息----Processing message for bot: ${botConfig.Name} (${botConfig.BotID})`);
    }
    
    // 提取消息文本
    const msgBodyList = callbackBody.MsgBody || [];
    for (const msgBody of msgBodyList) {
      // 只处理文本消息
      if (msgBody.MsgType !== 'TIMTextElem') {
        continue;
      }
      
      const msgContent = msgBody.MsgContent || {};
      const text = msgContent.Text || '';
      
      if (!text.trim()) {
        continue;
      }
      
      logger.info(`处理单聊消息----Received message from ${fromAccount}: ${text}`);
      
      // 生成消息唯一标识符
      const msgTimestamp = callbackBody.MsgTimestamp || Date.now() / 1000;
      const messageId = generateMessageId(fromAccount, toAccount, text, msgTimestamp * 1000);
      
      // 检查消息是否已处理
      if (messageCache.has(messageId)) {
        logger.warn(`消息重复----Duplicate message detected, skipping: ${messageId}`);
        continue;
      }
      
      // 将消息标记为正在处理
      messageCache.set(messageId, { 
        timestamp: Date.now(),
        processed: false
      });
      
      try {
        // 调用AI服务获取回复，传入特定机器人配置
        const aiResponse = await aiService.getAIResponse(text, fromAccount, botConfig);
        
        // 发送AI回复
        await imService.sendC2CTextMessage(
          toAccount,    // 机器人ID作为发送方
          fromAccount,  // 用户ID作为接收方
          aiResponse
        );
        
        // 标记消息为已处理
        messageCache.set(messageId, { 
          timestamp: Date.now(),
          processed: true
        });
        
        logger.info(`处理单聊消息----Bot ${toAccount} sent response to ${fromAccount}`);
      } catch (error) {
        // 处理失败时仍保留缓存记录，防止重复处理
        messageCache.set(messageId, { 
          timestamp: Date.now(),
          processed: true,
          error: true
        });
        
        logger.error(`处理单聊消息失败----Error processing message: ${error.message}`, { error });
        throw error; // 重新抛出错误，让外层catch捕获
      }
    }
  } catch (error) {
    logger.error(`处理单聊消息失败----Error handling C2C message: ${error.message}`, { error });
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
    
    // 检查发送方是否是机器人，防止循环对话
    if (fromAccount.startsWith('@RBT#')) {
      logger.warn(`Message from another bot, ignoring to prevent loops: ${fromAccount}`);
      return;
    }
    
    // 提取消息文本
    const msgBodyList = callbackBody.MsgBody || [];
    for (const msgBody of msgBodyList) {
      // 只处理文本消息
      if (msgBody.MsgType !== 'TIMTextElem') {
        continue;
      }
      
      const msgContent = msgBody.MsgContent || {};
      const text = msgContent.Text || '';
      
      if (!text.trim()) {
        continue;
      }
      
      logger.info(`Received group message from ${fromAccount} in group ${groupId}: ${text}`);
      
      // 检查是否@了某个机器人，并获取该机器人
      let targetBotConfig = null;
      let questionText = text;
      
      // 查找被@的机器人
      for (const bot of Bots) {
        if (text.includes(`@${bot.BotID}`) || text.includes(`@${bot.Name}`)) {
          targetBotConfig = bot;
          // 移除@部分，获取实际问题
          questionText = text
            .replace(new RegExp(`@${bot.BotID}`, 'g'), '')
            .replace(new RegExp(`@${bot.Name}`, 'g'), '')
            .trim();
          break;
        }
      }
      
      if (!targetBotConfig) {
        logger.info('No bot mentioned in group message, ignoring');
        continue;
      }
      
      logger.info(`Bot ${targetBotConfig.BotID} was mentioned in group ${groupId}`);
      
      // 调用AI服务获取回复
      const aiResponse = await aiService.getAIResponse(questionText, fromAccount, targetBotConfig);
      
      // 发送AI回复到群
      // 注意：这里需要调用群消息发送API
      // 此处省略具体实现
      
      logger.info(`Bot ${targetBotConfig.BotID} sent response to group ${groupId}`);
    }
  } catch (error) {
    logger.error(`Error handling group message: ${error.message}`, { error });
  }
}

module.exports = {
  handleC2CMessage,
  handleGroupMessage
};
