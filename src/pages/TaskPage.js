"use client"

import { Typography, Card, Space, Tabs } from "antd"
import { FileOutlined } from "@ant-design/icons"
import { useNavigate, useLocation } from "react-router-dom"

const { Title, Text } = Typography
const { TabPane } = Tabs

const TaskPage = () => {
  const navigate = useNavigate()
  const location = useLocation()

  const handleTabChange = (key) => {
    navigate(key)
  }

  return (
    <div>
      <Title level={2}>
        <Space>
          <FileOutlined />
          任务
        </Space>
      </Title>
      <Card bordered={false}>
        <Tabs
          defaultActiveKey="/tasks"
          activeKey={location.pathname === "/tasks" ? "/tasks" : location.pathname}
          onChange={handleTabChange}
        >
          <TabPane tab="所有任务" key="/tasks">
            <Text>所有任务页面内容</Text>
          </TabPane>
          <TabPane tab="我的任务" key="/tasks/my">
            <Text>我的任务页面内容</Text>
          </TabPane>
          <TabPane tab="团队任务" key="/tasks/team">
            <Text>团队任务页面内容</Text>
          </TabPane>
        </Tabs>
      </Card>
    </div>
  )
}

export default TaskPage
