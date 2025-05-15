"use client"

import { useState, useEffect } from "react"
import { Avatar, Button, Popover, Switch, Divider, Tag } from "antd"
import {
  MoreOutlined,
  CreditCardOutlined,
  UserOutlined,
  GiftOutlined,
  MoonOutlined,
  SettingOutlined,
  FileTextOutlined,
  CustomerServiceOutlined,
  LogoutOutlined,
  RightOutlined,
  CheckOutlined,
} from "@ant-design/icons"
import userService from "../../services/userService"
import DiamondIcon from "../icons/DiamondIcon"
import CommandIcon from "../icons/CommandIcon"
import ShiftIcon from "../icons/ShiftIcon"
import workspaceService from "../../services/workspaceService"

const UserInfoArea = ({ isCollapsed }) => {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [userPopoverVisible, setUserPopoverVisible] = useState(false)
  const [workspacePopoverVisible, setWorkspacePopoverVisible] = useState(false)
  const [darkMode, setDarkMode] = useState(false)
  const [workspaces, setWorkspaces] = useState([])
  const [workspacesLoading, setWorkspacesLoading] = useState(true)

  useEffect(() => {
    const fetchCurrentUser = async () => {
      try {
        setLoading(true)
        const userData = await userService.getCurrentUser()
        setUser(userData)
      } catch (error) {
        console.error("获取用户信息失败:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchCurrentUser()

    // Add keyboard shortcut listener for logout
    const handleKeyDown = (event) => {
      // Check for Cmd+Shift+Q (Mac) or Ctrl+Shift+Q (Windows/Linux)
      if ((event.metaKey || event.ctrlKey) && event.shiftKey && event.key === "q") {
        handleLogout()
      }
    }

    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [])

  useEffect(() => {
    const fetchWorkspaces = async () => {
      try {
        setWorkspacesLoading(true)
        const workspacesData = await workspaceService.getWorkspaces()
        setWorkspaces(workspacesData)
      } catch (error) {
        console.error("获取工作区列表失败:", error)
      } finally {
        setWorkspacesLoading(false)
      }
    }

    fetchWorkspaces()
  }, [])

  const handleLogout = () => {
    console.log("Logging out...")
    // Implement logout functionality
  }

  const handleDarkModeToggle = (checked) => {
    setDarkMode(checked)
    // Implement dark mode toggle functionality
  }

  const handleWorkspaceChange = async (workspaceId) => {
    try {
      await workspaceService.switchWorkspace(workspaceId)
      // 刷新页面以应用新的工作区
      window.location.reload()
    } catch (error) {
      console.error(`切换工作区失败 (ID: ${workspaceId}):`, error)
    }
    setWorkspacePopoverVisible(false)
  }

  // User profile popover content
  const userPopoverContent = (
    <div className="user-popover-content">
      {/* User header */}
      <div className="user-popover-header">
        <div className="user-popover-profile">
          <Avatar size={48} className="user-popover-avatar">
            {user && user.name ? user.name.charAt(0) : 'U'}
          </Avatar>
          <div className="user-popover-info">
            <div className="user-popover-name">{user ? user.name : '未知用户'}</div>
            <div className="user-popover-email">{user ? user.email : ''}</div>
          </div>
        </div>
        <div className="user-popover-badge">
          <Avatar size={24} style={{ backgroundColor: "#f0f0f0", color: "#000" }}>
            <DiamondIcon style={{ fontSize: "14px" }} />
          </Avatar>
        </div>
      </div>

      <Divider style={{ margin: "12px 0" }} />

      {/* Menu items */}
      <div className="user-popover-menu">
        <div className="user-popover-item">
          <div className="user-popover-item-content">
            <CreditCardOutlined className="user-popover-item-icon" />
            <span className="user-popover-item-text">个人版本</span>
          </div>
          <Button size="small" type="primary" className="user-popover-upgrade-btn">
            立即升级
          </Button>
        </div>

        <div className="user-popover-item">
          <div className="user-popover-item-content">
            <UserOutlined className="user-popover-item-icon" />
            <span className="user-popover-item-text">个人信息</span>
          </div>
          <Tag color="success" className="user-popover-tag">
            完善信息得奖励
          </Tag>
        </div>

        <div className="user-popover-item">
          <div className="user-popover-item-content">
            <GiftOutlined className="user-popover-item-icon" />
            <span className="user-popover-item-text">获取免费token</span>
            <Tag color="error" className="user-popover-hot-tag">
              HOT
            </Tag>
          </div>
          <RightOutlined className="user-popover-arrow" />
        </div>

        <div className="user-popover-item">
          <div className="user-popover-item-content">
            <MoonOutlined className="user-popover-item-icon" />
            <span className="user-popover-item-text">深色模式</span>
          </div>
          <Switch size="small" checked={darkMode} onChange={handleDarkModeToggle} />
        </div>

        <div className="user-popover-item">
          <div className="user-popover-item-content">
            <SettingOutlined className="user-popover-item-icon" />
            <span className="user-popover-item-text">设置</span>
          </div>
        </div>

        <div className="user-popover-item">
          <div className="user-popover-item-content">
            <FileTextOutlined className="user-popover-item-icon" />
            <span className="user-popover-item-text">帮助文档</span>
          </div>
        </div>

        <div className="user-popover-item">
          <div className="user-popover-item-content">
            <CustomerServiceOutlined className="user-popover-item-icon" />
            <span className="user-popover-item-text">客服中心</span>
          </div>
        </div>
      </div>

      <Divider style={{ margin: "12px 0" }} />

      {/* Logout */}
      <div className="user-popover-item" onClick={handleLogout}>
        <div className="user-popover-item-content">
          <LogoutOutlined className="user-popover-item-icon" />
          <span className="user-popover-item-text">Log out</span>
        </div>
        <div className="user-popover-shortcut">
          <CommandIcon style={{ fontSize: "12px" }} />
          <ShiftIcon style={{ fontSize: "12px" }} />
          <span>Q</span>
        </div>
      </div>
    </div>
  )

  // Workspace popover content
  const workspacePopoverContent = (
    <div className="workspace-popover-content">
      <div className="workspace-popover-title">切换工作区</div>
      <div className="workspace-list">
        {workspacesLoading ? (
          <div style={{ padding: "16px", textAlign: "center" }}>加载中...</div>
        ) : workspaces.length === 0 ? (
          <div style={{ padding: "16px", textAlign: "center" }}>暂无工作区</div>
        ) : (
          workspaces.map((workspace) => (
            <div
              key={workspace.id}
              className={`workspace-item ${workspace.current ? "workspace-item-current" : ""}`}
              onClick={() => handleWorkspaceChange(workspace.id)}
            >
              <div className="workspace-item-info">
                <Avatar size={32} className="workspace-avatar">
                  {workspace.icon || (workspace.name ? workspace.name.charAt(0) : 'W')}
                </Avatar>
                <div className="workspace-details">
                  <div className="workspace-name">{workspace.name || '未命名工作区'}</div>
                  <div className="workspace-role">{workspace.role || '成员'}</div>
                </div>
              </div>
              {workspace.current && <CheckOutlined className="workspace-current-icon" />}
            </div>
          ))
        )}
      </div>
      <div className="workspace-add-new">
        <Button type="dashed" block icon={<span>+</span>}>
          创建新工作区
        </Button>
      </div>
    </div>
  )

  if (loading) {
    return (
      <div className={`user-info-container ${isCollapsed ? "collapsed" : ""}`}>
        <div className="user-info">
          <div>加载中...</div>
        </div>
      </div>
    )
  }

  if (!user) {
    return (
      <div className={`user-info-container ${isCollapsed ? "collapsed" : ""}`}>
        <div className="user-info">
          <div>未登录</div>
        </div>
      </div>
    )
  }

  return (
    <div className={`user-info-container ${isCollapsed ? "collapsed" : ""}`}>
      <div className={`user-info ${isCollapsed ? "collapsed" : ""}`}>
        <Popover
          content={userPopoverContent}
          trigger="click"
          open={userPopoverVisible}
          onOpenChange={setUserPopoverVisible}
          placement="topRight"
          overlayClassName="user-profile-popover"
          getPopupContainer={() => document.body}
          autoAdjustOverflow={true}
        >
          <div className="user-profile-trigger" onClick={() => setUserPopoverVisible(true)}>
            <div className={`user-avatar-container ${isCollapsed ? "collapsed" : ""}`}>
              <Avatar className="user-avatar" size={36}>
                {user && user.name ? user.name.charAt(0) : 'U'}
              </Avatar>
            </div>
            {!isCollapsed && (
              <div className="user-details">
                <div className="user-name">{user ? user.name : '未知用户'}</div>
                <div className="user-email">{user ? user.email : ''}</div>
              </div>
            )}
          </div>
        </Popover>

        {!isCollapsed && (
          <Popover
            content={workspacePopoverContent}
            trigger="click"
            open={workspacePopoverVisible}
            onOpenChange={setWorkspacePopoverVisible}
            placement="topRight"
            overlayClassName="workspace-popover"
            getPopupContainer={() => document.body}
            autoAdjustOverflow={true}
          >
            <Button
              type="text"
              icon={<MoreOutlined />}
              className="user-more-btn"
              onClick={(e) => {
                e.stopPropagation()
                setWorkspacePopoverVisible(true)
              }}
            />
          </Popover>
        )}
      </div>
    </div>
  )
}

export default UserInfoArea
