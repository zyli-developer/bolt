/**
 * 聊天数据服务
 * 处理聊天相关的API请求
 */

import api from "./api"
import endpoints from "./endpoints"

const chatService = {
  /**
   * 获取聊天用户列表
   * @returns {Promise} - 聊天用户列表数据
   */
  getChatUsers: async () => {
    try {
      return await api.get(endpoints.chat.users)
    } catch (error) {
      console.error("获取聊天用户列表失败:", error)
      throw error
    }
  },

  /**
   * 获取与特定用户的聊天消息
   * @param {string} userId - 用户ID
   * @returns {Promise} - 聊天消息列表
   */
  getChatMessages: async (userId) => {
    try {
      return await api.get(endpoints.chat.messages(userId))
    } catch (error) {
      console.error(`获取聊天消息失败 (用户ID: ${userId}):`, error)
      throw error
    }
  },

  /**
   * 发送聊天消息
   * @param {string} userId - 接收消息的用户ID
   * @param {string} text - 消息内容
   * @returns {Promise} - 发送的消息数据
   */
  sendMessage: async (userId, text) => {
    try {
      return await api.post(endpoints.chat.send, { userId, text })
    } catch (error) {
      console.error("发送消息失败:", error)
      throw error
    }
  },
}

export default chatService
