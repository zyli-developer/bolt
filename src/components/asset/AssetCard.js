"use client"

import { useState } from 'react'
import { Avatar, Tag, Card, Typography, Button, Tooltip, Space, Modal } from 'antd'
import { useNavigate } from 'react-router-dom'
import { useAssetStyles } from '../../styles/components/assets'
import { 
  StarOutlined, 
  StarFilled, 
  SendOutlined, 
  MessageOutlined, 
  DeleteOutlined,
  UserOutlined 
} from '@ant-design/icons'
import ReportDetailModal from './ReportDetailModal'

const { Text, Title } = Typography

/**
 * 资产卡片组件
 * @param {Object} asset - 资产数据
 */
const AssetCard = ({ asset }) => {
  const { styles } = useAssetStyles()
  const navigate = useNavigate()
  const [isFavorite, setIsFavorite] = useState(false)
  const [reportModalVisible, setReportModalVisible] = useState(false)
  
  // 如果没有资产数据，显示空卡片
  if (!asset) {
    return (
      <Card className={styles.assetCard}>
        <Text>无效资产数据</Text>
      </Card>
    );
  }

  // 确保资产数据包含所需的属性
  const safeAsset = {
    id: asset?.id || 'unknown-id',
    name: asset?.name || asset?.title || '未命名资产',
    summary: asset?.response_summary || asset?.summary || '无概述...',
    creator: asset?.created_by || '未知用户',
    createdFrom: asset?.created_from || '未知来源', 
    keywords: Array.isArray(asset?.keywords) ? asset.keywords : [],
    dimensions: Array.isArray(asset?.dimensions) ? asset.dimensions : [],
    createdAt: asset?.created_at ? new Date(asset.created_at).toLocaleDateString() : '未知日期',
    type: asset?.type || 'template'
  }

  // 处理点击卡片事件
  const handleCardClick = () => {
    // 只有报告类型响应点击事件，显示报告详情模态框
    if (safeAsset.type === 'report') {
      setReportModalVisible(true)
    }
    // 移除其他类型卡片的点击导航
  }

  // 处理收藏按钮点击
  const handleFavoriteClick = (e) => {
    e.stopPropagation()
    setIsFavorite(!isFavorite)
  }
  
  // 处理发送按钮点击
  const handleSendClick = (e) => {
    e.stopPropagation()
    // 处理发送逻辑
    console.log('发送资产:', safeAsset.id)
  }
  
  // 处理消息按钮点击
  const handleMessageClick = (e) => {
    e.stopPropagation()
    // 处理消息逻辑
    console.log('打开消息:', safeAsset.id)
  }
  
  // 处理删除按钮点击
  const handleDeleteClick = (e) => {
    e.stopPropagation()
    // 处理删除逻辑
    console.log('删除资产:', safeAsset.id)
  }

  // 处理关闭报告模态框
  const handleCloseReportModal = () => {
    setReportModalVisible(false)
  }

  // 获取此资产的标签列表
  const getTags = () => {
    if (safeAsset.type === 'scene') {
      return safeAsset.dimensions || []
    } else if (safeAsset.type === 'template') {
      return safeAsset.keywords || []
    } else {
      return [...(safeAsset.keywords || []), ...(safeAsset.dimensions || [])].slice(0, 5)
    }
  }

  const allTags = getTags()
  
  // 最多显示5个标签
  const displayTags = allTags.slice(0, 5)
  const hasMoreTags = allTags.length > 5

  // 根据卡片类型决定是否可悬停和点击
  const isReport = safeAsset.type === 'report'

  return (
    <>
      <Card 
        className={styles.assetCard} 
        hoverable={isReport} 
        onClick={isReport ? handleCardClick : undefined}
      >
        <div className={styles.cardContainer}>
          {/* 头部信息 */}
          <div className={styles.cardHeader}>
            <Title level={5} className={styles.cardTitle}>{safeAsset.name}</Title>
            
            {/* 操作按钮 */}
            <div className={styles.cardActions}>
              <Space size={4}>
                <Tooltip title="发送">
                  <Button
                    type="text"
                    size="small"
                    icon={<SendOutlined />}
                    onClick={handleSendClick}
                    className={styles.actionButton}
                  />
                </Tooltip>
                <Tooltip title="消息">
                  <Button
                    type="text"
                    size="small"
                    icon={<MessageOutlined />}
                    onClick={handleMessageClick}
                    className={styles.actionButton}
                  />
                </Tooltip>
                <Tooltip title="删除">
                  <Button
                    type="text"
                    size="small"
                    icon={<DeleteOutlined />}
                    onClick={handleDeleteClick}
                    className={styles.actionButton}
                    danger
                  />
                </Tooltip>
              </Space>
            </div>
          </div>
          
          {/* 创建人信息 */}
          <div className={styles.creatorInfo}>
            <Text type="secondary">创建人：</Text>
            <div className={styles.creatorDetail}>
              <Avatar 
                size="small" 
                className={styles.authorAvatar} 
                icon={<UserOutlined />}
              >
                {safeAsset.creator[0]}
              </Avatar>
              <Text>{safeAsset.creator}</Text>
            </div>
          </div>
          
          {/* 标签区域 */}
          <div className={styles.cardTags}>
            {displayTags.map((tag, index) => (
              <Tag key={index} className={styles.tagStyle}>{tag}</Tag>
            ))}
            {hasMoreTags && (
              <Tooltip title={allTags.slice(5).join(', ')}>
                <Tag className={styles.tagStyle}>+{allTags.length - 5}</Tag>
              </Tooltip>
            )}
          </div>
        </div>
      </Card>

      {/* 报告详情模态框 */}
      {safeAsset.type === 'report' && (
        <ReportDetailModal 
          visible={reportModalVisible}
          onClose={handleCloseReportModal}
          report={asset}
        />
      )}
    </>
  )
}

export default AssetCard 