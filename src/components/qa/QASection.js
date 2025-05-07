import React, { useState, useEffect, useCallback, useRef, useContext } from 'react';
import { Typography, Avatar, Tag, Button, message, Spin } from 'antd';
import { EditOutlined, EyeOutlined, DeleteOutlined, PlusOutlined, MinusOutlined } from '@ant-design/icons';
import AnnotationModal from '../annotations/AnnotationModal';
import TextContextMenu from '../context/TextContextMenu';
import DiscussModal from '../modals/DiscussModal';
import CommentsList from '../common/CommentsList';
import * as annotationService from '../../services/annotationService';
import * as qaService from '../../services/qaService';
import useStyles from '../../styles/components/qa/QASection';
import { OptimizationContext } from '../../contexts/OptimizationContext';

const { Title } = Typography;

const QASection = ({ isEditable = false }) => {
  const { styles } = useStyles();
  
  const [annotations, setAnnotations] = useState([]);
  const [expandedAnnotation, setExpandedAnnotation] = useState(null);
  const [contextMenu, setContextMenu] = useState(null);
  const [selectedText, setSelectedText] = useState('');
  const [modalVisible, setModalVisible] = useState(false);
  const [loading, setLoading] = useState(true);
  const [selectedRange, setSelectedRange] = useState(null);
  const [qaContent, setQAContent] = useState({ title: '', content: '' });
  const contentRef = useRef(null);
  
  // 添加讨论模态框状态
  const [discussModalVisible, setDiscussModalVisible] = useState(false);

  // 引入全局优化上下文
  const { 
    currentOptimizationStep, 
    currentStepComments,
    addComment,
    setStepComments
  } = useContext(OptimizationContext);

  useEffect(() => {
    Promise.all([
      fetchAnnotations(),
      fetchQAContent()
    ]).finally(() => {
      setLoading(false);
    });
  }, []);

  // 当从优化上下文获取到注释数据时，更新本地状态
  useEffect(() => {
    if (currentOptimizationStep === 1 && currentStepComments && currentStepComments.length > 0) {
      setAnnotations(currentStepComments);
    }
  }, [currentOptimizationStep, currentStepComments]);

  const fetchQAContent = async () => {
    try {
      const data = await qaService.getQAContent();
      setQAContent(data);
    } catch (error) {
      message.error('获取问答内容失败');
    }
  };

  const fetchAnnotations = async () => {
    try {
      const data = await annotationService.getAnnotations();
      setAnnotations(data);
      
      // 将获取到的注释也同步到全局状态
      if (currentOptimizationStep === 1) {
        setStepComments(1, data);
      }
    } catch (error) {
      message.error('获取注释失败');
    }
  };

  const handleTextSelection = useCallback((e) => {
    // 恢复权限限制，仅在编辑模式下可以选择文本
    if (!isEditable) return;
    
    const selection = window.getSelection();
    const selectedText = selection.toString().trim();
    
    if (selectedText) {
      // 获取选中文本的范围
      const range = selection.getRangeAt(0);
      const preSelectionRange = range.cloneRange();
      preSelectionRange.selectNodeContents(contentRef.current);
      preSelectionRange.setEnd(range.startContainer, range.startOffset);
      
      const start = preSelectionRange.toString().length;
      const end = start + selectedText.length;

      setSelectedText(selectedText);
      setSelectedRange({ start, end });
      setContextMenu({
        x: e.clientX,
        y: e.clientY
      });
    } else {
      setContextMenu(null);
      setSelectedRange(null);
    }
  }, [isEditable]);

  const handleContextMenuAction = (action) => {
    setContextMenu(null);
    
    switch (action) {
      case 'discuss':
        setDiscussModalVisible(true);
        break;
      case 'annotate':
        // 已经在isEditable模式下，无需再次判断
      setModalVisible(true);
        break;
      case 'select':
        // 实现连续选择的功能，可以在此添加
        console.log('连续选择功能', selectedText);
        break;
      default:
        break;
    }
  };

  const handleSaveAnnotation = async (data) => {
    try {
      if (!selectedRange) {
        message.error('请重新选择要注释的文本');
        return;
      }

      const annotationData = {
        ...data,
        start: selectedRange.start,
        end: selectedRange.end,
        selectedText: selectedText,
        id: `annotation-${Date.now()}` // 确保有唯一ID
      };

      await annotationService.addAnnotation(annotationData);

      // 更新本地状态
      setAnnotations(prev => [...prev, annotationData]);
      
      // 同时更新全局状态
      if (currentOptimizationStep === 1) {
        addComment(annotationData);
      }
      
      setModalVisible(false);
      setSelectedRange(null);
      message.success('添加注释成功');
    } catch (error) {
      message.error('添加注释失败');
    }
  };

  const handleDeleteAnnotation = async (id) => {
    try {
      await annotationService.deleteAnnotation(id);
      
      // 更新本地状态
      const updatedAnnotations = annotations.filter(item => item.id !== id);
      setAnnotations(updatedAnnotations);
      
      // 同时更新全局状态
      if (currentOptimizationStep === 1) {
        setStepComments(1, updatedAnnotations);
      }
      
      message.success('删除注释成功');
    } catch (error) {
      message.error('删除注释失败');
    }
  };

  const handleMouseEnter = (id) => {
    setExpandedAnnotation(id);
  };

  if (loading) {
    return (
      <div className={styles.loadingContainer}>
        <Spin size="large" />
      </div>
    );
  }

  return (
    <div className={`${styles.container} ${isEditable ? 'edit-mode' : ''}`}>
      {/* 左侧文本区域 */}
      <div className={styles.leftSection}>
        <div className={styles.headerSection}>
          <Title level={5} className={styles.headerTitle}>{qaContent.title}</Title>
          {isEditable ? (
            <Button type="text" icon={<EyeOutlined />}>预览</Button>
          ) : null}
        </div>
        
        <div 
          ref={contentRef}
          className={styles.contentText}
          onMouseUp={handleTextSelection}
          onContextMenu={(e) => {
            e.preventDefault();
            if (isEditable) {
              handleTextSelection(e);
            }
          }}
        >
          {qaContent.content.split('').map((char, index) => {
            const annotation = annotations.find(a => index >= a.start && index < a.end);
            if (annotation) {
              return (
                <span
                  key={index}
                  className={styles.annotatedText}
                  onMouseEnter={() => handleMouseEnter(annotation.id)}
                >
                  {char}
                  {index === annotation.start && (
                    <span className={styles.annotationMarker}>
                      {annotation.id}
                    </span>
                  )}
                </span>
              );
            }
            return <span key={index}>{char}</span>;
          })}
        </div>
      </div>

      {/* 右侧注释列表 */}
      <div className="qa-sidebar-container" style={{ 
        width: '320px', 
        flexShrink: 0,
        overflowY: 'auto',
        backgroundColor: '#fff',
        borderRadius: '8px'
      }}>   
        <CommentsList 
          comments={annotations}
          isEditable={isEditable}
          expandedId={expandedAnnotation}
          onToggleExpand={setExpandedAnnotation}
          onMouseEnter={handleMouseEnter}
          onDelete={handleDeleteAnnotation}
          contextType="text"
          title="观点列表"
        />
      </div>

      {/* 右键菜单 - 使用通用的TextContextMenu组件 */}
      {contextMenu && (
        <TextContextMenu
          x={contextMenu.x}
          y={contextMenu.y}
          onAction={handleContextMenuAction}
          onClose={() => setContextMenu(null)}
        />
      )}

      {/* 添加注释的 Modal */}
      <AnnotationModal
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
        onSave={handleSaveAnnotation}
        selectedText={selectedText}
      />
      
      {/* 讨论对话框 */}
      <DiscussModal
        visible={discussModalVisible}
        onClose={() => setDiscussModalVisible(false)}
        selectedText={selectedText}
      />
    </div>
  );
};

export default QASection; 