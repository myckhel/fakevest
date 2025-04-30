import React, { useState } from "react";
import { Head, Link } from "@inertiajs/react";
import { Button, Form, Input, Alert, message } from "antd";
import { MailOutlined } from "@ant-design/icons";
import AuthLayout from "@/Layouts/AuthLayout";
import useAuthStore from "@/Stores/authStore";

const ForgotPassword: React.FC = () => {
  const { forgotPassword } = useAuthStore();
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState<string | null>(null);

  const handleSubmit = async (values: { email: string }) => {
    setLoading(true);
    try {
      const response = await forgotPassword(values.email);
      setSuccess(response.message);
    } catch (error: any) {
      const errorMessage =
        error.response?.data?.message ||
        "Failed to send reset link. Please try again.";
      message.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout
      title="Reset Password"
      description="Enter your email address and we'll send you a password reset link"
    >
      <Head title="Forgot Password" />

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
        name="forgotPassword"
        layout="vertical"
        className="mt-8 space-y-6"
        onFinish={handleSubmit}
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

        <Form.Item>
          <Button
            type="primary"
            htmlType="submit"
            size="large"
            className="w-full"
            loading={loading}
            disabled={!!success}
          >
            Send Reset Link
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

export default ForgotPassword;
