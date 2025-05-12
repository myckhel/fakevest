import React, { useState, useEffect } from 'react';

import {
  UserOutlined,
  LockOutlined,
  MailOutlined,
  PhoneOutlined,
  UploadOutlined,
  GithubOutlined,
  GoogleOutlined,
  FacebookOutlined,
} from '@ant-design/icons';
import { Head, Link, router, usePage } from '@inertiajs/react';
import { Button, Form, Input, Upload, Divider, message } from 'antd';

import AuthLayout from '@/Layouts/AuthLayout';
import useAuthStore from '@/Stores/authStore';
import { inertiaApi } from '@/utils/inertiaApi';

import type { RcFile, UploadFile } from 'antd/es/upload/interface';

interface PageProps {
  errors: Record<string, string>;
  status?: string;
}

const Register: React.FC = () => {
  const { errors, status } = usePage<PageProps>().props;
  const { getSocialLoginUrl } = useAuthStore();
  const [loading, setLoading] = useState(false);
  const [fileList, setFileList] = useState<UploadFile[]>([]);
  const [socialLoading, setSocialLoading] = useState({
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

  const beforeUpload = (file: RcFile) => {
    const isImage = file.type.startsWith('image/');
    if (!isImage) {
      message.error('You can only upload image files!');
    }

    const isLt2M = file.size / 1024 / 1024 < 2;
    if (!isLt2M) {
      message.error('Image must be smaller than 2MB!');
    }

    if (isImage && isLt2M) {
      setFileList([file]);
    }

    // Return false to prevent automatic upload
    return false;
  };

  const handleRegister = (values: {
    fullname: string;
    email?: string;
    phone?: string;
    username?: string;
    password: string;
    confirm: string;
  }) => {
    setLoading(true);

    // Use FormData to handle file uploads with Inertia
    const formData = new FormData();
    formData.append('fullname', values.fullname);
    formData.append('email', values.email || '');
    if (values.phone) formData.append('phone', values.phone);
    if (values.username) formData.append('username', values.username);
    formData.append('password', values.password);
    formData.append('password_confirmation', values.confirm);

    if (fileList.length > 0 && fileList[0].originFileObj) {
      formData.append('avatar', fileList[0].originFileObj);
    }

    // Use inertiaApi to properly handle API routes with the /api/v1 prefix
    inertiaApi.post('register', formData, {
      onFinish: () => {
        setLoading(false);
      },
      preserveScroll: true,
      forceFormData: true,
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
    <AuthLayout title="Create Account" description="Join FakeVest today">
      <Head title="Register" />

      <Form
        name="register"
        layout="vertical"
        className="mt-8 space-y-6"
        onFinish={handleRegister}
      >
        <Form.Item
          name="fullname"
          rules={[
            { required: true, message: 'Please enter your full name', min: 6 },
          ]}
          validateStatus={errors.fullname ? 'error' : ''}
          help={errors.fullname}
        >
          <Input
            prefix={<UserOutlined className="site-form-item-icon" />}
            placeholder="Full Name"
            size="large"
          />
        </Form.Item>

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
          name="phone"
          rules={[
            {
              pattern: /^\d{10,11}$/,
              message: 'Please enter a valid phone number',
            },
          ]}
          validateStatus={errors.phone ? 'error' : ''}
          help={errors.phone}
        >
          <Input
            prefix={<PhoneOutlined className="site-form-item-icon" />}
            placeholder="Phone Number (optional)"
            size="large"
          />
        </Form.Item>

        <Form.Item
          name="username"
          rules={[
            { message: 'Username must be at least 3 characters', min: 3 },
          ]}
          validateStatus={errors.username ? 'error' : ''}
          help={errors.username}
        >
          <Input
            prefix={<UserOutlined className="site-form-item-icon" />}
            placeholder="Username (optional)"
            size="large"
          />
        </Form.Item>

        <Form.Item
          name="password"
          rules={[
            { required: true, message: 'Please enter your password' },
            { min: 6, message: 'Password must be at least 6 characters' },
          ]}
          validateStatus={errors.password ? 'error' : ''}
          help={errors.password}
        >
          <Input.Password
            prefix={<LockOutlined className="site-form-item-icon" />}
            placeholder="Password"
            size="large"
          />
        </Form.Item>

        <Form.Item
          name="confirm"
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
            placeholder="Confirm Password"
            size="large"
          />
        </Form.Item>

        <Form.Item
          name="avatar"
          label="Profile Picture (optional)"
          validateStatus={errors.avatar ? 'error' : ''}
          help={errors.avatar}
        >
          <Upload
            beforeUpload={beforeUpload}
            maxCount={1}
            fileList={fileList}
            onRemove={() => {
              setFileList([]);
            }}
            listType="picture"
          >
            <Button icon={<UploadOutlined />}>Select Image</Button>
          </Upload>
        </Form.Item>

        <Form.Item>
          <Button
            type="primary"
            htmlType="submit"
            size="large"
            className="w-full"
            loading={loading}
          >
            Create Account
          </Button>
        </Form.Item>

        <Divider>Or sign up with</Divider>

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
            Already have an account?{' '}
            <Link href="/login" className="text-blue-600 hover:underline">
              Sign in
            </Link>
          </p>
        </div>
      </Form>
    </AuthLayout>
  );
};

export default Register;
