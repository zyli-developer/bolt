/**
 * 用户数据服务
 * 处理用户相关的API请求
 */

import api from "./api"
import endpoints from "./endpoints"

const userService = {
  /**
   * 获取当前用户信息
   * @returns {Promise} - 当前用户数据
   */
  getCurrentUser: async () => {
    try {
      return await api.get(endpoints.users.current)
    } catch (error) {
      console.error("获取当前用户信息失败:", error)
      throw error
    }
  },

  /**
   * 获取用户列表
   * @param {Object} params - 查询参数
   * @returns {Promise} - 用户列表数据
   */
  getUsers: async (params = {}) => {
    try {
      return await api.get(endpoints.users.list, { params })
    } catch (error) {
      console.error("获取用户列表失败:", error)
      throw error
    }
  },

  /**
   * 获取用户详情
   * @param {string} id - 用户ID
   * @returns {Promise} - 用户详情数据
   */
  getUserDetail: async (id) => {
    try {
      return await api.get(endpoints.users.detail(id))
    } catch (error) {
      console.error(`获取用户详情失败 (ID: ${id}):`, error)
      throw error
    }
  },
}

export default userService
