/**
 * 机器人初始化工具
 * 
 * 用于在服务启动时确保所有配置的机器人账号都已创建
 */

const { Bots } = require('../config');
const imService = require('../services/im-service');
const { genUserSig } = require('./user-sig');
const logger = require('./logger');

// 缓存机器人的UserSig
const botUserSigs = new Map();

/**
 * 初始化所有机器人账号
 * 先检查是否存在，不存在则创建
 */
async function initializeBots() {
  logger.info('初始化所有机器人账号----Starting bot initialization...');
  
  try {
    // 遍历所有配置的机器人
    for (const bot of Bots) {
      try {
        // 尝试获取机器人资料
        const profileResult = await imService.getUserProfile(bot.BotID);
        logger.info(`获取机器人资料返回结果----ProfileResult for ${bot.BotID}: ${JSON.stringify(profileResult)}`);
        
        // 判断机器人是否存在
        const botExists = isBotProfileValid(profileResult, bot.BotID);
        
        if (botExists) {
          logger.info(`初始化所有机器人账号----Bot account exists: ${bot.BotID} (${bot.Name})`);
        } else {
          // 机器人账号不存在，创建它
          logger.info(`初始化所有机器人账号----Bot account does not exist: ${bot.BotID}, creating...`);
          await imService.createBotAccount(bot.BotID, bot.Name);
          logger.info(`初始化所有机器人账号----Created bot account: ${bot.BotID} (${bot.Name})`);
        }
        
        // 为每个机器人生成UserSig并缓存
        const userSig = genUserSig(bot.BotID);
        botUserSigs.set(bot.BotID, userSig);
        logger.info(`初始化所有机器人账号----Generated and cached UserSig for bot: ${bot.BotID}`);
        
      } catch (error) {
        // 如果是账号不存在的错误，则创建账号
        if (error.message.includes('Accountdoesnotexist') || 
            error.message.includes('account not found')) {
          logger.info(`初始化所有机器人账号----Bot account does not exist: ${bot.BotID}, creating...`);
          await imService.createBotAccount(bot.BotID, bot.Name);
          logger.info(`初始化所有机器人账号----Created bot account: ${bot.BotID} (${bot.Name})`);
          
          // 为新创建的机器人生成UserSig并缓存
          const userSig = genUserSig(bot.BotID);
          botUserSigs.set(bot.BotID, userSig);
          logger.info(`初始化所有机器人账号----Generated and cached UserSig for new bot: ${bot.BotID}`);
        } else {
          // 其他错误
          logger.error(`初始化所有机器人账号----Error initializing bot ${bot.BotID}: ${error.message}`, { error });
        }
      }
    }
    
    logger.info('初始化所有机器人账号----Bot initialization complete!');
  } catch (error) {
    logger.error(`初始化所有机器人账号----Fatal error during bot initialization: ${error.message}`, { error });
    throw error;
  }
}

/**
 * 判断机器人资料是否有效
 * @param {Object} profileResult - 获取用户资料的返回结果
 * @param {string} botId - 机器人ID
 * @returns {boolean} - 是否有效
 */
function isBotProfileValid(profileResult, botId) {
  // 检查整体API返回状态
  if (profileResult.ErrorCode !== 0) {
    return false;
  }
  
  // 检查是否在Fail_Account列表中
  if (profileResult.Fail_Account && profileResult.Fail_Account.includes(botId)) {
    return false;
  }

  // 检查UserProfileItem
  if (!profileResult.UserProfileItem || !Array.isArray(profileResult.UserProfileItem) || profileResult.UserProfileItem.length === 0) {
    return false;
  }
  
  // 检查每个账号项
  for (const item of profileResult.UserProfileItem) {
    // 如果To_Account匹配且ResultCode不存在或为0，则认为有效
    if (item.To_Account === botId && (!item.ResultCode || item.ResultCode === 0)) {
      return true;
    }
    
    // 检查是否有错误信息
    if (item.To_Account === botId && item.ResultCode && item.ResultCode !== 0) {
      return false;
    }
    
    // 检查特殊错误模式 @TLS#NOT_FOUND
    if (item.To_Account === '@TLS#NOT_FOUND' && item.ResultCode === 40003) {
      return false;
    }
  }
  
  // 如果都没有匹配，默认为不存在
  return false;
}

/**
 * 获取机器人的UserSig
 * 如果缓存中不存在，则生成一个新的
 * @param {string} botId - 机器人ID
 * @returns {string} - 机器人的UserSig
 */
function getBotUserSig(botId) {
  if (!botUserSigs.has(botId)) {
    const userSig = genUserSig(botId);
    botUserSigs.set(botId, userSig);
    logger.info(`获取机器人UserSig----Generated new UserSig for bot: ${botId}`);
  }
  return botUserSigs.get(botId);
}

module.exports = {
  initializeBots,
  getBotUserSig
};
