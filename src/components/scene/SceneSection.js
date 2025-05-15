import React, { useState, useEffect, useCallback, useRef, useContext } from 'react';
import { ReactFlow, Controls, Background, useNodesState, useEdgesState, addEdge, Panel, ReactFlowProvider } from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import { Typography, Avatar, Tag, Button, message, Spin, Modal, Input } from 'antd';
import { EditOutlined, EyeOutlined, DeleteOutlined, PlusOutlined, MinusOutlined, PlusCircleOutlined, DownOutlined, RightOutlined } from '@ant-design/icons';
import AnnotationModal from '../annotations/AnnotationModal';
import TextContextMenu from '../context/TextContextMenu';
import DiscussModal from '../modals/DiscussModal';
import CommentsList from '../common/CommentsList';
import * as annotationService from '../../services/annotationService';
import * as sceneService from '../../services/sceneService';
import useStyles from '../../styles/components/scene/SceneSection';
import { OptimizationContext } from '../../contexts/OptimizationContext';

const { Title } = Typography;
const { TextArea } = Input;

const SceneSection = ({ isEditable = false, taskId, scenario }) => {
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
  const [expandedNodes, setExpandedNodes] = useState(new Set());
  
  // 添加讨论模态框状态
  const [discussModalVisible, setDiscussModalVisible] = useState(false);
  const [selectedText, setSelectedText] = useState('');

  // 引入全局优化上下文
  const { 
    currentOptimizationStep, 
    currentStepComments,
    addComment,
    setStepComments
  } = useContext(OptimizationContext);

  useEffect(() => {
    // 如果提供了scenario参数，则使用props数据，否则从服务获取数据
    if (scenario) {
      // 将scenario数据转换为React Flow所需的格式
      const flowNodes = scenario.node ? scenario.node.map(node => {
        // 根据节点类型设置不同的样式
        let nodeStyle = {
          background: '#fff',
          border: '1px solid #d9d9d9',
          borderRadius: '8px',
          padding: '12px 20px',
          fontSize: '14px'
        };
        
        // 根节点样式
        if (node.type === 'root') {
          nodeStyle = {
            ...nodeStyle,
            background: '#f0f7ff',
            border: '1px solid #006ffd',
            fontWeight: 'bold'
          };
        } 
        // 分支节点样式
        else if (node.type === 'branch') {
          nodeStyle = {
            ...nodeStyle,
            background: '#f9f9f9',
            border: '1px solid #a6a6a6'
          };
        }
        // 叶子节点样式
        else if (node.type === 'leaf') {
          nodeStyle = {
            ...nodeStyle,
            background: '#fff',
            border: '1px solid #d9d9d9',
            width: node.label.length > 15 ? '280px' : 'auto'
          };
        }
        
        return {
          id: node.id,
          data: { label: node.label },
          position: node.position || { x: 0, y: 0 },
          type: 'default',
          style: nodeStyle
        };
      }) : [];

      const flowEdges = scenario.edge ? scenario.edge.map(edge => ({
        id: edge.id,
        source: edge.source,
        target: edge.target,
        animated: true,
        style: { stroke: '#006ffd' }
      })) : [];

      setNodes(flowNodes);
      setEdges(flowEdges);
      fetchAnnotations().finally(() => {
        setLoading(false);
      });
    } else {
      // 如果没有提供scenario参数，则从服务获取数据
      Promise.all([
        fetchSceneContent(),
        fetchAnnotations()
      ]).finally(() => {
        setLoading(false);
      });
    }
  }, [scenario]);

  // 监听scenario props变化，更新nodes和edges
  useEffect(() => {
    if (scenario) {
      // 将scenario数据转换为React Flow所需的格式
      const flowNodes = scenario.node ? scenario.node.map(node => {
        // 根据节点类型设置不同的样式
        let nodeStyle = {
          background: '#fff',
          border: '1px solid #d9d9d9',
          borderRadius: '8px',
          padding: '12px 20px',
          fontSize: '14px'
        };
        
        // 根节点样式
        if (node.type === 'root') {
          nodeStyle = {
            ...nodeStyle,
            background: '#f0f7ff',
            border: '1px solid #006ffd',
            fontWeight: 'bold'
          };
        } 
        // 分支节点样式
        else if (node.type === 'branch') {
          nodeStyle = {
            ...nodeStyle,
            background: '#f9f9f9',
            border: '1px solid #a6a6a6'
          };
        }
        // 叶子节点样式
        else if (node.type === 'leaf') {
          nodeStyle = {
            ...nodeStyle,
            background: '#fff',
            border: '1px solid #d9d9d9',
            width: node.label.length > 15 ? '280px' : 'auto'
          };
        }
        
        return {
          id: node.id,
          data: { label: node.label },
          position: node.position || { x: 0, y: 0 },
          type: 'default',
          style: nodeStyle
        };
      }) : [];

      const flowEdges = scenario.edge ? scenario.edge.map(edge => ({
        id: edge.id,
        source: edge.source,
        target: edge.target,
        animated: true,
        style: { stroke: '#006ffd' }
      })) : [];

      setNodes(flowNodes);
      setEdges(flowEdges);
    }
  }, [scenario]);

  // 当从优化上下文获取到注释数据时，更新本地状态
  useEffect(() => {
    if (currentOptimizationStep === 2 && currentStepComments && currentStepComments.length > 0) {
      setAnnotations(currentStepComments);
    }
  }, [currentOptimizationStep, currentStepComments]);

  useEffect(() => {
    const handleGlobalClick = (e) => {
      // 检查点击的元素是否为右键菜单本身或其子元素
      const isClickInsideMenu = e.target.closest('.contextMenuContainer');
      
      if (contextMenu && !isClickInsideMenu) {
        setContextMenu(null);
      }
    };

    document.addEventListener('click', handleGlobalClick);

    return () => {
      document.removeEventListener('click', handleGlobalClick);
    };
  }, [contextMenu]);

  const fetchSceneContent = async () => {
    try {
      const data = await sceneService.getSceneContent();
      setNodes(data.nodes);
      setEdges(data.edges);
    } catch (error) {
      message.error('获取场景内容失败');
    }
  };

  const fetchAnnotations = async () => {
    try {
      const data = await annotationService.getAnnotations();
      setAnnotations(data);
      
      // 将获取到的注释也同步到全局状态
      if (currentOptimizationStep === 2) {
        setStepComments(2, data);
      }
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
    setSelectedText(node.data.label || '');
    setContextMenu({
      x: event.clientX,
      y: event.clientY,
      nodeId: node.id
    });
  }, [isEditable]);

  const handleContextMenuAction = (action) => {
    setContextMenu(null);
    switch (action) {
      case 'discuss':
        setDiscussModalVisible(true);
        break;
      case 'annotate':
        setModalVisible(true);
        break;
      case 'edit':
        setEditContent(selectedNode.data.label);
        setEditModalVisible(true);
        break;
      case 'select':
        console.log('连续选择功能', selectedNode.data.label);
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

      const annotationData = {
        ...data,
        nodeId: selectedNode.id,
        id: `annotation-${Date.now()}` // 确保有唯一ID
      };

      await annotationService.addAnnotation(annotationData);

      // 更新本地状态
      setAnnotations(prev => [...prev, annotationData]);
      
      // 同时更新全局状态
      if (currentOptimizationStep === 2) {
        addComment(annotationData);
      }
      
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
      
      // 更新本地状态
      const updatedAnnotations = annotations.filter(item => item.id !== id);
      setAnnotations(updatedAnnotations);
      
      // 同时更新全局状态
      if (currentOptimizationStep === 2) {
        setStepComments(2, updatedAnnotations);
      }
      
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

  const handleNodeExpand = (nodeId) => {
    setExpandedNodes(prev => {
      const newSet = new Set(prev);
      if (newSet.has(nodeId)) {
        newSet.delete(nodeId);
      } else {
        newSet.add(nodeId);
      }
      return newSet;
    });
  };

  const CustomNode = ({ data }) => {
    const { label, children } = data;
    const isExpanded = expandedNodes.includes(data.id);

    return (
      <div className={styles.customNode}>
        <div className={styles.nodeContent}>
          {children && (
            <Button
              type="text"
              icon={isExpanded ? <DownOutlined /> : <RightOutlined />}
              onClick={() => handleNodeExpand(data.id)}
              className={styles.expandButton}
            />
          )}
          <span>{label}</span>
        </div>
        {isExpanded && children && (
          <div className={styles.childrenContainer}>
            {children.map((child) => (
              <CustomNode key={child.id} data={child} />
            ))}
          </div>
        )}
      </div>
    );
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
          <Title level={5} className={styles.headerTitle}>场景详情</Title>
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
              nodeTypes={{ custom: CustomNode }}
              fitView
              proOptions={{ hideAttribution: true }}
              defaultViewport={{ x: 0, y: 0, zoom: 1 }}
              minZoom={0.1}
              maxZoom={4}
              zoomOnScroll={false}
              panOnScroll={false}
              panOnDrag={true}
              preventScrolling={true}
            >
              <Background />
              <Controls />
            </ReactFlow>
          </ReactFlowProvider>
        </div>
      </div>

      {/* 右侧注释列表 */}
      <div className="scene-sidebar-container" style={{ 
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
          contextType="node"
          title="场景观点"
          nodes={nodes}
        />
      </div>

      {/* 右键菜单 */}
      {contextMenu && (
        <TextContextMenu
          x={contextMenu.x}
          y={contextMenu.y}
          onAction={handleContextMenuAction}
          onClose={() => setContextMenu(null)}
          contextType="scene"
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

      {/* 讨论对话框 */}
      <DiscussModal
        visible={discussModalVisible}
        onClose={() => setDiscussModalVisible(false)}
        selectedText={selectedText}
      />
    </div>
  );
};

export default SceneSection; 