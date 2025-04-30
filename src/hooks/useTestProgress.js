import { useState, useEffect, useCallback } from 'react';

/**
 * 测试进度的自定义Hook
 * @param {Function} onComplete - 进度完成后的回调函数
 * @returns {Object} 包含测试状态、进度和开始测试方法的对象
 */
const useTestProgress = (onComplete) => {
  const [isTesting, setIsTesting] = useState(false);
  const [testProgress, setTestProgress] = useState(0);
  
  // 开始测试方法
  const startTest = useCallback(() => {
    setIsTesting(true);
    setTestProgress(0);
  }, []);
  
  // 监听测试状态变化
  useEffect(() => {
    let timer;
    if (isTesting && testProgress < 100) {
      timer = setInterval(() => {
        setTestProgress(prev => {
          const next = prev + 1;
          if (next >= 100) {
            clearInterval(timer);
            setIsTesting(false);
            if (onComplete) onComplete();
          }
          return next;
        });
      }, 100);
    }
    return () => timer && clearInterval(timer);
  }, [isTesting, testProgress, onComplete]);
  
  return { isTesting, testProgress, startTest };
};

export default useTestProgress; 