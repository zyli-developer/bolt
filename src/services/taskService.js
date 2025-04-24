/**
 * 任务数据服务
 * 处理任务相关的API请求
 */

import api from "./api"
import endpoints from "./endpoints"
import { cardsData, modelEvaluationData, tasksData } from "../mocks/data"

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
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const task = tasksData.find(task => task.id === parseInt(id))
        if (task) {
          resolve(task)
        } else {
          reject(new Error("任务不存在"))
        }
      }, 500)
    })
  },

  /**
   * 获取任务注释
   * @param {string} id - 任务ID
   * @returns {Promise} - 任务注释数据
   */
  getTaskAnnotations: async (id) => {
    const response = await fetch(`/api/tasks/${id}/annotations`);
    if (!response.ok) {
      throw new Error('获取任务注释失败');
    }
    return response.json();
  },

  /**
   * 获取模型评估数据
   * @param {string} modelId - 模型ID
   * @returns {Promise} - 模型评估数据
   */
  getModelEvaluation: async (modelId) => {
    const response = await fetch(`/api/evaluations/${modelId}`);
    if (!response.ok) {
      throw new Error('获取模型评估数据失败');
    }
    return response.json();
  },

  /**
   * 获取所有模型评估数据
   * @returns {Promise} - 所有模型评估数据
   */
  getAllModelEvaluations: async () => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(modelEvaluationData)
      }, 500)
    })
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

  // 获取卡片详情
  getCardDetail: async (id) => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const card = cardsData.find(card => card.id === parseInt(id))
        if (card) {
          resolve(card)
        } else {
          reject(new Error("卡片不存在"))
        }
      }, 500)
    })
  }
}

export default taskService
