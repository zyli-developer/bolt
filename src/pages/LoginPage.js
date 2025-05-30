import React, { useState, useEffect } from "react";
import { Form, Input, Button, Checkbox, message, Typography, Spin, Alert } from "antd";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import loginLeft from '../styles/images/login-left.png';
import loginTitle from '../styles/images/login-title.png';
const { Title } = Typography;

const LoginPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { login, isAuthenticated } = useAuth();
  const [loading, setLoading] = useState(false);
  const [loginError, setLoginError] = useState("");
  const [checked, setChecked] = useState(false);
  const [loginType, setLoginType] = useState("phone"); // "phone" | "account" | "sso"

  useEffect(() => {
    if (isAuthenticated) {
      const from = location.state?.from?.pathname || "/";
      navigate(from, { replace: true });
    }
  }, [isAuthenticated, navigate, location]);

  const onFinish = async (values) => {
    try {
      setLoading(true);
      setLoginError("");
      const success = await login({
        username: values.username || values.phone,
        password: values.password || values.code,
      });
      if (success) {
        message.success("登录成功");
      } else {
        setLoginError("账号/密码或验证码错误，请检查并修改");
      }
    } catch (error) {
      setLoginError("账号/密码或验证码错误，请检查并修改");
    } finally {
      setLoading(false);
    }
  };

  // 登录方式切换
  const switchLoginType = (type) => setLoginType(type);

  return (
    <div className="min-h-screen w-full flex">
      {/* 左侧图片区 */}
      <div className="hidden md:flex flex-1 items-center justify-center  h-screen rounded-r-[42px]">
        <img src={loginLeft} alt="login left" className="w-full h-full " />
      </div>
      {/* 右侧登录表单区 */}
      <div className="flex flex-col flex-1 items-center justify-center bg-white min-h-screen px-8">
        {/* Logo与标题 */}
        <div className="flex flex-col items-center mb-8">
          <div className="flex items-center gap-2 mb-2">
            <span className="text-[32px] font-normal text-[#122415] font-opposans">登录到</span>
            <img src={loginTitle} alt="SynTrust" className="h-10 align-middle" />
          </div>
        </div>
        {/* 登录方式切换 */}
        <div className="flex w-full max-w-[400px]  rounded-[29px] mb-8 overflow-hidden">
          <button
            className={`flex-1 py-3 text-[18px] font-opposans transition-colors ${loginType === "phone" ? "bg-[#122415] text-white" : "text-[#122415]"}`}
            onClick={() => switchLoginType("phone")}
          >
            验证码登录
          </button>
          <button
            className={`flex-1 py-3 text-[18px] font-opposans transition-colors ${loginType === "account" ? "bg-[#122415] text-white" : "text-[#122415]"}`}
            onClick={() => switchLoginType("account")}
          >
            账号登录
          </button>
          <button
            className={`flex-1 py-3 text-[18px] font-opposans transition-colors ${loginType === "sso" ? "bg-[#122415] text-white" : "text-[#122415]"}`}
            onClick={() => switchLoginType("sso")}
          >
            SSO登录
          </button>
        </div>
        {/* 登录表单 */}
        <Form
          name="login-form"
          initialValues={{ remember: true }}
          onFinish={onFinish}
          size="large"
          className="w-full max-w-[400px]"
        >
          {loginType === "phone" && (
            <>
              <Form.Item
                name="phone"
                rules={[{ required: true, message: "请输入手机号" }]}
                className="mb-2"
              >
                <Input
                  className="rounded-[29px] h-12 bg-[#F7F9F8] border border-[#E76F51] px-4 text-base"
                  placeholder="手机号"
                  prefix={<span className="text-[#5D6D67] mr-2">+86</span>}
                />
              </Form.Item>
              <Form.Item
                name="code"
                rules={[{ required: true, message: "请输入验证码" }]}
                className="mb-2"
              >
                <Input
                  className="rounded-[23px] h-12 bg-[#F7F9F8] border border-[#5D6D67] px-4 text-base"
                  placeholder="请输入6位短信验证码"
                  suffix={<Button type="link" className="text-[#006FFD] px-0">获取验证码</Button>}
                />
              </Form.Item>
            </>
          )}
          {loginType === "account" && (
            <>
              <Form.Item
                name="username"
                rules={[{ required: true, message: "请输入用户名" }]}
                className="mb-2"
              >
                <Input
                  className="rounded-[29px] h-12 bg-[#F7F9F8] border border-[#E76F51] px-4 text-base"
                  placeholder="用户名"
                />
              </Form.Item>
              <Form.Item
                name="password"
                rules={[{ required: true, message: "请输入密码" }]}
                className="mb-2"
              >
                <Input.Password
                  className="rounded-[23px] h-12 bg-[#F7F9F8] border border-[#5D6D67] px-4 text-base"
                  placeholder="密码"
                />
              </Form.Item>
            </>
          )}
          {loginType === "sso" && (
            <div className="w-full flex flex-col items-center py-8">
              <span className="text-[#5D6D67] text-lg">请使用企业SSO登录</span>
            </div>
          )}
          {/* 协议勾选 */}
          <Form.Item className="mb-4">
            <Checkbox checked={checked} onChange={e => setChecked(e.target.checked)}>
              <span className="text-xs text-[#122415]">
                勾选即代表您已阅读并同意我们的
                <a href="#" className="text-[#58BD6D] underline mx-1">用户协议</a>
                与
                <a href="#" className="text-[#58BD6D] underline mx-1">隐私政策</a>，未注册的手机号将自动注册
              </span>
            </Checkbox>
          </Form.Item>
          {/* 错误提示 */}
          {loginError && (
            <Alert message={loginError} type="error" showIcon className="mb-4" />
          )}
          {/* 登录按钮 */}
          <Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              className="w-full h-12 rounded-[24px] text-base font-inter bg-[#122415] hover:bg-[#58BD6D] border-none"
              loading={loading}
              disabled={!checked}
            >
              登录/注册
            </Button>
          </Form.Item>
        </Form>
      </div>
    </div>
  );
};

export default LoginPage; 