import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Typography, Avatar, Tag, Button, message, Spin } from 'antd';
import { EditOutlined, EyeOutlined, DeleteOutlined, PlusOutlined, MinusOutlined } from '@ant-design/icons';
import AnnotationModal from '../annotations/AnnotationModal';
import ContextMenu from '../annotations/ContextMenu';
import * as annotationService from '../../services/annotationService';
import * as qaService from '../../services/qaService';

const { Title } = Typography;

const QASection = ({ isEditable = false }) => {
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
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
        <Spin size="large" />
      </div>
    );
  }

  return (
    <div style={{ 
      display: 'flex', 
      gap: '24px',
      padding: '16px',
      height: 'calc(100vh - 300px)',
      overflow: 'hidden'
    }}>
      {/* 左侧文本区域 */}
      <div style={{ 
        flex: '1',
        backgroundColor: '#fff',
        borderRadius: '8px',
        padding: '24px',
        overflow: 'auto'
      }}>
        <div style={{ marginBottom: '16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Title level={5} style={{ margin: 0 }}>{qaContent.title}</Title>
          {isEditable ? (
            <Button type="text" icon={<EyeOutlined />}>预览</Button>
          ) : null}
        </div>
        
        <div 
          ref={contentRef}
          style={{ 
            fontSize: '14px',
            lineHeight: '1.8',
            color: '#333',
            position: 'relative',
            whiteSpace: 'pre-wrap'
          }}
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
                  style={{
                    backgroundColor: '#E6F7FF',
                    position: 'relative'
                  }}
                  onMouseEnter={() => handleMouseEnter(annotation.id)}
                >
                  {char}
                  {index === annotation.start && (
                    <span
                      style={{
                        position: 'absolute',
                        top: '-12px',
                        right: '-12px',
                        background: '#1890ff',
                        color: '#fff',
                        borderRadius: '50%',
                        width: '16px',
                        height: '16px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '12px'
                      }}
                    >
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
      <div style={{ 
        width: '320px',
        backgroundColor: '#fff',
        borderRadius: '8px',
        padding: '24px',
        overflow: 'auto'
      }}>
        <Title level={5} style={{ marginBottom: '16px' }}>注释列表</Title>
        
        <div className="annotation-list" style={{ gap: '4px' }}>
          {annotations.map(item => (
            <div className="annotation-panel" key={item.id} style={{ marginBottom: '4px' }}>
              <div 
                className="annotation-panel-header" 
                onClick={() => setExpandedAnnotation(expandedAnnotation === item.id ? null : item.id)}
                style={{ 
                  padding: '8px',
                  backgroundColor: expandedAnnotation === item.id ? '#E6F7FF' : '#f8f9fa',
                  borderRadius: '6px',
                  cursor: 'pointer',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center'
                }}
              >
                <div className="annotation-panel-left" style={{ 
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  flex: 1
                }}>
                  <Avatar size={32}>{item.author.avatar}</Avatar>
                  <div className="annotation-info" style={{ flex: 1 }}>
                    <div className="annotation-text" style={{ 
                      fontSize: '14px',
                      color: '#333',
                      wordBreak: 'break-all'
                    }}>
                      {item.selectedText}
                    </div>
                    <div style={{ 
                      fontSize: '12px',
                      color: '#8f9098',
                      marginTop: '4px'
                    }}>
                      {item.author.name} · {item.time}
                    </div>
                  </div>
                </div>
                <div className="annotation-panel-icon">
                  {expandedAnnotation === item.id ? <MinusOutlined /> : <PlusOutlined />}
                </div>
              </div>
              
              {expandedAnnotation === item.id && (
                <div className="annotation-panel-content" style={{ padding: '0 8px 8px' }}>
                  <div className="annotation-content" style={{ padding: '8px' }}>
                    <p className="annotation-text" style={{ 
                      fontSize: '12px',
                      margin: 0,
                      lineHeight: '1.4',
                      color: '#333'
                    }}>{item.content}</p>
                    
                    {item.attachments?.length > 0 && (
                      <div style={{ marginTop: '8px' }}>
                        {item.attachments.map((file, index) => (
                          <Tag key={index} style={{ marginRight: '4px' }}>
                            <a href={file.url} target="_blank" rel="noopener noreferrer">
                              {file.name}
                            </a>
                          </Tag>
                        ))}
                      </div>
                    )}
                  </div>
                  {isEditable && (
                    <div style={{ 
                      display: 'flex',
                      justifyContent: 'flex-end',
                      marginTop: '8px'
                    }}>
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