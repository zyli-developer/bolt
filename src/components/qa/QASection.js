import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Typography, Avatar, Tag, Button, message, Spin } from 'antd';
import { EditOutlined, EyeOutlined, DeleteOutlined, PlusOutlined, MinusOutlined } from '@ant-design/icons';
import AnnotationModal from '../annotations/AnnotationModal';
import ContextMenu from '../annotations/ContextMenu';
import * as annotationService from '../../services/annotationService';
import * as qaService from '../../services/qaService';
import useStyles from '../../styles/components/qa/QASection';

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

  useEffect(() => {
    Promise.all([
      fetchAnnotations(),
      fetchQAContent()
    ]).finally(() => {
      setLoading(false);
    });
  }, []);

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
    } catch (error) {
      message.error('获取注释失败');
    }
  };

  const handleTextSelection = useCallback((e) => {
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
    if (action === 'addAnnotation') {
      setModalVisible(true);
    }
  };

  const handleSaveAnnotation = async (data) => {
    try {
      if (!selectedRange) {
        message.error('请重新选择要注释的文本');
        return;
      }

      await annotationService.addAnnotation({
        ...data,
        start: selectedRange.start,
        end: selectedRange.end,
        selectedText: selectedText
      });

      await fetchAnnotations();
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
      await fetchAnnotations();
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
    <div className={styles.container}>
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
      <div className={styles.rightSection}>
        <Title level={5} className={styles.annotationTitle}>注释列表</Title>
        
        <div className={styles.annotationList}>
          {annotations.map(item => (
            <div className={styles.annotationPanel} key={item.id}>
              <div 
                onClick={() => setExpandedAnnotation(expandedAnnotation === item.id ? null : item.id)}
                className={`${styles.annotationPanelHeader} ${
                  expandedAnnotation === item.id 
                    ? styles.annotationPanelExpanded 
                    : styles.annotationPanelCollapsed
                }`}
              >
                <div className={styles.annotationPanelLeft}>
                  <Avatar size={32}>{item.author.avatar}</Avatar>
                  <div className={styles.annotationInfo}>
                    <div className={styles.annotationText}>
                      {item.selectedText}
                    </div>
                    <div className={styles.annotationMeta}>
                      {item.author.name} · {item.time}
                    </div>
                  </div>
                </div>
                <div className={styles.annotationPanelIcon}>
                  {expandedAnnotation === item.id ? <MinusOutlined /> : <PlusOutlined />}
                </div>
              </div>
              
              {expandedAnnotation === item.id && (
                <div className={styles.annotationPanelContent}>
                  <div className={styles.annotationContent}>
                    <p className={styles.annotationText}>{item.content}</p>
                    
                    {item.attachments?.length > 0 && (
                      <div className={styles.annotationAttachments}>
                        {item.attachments.map((file, index) => (
                          <Tag key={index} className={styles.attachmentTag}>
                            <a href={file.url} target="_blank" rel="noopener noreferrer">
                              {file.name}
                            </a>
                          </Tag>
                        ))}
                      </div>
                    )}
                  </div>
                  {isEditable && (
                    <div className={styles.annotationActions}>
                      <Button 
                        type="text" 
                        icon={<DeleteOutlined />} 
                        danger
                        size="small"
                        onClick={() => handleDeleteAnnotation(item.id)}
                      >
                        删除
                      </Button>
                    </div>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* 右键菜单 */}
      {contextMenu && (
        <ContextMenu
          x={contextMenu.x}
          y={contextMenu.y}
          onAction={handleContextMenuAction}
        />
      )}

      {/* 添加注释的 Modal */}
      <AnnotationModal
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
        onSave={handleSaveAnnotation}
        selectedText={selectedText}
      />
    </div>
  );
};

export default QASection; 