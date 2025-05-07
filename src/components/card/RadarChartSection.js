import React from 'react';
import {
  ResponsiveContainer,
  Radar,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
} from "recharts";
import useStyles from '../../styles/components/card/Charts';

/**
 * 雷达图区域组件
 * @param {Object} props - 组件属性
 * @param {Array} props.selectedModels - 选中的模型
 * @param {Object} props.chartData - 图表数据
 * @param {Object} props.evaluationData - 评估数据
 * @param {Function} props.getModelColor - 获取模型颜色的函数
 * @returns {ReactElement} 雷达图组件
 */
const RadarChartSection = ({
  selectedModels,
  chartData,
  evaluationData,
  getModelColor,
  currentEvaluation,
}) => {
  const styles = useStyles();

  if (!chartData || !chartData.radar) {
    return (
      <div className={styles.scoreRadarSection}>
        <div style={{ textAlign: 'center', padding: '20px', width: '100%' }}>
          暂无图表数据
        </div>
      </div>
    );
  }

  return (
    <div className={styles.scoreRadarSection}>
      <div className={styles.metricsSection}>
        <div className={styles.metricItem}>
          <div className={styles.metricLabel}>综合得分</div>
          <div className={styles.metricValue}>{currentEvaluation?.score || 'N/A'}</div>
          {currentEvaluation?.scoreChange && (
            <div className={`${styles.metricChange} ${currentEvaluation.scoreChange.startsWith("+") ? styles.positive : styles.negative}`}>
              {currentEvaluation.scoreChange}
            </div>
          )}
        </div>

        <div className={styles.metricItem}>
          <div className={styles.metricLabel}>各维度得分</div>
          <div className={styles.metricValue}>{currentEvaluation?.credibility || 'N/A'}%</div>
          {currentEvaluation?.credibilityChange && (
            <div className={`${styles.metricChange} ${currentEvaluation.credibilityChange.startsWith("+") ? styles.positive : styles.negative}`}>
              {currentEvaluation.credibilityChange}
            </div>
          )}
        </div>
      </div>

      <div className={styles.radarChartContent}>
        <ResponsiveContainer width="100%" height="100%">
          <RadarChart data={chartData.radar}>
            <PolarGrid stroke="#e0e0e0" />
            <PolarAngleAxis dataKey="name" tick={{ fontSize: 10, fill: "#8f9098" }} />
            <PolarRadiusAxis domain={[0, 100]} tick={{ fontSize: 9, fill: "#8f9098" }} axisLine={false} />
            {selectedModels.map(modelKey => (
              <Radar
                key={modelKey}
                name={evaluationData[modelKey]?.name || modelKey}
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
  );
};

export default RadarChartSection;