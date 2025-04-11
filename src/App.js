import AppLayout from "./components/layout/AppLayout"
import { ChatProvider } from "./contexts/ChatContext"
import AppRouter from "./router"

function App() {
  return (
    <ChatProvider>
      <AppLayout>
        <AppRouter />
      </AppLayout>
    </ChatProvider>
  )
}

export default App
