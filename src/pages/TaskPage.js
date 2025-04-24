"use client"

import { useState, useEffect } from "react"
import { Spin, Empty, Button } from "antd"
import { FilterOutlined, GroupOutlined } from "@ant-design/icons"
import { useLocation } from "react-router-dom"
import TaskCard from "../components/card/TaskCard"
import taskService from "../services/taskService"
import FilterSystem from "../components/filter/FilterSystem"
import SortIcon from "../components/icons/SortIcon"
import { useChatContext } from "../contexts/ChatContext"
import { useNavContext } from "../contexts/NavContext"


const TaskPage = () => {
  const location = useLocation()
  // 修改初始化状态，确保tasks始终是一个数组
  const [tasks, setTasks] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const { isChatOpen } = useChatContext()
  // Add the NavContext to the component
  const { selectedNav } = useNavContext()

  // 获取当前活动的标签页
  const getActiveTab = () => {
    if (location.pathname === "/tasks/my") return "my"
    if (location.pathname === "/tasks/team") return "team"
    return "all"
  }

  // 获取页面标题
  const getPageTitle = () => {
    if (selectedNav === "personal") return "我的任务"
    if (selectedNav === "workspace") return "工作区任务"
    return "社区任务"
  }

  // 加载任务数据
  useEffect(() => {
    const fetchTasks = async () => {
      try {
        setLoading(true)
        // Use selectedNav instead of getActiveTab()
        const scope = selectedNav || "community"
        const data = await taskService.getTasks({ scope })
        setTasks(Array.isArray(data) ? data : [])
        setError(null)
      } catch (err) {
        console.error("获取任务数据失败:", err)
        setError("获取任务数据失败，请重试")
        setTasks([]) // 出错时设置为空数组
      } finally {
        setLoading(false)
      }
    }

    fetchTasks()
  }, [selectedNav, location.pathname])

  return (
    <div className={`task-page ${isChatOpen ? "chat-open" : "chat-closed"}`}>

      {loading ? (
        <div className="loading-container">
          <Spin size="large" />
        </div>
      ) : error ? (
        <div className="error-message">{error}</div>
      ) : (
        <div className="task-content">
       {/* 筛选工具栏 */}
 
       <div className="explore-toolbar">
        <FilterSystem />
      </div>


          {tasks && Array.isArray(tasks) && tasks.length === 0 && !loading ? (
            <Empty description={`暂无${getPageTitle()}`} />
          ) : (
            <div className="task-cards-container">
              {tasks &&
                Array.isArray(tasks) &&
                tasks.map((task) => (
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
