import { Routes, Route } from "react-router-dom"
import ExplorePage from "../pages/ExplorePage"
import TaskPage from "../pages/TaskPage"
import TaskDetailPage from "../pages/TaskDetailPage"
import CardDetailPage from "../pages/CardDetailPage"
import EvaluationPage from "../pages/EvaluationPage"
import AssetsPage from "../pages/AssetsPage"
// Import the ScenesPage
import ScenesPage from "../pages/ScenesPage"

// 确保评估页面的路由路径与TaskDetailPage中的导航路径匹配

// 子路由配置
const taskRoutes = [
  {
    path: "/tasks",
    element: <TaskPage />,
  },
  {
    path: "/tasks/detail/:id",
    element: <TaskDetailPage />,
  },
  {
    path: "/tasks/evaluate/:id",
    element: <EvaluationPage />,
  },
]

// 卡片路由
const cardRoutes = [
  {
    path: "/cards/detail/:id",
    element: <CardDetailPage />,
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

// Update the mainRoutes to use the ScenesPage component
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
  {
    path: "/scenes",
    element: <ScenesPage />,
  },
]

// 所有路由配置
const allRoutes = [...mainRoutes, ...taskRoutes, ...assetsRoutes, ...cardRoutes]

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
