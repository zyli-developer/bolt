"use client"
import { Button, Typography } from "antd"
import { SendOutlined } from "@ant-design/icons"

const { Text } = Typography

const QuickSendPanel = ({ onSend }) => {
  return (
    <div className="quick-send-panel">
      <Text type="secondary">拖动元素到这里，快速发送</Text>
      <div style={{ marginTop: 16 }}>
        <Button type="primary" shape="circle" icon={<SendOutlined />} onClick={onSend} />
      </div>
    </div>
  )
}

export default QuickSendPanel
