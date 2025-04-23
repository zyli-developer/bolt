"use client"

import { useState, useEffect } from "react"
import { Layout, Button, Avatar } from "antd"
import { SearchOutlined, FileOutlined, AppstoreOutlined, ThunderboltOutlined } from "@ant-design/icons"
import { useNavigate, useLocation } from "react-router-dom"
import menuService from "../../services/menuService"
import ExploreIcon from "../icons/ExploreIcon"
import TaskIcon from "../icons/TaskIcon"
import UserInfoArea from "./UserInfoArea"
import workspaceService from "../../services/workspaceService"

const { Sider } = Layout

const AppSidebar = () => {
  const navigate = useNavigate()
  const location = useLocation()
  const [menuItems, setMenuItems] = useState([])
  const [loading, setLoading] = useState(true)
  const [currentWorkspace, setCurrentWorkspace] = useState(null)
  const [workspaceLoading, setWorkspaceLoading] = useState(true)
  // Add a new state for sidebar collapse
  const [isCollapsed, setIsCollapsed] = useState(false)

  useEffect(() => {
    const fetchMenuItems = async () => {
      try {
        setLoading(true)
        const data = await menuService.getMenuItems()
        setMenuItems(data)
      } catch (error) {
        console.error("获取菜单数据失败:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchMenuItems()
  }, [])

  useEffect(() => {
    const fetchCurrentWorkspace = async () => {
      try {
        setWorkspaceLoading(true)
        const data = await workspaceService.getCurrentWorkspace()
        setCurrentWorkspace(data)
      } catch (error) {
        console.error("获取当前工作区失败:", error)
      } finally {
        setWorkspaceLoading(false)
      }
    }

    fetchCurrentWorkspace()
  }, [])

  // Add a function to detect if we're on a detail page
  useEffect(() => {
    // Check if the current path includes 'detail' to determine if we're on a detail page
    const isDetailPage = location.pathname.includes("/detail")
    setIsCollapsed(isDetailPage)
  }, [location.pathname])

  const getIconComponent = (iconName) => {
    switch (iconName) {
      case "SearchOutlined":
        return <SearchOutlined />
      case "FileOutlined":
        return <FileOutlined />
      case "AppstoreOutlined":
        return <AppstoreOutlined />
      case "ExploreIcon":
        return <ExploreIcon />
      case "TaskIcon":
        return <TaskIcon />
      default:
        return null
    }
  }

  const handleMenuItemClick = (e, item) => {
    e.preventDefault()
    // For all items, navigate directly to their path
    navigate(item.path)
  }

  const renderMenuItem = (item) => {
    // 修改激活逻辑：只有当前路径完全匹配菜单项路径时才激活
    // 对于根路径和/explore特殊处理
    const isActive = location.pathname === item.path || (item.path === "/explore" && location.pathname === "/")

    return (
      <div key={item.id} className="custom-menu-item">
        <div
          className={`menu-item ${isActive ? "active" : ""} ${isCollapsed ? "collapsed" : ""}`}
          onClick={(e) => handleMenuItemClick(e, item)}
        >
          <div className="menu-item-content">
            {item.icon && <span className="menu-item-icon">{getIconComponent(item.icon)}</span>}
            {!isCollapsed && <span className="menu-item-title">{item.title}</span>}
          </div>
        </div>
      </div>
    )
  }

  return (
    // Modify the Sider component to use the collapsed state with correct width
    <Sider
      width={isCollapsed ? 48 : 228}
      collapsed={isCollapsed}
      className={`app-sidebar ${isCollapsed ? "collapsed" : ""}`}
      collapsedWidth={48}
    >
      {/* Logo区域 */}
      <div className={`sidebar-logo ${isCollapsed ? "collapsed" : ""}`}>
        <div className="logo-icon">
          <ThunderboltOutlined />
        </div>
        {!isCollapsed && (
          <div className="logo-text-container">
            <div className="logo-text">可信</div>
            <div className="logo-domain">syntrusthub.agentour.app</div>
          </div>
        )}
      </div>

      {/* 搜索图标 - 在收起状态下只显示搜索图标 */}
      {isCollapsed && (
        <div className="search-icon-container">
          <Button type="text" icon={<SearchOutlined />} className="search-icon-button" />
        </div>
      )}

      {/* 工作区标题和搜索 - 在展开状态下显示 */}
      {!isCollapsed && (
        <div className="workspace-header">
          <div className="workspace-title-container">
            {workspaceLoading ? (
              <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                <div style={{ width: "16px", height: "16px", backgroundColor: "#f0f0f0", borderRadius: "50%" }}></div>
                <div style={{ width: "60px", height: "14px", backgroundColor: "#f0f0f0", borderRadius: "4px" }}></div>
              </div>
            ) : (
              <>
                <Avatar size={16} className="workspace-avatar">
                  {currentWorkspace?.icon || currentWorkspace?.name?.charAt(0)}
                </Avatar>
                <h3 className="workspace-title">{currentWorkspace?.name || "未知工作区"}</h3>
              </>
            )}
          </div>
          <Button type="text" icon={<SearchOutlined />} size="small" />
        </div>
      )}

      {/* 菜单项区域 */}
      <div className={`sidebar-menu-container ${isCollapsed ? "collapsed" : ""}`}>
        {loading ? (
          <div style={{ padding: "16px", textAlign: "center" }}>加载中...</div>
        ) : (
          menuItems.map(renderMenuItem)
        )}
      </div>

      {/* 个人信息区域 - 固定在底部 */}
      <UserInfoArea isCollapsed={isCollapsed} />
    </Sider>
  )
}

export default AppSidebar
