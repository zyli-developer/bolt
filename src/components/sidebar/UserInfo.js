import { Avatar, Typography, Button } from "antd"
import { UserOutlined, MenuOutlined } from "@ant-design/icons"

const { Text } = Typography

const UserInfo = () => {
  return (
    <div
      className="user-info"
      style={{
        borderTop: "1px solid #c5c6cc",
        padding: "16px",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
      }}
    >
      <div style={{ display: "flex", alignItems: "center" }}>
        <Avatar style={{ backgroundColor: "#006ffd" }} icon={<UserOutlined />} size={32} />
        <div className="user-details">
          <div className="user-name">Shadcn</div>
          <div className="user-email">me@example.com</div>
        </div>
      </div>
      <Button type="text" icon={<MenuOutlined />} size="small" />
    </div>
  )
}

export default UserInfo
