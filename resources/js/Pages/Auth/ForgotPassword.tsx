import React, { useState, useEffect } from "react";
import { Head, Link, usePage } from "@inertiajs/react";
import { Button, Form, Input, Alert, message } from "antd";
import { MailOutlined } from "@ant-design/icons";
import AuthLayout from "@/Layouts/AuthLayout";
import { inertiaApi } from "@/utils/inertiaApi";

interface PageProps {
  errors: Record<string, string>;
  status?: string;
}

const ForgotPassword: React.FC = () => {
  const { errors, status } = usePage<PageProps>().props;
  const [loading, setLoading] = useState(false);

  // Display flash messages from server
  useEffect(() => {
    if (Object.keys(errors).length > 0) {
      Object.values(errors).forEach((error) => {
        message.error(error);
      });
    }
  }, [errors]);

  const handleSubmit = (values: { email: string }) => {
    setLoading(true);

    // Use inertiaApi utility to ensure proper /api/v1 base path
    inertiaApi.post(
      "auth/password/forgot",
      {
        email: values.email,
      },
      {
        onFinish: () => {
          setLoading(false);
        },
        preserveScroll: true,
      }
    );
  };

  return (
    <AuthLayout
      title="Reset Password"
      description="Enter your email address and we'll send you a password reset link"
    >
      <Head title="Forgot Password" />

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
          validateStatus={errors.email ? "error" : ""}
          help={errors.email}
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
            disabled={!!status}
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
