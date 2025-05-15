/**
 * 卡片数据服务
 * 处理卡片相关的API请求
 */

import api from "./api"
import endpoints from "./endpoints"
import { getCurrentUser } from "./authService"
import { processExplorationCard, processExplorationsResponse } from "../utils/dataTransformer"

const cardService = {
  /**
   * 获取卡片列表（旧方法，保留向后兼容）
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
      }))

      return processedData
    } catch (error) {
      console.error("获取卡片数据失败:", error)
      throw error
    }
  },

  /**
   * 获取探索列表 (API规范: GET /v1/syntrust/explorations)
   * @param {Object} params - 查询参数，包括tab, pagination, filter, sort
   * @returns {Promise} - 探索列表数据，包含card和pagination
   */
  getExplorations: async (params = {}) => {
    try {
      // 获取当前用户
      const currentUser = getCurrentUser();
      
      // 构建符合API规范的请求参数
      const requestParams = {
        tab: params.tab || "community", // 默认为community
        user_id: currentUser?.id || "",
        pagination: params.pagination || {
          page: 1,
          per_page: 10
        }
      };

      // 如果有筛选条件，添加到搜索请求中
      if (params.filter || params.sort) {
        // 使用搜索接口
        const searchParams = {
          tab: requestParams.tab,
          filter: params.filter,
          sort: params.sort,
          pagination: requestParams.pagination
        };
        
        // 调用搜索接口
        const response = await api.post(
          endpoints.explorations.search, 
          searchParams,
          'ExplorationSearchRequest',
          'ExplorationSearchResponse'
        );
        
        // 处理响应数据
        return processExplorationsResponse(response);
      }
      
      // 调用列表接口
      const response = await api.get(
        endpoints.explorations.list, 
        { params: requestParams },
        'GetExplorationsPageResponse'
      );
      
      // 处理响应数据
      return processExplorationsResponse(response);
    } catch (error) {
      console.error("获取探索列表失败:", error);
      // 返回一个空的响应结构，避免前端报错
      return {
        card: [],
        pagination: {
          total: 0,
          page: 1,
          per_page: 10
        }
      };
    }
  },

  /**
   * 获取探索详情 (API规范: GET /v1/syntrust/exploration/{exploration_id})
   * @param {string} id - 探索ID
   * @returns {Promise} - 探索详情数据
   */
  getExplorationDetail: async (id) => {
    try {
      // 获取当前用户
      const currentUser = getCurrentUser();
      
      // 构建请求参数
      const requestParams = {
        user_id: currentUser?.id || ""
      };
      
      // 调用API
      const response = await api.get(
        endpoints.explorations.detail(id),
        { params: requestParams },
        'GetExplorationTaskResponse'
      );
      
      // 如果有exploration字段，处理数据
      if (response.exploration) {
        response.exploration = processExplorationCard(response.exploration);
      }
      
      return response;
    } catch (error) {
      console.error(`获取探索详情失败 (ID: ${id}):`, error);
      throw error;
    }
  },

  /**
   * 获取卡片详情（旧方法，保留向后兼容）
   * @param {string} id - 卡片ID
   * @returns {Promise} - 卡片详情数据
   */
  getCardDetail: async (id) => {
    try {
      const data = await api.get(endpoints.cards.detail(id))
      return data
    } catch (error) {
      console.error("获取卡片详情失败:", error)
      throw error
    }
  },

  /**
   * 创建卡片（旧方法，保留向后兼容）
   * @param {Object} cardData - 卡片数据
   * @returns {Promise} - 创建结果
   */
  createCard: async (cardData) => {
    try {
      const data = await api.post(endpoints.cards.create, cardData)
      return data
    } catch (error) {
      console.error("创建卡片失败:", error)
      throw error
    }
  },

  /**
   * 更新卡片（旧方法，保留向后兼容）
   * @param {string} id - 卡片ID
   * @param {Object} cardData - 更新数据
   * @returns {Promise} - 更新结果
   */
  updateCard: async (id, cardData) => {
    try {
      const data = await api.put(endpoints.cards.update(id), cardData)
      return data
    } catch (error) {
      console.error("更新卡片失败:", error)
      throw error
    }
  },

  /**
   * 删除卡片（旧方法，保留向后兼容）
   * @param {string} id - 卡片ID
   * @returns {Promise} - 删除结果
   */
  deleteCard: async (id) => {
    try {
      const data = await api.delete(endpoints.cards.delete(id))
      return data
    } catch (error) {
      console.error("删除卡片失败:", error)
      throw error
    }
  },
}

export default cardService
