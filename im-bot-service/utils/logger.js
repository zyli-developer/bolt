/**
 * 日志工具
 * 
 * 使用winston库实现结构化日志记录
 */

const winston = require('winston');
const { format, transports } = winston;

// 创建格式化器
const customFormat = format.combine(
  format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
  format.errors({ stack: true }),
  format.splat(),
  format.json()
);

// 创建日志记录器
const logger = winston.createLogger({
  level: process.env.LOG_LEVEL || 'info',
  format: customFormat,
  defaultMeta: { service: 'im-bot-service' },
  transports: [
    // 控制台输出
    new transports.Console({
      format: format.combine(
        format.colorize(),
        format.printf(({ level, message, timestamp, ...meta }) => {
          const metaStr = Object.keys(meta).length ? JSON.stringify(meta, null, 2) : '';
          return `${timestamp} ${level}: ${message} ${metaStr}`;
        })
      )
    }),
    // 文件输出 - 所有日志
    new transports.File({ filename: 'logs/combined.log' }),
    // 文件输出 - 仅错误日志
    new transports.File({ filename: 'logs/error.log', level: 'error' })
  ]
});

// 如果不是在生产环境，则还将所有日志打印到控制台
if (process.env.NODE_ENV !== 'production') {
  logger.add(new transports.Console({
    format: format.combine(
      format.colorize(),
      format.simple()
    )
  }));
}

module.exports = logger;
