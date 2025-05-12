import React, { useState } from 'react';

import {
  CheckCircleOutlined,
  SafetyCertificateOutlined,
  WalletOutlined,
} from '@ant-design/icons';
import {
  Alert,
  Button,
  Form,
  InputNumber,
  Modal,
  Select,
  Steps,
  Typography,
} from 'antd';

import useUIStore from '@/Stores/uiStore';
import useWalletStore from '@/Stores/walletStore';

import TransactionPin from '../PIN/TransactionPin';

const { Title, Text } = Typography;
const { Option } = Select;

type WithdrawFundsModalProps = {
  visible: boolean;
  onClose: () => void;
};

/**
 * Modal component for withdrawing funds from a wallet
 */
const WithdrawFundsModal: React.FC<WithdrawFundsModalProps> = ({
  visible,
  onClose,
}) => {
  const [form] = Form.useForm();
  const [_isLoading, setIsLoading] = useState(false);
  const [withdrawSuccess, setWithdrawSuccess] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [withdrawDetails, setWithdrawDetails] = useState<any>(null);

  const { withdrawFunds } = useWalletStore();
  const { showToast } = useUIStore();

  const handleWithdrawDetailsSubmit = (values: any) => {
    setWithdrawDetails(values);
    setCurrentStep(1);
  };

  const handlePinSuccess = async (pin: string) => {
    try {
      setIsLoading(true);
      await withdrawFunds({
        amount: withdrawDetails.amount,
        wallet_name: 'naira',
        account_id: withdrawDetails.accountId,
        pin: pin,
      });

      setWithdrawSuccess(true);
      setTimeout(() => {
        handleClose();
      }, 2000);

      showToast('Withdrawal initiated successfully', 'success');
    } catch (error: any) {
      const errorMessage =
        error.response?.data?.message || 'Withdrawal failed. Please try again.';
      showToast(errorMessage, 'error');
    } finally {
      setIsLoading(false);
    }
  };

  const handleClose = () => {
    setWithdrawSuccess(false);
    setCurrentStep(0);
    setWithdrawDetails(null);
    form.resetFields();
    onClose();
  };

  const handleBack = () => {
    setCurrentStep(0);
  };

  const renderSteps = () => (
    <Steps
      current={currentStep}
      className="mb-6"
      items={[
        {
          title: 'Details',
          icon: <WalletOutlined />,
        },
        {
          title: 'Authorization',
          icon: <SafetyCertificateOutlined />,
        },
      ]}
    />
  );

  const renderWithdrawForm = () => (
    <Form
      form={form}
      layout="vertical"
      onFinish={handleWithdrawDetailsSubmit}
      requiredMark={false}
      preserve={false}
    >
      <Alert
        message="Withdrawal Information"
        description="Withdrawals are processed within 24 hours during business days."
        type="info"
        showIcon
        className="mb-4"
      />

      <Form.Item
        name="accountId"
        label="Account"
        rules={[{ required: true, message: 'Please select account' }]}
      >
        <Select placeholder="Select bank account">
          <Option value={1}>Access Bank - 012345678</Option>
          <Option value={2}>GTBank - 987654321</Option>
          <Option value="new">+ Add New Account</Option>
        </Select>
      </Form.Item>

      <Form.Item
        name="amount"
        label="Amount"
        rules={[
          { required: true, message: 'Please enter amount' },
          {
            type: 'number',
            min: 1000,
            message: 'Minimum withdrawal is ₦1,000',
          },
        ]}
      >
        <InputNumber
          style={{ width: '100%' }}
          formatter={(value) =>
            `₦ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')
          }
          parser={(value) => value!.replace(/₦\s?|(,*)/g, '')}
          placeholder="Enter amount"
        />
      </Form.Item>

      <Form.Item>
        <Button type="primary" htmlType="submit" block>
          Continue
        </Button>
      </Form.Item>
    </Form>
  );

  return (
    <Modal
      title="Withdraw Funds"
      open={visible}
      onCancel={handleClose}
      footer={null}
      destroyOnClose
    >
      {withdrawSuccess ? (
        <div className="text-center py-8">
          <CheckCircleOutlined style={{ fontSize: 48, color: '#52c41a' }} />
          <Title level={4} className="mt-4">
            Withdrawal Initiated!
          </Title>
          <Text>Your withdrawal request is being processed.</Text>
        </div>
      ) : (
        <>
          {renderSteps()}

          {currentStep === 0 && renderWithdrawForm()}

          {currentStep === 1 && (
            <>
              <div className="mb-4">
                <Text strong>Withdrawal Summary</Text>
                <div className="bg-gray-50 dark:bg-gray-800 p-3 rounded mt-2">
                  <div className="flex justify-between mb-1">
                    <Text>Account:</Text>
                    <Text strong>
                      {withdrawDetails?.accountId === 1
                        ? 'Access Bank - 012345678'
                        : withdrawDetails?.accountId === 2
                          ? 'GTBank - 987654321'
                          : withdrawDetails?.accountId}
                    </Text>
                  </div>
                  <div className="flex justify-between mb-1">
                    <Text>Amount:</Text>
                    <Text strong>
                      ₦{withdrawDetails?.amount?.toLocaleString()}
                    </Text>
                  </div>
                </div>
              </div>

              <TransactionPin
                onSuccess={handlePinSuccess}
                onCancel={handleBack}
              />
            </>
          )}
        </>
      )}
    </Modal>
  );
};

export default WithdrawFundsModal;
