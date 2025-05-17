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
    const provider = config.AIProvider || config.Provider || AI.Provider;
    const model = config.AIModel || config.Model || 'default';
    
    logger.info(`[AI服务] 请求AI响应----Requesting AI response for user ${userId} using provider: ${provider}, model: ${model}`);
    logger.debug(`[AI服务] 用户问题----User prompt: "${prompt}"`);
    
    let aiResponse = '';
    const startTime = Date.now();
    
    // 根据配置的AI服务商选择不同的实现
    switch (provider.toLowerCase()) {
      case 'minimax':
        logger.info(`[AI服务] 调用MiniMax API----Calling MiniMax API`);
        aiResponse = await getMinimaxResponse(prompt, userId, config);
        break;
      
      case 'iflytek':
        logger.info(`[AI服务] 调用讯飞星火API----Calling iFlytek API`);
        aiResponse = await getIflytekResponse(prompt, userId, config);
        break;
      
      case 'openai':
        logger.info(`[AI服务] 调用OpenAI API----Calling OpenAI API`);
        aiResponse = await getOpenAIResponse(prompt, userId, config);
        break;
      
      case 'openrouter':
        logger.info(`[AI服务] 调用OpenRouter API----Calling OpenRouter API`);
        aiResponse = await getOpenRouterResponse(prompt, userId, config);
        break;
      
      case 'deepseek':
        logger.info(`[AI服务] 调用DeepSeek API----Calling DeepSeek API`);
        aiResponse = await getDeepSeekResponse(prompt, userId, config);
        break;
      
      default:
        // 默认使用简单的模拟回复，适用于测试
        logger.info(`[AI服务] 使用模拟响应----Using simulated response (no actual API call)`);
        aiResponse = getSimulatedResponse(prompt);
    }
    
    const endTime = Date.now();
    const duration = endTime - startTime;
    
    logger.info(`[AI服务] AI响应完成----AI response completed in ${duration}ms, provider: ${provider}, length: ${aiResponse.length} chars`);
    
    // 记录完整的AI回复内容
    logger.info(`[AI服务] AI回复内容----AI full response content: "${aiResponse}"`);
    
    // 如果返回的内容为空，提供一个默认回复
    if (!aiResponse || aiResponse.trim().length === 0) {
      logger.warn(`[AI服务] AI返回空响应----Empty response received from ${provider}, using fallback message`);
      return "抱歉，我暂时无法回答这个问题。请稍后再试。";
    }
    
    return aiResponse;
  } catch (error) {
    logger.error(`[AI服务] AI服务错误----AI service error: ${error.message}`, { error });
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
  if (bot) {
    logger.debug(`[AI服务] 找到机器人配置----Found bot config for ${botId}: Provider=${bot.AIProvider || bot.Provider}, Model=${bot.AIModel || bot.Model}`);
  } else {
    logger.warn(`[AI服务] 未找到机器人配置----Bot config not found for ${botId}, will use default`);
  }
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
    
    logger.debug(`[MiniMax API] 请求参数----Request to ${apiEndpoint}, model: ${model}`);
    
    const requestBody = {
      model: model,
      prompt: prompt,
      // 可以添加更多参数，例如温度、tokens限制等
    };
    
    const response = await axios.post(apiEndpoint, requestBody, {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`
      }
    });
    
    logger.debug(`[MiniMax API] 状态码----Response status: ${response.status}`);
    
    // 返回AI回复文本
    if (response.data && (response.data.reply || response.data.response)) {
      const result = response.data.reply || response.data.response;
      logger.debug(`[MiniMax API] 响应内容----Response full content: "${result}"`);
      return result;
    } else {
      logger.warn(`[MiniMax API] 异常响应格式----Unexpected response format: ${JSON.stringify(response.data)}`);
      return "我没有找到相关的回答";
    }
  } catch (error) {
    logger.error(`[MiniMax API] 请求错误----MiniMax API error: ${error.message}`, { error });
    throw error;
  }
}

/**
 * 调用讯飞星火API获取回复
 */
async function getIflytekResponse(prompt, userId, config) {
  // 此处省略具体实现，根据讯飞星火API文档实现
  logger.warn(`[讯飞星火 API] 未实现----iFlytek API not implemented yet`);
  return "讯飞星火API尚未实现";
}

/**
 * 调用OpenAI原生API获取回复
 */
async function getOpenAIResponse(prompt, userId, config) {
  try {
    const apiEndpoint = config.APIEndpoint || 'https://api.openai.com/v1/chat/completions';
    const model = config.AIModel || config.Model || 'gpt-3.5-turbo';
    const apiKey = config.APIKey;

    // 如果 prompt 已经是 messages 数组直接使用
    const messages = Array.isArray(prompt) ? prompt : [{ role: 'user', content: prompt }];

    logger.debug(`[OpenAI API] 请求参数----Request to ${apiEndpoint}, model: ${model}`);
    logger.debug(`[OpenAI API] 请求消息----Messages: ${JSON.stringify(messages)}`);

    const requestBody = {
      model: model,
      messages: messages,
      temperature: 0.7,
      max_tokens: 1000
    };

    const requestHeaders = {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${apiKey}`
    };

    logger.debug(`[OpenAI API] 发送请求----Sending request with headers: ${Object.keys(requestHeaders).join(', ')}`);
    
    const startTime = Date.now();
    const response = await axios.post(apiEndpoint, requestBody, { headers: requestHeaders });
    const endTime = Date.now();
    
    logger.debug(`[OpenAI API] 状态码----Response status: ${response.status}, time: ${endTime - startTime}ms`);

    if (response.data && response.data.choices && response.data.choices.length > 0) {
      const result = response.data.choices[0].message.content;
      logger.debug(`[OpenAI API] 响应内容----Response full content: "${result}"`);
      return result;
    }
    
    logger.warn(`[OpenAI API] 异常响应格式----Unexpected OpenAI response format`, { data: response.data });
    return '抱歉，暂时无法获取回答。';
  } catch (error) {
    logger.error(`[OpenAI API] 请求错误----OpenAI API error: ${error.message}`, { error });
    if (error.response) {
      logger.error(`[OpenAI API] 错误响应----Error response: ${JSON.stringify(error.response.data)}`);
    }
    throw error;
  }
}

