import React, { useEffect, useState } from 'react';

import { LoadingOutlined } from '@ant-design/icons';
import { Head, router } from '@inertiajs/react';
import { Spin, Result } from 'antd';

import AuthLayout from '@/Layouts/AuthLayout';
import useAuthStore from '@/Stores/authStore';

interface SocialCallbackProps {
  provider: 'google' | 'facebook' | 'github';
  code: string;
}

const SocialCallback: React.FC<SocialCallbackProps> = ({ provider, code }) => {
  const { handleSocialLogin } = useAuthStore();
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const processSocialLogin = async () => {
      try {
        await handleSocialLogin(provider, code);
        router.visit('/dashboard');
      } catch (err: any) {
        console.error('Social login error:', err);
        setError(
          err.response?.data?.message || 'Failed to complete social login',
        );
      }
    };

    processSocialLogin();
  }, [provider, code, handleSocialLogin]);

  return (
    <AuthLayout
      title={`${provider.charAt(0).toUpperCase() + provider.slice(1)} Login`}
      description="Completing your login..."
    >
      <Head
        title={`${provider.charAt(0).toUpperCase() + provider.slice(1)} Login`}
      />

      {error ? (
        <Result
          status="error"
          title="Login Failed"
          subTitle={error}
          extra={[
            <a href="/login" key="login" className="ant-btn ant-btn-primary">
              Return to Login
            </a>,
          ]}
        />
      ) : (
        <div className="text-center py-12">
          <Spin indicator={<LoadingOutlined style={{ fontSize: 48 }} spin />} />
          <div className="mt-6 text-lg">
            Completing your {provider} login...
          </div>
          <p className="text-gray-500 mt-2">
            Please wait while we authenticate your account.
          </p>
        </div>
      )}
    </AuthLayout>
  );
};

export default SocialCallback;
