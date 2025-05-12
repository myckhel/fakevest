import React, { useState, useEffect } from 'react';

import {
  LockOutlined,
  MailOutlined,
  GithubOutlined,
  GoogleOutlined,
  FacebookOutlined,
} from '@ant-design/icons';
import { Head, Link, router, usePage } from '@inertiajs/react';
import { Button, Form, Input, Divider, message } from 'antd';
import axios from 'axios';

import AuthLayout from '@/Layouts/AuthLayout';
import useAuthStore from '@/Stores/authStore';
import { inertiaApi } from '@/utils/inertiaApi';

interface PageProps {
  errors: Record<string, string>;
  status?: string;
}

const Login: React.FC = () => {
  const { errors, status } = usePage<PageProps>().props;
  const { getSocialLoginUrl } = useAuthStore();
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

  // Display flash messages from server
  useEffect(() => {
    if (status) {
      message.success(status);
    }

    // Display validation errors
    if (Object.keys(errors).length > 0) {
      Object.values(errors).forEach((error) => {
        message.error(error);
      });
    }
  }, [errors, status]);

  const handleLogin = (values: {
    email: string;
    password: string;
    remember?: boolean;
  }) => {
    setLoading(true);
    axios.get('/sanctum/csrf-cookie').then(() => {
      // Login...
      // For web pages (not API), we use direct routes
      inertiaApi.post(
        'login',
        {
          email: values.email,
          password: values.password,
          remember: values.remember || false,
        },
        {
          onFinish: () => {
            setLoading(false);
          },
          preserveScroll: true,
          preserveState: true,
        },
      );
    });
  };

  const handleSocialLogin = async (
    provider: 'google' | 'github' | 'facebook',
  ) => {
    setSocialLoading({ ...socialLoading, [provider]: true });

    try {
      const url = await getSocialLoginUrl(provider);
      router.visit(url);
    } catch (_error) {
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
            { required: true, message: 'Please enter your email' },
            { type: 'email', message: 'Please enter a valid email' },
          ]}
          validateStatus={errors.email ? 'error' : ''}
          help={errors.email}
        >
          <Input
            prefix={<MailOutlined className="site-form-item-icon" />}
            placeholder="Email"
            size="large"
          />
        </Form.Item>

        <Form.Item
          name="password"
          rules={[{ required: true, message: 'Please enter your password' }]}
          validateStatus={errors.password ? 'error' : ''}
          help={errors.password}
        >
          <Input.Password
            prefix={<LockOutlined className="site-form-item-icon" />}
            placeholder="Password"
            size="large"
          />
        </Form.Item>

        <Form.Item name="remember" valuePropName="checked">
          <div className="flex items-center justify-between">
            <div>
              <input type="checkbox" id="remember" className="mr-2" />
              <label htmlFor="remember" className="text-sm text-gray-600">
                Remember me
              </label>
            </div>
            <Link
              href="/forgot-password"
              className="text-sm font-medium text-blue-600 hover:underline"
            >
              Forgot your password?
            </Link>
          </div>
        </Form.Item>

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
            onClick={() => handleSocialLogin('google')}
            loading={socialLoading.google}
          >
            Google
          </Button>
          <Button
            type="default"
            icon={<FacebookOutlined />}
            onClick={() => handleSocialLogin('facebook')}
            loading={socialLoading.facebook}
          >
            Facebook
          </Button>
          <Button
            type="default"
            icon={<GithubOutlined />}
            onClick={() => handleSocialLogin('github')}
            loading={socialLoading.github}
          >
            GitHub
          </Button>
        </div>

        <div className="text-center mt-4">
          <p>
            Don't have an account?{' '}
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
