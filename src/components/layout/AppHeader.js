import { Layout } from "antd"
import { ThunderboltOutlined } from "@ant-design/icons"

const { Header } = Layout

const AppHeader = () => {
  return (
    <Header
      style={{
        display: "flex",
        alignItems: "center",
        padding: 0,
        background: "#fff",
        height: 48,
        lineHeight: "48px",
        borderBottom: "1px solid #c5c6cc",
      }}
    >
      <div className="logo">
        <div className="logo-icon">
          <ThunderboltOutlined />
        </div>
        <div className="logo-text">可信AI公共服务平台</div>
      </div>
      <div className="header-banner">
        <div className="banner-content">
          <img src="/placeholder.svg?height=32&width=800" alt="活动banner" />
        </div>
      </div>
    </Header>
  )
}

export default AppHeader
