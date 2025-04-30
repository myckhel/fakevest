import React, { useState } from "react";
import { Head, Link, router } from "@inertiajs/react";
import { Button, Form, Input, Upload, Divider, message } from "antd";
import {
  UserOutlined,
  LockOutlined,
  MailOutlined,
  PhoneOutlined,
  UploadOutlined,
  GithubOutlined,
  GoogleOutlined,
  FacebookOutlined,
} from "@ant-design/icons";
import AuthLayout from "@/Layouts/AuthLayout";
import useAuthStore from "@/Stores/authStore";
import type { RcFile, UploadFile } from "antd/es/upload/interface";

const Register: React.FC = () => {
  const { register, getSocialLoginUrl } = useAuthStore();
  const [loading, setLoading] = useState(false);
  const [avatar, setAvatar] = useState<File | null>(null);
  const [fileList, setFileList] = useState<UploadFile[]>([]);
  const [socialLoading, setSocialLoading] = useState({
    google: false,
    facebook: false,
    github: false,
  });

  const beforeUpload = (file: RcFile) => {
    const isImage = file.type.startsWith("image/");
    if (!isImage) {
      message.error("You can only upload image files!");
    }

    const isLt2M = file.size / 1024 / 1024 < 2;
    if (!isLt2M) {
      message.error("Image must be smaller than 2MB!");
    }

    if (isImage && isLt2M) {
      setAvatar(file);
      setFileList([file]);
    }

    // Return false to prevent automatic upload
    return false;
  };

  const handleRegister = async (values: any) => {
    setLoading(true);
    try {
      await register(
        {
          fullname: values.fullname,
          email: values.email,
          phone: values.phone,
          username: values.username,
          password: values.password,
          password_confirmation: values.confirm,
          device_type: "web",
          device_name: navigator.userAgent,
        },
        avatar || undefined
      );

      message.success("Registration successful!");
      router.visit("/dashboard");
    } catch (error: any) {
      const errorData = error.response?.data;
      const errorMessage =
        errorData?.message || "Registration failed. Please try again.";

      // Handle validation errors from the server
      if (errorData?.errors) {
        const formErrors = Object.entries(errorData.errors)
          .map(([field, messages]) => `${field}: ${messages.join(", ")}`)
          .join(". ");

        message.error(formErrors);
      } else {
        message.error(errorMessage);
      }
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
            { required: true, message: "Please enter your full name", min: 6 },
          ]}
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
          name="phone"
          rules={[
            {
              pattern: /^\d{10,11}$/,
              message: "Please enter a valid phone number",
            },
          ]}
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
            { message: "Username must be at least 3 characters", min: 3 },
          ]}
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
            { required: true, message: "Please enter your password" },
            { min: 6, message: "Password must be at least 6 characters" },
          ]}
        >
          <Input.Password
            prefix={<LockOutlined className="site-form-item-icon" />}
            placeholder="Password"
            size="large"
          />
        </Form.Item>

        <Form.Item
          name="confirm"
          dependencies={["password"]}
          rules={[
            { required: true, message: "Please confirm your password" },
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
            prefix={<LockOutlined className="site-form-item-icon" />}
            placeholder="Confirm Password"
            size="large"
          />
        </Form.Item>

        <Form.Item name="avatar" label="Profile Picture (optional)">
          <Upload
            beforeUpload={beforeUpload}
            maxCount={1}
            fileList={fileList}
            onRemove={() => {
              setAvatar(null);
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
            Already have an account?{" "}
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
