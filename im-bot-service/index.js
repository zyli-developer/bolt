/**
 * IM Bot Service - 主入口文件
 * 
 * 该服务用于处理腾讯云IM的回调请求，将用户消息转发给AI服务，
 * 并将AI的响应通过腾讯云IM发送回用户。
 */

const express = require('express');
const { Server, IM, Bots } = require('./config');
const logger = require('./utils/logger');
const botMessageHandler = require('./handlers/bot-message-handler');
const { initializeBots, getBotUserSig } = require('./utils/initialize-bots');
const { genUserSig } = require('./utils/user-sig');
const { getAllBots } = require('./services/im-service');

// 创建Express应用
const app = express();

// 中间件设置
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// 请求日志中间件
app.use((req, res, next) => {
  const timer = logger.startTimer();
  
  // 在响应完成后记录日志
  res.on('finish', () => {
    const duration = timer.done(`[HTTP] ${req.method} ${req.originalUrl} ${res.statusCode}`, {
      method: req.method,
      url: req.originalUrl,
      status: res.statusCode,
      userAgent: req.get('User-Agent') || 'unknown',
      contentLength: res.get('Content-Length') || 0
    });
    
    // 如果响应时间超过1秒，记录警告
    if (duration > 1000) {
      logger.warn(`[HTTP] 请求响应较慢----Slow request detected: ${req.method} ${req.originalUrl} took ${duration}ms`);
    }
  });
  
  next();
});

// 添加健康检查端点
app.get('/health', (req, res) => {
  logger.info('[健康检查] 接收健康检查请求----Health check request received');
  res.status(200).json({ 
    status: 'ok', 
    timestamp: new Date().toISOString(),
    version: '1.0.0',
    botsCount: Bots.length 
  });
});

// 添加获取UserSig的端点（仅供开发和测试使用）
app.get('/usersig/:userId', (req, res) => {
  try {
    const userId = req.params.userId;
    // 仅允许为配置中的机器人或管理员生成UserSig
    const isBotOrAdmin = userId === IM.AdminUserID || Bots.some(bot => bot.BotID === userId);
    
    if (!isBotOrAdmin) {
      logger.warn(`[UserSig] 未授权请求----Unauthorized UserSig request for ${userId}`);
      return res.status(403).json({
        status: 'error',
        message: 'Unauthorized: Can only generate UserSig for configured bots or admin'
      });
    }
    
    // 生成UserSig
    const userSig = genUserSig(userId);
    logger.info(`[UserSig] 生成成功----Generated UserSig for ${userId}`);
    res.json({ userId, userSig, sdkAppId: IM.SDKAppID });
  } catch (error) {
    logger.error(`[UserSig] 生成错误----Error generating UserSig: ${error.message}`, { error });
    res.status(500).json({ status: 'error', message: error.message });
  }
});

// 腾讯云IM回调处理路由
app.post(Server.CallbackPath, async (req, res) => {
  const callbackCommand = req.query.CallbackCommand;
  const requestId = `${Date.now()}-${Math.random().toString(36).substring(2, 10)}`;
  
  logger.info(`[IM回调] 收到回调请求----Received callback: ${callbackCommand}, requestId: ${requestId}`);
  logger.debug(`[IM回调] 回调请求体----Callback request body: ${JSON.stringify(req.body)}`);
  
  const timer = logger.startTimer();
  
  try {
    switch (callbackCommand) {
      case 'Bot.OnC2CMessage':
        // 处理单聊消息
        logger.info(`[IM回调] 处理单聊消息回调----Processing C2C message callback, requestId: ${requestId}`);
        await botMessageHandler.handleC2CMessage(req.body);
        timer.done(`[IM回调] 单聊消息处理完成----C2C message processing completed, requestId: ${requestId}`);
        
        // 返回成功响应
        res.json({
          "ActionStatus": "OK",
          "ErrorCode": 0,
          "ErrorInfo": ""
        });
        break;
        
      case 'Bot.OnGroupMessage':
        // 处理群聊消息
        logger.info(`[IM回调] 处理群聊消息回调----Processing group message callback, requestId: ${requestId}`);
        await botMessageHandler.handleGroupMessage(req.body);
        timer.done(`[IM回调] 群聊消息处理完成----Group message processing completed, requestId: ${requestId}`);
        
        // 返回成功响应
        res.json({
          "ActionStatus": "OK",
          "ErrorCode": 0,
          "ErrorInfo": ""
        });
        break;
        
      default:
        logger.warn(`[IM回调] 不支持的回调命令----Unsupported callback command: ${callbackCommand}, requestId: ${requestId}`);
        res.status(400).json({
          "ActionStatus": "FAIL",
          "ErrorCode": 1,
          "ErrorInfo": "Unsupported callback command"
        });
    }
  } catch (error) {
    const errorId = `err-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`;
    logger.error(`[IM回调] 处理回调错误----Error handling callback: ${error.message}, errorId: ${errorId}, requestId: ${requestId}`, { 
      error,
      callbackCommand,
      requestId,
      errorId
    });
    
    // 即使发生错误，也返回成功以避免腾讯云IM重试
    res.json({
      "ActionStatus": "OK",
      "ErrorCode": 0,
      "ErrorInfo": ""
    });
    
    logger.info(`[IM回调] 错误情况下返回成功----Returned success response despite error, to prevent retries, errorId: ${errorId}, requestId: ${requestId}`);
  }
});

