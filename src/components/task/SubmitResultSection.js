import React, { useState } from 'react';
import { 
  Typography, 
  Avatar, 
  Tag, 
  Select,
  Checkbox,
  Spin
} from 'antd';
import {
  PlusOutlined,
  MinusOutlined
} from '@ant-design/icons';
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

const SubmitResultSection = ({ task }) => {
  // 复用与CardDetailPage类似的状态管理
  const [selectedModels, setSelectedModels] = useState(['claude3.5', 'claude3.6', 'claude3.7']);
  const [selectedChartModels, setSelectedChartModels] = useState({
    'claude3.5': true,
    'claude3.6': true,
    'claude3.7': true,
    agent2: false,
    deepseek: false,
  });
  const [expandedModel, setExpandedModel] = useState(false);
  const [selectedModel, setSelectedModel] = useState("claude");
  
  // 模拟评估数据
  const evaluationData = {
    claude3: {
      name: "Claude 3.5 Sonnet",
      tags: ["Programming", "Programming"],
      description: "该AI玩具在语音识别方面表现优秀，能够准确识别儿童的语音指令。安全性设计符合国际标准，无小零件脱落风险。交互体验该AI玩具在语音识别方面表现优秀，能够准确识别儿童的语音指令。安全性设计符合国...",
      score: "10.0",
      scoreChange: "-1.5%",
      credibility: "100.0%",
      credibilityChange: "+1.5%",
      updatedAt: "10 May",
      updatedBy: "Jackson", 
      history: "今天测试了最新版本，在儿童语音识别方面有显著提升..."
    },
    "claude3.5": {
      name: "Claude 3.5 Sonnet",
      tags: ["Programming", "Programming"],
      description: "该AI玩具在语音识别方面表现优秀，能够准确识别儿童的语音指令。安全性设计符合国际标准，无小零件脱落风险。交互体验该AI玩具在语音识别方面表现优秀，能够准确识别儿童的语音指令。安全性设计符合国...",
      score: "10.0",
      scoreChange: "-1.5%",
      credibility: "100.0%",
      credibilityChange: "+1.5%",
      updatedAt: "10 May",
      updatedBy: "Jackson", 
      history: "今天测试了最新版本，在儿童语音识别方面有显著提升..."
    },
    "claude3.6": {
      name: "Claude 3.6 Sonnet",
      tags: ["Programming", "Programming"],
      description: "该AI玩具在语音识别方面表现优秀，能够准确识别儿童的语音指令。安全性设计符合国际标准，无小零件脱落风险。交互体验该AI玩具在语音识别方面表现优秀，能够准确识别儿童的语音指令。安全性设计符合国...",
      score: "9.8",
      scoreChange: "+1.2%",
      credibility: "98.5%",
      credibilityChange: "+2.1%",
      updatedAt: "10 May",
      updatedBy: "Jackson", 
      history: "今天测试了最新版本，在儿童语音识别方面有显著提升..."
    },
    "claude3.7": {
      name: "Claude 3.7 Sonnet",
      tags: ["Programming", "Programming"],
      description: "该AI玩具在语音识别方面表现优秀，能够准确识别儿童的语音指令。安全性设计符合国际标准，无小零件脱落风险。交互体验该AI玩具在语音识别方面表现优秀，能够准确识别儿童的语音指令。安全性设计符合国...",
      score: "9.5",
      scoreChange: "+0.8%",
      credibility: "97.0%",
      credibilityChange: "+1.8%",
      updatedAt: "10 May",
      updatedBy: "Jackson", 
      history: "今天测试了最新版本，在儿童语音识别方面有显著提升..."
    }
  };

  // 模拟图表数据
  const chartData = {
    radar: [
      { name: "维度1", value: 90 },
      { name: "维度2", value: 85 },
      { name: "维度3", value: 95 },
      { name: "维度4", value: 88 },
      { name: "维度5", value: 92 },
    ],
    line: [
      { month: "10", value: 85 },
      { month: "10", value: 88 },
      { month: "10", value: 90 },
      { month: "10 May", value: 92 },
    ]
  };

  // 获取所有可用的模型选项
  const modelOptions = Object.keys(evaluationData);

  // 处理全选/取消全选
  const handleSelectAll = (checked) => {
    setSelectedModels(checked ? modelOptions : []);
    setSelectedChartModels(
      Object.fromEntries(
        modelOptions.map(model => [model, checked])
      )
    );
  };

  // 修改模型选择处理函数
  const handleModelChange = (values) => {
    setSelectedModels(values);
    setSelectedChartModels(
      Object.fromEntries(
        modelOptions.map(model => [model, values.includes(model)])
      )
    );
  };

  const toggleModelPanel = (modelKey) => {
    setExpandedModel(modelKey === expandedModel ? null : modelKey);
  };

  // 准备带有多模型数据的增强图表数据
  const getEnhancedChartData = () => {
    // 增强的雷达图数据，包含多模型值
    const enhancedRadar = chartData.radar.map((item, index) => ({
      name: item.name,
      value: item.value,
      'claude3.5': Math.min(100, item.value * (1 + Math.sin(index) * 0.2)),
      'claude3.6': Math.min(100, item.value * (1 + Math.cos(index) * 0.15)),
      'claude3.7': Math.min(100, item.value * (1 + Math.sin(index + 0.5) * 0.1)),
      agent2: Math.min(100, item.value * (1 - Math.cos(index) * 0.15)),
      deepseek: Math.min(100, item.value * (1 + Math.sin(index + 1) * 0.2)),
    }));

    // 增强的折线图数据，包含多模型值
    const enhancedLine = chartData.line.map((item, index) => ({
      month: item.month,
      value: item.value,
      'claude3.5': Math.min(100, item.value * (1 + Math.sin(index) * 0.1)),
      'claude3.6': Math.min(100, item.value * (1 + Math.cos(index) * 0.12)),
      'claude3.7': Math.min(100, item.value * (1 + Math.sin(index + 0.5) * 0.08)),
      agent2: Math.min(100, item.value * (1 - Math.cos(index) * 0.1)),
      deepseek: Math.min(100, item.value * (1 + Math.sin(index + 1) * 0.12)),
    }));

    return { radar: enhancedRadar, line: enhancedLine };
  };

  const enhancedChartData = getEnhancedChartData();

  const getModelColor = (modelKey) => {
    // 根据模型确定颜色
    switch (modelKey) {
      case 'claude3.5':
        return '#3ac0a0';
      case 'claude3.6':
        return '#006ffd';
      case 'claude3.7':
        return '#722ed1';
      case 'agent2':
        return '#FFB140';
      case 'deepseek':
        return '#722ed1';
      default:
        return '#8f9098';
    }
  };

  const currentEvaluation = evaluationData[selectedModel] || evaluationData.claude3;

  return (
    <div className="evaluation-charts-wrapper" style={{ display: 'flex', flexDirection: 'column', width: '100%', gap: '12px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
        <h2 style={{ fontSize: '16px', margin: 0 }}>提交结果</h2>
      </div>
      
      <div style={{ display: 'flex', gap: '12px' }}>
        {/* 左侧评估区域 */}
        <div className="evaluation-left-section" style={{ flex: "0 0 400px", gap: "4px" }}>
          <div className="evaluation-section" style={{ padding: "8px", marginBottom: "4px" }}>
            <div className="evaluation-header" style={{ marginBottom: "8px" }}>
              <div className="evaluation-title" style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                <span style={{ fontSize: "14px", fontWeight: "500" }}>评估结果</span>
                <Select
                  mode="multiple"
                  value={selectedModels}
                  onChange={handleModelChange}
                  className="model-selector"
                  maxTagCount={2}
                  maxTagTextLength={10}
                  style={{ minWidth: "270px", flex: 1 }}
                  dropdownRender={(menu) => (
                    <>
                      <div className="select-all-option" onClick={() => handleSelectAll(selectedModels.length < modelOptions.length)} style={{ padding: "4px 8px" }}>
                        <Checkbox checked={selectedModels.length === modelOptions.length}>
                          全选
                        </Checkbox>
                      </div>
                      {menu}
                    </>
                  )}
                >
                  <Option value="claude3.5">Claude 3.5</Option>
                  <Option value="claude3.6">Claude 3.6</Option>
                  <Option value="claude3.7">Claude 3.7</Option>
                  <Option value="agent2">Agent 2</Option>
                  <Option value="deepseek">DeepSeek</Option>
                </Select>
              </div>
            </div>

            <div className="evaluation-model-info" style={{ gap: "4px" }}>
              {selectedModels.map(modelKey => (
                <div className="model-panel" key={modelKey} style={{ marginBottom: "4px" }}>
                  <div className="model-panel-header" onClick={() => toggleModelPanel(modelKey)} style={{ padding: "8px" }}>
                    <div className="model-panel-left">
                      <Avatar size={32} className="model-avatar" style={{ background: getModelColor(modelKey) }}>
                        {evaluationData[modelKey]?.name.charAt(0)}
                      </Avatar>
                      <div className="model-info">
                        <div className="model-name" style={{ fontSize: "14px" }}>
                          {evaluationData[modelKey]?.name}
                          <span className="model-usage" style={{ fontSize: "12px", marginLeft: "4px" }}>128k</span>
                        </div>
                        <div className="model-tags" style={{ gap: "4px" }}>
                          {evaluationData[modelKey]?.tags.map((tag, index) => (
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
                        <p className="evaluation-text" style={{ fontSize: "12px", margin: 0, lineHeight: "1.4" }}>{evaluationData[modelKey]?.description}</p>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* 右侧图表区域 */}
        <div className="evaluation-right-section" style={{ gap: "4px", flex: 1 }}>
          {/* 折线图区域 */}
          <div className="line-chart-section" style={{ padding: "8px" }}>
            <div className="chart-legend" style={{ marginBottom: "8px", gap: "8px" }}>
              {selectedModels.map(modelKey => (
                <div className="legend-item" key={modelKey} style={{ gap: "4px" }}>
                  <span className="legend-color" style={{ backgroundColor: getModelColor(modelKey), width: "10px", height: "10px" }}></span>
                  <span className="legend-label" style={{ fontSize: "12px" }}>{evaluationData[modelKey]?.name}</span>
                </div>
              ))}
            </div>

            <div className="line-chart-container" style={{ height: "150px", marginTop: "4px" }}>
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart 
                  data={enhancedChartData.line} 
                  margin={{ top: 2, right: 5, left: 0, bottom: 2 }}
                >
                  {/* 渐变定义 */}
                  <defs>
                    {Object.keys(evaluationData).map(modelKey => (
                      <linearGradient key={modelKey} id={`color${modelKey}`} x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor={getModelColor(modelKey)} stopOpacity={0.2}/>
                        <stop offset="95%" stopColor={getModelColor(modelKey)} stopOpacity={0}/>
                      </linearGradient>
                    ))}
                  </defs>
                  <CartesianGrid 
                    vertical={false} 
                    horizontal={true}
                    stroke="#f0f0f0"
                  />
                  <XAxis 
                    dataKey="month" 
                    axisLine={false}
                    tickLine={false}
                    tick={{ fontSize: 10, fill: '#8f9098' }}
                  />
                  <YAxis 
                    hide={true}
                    domain={[0, 'dataMax + 20']}
                  />
                  <RechartsTooltip 
                    cursor={false}
                    contentStyle={{
                      background: '#fff',
                      border: 'none',
                      boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
                      borderRadius: '4px',
                      padding: '4px 8px'
                    }}
                  />
                  {selectedModels.map(modelKey => (
                    <Area
                      key={modelKey}
                      type="monotone"
                      dataKey={modelKey}
                      name={evaluationData[modelKey]?.name}
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
                <div className="metric-value" style={{ fontSize: "20px" }}>{currentEvaluation.score}</div>
                <div className={`metric-change ${currentEvaluation.scoreChange.startsWith("+") ? "positive" : "negative"}`} style={{ fontSize: "12px" }}>
                  {currentEvaluation.scoreChange}
                </div>
              </div>

              <div className="metric-item" style={{ padding: "8px" }}>
                <div className="metric-label" style={{ fontSize: "12px", marginBottom: "4px" }}>各维度得分</div>
                <div className="metric-value" style={{ fontSize: "20px" }}>{currentEvaluation.credibility}</div>
                <div className={`metric-change ${currentEvaluation.credibilityChange.startsWith("+") ? "positive" : "negative"}`} style={{ fontSize: "12px" }}>
                  {currentEvaluation.credibilityChange}
                </div>
              </div>
            </div>

            {/* 雷达图 */}
            <div className="radar-chart-content" style={{ height: "220px" }}>
              <ResponsiveContainer width="100%" height="100%">
                <RadarChart data={enhancedChartData.radar}>
                  <PolarGrid stroke="#e0e0e0" />
                  <PolarAngleAxis dataKey="name" tick={{ fontSize: 10, fill: "#8f9098" }} />
                  <PolarRadiusAxis domain={[0, 100]} tick={{ fontSize: 9, fill: "#8f9098" }} axisLine={false} />
                  {selectedModels.map(modelKey => (
                    <Radar 
                      key={modelKey}
                      name={evaluationData[modelKey]?.name} 
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

          {/* 历史记录区域 */}
          <div className="history-section-wrapper" style={{ padding: "8px" }}>
            <div className="history-section" style={{ gap: "4px" }}>
              <div className="history-time" style={{ fontSize: "12px" }}>{currentEvaluation.updatedAt}</div>
              <div className="history-author" style={{ fontSize: "12px" }}>
                by <span>{currentEvaluation.updatedBy}</span>
              </div>
              <div className="history-content" style={{ fontSize: "12px", lineHeight: "1.4", marginTop: "4px" }}>{currentEvaluation.history}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SubmitResultSection; 