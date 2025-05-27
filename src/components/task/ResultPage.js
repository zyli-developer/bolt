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
import CommentsList from '../common/CommentsList';
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
  onAddAnnotation,
  isOptimizeMode = false,
  comments = []
}) => {
  const [annotationModalVisible, setAnnotationModalVisible] = useState(false);
  const [selectedText, setSelectedText] = useState('');
  const [expandedComment, setExpandedComment] = useState(null);
  
  const handleSaveAnnotation = async (data) => {
    try {
      const annotationData = {
        ...data,
        selectedText: data.selectedText || selectedText,
        id: `annotation-${Date.now()}`,
        step: 'result',
        time: new Date().toISOString()
      };
      
      if (onAddAnnotation && typeof onAddAnnotation === 'function') {
        if (!task.annotation) {
          task.annotation = { result: [] };
        } else if (!task.annotation.result) {
          task.annotation.result = [];
        }
        
        onAddAnnotation(annotationData);
      }
      
      if (currentOptimizationStep === 0 || currentOptimizationStep === 'result') {
        addComment(annotationData);
      }
      
      setAnnotationModalVisible(false);
      setSelectedText('');
      
      message.success('添加观点成功');
    } catch (error) {
      console.error('添加观点失败:', error);
      message.error('添加观点失败');
    }
  };
  
  const { 
    isOptimizationMode,
    currentOptimizationStep, 
    currentStepComments,
    addComment,
    setStepComments
  } = useContext(OptimizationContext);
  
  const handleCommentToggle = (id) => {
    setExpandedComment(expandedComment === id ? null : id);
  };

  const stepsData = useMemo(() => {
    if (!task || !task.step) {
      return [];
    }
    
    const steps = Array.isArray(task.step) ? task.step : [task.step];
    
    return steps.filter(step => step && step.agent);
  }, [task]);

  const modelOptions = useMemo(() => {
    if (stepsData && stepsData.length > 0) {
      return stepsData.map(step => {
        return step.agent.toLowerCase().replace(/\s+/g, '');
      });
    }
    return Object.keys(evaluationData || {});
  }, [stepsData, evaluationData]);

  const currentEvaluation = useMemo(() => {
    if (stepsData && stepsData.length > 0 && selectedModel) {
      const selectedStep = stepsData.find(step => 
        step.agent.toLowerCase().replace(/\s+/g, '') === selectedModel
      );
      
      if (selectedStep) {
        let scoreValue = 70;
        if (selectedStep.score) {
          if (Array.isArray(selectedStep.score) && selectedStep.score.length > 0) {
            const scoreObj = selectedStep.score[0];
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
        
        let confidenceValue = 75;
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
    
    if (evaluationData && selectedModel && evaluationData[selectedModel]) {
      return evaluationData[selectedModel];
    } else if (evaluationData && Object.values(evaluationData).length > 0) {
      return Object.values(evaluationData)[0];
    }
    
    return {
      name: '未知模型',
      score: 70,
      credibility: 75,
      scoreChange: '+0.0',
      credibilityChange: '+0.0',
      reason: '暂无数据',
      tags: []
    };
  }, [stepsData, selectedModel, evaluationData]);

  const lineChartData = useMemo(() => {
    if (!stepsData || stepsData.length === 0) {
      return enhancedChartData?.line || [];
    }
    
    const versionMap = {};
    
    stepsData.forEach(step => {
      if (!step.score || !Array.isArray(step.score)) return;
      
      step.score.forEach(scoreItem => {
        const version = scoreItem.version || '1.0';
        const modelKey = step.agent.toLowerCase().replace(/\s+/g, '');
        
        if (!versionMap[version]) {
          versionMap[version] = { version };
        }
        
        versionMap[version][modelKey] = parseFloat(scoreItem.confidence) * 100;
      });
    });
    
    return Object.values(versionMap);
  }, [stepsData, enhancedChartData]);

  const calculatedRadarMaxValue = useMemo(() => {
    if (!enhancedChartData?.radar || enhancedChartData.radar.length === 0) {
      return 100;
    }
    
    let maxValue = 0;
    
    enhancedChartData.radar.forEach(dataPoint => {
      Object.keys(dataPoint).forEach(key => {
        if (key !== 'name' && typeof dataPoint[key] === 'number') {
          if (dataPoint[key] > maxValue) {
            maxValue = dataPoint[key];
          }
        }
      });
    });
    
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

  const formatScore = (score) => {
    if (score === undefined || score === null) return 70;
    if (typeof score === 'object') return 70;
    
    const numScore = parseFloat(score);
    if (!isNaN(numScore)) {
      return numScore.toFixed(1);
    }
    
    return 70;
  };

  return (
    <div className="evaluation-charts-wrapper" style={{ display: "flex", gap: "8px" }}>
      {/* 左侧评估区域 */}
      <div className="evaluation-left-section" style={{ 
        flex: isOptimizeMode && task?.annotation?.result && Array.isArray(task.annotation.result) && task.annotation.result.length > 0 ? 1 : 1.5
      }}>
        <div className="evaluation-section" style={{ padding: "8px" }}>
          <div className="evaluation-header" style={{ marginBottom: "8px" }}>
            <div className="evaluation-title" style={{ display: "flex", alignItems: "center", gap: "8px" }}>
              <span style={{ 
                fontSize: "16px", 
                fontWeight: "600", 
                color: "var(--color-text-base)",
                whiteSpace: "nowrap",
                flex: "0 0 auto",
                padding: "4px 12px 4px 0",
                borderRight: "1px solid var(--color-border-secondary)"
              }}>评估结果</span>
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
              const step = stepsData.find(s => s.agent.toLowerCase().replace(/\s+/g, '') === modelKey);
              
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
      <div className="evaluation-right-section" style={{ 
        gap: "4px", 
        flex: isOptimizeMode && task?.annotation?.result && Array.isArray(task.annotation.result) && task.annotation.result.length > 0 ? 1 : 1.5
      }}>
        <div className="line-chart-section" style={{ padding: "8px" }}>
          <div className="chart-legend" style={{ marginBottom: "8px", gap: "8px" }}>
            {Array.isArray(selectedModels) && selectedModels.map(modelKey => {
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

      {/* 右侧注释列表 - 仅在优化模式下显示且有注释数据时显示 */}
      {isOptimizeMode && comments && comments.length > 0 && (
        <div className="comments-section" style={{ 
          flex: 1, 
          backgroundColor: 'var(--color-bg-container)',
          borderRadius: '8px',
          maxHeight: 'calc(100vh - 320px)',
          overflow: 'hidden'
        }}>
            <CommentsList 
            comments={comments} 
              title="注释列表"
              expandedId={expandedComment}
              onToggleExpand={handleCommentToggle}
              customStyles={{
                container: { height: '100%' }
              }}
            />
            </div>
          )}

      {/* 非优化模式下显示传递的评论 */}
      {!isOptimizeMode && comments && comments.length > 0 && (
        <div className="comments-section" style={{ 
          flex: 1, 
          backgroundColor: 'var(--color-bg-container)',
          borderRadius: '8px',
          maxHeight: 'calc(100vh - 320px)',
          overflow: 'auto'
        }}>
          <CommentsList 
            comments={comments} 
            title="注释列表"
            expandedId={expandedComment}
            onToggleExpand={handleCommentToggle}
            customStyles={{
              container: { height: '100%' }
            }}
          />
        </div>
      )}

      <AnnotationModal
        visible={annotationModalVisible}
        onClose={() => setAnnotationModalVisible(false)}
        onSave={handleSaveAnnotation}
        selectedText={selectedText}
        initialContent={selectedText}
        step="result"
      />
    </div>
  );
};

export default ResultPage; 