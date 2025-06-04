/**
 * 配置文件
 * 
 * 在生产环境中，建议使用环境变量而不是直接在代码中硬编码这些值
 */

module.exports = {
  // 腾讯云IM配置
  IM: {
    SDKAppID: process.env.IM_SDKAPPID || 1600079965, // 请替换为您的SDKAppID
    SecretKey: process.env.IM_SECRET_KEY || 'ebcf82816948352f178ab661fc1a6ae4165615843afb5b41f58df74a92847cb4', // 密钥
    AdminUserID: process.env.IM_ADMIN_USER_ID || 'administrator', // 管理员用户ID
  },
  
  // 默认AI服务配置（用于兼容旧代码和作为默认配置）
  AI: {
    Provider: process.env.AI_PROVIDER || 'openrouter', // 可选: minimax, iflytek, openai, deepseek等
    APIKey: process.env.AI_API_KEY || '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', // AI服务的API密钥
    APIEndpoint: process.env.AI_API_ENDPOINT || 'https://openrouter.ai/api/v1/chat/completions',
    Model: process.env.AI_MODEL || 'deepseek/deepseek-chat-v3-0324', // 使用的模型名称
  },
  
  // 服务器配置
  Server: {
    Port: process.env.PORT || 8000,
    CallbackPath: process.env.CALLBACK_PATH || '/imcallback',
  },
  
  // 机器人配置数组
  Bots: [
    {
      BotID: process.env.BOT1_ID || '@RBT#001',
      Name: process.env.BOT1_NAME || 'deepseek',
      AIProvider: process.env.BOT1_AI_PROVIDER || 'openrouter',
      AIModel: process.env.BOT1_AI_MODEL || 'deepseek/deepseek-chat-v3-0324',
      APIKey: process.env.BOT1_API_KEY || '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',
      APIEndpoint: process.env.BOT1_API_ENDPOINT || 'https://openrouter.ai/api/v1/chat/completions',
      Description: '通用客服助手，负责回答常见问题'
    },
    {
      BotID: process.env.BOT2_ID || '@RBT#002',
      Name: process.env.BOT2_NAME || 'openAI',
      AIProvider: process.env.BOT2_AI_PROVIDER || 'openAi',
      AIModel: process.env.BOT2_AI_MODEL || 'openAi',
      APIKey: process.env.BOT2_API_KEY || 'sk-9fb7656e32574016b2a4dd6ad2aec066',
      APIEndpoint: process.env.BOT2_API_ENDPOINT || 'https://api.deepseek.com/v1/chat/completions',
      Description: '技术专家，回答技术相关问题'
    },
    {
      BotID: process.env.BOT3_ID || '@RBT#003',
      Name: process.env.BOT3_NAME || 'gpt4o-mini',
      AIProvider: process.env.BOT3_AI_PROVIDER || 'openrouter',
      AIModel: process.env.BOT3_AI_MODEL || 'gpt-4o-mini',
      APIKey: process.env.BOT3_API_KEY || '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',
      APIEndpoint: process.env.BOT3_API_ENDPOINT || 'https://openrouter.ai/api/v1/chat/completions',
      Description: 'GPT-4o mini 机器人，成本低、响应快'
    },
    {
      BotID: process.env.BOT4_ID || '@RBT#004',
      Name: process.env.BOT4_NAME || 'gemini-2.5-flash-preview',
      AIProvider: process.env.BOT4_AI_PROVIDER || 'openrouter',
      AIModel: process.env.BOT4_AI_MODEL || 'google/gemini-2.5-flash-preview',
      APIKey: process.env.BOT4_API_KEY || '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',
      APIEndpoint: process.env.BOT4_API_ENDPOINT || 'https://openrouter.ai/api/v1/chat/completions',
      Description: 'Gemini 2.5 Flash Preview 机器人，成本低、响应快'
    },
    {
      BotID: process.env.BOT5_ID || '@RBT#005',
      Name: process.env.BOT5_NAME || 'gemini-2.0-flash',
      AIProvider: process.env.BOT5_AI_PROVIDER || 'openrouter',
      AIModel: process.env.BOT5_AI_MODEL || 'google/gemini-2.0-flash-001',
      APIKey: process.env.BOT5_API_KEY || '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',
      APIEndpoint: process.env.BOT5_API_ENDPOINT || 'https://openrouter.ai/api/v1/chat/completions',
      Description: 'Gemini 2.0 Flash 机器人，成本低、响应快'
    },
    {
      BotID: process.env.BOT6_ID || '@RBT#006',
      Name: process.env.BOT6_NAME || 'claude-3.7-sonnet:thinking',
      AIProvider: process.env.BOT6_AI_PROVIDER || 'openrouter',
      AIModel: process.env.BOT6_AI_MODEL || 'anthropic/claude-3.7-sonnet:thinking',
      APIKey: process.env.BOT6_API_KEY || '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',
      APIEndpoint: process.env.BOT6_API_ENDPOINT || 'https://openrouter.ai/api/v1/chat/completions',
      Description: 'anthropic/claude-3.7-sonnet:thinking 机器人，成本低、响应快'
    },
    {
      BotID: process.env.BOT7_ID || '@RBT#007',
      Name: process.env.BOT7_NAME || 'deepseek-hongkong',
      AIProvider: process.env.BOT7_AI_PROVIDER || 'deepseek',
      AIModel: process.env.BOT7_AI_MODEL || 'deepseek-chat',
      APIKey: process.env.BOT7_API_KEY || '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',
      APIEndpoint: process.env.BOT7_API_ENDPOINT || 'https://203.86.115.43/api/v1/chat/completions',
      Description: 'deepseek-hongkong 机器人，成本低、响应快'
    },
    // 可以添加更多机器人配置...
  ]
};
