import React, { createContext, useState, useContext, useEffect } from 'react';
import { useLocation } from 'react-router-dom';

// 创建优化模式上下文
export const OptimizationContext = createContext({
  isOptimizationMode: false,
  currentOptimizationStep: 'result', // 直接使用字符串标识步骤: result=结果质询, qa=QA优化, scene=场景优化, template=模板优化
  comments: {
    'result': [], // 结果质询对应CardDetailPage步骤0
    'qa': [],     // QA优化对应CardDetailPage步骤1
    'scene': [],  // 场景优化对应CardDetailPage步骤2
    'template': [] // 模板优化对应CardDetailPage步骤3
  },  // 对象类型，完全与task.annotation结构一致
  currentStepComments: [], // 当前步骤的注释列表
  setIsOptimizationMode: () => {},
  setCurrentOptimizationStep: () => {},
  addComment: () => {}, // 新增添加单条注释的方法
  setStepComments: () => {}, // 设置特定步骤的注释列表
});

// 优化模式提供者组件
export const OptimizationProvider = ({ children }) => {
  const [isOptimizationMode, setIsOptimizationMode] = useState(false);
  // 直接使用字符串标识步骤，与task.annotation字段完全对应
  const [currentOptimizationStep, setCurrentOptimizationStep] = useState('result');
  // 使用对象存储各步骤的注释，完全与task.annotation结构一致
  const [commentsMap, setCommentsMap] = useState({
    result: [], // 结果质询对应CardDetailPage步骤0
    qa: [],     // QA优化对应CardDetailPage步骤1
    scene: [],  // 场景优化对应CardDetailPage步骤2
    template: [] // 模板优化对应CardDetailPage步骤3
  });
  const location = useLocation();
  
  // 当前步骤的注释列表 - 直接使用步骤名称作为键
  // 不再需要getStepType函数，因为我们已经使用字符串标识步骤
  const currentStepComments = commentsMap[currentOptimizationStep] || [];

  // 为特定步骤添加新的注释
  const addComment = (comment) => {
    // 确保comment具有step字段，该字段指示注释类型(qa/scene/template/result)
    // 如果没有step字段，使用当前步骤
    const commentType = comment.step || currentOptimizationStep;
    
    setCommentsMap(prevMap => {
      const stepComments = prevMap[commentType] || [];
      return {
        ...prevMap,
        [commentType]: [...stepComments, comment]
      };
    });
  };

  // 设置特定步骤的注释列表
  const setStepComments = (stepType, comments) => {
    // 直接使用步骤类型字符串(qa/scene/template/result)
    setCommentsMap(prevMap => ({
      ...prevMap,
      [stepType]: comments
    }));
  };

  // 简化方法，直接设置当前步骤的注释列表
  const setCurrentStepComments = (comments) => {
    // 直接使用当前步骤类型
    setCommentsMap(prevMap => ({
      ...prevMap,
      [currentOptimizationStep]: comments
    }));
  };

  // 当步骤变化时，初始化该步骤的注释列表（如果不存在）
  useEffect(() => {
    if (!commentsMap[currentOptimizationStep]) {
      setCommentsMap(prevMap => ({
        ...prevMap,
        [currentOptimizationStep]: []
      }));
    }
  }, [currentOptimizationStep, commentsMap]);

  // 监听路由变化，当离开详情页时自动关闭优化模式
  useEffect(() => {
    const path = location.pathname;
    
    // 检查是否在探索详情页
    const isExplorationDetail = path.includes('/explore/detail/');
    
    // 如果不在探索详情页，且优化模式开启，则关闭优化模式
    if (!isExplorationDetail && isOptimizationMode) {
      console.log('已离开探索详情页，重置优化模式');
      setIsOptimizationMode(false);
      setCurrentOptimizationStep('result'); // 重置为result(结果质询)步骤
    }
  }, [location.pathname, isOptimizationMode]);

  // 优化模式上下文值
  const optimizationContextValue = {
    isOptimizationMode,
    currentOptimizationStep,
    comments: commentsMap, // 所有步骤的注释映射
    currentStepComments, // 当前步骤的注释列表
    setIsOptimizationMode,
    setCurrentOptimizationStep,
    addComment, // 添加单条注释
    setStepComments, // 设置特定步骤的注释列表
    setComments: setCurrentStepComments, // 兼容原来的API
  };

  return (
    <OptimizationContext.Provider value={optimizationContextValue}>
      {children}
    </OptimizationContext.Provider>
  );
};

// 自定义钩子，用于访问优化模式上下文
export const useOptimization = () => useContext(OptimizationContext); 