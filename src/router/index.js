import { Routes, Route } from "react-router-dom"
import ExplorePage from "../pages/ExplorePage"
import TaskPage from "../pages/TaskPage"
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

const assetsRoutes = [
  {
    path: "/assets/templates",
    element: <div>模板资产页面</div>,
  },
  {
    path: "/assets/my-templates",
    element: <div>我的模板页面</div>,
  },
  {
    path: "/assets/others-templates",
    element: <div>别人的模板页面</div>,
  },
]

// 主路由配置
const mainRoutes = [
  {
    path: "/",
    element: <ExplorePage />,
  },
  {
    path: "/explore",
    element: <ExplorePage />,
  },
  {
    path: "/tasks",
    element: <TaskPage />,
  },
  {
    path: "/assets",
    element: <AssetsPage />,
  },
]

// 所有路由配置
const allRoutes = [...mainRoutes, ...taskRoutes, ...assetsRoutes]

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
