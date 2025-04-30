import React from "react";
import { Head, Link } from "@inertiajs/react";
import { Button, Typography, Card, Row, Col, Divider, Space } from "antd";
import { useIsAuthenticated } from "@/Stores/authStore";
import {
  UserOutlined,
  LoginOutlined,
  SafetyOutlined,
  BankOutlined,
  TeamOutlined,
  DollarOutlined,
} from "@ant-design/icons";

const { Title, Paragraph, Text } = Typography;

const Home: React.FC = () => {
  const isAuthenticated = useIsAuthenticated();

  return (
    <div
      className={`min-h-screen bg-gradient-to-br from-blue-50 to-gray-100 dark:from-gray-900 dark:to-gray-800`}
    >
      <Head title="Welcome to FakeVest" />

      {/* Hero Section */}
      <div className="bg-blue-600 text-white">
        <div className="max-w-7xl mx-auto px-6 py-24 md:py-32">
          <div className="flex flex-col md:flex-row items-center justify-between gap-8">
            <div className="text-center md:text-left">
              <Title
                level={1}
                className="text-4xl md:text-5xl font-bold text-white mb-6"
              >
                Secure, Simple, Smart Banking
              </Title>

              <Paragraph className="text-lg md:text-xl text-blue-100 mb-8">
                Join thousands of people who trust FakeVest with their financial
                journey. Start saving, investing, and growing your wealth today.
              </Paragraph>

              <Space size="large">
                {isAuthenticated ? (
                  <Link href="/dashboard">
                    <Button
                      type="primary"
                      size="large"
                      className="bg-white text-blue-600 hover:bg-blue-50 border-white"
                    >
                      Go to Dashboard
                    </Button>
                  </Link>
                ) : (
                  <>
                    <Link href="/register">
                      <Button
                        type="primary"
                        size="large"
                        className="bg-white text-blue-600 hover:bg-blue-50 border-white"
                      >
                        Get Started
                      </Button>
                    </Link>
                    <Link href="/login">
                      <Button
                        type="default"
                        size="large"
                        ghost
                        className="text-white hover:bg-blue-500"
                      >
                        Sign In
                      </Button>
                    </Link>
                  </>
                )}
              </Space>
            </div>
            <div className="hidden md:block">
              {/* This would be an illustration or app screenshot */}
              <div className="w-80 h-80 rounded-lg bg-blue-500 flex items-center justify-center shadow-lg">
                <BankOutlined style={{ fontSize: "120px", color: "white" }} />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="py-16 md:py-24 bg-white dark:bg-gray-900">
        <div className="max-w-7xl mx-auto px-6">
          <Title level={2} className="text-center mb-16">
            Features That Make FakeVest Different
          </Title>

          <Row gutter={[32, 32]}>
            <Col xs={24} md={8}>
              <Card
                className="h-full shadow-md hover:shadow-lg transition-shadow"
                bordered={false}
                hoverable
              >
                <div className="text-center mb-6">
                  <SafetyOutlined className="text-5xl text-blue-600" />
                </div>
                <Title level={4} className="text-center">
                  Secure Banking
                </Title>
                <Paragraph className="text-center">
                  Bank-level security with advanced encryption to keep your
                  money and data safe.
                </Paragraph>
              </Card>
            </Col>

            <Col xs={24} md={8}>
              <Card
                className="h-full shadow-md hover:shadow-lg transition-shadow"
                bordered={false}
                hoverable
              >
                <div className="text-center mb-6">
                  <DollarOutlined className="text-5xl text-blue-600" />
                </div>
                <Title level={4} className="text-center">
                  Smart Savings
                </Title>
                <Paragraph className="text-center">
                  Automated savings plans that help you reach your financial
                  goals faster.
                </Paragraph>
              </Card>
            </Col>

            <Col xs={24} md={8}>
              <Card
                className="h-full shadow-md hover:shadow-lg transition-shadow"
                bordered={false}
                hoverable
              >
                <div className="text-center mb-6">
                  <TeamOutlined className="text-5xl text-blue-600" />
                </div>
                <Title level={4} className="text-center">
                  Social Banking
                </Title>
                <Paragraph className="text-center">
                  Connect with friends and share savings challenges for better
                  financial habits.
                </Paragraph>
              </Card>
            </Col>
          </Row>
        </div>
      </div>

      {/* Call to Action */}
      <div className="py-16 md:py-24 bg-gray-50 dark:bg-gray-800">
        <div className="max-w-3xl mx-auto px-6 text-center">
          <Title level={2} className="mb-6">
            Ready to Start Your Financial Journey?
          </Title>
          <Paragraph className="text-lg mb-8">
            Join FakeVest today and take control of your finances with our
            secure, easy-to-use platform.
          </Paragraph>

          {!isAuthenticated && (
            <Space size="large" wrap className="justify-center">
              <Link href="/register">
                <Button
                  type="primary"
                  size="large"
                  icon={<UserOutlined />}
                  className="min-w-[150px]"
                >
                  Create Account
                </Button>
              </Link>
              <Link href="/login">
                <Button
                  size="large"
                  icon={<LoginOutlined />}
                  className="min-w-[150px]"
                >
                  Sign In
                </Button>
              </Link>
            </Space>
          )}

          {isAuthenticated && (
            <Link href="/dashboard">
              <Button type="primary" size="large">
                Go to Dashboard
              </Button>
            </Link>
          )}
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex flex-col md:flex-row justify-between">
            <div className="mb-8 md:mb-0">
              <Title level={4} className="text-white">
                FakeVest
              </Title>
              <Paragraph className="text-gray-400">
                Secure, Simple, Smart Banking
              </Paragraph>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 gap-8">
              <div>
                <Title level={5} className="text-white mb-4">
                  Product
                </Title>
                <ul className="space-y-2 text-gray-400">
                  <li>
                    <a href="#" className="hover:text-white">
                      Features
                    </a>
                  </li>
                  <li>
                    <a href="#" className="hover:text-white">
                      Pricing
                    </a>
                  </li>
                  <li>
                    <a href="#" className="hover:text-white">
                      Security
                    </a>
                  </li>
                </ul>
              </div>

              <div>
                <Title level={5} className="text-white mb-4">
                  Company
                </Title>
                <ul className="space-y-2 text-gray-400">
                  <li>
                    <a href="#" className="hover:text-white">
                      About
                    </a>
                  </li>
                  <li>
                    <a href="#" className="hover:text-white">
                      Careers
                    </a>
                  </li>
                  <li>
                    <a href="#" className="hover:text-white">
                      Contact
                    </a>
                  </li>
                </ul>
              </div>

              <div>
                <Title level={5} className="text-white mb-4">
                  Legal
                </Title>
                <ul className="space-y-2 text-gray-400">
                  <li>
                    <a href="#" className="hover:text-white">
                      Privacy
                    </a>
                  </li>
                  <li>
                    <a href="#" className="hover:text-white">
                      Terms
                    </a>
                  </li>
                  <li>
                    <a href="#" className="hover:text-white">
                      Cookies
                    </a>
                  </li>
                </ul>
              </div>
            </div>
          </div>

          <Divider className="border-gray-800 my-8" />

          <div className="text-center text-gray-500 text-sm">
            &copy; {new Date().getFullYear()} FakeVest. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Home;
