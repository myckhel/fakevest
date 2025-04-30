import React, { useState } from "react";
import { Card, Tabs, Form, Input, Button, Upload, Modal } from "antd";
import { UploadOutlined, UserOutlined, LockOutlined } from "@ant-design/icons";
import { useAuthUser, useAuthLoading, useDarkMode } from "@/Stores";
import useAuthStore from "@/Stores/authStore";
import useUIStore from "@/Stores/uiStore";

const { TabPane } = Tabs;

const Profile: React.FC = () => {
  // Use selector hooks for targeted re-renders
  const user = useAuthUser();
  const isLoading = useAuthLoading();
  const darkMode = useDarkMode();

  // Access actions directly from store
  const { updateProfile, updateAvatar, changePassword } = useAuthStore();
  const { showToast } = useUIStore();

  // Local state
  const [profileForm] = Form.useForm();
  const [passwordForm] = Form.useForm();
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [previewVisible, setPreviewVisible] = useState(false);
  const [previewImage, setPreviewImage] = useState("");

  // Handle profile update
  const handleProfileUpdate = async (values: any) => {
    try {
      await updateProfile(values);

      if (avatarFile) {
        await updateAvatar(avatarFile);
        setAvatarFile(null);
      }

      showToast("Profile updated successfully", "success");
    } catch (error) {
      console.error("Profile update failed:", error);
      showToast("Failed to update profile. Please try again.", "error");
    }
  };

  // Handle password change
  const handlePasswordChange = async (values: any) => {
    try {
      await changePassword(values);
      passwordForm.resetFields();
      showToast("Password changed successfully", "success");
    } catch (error) {
      console.error("Password change failed:", error);
      showToast("Failed to change password. Please try again.", "error");
    }
  };

  // Handle avatar change
  const handleAvatarChange = (info: any) => {
    if (info.file.status !== "uploading") {
      setAvatarFile(info.file.originFileObj);

      // Preview image
      const reader = new FileReader();
      reader.onload = () => {
        setPreviewImage(reader.result as string);
      };
      reader.readAsDataURL(info.file.originFileObj);
    }
  };

  // Show preview
  const handlePreview = () => {
    if (previewImage || user?.avatar) {
      setPreviewVisible(true);
    }
  };

  if (!user) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Profile Settings</h1>

      <Card
        className={`shadow ${darkMode ? "bg-gray-800 text-white" : "bg-white"}`}
      >
        <Tabs defaultActiveKey="profile">
          <TabPane tab="Personal Information" key="profile">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="col-span-1">
                <div className="text-center">
                  <div
                    className="w-32 h-32 rounded-full mx-auto mb-4 bg-cover bg-center cursor-pointer"
                    style={{
                      backgroundImage: `url(${
                        previewImage ||
                        user.avatar ||
                        "/assets/default-avatar.png"
                      })`,
                    }}
                    onClick={handlePreview}
                  />

                  <Upload
                    name="avatar"
                    showUploadList={false}
                    beforeUpload={() => false}
                    onChange={handleAvatarChange}
                  >
                    <Button icon={<UploadOutlined />}>Change Avatar</Button>
                  </Upload>
                </div>
              </div>

              <div className="col-span-2">
                <Form
                  form={profileForm}
                  layout="vertical"
                  initialValues={{
                    fullname: user.fullname,
                    email: user.email,
                    phone: user.phone,
                  }}
                  onFinish={handleProfileUpdate}
                >
                  <Form.Item
                    name="fullname"
                    label="Full Name"
                    rules={[
                      { required: true, message: "Please enter your name" },
                    ]}
                  >
                    <Input prefix={<UserOutlined />} placeholder="Full Name" />
                  </Form.Item>

                  <Form.Item name="email" label="Email">
                    <Input type="email" disabled />
                  </Form.Item>

                  <Form.Item
                    name="phone"
                    label="Phone Number"
                    rules={[
                      {
                        required: true,
                        message: "Please enter your phone number",
                      },
                      {
                        pattern: /^\d{11}$/,
                        message: "Please enter a valid 11-digit phone number",
                      },
                    ]}
                  >
                    <Input placeholder="Phone Number" />
                  </Form.Item>

                  <Form.Item>
                    <Button
                      type="primary"
                      htmlType="submit"
                      className="bg-blue-500"
                      loading={isLoading}
                    >
                      Update Profile
                    </Button>
                  </Form.Item>
                </Form>
              </div>
            </div>
          </TabPane>

          <TabPane tab="Change Password" key="password">
            <Form
              form={passwordForm}
              layout="vertical"
              onFinish={handlePasswordChange}
            >
              <Form.Item
                name="old_password"
                label="Current Password"
                rules={[
                  {
                    required: true,
                    message: "Please enter your current password",
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
                  { required: true, message: "Please enter a new password" },
                  {
                    min: 8,
                    message: "Password must be at least 8 characters long",
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
                dependencies={["password"]}
                rules={[
                  {
                    required: true,
                    message: "Please confirm your new password",
                  },
                  ({ getFieldValue }) => ({
                    validator(_, value) {
                      if (!value || getFieldValue("password") === value) {
                        return Promise.resolve();
                      }
                      return Promise.reject(
                        new Error("The two passwords do not match")
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

              <Form.Item>
                <Button
                  type="primary"
                  htmlType="submit"
                  className="bg-blue-500"
                  loading={isLoading}
                >
                  Change Password
                </Button>
              </Form.Item>
            </Form>
          </TabPane>
        </Tabs>
      </Card>

      <Modal
        visible={previewVisible}
        title="Avatar Preview"
        footer={null}
        onCancel={() => setPreviewVisible(false)}
      >
        <img
          alt="Avatar"
          style={{ width: "100%" }}
          src={previewImage || user.avatar || "/assets/default-avatar.png"}
        />
      </Modal>
    </div>
  );
};

export default Profile;
