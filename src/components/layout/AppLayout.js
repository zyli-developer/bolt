"use client"
import { Layout } from "antd"
import { MessageOutlined } from "@ant-design/icons"
import AppHeader from "./AppHeader"
import AppSidebar from "../sidebar/AppSidebar"
import ChatArea from "../chat/ChatArea"
import { useChatContext } from "../../contexts/ChatContext"

const { Content } = Layout

const AppLayout = ({ children }) => {
  const { isChatOpen, toggleChat } = useChatContext()

  return (
    <Layout style={{ height: "100vh", display: "flex", flexDirection: "column", overflow: "hidden" }}>
      <AppHeader />
      <Layout style={{ flex: 1, display: "flex", flexDirection: "row", overflow: "hidden" }}>
        <AppSidebar />
        <Layout style={{ flex: isChatOpen ? 2 : 1, overflow: "hidden" }}>
          <Content
            style={{
              margin: "16px",
              padding: 16,
              background: "#fff",
              borderRadius: 8,
              overflow: "auto",
              height: "calc(100% - 32px)",
            }}
          >
            {children}
          </Content>
        </Layout>
        {isChatOpen && (
          <div style={{ flex: 1, maxWidth: "33.33%", padding: "16px 16px 16px 0" }}>
            <ChatArea />
          </div>
        )}
      </Layout>
      {!isChatOpen && (
        <div style={{ position: "fixed", bottom: 24, right: 24 }}>
          <button
            onClick={toggleChat}
            className="chat-floating-button"
            style={{
              backgroundColor: "#006ffd",
              width: "56px",
              height: "56px",
              borderRadius: "50%",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "white",
              border: "none",
              boxShadow: "0 4px 12px rgba(0, 111, 253, 0.4)",
              cursor: "pointer",
            }}
          >
            <MessageOutlined style={{ fontSize: 24 }} />
          </button>
        </div>
      )}
    </Layout>
  )
}

export default AppLayout
