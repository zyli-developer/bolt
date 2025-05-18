import React, { useState, useContext, useMemo } from 'react';
import { 
  Typography, 
  Avatar, 
  Tag, 
  Select,
  Checkbox,
  Spin,
  Button,
  message
} from 'antd';
import {
  PlusOutlined,
  MinusOutlined
} from '@ant-design/icons';
import AnnotationModal from '../../components/annotations/AnnotationModal';
import { OptimizationContext } from '../../contexts/OptimizationContext';
import {
  Area,
  AreaChart,
  ResponsiveContainer,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as RechartsTooltip,
  Radar,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
} from 'recharts';

const { Option } = Select;

const ResultPage = ({ 
  task, 
  enhancedChartData, 
  evaluationData, 
  selectedModels, 
  selectedModel,
  expandedModel,
  radarMaxValue,
  handleModelChange,
  handleSelectAll,
  toggleModelPanel,
  getModelColor,
  onAddAnnotation
}) => {
  const [annotationModalVisible, setAnnotationModalVisible] = useState(false);
  const [selectedText, setSelectedText] = useState(''); // 添加用于保存选中文本的状态
  
  // 添加处理保存注释的方法
  const handleSaveAnnotation = async (data) => {
    try {
      // 创建注释数据对象
      const annotationData = {
        ...data,
        selectedText: data.selectedText || selectedText,
        id: `annotation-${Date.now()}`, // 确保有唯一ID
        step: 'result', // 明确标记为结果质询的注释，与task.annotation.result对应
        time: new Date().toISOString()
      };
      
      // 如果父组件提供了onAddAnnotation函数，调用它将注释添加到task中
      if (onAddAnnotation && typeof onAddAnnotation === 'function') {
        onAddAnnotation(annotationData);
      }
      
      // 同时更新全局状态 - 结果质询对应步骤0
      if (currentOptimizationStep === 0) {
        addComment(annotationData);
      }
      
      // 关闭模态框
      setAnnotationModalVisible(false);
      setSelectedText('');
      
      message.success('添加观点成功');
    } catch (error) {
      console.error('添加观点失败:', error);
      message.error('添加观点失败');
    }
  };
  
  // 引入全局优化上下文
  const { 
    currentOptimizationStep, 
    currentStepComments,
    addComment,
    setStepComments
  } = useContext(OptimizationContext);
  // 从task.step中提取模型数据
  const stepsData = useMemo(() => {
    if (!task || !task.step) {
      return [];
    }
    
    // 确保steps是数组
    const steps = Array.isArray(task.step) ? task.step : [task.step];
    
    // 提取模型信息
    return steps.filter(step => step && step.agent);
  }, [task]);

  // 获取可用的模型选项
  const modelOptions = useMemo(() => {
    // 如果有stepsData就使用它，否则回退到evaluationData
    if (stepsData && stepsData.length > 0) {
      return stepsData.map(step => {
        // 将agent名称转为小写并移除空格作为key
        return step.agent.toLowerCase().replace(/\s+/g, '');
      });
    }
    return Object.keys(evaluationData || {});
  }, [stepsData, evaluationData]);

  // 获取当前选中的评估数据
  const currentEvaluation = useMemo(() => {
    // 尝试从stepsData中找到匹配的模型
    if (stepsData && stepsData.length > 0 && selectedModel) {
      const selectedStep = stepsData.find(step => 
        step.agent.toLowerCase().replace(/\s+/g, '') === selectedModel
      );
      
      if (selectedStep) {
        // 确保score是字符串或数字，不是对象
        let scoreValue = 70; // 默认值70而不是'N/A'
        if (selectedStep.score) {
          if (Array.isArray(selectedStep.score) && selectedStep.score.length > 0) {
            const scoreObj = selectedStep.score[0];
            // 处理score可能是对象的情况
            if (scoreObj && typeof scoreObj === 'object') {
              if (typeof scoreObj.score === 'string' || typeof scoreObj.score === 'number') {
                scoreValue = scoreObj.score;
              }
            } else if (typeof scoreObj === 'string' || typeof scoreObj === 'number') {
              scoreValue = scoreObj;
            }
          } else if (typeof selectedStep.score === 'string' || typeof selectedStep.score === 'number') {
            scoreValue = selectedStep.score;
          }
        }
        
        // 确保confidence是字符串或数字，不是对象
        let confidenceValue = 75; // 默认值75而不是'N/A'
        if (selectedStep.score && Array.isArray(selectedStep.score) && selectedStep.score.length > 0) {
          const scoreObj = selectedStep.score[0];
          if (scoreObj && typeof scoreObj === 'object' && 
              (typeof scoreObj.confidence === 'string' || typeof scoreObj.confidence === 'number')) {
            confidenceValue = parseFloat(scoreObj.confidence) * 100;
          }
        }
        
        return {
          name: selectedStep.agent,
          score: scoreValue,
          credibility: confidenceValue,
          scoreChange: '+0.0',
          credibilityChange: '+0.0',
          reason: selectedStep.reason || '暂无描述',
          tags: selectedStep.tags || []
        };
      }
    }
    
    // 回退到evaluationData
    if (evaluationData && selectedModel && evaluationData[selectedModel]) {
      return evaluationData[selectedModel];
    } else if (evaluationData && Object.values(evaluationData).length > 0) {
      return Object.values(evaluationData)[0];
    }
    
    // 如果没有任何数据，返回默认值
    return {
      name: '未知模型',
      score: 70, // 默认值70而不是'N/A'
      credibility: 75, // 默认值75而不是'N/A'
      scoreChange: '+0.0',
      credibilityChange: '+0.0',
      reason: '暂无数据',
      tags: []
    };
  }, [stepsData, selectedModel, evaluationData]);

  // 生成用于折线图的数据
  const lineChartData = useMemo(() => {
    if (!stepsData || stepsData.length === 0) {
      return enhancedChartData?.line || [];
    }
    
    // 收集所有版本信息
    const versionMap = {};
    
    stepsData.forEach(step => {
      if (!step.score || !Array.isArray(step.score)) return;
      
      step.score.forEach(scoreItem => {
        const version = scoreItem.version || '1.0';
        const modelKey = step.agent.toLowerCase().replace(/\s+/g, '');
        
        if (!versionMap[version]) {
          versionMap[version] = { version };
        }
        
        // 设置该版本下该模型的confidence值
        versionMap[version][modelKey] = parseFloat(scoreItem.confidence) * 100;
      });
    });
    
    // 转换为数组
    return Object.values(versionMap);
  }, [stepsData, enhancedChartData]);

  // 根据当前数据计算雷达图的最大值
  const calculatedRadarMaxValue = useMemo(() => {
    if (!enhancedChartData?.radar || enhancedChartData.radar.length === 0) {
      return 100; // 如果没有数据，则默认为100
    }
    
    let maxValue = 0;
    
    // 遍历所有雷达图数据点
    enhancedChartData.radar.forEach(dataPoint => {
      // 检查每个数据点的所有属性
      Object.keys(dataPoint).forEach(key => {
        // 排除name属性，只考虑数值属性
        if (key !== 'name' && typeof dataPoint[key] === 'number') {
          // 更新最大值
          if (dataPoint[key] > maxValue) {
            maxValue = dataPoint[key];
          }
        }
      });
    });
    
    // 向上取整到最接近的10的倍数，确保有一些边距
    return Math.ceil(maxValue / 10) * 10 + 10;
  }, [enhancedChartData]);

  if (!task || !enhancedChartData || !currentEvaluation) {
    return (
      <div style={{ textAlign: 'center', padding: '40px 0' }}>
        <Spin size="large" />
        <div style={{ marginTop: '16px' }}>加载评估结果...</div>
      </div>
    );
  }

  // 格式化得分显示，确保显示为字符串或数字
  const formatScore = (score) => {
    if (score === undefined || score === null) return 70; // 返回默认值70而不是'N/A'
    if (typeof score === 'object') return 70; // 如果是对象，返回默认值70而不是'N/A'
    
    // 尝试转换为数字并保留一位小数
    const numScore = parseFloat(score);
    if (!isNaN(numScore)) {
      return numScore.toFixed(1);
    }
    
    return 70; // 如果无法转换为数字，返回默认值70
  };

  return (
    <div className="evaluation-charts-wrapper" style={{ gap: "4px", marginTop: "4px" }}>
      {/* 左侧评估区域 */}
      <div className="evaluation-left-section" style={{ flex: "0 0 400px", gap: "4px" }}>
        <div className="evaluation-section" style={{ padding: "8px" }}>
          <div className="evaluation-header" style={{ marginBottom: "8px" }}>
            <div className="evaluation-title" style={{ display: "flex", alignItems: "center", gap: "8px" }}>
              <span style={{ fontSize: "14px", fontWeight: "500" }}>评估结果</span>
              {/* <Button 
                type="text" 
                icon={<PlusOutlined />} 
                style={{ fontSize: "12px" }}
                onClick={() => setAnnotationModalVisible(true)}
              >
                添加观点
              </Button> */}
              <Select
                mode="multiple"
                value={selectedModels || []}
                onChange={handleModelChange}
                className="model-selector"
                maxTagCount={2}
                maxTagTextLength={10}
                style={{ minWidth: "270px", flex: 1 }}
                dropdownRender={(menu) => (
                  <>
                    <div className="select-all-option" onClick={() => handleSelectAll(selectedModels?.length < modelOptions?.length)} style={{ padding: "4px 8px" }}>
                      <Checkbox checked={selectedModels?.length === modelOptions?.length}>
                        全选
                      </Checkbox>
                    </div>
                    {menu}
                  </>
                )}
              >
                {modelOptions.map(modelKey => {
                  // 尝试从stepsData获取模型名称
                  const step = stepsData.find(s => s.agent.toLowerCase().replace(/\s+/g, '') === modelKey);
                  const displayName = step ? step.agent : (evaluationData[modelKey]?.name || modelKey);
                  
                  return (
                    <Option key={modelKey} value={modelKey}>{displayName}</Option>
                  );
                })}
              </Select>
            </div>
          </div>

          <div className="evaluation-model-info" style={{ gap: "4px" }}>
            {Array.isArray(selectedModels) && selectedModels.map(modelKey => {
              // 尝试从stepsData获取模型信息
              const step = stepsData.find(s => s.agent.toLowerCase().replace(/\s+/g, '') === modelKey);
              
              // 如果找到step数据，使用它，否则回退到evaluationData
              const modelData = step ? {
                name: step.agent,
                tags: step.tags || [],
                reason: step.reason || '暂无描述'
              } : evaluationData[modelKey];
              
              if (!modelData) return null;
              
              return (
                <div className="model-panel" key={modelKey} style={{ marginBottom: "4px" }}>
                  <div className="model-panel-header" onClick={() => toggleModelPanel(modelKey)} style={{ padding: "8px" }}>
                    <div className="model-panel-left">
                      <Avatar size={32} className="model-avatar" style={{ background: getModelColor(modelKey) }}>
                          {modelData.name?.charAt(0) || '?'}
                      </Avatar>
                      <div className="model-info">
                        <div className="model-name" style={{ fontSize: "14px" }}>
                            {modelData.name || 'Unknown Model'}
                          <span className="model-usage" style={{ fontSize: "12px", marginLeft: "4px" }}>128k</span>
                        </div>
                        <div className="model-tags" style={{ gap: "4px" }}>
                            {Array.isArray(modelData.tags) && modelData.tags.map((tag, index) => (
                            <span key={index} className="model-tag" style={{ padding: "0 4px", fontSize: "11px" }}>
                              {tag}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                    <div className="model-panel-icon">
                      {expandedModel === modelKey ? <MinusOutlined /> : <PlusOutlined />}
                    </div>
                  </div>

                  {expandedModel === modelKey && (
                    <div className="model-panel-content" style={{ padding: "0 8px 8px" }}>
                      <div className="evaluation-content" style={{ padding: "8px" }}>
                          <p className="evaluation-text" style={{ fontSize: "12px", margin: 0, lineHeight: "1.4" }}>
                            {modelData.reason || '暂无描述'}
                          </p>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* 右侧图表区域 */}
      <div className="evaluation-right-section" style={{ gap: "4px" }}>
        {/* 折线图区域 */}
        <div className="line-chart-section" style={{ padding: "8px" }}>
          <div className="chart-legend" style={{ marginBottom: "8px", gap: "8px" }}>
            {Array.isArray(selectedModels) && selectedModels.map(modelKey => {
              // 尝试从stepsData获取模型名称
              const step = stepsData.find(s => s.agent.toLowerCase().replace(/\s+/g, '') === modelKey);
              const displayName = step ? step.agent : (evaluationData[modelKey]?.name || modelKey);
              
              return (
                <div className="legend-item" key={modelKey} style={{ gap: "4px" }}>
                  <span className="legend-color" style={{ backgroundColor: getModelColor(modelKey), width: "10px", height: "10px" }}></span>
                  <span className="legend-label" style={{ fontSize: "12px" }}>{displayName}</span>
                </div>
              );
            })}
          </div>

          <div className="line-chart-container" style={{ height: "150px", marginTop: "4px" }}>
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart
                data={lineChartData.length > 0 ? lineChartData : enhancedChartData?.line || []}
                margin={{ top: 2, right: 5, left: 0, bottom: 2 }}
              >
                {/* 渐变定义 */}
                <defs>
                  {modelOptions.map(modelKey => (
                    <linearGradient key={modelKey} id={`color${modelKey}`} x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor={getModelColor(modelKey)} stopOpacity={0.2} />
                      <stop offset="95%" stopColor={getModelColor(modelKey)} stopOpacity={0} />
                    </linearGradient>
                  ))}
                </defs>
                <CartesianGrid
                  vertical={false}
                  horizontal={true}
                  stroke="var(--color-border-secondary)"
                />
                <XAxis
                  dataKey={lineChartData.length > 0 ? "version" : "month"}
                  axisLine={false}
                  tickLine={false}
                  tick={{ fontSize: 10, fill: 'var(--color-text-tertiary)' }}
                />
                <YAxis
                  hide={true}
                  domain={[0, 'dataMax + 20']}
                  tickFormatter={(value) => `${Math.round(value)}%`}
                />
                <RechartsTooltip
                  cursor={false}
                  formatter={(value, name) => {
                    const step = stepsData.find(s => s.agent.toLowerCase().replace(/\s+/g, '') === name);
                    const displayName = step ? step.agent : (evaluationData[name]?.name || name);
                    return [`${Math.round(value)}%`, displayName];
                  }}
                  labelFormatter={(label) => `版本: ${label}`}
                  contentStyle={{
                    background: 'var(--color-bg-container)',
                    border: 'none',
                    boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
                    borderRadius: '4px',
                    padding: '4px 8px'
                  }}
                />
                {Array.isArray(selectedModels) && selectedModels.map(modelKey => (
                  <Area
                    key={modelKey}
                    type="monotone"
                    dataKey={modelKey}
                    name={modelKey}
                    stroke={getModelColor(modelKey)}
                    strokeWidth={1.5}
                    fill={`url(#color${modelKey})`}
                    dot={false}
                  />
                ))}
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* 评分和雷达图区域 */}
        <div className="score-radar-section" style={{ gap: "8px", padding: "8px" }}>
          <div className="metrics-section" style={{ gap: "8px", minWidth: "70px" }}>
            <div className="metric-item" style={{ padding: "8px" }}>
              <div className="metric-label" style={{ fontSize: "12px", marginBottom: "4px" }}>综合得分</div>
              <div className="metric-value" style={{ fontSize: "20px" }}>
                {typeof currentEvaluation?.credibility === 'number' ? 
                  `${Math.round(currentEvaluation?.credibility)}%` : `75%`}
              </div>
              <div className={`metric-change ${typeof currentEvaluation?.credibilityChange === 'string' && currentEvaluation?.credibilityChange?.startsWith("+") ? "positive" : "negative"}`} style={{ fontSize: "12px" }}>
                {typeof currentEvaluation?.credibilityChange === 'string' ? currentEvaluation?.credibilityChange : '0'}
              </div>
            </div>

            <div className="metric-item" style={{ padding: "8px" }}>
              <div className="metric-label" style={{ fontSize: "12px", marginBottom: "4px" }}>各维度得分</div>
              <div className="metric-value" style={{ fontSize: "20px" }}>{formatScore(currentEvaluation?.score)}</div>
              <div className={`metric-change ${typeof currentEvaluation?.scoreChange === 'string' && currentEvaluation?.scoreChange?.startsWith("+") ? "positive" : "negative"}`} style={{ fontSize: "12px" }}>
                {typeof currentEvaluation?.scoreChange === 'string' ? currentEvaluation?.scoreChange : '0'}
              </div>
            </div>
          </div>

          {/* 雷达图 - 使用计算出的最大值而不是传入的固定值 */}
          <div className="radar-chart-content" style={{ height: "220px" }}>
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart data={enhancedChartData?.radar || []}>
                <PolarGrid stroke="var(--color-border-secondary)" />
                <PolarAngleAxis dataKey="name" tick={{ fontSize: 10, fill: "var(--color-text-tertiary)" }} />
                <PolarRadiusAxis 
                  domain={[0, calculatedRadarMaxValue]} 
                  tick={{ fontSize: 9, fill: "var(--color-text-tertiary)" }} 
                  axisLine={false} 
                />
                <RechartsTooltip 
                  formatter={(value, name) => {
                    const step = stepsData.find(s => s.agent.toLowerCase().replace(/\s+/g, '') === name);
                    const displayName = step ? step.agent : (evaluationData[name]?.name || name);
                    return [`${Math.round(value)}%`, displayName];
                  }}
                  labelFormatter={(label) => `维度: ${label}`}
                  contentStyle={{
                    background: '#fff',
                    border: 'none',
                    boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
                    borderRadius: '4px',
                    padding: '4px 8px'
                  }}
                />
                {Array.isArray(selectedModels) && selectedModels.map(modelKey => (
                  <Radar
                    key={modelKey}
                    name={modelKey}
                    dataKey={modelKey}
                    stroke={getModelColor(modelKey)}
                    fill={getModelColor(modelKey)}
                    fillOpacity={0.2}
                  />
                ))}
              </RadarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* 添加观点对话框 */}
      <AnnotationModal
        visible={annotationModalVisible}
        onClose={() => setAnnotationModalVisible(false)}
        onSave={(data) => {
          try {
            // 创建注释数据对象
            const annotationData = {
              ...data,
              id: `annotation-${Date.now()}`, // 确保有唯一ID
              step: 'result' // 标记为结果节的注释
            };

            // 同时更新全局状态
            if (currentOptimizationStep === 0) {
              addComment(annotationData);
            }
            
            // 如果父组件提供了onAddAnnotation函数，调用它将注释添加到task中
            if (onAddAnnotation && typeof onAddAnnotation === 'function') {
              onAddAnnotation(annotationData);
            }
            
            // 关闭模态框
            setAnnotationModalVisible(false);
            message.success('添加观点成功');
          } catch (error) {
            console.error('添加观点失败:', error);
            message.error('添加观点失败');
          }
        }}
        selectedText={""}
        initialContent={""}
        step="result"
      />
    </div>
  );
};

export default ResultPage; 