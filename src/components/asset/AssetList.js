"use client"

import { useState } from 'react'
import { Empty, Pagination, Spin, Typography, Button } from 'antd'
import { DownOutlined, UpOutlined } from '@ant-design/icons'
import AssetCard from './AssetCard'
import { useAssetStyles } from '../../styles/components/assets'

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
 */
const AssetList = ({ 
  assets = [], 
  loading = false, 
  total = 0,
  currentPage = 1,
  pageSize = 12,
  onPageChange,
  isChatOpen = false
}) => {
  const { styles } = useAssetStyles()
  const [expandedSections, setExpandedSections] = useState({
    scene: true,
    qa: true,
    template: true
  })
  
  // 按类型分组资产
  const groupAssetsByType = (assets) => {
    const groups = {
      scene: [],
      qa: [],
      template: []
    }
    
    assets.forEach(asset => {
      const type = asset.type || 'template'
      if (type === 'scene') {
        groups.scene.push(asset)
      } else if (type === 'qa') {
        groups.qa.push(asset)
      } else {
        groups.template.push(asset)
      }
    })
    
    return groups
  }
  
  // 处理展开/收起区域
  const toggleSection = (sectionType) => {
    setExpandedSections(prev => ({
      ...prev,
      [sectionType]: !prev[sectionType]
    }))
  }
  
  // 渲染资产分组标题
  const renderSectionHeader = (title, type, count) => {
    const isExpanded = expandedSections[type]
    
    return (
      <div className={styles.sectionHeader}>
        <Title level={4} className={styles.sectionTitle}>{title} ({count})</Title>
        <Button 
          type="link" 
          className={styles.expandButton}
          onClick={() => toggleSection(type)}
          icon={isExpanded ? <UpOutlined /> : <DownOutlined />}
        >
          {isExpanded ? '收起' : '展开'}
        </Button>
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
    if (!assets || assets.length === 0) return null
    
    const isExpanded = expandedSections[type]
    // 默认只显示4条数据，展开时显示全部
    const displayedAssets = isExpanded ? assets : assets.slice(0, 4)
    
    return (
      <div className={styles.assetSection}>
        {renderSectionHeader(title, type, assets.length)}
        <div className={styles.sectionBackground}>
          {isExpanded && displayedAssets.length > 0 ? (
            renderAssetGrid(displayedAssets)
          ) : (
            <div className={styles.collapsedHint}>
              {displayedAssets.length > 0 ? (
                renderAssetGrid(displayedAssets)
              ) : (
                <Empty description={`暂无${title}数据`} />
              )}
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
    
    if (!assets || assets.length === 0) {
      return (
        <Empty 
          className={styles.emptyState}
          description="暂无资产数据" 
          image={Empty.PRESENTED_IMAGE_SIMPLE}
        />
      )
    }
    
    // 按类型分组资产
    const groupedAssets = groupAssetsByType(assets)
    
    return (
      <div className={styles.assetSections}>
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
    </div>
  )
}

export default AssetList 