"use client"

import { useState, useEffect } from 'react'
import { Empty, Pagination, Spin, Typography, Button, message } from 'antd'
import { DownOutlined, UpOutlined, DownloadOutlined } from '@ant-design/icons'
import AssetCard from './AssetCard'
import { useAssetStyles } from '../../styles/components/assets'
import DownloadReportModal from '../modals/DownloadReportModal'

const { Title } = Typography

/**
 * 资产列表组件
 * @param {Array} assets - 资产数据列表
 * @param {Boolean} loading - 加载状态
 * @param {Number} total - 总记录数
 * @param {Number} currentPage - 当前页码
 * @param {Number} pageSize - 每页记录数
 * @param {Function} onPageChange - 分页回调
 * @param {Boolean} isChatOpen - 聊天区域是否展开
 * @param {Number} refreshTrigger - 刷新触发器，当值变化时重新加载数据
 */
const AssetList = ({ 
  assets = [], 
  loading = false, 
  total = 0,
  currentPage = 1,
  pageSize = 12,
  onPageChange,
  isChatOpen = false,
  refreshTrigger = 0
}) => {
  const { styles } = useAssetStyles()
  const [expandedSections, setExpandedSections] = useState({
    scene: true,
    qa: true,
    template: true,
    report: true
  })
  
  // 本地报告数据
  const [localReports, setLocalReports] = useState([])
  
  // 下载报告模态框状态
  const [downloadModalVisible, setDownloadModalVisible] = useState(false)
  const [reportDataForDownload, setReportDataForDownload] = useState([])
  // 存储原始报告数据的Map，用于下载
  const [reportDataMap, setReportDataMap] = useState({})
  
  // 按类型分组资产
  const groupAssetsByType = (assets) => {
    const groups = {
      scene: [],
      qa: [],
      template: [],
      report: [...localReports] // 添加本地报告数据
    }
    
    // 添加调试日志
    console.log('分组前的资产数据:', assets);
    console.log('本地报告数据:', localReports);
    
    assets.forEach(asset => {
      const type = asset.type || 'template'
      // 添加调试日志
      // console.log('处理资产:', asset.id, '类型:', type);
      
      if (type === 'scene') {
        groups.scene.push(asset)
      } else if (type === 'qa') {
        groups.qa.push(asset)
      } else if (type === 'report') {
        // 确保不重复添加已经在localReports中的报告
        const isDuplicate = groups.report.some(report => report.id === asset.id);
        if (!isDuplicate) {
          groups.report.push(asset)
        }
      } else {
        groups.template.push(asset)
      }
    })
    
    // 完成分组后记录结果
    console.log('资产分组结果:', {
      scene: groups.scene.length,
      qa: groups.qa.length,
      template: groups.template.length,
      report: groups.report.length
    });
    
    return groups
  }
  
  // 处理展开/收起区域
  const toggleSection = (sectionType) => {
    setExpandedSections(prev => ({
      ...prev,
      [sectionType]: !prev[sectionType]
    }))
  }
  
  // 处理打开下载报告模态框
  const handleDownloadReport = (type) => {
    // 准备报告数据用于下载
    const groupedAssets = groupAssetsByType(assets);
    const reportsForDownload = groupedAssets[type] || [];
    
    // 创建报告数据映射
    const dataMap = {};
    
    // 格式化报告数据用于表格展示
    const formattedReports = reportsForDownload.map((report, index) => {
      const key = report.id || `report-${index}`;
      // 存储原始报告数据
      dataMap[key] = report;
      
      return {
        key,
        name: report.name || report.title || `报告 ${index + 1}`,
        creator: report.created_by || '系统',
        createdFrom: report.created_from || '报告生成器',
        createdAt: report.created_at ? 
                  (typeof report.created_at === 'object' && report.created_at.seconds ? 
                   new Date(report.created_at.seconds * 1000).toLocaleString() : 
                   typeof report.created_at === 'string' ? 
                   new Date(report.created_at).toLocaleString() : 
                   '未知日期') : 
                  '未知日期',
        summary: report.response_summary || report.summary || '无报告内容',
      };
    });
    
    setReportDataMap(dataMap);
    setReportDataForDownload(formattedReports);
    setDownloadModalVisible(true);
  }
  
  // 加载本地报告数据的函数
  const loadLocalReports = () => {
    try {
      // 从localStorage获取报告数据
      const reportsJson = localStorage.getItem('task_reports');
      if (reportsJson) {
        const reports = JSON.parse(reportsJson);
        if (Array.isArray(reports) && reports.length > 0) {
          // 将报告数据添加到资产列表中
          const reportAssets = reports.map(report => ({
            ...report,
            type: 'report',
            // 确保必要字段存在
            name: report.name || report.title || `报告 ${report.id}`,
            title: report.title || report.name || `报告 ${report.id}`,
            response_summary: report.response_summary || report.summary || report.content || '无报告内容',
            summary: report.summary || report.response_summary || report.content || '无报告内容',
            created_by: report.created_by || '系统',
            created_from: report.created_from || '报告生成器',
            keywords: Array.isArray(report.keywords) ? report.keywords : ['报告'],
            dimensions: Array.isArray(report.dimensions) ? report.dimensions : ['分析']
          }));
          
          // 更新本地报告数据
          setLocalReports(reportAssets);
          console.log('加载报告数据成功:', reportAssets.length);
        } else {
          // 如果没有报告数据，设置为空数组
          setLocalReports([]);
        }
      } else {
        // 如果localStorage中没有报告数据，设置为空数组
        setLocalReports([]);
      }
    } catch (error) {
      console.error('加载报告数据失败:', error);
      setLocalReports([]);
    }
  };
  
  // 初始化报告数据
  useEffect(() => {
    loadLocalReports();
  }, []);
  
  // 当refreshTrigger变化时重新加载报告数据
  useEffect(() => {
    if (refreshTrigger > 0) {
      console.log('检测到刷新触发器变化，重新加载报告数据:', refreshTrigger);
      loadLocalReports();
    }
  }, [refreshTrigger]);
  
  // 添加对自定义reportsUpdated事件的监听
  useEffect(() => {
    const handleReportsUpdated = (e) => {
      console.log('收到报告更新事件:', e.detail);
      // 立即重新加载报告数据
      loadLocalReports();
    };
    
    // 添加事件监听
    window.addEventListener('reportsUpdated', handleReportsUpdated);
    
    // 组件卸载时移除事件监听
    return () => {
      window.removeEventListener('reportsUpdated', handleReportsUpdated);
    };
  }, []);
  
  // 也监听reports_last_updated存储变化
  useEffect(() => {
    const checkReportUpdate = () => {
      const lastUpdateTime = localStorage.getItem('reports_last_updated');
      if (lastUpdateTime) {
        console.log('检测到报告最后更新时间:', lastUpdateTime);
        loadLocalReports();
      }
    };
    
    // 初始检查
    checkReportUpdate();
    
    // 添加存储事件监听
    const handleStorageChange = (e) => {
      if (e.key === 'reports_last_updated') {
        checkReportUpdate();
      }
    };
    
    window.addEventListener('storage', handleStorageChange);
    
    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, []);
  
  // 添加对task_reports直接变化的监听
  useEffect(() => {
    const handleTaskReportsChange = (e) => {
      if (e.key === 'task_reports') {
        console.log('检测到localStorage中的task_reports数据变化');
        loadLocalReports();
      }
    };
    
    // 添加事件监听
    window.addEventListener('storage', handleTaskReportsChange);
    
    // 组件卸载时移除事件监听
    return () => {
      window.removeEventListener('storage', handleTaskReportsChange);
    };
  }, []);
  
  // 每30秒自动检查一次报告数据更新
  useEffect(() => {
    const checkInterval = setInterval(() => {
      loadLocalReports();
    }, 30000); // 30秒
    
    return () => {
      clearInterval(checkInterval);
    };
  }, []);
  
  // 渲染资产分组标题
  const renderSectionHeader = (title, type, count) => {
    const isExpanded = expandedSections[type]
    
    return (
      <div className={styles.sectionHeader}>
        <Title level={4} className={styles.sectionTitle}>{title} ({count})</Title>
        <div className={styles.sectionHeaderButtons}>
          {/* 只在报告分组中显示下载按钮 */}
          {type === 'report' && count > 0 && (
            <Button 
              type="link" 
              className={styles.downloadButton}
              onClick={(e) => {
                e.stopPropagation();
                handleDownloadReport(type);
              }}
              icon={<DownloadOutlined />}
            >
              下载报告
            </Button>
          )}
          <Button 
            type="link" 
            className={styles.expandButton}
            onClick={() => toggleSection(type)}
            icon={isExpanded ? <UpOutlined /> : <DownOutlined />}
          >
            {isExpanded ? '收起' : '展开'}
          </Button>
        </div>
      </div>
    )
  }
  
  // 渲染资产卡片网格
  const renderAssetGrid = (assets) => {
    return (
      <div className={styles.cardGrid}>
        {assets.map((asset, index) => (
          <AssetCard key={asset.id || index} asset={asset} />
        ))}
      </div>
    )
  }
  
  // 渲染资产分组区域
  const renderSection = (title, type, assets) => {
    // 无论是否有数据，报告分组始终渲染（添加强制渲染逻辑）
    const shouldAlwaysRender = type === 'report';
    
    if (!shouldAlwaysRender && (!assets || assets.length === 0)) return null
    
    const isExpanded = expandedSections[type]
    // 默认只显示4条数据，展开时显示全部
    const displayedAssets = isExpanded ? assets : assets.slice(0, 4)
    
    return (
      <div className={styles.assetSection}>
        {renderSectionHeader(title, type, assets ? assets.length : 0)}
        <div className={styles.sectionBackground}>
          {displayedAssets && displayedAssets.length > 0 ? (
            renderAssetGrid(displayedAssets)
          ) : (
            <div className={styles.collapsedHint}>
              <Empty description={`暂无${title}数据`} />
            </div>
          )}
        </div>
      </div>
    )
  }
  
  // 渲染资产卡片列表
  const renderAssetList = () => {
    if (loading) {
      return (
        <div style={{ textAlign: 'center', padding: '40px 0' }}>
          <Spin size="large" />
        </div>
      )
    }
    
    // 合并API资产和本地报告数据
    const allAssets = assets && assets.length > 0 ? assets : [];
    
    if (allAssets.length === 0 && localReports.length === 0) {
      return (
        <Empty 
          className={styles.emptyState}
          description="暂无资产数据" 
          image={Empty.PRESENTED_IMAGE_SIMPLE}
        />
      )
    }
    
    // 按类型分组资产
    const groupedAssets = groupAssetsByType(allAssets);
    
    return (
      <div className={styles.assetSections}>
        {renderSection('报告', 'report', groupedAssets.report)}
        {renderSection('场景', 'scene', groupedAssets.scene)}
        {renderSection('问答', 'qa', groupedAssets.qa)}
        {renderSection('模板', 'template', groupedAssets.template)}
     
      </div>
    )
  }

  return (
    <div>
      {renderAssetList()}
      
      {/* {total > 0 && (
        <div className={styles.pagination}>
          <Pagination
            current={currentPage}
            pageSize={pageSize}
            total={total}
            onChange={onPageChange}
            showSizeChanger
            showQuickJumper
            showTotal={(total) => `共 ${total} 项`}
          />
        </div>
      )} */}
      
      {/* 使用新的下载报告模态框组件 */}
      <DownloadReportModal
        visible={downloadModalVisible}
        onClose={() => setDownloadModalVisible(false)}
        reports={reportDataForDownload}
        reportDataMap={reportDataMap}
      />
    </div>
  )
}

export default AssetList 