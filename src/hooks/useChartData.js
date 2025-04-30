import { useMemo } from 'react';

/**
 * 图表数据处理的自定义Hook
 * @param {Object} card - 卡片数据
 * @param {Array} selectedModels - 选中的模型
 * @returns {Object} 处理后的雷达图和折线图数据
 */
const useChartData = (card, selectedModels) => {
  return useMemo(() => {
    if (!card || !card.chartData) return { radar: [], line: [] };
    
    // 雷达图数据处理
    const enhancedRadar = card.chartData.radar.map((item, index) => ({
      name: item.name,
      value: item.value,
      'claude3.5': Math.min(100, item.value * (1 + Math.sin(index) * 0.2)),
      'claude3.6': Math.min(100, item.value * (1 + Math.cos(index) * 0.15)),
      'claude3.7': Math.min(100, item.value * (1 + Math.sin(index + 0.5) * 0.1)),
      agent2: Math.min(100, item.value * (1 - Math.cos(index) * 0.15)),
      deepseek: Math.min(100, item.value * (1 + Math.sin(index + 1) * 0.2)),
    }));

    // 折线图数据处理
    const enhancedLine = card.chartData.line.map((item, index) => ({
      month: item.month,
      value: item.value,
      'claude3.5': Math.min(100, item.value * (1 + Math.sin(index) * 0.1)),
      'claude3.6': Math.min(100, item.value * (1 + Math.cos(index) * 0.12)),
      'claude3.7': Math.min(100, item.value * (1 + Math.sin(index + 0.5) * 0.08)),
      agent2: Math.min(100, item.value * (1 - Math.cos(index) * 0.1)),
      deepseek: Math.min(100, item.value * (1 + Math.sin(index + 1) * 0.12)),
    }));

    return { radar: enhancedRadar, line: enhancedLine };
  }, [card, selectedModels]);
};

export default useChartData; 