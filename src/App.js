import { BrowserRouter } from "react-router-dom"
import AppRouter from "./router"
import AppLayout from "./components/layout/AppLayout"
import { ChatProvider } from "./contexts/ChatContext"
import { NavProvider } from "./contexts/NavContext"

function App() {
  return (
    <BrowserRouter>
      <NavProvider>
        <ChatProvider>
          <AppLayout>
            <AppRouter />
          </AppLayout>
        </ChatProvider>
      </NavProvider>
    </BrowserRouter>
  )
}

export default App
