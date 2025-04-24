/**
 * 卡片数据服务
 * 处理卡片相关的API请求
 */

import api from "./api"
import endpoints from "./endpoints"

const cardService = {
  /**
   * 获取卡片列表
   * @param {Object} params - 查询参数，包括page, limit, scope等
   * @returns {Promise} - 卡片列表数据
   */
  getCards: async (params = {}) => {
    try {
      // 构建请求参数，确保包含scope
      const requestParams = {
        ...params,
        scope: params.scope || "community", // 默认为community
      }

      const data = await api.get(endpoints.cards.list, { params: requestParams })

      // 确保每个卡片都有必要的属性
      const processedData = data.map((card) => ({
        ...card,
        agents: card.agents || {
          overall: false,
          agent1: false,
          agent2: false,
        },
        chartData: card.chartData || {
          radar: [],
          line: [],
        },
        changes: card.changes || [],
        credibilityChange: card.credibilityChange || "+0.0%",
        scoreChange: card.scoreChange || "+0.0%",
      }))

      return processedData
    } catch (error) {
      console.error("获取卡片列表失败:", error)
      throw error
    }
  },

  /**
   * 获取卡片详情
   * @param {string} id - 卡片ID
   * @returns {Promise} - 卡片详情数据
   */
  getCardDetail: async (id) => {
    const response = await fetch(`/api/cards/${id}`);
    if (!response.ok) {
      throw new Error('获取卡片详情失败');
    }
    return response.json();
  },

  /**
   * 创建新卡片
   * @param {Object} cardData - 卡片数据
   * @returns {Promise} - 创建的卡片数据
   */
  createCard: async (cardData) => {
    try {
      return await api.post(endpoints.cards.create, cardData)
    } catch (error) {
      console.error("创建卡片失败:", error)
      throw error
    }
  },

  /**
   * 更新卡片
   * @param {string} id - 卡片ID
   * @param {Object} cardData - 更新的卡片数据
   * @returns {Promise} - 更新后的卡片数据
   */
  updateCard: async (id, cardData) => {
    try {
      return await api.put(endpoints.cards.update(id), cardData)
    } catch (error) {
      console.error(`更新卡片失败 (ID: ${id}):`, error)
      throw error
    }
  },

  /**
   * 删除卡片
   * @param {string} id - 卡片ID
   * @returns {Promise} - 删除结果
   */
  deleteCard: async (id) => {
    try {
      return await api.delete(endpoints.cards.delete(id))
    } catch (error) {
      console.error(`删除卡片失败 (ID: ${id}):`, error)
      throw error
    }
  },
}

export default cardService
