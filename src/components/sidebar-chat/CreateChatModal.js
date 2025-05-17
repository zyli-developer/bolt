"use client"

import { useState } from "react"
import { CloseOutlined, SearchOutlined, PlusOutlined, UserAddOutlined } from "@ant-design/icons"
import "./CreateChatModal.css"

const CreateChatModal = ({ onClose, onCreate }) => {
  const [activeTab, setActiveTab] = useState("single") // 'single' or 'group'
  const [groupAction, setGroupAction] = useState("create") // 'create' or 'join'

  // Single chat state
  const [userId, setUserId] = useState("")

  // Group chat state
  const [groupName, setGroupName] = useState("")
  const [groupType, setGroupType] = useState("work") // 'work', 'public', or 'meeting'
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedMembers, setSelectedMembers] = useState([])
  
  // Join group state
  const [groupId, setGroupId] = useState("")

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
  
  const handleJoinGroupChat = () => {
    if (!groupId.trim()) return
    
    onCreate("GROUP", {
      groupID: groupId,
      isJoin: true
    })
  }

  const handleCreate = () => {
    if (activeTab === "single") {
      handleCreateSingleChat()
    } else {
      if (groupAction === "create") {
      handleCreateGroupChat()
      } else {
        handleJoinGroupChat()
      }
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
            <>
              <div className="group-action-tabs">
                <button 
                  className={`action-tab ${groupAction === "create" ? "active" : ""}`}
                  onClick={() => setGroupAction("create")}
                >
                  <PlusOutlined /> 创建群聊
                </button>
                <button 
                  className={`action-tab ${groupAction === "join" ? "active" : ""}`}
                  onClick={() => setGroupAction("join")}
                >
                  <UserAddOutlined /> 加入群聊
                </button>
              </div>
              
              {groupAction === "create" ? (
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
                    <label>添加群成员</label>
                <div className="search-container">
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="搜索用户"
                        onKeyPress={(e) => e.key === "Enter" && handleSearch()}
                  />
                  <button className="search-button" onClick={handleSearch}>
                    <SearchOutlined />
                  </button>
                </div>

                    <div className="search-results">
                {selectedMembers.length === 0 ? (
                        <p className="search-placeholder">搜索并添加群成员</p>
                ) : (
                  <div className="selected-members">
                    <div className="member-list">
                      {selectedMembers.map((member) => (
                        <div key={member.userID} className="member-item">
                                {member.nick}
                          <button
                            className="remove-member"
                                  onClick={() =>
                                    setSelectedMembers(selectedMembers.filter((m) => m.userID !== member.userID))
                                  }
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
                </div>
              ) : (
                <div className="join-group-form">
                  <div className="form-group">
                    <label htmlFor="groupId">群组ID</label>
                    <input
                      id="groupId"
                      type="text"
                      value={groupId}
                      onChange={(e) => setGroupId(e.target.value)}
                      placeholder="输入要加入的群组ID"
                    />
                  </div>
                  <p className="form-tip">加入群聊需要知道群组ID，您可以向群组管理员获取。</p>
                </div>
              )}
            </>
          )}
        </div>

        <div className="modal-footer">
          <button className="cancel-button" onClick={onClose}>
            取消
          </button>
          <button
            className="create-button"
            onClick={handleCreate}
            disabled={
              (activeTab === "single" && !userId.trim()) || 
              (activeTab === "group" && groupAction === "create" && !groupName.trim()) ||
              (activeTab === "group" && groupAction === "join" && !groupId.trim())
            }
          >
            {activeTab === "single" ? "创建" : groupAction === "create" ? "创建" : "加入"}
          </button>
        </div>
      </div>
    </div>
  )
}

export default CreateChatModal
