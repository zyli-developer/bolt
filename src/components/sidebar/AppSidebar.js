"use client"

import { useState } from "react"
import { Layout, Input, Button } from "antd"
import {
  HomeOutlined,
  FileOutlined,
  TeamOutlined,
  AppstoreOutlined,
  SearchOutlined,
  CloseOutlined,
  PlusOutlined,
  MinusOutlined,
  DownOutlined,
  RightOutlined,
} from "@ant-design/icons"
import { useNavigate, useLocation } from "react-router-dom"
import UserInfo from "./UserInfo"

const { Sider } = Layout

const AppSidebar = () => {
  const navigate = useNavigate()
  const location = useLocation()
  const [isSearchActive, setIsSearchActive] = useState(false)
  const [expandedKeys, setExpandedKeys] = useState(["tasks"])

  const toggleSearch = () => {
    setIsSearchActive(!isSearchActive)
  }

  // 获取当前选中的菜单项
  const getSelectedKeys = () => {
    const path = location.pathname
    if (path === "/") return ["home"]
    if (path.startsWith("/tasks")) return ["tasks"]
    if (path.startsWith("/contacts")) return ["contacts"]
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

  const renderMenuItem = (item) => {
    const isExpanded = expandedKeys.includes(item.key)
    const hasChildren = item.children && item.children.length > 0
    const isParent = item.level === 0
    const isChild = item.level > 0

    return (
      <div key={item.key} className="custom-menu-item">
        <div
          className={`menu-item ${location.pathname === item.path ? "active" : ""}`}
          onClick={() => navigate(item.path)}
        >
          <div className="menu-item-content">
            {item.icon}
            <span>{item.label}</span>
          </div>
          <div className="menu-item-actions">
            {hasChildren && (
              <Button
                type="text"
                size="small"
                icon={isExpanded ? <DownOutlined /> : <RightOutlined />}
                onClick={(e) => {
                  e.stopPropagation()
                  onExpand(item.key)
                }}
                className="expand-icon"
              />
            )}
            {isParent && <Button type="text" size="small" icon={<PlusOutlined />} className="action-icon add-icon" />}
            {isChild && (
              <Button type="text" size="small" icon={<MinusOutlined />} className="action-icon remove-icon" />
            )}
          </div>
        </div>

        {hasChildren && isExpanded && (
          <div className="submenu">
            {item.children.map((child) => renderMenuItem({ ...child, level: (item.level || 0) + 1 }))}
          </div>
        )}
      </div>
    )
  }

  const menuItems = [
    {
      key: "home",
      label: "主页",
      path: "/",
      icon: <HomeOutlined />,
      level: 0,
    },
    {
      key: "tasks",
      label: "任务",
      path: "/tasks",
      icon: <FileOutlined />,
      level: 0,
      children: [
        {
          key: "tasks-my",
          label: "我的任务",
          path: "/tasks/my",
          level: 1,
        },
        {
          key: "tasks-team",
          label: "团队任务",
          path: "/tasks/team",
          level: 1,
        },
      ],
    },
    {
      key: "contacts",
      label: "联系人",
      path: "/contacts",
      icon: <TeamOutlined />,
      level: 0,
      children: [
        {
          key: "contacts-jackson",
          label: "Jackson",
          path: "/contacts/jackson",
          level: 1,
        },
        {
          key: "contacts-finance",
          label: "财务部",
          path: "/contacts/finance",
          level: 1,
        },
      ],
    },
    {
      key: "assets",
      label: "资产",
      path: "/assets",
      icon: <AppstoreOutlined />,
      level: 0,
      children: [
        {
          key: "assets-templates",
          label: "模板",
          path: "/assets/templates",
          level: 1,
        },
        {
          key: "assets-scenes",
          label: "场景",
          path: "/assets/scenes",
          level: 1,
        },
      ],
    },
  ]

  return (
    <Sider
      width={180}
      style={{
        background: "#fff",
        borderRight: "1px solid #c5c6cc",
        height: "100%",
        position: "relative", // 添加相对定位
        display: "flex",
        flexDirection: "column",
      }}
    >
      {/* 1. 菜单标题区域 - 固定高度 */}
      <div className="workspace-header">
        {!isSearchActive ? (
          <>
            <h3 className="workspace-title">Alibaba</h3>
            <Button type="text" icon={<SearchOutlined />} onClick={toggleSearch} size="small" />
          </>
        ) : (
          <div style={{ display: "flex", width: "100%" }}>
            <Input placeholder="搜索..." autoFocus style={{ flex: 1 }} size="small" />
            <Button type="text" icon={<CloseOutlined />} onClick={toggleSearch} size="small" />
          </div>
        )}
      </div>

      {/* 2. 菜单项区域 - 占用所有剩余高度，但不包括底部用户信息的高度 */}
      <div className="sidebar-menu-container" style={{ paddingBottom: "64px" }}>
        {menuItems.map(renderMenuItem)}
      </div>

      {/* 3. 个人信息区域 - 固定在底部 */}
      <div style={{ position: "absolute", bottom: 0, left: 0, right: 0 }}>
        <UserInfo />
      </div>
    </Sider>
  )
}

export default AppSidebar
