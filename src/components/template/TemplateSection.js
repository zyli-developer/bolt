import React, { useState, useEffect, useCallback, useRef } from 'react';
import { ReactFlow, Controls, Background, useNodesState, useEdgesState, addEdge, Panel, ReactFlowProvider } from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import { Typography, Avatar, Tag, Button, message, Spin, Modal, Input } from 'antd';
import { EditOutlined, EyeOutlined, DeleteOutlined, PlusOutlined, MinusOutlined, PlusCircleOutlined } from '@ant-design/icons';
import AnnotationModal from '../annotations/AnnotationModal';
import ContextMenu from '../annotations/ContextMenu';
import * as annotationService from '../../services/annotationService';
import * as templateService from '../../services/templateService';
import useStyles from '../../styles/components/template/TemplateSection';

const { Title } = Typography;
const { TextArea } = Input;

const TemplateSection = ({ isEditable = false }) => {
  const { styles } = useStyles();
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

  useEffect(() => {
    const handleGlobalClick = () => {
      if (contextMenu) {
        setContextMenu(null);
      }
    };

    document.addEventListener('click', handleGlobalClick);

    return () => {
      document.removeEventListener('click', handleGlobalClick);
    };
  }, [contextMenu]);

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
    event.stopPropagation();
    
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
      <div className={styles.loadingContainer}>
        <Spin size="large" />
      </div>
    );
  }

  return (
    <div className={styles.container}>
      {/* 左侧流程图区域 */}
      <div className={styles.flowChartContainer}>
        <div className={styles.flowChartHeader}>
          <Title level={5} className={styles.headerTitle}>模板详情</Title>
          {isEditable ? (
            <Button type="text" icon={<EyeOutlined />}>预览</Button>
          ) : null}
        </div>
        
        <div className={styles.flowChartContent}>
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
      <div className={styles.annotationSidebar}>
        <Title level={5} className={styles.annotationTitle}>注释列表</Title>
        
        <div className={styles.annotationList}>
          {annotations.map(item => (
            <div className={styles.annotationPanel} key={item.id}>
              <div 
                className={`${styles.annotationPanelHeader} ${expandedAnnotation === item.id ? styles.expandedHeader : styles.collapsedHeader}`}
                onClick={() => setExpandedAnnotation(expandedAnnotation === item.id ? null : item.id)}
              >
                <div className={styles.annotationPanelLeft}>
                  <Avatar size={32}>{item.author.avatar}</Avatar>
                  <div className={styles.annotationInfo}>
                    <div className={styles.annotationText}>
                      {nodes.find(node => node.id === item.nodeId)?.data.label}
                    </div>
                    <div className={styles.annotationMeta}>
                      {item.author.name} · {item.time}
                    </div>
                  </div>
                </div>
                <div>
                  {expandedAnnotation === item.id ? <MinusOutlined /> : <PlusOutlined />}
                </div>
              </div>
              
              {expandedAnnotation === item.id && (
                <div className={styles.annotationPanelContent}>
                  <div className={styles.annotationContent}>
                    <p className={styles.annotationTextContent}>{item.content}</p>
                    
                    {item.attachments?.length > 0 && (
                      <div className={styles.attachmentContainer}>
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
                    <div className={styles.actionContainer}>
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
          className={styles.addNodeButton}
          onClick={() => setAddNodeModalVisible(true)}
        />
      )}
    </div>
  );
};

export default TemplateSection; 