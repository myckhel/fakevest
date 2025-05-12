import React, { useState } from 'react';

import { CheckCircleOutlined, MailOutlined } from '@ant-design/icons';
import { Head, Link } from '@inertiajs/react';
import { Alert, Button, Card, Space, Typography } from 'antd';

import API from '@/Apis';
import AuthLayout from '@/Layouts/AuthLayout';
import { useAuthUser } from '@/Stores/authStore';

const { Title, Paragraph } = Typography;

const EmailVerification: React.FC = () => {
  const user = useAuthUser();
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const resendVerification = async () => {
    setLoading(true);
    setError(null);

    try {
      await API.auth.resendEmailVerification();
      setSuccess(true);
    } catch (err: any) {
      setError(
        err.response?.data?.message || 'Failed to resend verification email.',
      );
    } finally {
      setLoading(false);
    }
  };

  if (!user) {
    return (
      <AuthLayout title="Email Verification Required">
        <Head title="Verify Email" />
        <Alert
          message="Authentication Required"
          description="Please log in to access this page."
          type="warning"
          showIcon
          className="mb-6"
        />
        <div className="flex justify-center">
          <Link href="/login">
            <Button type="primary" size="large">
              Go to Login
            </Button>
          </Link>
        </div>
      </AuthLayout>
    );
  }

  if (user.email_verified_at) {
    return (
      <AuthLayout title="Email Verified">
        <Head title="Email Verified" />
        <div className="text-center py-8">
          <CheckCircleOutlined style={{ fontSize: '64px', color: '#52c41a' }} />
          <Title level={2} className="mt-4">
            Email Already Verified
          </Title>
          <Paragraph className="mb-6">
            Your email address has been verified. You can now access all
            features of your account.
          </Paragraph>
          <Link href="/dashboard">
            <Button type="primary" size="large">
              Go to Dashboard
            </Button>
          </Link>
        </div>
      </AuthLayout>
    );
  }

  return (
    <AuthLayout
      title="Verify Your Email"
      description="Please verify your email address to continue"
    >
      <Head title="Verify Email" />

      <Card className="text-center">
        <MailOutlined
          style={{ fontSize: '48px', color: '#1890ff', marginBottom: '16px' }}
        />

        <Paragraph>
          Thanks for signing up! Before getting started, could you verify your
          email address by clicking on the link we just emailed to you? If you
          didn't receive the email, we will gladly send you another.
        </Paragraph>

        {success && (
          <Alert
            message="Verification link sent!"
            description={`A new verification link has been sent to ${user.email}.`}
            type="success"
            showIcon
            className="my-4"
          />
        )}

        {error && (
          <Alert
            message="Error"
            description={error}
            type="error"
            showIcon
            className="my-4"
          />
        )}

        <Space direction="vertical" size="middle" className="w-full mt-6">
          <Button
            type="primary"
            onClick={resendVerification}
            loading={loading}
            disabled={success}
          >
            Resend Verification Email
          </Button>

          <Link href="/logout">
            <Button type="link">Log Out</Button>
          </Link>
        </Space>
      </Card>
    </AuthLayout>
  );
};

export default EmailVerification;
