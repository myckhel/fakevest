import React, { useState } from "react";
import { Link } from "@inertiajs/react";
import { Card, Form, Input, Button, Checkbox, Divider } from "antd";
import {
  UserOutlined,
  LockOutlined,
  GoogleOutlined,
  GithubOutlined,
  FacebookOutlined,
} from "@ant-design/icons";
import useAuthStore, { useAuthLoading } from "@/Stores/authStore";
import useUIStore from "@/Stores/uiStore";

const Login: React.FC = () => {
  // Use selector hooks for targeted re-renders
  const isLoading = useAuthLoading();
  const darkMode = useUIStore((state) => state.darkMode);

  // Access actions directly from the store
  const { login, getSocialLoginUrl } = useAuthStore();
  const { showToast } = useUIStore();

  const [form] = Form.useForm();
  const [socialLoading, setSocialLoading] = useState<{
    [key: string]: boolean;
  }>({
    google: false,
    github: false,
    facebook: false,
  });

  // Handle login form submission
  const handleLogin = async (values: {
    email: string;
    password: string;
    remember: boolean;
  }) => {
    try {
      await login({
        email: values.email,
        password: values.password,
        remember: values.remember,
      });
      // Redirect will happen automatically via the login action
    } catch (error) {
      console.error("Login failed:", error);
      showToast("Invalid email or password. Please try again.", "error");
    }
  };

  // Handle social login
  const handleSocialAuth = async (
    provider: "google" | "github" | "facebook"
  ) => {
    try {
      setSocialLoading({ ...socialLoading, [provider]: true });

      // Get the OAuth URL for the provider
      const url = await getSocialLoginUrl(provider);

      // Redirect to OAuth provider
      window.location.href = url;
    } catch (error) {
      console.error(`${provider} login failed:`, error);
      showToast(
        `Failed to connect with ${
          provider.charAt(0).toUpperCase() + provider.slice(1)
        }.`,
        "error"
      );
      setSocialLoading({ ...socialLoading, [provider]: false });
    }
  };

  return (
    <div
      className={`min-h-screen flex items-center justify-center p-6 ${
        darkMode ? "bg-gray-900" : "bg-gray-100"
      }`}
    >
      <Card
        className={`w-full max-w-md ${
          darkMode ? "bg-gray-800 text-white" : "bg-white"
        }`}
        title={
          <div className="text-center">
            <h1
              className={`text-2xl font-bold ${
                darkMode ? "text-white" : "text-gray-800"
              }`}
            >
              Login to FakeVest
            </h1>
            <p
              className={`text-sm ${
                darkMode ? "text-gray-300" : "text-gray-600"
              }`}
            >
              Enter your credentials to access your account
            </p>
          </div>
        }
      >
        <Form
          form={form}
          name="login"
          initialValues={{ remember: true }}
          onFinish={handleLogin}
          layout="vertical"
        >
          <Form.Item
            name="email"
            rules={[
              { required: true, message: "Please enter your email" },
              { type: "email", message: "Please enter a valid email address" },
            ]}
          >
            <Input prefix={<UserOutlined />} placeholder="Email" size="large" />
          </Form.Item>

          <Form.Item
            name="password"
            rules={[{ required: true, message: "Please enter your password" }]}
          >
            <Input.Password
              prefix={<LockOutlined />}
              placeholder="Password"
              size="large"
            />
          </Form.Item>

          <Form.Item>
            <div className="flex justify-between items-center">
              <Form.Item name="remember" valuePropName="checked" noStyle>
                <Checkbox>Remember me</Checkbox>
              </Form.Item>
              <Link
                href="/forgot-password"
                className="text-blue-500 hover:underline"
              >
                Forgot password?
              </Link>
            </div>
          </Form.Item>

          <Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              size="large"
              block
              loading={isLoading}
              className="bg-blue-600 hover:bg-blue-700"
            >
              Log in
            </Button>
          </Form.Item>

          <div className="text-center">
            <p className={darkMode ? "text-gray-300" : "text-gray-600"}>
              Don't have an account?{" "}
              <Link href="/register" className="text-blue-500 hover:underline">
                Register now
              </Link>
            </p>
          </div>

          <Divider className={darkMode ? "border-gray-700" : "border-gray-200"}>
            <span className={darkMode ? "text-gray-400" : "text-gray-500"}>
              Or login with
            </span>
          </Divider>

          <div className="grid grid-cols-3 gap-4">
            <Button
              icon={<GoogleOutlined />}
              size="large"
              onClick={() => handleSocialAuth("google")}
              loading={socialLoading.google}
              className={darkMode ? "hover:bg-gray-700" : ""}
            >
              Google
            </Button>
            <Button
              icon={<GithubOutlined />}
              size="large"
              onClick={() => handleSocialAuth("github")}
              loading={socialLoading.github}
              className={darkMode ? "hover:bg-gray-700" : ""}
            >
              GitHub
            </Button>
            <Button
              icon={<FacebookOutlined />}
              size="large"
              onClick={() => handleSocialAuth("facebook")}
              loading={socialLoading.facebook}
              className={darkMode ? "hover:bg-gray-700" : ""}
            >
              Facebook
            </Button>
          </div>
        </Form>
      </Card>
    </div>
  );
};

export default Login;
