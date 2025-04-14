/**
 * 菜单数据服务
 * 处理菜单相关的API请求
 */

import api from "./api"
import endpoints from "./endpoints"

const menuService = {
  /**
   * 获取菜单列表
   * @returns {Promise} - 菜单列表数据
   */
  getMenuItems: async () => {
    try {
      return await api.get(endpoints.menu.list)
    } catch (error) {
      console.error("获取菜单列表失败:", error)
      throw error
    }
  },
}

export default menuService
