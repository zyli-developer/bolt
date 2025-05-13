"use client"

import { useEffect, useState, useRef, useCallback } from "react"
import { Spin } from "antd"
import CardItem from "../components/card/CardItem"
import cardService from "../services/cardService"
import { useChatContext } from "../contexts/ChatContext"
import { useNavContext } from "../contexts/NavContext"
import FilterSystem from "../components/filter/FilterSystem"

const ExplorePage = () => {
  const { selectedNav } = useNavContext()
  const [cards, setCards] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [hasMore, setHasMore] = useState(true)
  const [page, setPage] = useState(1)
  const [prevNav, setPrevNav] = useState(null)
  const [totalItems, setTotalItems] = useState(0)
  const observer = useRef()
  const loadingRef = useRef(null)
  const { isChatOpen } = useChatContext()
  const [filterParams, setFilterParams] = useState(null)
  const [sortParams, setSortParams] = useState(null)

  // 处理筛选条件变化
  const handleFilterChange = (filterConfig) => {
    // 如果filterConfig为null或undefined，则清空筛选参数
    if (!filterConfig) {
      setFilterParams(null);
      setPage(1); // 重置页码
      setCards([]); // 清空现有数据
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
    
    setPage(1); // 重置页码
    setCards([]); // 清空现有数据
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
    setPage(1); // 重置页码
    setCards([]); // 清空现有数据
    setLoading(true);
  };

  const lastCardElementRef = useCallback(
    (node) => {
      if (loading) return
      if (observer.current) observer.current.disconnect()

      observer.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && hasMore) {
          setPage((prevPage) => prevPage + 1)
        }
      })

      if (node) observer.current.observe(node)
    },
    [loading, hasMore]
  )

  // 加载卡片数据
  const loadCards = useCallback(async () => {
    if (!loading) return
    
    try {
      const params = {
        tab: selectedNav,
        pagination: {
          page,
          per_page: 10
        }
      };
      
      // 添加筛选和排序条件
      if (filterParams) {
        params.filter = filterParams;
      }
      
      if (sortParams) {
        params.sort = sortParams;
      }
      
      // 使用新的API调用方式
      const response = await cardService.getExplorations(params);
      
      setCards((prevCards) => {
        // 如果是第一页或导航变化，直接使用新数据
        if (page === 1 || prevNav !== selectedNav) {
          return response.card;
        }
        // 否则追加新数据
        return [...prevCards, ...response.card];
      });
      
      // 更新分页信息
      setTotalItems(response.pagination.total);
      setHasMore(response.card.length > 0 && response.pagination.page * response.pagination.per_page < response.pagination.total);
      setPrevNav(selectedNav);
      setError(null);
    } catch (err) {
      console.error("加载探索卡片失败:", err);
      setError("加载数据失败，请稍后重试");
    } finally {
      setLoading(false);
    }
  }, [selectedNav, page, filterParams, sortParams, prevNav]);

  // 导航变化时重置状态
  useEffect(() => {
    if (prevNav !== selectedNav) {
      setCards([])
      setPage(1)
      setHasMore(true)
      setLoading(true)
    }
  }, [selectedNav, prevNav])

  // 页面加载或页码变化时加载数据
  useEffect(() => {
    loadCards()
  }, [loadCards])

  return (
    <div className={`explore-page ${isChatOpen ? "chat-open" : ""}`}>
      <div className="filter-container">
        <FilterSystem 
          onFilterChange={handleFilterChange}
          onSortChange={handleSortChange}
        />
      </div>

      <div className="cards-container">
        {cards.length > 0 ? (
          cards.map((card, index) => {
            if (index === cards.length - 1) {
              return (
                <div ref={lastCardElementRef} key={card.id} className="card-wrapper">
                  <CardItem card={card} />
                </div>
              )
            } else {
              return (
                <div key={card.id} className="card-wrapper">
                  <CardItem card={card} />
                </div>
              )
            }
          })
        ) : !loading ? (
          <div className="no-data">暂无数据</div>
        ) : null}

        {loading && (
          <div className="loading-container" ref={loadingRef}>
            <Spin tip="加载中..." />
          </div>
        )}

        {error && <div className="error-message">{error}</div>}
      </div>
    </div>
  )
}

export default ExplorePage
