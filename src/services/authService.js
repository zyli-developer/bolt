/**
 * 认证服务
 * 处理JWT Token的存储和获取
 */

// Token存储键名
const TOKEN_KEY = 'syntrust_auth_token';
const USER_KEY = 'syntrust_user';

/**
 * 保存认证信息
 * @param {Object} authData - 认证数据，包含token和user
 */
export const saveAuth = (authData) => {
  if (authData.token) {
    localStorage.setItem(TOKEN_KEY, authData.token);
  }
  
  if (authData.user) {
    localStorage.setItem(USER_KEY, JSON.stringify(authData.user));
  }
};

/**
 * 获取认证Token
 * @returns {string|null} - JWT Token或null
 */
export const getToken = () => {
  return localStorage.getItem(TOKEN_KEY);
};

/**
 * 获取当前用户信息
 * @returns {Object|null} - 用户信息或null
 */
export const getCurrentUser = () => {
  const userStr = localStorage.getItem(USER_KEY);
  if (!userStr) return null;
  
  try {
    return JSON.parse(userStr);
  } catch (error) {
    console.error('解析用户信息失败:', error);
    return null;
  }
};

/**
 * 检查是否已认证
 * @returns {boolean} - 是否已认证
 */
export const isAuthenticated = () => {
  return !!getToken();
};

/**
 * 清除认证信息
 */
export const clearAuth = () => {
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(USER_KEY);
};

/**
 * 登录
 * @param {Object} credentials - 登录凭证
 * @returns {Promise} - 登录结果
 */
export const login = async (credentials) => {
  // 这里应该调用实际的登录API
  // 示例实现
  return new Promise((resolve) => {
    setTimeout(() => {
      const mockResponse = {
        token: 'mock_jwt_token',
        user: {
          id: 'user123',
          name: '测试用户',
          email: 'test@example.com',
          role: 'user'
        },
        sidebar_list: {},
        user_signature: 'signature',
        workspace: 'default'
      };
      
      saveAuth(mockResponse);
      resolve(mockResponse);
    }, 500);
  });
};

/**
 * 登出
 */
export const logout = () => {
  clearAuth();
  // 可以在这里添加其他登出逻辑，如重定向到登录页
};

/**
 * 刷新Token
 * @returns {Promise} - 刷新结果
 */
export const refreshToken = async () => {
  // 实际项目中应该调用刷新Token的API
  // 这里仅作示例
  return Promise.resolve();
};

export default {
  saveAuth,
  getToken,
  getCurrentUser,
  isAuthenticated,
  clearAuth,
  login,
  logout,
  refreshToken
}; 