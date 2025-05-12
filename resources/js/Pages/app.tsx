import React from 'react';

import {
  BankOutlined,
  LockOutlined,
  RiseOutlined,
  SafetyOutlined,
} from '@ant-design/icons';
import { Button, Typography, Row, Col, Card, _Divider } from 'antd';

const { Title, Paragraph } = Typography;

const HomePage = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-gray-100">
      {/* Hero Section */}
      <div className="pt-20 pb-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="text-center">
          <h1 className="text-5xl font-extrabold tracking-tight text-[#3b8cb7] sm:text-6xl md:text-7xl">
            Fakevest
          </h1>
          <p className="mt-3 text-xl text-gray-600 sm:mt-5 max-w-2xl mx-auto">
            The smarter way to save and reach your financial goals
          </p>
          <div className="mt-8 flex justify-center">
            <Button
              type="primary"
              size="large"
              className="bg-[#3b8cb7] hover:bg-[#2a7ca7] mr-4 h-12 px-8"
            >
              Get Started
            </Button>
            <Button
              size="large"
              className="border-[#3b8cb7] text-[#3b8cb7] hover:text-[#2a7ca7] h-12 px-8"
            >
              Learn More
            </Button>
          </div>
        </div>

        <div className="mt-16 shadow-xl rounded-lg overflow-hidden">
          <img
            src="/assets/dashboard-preview.png"
            alt="Fakevest Dashboard Preview"
            className="w-full object-cover"
            onError={(e) => {
              e.currentTarget.src =
                'https://fakeimg.pl/1200x600/?text=Fakevest+Dashboard';
            }}
          />
        </div>
      </div>

      {/* Features Section */}
      <div className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <Title level={2} className="text-3xl font-bold text-gray-800">
              Save Smarter, Achieve Faster
            </Title>
            <Paragraph className="mt-4 text-lg text-gray-600 max-w-3xl mx-auto">
              Fakevest helps you manage your money better with flexible savings
              options tailored to your financial goals.
            </Paragraph>
          </div>

          <Row gutter={[32, 32]} className="mt-12">
            <Col xs={24} md={8}>
              <Card
                hoverable
                className="h-full text-center shadow-md hover:shadow-lg transition-shadow"
                cover={
                  <div className="py-6 bg-blue-50 flex justify-center">
                    <BankOutlined
                      style={{ fontSize: '3rem', color: '#3b8cb7' }}
                    />
                  </div>
                }
              >
                <Title level={3} className="text-xl font-semibold">
                  Flex Savings
                </Title>
                <Paragraph className="mt-2 text-gray-600">
                  Save at your own pace and withdraw your money whenever you
                  need it, with no restrictions.
                </Paragraph>
              </Card>
            </Col>
            <Col xs={24} md={8}>
              <Card
                hoverable
                className="h-full text-center shadow-md hover:shadow-lg transition-shadow"
                cover={
                  <div className="py-6 bg-blue-50 flex justify-center">
                    <LockOutlined
                      style={{ fontSize: '3rem', color: '#3b8cb7' }}
                    />
                  </div>
                }
              >
                <Title level={3} className="text-xl font-semibold">
                  Lock Savings
                </Title>
                <Paragraph className="mt-2 text-gray-600">
                  Lock your money away for a fixed period to earn higher
                  interest and resist the temptation to spend.
                </Paragraph>
              </Card>
            </Col>
            <Col xs={24} md={8}>
              <Card
                hoverable
                className="h-full text-center shadow-md hover:shadow-lg transition-shadow"
                cover={
                  <div className="py-6 bg-blue-50 flex justify-center">
                    <RiseOutlined
                      style={{ fontSize: '3rem', color: '#3b8cb7' }}
                    />
                  </div>
                }
              >
                <Title level={3} className="text-xl font-semibold">
                  Target Savings
                </Title>
                <Paragraph className="mt-2 text-gray-600">
                  Set specific savings goals and track your progress as you work
                  towards achieving them.
                </Paragraph>
              </Card>
            </Col>
          </Row>
        </div>
      </div>

      {/* Benefits Section */}
      <div className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <Title level={2} className="text-3xl font-bold text-gray-800">
              Why Choose Fakevest?
            </Title>
          </div>

          <Row gutter={[32, 32]} className="mt-12">
            <Col xs={24} md={12}>
              <div className="flex items-start">
                <div className="flex-shrink-0">
                  <SafetyOutlined className="text-[#3b8cb7] text-2xl" />
                </div>
                <div className="ml-4">
                  <Title level={4} className="text-xl font-semibold">
                    Secure & Reliable
                  </Title>
                  <Paragraph className="mt-2 text-gray-600">
                    Your savings are secure with bank-level encryption and
                    security practices.
                  </Paragraph>
                </div>
              </div>
            </Col>
            <Col xs={24} md={12}>
              <div className="flex items-start">
                <div className="flex-shrink-0">
                  <BankOutlined className="text-[#3b8cb7] text-2xl" />
                </div>
                <div className="ml-4">
                  <Title level={4} className="text-xl font-semibold">
                    Competitive Returns
                  </Title>
                  <Paragraph className="mt-2 text-gray-600">
                    Earn competitive interest rates on your savings across all
                    our plans.
                  </Paragraph>
                </div>
              </div>
            </Col>
          </Row>
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-[#3b8cb7] py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <Title level={2} className="text-3xl font-bold text-white">
            Start Your Savings Journey Today
          </Title>
          <Paragraph className="mt-4 text-lg text-white max-w-3xl mx-auto">
            Join thousands of users who are growing their wealth with Fakevest.
          </Paragraph>
          <Button
            size="large"
            className="mt-8 bg-white text-[#3b8cb7] hover:bg-gray-100 h-12 px-8"
          >
            Create Account
          </Button>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-[#3b8cb7]">Fakevest</h2>
            <p className="mt-2 text-gray-400">
              © 2025 Fakevest. All rights reserved.
            </p>
            <div className="mt-4">
              <a href="#" className="text-gray-400 hover:text-white mx-2">
                About
              </a>
              <a href="#" className="text-gray-400 hover:text-white mx-2">
                Privacy Policy
              </a>
              <a href="#" className="text-gray-400 hover:text-white mx-2">
                Terms of Service
              </a>
              <a href="#" className="text-gray-400 hover:text-white mx-2">
                Contact
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default HomePage;
