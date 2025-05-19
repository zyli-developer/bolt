"use client"

import { useState } from "react"
import { Avatar, Tag, Checkbox, Button, message, Modal } from "antd"
import { useNavigate } from "react-router-dom"
import {
  LineChart,
  Line,
  ResponsiveContainer,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as RechartsTooltip,
  Radar,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Area,
  AreaChart
} from "recharts"
import { FileTextOutlined, PlusOutlined, CheckCircleOutlined } from "@ant-design/icons"
import CreateTaskModal from "../modals/CreateTaskModal"
import taskService from "../../services/taskService"
import SceneSection from "../scene/SceneSection" 
import QASection from "../qa/QASection"
import TemplateSection from "../template/TemplateSection"

const TaskCard = ({ task, onTaskUpdate }) => {
  const navigate = useNavigate()
  const [showRadarChart, setShowRadarChart] = useState(false)
  const [selectedAgents, setSelectedAgents] = useState({
    overall: true,
    agent1: false,
    agent2: false,
  })
  const [isCreateTaskModalVisible, setIsCreateTaskModalVisible] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [taskStatus, setTaskStatus] = useState(task.status || "pending")
  
  // 添加控制三个模态框显示的状态
  const [isSceneModalVisible, setIsSceneModalVisible] = useState(false)
  const [isQAModalVisible, setIsQAModalVisible] = useState(false)
  const [isTemplateModalVisible, setIsTemplateModalVisible] = useState(false)

  const toggleRadarChart = () => {
    setShowRadarChart(!showRadarChart)
  }

  const handleAgentChange = (agentKey) => {
    setSelectedAgents({
      ...selectedAgents,
      [agentKey]: !selectedAgents[agentKey],
    })
  }

  // 处理标题点击
  const handleTitleClick = () => {
    // 直接使用任务ID导航到详情页
    navigate(`/tasks/detail/${task.id}`, { state: { from: "tasks" } })
  }
  
  // 添加模态框控制函数
  const showSceneModal = (e) => {
    e.stopPropagation(); // 阻止事件冒泡
    setIsSceneModalVisible(true);
  }
  
  const showQAModal = (e) => {
    e.stopPropagation(); // 阻止事件冒泡
    setIsQAModalVisible(true);
  }
  
  const showTemplateModal = (e) => {
    e.stopPropagation(); // 阻止事件冒泡
    setIsTemplateModalVisible(true);
  }
  
  const handleModalClose = () => {
    setIsSceneModalVisible(false);
    setIsQAModalVisible(false);
    setIsTemplateModalVisible(false);
  }
  
  // 处理提交结果按钮点击
  const handleSubmitResult = async (e) => {
    e.stopPropagation(); // 阻止事件冒泡
    
    try {
      setSubmitting(true);
      
      // 创建更新后的任务对象
      const updatedTask = {
        ...task,
        status: "completed"
      };
      
      // 调用API更新任务状态为completed
      await taskService.updateTask(task.id, updatedTask);
      
      // 更新本地状态
      setTaskStatus("completed");
      
      // 显示成功消息
      message.success("任务已成功完成！");
      
      // 如果父组件提供了onTaskUpdate回调，则调用它
      if (typeof onTaskUpdate === 'function') {
        onTaskUpdate(task.id, updatedTask);
      } else {
        // 否则，尝试通过CustomEvent触发列表刷新
        const refreshEvent = new CustomEvent('taskStatusUpdated', { 
          detail: { taskId: task.id, status: "completed" }
        });
        window.dispatchEvent(refreshEvent);
      }
    } catch (error) {
      console.error("提交结果失败:", error);
      message.error("提交结果失败，请重试");
    } finally {
      setSubmitting(false);
    }
  };

  // Filter radar data based on selected agents
  const filteredRadarData = task.chartData?.radar || [
    { name: "维度1", value: 70 },
    { name: "维度2", value: 80 },
    { name: "维度3", value: 60 },
    { name: "维度4", value: 90 },
    { name: "维度5", value: 75 },
    { name: "维度6", value: 85 },
  ]

  const handleModalCancel = () => {
    setIsCreateTaskModalVisible(false)
  }

  return (
    <div className={`task-card`}>
      {/* Card title */}
      <div className="task-card-header">
        <h2 className="task-card-title" onClick={handleTitleClick}>
          {task.title}
        </h2>
        
        {/* 提交结果按钮 - 仅在任务状态为running时显示 */}
        { task.status === "running" && 
          (
          <Button
            type="primary"
            size="small"
            icon={<CheckCircleOutlined />}
            onClick={handleSubmitResult}
            loading={submitting}
            style={{ marginLeft: 'auto', borderRadius: '10px' }}
          >
            提交结果
          </Button>
        )}
      </div>

      {/* Author info and tags */}
      <div className="task-card-meta">
        <div className="task-author-info">
          <Avatar size={32} src={task.author.avatar} className="task-author-avatar">
            {task.author?.name?.charAt(0)}
          </Avatar>
          <span className="task-assigned-text">
            Assigned by
          </span>
          <span className="task-author-name">{task.author?.name}</span>
          <span className="task-from-text">from</span>
          <span className="task-source-name">{task.source}</span>
        </div>
        <div className="task-card-tags">
          {task.tags.map((tag, index) => (
            <Tag 
              key={index} 
              className="task-tag"
            >
              {tag}
            </Tag>
          ))}
        </div>
      </div>

      <div className="task-card-divider"></div>

      {/* Card content - horizontal layout */}
      <div className="task-card-content">
        {/* Left section - task details */}
        <div className="task-card-left">
          <div className="task-details">
            <div className="task-detail-item">
              <span className="task-detail-label">状态：</span>
              <span className="task-detail-value">
                {(() => {
                  // 使用本地状态变量显示状态
                  const currentStatus = taskStatus || task.status || "pending";
                  
                  // 格式化状态显示
                  switch (currentStatus) {
                    case "pending":
                      return "待启动";
                    case "running":
                      return "进行中";
                    case "completed":
                      return "已完成";
                    case "pending_approval":
                      return "待审批";
                    default:
                      return currentStatus;
                  }
                })()}
              </span>
            </div>

            <div className="task-detail-item">
              <span className="task-detail-label">描述：</span>
              <span className="task-detail-value">
                {task.response_summary || "暂无描述"}
              </span>
            </div>
          </div>

          {/* Action buttons */}
          <div className="task-actions">
            <div className="task-action-buttons">
              <div 
                className={`task-action-item ${task.scenario ? 'active' : 'add-item'}`}
                onClick={showSceneModal}
                style={{ cursor: 'pointer' }}
              >
                <div className="task-action-icon">
                  {task.scenario ? <FileTextOutlined /> : <PlusOutlined />}
                </div>
                <div className="task-action-text">场景</div>
                {task.scenario && <button className="task-action-close" onClick={(e) => { e.stopPropagation(); }}>×</button>}
              </div>

              <div 
                className={`task-action-item ${(task.prompt && task.response_summary) ? 'active' : 'add-item'}`}
                onClick={showQAModal}
                style={{ cursor: 'pointer' }}
              >
                <div className="task-action-icon">
                  {(task.prompt && task.response_summary) ? <FileTextOutlined /> : <PlusOutlined />}
                </div>
                <div className="task-action-text">添加QA</div>
                {(task.prompt && task.response_summary) && <button className="task-action-close" onClick={(e) => { e.stopPropagation(); }}>×</button>}
              </div>

              <div 
                className={`task-action-item ${task.step && task.step.length > 0 ? 'active' : 'add-item'}`}
                onClick={showTemplateModal}
                style={{ cursor: 'pointer' }}
              >
                <div className="task-action-icon">
                  {task.step && task.step.length > 0 ? <FileTextOutlined /> : <PlusOutlined />}
                </div>
                <div className="task-action-text">添模板</div>
                {task.step && task.step.length > 0 && <button className="task-action-close" onClick={(e) => { e.stopPropagation(); }}>×</button>}
              </div>
            </div>
            
            <div className="task-dimension-link">
              <a
                href="#"
                onClick={(e) => {
                  e.preventDefault()
                  toggleRadarChart()
                }}
              >
                {showRadarChart ? "收起" : "查看维度"} {showRadarChart ? "←" : "→"}
              </a>
            </div>
          </div>
        </div>

        {/* Right section - chart */}
        <div className="task-card-right">
          {showRadarChart && (
            <div className="task-radar-chart-container">
              <div className="task-chart-title">各维度得分</div>
              <div className="task-radar-chart">
                <ResponsiveContainer width="100%" height={130}>
                  <RadarChart data={filteredRadarData} outerRadius={45}>
                    <PolarGrid stroke="#e0e0e0" />
                    <PolarAngleAxis dataKey="name" tick={{ fontSize: 8, fill: "#8f9098" }} />
                    <PolarRadiusAxis domain={[0, 100]} tick={{ fontSize: 8, fill: "#8f9098" }} axisLine={false} />
                    {selectedAgents.overall && (
                      <Radar name="Overall" dataKey="value" stroke="var(--color-primary)" fill="var(--color-primary)" fillOpacity={0.2} />
                    )}
                    {selectedAgents.agent1 && (
                      <Radar name="Agent 1" dataKey="agent1" stroke="#3ac0a0" fill="#3ac0a0" fillOpacity={0.2} />
                    )}
                    {selectedAgents.agent2 && (
                      <Radar name="Agent 2" dataKey="agent2" stroke="#ff7a45" fill="#ff7a45" fillOpacity={0.2} />
                    )}
                  </RadarChart>
                </ResponsiveContainer>
              </div>
              <div className="task-agents">
                <div className="task-agents-list">
                  <div className="task-agent-item">
                    <Checkbox checked={selectedAgents.overall} onChange={() => handleAgentChange("overall")}>
                      Overall
                    </Checkbox>
                  </div>
                  <div className="task-agent-item">
                    <Checkbox checked={selectedAgents.agent1} onChange={() => handleAgentChange("agent1")}>
                      Agent 1
                    </Checkbox>
                  </div>
                  <div className="task-agent-item">
                    <Checkbox checked={selectedAgents.agent2} onChange={() => handleAgentChange("agent2")}>
                      Agent 2
                    </Checkbox>
                  </div>
                </div>
              </div>
            </div>
          )}

          <div className="task-chart-container">
            <div className="task-chart-title">可信度爬升曲线</div>
            <div className="task-chart">
              <ResponsiveContainer width="100%" height={130}>
                <AreaChart data={task.chartData?.line || []} margin={{ top: 3, right: 3, left: 0, bottom: 3 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#eee" />
                  <XAxis
                    dataKey="month"
                    tick={{ fontSize: 8, fill: "#8f9098" }}
                    axisLine={{ stroke: "#e0e0e0" }}
                    tickLine={false}
                  />
                  <YAxis
                    domain={[0, 100]}
                    tick={{ fontSize: 8, fill: "#8f9098" }}
                    axisLine={false}
                    tickLine={false}
                  />
                  <RechartsTooltip />
                  <defs>
                    <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="var(--color-assist-1)" stopOpacity={0.6}/>
                      <stop offset="95%" stopColor="var(--color-assist-1)" stopOpacity={0.1}/>
                    </linearGradient>
                  </defs>
                  <Area
                    type="monotone"
                    dataKey="value"
                    stroke="var(--color-assist-1)"
                    strokeWidth={1.5}
                    fillOpacity={1}
                    fill="url(#colorValue)"
                    dot={{ r: 2.5, fill: "var(--color-assist-1)" }}
                    activeDot={{ r: 4 }}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
            
            <div className="task-chart-footer">
              <div className="task-chart-info">
                <div className="task-chart-time-author">
                  <span className="task-chart-time">{task.updatedAt}</span>
                  <span className="task-by-text">by</span>
                  <Avatar size={14} src={task.updatedBy?.avatar} className="task-updater-avatar">
                    {task.updatedBy?.name.charAt(0)}
                  </Avatar>
                  <span className="task-updater-name">{task.updatedBy?.name}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 场景 Modal */}
      <Modal
        open={isSceneModalVisible}
        onCancel={handleModalClose}
        footer={null}
        width={800}
      >
        <SceneSection taskId={task.id} scenario={task.scenario} />
      </Modal>

      {/* QA Modal */}
      <Modal
        open={isQAModalVisible}
        onCancel={handleModalClose}
        footer={null}
        width={800}
      >
        <QASection taskId={task.id} prompt={task.prompt} response={task.response_summary} />
      </Modal>

      {/* 模板 Modal */}
      <Modal
        open={isTemplateModalVisible}
        onCancel={handleModalClose}
        footer={null}
        width={800}
      >
        <TemplateSection taskId={task.id} steps={task.templateData ? { templateData: task.templateData, ...task.step } : task.step} />
      </Modal>

      {/* Create Task Modal */}
      <CreateTaskModal visible={isCreateTaskModalVisible} onCancel={handleModalCancel} cardData={task} />
    </div>
  )
}

export default TaskCard
