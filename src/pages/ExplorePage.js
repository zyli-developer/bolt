"use client"

import { useEffect, useState, useRef, useCallback } from "react"
import { Button, Spin } from "antd"
import { FilterOutlined, GroupOutlined } from "@ant-design/icons"
import SortIcon from "../components/icons/SortIcon"
import CardItem from "../components/card/CardItem"
import cardService from "../services/cardService"
import { useChatContext } from "../contexts/ChatContext"
import { useNavContext } from "../contexts/NavContext"

const ExplorePage = () => {
  const { selectedNav } = useNavContext()
  const [cards, setCards] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [hasMore, setHasMore] = useState(true)
  const [page, setPage] = useState(1)
  const [prevNav, setPrevNav] = useState(null)
  const observer = useRef()
  const loadingRef = useRef(null)
  const { isChatOpen } = useChatContext()

  // 初始加载数据
  useEffect(() => {
    // 如果selectedNav未定义，使用默认值"community"
    const scope = selectedNav || "community"
    loadCards(1, scope)
    setPrevNav(scope)
  }, [])

  // 当导航切换时，重置分页并重新加载数据
  useEffect(() => {
    if (!selectedNav || selectedNav === prevNav) {
      return // 初始化或未变化时不触发
    }

    console.log("Navigation changed to:", selectedNav)
    setCards([]) // 清空当前卡片列表
    setPage(1) // 重置分页
    setHasMore(true) // 重置加载更多状态
    loadCards(1, selectedNav)
    setPrevNav(selectedNav) // 更新前一个导航值
  }, [selectedNav])

  // 加载卡片数据
  const loadCards = async (pageNum, scope) => {
    try {
      setLoading(true)
      console.log(`Loading cards for scope: ${scope}, page: ${pageNum}`)
      const data = await cardService.getCards({
        page: pageNum,
        limit: 10,
        scope: scope, // 根据当前选中的导航项发送不同的请求
      })

      if (pageNum === 1) {
        setCards(data)
      } else {
        setCards((prevCards) => [...prevCards, ...data])
      }

      // 如果返回的数据少于请求的数量，说明没有更多数据了
      setHasMore(data.length === 10)
      setError(null)
    } catch (err) {
      setError("获取卡片数据失败")
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  // 无限滚动加载
  const lastCardElementRef = useCallback(
    (node) => {
      if (loading) return
      if (observer.current) observer.current.disconnect()

      observer.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && hasMore) {
          const nextPage = page + 1
          setPage(nextPage)
          loadCards(nextPage, selectedNav || "community")
        }
      })

      if (node) observer.current.observe(node)
    },
    [loading, hasMore, page, selectedNav],
  )

  return (
    <div className={`explore-page ${isChatOpen ? "chat-open" : "chat-closed"}`}>
      {/* 筛选工具栏 */}
      <div className="explore-toolbar">
        <div className="toolbar-left">
          <Button icon={<FilterOutlined />} className="filter-button">
            Filter <span className="filter-count">2</span>
          </Button>
        </div>
        <div className="toolbar-right">
          <Button icon={<GroupOutlined />} className="group-button">
            Group <span className="group-count">2</span>
          </Button>
          <Button icon={<SortIcon />} className="sort-button">
            Sort
          </Button>
        </div>
      </div>

      {/* 卡片列表 */}
      <div className="cards-container">
        {loading && page === 1 ? (
          <div className="initial-loading-container">
            <Spin size="large" />
            <div className="loading-text">加载中...</div>
          </div>
        ) : cards.length === 0 && !loading ? (
          <div className="empty-container">
            <div className="empty-message">暂无数据</div>
          </div>
        ) : (
          cards.map((card, index) => {
            // 如果是最后一个卡片，添加ref用于无限滚动
            if (cards.length === index + 1) {
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
        )}

        {loading && page > 1 && (
          <div className="loading-container" ref={loadingRef}>
            <Spin size="large" />
          </div>
        )}

        {error && <div className="error-message">{error}</div>}
      </div>
    </div>
  )
}

export default ExplorePage
