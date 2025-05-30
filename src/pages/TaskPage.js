"use client"

import { useState, useEffect } from "react"
import { Spin, Empty, Button, Pagination, message } from "antd"
import { FilterOutlined, GroupOutlined } from "@ant-design/icons"
import { useLocation, useNavigate } from "react-router-dom"
import TaskCard from "../components/card/TaskCard"
import taskService from "../services/taskService"
import FilterSystem from "../components/filter/FilterSystem"
import SortIcon from "../components/icons/SortIcon"
import { useChatContext } from "../contexts/ChatContext"
import { useNavContext } from "../contexts/NavContext"


const TaskPage = () => {
  const location = useLocation()
  const navigate = useNavigate()
  // 修改初始化状态，确保tasks始终是一个数组
  const [tasks, setTasks] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const { isChatOpen } = useChatContext()
  // 添加导航上下文
  const { selectedNav, handleNavChange } = useNavContext()
  // 添加分页状态
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
    total: 0
  })
  // 添加筛选和排序状态
  const [filterParams, setFilterParams] = useState(null)
  const [sortParams, setSortParams] = useState(null)
  // 添加强制刷新状态
  const [forceRefresh, setForceRefresh] = useState(0)

  // 加载时检查是否需要激活任务菜单
  useEffect(() => {
    const activateTasksMenu = localStorage.getItem('activate_tasks_menu');
    if (activateTasksMenu === 'true') {
      // 获取要激活的菜单类型，默认为tasks
      const menuType = localStorage.getItem('activate_menu_type') || 'tasks';
      
      // 设置导航为指定任务类型
      handleNavChange(menuType);
      console.log(`根据localStorage标记激活${menuType}菜单`);
      
      // 移除标记，避免重复激活
      localStorage.removeItem('activate_tasks_menu');
      localStorage.removeItem('activate_menu_type');
    }
  }, [handleNavChange]);

  // 应用保存的视图或清空筛选条件
  useEffect(() => {
    // 检查是否需要刷新任务列表（提交优化结果后）
    if (location.state?.refreshList) {
      console.log("任务页收到刷新请求，新任务ID:", location.state?.newTaskId);
      
      // 如果需要激活任务菜单
      if (location.state?.activateTasksMenu) {
        // 获取要激活的菜单类型，默认为tasks
        const menuType = location.state?.menuType || 'tasks';
        
        // 设置导航为指定任务类型
        handleNavChange(menuType);
        console.log(`已将导航设置为${menuType}任务`);
      }
      
      // 使用延迟确保状态更新后再处理
      setTimeout(() => {
        // 如果有新创建的完整任务数据，直接添加到任务列表中
        if (location.state?.newTask) {
          const newTask = location.state.newTask;
          console.log("收到新优化任务数据:", newTask);
          
          // 直接更新本地任务列表，将新任务添加到列表首位
          setTasks(prevTasks => {
            // 检查任务是否已存在，避免重复添加
            const taskExists = prevTasks.some(task => task.id === newTask.id);
            if (taskExists) {
              return prevTasks;
            }
            return [newTask, ...prevTasks];
          });
          
          // 提示用户新任务已创建
          message.success(`优化任务已创建: ${newTask.title}`);
        } 
        // 如果只有任务ID，尝试从localStorage获取完整数据
        else if (location.state?.newTaskId) {
          try {
            // 从localStorage中获取task数据
            const taskData = localStorage.getItem(`task_${location.state.newTaskId}`);
            if (taskData) {
              const newTask = JSON.parse(taskData);
              console.log("从localStorage获取到新任务数据:", newTask);
              
              // 添加到任务列表中
              setTasks(prevTasks => {
                const taskExists = prevTasks.some(task => task.id === newTask.id);
                if (taskExists) {
                  return prevTasks;
                }
                return [newTask, ...prevTasks];
              });
              
              message.success(`优化任务已加载: ${newTask.title}`);
            } else {
              // 如果没有在localStorage中找到，直接强制刷新任务列表
              setForceRefresh(prev => prev + 1);
              message.info("任务列表已刷新");
            }
          } catch (error) {
            console.error("从localStorage加载任务失败:", error);
            setForceRefresh(prev => prev + 1);
          }
        } else {
          // 如果没有获取到任何任务数据，强制刷新任务列表
          setForceRefresh(prev => prev + 1);
        }
      }, 200);
      
      return;
    }

    // 检查是否只需要刷新菜单（保存视图后）
    if (location.state?.refreshMenu) {
      console.log("任务页收到刷新菜单请求");
      
      // 如果需要保留筛选条件
      if (location.state.preserveFilters) {
        // 使用传递的筛选和排序条件
        if (location.state.filterParams) {
          setFilterParams(location.state.filterParams);
        }
        
        if (location.state.sortParams) {
          setSortParams(location.state.sortParams);
        }
      }
      
      return;
    }
    
    // 检查是否需要清空筛选条件（点击了一级菜单）
    if (location.state?.clearFilters) {
      console.log("任务页收到清空筛选条件请求");
      
      // 清空筛选条件和排序条件
      setFilterParams(null);
      setSortParams(null);
      
      // 重置页码
      setPagination(prev => ({
        ...prev,
        current: 1
      }));
      
      // 清空任务列表
      setTasks([]);
      
      // 设置加载中状态
      setLoading(true);
      
      return;
    }
    
    // 检查location.state是否包含应用视图的标志
    if (location.state?.applyViewFilters) {
      try {
        // 优先从location.state直接获取筛选参数
        if (location.state.filterParams) {
          setFilterParams(location.state.filterParams);
        }
        
        // 优先从location.state直接获取排序参数
        if (location.state.sortParams) {
          setSortParams(location.state.sortParams);
        }
        
        // 如果state中没有直接的参数，则从localStorage获取
        if (!location.state.filterParams && !location.state.sortParams) {
          const viewDataJson = localStorage.getItem('current_view_data');
          
          if (viewDataJson) {
            const viewData = JSON.parse(viewDataJson);
            
            // 应用筛选条件
            if (viewData.filterParams) {
              setFilterParams(viewData.filterParams);
            }
            
            // 应用排序条件
            if (viewData.sortParams) {
              setSortParams(viewData.sortParams);
            }
          }
        }
        
        // 重置页码
        setPagination(prev => ({
          ...prev,
          current: 1
        }));
        
        // 清空任务列表
        setTasks([]);
        
        // 设置加载中状态
        setLoading(true);
        
        // 清除本地存储中的视图数据，避免刷新页面时重复应用
        localStorage.removeItem('current_view_data');
      } catch (error) {
        console.error('应用视图筛选条件失败:', error);
      }
    }
  }, [location.state]);

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

  // 处理筛选条件变化
  const handleFilterChange = (filterConfig) => {
    console.log("任务页筛选条件变化:", filterConfig);
    // 如果filterConfig为null或undefined，则清空筛选参数
    if (!filterConfig) {
      setFilterParams(null);
      setPagination(prev => ({
        ...prev,
        current: 1 // 重置页码
      }));
      setTasks([]); // 清空现有数据
      setLoading(true);
      return;
    }
    
    // 如果filterConfig已经是API格式，直接使用
    if (filterConfig.exprs) {
      console.log("应用API格式的筛选条件:", filterConfig);
      setFilterParams(filterConfig);
    } 
    // 如果filterConfig有conditions属性（UI格式），转换为API格式
    else if (filterConfig.conditions) {
      // 打印UI格式的筛选条件
      console.log("转换UI格式的筛选条件:", filterConfig.conditions);
      
      const apiFilter = [];
      
      // 处理每个筛选条件
      filterConfig.conditions.forEach(condition => {
        // 确保values是有效的数组
        const conditionValues = condition.values || [];
        if (conditionValues.length === 0) return; // 跳过没有值的条件
        
        // 创建API筛选表达式
        const expr = {
          field: condition.field,
          op: condition.operator.toUpperCase(),
          values: conditionValues
        };
        
        // 添加到筛选列表
        apiFilter.push({
          exprs: [expr]
        });
      });
      
      console.log("转换后的API筛选条件:", apiFilter);
      setFilterParams(apiFilter.length > 0 ? apiFilter : null);
    }
    
    setPagination(prev => ({
      ...prev,
      current: 1 // 重置页码
    }));
    setTasks([]); // 清空现有数据
    setLoading(true);
  };

  // 处理排序条件变化
  const handleSortChange = (sortConfig) => {
    console.log("任务页排序条件变化:", sortConfig);
    // 判断是否已经是API格式的排序参数
    if (sortConfig && sortConfig.field !== undefined) {
      setSortParams(sortConfig);
      setPagination(prev => ({
        ...prev,
        current: 1 // 重置页码
      }));
      setTasks([]); // 清空现有数据
      setLoading(true);
      return;
    }
    
    // 处理UI格式的排序配置
    if (sortConfig && sortConfig.fields && sortConfig.fields.length > 0) {
      // 只使用第一个排序字段（API当前只支持单字段排序）
      const firstSort = sortConfig.fields[0];
      setSortParams({
        field: firstSort.field,
        desc: firstSort.direction === 'desc'
      });
    } else {
      setSortParams(null);
    }
    
    setPagination(prev => ({
      ...prev,
      current: 1 // 重置页码
    }));
    setTasks([]); // 清空现有数据
    setLoading(true);
  };

  // 处理分页变化
  const handlePageChange = (page, pageSize) => {
    setPagination(prev => ({
      ...prev,
      current: page,
      pageSize: pageSize
    }));
    setLoading(true);
  };

  // 处理导入任务成功
  const handleImportSuccess = () => {
    // 强制刷新数据，但不重置筛选条件
    setForceRefresh(prev => prev + 1);
  };

  // 添加导入任务事件监听
  useEffect(() => {
    // 处理任务导入事件
    const handleTasksImported = (event) => {
      const { tasks, timestamp } = event.detail;
      if (tasks && Array.isArray(tasks)) {
        console.log('收到导入任务事件，导入任务数量:', tasks.length);
        
        // 添加导入的任务到当前任务列表中
        setTasks(prevTasks => {
          // 将新导入的任务添加到列表前面
          return [...tasks, ...prevTasks];
        });
        
        // 提示用户导入成功
        message.success(`成功导入 ${tasks.length} 条任务数据`);
      }
    };
    
    // 处理localStorage变化事件
    const handleStorageChange = (e) => {
      if (e.key === 'tasks_last_imported') {
        console.log('检测到导入任务数据更新');
        try {
          // 从localStorage获取导入的任务数据
          const importedTasksJson = localStorage.getItem('imported_tasks');
          if (importedTasksJson) {
            const importedTasks = JSON.parse(importedTasksJson);
            
            // 避免重复导入 - 只获取最新的3条记录(假设每次导入3条)
            const recentTasks = importedTasks.slice(0, 3);
            
            // 更新任务列表
            setTasks(prevTasks => {
              // 检查任务是否已存在
              const newTasks = recentTasks.filter(importedTask => 
                !prevTasks.some(existingTask => existingTask.id === importedTask.id)
              );
              
              // 如果有新任务，添加到列表前面
              if (newTasks.length > 0) {
                return [...newTasks, ...prevTasks];
              }
              return prevTasks;
            });
          }
        } catch (error) {
          console.error('处理导入任务数据失败:', error);
        }
      }
    };
    
    // 添加事件监听
    window.addEventListener('tasksImported', handleTasksImported);
    window.addEventListener('storage', handleStorageChange);
    
    // 组件卸载时移除监听
    return () => {
      window.removeEventListener('tasksImported', handleTasksImported);
      window.removeEventListener('storage', handleStorageChange);
    };
  }, []);

  // 处理生成报告
  const handleGenerateReport = (selectedTaskIds) => {
    console.log('生成报告的任务ID:', selectedTaskIds);
    
    // 设置加载状态
    setLoading(true);
    
    // 添加5秒延迟模拟报告生成过程
    setTimeout(() => {
      // 如果选中的任务ID为空（开发测试时），创建一个演示报告
      if (selectedTaskIds.length === 0) {
        console.log('创建演示报告...');
        // 创建一个演示报告对象
        const demoReport = {
          id: `report-demo-${Date.now()}`,
          taskId: 'demo-task',
          title: '演示报告 - 任务评估',
          type: 'report',
          content: '这是一个演示报告，展示报告功能的样式和布局。实际报告将基于任务评估数据生成。',
          createdAt: new Date().toISOString(),
          sourceTask: {
            id: 'demo-task',
            title: '演示任务',
            status: 'completed'
          }
        };
        
        try {
          // 获取现有报告数据
          const existingReportsJson = localStorage.getItem('task_reports') || '[]';
          const existingReports = JSON.parse(existingReportsJson);
          
          // 添加演示报告
          existingReports.push(demoReport);
          
          // 保存回localStorage
          localStorage.setItem('task_reports', JSON.stringify(existingReports));
          
          console.log('已创建演示报告并保存');
          
          // 触发自定义事件，通知所有相关组件刷新报告数据
          const reportEvent = new CustomEvent('reportsUpdated', {
            detail: { timestamp: Date.now() }
          });
          window.dispatchEvent(reportEvent);
          
          // 同时更新localStorage中的一个特殊标记，以触发Storage事件
          localStorage.setItem('reports_last_updated', Date.now().toString());
          
          // 关闭加载状态
          setLoading(false);
          
          return;
        } catch (error) {
          console.error('保存演示报告失败:', error);
          setLoading(false);
        }
      }
      
      // 为每个选中的任务生成报告
      selectedTaskIds.forEach(taskId => {
        // 这里应该是调用实际的API生成报告
        console.log(`正在为任务 ${taskId} 生成报告...`);
        
        // 创建一个报告对象，包含任务信息和报告数据
        const taskData = tasks.find(task => task.id === taskId);
        if (!taskData) {
          console.error(`找不到任务数据: ${taskId}`);
          return;
        }
        
        const reportData = {
          id: `report-${Date.now()}-${taskId}`,
          taskId: taskId,
          title: `${taskData.title} - 报告`,
          type: 'report',
          content: `这是任务 "${taskData.title}" 的报告内容`,
          createdAt: new Date().toISOString(),
          sourceTask: taskData
        };
        
        // 保存报告数据到localStorage
        try {
          // 获取现有报告数据
          const existingReportsJson = localStorage.getItem('task_reports') || '[]';
          const existingReports = JSON.parse(existingReportsJson);
          
          // 添加新报告
          existingReports.push(reportData);
          
          // 保存回localStorage
          localStorage.setItem('task_reports', JSON.stringify(existingReports));
          
          console.log(`已为任务 ${taskId} 生成报告并保存`);
        } catch (error) {
          console.error(`保存报告数据失败:`, error);
          message.error('保存报告数据失败');
        }
      });
      
      // 触发自定义事件，通知所有相关组件刷新报告数据
      try {
        // 创建并分发自定义事件
        const reportEvent = new CustomEvent('reportsUpdated', {
          detail: { timestamp: Date.now() }
        });
        window.dispatchEvent(reportEvent);
        
        // 同时更新localStorage中的一个特殊标记，以触发Storage事件
        localStorage.setItem('reports_last_updated', Date.now().toString());
        
        console.log('已触发报告更新事件');
      } catch (error) {
        console.error('触发报告更新事件失败:', error);
      }
      
      // 关闭加载状态
      setLoading(false);
      
      // 提示用户报告已生成 - 由FilterSystem组件处理，这里不需要显示
    }, 5000); // 5秒延迟，模拟报告生成过程
  };

  // 处理任务状态更新
  const handleTaskUpdate = (taskId, updatedTask) => {
    console.log("任务状态已更新:", taskId, updatedTask);
    
    // 更新本地任务列表
    setTasks(prevTasks => 
      prevTasks.map(task => 
        task.id === taskId ? { ...task, ...updatedTask } : task
      )
    );
    
    // 可选：立即保存到localStorage以便在刷新页面后保持状态
    try {
      localStorage.setItem(`task_${taskId}_status`, updatedTask.status);
    } catch (error) {
      console.error("保存任务状态到localStorage失败:", error);
    }
  };

  // 监听任务状态更新事件
  useEffect(() => {
    const handleTaskStatusEvent = (event) => {
      const { taskId, status } = event.detail;
      if (taskId && status) {
        handleTaskUpdate(taskId, { status });
      }
    };
    
    // 添加事件监听
    window.addEventListener('taskStatusUpdated', handleTaskStatusEvent);
    
    // 清理函数
    return () => {
      window.removeEventListener('taskStatusUpdated', handleTaskStatusEvent);
    };
  }, []);

  // 加载任务数据
  useEffect(() => {
    const fetchTasks = async () => {
      try {
        setLoading(true);
        const params = {
          tab: selectedNav || "community",
          pagination: {
            page: pagination.current,
            per_page: pagination.pageSize
          }
        };
        // 添加筛选和排序条件
        if (filterParams) {
          params.filter = filterParams;
        }
        if (sortParams) {
          params.sort = sortParams;
        }
        console.log("任务页请求参数:", params);
        // 调用API获取任务数据
        const response = await taskService.getTasks(params);
        console.log("response",response);
        // 保证 response.cards 是数组
        setTasks(Array.isArray(response.cards) ? response.cards : []);
        setPagination(prev => ({
          ...prev,
          total: response.pagination?.total || 0
        }));
        setError(null);
      } catch (err) {
        console.error("加载任务数据失败:", err);
        setError("加载数据失败，请稍后重试");
        setTasks([]); // 保证 tasks 一定是数组
      } finally {
        setLoading(false);
      }
    };
    fetchTasks();
  }, [selectedNav, pagination.current, pagination.pageSize, filterParams, sortParams, forceRefresh]);

  // 导航变化时重置状态
  useEffect(() => {
    setPagination(prev => ({
      ...prev,
      current: 1
    }));
    setTasks([]);
    // 导航变化时清空筛选和排序
    setFilterParams(null);
    setSortParams(null);
  }, [selectedNav]);

  return (
    <div className={`task-page ${isChatOpen ? "chat-open" : ""}`}>
      <div className="filter-container">
        <FilterSystem 
          onFilterChange={handleFilterChange}
          onSortChange={handleSortChange}
          onImportSuccess={handleImportSuccess}
          onGenerateReport={handleGenerateReport}
          currentFilter={filterParams}
          currentSort={sortParams}
        />
      </div>

      <div className="tasks-container" style={{width: isChatOpen ? "" : "832px"}}>
        {loading ? (
          <div className="loading-container">
            <Spin tip="加载中..." />
          </div>
        ) : tasks && tasks.length > 0 ? (
          <>
            <div className="tasks-grid">
              {Array.isArray(tasks) && tasks.map((task) => (
                <TaskCard key={task.id} task={task} onTaskUpdate={handleTaskUpdate} />
              ))}
            </div>
            
            <div className="pagination-container">
              <Pagination
                current={pagination.current}
                pageSize={pagination.pageSize}
                total={pagination.total}
                onChange={handlePageChange}
                showSizeChanger
                showTotal={(total) => `共 ${total} 条记录`}
              />
            </div>
          </>
        ) : (
          <Empty description="暂无任务数据" />
        )}

        {error && <div className="error-message">{error}</div>}
      </div>
    </div>
  );
};

export default TaskPage;