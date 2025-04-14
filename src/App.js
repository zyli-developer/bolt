"use client"

import { useEffect } from "react"
import AppLayout from "./components/layout/AppLayout"
import { ChatProvider } from "./contexts/ChatContext"
import AppRouter from "./router"

function App() {
  // 在组件挂载时启用MSW
  useEffect(() => {
    if (process.env.NODE_ENV === "development") {
      const enableMocking = async () => {
        try {
          const { worker } = await import("./mocks/browser")
          await worker.start({
            onUnhandledRequest: "bypass", // 对于未处理的请求，直接绕过而不是警告
          })
          console.log("MSW 已启动")
        } catch (error) {
          console.error("MSW 启动失败:", error)
        }
      }

      enableMocking()
    }
  }, [])

  return (
    <ChatProvider>
      <AppLayout>
        <AppRouter />
      </AppLayout>
    </ChatProvider>
  )
}

export default App
