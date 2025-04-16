/**
 * 工作区数据服务
 * 处理工作区相关的API请求
 */

import api from "./api"
import endpoints from "./endpoints"

const workspaceService = {
  /**
   * 获取工作区列表
   * @returns {Promise} - 工作区列表数据
   */
  getWorkspaces: async () => {
    try {
      return await api.get(endpoints.workspace.list)
    } catch (error) {
      console.error("获取工作区列表失败:", error)
      throw error
    }
  },

  /**
   * 获取当前工作区
   * @returns {Promise} - 当前工作区数据
   */
  getCurrentWorkspace: async () => {
    try {
      return await api.get(endpoints.workspace.current)
    } catch (error) {
      console.error("获取当前工作区失败:", error)
      throw error
    }
  },

  /**
   * 获取工作区详情
   * @param {string} id - 工作区ID
   * @returns {Promise} - 工作区详情数据
   */
  getWorkspaceDetail: async (id) => {
    try {
      return await api.get(endpoints.workspace.detail(id))
    } catch (error) {
      console.error(`获取工作区详情失败 (ID: ${id}):`, error)
      throw error
    }
  },

  /**
   * 切换当前工作区
   * @param {string} id - 工作区ID
   * @returns {Promise} - 切换结果
   */
  switchWorkspace: async (id) => {
    try {
      return await api.post(endpoints.workspace.switch(id))
    } catch (error) {
      console.error(`切换工作区失败 (ID: ${id}):`, error)
      throw error
    }
  },
}

export default workspaceService
