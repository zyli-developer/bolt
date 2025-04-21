FROM node:16-alpine

# 创建app目录
WORKDIR /app

# 安装依赖
COPY package*.json ./
RUN npm install

# 复制源代码
COPY . .

# 创建日志目录
RUN mkdir -p logs

# 暴露端口
EXPOSE 3000

# 启动服务
CMD ["node", "index.js"]
