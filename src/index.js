import React from "react"
import ReactDOM from "react-dom/client"
import { BrowserRouter } from "react-router-dom"
import App from "./App"
import { ConfigProvider } from "antd"
import zhCN from "antd/lib/locale/zh_CN"
import "./index.css"
import "./components/sidebar/sidebar-styles.css" // 导入侧边栏样式
import "./components/card/task-card.css" // 导入任务卡片样式
import "./components/card/task-detail.css" // 导入任务详情页样式
import "./components/card/card-detail.css" // 导入卡片详情页样式

// 启用MSW进行API模拟
import { worker } from "./mocks/browser"
if (process.env.NODE_ENV === "development") {
  worker.start()
}

const root = ReactDOM.createRoot(document.getElementById("root"))
root.render(
  <React.StrictMode>
    <ConfigProvider
      locale={zhCN}
      theme={{
        token: {
          colorPrimary: "#006ffd",
          colorSuccess: "#3ac0a0",
          colorError: "#ffe2e5",
          colorTextBase: "#1f2024",
          colorTextSecondary: "#71727a",
          colorTextTertiary: "#8f9098",
          colorBorder: "#c5c6cc",
          colorBgContainer: "#ffffff",
          colorBgLayout: "#f8f9fe",
        },
      }}
    >
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </ConfigProvider>
  </React.StrictMode>,
)
