/**
 * IM Bot Service - 主入口文件
 * 
 * 该服务用于处理腾讯云IM的回调请求，将用户消息转发给AI服务，
 * 并将AI的响应通过腾讯云IM发送回用户。
 */

const express = require('express');
const { Server } = require('./config');
const logger = require('./utils/logger');
const botMessageHandler = require('./handlers/bot-message-handler');
const { initializeBots } = require('./utils/initialize-bots');
const { getAllBots } = require('./services/im-service');

// 创建Express应用
const app = express();

// 中间件设置
app.use(express.json());

// 添加健康检查端点
app.get('/health', (req, res) => {
  logger.info('处理健康检查请求----Health check request received');
  res.status(200).json({ status: 'ok', timestamp: new Date().toISOString() });
});

// 腾讯云IM回调处理路由
app.post(Server.CallbackPath, async (req, res) => {
  const callbackCommand = req.query.CallbackCommand;
  logger.info(`Received callback: ${callbackCommand}`);
  
  try {
    switch (callbackCommand) {
      case 'Bot.OnC2CMessage':
        // 处理单聊消息
        await botMessageHandler.handleC2CMessage(req.body);
        // 返回成功响应
        res.json({
          "ActionStatus": "OK",
          "ErrorCode": 0,
          "ErrorInfo": ""
        });
        break;
        
      case 'Bot.OnGroupMessage':
        // 处理群聊消息 (如果需要)
        await botMessageHandler.handleGroupMessage(req.body);
        // 返回成功响应
        res.json({
          "ActionStatus": "OK",
          "ErrorCode": 0,
          "ErrorInfo": ""
        });
        break;
        
      default:
        logger.warn(`Unsupported callback command: ${callbackCommand}`);
        res.status(400).json({
          "ActionStatus": "FAIL",
          "ErrorCode": 1,
          "ErrorInfo": "Unsupported callback command"
        });
    }
  } catch (error) {
    logger.error(`Error handling callback: ${error.message}`, { error });
    // 即使发生错误，也返回成功以避免腾讯云IM重试
    res.json({
      "ActionStatus": "OK",
      "ErrorCode": 0,
      "ErrorInfo": ""
    });
  }
});

// 获取所有机器人
app.get('/bots', async (req, res) => {
  try {
    logger.info('获取所有机器人----Getting all bots');
    const bots = await getAllBots();
    res.json(bots);
  } catch (error) {
    logger.error(`Failed to get bots: ${error.message}`, { error });
    res.status(500).json({
      "ActionStatus": "FAIL",
      "ErrorCode": 1,
      "ErrorInfo": error.message
    });
  }
});

// 启动服务器
const port = Server.Port;

// 初始化并启动服务
async function startServer() {
  try {
    // 初始化机器人账号
    logger.info('初始化机器人账号----Initializing bot accounts...');
    await initializeBots();
    
    // 启动HTTP服务器
    app.listen(port, '0.0.0.0', () => {
      logger.info(`启动HTTP服务器----IM Bot Service started on port ${port}`);
    });
    
  } catch (error) {
    logger.error(`启动HTTP服务器----Failed to start server: ${error.message}`, { error });
    process.exit(1);
  }
}

// 启动服务
startServer();

// 处理进程关闭信号
process.on('SIGTERM', () => {
  logger.info('SIGTERM received, shutting down gracefully');
  process.exit(0);
});

process.on('SIGINT', () => {
  logger.info('SIGINT received, shutting down gracefully');
  process.exit(0);
});

// 处理未捕获的异常
process.on('uncaughtException', (error) => {
  logger.error(`Uncaught exception: ${error.message}`, { error });
  // 对于未捕获的异常，可能需要重启服务
  process.exit(1);
});

process.on('unhandledRejection', (reason, promise) => {
  logger.error('Unhandled Rejection at:', { promise, reason });
});
