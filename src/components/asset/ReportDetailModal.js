import { useState, useEffect } from 'react';
import { Modal, Spin, Typography, Avatar, Select, Checkbox, Space } from 'antd';
import {
  PlusOutlined,
  MinusOutlined,
} from '@ant-design/icons';
import {
  LineChart,
  Line,
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
  Area,
  AreaChart,
} from 'recharts';
import taskService from '../../services/taskService';

const { Title, Text } = Typography;
const { Option } = Select;

/**
 * 报告详情模态框组件
 * @param {boolean} visible - 是否显示模态框
 * @param {function} onClose - 关闭模态框的回调函数
 * @param {object} report - 报告数据
 */
const ReportDetailModal = ({ visible, onClose, report }) => {
  const [loading, setLoading] = useState(true);
  const [evaluationData, setEvaluationData] = useState({});
  const [selectedModels, setSelectedModels] = useState(['claude3.5', 'claude3.6', 'claude3.7']);
  const [expandedModel, setExpandedModel] = useState(false);
  const [enhancedChartData, setEnhancedChartData] = useState({ radar: [], line: [] });

  // 加载评估数据
  useEffect(() => {
    const loadEvaluationData = async () => {
      try {
        setLoading(true);
        
        // 获取评估数据
        const data = await taskService.getAllModelEvaluations();
        
        // 如果没有评估数据，提供默认数据
        if (!data || Object.keys(data).length === 0) {
          const defaultEvaluationData = {
            'claude3.5': {
              name: 'Claude 3.5',
              score: '92',
              scoreChange: '+2.5',
              credibility: '88',
              credibilityChange: '+3.2',
              tags: ['大语言模型', '文本生成'],
              description: 'Claude 3.5 是一个功能强大的大语言模型，擅长文本生成、问答和内容创作。',
              updatedAt: '2023-11-25 09:30',
              updatedBy: 'Alex Chen',
              history: '上次评估后，模型在流畅性和创新性方面有显著提升，但安全性略有下降。'
            },
            'claude3.6': {
              name: 'Claude 3.6',
              score: '95',
              scoreChange: '+4.2',
              credibility: '91',
              credibilityChange: '+5.5',
              tags: ['增强型AI', '多模态'],
              description: 'Claude 3.6 是新一代增强型AI，支持多模态输入和更强的推理能力。',
              updatedAt: '2023-12-10 14:20',
              updatedBy: 'Sarah Wang',
              history: '本次迭代中，模型在所有维度都有全面提升，特别是在准确性和可靠性方面。'
            },
            'claude3.7': {
              name: 'Claude 3.7',
              score: '97',
              scoreChange: '+1.8',
              credibility: '93',
              credibilityChange: '+2.1',
              tags: ['AGI', '专家系统'],
              description: 'Claude 3.7 是最新研发的接近AGI的模型，拥有专家级知识和超强推理能力。',
              updatedAt: '2024-01-05 16:45',
              updatedBy: 'Mike Johnson',
              history: '作为最新模型，3.7在创新性和安全性方面取得了突破，但资源消耗较大。'
            }
          };
          setEvaluationData(defaultEvaluationData);
        } else {
          setEvaluationData(data);
        }

        // 初始化增强图表数据
        if (report && report.chartData) {
          setEnhancedChartData(getEnhancedChartData(report.chartData));
        } else {
          // 使用默认图表数据
          setEnhancedChartData(getEnhancedChartData());
        }
      } catch (error) {
        console.error('加载评估数据失败:', error);
      } finally {
        setLoading(false);
      }
    };

    if (visible) {
      loadEvaluationData();
    }
  }, [visible, report]);

  // 准备增强图表数据
  const getEnhancedChartData = (chartData) => {
    if (!chartData) {
      // 如果没有图表数据，提供默认数据
      const defaultChartData = {
        radar: [
          { name: "准确性", value: 85 },
          { name: "流畅性", value: 90 },
          { name: "创新性", value: 70 },
          { name: "可靠性", value: 80 },
          { name: "安全性", value: 95 }
        ],
        line: [
          { month: "1月", value: 65 },
          { month: "2月", value: 70 },
          { month: "3月", value: 75 },
          { month: "4月", value: 80 },
          { month: "5月", value: 85 },
          { month: "6月", value: 90 }
        ]
      };
      chartData = defaultChartData;
    }

    // 增强雷达图数据
    const enhancedRadar = (chartData.radar || []).map((item, index) => ({
      name: item.name,
      value: item.value,
      'claude3.5': Math.min(100, item.value * (1 + Math.sin(index) * 0.2)),
      'claude3.6': Math.min(100, item.value * (1 + Math.cos(index) * 0.15)),
      'claude3.7': Math.min(100, item.value * (1 + Math.sin(index + 0.5) * 0.1)),
      agent2: Math.min(100, item.value * (1 - Math.cos(index) * 0.15)),
      deepseek: Math.min(100, item.value * (1 + Math.sin(index + 1) * 0.2)),
    }));

    // 增强折线图数据
    const enhancedLine = (chartData.line || []).map((item, index) => ({
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

  // 处理全选/取消全选
  const handleSelectAll = (checked) => {
    const modelOptions = Object.keys(evaluationData || {});
    setSelectedModels(checked ? modelOptions : []);
  };

  // 修改模型选择处理函数
  const handleModelChange = (values) => {
    setSelectedModels(values);
  };

  // 切换模型面板展开/折叠
  const toggleModelPanel = (modelKey) => {
    setExpandedModel(expandedModel === modelKey ? false : modelKey);
  };

  // 获取模型颜色
  const getModelColor = (modelKey) => {
    switch (modelKey) {
      case 'claude3.5':
        return 'var(--color-success)';
      case 'claude3.6':
        return 'var(--color-primary)';
      case 'claude3.7':
        return 'var(--color-heavy)';
      case 'agent2': 
        return 'var(--color-assist-1)';
      case 'deepseek':
        return 'var(--color-heavy)';
      default:
        return 'var(--color-text-tertiary)';
    }
  };

  // 渲染结果页面内容
  const renderResultContent = () => {
    const modelOptions = Object.keys(evaluationData || {});
    const currentEvaluation = selectedModels.length > 0 ? 
      evaluationData?.[selectedModels[0]] : 
      evaluationData?.claude3;

    if (loading) {
      return (
        <div style={{ textAlign: 'center', padding: '40px 0' }}>
          <Spin size="large" />
          <div style={{ marginTop: '16px' }}>加载评估结果...</div>
        </div>
      );
    }

    return (
      <div className="evaluation-charts-wrapper" style={{ gap: "4px", marginTop: "4px" }}>
        {/* 左侧评估区域 */}
        <div className="evaluation-left-section" style={{ flex: "0 0 400px", gap: "4px" }}>
          <div className="evaluation-section" style={{ padding: "8px" }}>
            <div className="evaluation-header" style={{ marginBottom: "8px" }}>
              <div className="evaluation-title" style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                <span style={{ fontSize: "14px", fontWeight: "500" }}>评估结果</span>
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
                  <Option value="claude3.5">Claude 3.5</Option>
                  <Option value="claude3.6">Claude 3.6</Option>
                  <Option value="claude3.7">Claude 3.7</Option>
                  <Option value="agent2">Agent 2</Option>
                  <Option value="deepseek">DeepSeek</Option>
                </Select>
              </div>
            </div>

            <div className="evaluation-model-info" style={{ gap: "4px", maxHeight: "300px", overflow: "auto" }}>
              {Array.isArray(selectedModels) && selectedModels.map(modelKey => {
                if (!evaluationData || !evaluationData[modelKey]) return null;
                return (
                <div className="model-panel" key={modelKey} style={{ marginBottom: "4px" }}>
                  <div className="model-panel-header" onClick={() => toggleModelPanel(modelKey)} style={{ padding: "8px" }}>
                    <div className="model-panel-left">
                      <Avatar size={32} className="model-avatar" style={{ background: getModelColor(modelKey) }}>
                          {evaluationData[modelKey]?.name?.charAt(0) || '?'}
                      </Avatar>
                      <div className="model-info">
                        <div className="model-name" style={{ fontSize: "14px" }}>
                            {evaluationData[modelKey]?.name || 'Unknown Model'}
                          <span className="model-usage" style={{ fontSize: "12px", marginLeft: "4px" }}>128k</span>
                        </div>
                        <div className="model-tags" style={{ gap: "4px" }}>
                            {Array.isArray(evaluationData[modelKey]?.tags) && evaluationData[modelKey]?.tags.map((tag, index) => (
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
                          <p className="evaluation-text" style={{ fontSize: "12px", margin: 0, lineHeight: "1.4" }}>{evaluationData[modelKey]?.description || '暂无描述'}</p>
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
              {Array.isArray(selectedModels) && selectedModels.map(modelKey => (
                <div className="legend-item" key={modelKey} style={{ gap: "4px" }}>
                  <span className="legend-color" style={{ backgroundColor: getModelColor(modelKey), width: "10px", height: "10px" }}></span>
                  <span className="legend-label" style={{ fontSize: "12px" }}>{evaluationData?.[modelKey]?.name || modelKey}</span>
                </div>
              ))}
            </div>

            <div className="line-chart-container" style={{ height: "150px", marginTop: "4px" }}>
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart
                  data={enhancedChartData?.line || []}
                  margin={{ top: 2, right: 5, left: 0, bottom: 2 }}
                >
                  {/* 渐变定义 */}
                  <defs>
                    {Object.keys(evaluationData || {}).map(modelKey => (
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
                    dataKey="month"
                    axisLine={false}
                    tickLine={false}
                    tick={{ fontSize: 10, fill: 'var(--color-text-tertiary)' }}
                  />
                  <YAxis
                    hide={true}
                    domain={[0, 'dataMax + 20']}
                  />
                  <RechartsTooltip
                    cursor={false}
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
                      name={evaluationData?.[modelKey]?.name || modelKey}
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
                <div className="metric-value" style={{ fontSize: "20px" }}>{currentEvaluation?.score || 'N/A'}</div>
                <div className={`metric-change ${currentEvaluation?.scoreChange?.startsWith("+") ? "positive" : "negative"}`} style={{ fontSize: "12px" }}>
                  {currentEvaluation?.scoreChange || '0'}
                </div>
              </div>

              <div className="metric-item" style={{ padding: "8px" }}>
                <div className="metric-label" style={{ fontSize: "12px", marginBottom: "4px" }}>各维度得分</div>
                <div className="metric-value" style={{ fontSize: "20px" }}>{currentEvaluation?.credibility || 'N/A'}%</div>
                <div className={`metric-change ${currentEvaluation?.credibilityChange?.startsWith("+") ? "positive" : "negative"}`} style={{ fontSize: "12px" }}>
                  {currentEvaluation?.credibilityChange || '0'}
                </div>
              </div>
            </div>

            {/* 雷达图 */}
            <div className="radar-chart-content" style={{ height: "220px" }}>
              <ResponsiveContainer width="100%" height="100%">
                <RadarChart data={enhancedChartData?.radar || []}>
                  <PolarGrid stroke="var(--color-border-secondary)" />
                  <PolarAngleAxis dataKey="name" tick={{ fontSize: 10, fill: "var(--color-text-tertiary)" }} />
                  <PolarRadiusAxis domain={[0, 100]} tick={{ fontSize: 9, fill: "var(--color-text-tertiary)" }} axisLine={false} />
                  {Array.isArray(selectedModels) && selectedModels.map(modelKey => (
                    <Radar
                      key={modelKey}
                      name={evaluationData?.[modelKey]?.name || modelKey}
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
              <div className="history-time" style={{ fontSize: "12px" }}>{currentEvaluation?.updatedAt || '未知时间'}</div>
              <div className="history-author" style={{ fontSize: "12px" }}>
                by <span>{currentEvaluation?.updatedBy || '未知用户'}</span>
              </div>
              <div className="history-content" style={{ fontSize: "12px", lineHeight: "1.4", marginTop: "4px" }}>{currentEvaluation?.history || '暂无历史记录'}</div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <Modal
      title={<Title level={4}>报告详情: {report?.name || '未命名报告'}</Title>}
      open={visible}
      onCancel={onClose}
      footer={null}
      width={900}
      centered
      destroyOnClose
    >
      {renderResultContent()}
      
      <style jsx global>{`
        .evaluation-charts-wrapper {
          display: flex;
          flex-wrap: wrap;
          gap: 8px;
        }
        .evaluation-left-section, .evaluation-right-section {
          padding: 8px;
          background: #fff;
          border-radius: 8px;
          box-shadow: 0 1px 2px rgba(0,0,0,0.03);
        }
        .evaluation-left-section {
          flex: 0 0 380px;
        }
        .evaluation-right-section {
          flex: 1;
          min-width: 300px;
          display: flex;
          flex-direction: column;
          gap: 8px;
        }
        .model-panel-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          cursor: pointer;
          padding: 8px;
          border-radius: 4px;
          transition: background-color 0.3s;
        }
        .model-panel-header:hover {
          background-color: var(--color-primary-bg);
        }
        .model-panel-left {
          display: flex;
          align-items: center;
          gap: 8px;
        }
        .model-info {
          flex: 1;
        }
        .model-tags {
          display: flex;
          flex-wrap: wrap;
          gap: 4px;
        }
        .model-tag {
          background: #f0f0f0;
          border-radius: 10px;
          padding: 0 6px;
        }
        .chart-legend {
          display: flex;
          flex-wrap: wrap;
        }
        .legend-item {
          display: flex;
          align-items: center;
          margin-right: 12px;
        }
        .legend-color {
          border-radius: 50%;
          margin-right: 4px;
        }
        .metrics-section {
          display: flex;
          flex-wrap: wrap;
        }
        .metric-item {
          background: #f9f9f9;
          border-radius: 4px;
          flex: 1;
          min-width: 120px;
        }
        .positive {
          color: var(--color-success);
        }
        .negative {
          color: var(--color-error);
        }
        .score-radar-section {
          display: flex;
          flex-wrap: wrap;
        }
        
        @media (max-width: 768px) {
          .evaluation-charts-wrapper {
            flex-direction: column;
          }
          .evaluation-left-section {
            flex: 0 0 auto;
            width: 100%;
          }
          .score-radar-section {
            flex-direction: column;
          }
        }
      `}</style>
    </Modal>
  );
};

export default ReportDetailModal; 