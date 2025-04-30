import React, { useState } from "react";
import { Head, Link, router } from "@inertiajs/react";
import { Button, Form, Input, Divider, message } from "antd";
import {
  LockOutlined,
  MailOutlined,
  GithubOutlined,
  GoogleOutlined,
  FacebookOutlined,
} from "@ant-design/icons";
import AuthLayout from "@/Layouts/AuthLayout";
import useAuthStore from "@/Stores/authStore";

const Login: React.FC = () => {
  const { login, getSocialLoginUrl } = useAuthStore();
  const [loading, setLoading] = useState(false);
  const [socialLoading, setSocialLoading] = useState<{
    google: boolean;
    facebook: boolean;
    github: boolean;
  }>({
    google: false,
    facebook: false,
    github: false,
  });

  const handleLogin = async (values: { email: string; password: string }) => {
    setLoading(true);
    try {
      await login({
        email: values.email,
        password: values.password,
        device_type: "web",
        device_name: navigator.userAgent,
      });

      router.visit("/dashboard");
    } catch (error: any) {
      const errorMessage =
        error.response?.data?.message || "Failed to log in. Please try again.";
      message.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleSocialLogin = async (
    provider: "google" | "github" | "facebook"
  ) => {
    setSocialLoading({ ...socialLoading, [provider]: true });

    try {
      const url = await getSocialLoginUrl(provider);
      router.visit(url);
    } catch (error) {
      message.error(`Failed to initialize ${provider} login`);
    } finally {
      setSocialLoading({ ...socialLoading, [provider]: false });
    }
  };

  return (
    <AuthLayout title="Sign In" description="Welcome back to FakeVest">
      <Head title="Login" />

      <Form
        name="login"
        layout="vertical"
        className="mt-8 space-y-6"
        onFinish={handleLogin}
        initialValues={{ remember: true }}
      >
        <Form.Item
          name="email"
          rules={[
            { required: true, message: "Please enter your email" },
            { type: "email", message: "Please enter a valid email" },
          ]}
        >
          <Input
            prefix={<MailOutlined className="site-form-item-icon" />}
            placeholder="Email"
            size="large"
          />
        </Form.Item>

        <Form.Item
          name="password"
          rules={[{ required: true, message: "Please enter your password" }]}
        >
          <Input.Password
            prefix={<LockOutlined className="site-form-item-icon" />}
            placeholder="Password"
            size="large"
          />
        </Form.Item>

        <div className="flex items-center justify-between">
          <Link
            href="/forgot-password"
            className="text-sm font-medium text-blue-600 hover:underline"
          >
            Forgot your password?
          </Link>
        </div>

        <Form.Item>
          <Button
            type="primary"
            htmlType="submit"
            size="large"
            className="w-full"
            loading={loading}
          >
            Sign In
          </Button>
        </Form.Item>

        <Divider>Or sign in with</Divider>

        <div className="flex justify-center space-x-4">
          <Button
            type="default"
            icon={<GoogleOutlined />}
            onClick={() => handleSocialLogin("google")}
            loading={socialLoading.google}
          >
            Google
          </Button>
          <Button
            type="default"
            icon={<FacebookOutlined />}
            onClick={() => handleSocialLogin("facebook")}
            loading={socialLoading.facebook}
          >
            Facebook
          </Button>
          <Button
            type="default"
            icon={<GithubOutlined />}
            onClick={() => handleSocialLogin("github")}
            loading={socialLoading.github}
          >
            GitHub
          </Button>
        </div>

        <div className="text-center mt-4">
          <p>
            Don't have an account?{" "}
            <Link href="/register" className="text-blue-600 hover:underline">
              Sign up
            </Link>
          </p>
        </div>
      </Form>
    </AuthLayout>
  );
};

export default Login;