/**
 * 调用OpenRouter API获取回复
 */
async function getOpenRouterResponse(prompt, userId, config) {
  try {
    const apiEndpoint = config.APIEndpoint || 'https://openrouter.ai/api/v1/chat/completions';
    const model = config.AIModel || config.Model || 'openai/gpt-4o-mini';
    const apiKey = config.APIKey;

    // 如果 prompt 已经是 messages 数组直接使用
    const messages = Array.isArray(prompt) ? prompt : [{ role: 'user', content: prompt }];

    logger.debug(`[OpenRouter API] 请求参数----Request to ${apiEndpoint}, model: ${model}`);
    logger.debug(`[OpenRouter API] 请求消息----Messages: ${JSON.stringify(messages)}`);

    const requestBody = {
      model: model,
      messages: messages,
      temperature: 0.7,
      max_tokens: 1000
    };

    const requestHeaders = {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${apiKey}`,
      ...(process.env.OR_REFERER ? { 'HTTP-Referer': process.env.OR_REFERER } : {}),
      ...(process.env.OR_TITLE ? { 'X-Title': process.env.OR_TITLE } : {})
    };

    logger.debug(`[OpenRouter API] 发送请求----Sending request with headers: ${Object.keys(requestHeaders).join(', ')}`);
    
    const startTime = Date.now();
    const response = await axios.post(apiEndpoint, requestBody, { headers: requestHeaders });
    const endTime = Date.now();
    
    logger.debug(`[OpenRouter API] 状态码----Response status: ${response.status}, time: ${endTime - startTime}ms`);

    if (response.data && response.data.choices && response.data.choices.length > 0) {
      const result = response.data.choices[0].message.content;
      logger.debug(`[OpenRouter API] 响应内容----Response full content: "${result}"`);
      return result;
    }
    
    logger.warn(`[OpenRouter API] 异常响应格式----Unexpected OpenRouter response format`, { data: response.data });
    return '抱歉，暂时无法获取回答。';
  } catch (error) {
    logger.error(`[OpenRouter API] 请求错误----OpenRouter API error: ${error.message}`, { error });
    if (error.response) {
      logger.error(`[OpenRouter API] 错误响应----Error response: ${JSON.stringify(error.response.data)}`);
    }
    throw error;
  }
}

/**
 * 调用DeepSeek API获取回复
 */
async function getDeepSeekResponse(prompt, userId, config) {
  try {
    const apiEndpoint = config.APIEndpoint || 'https://api.deepseek.com/v1/chat/completions';
    const model = config.AIModel || config.Model || 'deepseek-chat';
    const apiKey = config.APIKey;
    
    logger.debug(`[DeepSeek API] 请求参数----Request to ${apiEndpoint}, model: ${model}`);
    
    const requestBody = {
      model: model,
      messages: [
        {
          role: 'user',
          content: prompt
        }
      ],
      temperature: 0.7,
      max_tokens: 1000
    };
    
    logger.debug(`[DeepSeek API] 发送请求----Sending request with API key: ${apiKey ? `${apiKey.substring(0, 4)}...${apiKey.substring(apiKey.length - 4)}` : 'undefined'}`);
    
    const startTime = Date.now();
    const response = await axios.post(apiEndpoint, requestBody, {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`
      }
    });
    const endTime = Date.now();
    
    logger.debug(`[DeepSeek API] 状态码----Response status: ${response.status}, time: ${endTime - startTime}ms`);
    
    // 获取回复内容
    if (response.data && 
        response.data.choices && 
        response.data.choices.length > 0 && 
        response.data.choices[0].message) {
      const result = response.data.choices[0].message.content;
      logger.debug(`[DeepSeek API] 响应内容----Response full content: "${result}"`);
      return result;
    } else {
      logger.warn(`[DeepSeek API] 异常响应格式----Unexpected DeepSeek API response format`, { response: response.data });
      return "我没有获取到有效的回答，请稍后再试。";
    }
  } catch (error) {
    logger.error(`[DeepSeek API] 请求错误----DeepSeek API error: ${error.message}`, { error });
    if (error.response) {
      logger.error(`[DeepSeek API] 错误响应----Error response: ${JSON.stringify(error.response.data)}`);
    }
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
  const response = responses[randomIndex];
  
  logger.debug(`[模拟回复] 生成模拟回复----Generated simulated response: "${response}"`);
  return response;
}

module.exports = {
  getAIResponse,
  findBotConfig
};
