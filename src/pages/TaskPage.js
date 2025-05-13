"use client"

import { useState, useEffect } from "react"
import { Spin, Empty, Button, Pagination } from "antd"
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
  // 添加导航上下文
  const { selectedNav } = useNavContext()
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
      setFilterParams(filterConfig);
    } 
    // 如果filterConfig有conditions属性（UI格式），转换为API格式
    else if (filterConfig.conditions) {
      const apiFilter = filterConfig.conditions.map(condition => ({
        exprs: [
          {
            field: condition.field,
            op: condition.operator.toUpperCase(),
            values: condition.values
          }
        ]
      }));
      
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
    if (sortConfig.fields && sortConfig.fields.length > 0) {
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
        
        // 调用API获取任务数据
        const response = await taskService.getTasks(params);
        
        setTasks(response.card);
        setPagination(prev => ({
          ...prev,
          total: response.pagination.total
        }));
        setError(null);
      } catch (err) {
        console.error("加载任务数据失败:", err);
        setError("加载数据失败，请稍后重试");
        setTasks([]);
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
  }, [selectedNav]);

  return (
    <div className={`task-page ${isChatOpen ? "chat-open" : ""}`}>
      <div className="filter-container">
        <FilterSystem 
          onFilterChange={handleFilterChange}
          onSortChange={handleSortChange}
          onImportSuccess={handleImportSuccess}
        />
      </div>

      <div className="tasks-container" style={{width:  isChatOpen ?"":"832px"}}>
        {loading ? (
          <div className="loading-container">
            <Spin tip="加载中..." />
                  </div>
        ) : tasks.length > 0 ? (
          <>
            <div className="tasks-grid">
              {tasks.map((task) => (
                <TaskCard key={task.id} task={task} />
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
  )
}

export default TaskPage
