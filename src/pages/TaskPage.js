"use client"

import { useState, useEffect } from "react"
import { Typography, Space, Spin, Empty, Button } from "antd"
import { FileOutlined, FilterOutlined, GroupOutlined } from "@ant-design/icons"
import { useLocation } from "react-router-dom"
import TaskCard from "../components/card/TaskCard"
import taskService from "../services/taskService"
import SortIcon from "../components/icons/SortIcon"
import { useChatContext } from "../contexts/ChatContext"

const { Title } = Typography

const TaskPage = () => {
  const location = useLocation()
  const [tasks, setTasks] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const { isChatOpen } = useChatContext()

  // 获取当前活动的标签页
  const getActiveTab = () => {
    if (location.pathname === "/tasks/my") return "my"
    if (location.pathname === "/tasks/team") return "team"
    return "all"
  }

  // 获取页面标题
  const getPageTitle = () => {
    if (location.pathname === "/tasks/my") return "我的任务"
    if (location.pathname === "/tasks/team") return "团队任务"
    return "所有任务"
  }

  // 加载任务数据
  useEffect(() => {
    const fetchTasks = async () => {
      try {
        setLoading(true)
        const activeTab = getActiveTab()
        const data = await taskService.getTasks({ type: activeTab })
        setTasks(data)
        setError(null)
      } catch (err) {
        console.error("获取任务数据失败:", err)
        setError("获取任务数据失败，请重试")
      } finally {
        setLoading(false)
      }
    }

    fetchTasks()
  }, [location.pathname])

  return (
    <div className={`task-page ${isChatOpen ? "chat-open" : "chat-closed"}`}>
      <div className="task-page-header">
        <Title level={2} className="task-page-title">
          <Space>
            <FileOutlined />
            {getPageTitle()}
          </Space>
        </Title>
      </div>

      {loading ? (
        <div className="loading-container">
          <Spin size="large" />
        </div>
      ) : error ? (
        <div className="error-message">{error}</div>
      ) : (
        <div className="task-content">
          {/* 筛选工具栏 */}
          <div className="task-toolbar">
            <div className="toolbar-left">
              <Button icon={<FilterOutlined />} className="filter-button">
                Filter <span className="filter-count">2</span>
              </Button>
            </div>
            <div className="toolbar-right">
              <Button icon={<GroupOutlined />} className="group-button">
                Group <span className="group-count">2</span>
              </Button>
              <Button icon={<SortIcon />} className="sort-button">
                Sort
              </Button>
            </div>
          </div>

          {tasks.length === 0 ? (
            <Empty description={`暂无${getPageTitle()}`} />
          ) : (
            <div className="task-cards-container">
              {tasks.map((task) => (
                <div key={task.id} className="task-card-wrapper">
                  <TaskCard task={task} />
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  )
}

export default TaskPage
