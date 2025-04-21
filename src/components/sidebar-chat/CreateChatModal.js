"use client"

import { useState } from "react"
import { CloseOutlined, SearchOutlined } from "@ant-design/icons"
import "./CreateChatModal.css"

const CreateChatModal = ({ onClose, onCreate }) => {
  const [activeTab, setActiveTab] = useState("single") // 'single' or 'group'

  // Single chat state
  const [userId, setUserId] = useState("")

  // Group chat state
  const [groupName, setGroupName] = useState("")
  const [groupType, setGroupType] = useState("work") // 'work', 'public', or 'meeting'
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedMembers, setSelectedMembers] = useState([])

  const handleCreateSingleChat = () => {
    if (!userId.trim()) return

    onCreate("C2C", { userID: userId })
  }

  const handleCreateGroupChat = () => {
    if (!groupName.trim() || selectedMembers.length === 0) {
      // 为了演示，我们允许创建没有成员的群组
      onCreate("GROUP", {
        name: groupName,
        type: groupType,
        memberList: selectedMembers.length > 0 ? selectedMembers : [{ userID: "demo-user-1" }],
      })
      return
    }

    onCreate("GROUP", {
      name: groupName,
      type: groupType,
      memberList: selectedMembers,
    })
  }

  const handleCreate = () => {
    if (activeTab === "single") {
      handleCreateSingleChat()
    } else {
      handleCreateGroupChat()
    }
  }

  const handleSearch = () => {
    // 模拟搜索用户
    if (searchQuery.trim()) {
      const mockUser = {
        userID: `user-${Date.now()}`,
        nick: searchQuery,
      }
      setSelectedMembers([...selectedMembers, mockUser])
      setSearchQuery("")
    }
  }

  return (
    <div className="modal-overlay">
      <div className="create-chat-modal">
        <div className="modal-header">
          <h2>创建新会话</h2>
          <button className="close-button" onClick={onClose}>
            <CloseOutlined />
          </button>
        </div>

        <div className="modal-tabs">
          <button
            className={`tab-button ${activeTab === "single" ? "active" : ""}`}
            onClick={() => setActiveTab("single")}
          >
            <span className="tab-icon">👤</span> 单聊
          </button>
          <button
            className={`tab-button ${activeTab === "group" ? "active" : ""}`}
            onClick={() => setActiveTab("group")}
          >
            <span className="tab-icon">👥</span> 群聊
          </button>
        </div>

        <div className="modal-content">
          {activeTab === "single" ? (
            <div className="single-chat-form">
              <div className="form-group">
                <label htmlFor="userId">用户ID</label>
                <input
                  id="userId"
                  type="text"
                  value={userId}
                  onChange={(e) => setUserId(e.target.value)}
                  placeholder="输入对方的用户ID"
                />
              </div>
            </div>
          ) : (
            <div className="group-chat-form">
              <div className="form-group">
                <label htmlFor="groupName">群组名称</label>
                <input
                  id="groupName"
                  type="text"
                  value={groupName}
                  onChange={(e) => setGroupName(e.target.value)}
                  placeholder="输入群组名称"
                />
              </div>

              <div className="form-group">
                <label>群组类型</label>
                <div className="radio-group">
                  <label className="radio-label">
                    <input
                      type="radio"
                      name="groupType"
                      value="work"
                      checked={groupType === "work"}
                      onChange={() => setGroupType("work")}
                    />
                    工作群
                  </label>
                  <label className="radio-label">
                    <input
                      type="radio"
                      name="groupType"
                      value="public"
                      checked={groupType === "public"}
                      onChange={() => setGroupType("public")}
                    />
                    公开群
                  </label>
                  <label className="radio-label">
                    <input
                      type="radio"
                      name="groupType"
                      value="meeting"
                      checked={groupType === "meeting"}
                      onChange={() => setGroupType("meeting")}
                    />
                    会议群
                  </label>
                </div>
              </div>

              <div className="form-group">
                <label>添加成员</label>
                <div className="search-container">
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="搜索用户"
                  />
                  <button className="search-button" onClick={handleSearch}>
                    <SearchOutlined />
                  </button>
                </div>

                {selectedMembers.length === 0 ? (
                  <div className="search-results">
                    <p className="search-placeholder">搜索结果将显示在这里</p>
                  </div>
                ) : (
                  <div className="selected-members">
                    <h4>已选成员 ({selectedMembers.length})</h4>
                    <div className="member-list">
                      {selectedMembers.map((member) => (
                        <div key={member.userID} className="member-item">
                          <span>{member.nick || member.userID}</span>
                          <button
                            className="remove-member"
                            onClick={() => setSelectedMembers((prev) => prev.filter((m) => m.userID !== member.userID))}
                          >
                            ×
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        <div className="modal-footer">
          <button className="cancel-button" onClick={onClose}>
            取消
          </button>
          <button
            className="create-button"
            onClick={handleCreate}
            disabled={(activeTab === "single" && !userId.trim()) || (activeTab === "group" && !groupName.trim())}
          >
            创建
          </button>
        </div>
      </div>
    </div>
  )
}

export default CreateChatModal
