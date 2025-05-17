/**
 * 日志工具
 * 
 * 使用winston库实现结构化日志记录
 */

const winston = require('winston');
const { format, transports } = winston;
const { combine, timestamp, errors, json, colorize, printf } = format;

// 创建日期格式化器
const timestampFormat = timestamp({ 
  format: 'YYYY-MM-DD HH:mm:ss.SSS' // 增加毫秒精度
});

// 创建控制台格式化器
const consoleFormat = combine(
  colorize({ all: true }),
  timestampFormat,
  printf(({ level, message, timestamp, service, ...meta }) => {
    // 提取调用栈信息，但不显示在日志中
    const stack = meta.stack ? meta.stack : undefined;
    delete meta.stack;
    
    // 移除元数据中的一些常见字段，这些字段将单独显示
    delete meta.service;
    delete meta.timestamp;
    
    // 格式化元数据
    const metaKeys = Object.keys(meta).filter(key => key !== 'error');
    const metaStr = metaKeys.length 
      ? metaKeys.map(key => `${key}=${typeof meta[key] === 'object' ? JSON.stringify(meta[key]) : meta[key]}`).join(', ')
      : '';
    
    // 格式化错误信息
    const errorStr = meta.error 
      ? `\n[ERROR] ${meta.error.message || meta.error}\n${meta.error.stack || ''}` 
      : '';
    
    // 返回格式化的日志
    return metaStr 
      ? `${timestamp} [${service || 'im-bot-service'}] ${level}: ${message} (${metaStr})${errorStr}`
      : `${timestamp} [${service || 'im-bot-service'}] ${level}: ${message}${errorStr}`;
  })
);

// 创建JSON格式化器(用于文件日志)
const fileFormat = combine(
  timestampFormat,
  errors({ stack: true }),
  json()
);

// 创建日志记录器
const logger = winston.createLogger({
  level: process.env.LOG_LEVEL || 'info',
  defaultMeta: { service: 'im-bot-service' },
  transports: [
    // 控制台输出
    new transports.Console({
      format: consoleFormat
    }),
    // 文件输出 - 所有日志
    new transports.File({ 
      filename: 'logs/combined.log',
      format: fileFormat,
      maxsize: 10485760, // 10MB
      maxFiles: 5,
      tailable: true
    }),
    // 文件输出 - 仅错误日志
    new transports.File({ 
      filename: 'logs/error.log', 
      level: 'error',
      format: fileFormat,
      maxsize: 10485760, // 10MB
      maxFiles: 5,
      tailable: true
    }),
    // 文件输出 - 单独记录调试信息
    new transports.File({ 
      filename: 'logs/debug.log', 
      level: 'debug',
      format: fileFormat,
      maxsize: 10485760, // 10MB
      maxFiles: 3,
      tailable: true
    })
  ]
});

// 如果设置了DEBUG环境变量，启用调试日志
if (process.env.DEBUG) {
  logger.level = 'debug';
  logger.debug('调试模式已启用----Debug logging enabled');
}

// 添加日志助手方法
logger.startTimer = function() {
  return {
    startTime: Date.now(),
    done: function(message, meta = {}) {
      const duration = Date.now() - this.startTime;
      logger.info(`${message} (duration: ${duration}ms)`, meta);
      return duration;
    }
  };
};

module.exports = logger;
