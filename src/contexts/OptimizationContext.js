import React, { createContext, useState, useContext, useEffect } from 'react';
import { useLocation } from 'react-router-dom';

// 创建优化模式上下文
export const OptimizationContext = createContext({
  isOptimizationMode: false,
  currentOptimizationStep: 0,
  comments: {},  // 改为对象，每个步骤有独立的注释列表
  currentStepComments: [], // 当前步骤的注释列表
  setIsOptimizationMode: () => {},
  setCurrentOptimizationStep: () => {},
  addComment: () => {}, // 新增添加单条注释的方法
  setStepComments: () => {}, // 设置特定步骤的注释列表
});

// 优化模式提供者组件
export const OptimizationProvider = ({ children }) => {
  const [isOptimizationMode, setIsOptimizationMode] = useState(false);
  const [currentOptimizationStep, setCurrentOptimizationStep] = useState(0);
  // 使用对象存储各步骤的注释，格式为 { 0: [...step0Comments], 1: [...step1Comments], ... }
  const [commentsMap, setCommentsMap] = useState({});
  const location = useLocation();
  
  // 当前步骤的注释列表
  const currentStepComments = commentsMap[currentOptimizationStep] || [];

  // 为特定步骤添加新的注释
  const addComment = (comment) => {
    setCommentsMap(prevMap => {
      const stepComments = prevMap[currentOptimizationStep] || [];
      return {
        ...prevMap,
        [currentOptimizationStep]: [...stepComments, comment]
      };
    });
  };

  // 设置特定步骤的注释列表
  const setStepComments = (stepIndex, comments) => {
    setCommentsMap(prevMap => ({
      ...prevMap,
      [stepIndex]: comments
    }));
  };

  // 简化方法，直接设置当前步骤的注释列表
  const setCurrentStepComments = (comments) => {
    setStepComments(currentOptimizationStep, comments);
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
      setCurrentOptimizationStep(0);
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