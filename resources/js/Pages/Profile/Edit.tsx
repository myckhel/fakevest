import React, { useEffect, useState } from 'react';

import {
  HomeOutlined,
  LockOutlined,
  MailOutlined,
  PhoneOutlined,
  UploadOutlined,
  UserOutlined,
} from '@ant-design/icons';
import { Head, Link } from '@inertiajs/react';
import {
  Avatar,
  Button,
  Card,
  DatePicker,
  Divider,
  Form,
  Input,
  Select,
  Tabs,
  Upload,
  message,
} from 'antd';
import dayjs from 'dayjs';

import MainLayout from '@/Layouts/MainLayout';
import useAuthStore, { useAuthLoading, useAuthUser } from '@/Stores/authStore';

import type { RcFile, UploadFile } from 'antd/es/upload/interface';

const { TabPane } = Tabs;
const { TextArea } = Input;
const { Option } = Select;

const ProfileEdit: React.FC = () => {
  const searchParams = new URLSearchParams(window.location.search);
  const initialTab = searchParams.get('tab') || 'profile';

  const [activeTab, setActiveTab] = useState(initialTab);
  const [loading, setLoading] = useState({
    profile: false,
    avatar: false,
    password: false,
  });
  const [fileList, setFileList] = useState<UploadFile[]>([]);
  const [avatar, setAvatar] = useState<File | null>(null);

  const { updateProfile, updateAvatar, changePassword } = useAuthStore();
  const user = useAuthUser();
  const isLoading = useAuthLoading();

  useEffect(() => {
    if (user?.avatar?.url) {
      setFileList([
        {
          uid: '-1',
          name: 'Current Avatar',
          status: 'done',
          url: user.avatar.url,
        },
      ]);
    }
  }, [user]);

  if (isLoading || !user) {
    return (
      <MainLayout>
        <Head title="Edit Profile" />
        <Card className="w-full max-w-4xl mx-auto">
          <div className="skeleton-content"></div>
        </Card>
      </MainLayout>
    );
  }

  const handleTabChange = (key: string) => {
    setActiveTab(key);
    // Update URL without refreshing
    const url = new URL(window.location.href);
    if (key === 'profile') {
      url.searchParams.delete('tab');
    } else {
      url.searchParams.set('tab', key);
    }
    window.history.pushState({}, '', url);
  };

  const handleProfileUpdate = async (values: any) => {
    setLoading({ ...loading, profile: true });
    try {
      await updateProfile({
        fullname: values.fullname,
        username: values.username,
        phone: values.phone,
        gender: values.gender,
        dob: values.dob ? values.dob.format('YYYY-MM-DD') : undefined,
        address: values.address,
        next_of_kin: values.next_of_kin,
      });

      message.success('Profile updated successfully');
    } catch (error: any) {
      const errorData = error.response?.data;
      if (errorData?.errors) {
        const formErrors = Object.entries(errorData.errors)
          .map(([field, msgs]) => `${field}: ${msgs.join(', ')}`)
          .join('. ');

        message.error(formErrors);
      } else {
        message.error('Failed to update profile. Please try again.');
      }
    } finally {
      setLoading({ ...loading, profile: false });
    }
  };

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
      setAvatar(file);
      setFileList([file]);
    }

    // Return false to prevent automatic upload
    return false;
  };

  const handleAvatarUpload = async () => {
    if (!avatar) {
      message.error('Please select an image first');
      return;
    }

    setLoading({ ...loading, avatar: true });
    try {
      await updateAvatar(avatar);
      message.success('Avatar updated successfully');
    } catch (_error) {
      message.error('Failed to upload avatar. Please try again.');
    } finally {
      setLoading({ ...loading, avatar: false });
    }
  };

  const handlePasswordChange = async (values: any) => {
    setLoading({ ...loading, password: true });
    try {
      await changePassword({
        old_password: values.old_password,
        password: values.password,
        password_confirmation: values.password_confirmation,
      });

      message.success('Password changed successfully');

      // Reset form fields
      values.old_password = '';
      values.password = '';
      values.password_confirmation = '';
    } catch (error: any) {
      const errorData = error.response?.data;
      if (errorData?.errors) {
        const formErrors = Object.entries(errorData.errors)
          .map(([field, msgs]) => `${field}: ${msgs.join(', ')}`)
          .join('. ');

        message.error(formErrors);
      } else if (errorData?.message) {
        message.error(errorData.message);
      } else {
        message.error('Failed to change password. Please try again.');
      }
    } finally {
      setLoading({ ...loading, password: false });
    }
  };

  return (
    <MainLayout>
      <Head title="Edit Profile" />

      <div className="max-w-4xl mx-auto">
        <Card className="mb-8">
          <Tabs
            defaultActiveKey={activeTab}
            activeKey={activeTab}
            onChange={handleTabChange}
          >
            {/* Profile Info Tab */}
            <TabPane tab="Profile Information" key="profile">
              <Form
                layout="vertical"
                onFinish={handleProfileUpdate}
                initialValues={{
                  fullname: user.fullname,
                  username: user.username,
                  phone: user.phone,
                  gender: user.gender,
                  dob: user.dob ? dayjs(user.dob) : undefined,
                  address: user.address,
                  next_of_kin: user.next_of_kin,
                }}
              >
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Form.Item
                    name="fullname"
                    label="Full Name"
                    rules={[
                      {
                        required: true,
                        message: 'Please enter your full name',
                      },
                      { min: 3, message: 'Name must be at least 3 characters' },
                    ]}
                  >
                    <Input prefix={<UserOutlined />} placeholder="Full Name" />
                  </Form.Item>

                  <Form.Item
                    name="username"
                    label="Username"
                    rules={[
                      {
                        min: 3,
                        message: 'Username must be at least 3 characters',
                      },
                    ]}
                  >
                    <Input prefix={<UserOutlined />} placeholder="Username" />
                  </Form.Item>

                  <Form.Item label="Email" required>
                    <Input
                      prefix={<MailOutlined />}
                      defaultValue={user.email}
                      disabled
                    />
                    <div className="mt-1 text-xs text-gray-500">
                      Email cannot be changed
                    </div>
                  </Form.Item>

                  <Form.Item
                    name="phone"
                    label="Phone Number"
                    rules={[
                      {
                        pattern: /^\d{10,13}$/,
                        message: 'Please enter a valid phone number',
                      },
                    ]}
                  >
                    <Input
                      prefix={<PhoneOutlined />}
                      placeholder="Phone Number"
                    />
                  </Form.Item>

                  <Form.Item name="gender" label="Gender">
                    <Select placeholder="Select gender">
                      <Option value="male">Male</Option>
                      <Option value="female">Female</Option>
                      <Option value="other">Other</Option>
                    </Select>
                  </Form.Item>

                  <Form.Item name="dob" label="Date of Birth">
                    <DatePicker className="w-full" />
                  </Form.Item>
                </div>

                <Form.Item name="address" label="Address">
                  <TextArea
                    rows={3}
                    placeholder="Your address"
                    prefix={<HomeOutlined />}
                  />
                </Form.Item>

                <Form.Item name="next_of_kin" label="Next of Kin">
                  <Input placeholder="Next of kin information" />
                </Form.Item>

                <Divider />

                <div className="flex justify-end space-x-4">
                  <Link href="/profile">
                    <Button>Cancel</Button>
                  </Link>
                  <Button
                    type="primary"
                    htmlType="submit"
                    loading={loading.profile}
                  >
                    Save Changes
                  </Button>
                </div>
              </Form>
            </TabPane>

            {/* Avatar Tab */}
            <TabPane tab="Profile Picture" key="avatar">
              <div className="flex flex-col items-center space-y-6 py-4">
                <Avatar
                  size={150}
                  src={
                    fileList.length > 0
                      ? fileList[0].url ||
                        URL.createObjectURL(fileList[0] as any)
                      : '/assets/default-avatar.png'
                  }
                />

                <Upload
                  beforeUpload={beforeUpload}
                  fileList={fileList}
                  onRemove={() => {
                    setAvatar(null);
                    setFileList([]);
                  }}
                  maxCount={1}
                  showUploadList={false}
                >
                  <Button icon={<UploadOutlined />}>Select New Image</Button>
                </Upload>

                {fileList.length > 0 && (
                  <div>
                    <p className="text-xs text-gray-500 mb-2">
                      {fileList[0].name}
                    </p>
                  </div>
                )}

                <Divider />

                <div className="flex justify-center space-x-4">
                  <Link href="/profile">
                    <Button>Cancel</Button>
                  </Link>
                  <Button
                    type="primary"
                    onClick={handleAvatarUpload}
                    loading={loading.avatar}
                    disabled={!avatar}
                  >
                    Upload Avatar
                  </Button>
                </div>
              </div>
            </TabPane>

            {/* Password Change Tab */}
            <TabPane tab="Change Password" key="password">
              <Form layout="vertical" onFinish={handlePasswordChange}>
                <Form.Item
                  name="old_password"
                  label="Current Password"
                  rules={[
                    {
                      required: true,
                      message: 'Please enter your current password',
                    },
                    {
                      min: 6,
                      message: 'Password must be at least 6 characters',
                    },
                  ]}
                >
                  <Input.Password
                    prefix={<LockOutlined />}
                    placeholder="Current Password"
                  />
                </Form.Item>

                <Form.Item
                  name="password"
                  label="New Password"
                  rules={[
                    {
                      required: true,
                      message: 'Please enter your new password',
                    },
                    {
                      min: 6,
                      message: 'Password must be at least 6 characters',
                    },
                  ]}
                >
                  <Input.Password
                    prefix={<LockOutlined />}
                    placeholder="New Password"
                  />
                </Form.Item>

                <Form.Item
                  name="password_confirmation"
                  label="Confirm New Password"
                  dependencies={['password']}
                  rules={[
                    {
                      required: true,
                      message: 'Please confirm your new password',
                    },
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
                >
                  <Input.Password
                    prefix={<LockOutlined />}
                    placeholder="Confirm New Password"
                  />
                </Form.Item>

                <Divider />

                <div className="flex justify-end space-x-4">
                  <Link href="/profile">
                    <Button>Cancel</Button>
                  </Link>
                  <Button
                    type="primary"
                    htmlType="submit"
                    loading={loading.password}
                  >
                    Change Password
                  </Button>
                </div>
              </Form>
            </TabPane>
          </Tabs>
        </Card>
      </div>
    </MainLayout>
  );
};

export default ProfileEdit;
