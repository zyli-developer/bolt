import React from 'react';
import {
  Area,
  AreaChart,
  ResponsiveContainer,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as RechartsTooltip,
} from "recharts";
import useStyles from '../../styles/components/card/Charts';

/**
 * 折线图区域组件
 * @param {Object} props - 组件属性
 * @param {Array} props.selectedModels - 选中的模型
 * @param {Object} props.chartData - 图表数据
 * @param {Object} props.evaluationData - 评估数据
 * @param {Function} props.getModelColor - 获取模型颜色的函数
 * @returns {ReactElement} 折线图组件
 */
const LineChartSection = ({ 
  selectedModels, 
  chartData, 
  evaluationData, 
  getModelColor 
}) => {
  const styles = useStyles();
  
  if (!chartData || !chartData.line || !evaluationData) {
    return (
      <div className={styles.lineChartSection}>
        <div style={{ textAlign: 'center', padding: '20px' }}>
          暂无图表数据
        </div>
      </div>
    );
  }
  
  return (
    <div className={styles.lineChartSection}>
      <div className={styles.chartLegend}>
        {selectedModels.map(modelKey => (
          <div className={styles.legendItem} key={modelKey}>
            <span 
              className={styles.legendColor} 
              style={{ backgroundColor: getModelColor(modelKey) }} 
            />
            <span className={styles.legendLabel}>
              {evaluationData[modelKey]?.name || modelKey}
            </span>
          </div>
        ))}
      </div>
      
      <div className={styles.lineChartContainer}>
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart 
            data={chartData.line} 
            margin={{ top: 2, right: 5, left: 0, bottom: 2 }}
          >
            {/* 渐变定义 */}
            <defs>
              {selectedModels.map(modelKey => (
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
                name={evaluationData[modelKey]?.name || modelKey}
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
  );
};

export default LineChartSection;