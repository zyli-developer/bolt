"use client"

import { useState, useEffect } from "react"
import { Typography, Spin, notification } from "antd"
import { useNavigate } from "react-router-dom"
import AssetList from "../components/asset/AssetList"
import FilterSystem from "../components/filter/FilterSystem"
import { useAssetStyles } from "../styles/components/assets"
import assetService from "../services/assetService"
import { assetData } from "../mocks/data" // 导入mock数据，确保直接可用
import { useChatContext } from "../contexts/ChatContext"

const { Title } = Typography

const AssetsPage = () => {
  const { styles } = useAssetStyles()
  const navigate = useNavigate()
  const { isChatOpen } = useChatContext()
  const [loading, setLoading] = useState(false)
  const [assets, setAssets] = useState([])
  const [reports, setReports] = useState([])
  const [refreshTrigger, setRefreshTrigger] = useState(0)
  const [pagination, setPagination] = useState({
    total: 0,
    page: 1,
    per_page: 12
  })
  
  // 当前Tab，用于API查询
  const [currentTab, setCurrentTab] = useState("community")
  
  // 筛选和排序状态
  const [filterParams, setFilterParams] = useState({
    tab: "community",
    filter: null,
    sort: { field: "created_at", desc: true },
    pagination: pagination
  })
  
  // 监听报告更新事件
  useEffect(() => {
    const handleReportsUpdated = (event) => {
      console.log('AssetsPage: 收到报告更新事件，详情:', event.detail);
      
      // 如果事件中包含报告数据，直接更新
      if (event.detail && event.detail.reports && Array.isArray(event.detail.reports)) {
        console.log('从事件中直接获取报告数据:', event.detail.reports.length);
        
        // 更新报告数据
        setReports(prev => {
          // 避免重复添加
          const newReports = event.detail.reports.filter(newReport => 
            !prev.some(existingReport => existingReport.id === newReport.id)
          );
          
          if (newReports.length > 0) {
            console.log(`添加 ${newReports.length} 个新报告`);
            return [...prev, ...newReports];
          }
          
          return prev;
        });
      } else {
        // 否则重新加载报告数据
        console.log('从localStorage加载报告数据');
        loadLocalReports();
      }
      
      // 增加刷新触发器的值，触发AssetList组件刷新
      setRefreshTrigger(prev => prev + 1);
    };
    
    // 添加事件监听
    window.addEventListener('reportsUpdated', handleReportsUpdated);
    
    // 组件卸载时移除事件监听
    return () => {
      window.removeEventListener('reportsUpdated', handleReportsUpdated);
    };
  }, []);
  
  // 监听localStorage变化
  useEffect(() => {
    const handleStorageChange = (e) => {
      // 监听报告相关的存储变化
      if (e.key === 'task_reports' || e.key === 'reports_last_updated' || e.key === 'reports_force_update') {
        console.log(`AssetsPage: 检测到localStorage变化: ${e.key}`);
        loadLocalReports();
        setRefreshTrigger(prev => prev + 1);
      }
    };
    
    // 添加事件监听
    window.addEventListener('storage', handleStorageChange);
    
    // 组件卸载时移除事件监听
    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, []);
  
  // 加载本地报告数据
  const loadLocalReports = () => {
    try {
      // 从localStorage获取报告数据
      const reportsJson = localStorage.getItem('task_reports');
      if (reportsJson) {
        const reportData = JSON.parse(reportsJson);
        if (Array.isArray(reportData) && reportData.length > 0) {
          console.log('加载到本地报告数据:', reportData.length);
          
          // 确保报告数据格式正确
          const formattedReports = reportData.map(report => ({
            ...report,
            type: 'report', // 确保type字段设置为report
            id: report.id || `report-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`,
          }));
          
          setReports(formattedReports);
          console.log('报告数据详情:', formattedReports);
        } else {
          console.log('未找到报告数据或数据为空数组');
          setReports([]);
        }
      } else {
        console.log('localStorage中不存在task_reports键');
        setReports([]);
      }
    } catch (error) {
      console.error('加载本地报告数据失败:', error);
      setReports([]);
    }
  };
  
  // 初始加载本地报告数据
  useEffect(() => {
    loadLocalReports();
  }, []);
  
  // 定期检查报告更新
  useEffect(() => {
    const checkReportsInterval = setInterval(() => {
      loadLocalReports();
    }, 60000); // 每分钟检查一次
    
    return () => {
      clearInterval(checkReportsInterval);
    };
  }, []);
  
  // 获取本地备份数据
  const getFallbackData = () => {
    console.log('使用本地备份数据');
    if (assetData && assetData.length > 0) {
      // 过滤当前选择的tab
      let filteredAssets = [...assetData];
      
      if (filterParams.tab === "workspace") {
        filteredAssets = assetData.filter(asset => 
          asset.created_from === "Alibaba" || asset.created_from === "workspace"
        );
      } else if (filterParams.tab === "personal") {
        filteredAssets = assetData.filter(asset => asset.created_by === "Jackson");
      }
      
      // 应用分页
      const { page, per_page } = filterParams.pagination;
      const startIndex = (page - 1) * per_page;
      const endIndex = startIndex + per_page;
      
      setAssets(filteredAssets.slice(startIndex, endIndex));
      setPagination({
        total: filteredAssets.length,
        page: page,
        per_page: per_page
      });
    } else {
      console.error('本地备份数据也不可用');
      setAssets([]);
    }
  }
  
  // 加载资产数据
  const loadAssets = async () => {
    try {
      setLoading(true)
      console.log('开始加载资产数据, 参数:', filterParams);
      
      const params = { ...filterParams }
      
      // 调用服务获取数据
      const result = await assetService.getAssets(params)
      console.log('获取到资产数据:', result);
      
      // 确保我们有卡片数据
      if (result && result.card && result.card.length > 0) {
        console.log('设置资产数据, 数量:', result.card.length);
        setAssets(result.card)
      } else {
        console.warn("未接收到卡片数据或数据为空，使用本地数据");
        // 使用本地备份数据
        getFallbackData();
      }
      
      // 更新分页信息
      if (result && result.pagination) {
        console.log('更新分页信息:', result.pagination);
        setPagination(result.pagination)
      }
    } catch (error) {
      console.error("加载资产数据失败:", error)
      notification.error({
        message: "加载失败",
        description: "获取资产数据失败，使用本地备份数据"
      })
      // 使用本地备份数据
      getFallbackData();
    } finally {
      setLoading(false)
    }
  }
  
  // 处理搜索
  const handleSearch = (value) => {
    if (!value || !value.trim()) {
      // 如果搜索词为空，清除搜索条件
      setFilterParams(prev => ({
        ...prev,
        filter: {
          ...prev.filter,
          exprs: prev.filter?.exprs?.filter(expr => expr.field !== "keyword") || []
        },
        pagination: { ...prev.pagination, page: 1 }
      }))
    } else {
      // 添加搜索条件
      setFilterParams(prev => {
        const newFilter = { ...prev.filter } || { exprs: [] }
        
        // 如果没有filter或没有exprs，初始化
        if (!newFilter.exprs) {
          newFilter.exprs = []
        }
        
        // 移除旧的keyword筛选条件
        const filteredExprs = newFilter.exprs.filter(expr => expr.field !== "keyword")
        
        // 添加新的keyword筛选条件
        newFilter.exprs = [
          ...filteredExprs,
          { field: "keyword", op: "LIKE", values: [value] }
        ]
        
        return {
          ...prev,
          filter: newFilter,
          pagination: { ...prev.pagination, page: 1 }
        }
      })
    }
  }
  
  // 处理Tab切换
  const handleTabChange = (tab) => {
    setCurrentTab(tab)
    setFilterParams(prev => ({
      ...prev,
      tab: tab,
      pagination: { ...prev.pagination, page: 1 }
    }))
  }
  
  // 处理过滤
  const handleFilterChange = (filter) => {
    setFilterParams(prev => ({
      ...prev,
      filter,
      pagination: { ...prev.pagination, page: 1 }
    }))
  }
  
  // 处理排序
  const handleSortChange = (sort) => {
    setFilterParams(prev => ({
      ...prev,
      sort,
      pagination: { ...prev.pagination, page: 1 }
    }))
  }
  
  // 处理分页
  const handlePageChange = (page, pageSize) => {
    setFilterParams(prev => ({
      ...prev,
      pagination: { ...prev.pagination, page, per_page: pageSize }
    }))
  }
  
  // 直接初始化本地数据
  useEffect(() => {
    console.log('组件挂载，初始化本地数据');
    if (assets.length === 0 && !loading) {
      getFallbackData();
    }
  }, []);
  
  // 参数改变时重新加载数据
  useEffect(() => {
    loadAssets();
  }, [filterParams]);
  
  return (
    <div className={styles.pageContainer}>
      <div className={`${styles.contentArea} ${isChatOpen ? styles.contentWithChat : styles.contentWithoutChat}`}>
        
        <FilterSystem 
          onFilterChange={handleFilterChange}
          onSortChange={handleSortChange}
          currentFilter={filterParams.filter}
          currentSort={filterParams.sort}
        />
        
        <div className={styles.assetPageBackground}>
          <AssetList 
            assets={[...assets, ...reports]}
            loading={loading}
            total={pagination.total}
            currentPage={pagination.page}
            pageSize={pagination.per_page}
            onSearch={handleSearch}
            onPageChange={handlePageChange}
            isChatOpen={isChatOpen}
            refreshTrigger={refreshTrigger}
          />
        </div>
      </div>
    </div>
  )
}

export default AssetsPage
