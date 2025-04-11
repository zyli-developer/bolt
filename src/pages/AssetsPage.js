"use client"

import { Typography, Card, Space, Tabs } from "antd"
import { AppstoreOutlined } from "@ant-design/icons"
import { useNavigate, useLocation } from "react-router-dom"

const { Title, Text } = Typography
const { TabPane } = Tabs

const AssetsPage = () => {
  const navigate = useNavigate()
  const location = useLocation()

  const handleTabChange = (key) => {
    navigate(key)
  }

  return (
    <div>
      <Title level={2}>
        <Space>
          <AppstoreOutlined />
          资产
        </Space>
      </Title>
      <Card bordered={false}>
        <Tabs
          defaultActiveKey="/assets"
          activeKey={location.pathname === "/assets" ? "/assets" : location.pathname}
          onChange={handleTabChange}
        >
          <TabPane tab="所有资产" key="/assets">
            <Text>所有资产页面内容</Text>
          </TabPane>
          <TabPane tab="模板" key="/assets/templates">
            <Text>模板资产页面内容</Text>
          </TabPane>
          <TabPane tab="场景" key="/assets/scenes">
            <Text>场景资产页面内容</Text>
          </TabPane>
        </Tabs>
      </Card>
    </div>
  )
}

export default AssetsPage
