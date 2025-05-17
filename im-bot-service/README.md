# IM Bot Service

腾讯云IM机器人服务，用于处理IM消息并结合AI提供智能回复。

## 功能特点

- 支持单聊和群聊消息处理
- 自动创建和初始化机器人账号
- 集成多种AI服务提供商（DeepSeek、OpenAI/OpenRouter等）
- 可配置多个不同功能的机器人
- 自动生成和缓存UserSig签名

## 环境要求

- Node.js 14+
- npm 或 yarn

## 安装与运行

1. 安装依赖

```bash
cd im-bot-service
npm install
```

2. 配置服务

修改`config.js`中的配置，特别是腾讯云IM相关的SDKAppID和SecretKey。

3. 启动服务

```bash
# 生产环境
npm start

# 开发环境（自动重载）
npm run dev
```

## 配置说明

在`config.js`中可以配置以下内容：

- 腾讯云IM配置（SDKAppID、SecretKey、管理员ID）
- AI服务配置（提供商、API密钥、模型等）
- 服务器配置（端口、回调路径）
- 机器人配置（ID、名称、描述、对应的AI提供商等）

## API接口

### 健康检查

```
GET /health
```

返回服务状态信息。

### 获取机器人列表

```
GET /bots
```

返回所有已配置的机器人列表。

### 获取特定机器人信息

```
GET /bots/:botId
```

返回指定机器人的详细信息。

### 获取UserSig（仅供开发使用）

```
GET /usersig/:userId
```

为指定用户ID生成UserSig。仅支持配置中的机器人和管理员账号。

### 腾讯云IM回调接口

```
POST /imcallback?CallbackCommand=<command>
```

用于接收腾讯云IM的回调请求。主要处理以下回调：

- `Bot.OnC2CMessage`: 处理单聊消息
- `Bot.OnGroupMessage`: 处理群组消息

## 使用Docker

可以使用Docker容器运行该服务：

```bash
# 构建镜像
docker build -t im-bot-service .

# 运行容器
docker run -d -p 8000:8000 --name im-bot im-bot-service
```

## 腾讯云IM配置

使用本服务前，需要在腾讯云IM控制台完成以下配置：

1. 创建应用并获取SDKAppID
2. 配置回调URL为：`http://<服务IP>:<端口>/imcallback`
3. 启用机器人功能
4. 配置管理员账号

## 故障排除

1. 确保网络环境能够正常访问腾讯云IM服务器
2. 检查SDKAppID和SecretKey是否正确
3. 检查日志文件（logs目录）获取详细错误信息
4. 确保机器人ID格式正确，以@RBT#开头

## 许可证

ISC 