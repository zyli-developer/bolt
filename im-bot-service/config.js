/**
 * 配置文件
 * 
 * 在生产环境中，建议使用环境变量而不是直接在代码中硬编码这些值
 */

module.exports = {
  // 腾讯云IM配置
  IM: {
    SDKAppID: process.env.IM_SDKAPPID || 1600079965, // 请替换为您的SDKAppID
    SecretKey: process.env.IM_SECRET_KEY || 'eJwtjMsOgjAABP*lZ0NKQ6mQeDQqQeIr6rWxBTfKq1TUGP9dBI47s5kPOcR7p9WGhIQ5lEz6DaULixQ9lipHgcYaaUszHhp1k1UFRULXp5SKIPD5YPSrgtEd55yzTg3UIv8z4XnUnXqMjRVkXf8MVksZLcQJ-n2t8h1S2l6P7*UjiJ5blHW5WcWXLEnEfEa*P2sGNXk_', // 密钥
    AdminUserID: process.env.IM_ADMIN_USER_ID || 'administrator', // 管理员用户ID
  },
  
  // 默认AI服务配置（用于兼容旧代码和作为默认配置）
  AI: {
    Provider: process.env.AI_PROVIDER || 'deepseek', // 可选: minimax, iflytek, openai, deepseek等
    APIKey: process.env.AI_API_KEY || 'sk-9fb7656e32574016b2a4dd6ad2aec066', // AI服务的API密钥
    APIEndpoint: process.env.AI_API_ENDPOINT || 'https://api.deepseek.com/v1/chat/completions',
    Model: process.env.AI_MODEL || 'deepseek-chat', // 使用的模型名称
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
      AIProvider: process.env.BOT1_AI_PROVIDER || 'deepseek',
      AIModel: process.env.BOT1_AI_MODEL || 'deepseek-chat',
      APIKey: process.env.BOT1_API_KEY || 'sk-9fb7656e32574016b2a4dd6ad2aec066',
      APIEndpoint: process.env.BOT1_API_ENDPOINT || 'https://api.deepseek.com/v1/chat/completions',
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
    // 可以添加更多机器人配置...
  ]
};
