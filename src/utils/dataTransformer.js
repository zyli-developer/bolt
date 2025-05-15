/**
 * 数据转换工具
 * 处理API返回的数据格式，转换为前端需要的格式
 */

import { timestampToDate } from './protobufHelper';

/**
 * 处理探索卡片数据
 * @param {Object} card - API返回的探索卡片数据
 * @returns {Object} - 处理后的卡片数据
 */
export const processExplorationCard = (card) => {
  // 处理雷达图数据
  const radarData = card.step && card.step.length > 0 && card.step[card.step.length - 1].score 
    ? card.step[card.step.length - 1].score
        .filter(s => s.dimension && s.dimension.length > 0)
        .flatMap(s => s.dimension.map(d => ({
          name: d.latitude,
          value: d.weight * 100 // 转换为百分比值
        }))) 
    : [];
  
  // 处理折线图数据
  const lineData = card.step 
    ? card.step.map((s, index) => ({
        name: `步骤${index + 1}`,
        value: s.score && s.score.length > 0 
          ? parseFloat(s.score[0].score) * 100 
          : 0 // 使用第一个评分，转换为百分比值
      })) 
    : [];
  
  // 处理时间戳
  const createdAt = card.created_at ? timestampToDate(card.created_at) : new Date();
  
  // 确保templateData正确设置
  let processedCard = {
    ...card,
    created_at: createdAt,
    agents: card.agents || {
      overall: false,
      agent1: false,
      agent2: false,
    },
    chartData: {
      radar: radarData,
      line: lineData
    },
    changes: [],
    credibilityChange: "+0.0%",
    scoreChange: "+0.0%",
  };
  
  // 如果没有templateData字段但有step数据，可以尝试从中创建templateData
  if (!processedCard.templateData && processedCard.step) {
    if (Array.isArray(processedCard.step)) {
      // 保持原有的step数组结构，不做修改
    } else if (typeof processedCard.step === 'object') {
      // 如果step是一个对象而不是数组，尝试查找其中的templateData
      if (processedCard.step.templateData) {
        processedCard.templateData = processedCard.step.templateData;
      }
    }
  }
  
  return processedCard;
};

/**
 * 处理任务卡片数据
 * @param {Object} task - API返回的任务卡片数据
 * @returns {Object} - 处理后的任务数据
 */
export const processTaskCard = (task) => {
  // 处理雷达图数据
  const radarData = task.step && task.step.length > 0 && task.step[task.step.length - 1].score 
    ? task.step[task.step.length - 1].score
        .filter(s => s.dimension && s.dimension.length > 0)
        .flatMap(s => s.dimension.map(d => ({
          name: d.latitude,
          value: d.weight * 100 // 转换为百分比值
        }))) 
    : [];
  
  // 处理折线图数据
  const lineData = task.step 
    ? task.step.map((s, index) => ({
        name: `步骤${index + 1}`,
        value: s.score && s.score.length > 0 
          ? parseFloat(s.score[0].score) * 100 
          : 0 // 使用第一个评分，转换为百分比值
      })) 
    : [];
  
  // 处理时间戳
  const createdAt = task.created_at ? timestampToDate(task.created_at) : new Date();
  
  // 确保templateData正确设置
  let processedTask = {
    ...task,
    created_at: createdAt,
    agents: task.agents || {
      overall: false,
      agent1: false,
      agent2: false,
    },
    chartData: {
      radar: radarData,
      line: lineData
    },
    changes: [],
    credibilityChange: "+0.0%",
    scoreChange: "+0.0%",
  };
  
  // 如果没有templateData字段但有step数据，可以尝试从中创建templateData
  if (!processedTask.templateData && processedTask.step) {
    if (Array.isArray(processedTask.step)) {
      // 保持原有的step数组结构，不做修改
    } else if (typeof processedTask.step === 'object') {
      // 如果step是一个对象而不是数组，尝试查找其中的templateData
      if (processedTask.step.templateData) {
        processedTask.templateData = processedTask.step.templateData;
      }
    }
  }
  
  return processedTask;
};

/**
 * 处理探索列表响应
 * @param {Object} response - API返回的探索列表响应
 * @returns {Object} - 处理后的响应数据
 */
export const processExplorationsResponse = (response) => {
  // 如果响应为空或无效，返回默认结构
  if (!response || !response.card) {
    return {
      card: [],
      pagination: {
        total: 0,
        page: 1,
        per_page: 10
      }
    };
  }
  
  // 处理卡片数据
  const processedCards = Array.isArray(response.card) 
    ? response.card.map(processExplorationCard)
    : [];
  
  return {
    card: processedCards,
    pagination: response.pagination || {
      total: 0,
      page: 1,
      per_page: 10
    },
    filter_echo: response.filter_echo || null,
    sort_echo: response.sort_echo || null
  };
};

/**
 * 处理任务列表响应
 * @param {Object} response - API返回的任务列表响应
 * @returns {Object} - 处理后的响应数据
 */
export const processTasksResponse = (response) => {
  // 如果响应为空或无效，返回默认结构
  if (!response || !response.card) {
    return {
      card: [],
      pagination: {
        total: 0,
        page: 1,
        per_page: 10
      }
    };
  }
  
  // 处理卡片数据
  const processedCards = Array.isArray(response.card) 
    ? response.card.map(processTaskCard)
    : [];
  
  return {
    card: processedCards,
    pagination: response.pagination || {
      total: 0,
      page: 1,
      per_page: 10
    },
    filter_echo: response.filter_echo || null,
    sort_echo: response.sort_echo || null
  };
}; 