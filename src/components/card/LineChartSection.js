import React, { useMemo } from 'react';
import {
  LineChart,
  Line,
  ResponsiveContainer,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as RechartsTooltip,
} from "recharts";
import useStyles from '../../styles/components/card/Charts';
import colorToken from '../../styles/utils/colorToken';

// 语义化版本排序函数
const versionSort = (a, b) => {
  const parseVersion = v => v.split('.').map(Number);
  const verA = parseVersion(a);
  const verB = parseVersion(b);
  for (let i = 0; i < Math.max(verA.length, verB.length); i++) {
    const numA = verA[i] || 0;
    const numB = verB[i] || 0;
    if (numA !== numB) return numA - numB;
  }
  return 0;
};

// 使用 colorToken 主题色和辅助色
const colors = [
  colorToken.colorPrimary,
  colorToken.colorAssist1,
  colorToken.colorAssist2,
  colorToken.colorAssist3,
  colorToken.colorError,
  colorToken.colorSuccess,
];

/**
 * 折线图区域组件
 * @param {Object} props - 组件属性
 * @param {Object} props.card - 卡片数据
 * @param {boolean} [props.showLinearGradient] - 是否显示头部linearGradient（默认false）
 * @returns {ReactElement} 折线图组件
 */
const LineChartSection = ({ card, showLinearGradient = false }) => {
  const styles = useStyles();
  console.log("------LineChartSection---------",card)
  // 1. 转换数据为平面数组
  const chartData = useMemo(() => {
    if (!card || !card.step) return [];
    return card.step.flatMap(step =>
      (step.score || []).map(score => ({
        agent: step.agent || '未知Agent',
        version: score.version,
        confidence: parseFloat(score.confidence) * 100
      }))
    ).filter(d => d.version && d.confidence !== undefined)
     .sort((a, b) => versionSort(a.version, b.version));
  }, [card]);

  // 2. 获取所有唯一版本号并排序
  const versions = useMemo(() => {
    return [...new Set(chartData.map(d => d.version))].sort(versionSort);
  }, [chartData]);

  // 3. 获取所有唯一agent
  const agents = useMemo(() => {
    return [...new Set(chartData.map(d => d.agent))];
  }, [chartData]);  
console.log("agents",agents)
  // 4. 生成每个agent的线数据（以version为X轴，补齐缺失点为null）


  // 5. 组装最终AreaChart的数据结构（每个version一行，每个agent一列）
  const mergedData = useMemo(() => {
    return versions.map(version => {
      const row = { version };
      agents.forEach((agent, idx) => {
        const found = chartData.find(d => d.version === version && d.agent === agent);
        row[agent] = found ? found.confidence : null;
      });
      return row;
    });
  }, [versions, agents, chartData]);

  // 6. 计算Y轴最大值
  const yMax = useMemo(() => {
    let max = 0;
    chartData.forEach(d => { if (typeof d.confidence === 'number' && d.confidence > max) max = d.confidence; });
    return Math.ceil(max * 1.1) || 100;
  }, [chartData]);

  if (!chartData || chartData.length === 0) {
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
      <div className={styles.lineChartContainer}>
        <ResponsiveContainer width="100%" height={130}>
          <LineChart
            data={mergedData}
            margin={{ top: 2, right: 5, left: 0, bottom: 2 }}
          >
            {/* 只有 showLinearGradient 为 true 时才渲染 <defs> 和 linearGradient */}
            {showLinearGradient && (
              <defs>
                {agents.map((agent, idx) => (
                  <linearGradient key={agent} id={`color${agent}`} x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor={colors[idx % colors.length]} stopOpacity={0.2} />
                    <stop offset="95%" stopColor={colors[idx % colors.length]} stopOpacity={0} />
                  </linearGradient>
                ))}
              </defs>
            )}
            <CartesianGrid vertical={false} horizontal={true} stroke="#f0f0f0" />
            <XAxis
              dataKey="version"
              type="category"
              ticks={versions}
              label={{ value: 'version', position: 'bottom', fontSize: 10, fill: '#8f9098' }}
              tick={{ fontSize: 10, fill: '#8f9098' }}
            />
            <YAxis
              label={{ value: 'confidence', angle: -90, position: 'left', fontSize: 10, fill: '#8f9098' }}
              domain={[0, yMax]}
              tick={{ fontSize: 10, fill: '#8f9098' }}
            />
            <RechartsTooltip />
            {agents.map((agent, idx) => (
              <Line
                key={agent}
                type="monotone"
                dataKey={agent}
                name={agent}
                stroke={colors[idx % colors.length]}
                strokeWidth={2}
                dot={{ r: 2.5, fill: colors[idx % colors.length] }}
                activeDot={{ r: 4 }}
                connectNulls
                {...(showLinearGradient ? { fill: `url(#color${agent})` } : {})}
              />
            ))}
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default LineChartSection;