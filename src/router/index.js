import { Routes, Route } from "react-router-dom"
import HomePage from "../pages/HomePage"
import TaskPage from "../pages/TaskPage"
import ContactsPage from "../pages/ContactsPage"
import AssetsPage from "../pages/AssetsPage"

// 子路由配置
const taskRoutes = [
  {
    path: "/tasks/my",
    element: <div>我的任务页面</div>,
  },
  {
    path: "/tasks/team",
    element: <div>团队任务页面</div>,
  },
]

const contactsRoutes = [
  {
    path: "/contacts/jackson",
    element: <div>Jackson联系人页面</div>,
  },
  {
    path: "/contacts/finance",
    element: <div>财务部联系人页面</div>,
  },
]

const assetsRoutes = [
  {
    path: "/assets/templates",
    element: <div>模板资产页面</div>,
  },
  {
    path: "/assets/scenes",
    element: <div>场景资产页面</div>,
  },
]

// 主路由配置
const mainRoutes = [
  {
    path: "/",
    element: <HomePage />,
  },
  {
    path: "/tasks",
    element: <TaskPage />,
  },
  {
    path: "/contacts",
    element: <ContactsPage />,
  },
  {
    path: "/assets",
    element: <AssetsPage />,
  },
]

// 所有路由配置
const allRoutes = [...mainRoutes, ...taskRoutes, ...contactsRoutes, ...assetsRoutes]

// 路由组件
const AppRouter = () => {
  return (
    <Routes>
      {allRoutes.map((route, index) => (
        <Route key={index} path={route.path} element={route.element} />
      ))}
    </Routes>
  )
}

export default AppRouter
