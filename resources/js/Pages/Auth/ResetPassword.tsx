import React, { useEffect, useState } from 'react';

import { LockOutlined, MailOutlined } from '@ant-design/icons';
import { Head, Link, router, usePage } from '@inertiajs/react';
import { Alert, Button, Form, Input, message } from 'antd';

import AuthLayout from '@/Layouts/AuthLayout';
import { inertiaApi } from '@/Utils/inertiaApi';

interface Props {
  token: string;
  email: string;
  errors: Record<string, string>;
  status?: string;
}

const ResetPassword: React.FC = () => {
  const { token, email, errors, status } = usePage<Props>().props;
  const [loading, setLoading] = useState(false);

  // Display flash messages from server
  useEffect(() => {
    if (status) {
      message.success(status);

      // Redirect to login after successful password reset
      setTimeout(() => {
        router.visit('/login');
      }, 2000);
    }

    if (Object.keys(errors).length > 0) {
      Object.values(errors).forEach((error) => {
        message.error(error);
      });
    }
  }, [errors, status]);

  const handleSubmit = (values: {
    email: string;
    password: string;
    password_confirmation: string;
  }) => {
    setLoading(true);

    // Use inertiaApi utility to ensure proper /api/v1 base path
    inertiaApi.post(
      'auth/password/reset',
      {
        token,
        email: values.email,
        password: values.password,
        password_confirmation: values.password_confirmation,
      },
      {
        onFinish: () => {
          setLoading(false);
        },
        preserveScroll: true,
      },
    );
  };

  return (
    <AuthLayout
      title="Set New Password"
      description="Create a new password for your account"
    >
      <Head title="Reset Password" />

      {status && (
        <Alert
          message="Success"
          description={status}
          type="success"
          showIcon
          className="mb-4"
        />
      )}

      <Form
        name="resetPassword"
        layout="vertical"
        className="mt-8 space-y-6"
        onFinish={handleSubmit}
        initialValues={{ email }}
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
            readOnly={!!email}
          />
        </Form.Item>

        <Form.Item
          name="password"
          rules={[
            { required: true, message: 'Please enter your new password' },
            { min: 8, message: 'Password must be at least 8 characters' },
          ]}
          validateStatus={errors.password ? 'error' : ''}
          help={errors.password}
        >
          <Input.Password
            prefix={<LockOutlined className="site-form-item-icon" />}
            placeholder="New Password"
            size="large"
          />
        </Form.Item>

        <Form.Item
          name="password_confirmation"
          dependencies={['password']}
          rules={[
            { required: true, message: 'Please confirm your password' },
            ({ getFieldValue }) => ({
              validator(_, value) {
                if (!value || getFieldValue('password') === value) {
                  return Promise.resolve();
                }
                return Promise.reject(
                  new Error('The two passwords do not match'),
                );
              },
            }),
          ]}
          validateStatus={errors.password_confirmation ? 'error' : ''}
          help={errors.password_confirmation}
        >
          <Input.Password
            prefix={<LockOutlined className="site-form-item-icon" />}
            placeholder="Confirm New Password"
            size="large"
          />
        </Form.Item>

        <Form.Item>
          <Button
            type="primary"
            htmlType="submit"
            size="large"
            className="w-full"
            loading={loading}
            disabled={!!status}
          >
            Reset Password
          </Button>
        </Form.Item>

        <div className="text-center mt-4">
          <p>
            Remember your password?{' '}
            <Link href="/login" className="text-blue-600 hover:underline">
              Sign in
            </Link>
          </p>
        </div>
      </Form>
    </AuthLayout>
  );
};

export default ResetPassword;
