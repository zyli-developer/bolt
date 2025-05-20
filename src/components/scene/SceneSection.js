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

const SceneSection = ({ isEditable = false, taskId, scenario, comments = [], onAddAnnotation, onScenarioUpdate = () => {}, card }) => {
  const { styles } = useStyles();
  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);
  const [expandedAnnotation, setExpandedAnnotation] = useState(null);
  const [selectedNode, setSelectedNode] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [loading, setLoading] = useState(true);
  const [contextMenu, setContextMenu] = useState(null);
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [editContent, setEditContent] = useState('');
  const [editWeight, setEditWeight] = useState('');
  const [addNodeModalVisible, setAddNodeModalVisible] = useState(false);
  const [newNodeContent, setNewNodeContent] = useState('');
  const [newNodeWeight, setNewNodeWeight] = useState('0');
  const [expandedNodes, setExpandedNodes] = useState(new Set());
  
  // 添加讨论模态框状态
  const [discussModalVisible, setDiscussModalVisible] = useState(false);
  const [selectedText, setSelectedText] = useState('');
  // 移除重复的annotationModalVisible状态，只使用modalVisible

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
      console.log("comments", comments);
      if (comments && comments.length > 0) {
        // 如果提供了comments属性，直接使用它
        setLoading(false);
      } else {
        // 否则从服务获取注释
      fetchAnnotations().finally(() => {
        setLoading(false);
      });
      }
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

  // 当从props获取到comments或从优化上下文获取到注释数据时，更新本地状态
  useEffect(() => {
    // 优先使用从props传入的comments
    if (comments && comments.length > 0) {
      setLoading(false);
    } 
    // 如果没有props传入comments但有来自上下文的数据，且当前为场景优化步骤，则使用上下文数据
    else if (currentOptimizationStep === 'scene' && currentStepComments && currentStepComments.length > 0) {
      setLoading(false);
    }
  }, [comments, currentOptimizationStep, currentStepComments]);

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
      
      // 将获取到的注释也同步到全局状态
      if (currentOptimizationStep === 'scene') {
        setStepComments('scene', data);
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
        
        // 查找对应的场景节点以获取权重
        let nodeWeight = "0";
        if (scenario && scenario.node && Array.isArray(scenario.node)) {
          const sceneNode = scenario.node.find(n => n.id === selectedNode.id);
          if (sceneNode && typeof sceneNode.weight !== 'undefined') {
            nodeWeight = String(sceneNode.weight);
          }
        }
        
        // 初始化权重值，优先使用场景节点中的weight
        setEditWeight(nodeWeight);
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

  const handleSaveAnnotation = async (data, annotationType = 'scene') => {
    try {
      let annotationData = {
        ...data,
        nodeId: selectedNode?.id,
        step: 'scene',
        id: `scene-annotation-${Date.now()}`
      };
      if (onAddAnnotation) {
        onAddAnnotation(annotationData);
      } else {
        addComment(annotationData);
        message.success('注释已添加');
      }
      setModalVisible(false);
      setContextMenu(null);
    } catch (error) {
      console.error('保存注释失败:', error);
      message.error('添加注释失败，请重试');
    }
  };

  const handleDeleteAnnotation = async (id) => {
    try {
      await annotationService.deleteAnnotation(id);
      // 只操作全局
      if (currentOptimizationStep === 'scene') {
        setStepComments('scene', comments.filter(item => item.id !== id));
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

    // 验证权重值是否为有效数字
    const weightValue = parseFloat(editWeight);
    if (isNaN(weightValue)) {
      message.error('权重必须是有效的数字');
      return;
    }

    // 更新React Flow节点的显示内容
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

    // 如果是可编辑模式，同时更新scenario.node数据
    if (isEditable && scenario && scenario.node && Array.isArray(scenario.node)) {
      // 创建scenario的副本，避免直接修改props
      const updatedScenario = { ...scenario };
      const updatedNodes = [...updatedScenario.node];
      
      // 查找对应节点并更新
      const nodeIndex = updatedNodes.findIndex(n => n.id === selectedNode.id);
      if (nodeIndex !== -1) {
        updatedNodes[nodeIndex] = {
          ...updatedNodes[nodeIndex],
          label: editContent.trim(),
          weight: weightValue
        };
        
        // 更新scenario
        updatedScenario.node = updatedNodes;
        
        // 如果有更新scenario的回调，调用它
        if (typeof onScenarioUpdate === 'function') {
          onScenarioUpdate(updatedScenario);
        }
      }
    }

    setEditModalVisible(false);
    setEditContent('');
    setEditWeight('');
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

    // 验证权重值是否为有效数字
    const weightValue = parseFloat(newNodeWeight);
    if (isNaN(weightValue)) {
      message.error('权重必须是有效的数字');
      return;
    }

    const newNode = {
      id: `${Date.now()}`,
      data: { 
        label: newNodeContent.trim(),
        weight: weightValue
      },
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
    setNewNodeWeight('0');
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

  // 合并props.comments和card.annotation.scene，去重
  const taskAnnotations = Array.isArray(card?.annotation?.scene) ? card.annotation.scene : [];
  const filteredComments = Array.isArray(comments)
    ? comments.filter(item => item.step === 'scene')
    : [];
  const mergedComments = [
    ...taskAnnotations,
    ...filteredComments.filter(c => !taskAnnotations.some(t => t.id === c.id))
  ];

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
            // <Button type="text" icon={<EyeOutlined />}>预览</Button>
            <Button 
            type="text" 
            icon={<PlusOutlined />} 
            className={styles.actionButton}
            onClick={() => {
              // 点击添加观点按钮时，清空已选节点，直接打开模态框
              setSelectedNode(null);
              setSelectedText('');
              setModalVisible(true);
            }}
          >
            添加观点
          </Button>
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
              preventScrolling={false}
              onWheelCapture={(e) => e.stopPropagation()}
            >
              <Background />
              <Controls />
            </ReactFlow>
          </ReactFlowProvider>
        </div>
      </div>

      {/* 右侧注释列表 - 只有当有注释数据时才显示 */}
      {mergedComments && mergedComments.length > 0 && (
        <div className="scene-sidebar-container" style={{ 
          width: '320px', 
          flexShrink: 0,
          overflowY: 'auto',
          backgroundColor: '#fff',
          borderRadius: '8px'
        }}>
          <CommentsList 
            comments={mergedComments} 
            isEditable={isEditable}
            expandedId={expandedAnnotation}
            onToggleExpand={setExpandedAnnotation}
            onMouseEnter={handleMouseEnter}
            onDelete={handleDeleteAnnotation}
            contextType="node"
            title="场景观点"
          />
        </div>
      )}

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

      {/* 添加观点的 Modal */}
      <AnnotationModal
        visible={modalVisible}
        onClose={() => {
          setModalVisible(false);
          setSelectedNode(null);
        }}
        onSave={handleSaveAnnotation}
        selectedText={selectedNode?.data.label || selectedText || ''}
        initialContent={selectedNode?.data.label || selectedText || ''}
        step="scene"
        nodeId={selectedNode?.id} // 传递选中节点的ID
      />

      {/* 编辑节点的 Modal */}
      <Modal
        title="编辑节点"
        open={editModalVisible}
        onCancel={() => {
          setEditModalVisible(false);
          setEditContent('');
          setEditWeight('');
          setSelectedNode(null);
        }}
        onOk={handleEditNode}
        okText="保存"
        cancelText="取消"
      >
        <div style={{ marginBottom: '16px' }}>
          <div style={{ marginBottom: '8px' }}>内容：</div>
        <TextArea
          value={editContent}
          onChange={(e) => setEditContent(e.target.value)}
          placeholder="请输入节点内容..."
          rows={4}
        />
        </div>
        <div>
          <div style={{ marginBottom: '8px' }}>权重：</div>
          <Input
            type="number"
            step="0.01"
            value={editWeight}
            onChange={(e) => setEditWeight(e.target.value)}
            placeholder="请输入节点权重值..."
            style={{ width: '100%' }}
          />
        </div>
      </Modal>

      {/* 添加节点的 Modal */}
      <Modal
        title="添加节点"
        open={addNodeModalVisible}
        onCancel={() => {
          setAddNodeModalVisible(false);
          setNewNodeContent('');
          setNewNodeWeight('0');
        }}
        onOk={handleAddNode}
        okText="添加"
        cancelText="取消"
      >
        <div style={{ marginBottom: '16px' }}>
          <div style={{ marginBottom: '8px' }}>内容：</div>
        <TextArea
          value={newNodeContent}
          onChange={(e) => setNewNodeContent(e.target.value)}
          placeholder="请输入节点内容..."
          rows={4}
        />
        </div>
        <div>
          <div style={{ marginBottom: '8px' }}>权重：</div>
          <Input
            type="number"
            step="0.01"
            value={newNodeWeight}
            onChange={(e) => setNewNodeWeight(e.target.value)}
            placeholder="请输入节点权重值..."
            style={{ width: '100%' }}
          />
        </div>
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