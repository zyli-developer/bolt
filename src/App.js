import { BrowserRouter } from "react-router-dom"
import AppRouter from "./router"
import AppLayout from "./components/layout/AppLayout"
import { ChatProvider } from "./contexts/ChatContext"
import { NavProvider } from "./contexts/NavContext"
import { OptimizationProvider } from "./contexts/OptimizationContext"

function App() {
  return (
    <BrowserRouter>
      <NavProvider>
        <ChatProvider>
          <OptimizationProvider>
            <AppLayout>
              <AppRouter />
            </AppLayout>
          </OptimizationProvider>
        </ChatProvider>
      </NavProvider>
    </BrowserRouter>
  )
}

export default App
