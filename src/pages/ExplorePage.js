"use client"

import { useEffect, useState, useRef, useCallback } from "react"
import { Button, Spin } from "antd"
import { FilterOutlined, GroupOutlined } from "@ant-design/icons"
import SortIcon from "../components/icons/SortIcon"
import CardItem from "../components/card/CardItem"
import cardService from "../services/cardService"
import { useChatContext } from "../contexts/ChatContext"

const ExplorePage = () => {
  const [cards, setCards] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [hasMore, setHasMore] = useState(true)
  const [page, setPage] = useState(1)
  const observer = useRef()
  const loadingRef = useRef(null)
  const { isChatOpen } = useChatContext()

  // 初始加载数据
  useEffect(() => {
    loadCards(1)
  }, [])

  // 加载卡片数据
  const loadCards = async (pageNum) => {
    try {
      setLoading(true)
      const data = await cardService.getCards({ page: pageNum, limit: 10 })

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
          loadCards(nextPage)
        }
      })

      if (node) observer.current.observe(node)
    },
    [loading, hasMore, page],
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
        {cards.map((card, index) => {
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
        })}

        {loading && (
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
