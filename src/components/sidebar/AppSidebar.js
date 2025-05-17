"use client"

import { useState, useEffect } from "react"
import { Layout, Button, Avatar, Dropdown, Modal, Input, message } from "antd"
import { SearchOutlined, FileOutlined, AppstoreOutlined, ThunderboltOutlined, DownOutlined, RightOutlined, EllipsisOutlined, EditOutlined, DeleteOutlined } from "@ant-design/icons"
import { useNavigate, useLocation } from "react-router-dom"
import menuService from "../../services/menuService"
import ExploreIcon from "../icons/ExploreIcon"
import TaskIcon from "../icons/TaskIcon"
import UserInfoArea from "./UserInfoArea"
import workspaceService from "../../services/workspaceService"
import { getMenuData, getSavedViewData, saveMenuData, registerMenuChangeListener, unregisterMenuChangeListener } from "../../utils/menuManager"
import "./sidebar-styles.css"

const { Sider } = Layout

const AppSidebar = () => {
  const navigate = useNavigate()
  const location = useLocation()
  const [menuItems, setMenuItems] = useState([])
  const [loading, setLoading] = useState(true)
  const [currentWorkspace, setCurrentWorkspace] = useState(null)
  const [workspaceLoading, setWorkspaceLoading] = useState(true)
  // 添加折叠状态
  const [isCollapsed, setIsCollapsed] = useState(false)
  // 添加手动展开/折叠状态
  const [expandedItems, setExpandedItems] = useState({});
  // 当前激活的菜单项ID
  const [activeItemId, setActiveItemId] = useState(null);
  // 当前激活的子菜单项ID
  const [activeSubItemId, setActiveSubItemId] = useState(null);
  // 重命名相关状态
  const [renameModalVisible, setRenameModalVisible] = useState(false);
  const [currentRenameItem, setCurrentRenameItem] = useState(null);
  const [newMenuName, setNewMenuName] = useState("");
  
  // 删除相关状态
  const [deleteModalVisible, setDeleteModalVisible] = useState(false);
  const [itemToDelete, setItemToDelete] = useState(null);

  // 加载菜单数据的函数
  const loadMenuData = async () => {
    try {
      setLoading(true)
      
      // 先从本地存储加载自定义菜单
      const customMenuData = getMenuData();
      
      if (customMenuData) {
        setMenuItems(customMenuData);
        
        // 初始化展开状态 - 有子菜单的项默认不展开
        const initialExpandState = {};
        customMenuData.forEach(item => {
          if (item.children && item.children.length > 0) {
            initialExpandState[item.id] = false;
          }
        });
        setExpandedItems(initialExpandState);
        
        // 根据当前路径设置初始激活状态
        initializeActiveState(customMenuData);
      } else {
        // 如果没有自定义菜单，则从API加载默认菜单
        const data = await menuService.getMenuItems()
        setMenuItems(data)
        
        // 根据当前路径设置初始激活状态
        initializeActiveState(data);
      }
    } catch (error) {
      console.error("获取菜单数据失败:", error)
      
      // 出错时尝试从API加载默认菜单
      try {
        const data = await menuService.getMenuItems()
        setMenuItems(data)
        
        // 根据当前路径设置初始激活状态
        initializeActiveState(data);
      } catch (err) {
        console.error("无法加载默认菜单:", err)
      }
    } finally {
      setLoading(false)
    }
  }

  // 初始加载时获取菜单数据
  useEffect(() => {
    loadMenuData();
  }, [])
  
  // 添加菜单变更监听器
  useEffect(() => {
    // 监听菜单变化的处理函数
    const handleMenuChange = () => {
      console.log("检测到菜单变化，重新加载菜单数据");
      loadMenuData();
    };
    
    // 注册菜单变化监听器
    registerMenuChangeListener(handleMenuChange);
    
    // 组件卸载时移除监听器
    return () => {
      unregisterMenuChangeListener(handleMenuChange);
    };
  }, []);
  
  // 根据当前路径初始化激活状态
  const initializeActiveState = (items) => {
    if (!items || items.length === 0) return;
    
    // 查找匹配当前路径的菜单项
    let foundActiveItem = false;
    
    // 首先检查子菜单项
    for (const item of items) {
      if (item.children && item.children.length > 0) {
        for (const child of item.children) {
          // 如果location.state中有viewId，检查是否匹配
          if (location.state?.viewId && child.viewId === location.state.viewId) {
            setActiveItemId(item.id);
            setActiveSubItemId(child.id);
            setExpandedItems(prev => ({ ...prev, [item.id]: true }));
            foundActiveItem = true;
            break;
          }
          // 否则检查路径是否匹配
          else if (location.pathname === child.path) {
            setActiveItemId(item.id);
            setActiveSubItemId(child.id);
            setExpandedItems(prev => ({ ...prev, [item.id]: true }));
            foundActiveItem = true;
            break;
          }
        }
        if (foundActiveItem) break;
      }
    }
    
    // 如果没有找到匹配的子菜单项，检查一级菜单项
    if (!foundActiveItem) {
      for (const item of items) {
        // 对于/explore路径，特殊处理
        if ((item.path === "/explore" && location.pathname === "/") || location.pathname === item.path) {
          setActiveItemId(item.id);
          setActiveSubItemId(null);
          foundActiveItem = true;
          break;
        }
      }
    }
    
    // 如果仍未找到匹配项，使用默认逻辑
    if (!foundActiveItem) {
      // 默认激活第一个菜单项
      if (items.length > 0) {
        setActiveItemId(items[0].id);
      }
    }
  };

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

  // 检测是否在详情页，自动折叠侧边栏
  useEffect(() => {
    const isDetailPage = location.pathname.includes("/detail")
    setIsCollapsed(isDetailPage)
    
    // 如果在一级路径上且带有视图ID，自动展开对应的菜单项
    if ((location.pathname === '/explore' || location.pathname === '/tasks') && location.state?.viewId) {
      // 查找拥有该视图ID子项的父菜单
      menuItems.forEach(item => {
        if (item.children && item.children.some(child => child.viewId === location.state.viewId)) {
          setExpandedItems(prev => ({ ...prev, [item.id]: true }));
          
          // 设置激活状态
          setActiveItemId(item.id);
          
          // 设置激活的子菜单项
          const activeChild = item.children.find(child => child.viewId === location.state.viewId);
          if (activeChild) {
            setActiveSubItemId(activeChild.id);
          }
        }
      });
    }
  }, [location.pathname, location.state, menuItems])

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

  // 切换菜单项的展开/折叠状态
  const toggleExpand = (e, itemId) => {
    e.stopPropagation(); // 阻止事件冒泡，不触发菜单项点击
    setExpandedItems(prev => ({ 
      ...prev, 
      [itemId]: !prev[itemId] 
    }));
  };

  // 处理菜单项点击事件
  const handleMenuItemClick = (e, item) => {
    e.preventDefault()
    
    // 如果点击的是子菜单项（视图），只设置子菜单项为激活状态
    if (item.viewId) {
      setActiveSubItemId(item.id);
      // 不设置一级菜单为激活状态
    } else {
      // 如果点击的是主菜单项，设置主菜单项为激活状态并清除子菜单激活状态
      setActiveItemId(item.id);
      setActiveSubItemId(null);
    }
    
    // 处理视图菜单项
    if (item.isView && item.viewId) {
      // 获取视图数据
      const viewData = getSavedViewData(item.viewId);
      
      if (viewData) {
        // 深拷贝视图数据以确保不会有引用问题
        const viewDataCopy = JSON.parse(JSON.stringify(viewData));
        
        console.log("应用视图数据:", viewDataCopy);
        
        // 验证视图数据中的筛选条件
        if (!viewDataCopy.filterParams) {
          viewDataCopy.filterParams = null;
        } else if (Array.isArray(viewDataCopy.filterParams)) {
          // 确保所有的筛选条件都有正确格式
          const validFilters = viewDataCopy.filterParams.filter(filter => 
            filter && filter.exprs && Array.isArray(filter.exprs) && filter.exprs.length > 0
          );
          
          viewDataCopy.filterParams = validFilters.length > 0 ? validFilters : null;
        } else if (viewDataCopy.filterParams.exprs) {
          // 确保单个筛选条件有正确的exprs数组
          if (!Array.isArray(viewDataCopy.filterParams.exprs) || viewDataCopy.filterParams.exprs.length === 0) {
            viewDataCopy.filterParams = null;
          }
        } else {
          // 无效的筛选条件格式
          viewDataCopy.filterParams = null;
        }
        
        // 验证视图数据中的排序条件
        if (!viewDataCopy.sortParams || typeof viewDataCopy.sortParams !== 'object' || !viewDataCopy.sortParams.field) {
          viewDataCopy.sortParams = null;
        }
        
        console.log("处理后的视图数据:", viewDataCopy);
        
        // 设置视图数据到localStorage，以便页面组件加载时使用
        localStorage.setItem('current_view_data', JSON.stringify(viewDataCopy));
        
        // 跳转到主路径
        navigate(item.path, { 
          state: { 
            viewId: item.viewId,
            applyViewFilters: true,
            filterParams: viewDataCopy.filterParams,
            sortParams: viewDataCopy.sortParams
          } 
        });
        
        return;
      }
    }
    
    // 对于普通菜单项（一级菜单），清空筛选条件
    navigate(item.path, {
      state: {
        clearFilters: true  // 添加标志，指示页面组件清空筛选条件
      }
    });
  }

  // 处理菜单项重命名
  const handleRenameClick = (e, item, parentId) => {
    // 在Ant Design的Dropdown菜单项点击事件中，e是{key, keyPath, domEvent}
    // 如果e有domEvent属性，则使用它，否则直接使用e
    if (e && e.domEvent && e.domEvent.stopPropagation) {
      e.domEvent.stopPropagation();
    } else if (e && e.stopPropagation) {
      e.stopPropagation(); // 原始事件对象直接使用
    }
    
    setCurrentRenameItem({...item, parentId});
    setNewMenuName(item.title);
    setRenameModalVisible(true);
  };

  // 处理重命名确认
  const handleRenameConfirm = () => {
    if (!newMenuName.trim()) {
      message.error("菜单名称不能为空");
      return;
    }

    // 更新菜单数据
    const updatedMenuItems = menuItems.map(item => {
      if (item.id === currentRenameItem.parentId) {
        return {
          ...item,
          children: item.children.map(child => 
            child.id === currentRenameItem.id 
              ? {...child, title: newMenuName} 
              : child
          )
        };
      }
      return item;
    });

    setMenuItems(updatedMenuItems);
    
    // 保存更新后的菜单数据
    saveMenuData(updatedMenuItems);
    
    message.success("重命名成功");
    setRenameModalVisible(false);
  };

  // 处理重命名取消
  const handleRenameCancel = () => {
    setRenameModalVisible(false);
  };
  
  // 处理菜单项删除点击
  const handleDeleteClick = (e, item, parentId) => {
    // 在Ant Design的Dropdown菜单项点击事件中，e是{key, keyPath, domEvent}
    // 如果e有domEvent属性，则使用它，否则直接使用e
    if (e && e.domEvent && e.domEvent.stopPropagation) {
      e.domEvent.stopPropagation();
    } else if (e && e.stopPropagation) {
      e.stopPropagation(); // 原始事件对象直接使用
    }
    
    setItemToDelete({...item, parentId});
    setDeleteModalVisible(true);
  };
  
  // 处理删除确认
  const handleDeleteConfirm = () => {
    if (!itemToDelete) return;
    
    // 更新菜单数据，过滤掉要删除的子菜单项
    const updatedMenuItems = menuItems.map(item => {
      if (item.id === itemToDelete.parentId) {
        return {
          ...item,
          children: item.children.filter(child => child.id !== itemToDelete.id)
        };
      }
      return item;
    });
    
    setMenuItems(updatedMenuItems);
    
    // 保存更新后的菜单数据
    saveMenuData(updatedMenuItems);
    
    message.success("删除成功");
    setDeleteModalVisible(false);
    
    // 如果删除的是当前激活的子菜单项，清除激活状态
    if (activeSubItemId === itemToDelete.id) {
      setActiveSubItemId(null);
    }
  };
  
  // 处理删除取消
  const handleDeleteCancel = () => {
    setDeleteModalVisible(false);
  };

  // 渲染子菜单项
  const renderSubMenuItems = (children, parentId) => {
    if (!children || children.length === 0) return null;
    
    return (
      <div className="submenu-container">
        {children.map(child => (
          <div
            key={child.id}
            className={`submenu-item ${activeSubItemId === child.id ? "active" : ""}`}
          >
            <div 
              className="submenu-item-content" 
              onClick={(e) => handleMenuItemClick(e, child)}
            >
              <span className="submenu-item-icon">
                {child.icon && getIconComponent(child.icon)}
              </span>
              <span className="submenu-item-title">{child.title}</span>
            </div>
            
            <Dropdown
              menu={{ 
                items: [
                  {
                    key: 'rename',
                    icon: <EditOutlined />,
                    label: '重命名',
                    onClick: (info) => handleRenameClick(info, child, parentId)
                  },
                  {
                    key: 'delete',
                    icon: <DeleteOutlined />,
                    label: '删除',
                    onClick: (info) => handleDeleteClick(info, child, parentId),
                    danger: true
                  }
                ]
              }}
              trigger={['click']}
              placement="bottomRight"
            >
              <button 
                className="submenu-more-btn"
                onClick={(e) => e.stopPropagation()}
              >
                <EllipsisOutlined />
              </button>
            </Dropdown>
          </div>
        ))}
      </div>
    );
  };

  const renderMenuItem = (item) => {
    // 检查是否有子菜单
    const hasChildren = item.children && item.children.length > 0;
    
    // 检查是否激活 - 一级菜单只有在点击自身且没有激活的子菜单时才激活
    const isActive = activeItemId === item.id && !activeSubItemId;
                    
    // 检查是否应该展开子菜单 - 通过手动展开状态或者有激活的子菜单
    const isExpanded = expandedItems[item.id] || (hasChildren && item.children.some(child => activeSubItemId === child.id));

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
          
          {/* 对有子菜单的项添加展开/折叠图标 */}
          {!isCollapsed && hasChildren && (
            <span 
              className="menu-item-expand-icon" 
              onClick={(e) => toggleExpand(e, item.id)}
            >
              {isExpanded ? <DownOutlined /> : <RightOutlined />}
            </span>
          )}
        </div>
        
        {/* 仅当不折叠且有子菜单且手动展开或有激活的子项时渲染子菜单 */}
        {!isCollapsed && hasChildren && isExpanded && renderSubMenuItems(item.children, item.id)}
      </div>
    )
  }

  return (
    <>
      <Sider
        className={`app-sidebar ${isCollapsed ? "collapsed" : ""}`}
        width={220}
        collapsible
        collapsed={isCollapsed}
        trigger={null}
      >
        <div className={`sidebar-top-container ${isCollapsed ? "collapsed" : ""}`}>
            <div className="logo-company-icon">S</div>
            {!isCollapsed && (
              <div className="logo-company-text">
                <span>可信</span>
                <span>Syntrust.agenent.cloud</span>
              </div>
            )}
        </div>

        {/* 工作区标志和名称 */}
        <div className={`sidebar-logo ${isCollapsed ? "collapsed" : ""}`}>
          <div className="logo-icon"></div>
          {!isCollapsed && (
            <div className="logo-text">
              {workspaceLoading ? "加载中..." : currentWorkspace ? currentWorkspace.name : "Syntrust"}
            </div>
          )}
        </div>

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

      {/* 重命名菜单项的Modal */}
      <Modal
        title="重命名菜单"
        open={renameModalVisible}
        onOk={handleRenameConfirm}
        onCancel={handleRenameCancel}
        okText="确认"
        cancelText="取消"
      >
        <Input
          placeholder="请输入新的菜单名称"
          value={newMenuName}
          onChange={(e) => setNewMenuName(e.target.value)}
          style={{ marginTop: '16px' }}
        />
      </Modal>
      
      {/* 删除菜单项的确认Modal */}
      <Modal
        title="删除菜单"
        open={deleteModalVisible}
        onOk={handleDeleteConfirm}
        onCancel={handleDeleteCancel}
        okText="确认删除"
        cancelText="取消"
        okButtonProps={{ danger: true }}
      >
        <p>确定要删除菜单"{itemToDelete?.title}"吗？此操作不可撤销。</p>
      </Modal>
    </>
  )
}

export default AppSidebar
