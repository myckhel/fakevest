import React, { useState } from "react";
import { Head, Link, router, usePage } from "@inertiajs/react";
import { Button, Form, Input, Alert, message } from "antd";
import { LockOutlined, MailOutlined } from "@ant-design/icons";
import AuthLayout from "@/Layouts/AuthLayout";
import useAuthStore from "@/Stores/authStore";

interface Props {
  token: string;
  email: string;
}

const ResetPassword: React.FC = () => {
  const { resetPassword } = useAuthStore();
  const { token, email } = usePage<Props>().props;
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState<string | null>(null);

  const handleSubmit = async (values: {
    email: string;
    password: string;
    password_confirmation: string;
  }) => {
    setLoading(true);
    try {
      const response = await resetPassword({
        token,
        email: values.email,
        password: values.password,
        password_confirmation: values.password_confirmation,
      });

      setSuccess(response.message);

      // Redirect to login after 2 seconds
      setTimeout(() => {
        router.visit("/login");
      }, 2000);
    } catch (error: any) {
      const errorData = error.response?.data;
      const errorMessage =
        errorData?.message || "Failed to reset password. Please try again.";

      // Handle validation errors
      if (errorData?.errors) {
        const formErrors = Object.entries(errorData.errors)
          .map(
            ([field, messages]: [string, any]) =>
              `${field}: ${messages.join(", ")}`
          )
          .join(". ");

        message.error(formErrors);
      } else {
        message.error(errorMessage);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout
      title="Set New Password"
      description="Create a new password for your account"
    >
      <Head title="Reset Password" />

      {success && (
        <Alert
          message="Success"
          description={success}
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
            { required: true, message: "Please enter your email" },
            { type: "email", message: "Please enter a valid email" },
          ]}
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
            { required: true, message: "Please enter your new password" },
            { min: 6, message: "Password must be at least 6 characters" },
          ]}
        >
          <Input.Password
            prefix={<LockOutlined className="site-form-item-icon" />}
            placeholder="New Password"
            size="large"
          />
        </Form.Item>

        <Form.Item
          name="password_confirmation"
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
            disabled={!!success}
          >
            Reset Password
          </Button>
        </Form.Item>

        <div className="text-center mt-4">
          <p>
            Remember your password?{" "}
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
