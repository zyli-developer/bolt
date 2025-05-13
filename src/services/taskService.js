/**
 * 任务数据服务
 * 处理任务相关的API请求
 */

import api from "./api"
import endpoints from "./endpoints"
import { getCurrentUser } from "./authService"
import { processTaskCard, processTasksResponse } from "../utils/dataTransformer"
import { modelEvaluationData } from "../mocks/data"

const taskService = {
  /**
   * 获取任务列表 (API规范: GET /v1/syntrust/tasks)
   * @param {Object} params - 查询参数，包括tab, pagination, filter, sort
   * @returns {Promise} - 任务列表数据，包含card和pagination
   */
  getTasks: async (params = {}) => {
    try {
      console.log("获取任务列表，参数:", params);
      
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
        
        console.log("使用搜索接口获取数据:", searchParams);
        
        // 调用搜索接口
        const response = await api.post(
          endpoints.tasks.search, 
          searchParams,
          'TaskSearchRequest',
          'TaskSearchResponse'
        );
        
        // 处理响应数据
        const processedResponse = processTasksResponse(response);
        console.log("搜索接口返回数据，处理后:", processedResponse);
        return processedResponse;
      }
      
      console.log("使用列表接口获取数据:", requestParams);
      
      // 调用列表接口
      const response = await api.get(
        endpoints.tasks.list, 
        { params: requestParams },
        'GetTasksPageResponse'
      );
      
      // 处理响应数据
      const processedResponse = processTasksResponse(response);
      console.log("列表接口返回数据，处理后:", processedResponse);
      return processedResponse;
    } catch (error) {
      console.error("获取任务列表失败:", error);
      // 从mock数据中获取任务列表
      console.log("尝试从mock数据中获取任务列表");
      const { taskCardsData } = require("../mocks/data");
      
      // 模拟分页
      const page = params.pagination?.page || 1;
      const perPage = params.pagination?.per_page || 10;
      const startIndex = (page - 1) * perPage;
      const endIndex = startIndex + perPage;
      
      // 返回处理后的模拟数据
      const mockResponse = {
        card: taskCardsData.slice(startIndex, endIndex),
        pagination: {
          total: taskCardsData.length,
          page: page,
          per_page: perPage
        }
      };
      
      console.log("返回mock数据:", mockResponse);
      return mockResponse;
    }
  },

  /**
   * 获取任务详情 (API规范: GET /v1/syntrust/task/{task_id})
   * @param {string} id - 任务ID
   * @returns {Promise} - 任务详情数据
   */
  getTaskDetail: async (id) => {
    try {
      // 获取当前用户
      const currentUser = getCurrentUser();
      
      // 构建请求参数
      const requestParams = {
        user_id: currentUser?.id || ""
      };
      
      // 调用API
      const response = await api.get(
        endpoints.tasks.detail(id),
        { params: requestParams },
        'GetTaskResponse'
      );
      
      // 如果有task字段，处理数据
      if (response.task) {
        response.task = processTaskCard(response.task);
      }
      
      return response;
    } catch (error) {
      console.error(`获取任务详情失败 (ID: ${id}):`, error);
      
      // 返回mock数据，防止前端崩溃
      // 从taskCardsData中查找对应ID的任务
      const { taskCardsData } = require("../mocks/data");
      const mockTask = taskCardsData.find(task => task.id === id);
      
      if (mockTask) {
        console.log("使用mock数据:", mockTask);
        return { task: mockTask };
      }
      
      // 如果没有找到对应ID的任务，返回一个基本的任务结构
      return {
        task: {
          id: id,
          title: `任务 ${id}`,
          author: {
            name: "系统",
            avatar: null
          },
          source: "本地测试",
          tags: ["测试", "示例"],
          description: "这是一个示例任务，用于在API调用失败时显示",
          chartData: {
            radar: [
              { name: "维度1", value: 80 },
              { name: "维度2", value: 75 },
              { name: "维度3", value: 85 }
            ],
            line: [
              { month: "08", value: 70 },
              { month: "09", value: 75 },
              { month: "10", value: 80 }
            ]
          }
        }
      };
    }
  },

  /**
   * 获取任务QnA数据 (API规范: GET /v1/syntrust/task/{task_id}/qna)
   * @param {string} id - 任务ID
   * @returns {Promise} - 任务QnA数据
   */
  getTaskQna: async (id) => {
    try {
      // 获取当前用户
      const currentUser = getCurrentUser();
      
      // 构建请求参数
      const requestParams = {
        user_id: currentUser?.id || ""
      };
      
      // 调用API
      return await api.get(
        endpoints.tasks.qna(id),
        { params: requestParams },
        'GetTaskQnaResponse'
      );
    } catch (error) {
      console.error(`获取任务QnA数据失败 (ID: ${id}):`, error);
      throw error;
    }
  },

  /**
   * 获取任务场景数据 (API规范: GET /v1/syntrust/task/{task_id}/scenario)
   * @param {string} id - 任务ID
   * @returns {Promise} - 任务场景数据
   */
  getTaskScenario: async (id) => {
    try {
      // 获取当前用户
      const currentUser = getCurrentUser();
      
      // 构建请求参数
      const requestParams = {
        user_id: currentUser?.id || ""
      };
      
      // 调用API
      return await api.get(
        endpoints.tasks.scenario(id),
        { params: requestParams },
        'GetTaskScenarioResponse'
      );
    } catch (error) {
      console.error(`获取任务场景数据失败 (ID: ${id}):`, error);
      throw error;
    }
  },

  /**
   * 获取任务流程数据 (API规范: GET /v1/syntrust/task/{task_id}/flow)
   * @param {string} id - 任务ID
   * @returns {Promise} - 任务流程数据
   */
  getTaskFlow: async (id) => {
    try {
      // 获取当前用户
      const currentUser = getCurrentUser();
      
      // 构建请求参数
      const requestParams = {
        user_id: currentUser?.id || ""
      };
      
      // 调用API
      return await api.get(
        endpoints.tasks.flow(id),
        { params: requestParams },
        'GetTaskFlowResponse'
      );
    } catch (error) {
      console.error(`获取任务流程数据失败 (ID: ${id}):`, error);
      throw error;
    }
  },

  /**
   * 创建任务 (API规范: POST /v1/syntrust/task)
   * @param {Object} taskData - 任务数据
   * @returns {Promise} - 创建结果
   */
  createTask: async (taskData) => {
    try {
      // 获取当前用户
      const currentUser = getCurrentUser();
      
      // 添加用户信息
      const requestData = {
        ...taskData,
        user_id: currentUser?.id || ""
      };
      
      // ---- 使用mock数据，不调用真实API ----
      console.log("创建任务(模拟):", requestData);
      
      // 模拟API延迟
      await new Promise(resolve => setTimeout(resolve, 800));
      
      // 返回模拟的成功响应
      return {
        task_id: `task_${Date.now()}`,
        status: "success",
        message: "任务创建成功(模拟)"
      };
      
      /* 实际API调用代码（暂时注释掉）
      return await api.post(
        endpoints.tasks.create,
        requestData,
        'CreateTaskRequest',
        'CreateTaskResponse'
      );
      */
    } catch (error) {
      console.error("创建任务失败:", error);
      throw error;
    }
  },

  /**
   * 更新任务 (API规范: PUT /v1/syntrust/task/{task_id})
   * @param {string} id - 任务ID
   * @param {Object} taskData - 更新数据
   * @returns {Promise} - 更新结果
   */
  updateTask: async (id, taskData) => {
    try {
      // 获取当前用户
      const currentUser = getCurrentUser();
      
      // 添加用户信息
      const requestData = {
        ...taskData,
        user_id: currentUser?.id || ""
      };
      
      // 调用API
      return await api.put(
        endpoints.tasks.update(id),
        requestData,
        'UpdateTaskRequest',
        'UpdateTaskResponse'
      );
    } catch (error) {
      console.error(`更新任务失败 (ID: ${id}):`, error);
      throw error;
    }
  },

  /**
   * 删除任务 (API规范: DELETE /v1/syntrust/task/{task_id})
   * @param {string} id - 任务ID
   * @returns {Promise} - 删除结果
   */
  deleteTask: async (id) => {
    try {
      // 获取当前用户
      const currentUser = getCurrentUser();
      
      // 构建请求参数
      const requestData = {
        user_id: currentUser?.id || ""
      };
      
      // 调用API
      return await api.delete(
        endpoints.tasks.delete(id),
        requestData,
        'DeleteTaskRequest',
        'DeleteTaskResponse'
      );
    } catch (error) {
      console.error(`删除任务失败 (ID: ${id}):`, error);
      throw error;
    }
  },

  /**
   * 获取所有模型评估数据
   * @returns {Object} - 所有模型的评估数据
   */
  getAllModelEvaluations: () => {
    // 直接返回mock数据
    return modelEvaluationData;
  }
}

export default taskService
