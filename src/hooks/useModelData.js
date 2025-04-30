import { useCallback } from 'react';

/**
 * 处理模型数据的自定义Hook
 * @returns {Object} 包含模型相关处理方法的对象
 */
const useModelData = () => {
  /**
   * 获取模型颜色
   * @param {string} modelKey - 模型标识
   * @returns {string} 模型对应的颜色值
   */
  const getModelColor = useCallback((modelKey) => {
    switch (modelKey) {
      case 'claude3.5':
        return '#3ac0a0';
      case 'claude3.6':
        return '#006ffd';
      case 'claude3.7':
        return '#722ed1';
      case 'agent2':
        return '#ff7a45';
      case 'deepseek':
        return '#722ed1';
      default:
        return '#8f9098';
    }
  }, []);

  return {
    getModelColor
  };
};

export default useModelData; 