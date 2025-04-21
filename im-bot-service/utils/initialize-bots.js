/**
 * 机器人初始化工具
 * 
 * 用于在服务启动时确保所有配置的机器人账号都已创建
 */

const { Bots } = require('../config');
const imService = require('../services/im-service');
const logger = require('./logger');

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
        const userProfile = profileResult.UserProfileItem && profileResult.UserProfileItem[0];
        
        if (userProfile) {
          logger.info(`初始化所有机器人账号----Bot account exists: ${bot.BotID} (${bot.Name})`);
        } else {
          // 机器人账号不存在，创建它
          logger.info(`初始化所有机器人账号----Bot account does not exist: ${bot.BotID}, creating...`);
          await imService.createBotAccount(bot.BotID, bot.Name);
          logger.info(`初始化所有机器人账号----Created bot account: ${bot.BotID} (${bot.Name})`);
        }
      } catch (error) {
        // 如果是账号不存在的错误，则创建账号
        if (error.message.includes('Accountdoesnotexist') || 
            error.message.includes('account not found')) {
          logger.info(`初始化所有机器人账号----Bot account does not exist: ${bot.BotID}, creating...`);
          await imService.createBotAccount(bot.BotID, bot.Name);
          logger.info(`初始化所有机器人账号----Created bot account: ${bot.BotID} (${bot.Name})`);
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

module.exports = {
  initializeBots
};
