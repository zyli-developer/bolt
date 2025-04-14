/**
 * API请求工具
 * 封装了基本的API请求方法
 */

// 基础URL，可以根据环境变量配置
const BASE_URL = process.env.REACT_APP_API_BASE_URL || "/api"

/**
 * 处理API响应
 * @param {Response} response - fetch API的响应对象
 * @returns {Promise} - 处理后的响应数据
 */
const handleResponse = async (response) => {
  if (!response.ok) {
    // 如果响应状态码不是2xx，抛出错误
    const errorData = await response.json().catch(() => ({}))
    throw new Error(errorData.message || `请求失败: ${response.status}`)
  }

  // 检查内容类型，如果是JSON则解析为JSON
  const contentType = response.headers.get("content-type")
  if (contentType && contentType.includes("application/json")) {
    return response.json()
  }

  return response.text()
}

/**
 * 构建请求选项
 * @param {string} method - HTTP方法
 * @param {Object} data - 请求数据
 * @param {Object} options - 额外的请求选项
 * @returns {Object} - 完整的请求选项
 */
const buildRequestOptions = (method, data, options = {}) => {
  const requestOptions = {
    method,
    headers: {
      "Content-Type": "application/json",
      ...options.headers,
    },
    ...options,
  }

  if (data) {
    requestOptions.body = JSON.stringify(data)
  }

  return requestOptions
}

/**
 * API请求方法
 */
const api = {
  /**
   * GET请求
   * @param {string} endpoint - API端点
   * @param {Object} options - 请求选项
   * @returns {Promise} - 响应数据
   */
  get: async (endpoint, options = {}) => {
    const url = `${BASE_URL}${endpoint}`
    const response = await fetch(url, buildRequestOptions("GET", null, options))
    return handleResponse(response)
  },

  /**
   * POST请求
   * @param {string} endpoint - API端点
   * @param {Object} data - 请求数据
   * @param {Object} options - 请求选项
   * @returns {Promise} - 响应数据
   */
  post: async (endpoint, data, options = {}) => {
    const url = `${BASE_URL}${endpoint}`
    const response = await fetch(url, buildRequestOptions("POST", data, options))
    return handleResponse(response)
  },

  /**
   * PUT请求
   * @param {string} endpoint - API端点
   * @param {Object} data - 请求数据
   * @param {Object} options - 请求选项
   * @returns {Promise} - 响应数据
   */
  put: async (endpoint, data, options = {}) => {
    const url = `${BASE_URL}${endpoint}`
    const response = await fetch(url, buildRequestOptions("PUT", data, options))
    return handleResponse(response)
  },

  /**
   * DELETE请求
   * @param {string} endpoint - API端点
   * @param {Object} options - 请求选项
   * @returns {Promise} - 响应数据
   */
  delete: async (endpoint, options = {}) => {
    const url = `${BASE_URL}${endpoint}`
    const response = await fetch(url, buildRequestOptions("DELETE", null, options))
    return handleResponse(response)
  },
}

export default api
