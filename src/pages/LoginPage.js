import React, { useState, useEffect } from "react";
import { Form, Input, Button, Card, message, Typography, Spin, Alert } from "antd";
import { UserOutlined, LockOutlined } from "@ant-design/icons";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

const { Title } = Typography;

const LoginPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { login, isAuthenticated } = useAuth();
  const [loading, setLoading] = useState(false);
  const [loginError, setLoginError] = useState("");

  // 如果已经登录，重定向到首页或之前尝试访问的页面
  useEffect(() => {
    if (isAuthenticated) {
      const from = location.state?.from?.pathname || "/";
      navigate(from, { replace: true });
    }
  }, [isAuthenticated, navigate, location]);

  const onFinish = async (values) => {
    try {
      setLoading(true);
      setLoginError(""); // 清除之前的错误提示
      
      const success = await login({
        username: values.username,
        password: values.password,
      });
      
      if (success) {
        message.success("登录成功");
      } else {
        setLoginError("账号/密码错误，请检查并修改");
      }
    } catch (error) {
      setLoginError("账号/密码错误，请检查并修改");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      <div className="login-card-wrapper">
        <Card className="login-card">
          <div className="login-header">
            <img 
              src="/syntrust.png"
              alt="SynTrust Logo" 
              style={{ 
                width: "80px", 
                height: "80px", 
                marginBottom: "16px" 
              }} 
            />
            <Title level={2} className="login-title">SynTrust</Title>
            <p className="login-subtitle">请输入您的账号和密码</p>
          </div>
          
          {loginError && (
            <Alert
              message={loginError}
              type="error"
              showIcon
              style={{ marginBottom: 16 }}
            />
          )}
          
          <Form
            name="login-form"
            initialValues={{ remember: true }}
            onFinish={onFinish}
            size="large"
            className="login-form"
          >
            <Form.Item
              name="username"
              rules={[{ required: true, message: "请输入用户名" }]}
            >
              <Input 
                prefix={<UserOutlined className="site-form-item-icon" />} 
                placeholder="用户名" 
              />
            </Form.Item>

            <Form.Item
              name="password"
              rules={[{ required: true, message: "请输入密码" }]}
            >
              <Input.Password
                prefix={<LockOutlined className="site-form-item-icon" />}
                type="password"
                placeholder="密码"
              />
            </Form.Item>

            <Form.Item>
              <Button
                type="primary"
                htmlType="submit"
                className="login-form-button"
                loading={loading}
                block
              >
                登录
              </Button>
            </Form.Item>
            
            
          </Form>
        </Card>
      </div>
    </div>
  );
};

export default LoginPage; 