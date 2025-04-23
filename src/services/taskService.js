/**
 * 任务数据服务
 * 处理任务相关的API请求
 */

import api from "./api"
import endpoints from "./endpoints"

const taskService = {
  /**
   * 获取任务列表
   * @param {Object} params - 查询参数，包括type（my/team）
   * @returns {Promise} - 任务列表数据
   */
  getTasks: async (params = {}) => {
    try {
      // Extract scope from params
      const { scope = "community" } = params

      // Get all tasks
      const response = await api.get(endpoints.tasks.list)
      let tasks = Array.isArray(response) ? response : []

      // Filter tasks based on scope
      if (scope === "personal") {
        // Filter for personal tasks (author.id === currentUser.id)
        tasks = tasks.filter((task) => task.type === "my")
      } else if (scope === "workspace") {
        // Filter for workspace tasks
        tasks = tasks.filter((task) => task.permission === "workspace")
      }
      // For community, return all tasks

      return tasks
    } catch (error) {
      console.error("获取任务列表失败:", error)
      // 出错时返回空数组
      return []
    }
  },

  /**
   * 获取任务详情
   * @param {string} id - 任务ID
   * @returns {Promise} - 任务详情数据
   */
  getTaskDetail: async (id) => {
    try {
      return await api.get(endpoints.tasks.detail(id))
    } catch (error) {
      console.error(`获取任务详情失败 (ID: ${id}):`, error)
      throw error
    }
  },

  /**
   * 创建新任务
   * @param {Object} taskData - 任务数据
   * @returns {Promise} - 创建的任务数据
   */
  createTask: async (taskData) => {
    try {
      return await api.post(endpoints.tasks.create, taskData)
    } catch (error) {
      console.error("创建任务失败:", error)
      throw error
    }
  },

  /**
   * 更新任务
   * @param {string} id - 任务ID
   * @param {Object} taskData - 更新的任务数据
   * @returns {Promise} - 更新后的任务数据
   */
  updateTask: async (id, taskData) => {
    try {
      return await api.put(endpoints.tasks.update(id), taskData)
    } catch (error) {
      console.error(`更新任务失败 (ID: ${id}):`, error)
      throw error
    }
  },

  /**
   * 删除任务
   * @param {string} id - 任务ID
   * @returns {Promise} - 删除结果
   */
  deleteTask: async (id) => {
    try {
      return await api.delete(endpoints.tasks.delete(id))
    } catch (error) {
      console.error(`删除任务失败 (ID: ${id}):`, error)
      throw error
    }
  },
}

export default taskService