// 获取所有机器人
app.get('/bots', async (req, res) => {
  try {
    logger.info('[机器人API] 获取所有机器人列表----Getting all bots');
    const timer = logger.startTimer();
    
    const bots = await getAllBots();
    
    timer.done('[机器人API] 获取机器人列表完成----Bots retrieval completed', {
      botsCount: bots.RobotItem?.length || 0
    });
    
    res.json(bots);
  } catch (error) {
    logger.error(`[机器人API] 获取机器人列表失败----Failed to get bots: ${error.message}`, { error });
    res.status(500).json({
      "ActionStatus": "FAIL",
      "ErrorCode": 1,
      "ErrorInfo": error.message
    });
  }
});

// 获取特定机器人的信息与状态
app.get('/bots/:botId', async (req, res) => {
  try {
    const botId = req.params.botId;
    logger.info(`[机器人API] 获取机器人信息----Getting bot info: ${botId}`);
    
    // 查找机器人配置
    const botConfig = Bots.find(bot => bot.BotID === botId);
    if (!botConfig) {
      logger.warn(`[机器人API] 机器人未找到----Bot with ID ${botId} not found`);
      return res.status(404).json({
        status: 'error',
        message: `Bot with ID ${botId} not found`
      });
    }
    
    // 获取机器人的UserSig
    const userSig = getBotUserSig(botId);
    logger.debug(`[机器人API] 获取到机器人UserSig----Got UserSig for bot ${botId}`);
    
    res.json({
      botId: botConfig.BotID,
      name: botConfig.Name,
      aiProvider: botConfig.AIProvider,
      aiModel: botConfig.AIModel,
      description: botConfig.Description,
      status: 'active',
      userSig: userSig ? '****' : null, // 出于安全原因只显示占位符
      sdkAppId: IM.SDKAppID
    });
    
    logger.info(`[机器人API] 机器人信息返回成功----Bot info response sent for ${botId}`);
  } catch (error) {
    logger.error(`[机器人API] 获取机器人信息失败----Failed to get bot info: ${error.message}`, { error });
    res.status(500).json({
      status: 'error',
      message: error.message
    });
  }
});

// 启动服务器
const port = Server.Port;

// 打印启动配置信息
function logStartupInfo() {
  logger.info('======= IM Bot Service 启动配置 =======');
  logger.info(`服务端口: ${Server.Port}`);
  logger.info(`回调路径: ${Server.CallbackPath}`);
  logger.info(`SDKAppID: ${IM.SDKAppID}`);
  logger.info(`管理员ID: ${IM.AdminUserID}`);
  logger.info(`配置机器人数量: ${Bots.length}`);
  Bots.forEach((bot, index) => {
    logger.info(`机器人${index+1}: ${bot.Name} (${bot.BotID}), AI提供商: ${bot.AIProvider}`);
  });
  logger.info('======================================');
}

// 初始化并启动服务
async function startServer() {
  try {
    // 打印启动配置
    logStartupInfo();
    
    // 测试UserSig生成
    try {
      const adminUserSig = genUserSig(IM.AdminUserID);
      logger.info(`[启动] 管理员 ${IM.AdminUserID} 的UserSig生成成功----Admin UserSig generation successful`);
    } catch (sigError) {
      logger.error(`[启动] UserSig生成测试失败----UserSig generation failed: ${sigError.message}`, { sigError });
      // 这是一个严重错误，终止启动
      throw new Error('UserSig generation failed, cannot proceed: ' + sigError.message);
    }
    
    // 初始化机器人账号
    logger.info('[启动] 开始初始化机器人账号----Starting bot initialization');
    const initTimer = logger.startTimer();
    
    await initializeBots();
    
    initTimer.done('[启动] 机器人账号初始化完成----Bot initialization completed');
    
    // 启动HTTP服务器
    app.listen(port, '0.0.0.0', () => {
      logger.info(`[启动] HTTP服务器启动成功----IM Bot Service started on port ${port}`);
      logger.info(`[启动] 健康检查接口: http://localhost:${port}/health`);
      logger.info(`[启动] 机器人列表接口: http://localhost:${port}/bots`);
    });
    
  } catch (error) {
    logger.error(`[启动] 服务启动失败----Failed to start server: ${error.message}`, { error });
    process.exit(1);
  }
}

// 启动服务
startServer();

// 处理进程关闭信号
process.on('SIGTERM', () => {
  logger.info('[系统] 收到SIGTERM信号----SIGTERM received, shutting down gracefully');
  process.exit(0);
});

process.on('SIGINT', () => {
  logger.info('[系统] 收到SIGINT信号----SIGINT received, shutting down gracefully');
  process.exit(0);
});

// 处理未捕获的异常
process.on('uncaughtException', (error) => {
  logger.error(`[系统] 未捕获的异常----Uncaught exception: ${error.message}`, { error });
  // 对于未捕获的异常，可能需要重启服务
  process.exit(1);
});

process.on('unhandledRejection', (reason, promise) => {
  logger.error('[系统] 未处理的Promise拒绝----Unhandled Rejection at:', { promise, reason });
});
