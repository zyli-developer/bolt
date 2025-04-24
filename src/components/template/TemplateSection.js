import React, { useState, useEffect, useCallback } from 'react';
import { ReactFlow, Controls, Background, useNodesState, useEdgesState, addEdge, Panel, ReactFlowProvider } from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import { Typography, Avatar, Tag, Button, message, Spin, Modal, Input } from 'antd';
import { EditOutlined, EyeOutlined, DeleteOutlined, PlusOutlined, MinusOutlined, PlusCircleOutlined } from '@ant-design/icons';
import AnnotationModal from '../annotations/AnnotationModal';
import ContextMenu from '../annotations/ContextMenu';
import * as annotationService from '../../services/annotationService';
import * as templateService from '../../services/templateService';

const { Title } = Typography;
const { TextArea } = Input;

const TemplateSection = ({ isEditable = false }) => {
  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);
  const [annotations, setAnnotations] = useState([]);
  const [expandedAnnotation, setExpandedAnnotation] = useState(null);
  const [selectedNode, setSelectedNode] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [loading, setLoading] = useState(true);
  const [contextMenu, setContextMenu] = useState(null);
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [editContent, setEditContent] = useState('');
  const [addNodeModalVisible, setAddNodeModalVisible] = useState(false);
  const [newNodeContent, setNewNodeContent] = useState('');

  useEffect(() => {
    Promise.all([
      fetchTemplateContent(),
      fetchAnnotations()
    ]).finally(() => {
      setLoading(false);
    });
  }, []);

  const fetchTemplateContent = async () => {
    try {
      const data = await templateService.getTemplateContent();
      setNodes(data.nodes);
      setEdges(data.edges);
    } catch (error) {
      message.error('获取模板内容失败');
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

  const onConnect = useCallback((params) => {
    if (isEditable) {
      setEdges((eds) => addEdge(params, eds));
    }
  }, [isEditable]);

  const onNodeContextMenu = useCallback((event, node) => {
    if (!isEditable) return;
    
    event.preventDefault();
    setSelectedNode(node);
    setContextMenu({
      x: event.clientX,
      y: event.clientY,
      nodeId: node.id
    });
  }, [isEditable]);

  const handleContextMenuAction = (action) => {
    setContextMenu(null);
    switch (action) {
      case 'addAnnotation':
        setModalVisible(true);
        break;
      case 'edit':
        setEditContent(selectedNode.data.label);
        setEditModalVisible(true);
        break;
      case 'delete':
        handleDeleteNode();
        break;
      default:
        break;
    }
  };

  const handleSaveAnnotation = async (data) => {
    try {
      if (!selectedNode) {
        message.error('请选择一个节点');
        return;
      }

      await annotationService.addAnnotation({
        ...data,
        nodeId: selectedNode.id,
      });

      await fetchAnnotations();
      setModalVisible(false);
      setSelectedNode(null);
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

  const handleEditNode = () => {
    if (!selectedNode || !editContent.trim()) {
      message.error('请输入节点内容');
      return;
    }

    setNodes((nds) =>
      nds.map((node) => {
        if (node.id === selectedNode.id) {
          return {
            ...node,
            data: {
              ...node.data,
              label: editContent.trim()
            }
          };
        }
        return node;
      })
    );

    setEditModalVisible(false);
    setEditContent('');
    setSelectedNode(null);
    message.success('修改成功');
  };

  const handleDeleteNode = () => {
    if (!selectedNode) return;

    setNodes((nds) => nds.filter((node) => node.id !== selectedNode.id));
    setEdges((eds) => eds.filter((edge) => 
      edge.source !== selectedNode.id && edge.target !== selectedNode.id
    ));
    setSelectedNode(null);
    message.success('删除成功');
  };

  const handleAddNode = () => {
    if (!newNodeContent.trim()) {
      message.error('请输入节点内容');
      return;
    }

    const newNode = {
      id: `${Date.now()}`,
      data: { label: newNodeContent.trim() },
      position: { x: 250, y: 400 },
      style: {
        background: '#fff',
        border: '1px solid #d9d9d9',
        borderRadius: '8px',
        padding: '12px 20px',
        fontSize: '14px'
      }
    };

    setNodes((nds) => [...nds, newNode]);
    setAddNodeModalVisible(false);
    setNewNodeContent('');
    message.success('添加成功');
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
      gap: '4px',
      padding: '16px',
      height: 'calc(100vh - 300px)',
      overflow: 'hidden',
      position: 'relative'
    }}>
      {/* 左侧流程图区域 */}
      <div style={{ 
        flex: '1',
        backgroundColor: '#fff',
        borderRadius: '8px',
        overflow: 'hidden'
      }}>
        <div style={{ 
          padding: '16px 24px',
          borderBottom: '1px solid #f0f0f0',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}>
          <Title level={5} style={{ margin: 0 }}>模板详情</Title>
          {isEditable ? (
            <Button type="text" icon={<EyeOutlined />}>预览</Button>
          ) : null}
        </div>
        
        <div style={{ height: 'calc(100% - 57px)' }}>
          <ReactFlowProvider>
            <ReactFlow
              nodes={nodes}
              edges={edges}
              onNodesChange={isEditable ? onNodesChange : undefined}
              onEdgesChange={isEditable ? onEdgesChange : undefined}
              onConnect={onConnect}
              onNodeContextMenu={onNodeContextMenu}
              fitView
              proOptions={{ hideAttribution: true }}
              defaultViewport={{ x: 0, y: 0, zoom: 1 }}
              minZoom={0.1}
              maxZoom={4}
              zoomOnScroll={false}
              panOnScroll={true}
              panOnDrag={true}
            >
              <Background />
              <Controls />
              <Panel position="top-right">
                <Button 
                  type="primary"
                  onClick={() => {
                    templateService.updateTemplateContent({ nodes, edges });
                    message.success('保存成功');
                  }}
                >
                  保存布局
                </Button>
              </Panel>
            </ReactFlow>
          </ReactFlowProvider>
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
                      {nodes.find(node => node.id === item.nodeId)?.data.label}
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
          showEditDelete={isEditable}
        />
      )}

      {/* 添加注释的 Modal */}
      <AnnotationModal
        visible={modalVisible}
        onClose={() => {
          setModalVisible(false);
          setSelectedNode(null);
        }}
        onSave={handleSaveAnnotation}
        selectedText={selectedNode?.data.label || ''}
      />

      {/* 编辑节点的 Modal */}
      <Modal
        title="编辑节点"
        open={editModalVisible}
        onCancel={() => {
          setEditModalVisible(false);
          setEditContent('');
          setSelectedNode(null);
        }}
        onOk={handleEditNode}
        okText="保存"
        cancelText="取消"
      >
        <TextArea
          value={editContent}
          onChange={(e) => setEditContent(e.target.value)}
          placeholder="请输入节点内容..."
          rows={4}
        />
      </Modal>

      {/* 添加节点的 Modal */}
      <Modal
        title="添加节点"
        open={addNodeModalVisible}
        onCancel={() => {
          setAddNodeModalVisible(false);
          setNewNodeContent('');
        }}
        onOk={handleAddNode}
        okText="添加"
        cancelText="取消"
      >
        <TextArea
          value={newNodeContent}
          onChange={(e) => setNewNodeContent(e.target.value)}
          placeholder="请输入节点内容..."
          rows={4}
        />
      </Modal>

      {/* 添加节点按钮 */}
      {isEditable && (
        <Button
          type="primary"
          shape="circle"
          icon={<PlusCircleOutlined />}
          size="large"
          style={{
            position: 'absolute',
            right: '360px',
            bottom: '24px',
            boxShadow: '0 2px 8px rgba(0,0,0,0.15)'
          }}
          onClick={() => setAddNodeModalVisible(true)}
        />
      )}
    </div>
  );
};

export default TemplateSection; 