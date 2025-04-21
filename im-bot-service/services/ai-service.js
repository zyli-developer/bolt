/**
 * AI服务
 * 
 * 用于调用外部AI服务API，获取智能回复
 */

const axios = require('axios');
const { AI, Bots } = require('../config');
const logger = require('../utils/logger');

/**
 * 请求AI服务获取回复
 * @param {string} prompt - 用户输入的文本
 * @param {string} userId - 用户ID，用于维护对话上下文
 * @param {Object} botConfig - 可选，机器人特定配置，不提供则使用默认配置
 * @returns {Promise<string>} - AI回复的文本
 */
async function getAIResponse(prompt, userId, botConfig = null) {
  try {
    // 使用提供的机器人配置或默认AI配置
    const config = botConfig || AI;
    
    logger.info(`Requesting AI response for user ${userId} using bot ${botConfig ? botConfig.BotID : 'default'}`);
    
    // 根据配置的AI服务商选择不同的实现
    switch (config.AIProvider || config.Provider || AI.Provider) {
      case 'minimax':
        return await getMinimaxResponse(prompt, userId, config);
      
      case 'iflytek':
        return await getIflytekResponse(prompt, userId, config);
      
      case 'openai':
        return await getOpenAIResponse(prompt, userId, config);
      
      case 'deepseek':
        return await getDeepSeekResponse(prompt, userId, config);
      
      default:
        // 默认使用简单的模拟回复，适用于测试
        return getSimulatedResponse(prompt);
    }
  } catch (error) {
    logger.error(`AI service error: ${error.message}`, { error });
    // 出错时返回通用回复
    return "抱歉，我暂时无法回答这个问题。请稍后再试。";
  }
}

/**
 * 根据机器人ID查找机器人配置
 * @param {string} botId - 机器人ID
 * @returns {Object|null} - 机器人配置或null
 */
function findBotConfig(botId) {
  if (!botId) return null;
  
  // 从Bots数组中查找匹配的机器人
  const bot = Bots.find(bot => bot.BotID === botId);
  return bot || null;
}

/**
 * 调用MiniMax API获取回复
 */
async function getMinimaxResponse(prompt, userId, config) {
  try {
    const apiEndpoint = config.APIEndpoint || 'https://api.minimax.chat/v1/text/completion';
    const model = config.AIModel || config.Model || 'abab5-completion';
    const apiKey = config.APIKey;
    
    const response = await axios.post(apiEndpoint, {
      model: model,
      prompt: prompt,
      // 可以添加更多参数，例如温度、tokens限制等
    }, {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`
      }
    });
    
    // 返回AI回复文本
    return response.data.reply || response.data.response || "我没有找到相关的回答";
  } catch (error) {
    logger.error(`MiniMax API error: ${error.message}`, { error });
    throw error;
  }
}

/**
 * 调用讯飞星火API获取回复
 */
async function getIflytekResponse(prompt, userId, config) {
  // 此处省略具体实现，根据讯飞星火API文档实现
  return "讯飞星火API尚未实现";
}

/**
 * 调用OpenAI API获取回复
 */
async function getOpenAIResponse(prompt, userId, config) {
  // 此处省略具体实现，根据OpenAI API文档实现
  return "OpenAI API尚未实现";
}

/**
 * 调用DeepSeek API获取回复
 */
async function getDeepSeekResponse(prompt, userId, config) {
  try {
    const apiEndpoint = config.APIEndpoint || 'https://api.deepseek.com/v1/chat/completions';
    const model = config.AIModel || config.Model || 'deepseek-chat';
    const apiKey = config.APIKey;
    
    const response = await axios.post(apiEndpoint, {
      model: model,
      messages: [
        {
          role: 'user',
          content: prompt
        }
      ],
      temperature: 0.7,
      max_tokens: 1000
    }, {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`
      }
    });
    
    // 获取回复内容
    if (response.data && 
        response.data.choices && 
        response.data.choices.length > 0 && 
        response.data.choices[0].message) {
      return response.data.choices[0].message.content;
    } else {
      logger.warn('Unexpected DeepSeek API response format', { response: response.data });
      return "我没有获取到有效的回答，请稍后再试。";
    }
  } catch (error) {
    logger.error(`DeepSeek API error: ${error.message}`, { error });
    throw error;
  }
}

/**
 * 生成模拟回复（用于测试）
 */
function getSimulatedResponse(prompt) {
  const responses = [
    "我理解您的问题了，让我思考一下...",
    "这是一个很有趣的问题，您能提供更多细节吗？",
    "根据您提供的信息，我有以下建议...",
    "我找到了一些相关的信息，希望对您有所帮助。",
    "这个问题可以从多个角度来看待。首先...",
    "我需要更多信息来回答这个问题。您能告诉我更多吗？",
    "我正在处理您的请求，请稍等...",
    "您的问题很有深度，以下是我的分析..."
  ];
  
  // 随机选择一个回复
  const randomIndex = Math.floor(Math.random() * responses.length);
  return responses[randomIndex];
}

module.exports = {
  getAIResponse,
  findBotConfig
};
