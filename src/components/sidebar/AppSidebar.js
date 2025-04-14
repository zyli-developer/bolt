"use client"

import { useState, useEffect } from "react"
import { Layout, Button, Avatar } from "antd"
import {
  SearchOutlined,
  FileOutlined,
  AppstoreOutlined,
  PlusOutlined,
  MoreOutlined,
  DownOutlined,
  ThunderboltOutlined,
  CaretDownOutlined,
  CaretRightOutlined,
} from "@ant-design/icons"
import { useNavigate, useLocation } from "react-router-dom"
import menuService from "../../services/menuService"

const { Sider } = Layout

const AppSidebar = () => {
  const navigate = useNavigate()
  const location = useLocation()
  const [isSearchActive, setIsSearchActive] = useState(false)
  const [expandedKeys, setExpandedKeys] = useState(["tasks"])
  const [menuItems, setMenuItems] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchMenuItems = async () => {
      try {
        setLoading(true)
        const data = await menuService.getMenuItems()
        setMenuItems(data)

        // 设置初始展开的菜单项
        const initialExpandedKeys = data.filter((item) => item.expanded).map((item) => item.id.toString())

        setExpandedKeys(initialExpandedKeys)
      } catch (error) {
        console.error("获取菜单数据失败:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchMenuItems()
  }, [])

  const toggleSearch = () => {
    setIsSearchActive(!isSearchActive)
  }

  // 获取当前选中的菜单项
  const getSelectedKeys = () => {
    const path = location.pathname
    if (path === "/" || path === "/explore") return ["explore"]
    if (path.startsWith("/tasks")) return ["tasks"]
    if (path.startsWith("/assets")) return ["assets"]
    return []
  }

  const onExpand = (key) => {
    if (expandedKeys.includes(key)) {
      setExpandedKeys(expandedKeys.filter((k) => k !== key))
    } else {
      setExpandedKeys([...expandedKeys, key])
    }
  }

  const getIconComponent = (iconName) => {
    switch (iconName) {
      case "SearchOutlined":
        return <SearchOutlined />
      case "FileOutlined":
        return <FileOutlined />
      case "AppstoreOutlined":
        return <AppstoreOutlined />
      default:
        return null
    }
  }

  const renderMenuItem = (item) => {
    const isExpanded = expandedKeys.includes(item.id.toString())
    const hasChildren = item.children && item.children.length > 0
    const isActive =
      location.pathname === item.path ||
      (item.path === "/explore" && location.pathname === "/") ||
      (location.pathname.startsWith(item.path) && item.path !== "/")

    const handleMenuItemClick = () => {
      // 如果有子菜单，则切换展开状态
      if (hasChildren) {
        onExpand(item.id.toString())
      }
      // 无论如何都导航到对应路径
      navigate(item.path)
    }

    return (
      <div key={item.id} className="custom-menu-item">
        <div className={`menu-item ${isActive ? "active" : ""}`} onClick={handleMenuItemClick}>
          <div className="menu-item-content">
            {item.icon && <span className="menu-item-icon">{getIconComponent(item.icon)}</span>}
            <span className="menu-item-title">{item.title}</span>
            {hasChildren && (
              <span className="menu-item-expand-icon">
                {isExpanded ? <CaretDownOutlined /> : <CaretRightOutlined />}
              </span>
            )}
          </div>
          <div className="menu-item-actions">
            {hasChildren ? (
              <Button
                type="text"
                size="small"
                icon={<PlusOutlined />}
                onClick={(e) => e.stopPropagation()}
                className="action-icon plus-icon"
              />
            ) : (
              <Button
                type="text"
                size="small"
                icon={<MoreOutlined />}
                onClick={(e) => e.stopPropagation()}
                className="action-icon more-icon"
              />
            )}
          </div>
        </div>

        {hasChildren && isExpanded && (
          <div className="submenu">{item.children.map((child) => renderMenuItem(child))}</div>
        )}
      </div>
    )
  }

  return (
    <Sider width={228} className="app-sidebar">
      {/* Logo区域 */}
      <div className="sidebar-logo">
        <div className="logo-icon">
          <ThunderboltOutlined />
        </div>
        <div className="logo-text-container">
          <div className="logo-text">可信</div>
          <div className="logo-domain">syntrusthub.agentour.app</div>
        </div>
      </div>

      {/* 工作区标题和搜索 */}
      <div className="workspace-header">
        <div className="workspace-title-container">
          <Avatar size={16} className="workspace-avatar">
            A
          </Avatar>
          <h3 className="workspace-title">Alibaba</h3>
          <DownOutlined className="workspace-dropdown-icon" />
        </div>
        <Button type="text" icon={<SearchOutlined />} onClick={toggleSearch} size="small" />
      </div>

      {/* 菜单项区域 - 使用flex-1确保它填充剩余空间 */}
      <div className="sidebar-menu-container">
        {loading ? (
          <div style={{ padding: "16px", textAlign: "center" }}>加载中...</div>
        ) : (
          menuItems.map(renderMenuItem)
        )}
      </div>

      {/* 个人信息区域 - 固定在底部 */}
      <div className="user-info-container">
        <div className="user-info">
          <div className="user-avatar-container">
            <Avatar className="user-avatar" size={36}>
              J
            </Avatar>
          </div>
          <div className="user-details">
            <div className="user-name">Jackson</div>
            <div className="user-email">Jcson@yahoo.com</div>
          </div>
          <Button type="text" icon={<MoreOutlined />} className="user-more-btn" />
        </div>
      </div>
    </Sider>
  )
}

export default AppSidebar
