import React, { useEffect, useState } from 'react';

import { LoadingOutlined } from '@ant-design/icons';
import {
  Alert,
  Button,
  Form,
  InputNumber,
  Modal,
  Result,
  Select,
  Space,
  Spin,
  Typography,
} from 'antd';

import API from '@/Apis';
import { DepositData } from '@/Apis/wallet';
import useUIStore from '@/Stores/uiStore';

const { Option } = Select;

interface DepositFundsModalProps {
  visible: boolean;
  onClose: () => void;
  onSuccess?: () => void;
  defaultWallet?: string;
}

/**
 * Modal component for depositing funds to wallet using the enhanced flow:
 * 1. Initiate payment with POST /payments
 * 2. User completes payment in Paystack window
 * 3. Verify payment with POST /payments/verify
 */
const DepositFundsModal: React.FC<DepositFundsModalProps> = ({
  visible,
  onClose,
  onSuccess,
  defaultWallet = 'naira',
}) => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  // Payment flow states
  const [paymentUrl, setPaymentUrl] = useState<string | null>(null);
  const [reference, setReference] = useState<string | null>(null);
  const [verifying, setVerifying] = useState(false);

  const { showToast } = useUIStore();

  // Reset form when modal becomes visible
  useEffect(() => {
    if (visible) {
      form.setFieldsValue({
        wallet_name: defaultWallet,
      });
    }
  }, [visible, defaultWallet, form]);

  // Handle form submission
  const handleSubmit = async (values: Record<string, any>) => {
    try {
      setLoading(true);
      setError(null);

      // Step 1: Initiate the deposit to get authorization URL
      const depositData: DepositData = {
        amount: values.amount,
        wallet_name: values.wallet_name,
      };

      const response = await API.wallet.initiateDeposit(depositData);

      // Store the payment URL and reference for verification later
      setPaymentUrl(response.authorization_url);
      setReference(response.reference);

      // Open the Paystack checkout in a new window
      const paymentWindow = window.open(response.authorization_url, '_blank');

      if (!paymentWindow) {
        setError('Please enable popups to complete the payment process.');
      }
    } catch (error: any) {
      setError(
        error.response?.data?.message ||
          'Failed to initiate payment. Please try again.',
      );
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    form.resetFields();
    setError(null);
    setSuccess(false);
    setPaymentUrl(null);
    setReference(null);
    onClose();
  };

  // Verify payment after user completes the Paystack checkout
  const handleVerifyPayment = async () => {
    if (!reference) return;

    try {
      setVerifying(true);
      setError(null);

      const result = await API.paymentOptions.verifyPayment(reference);

      if (result.status) {
        setSuccess(true);
        showToast('Funds deposited successfully', 'success');

        if (onSuccess) {
          setTimeout(() => {
            onSuccess();
          }, 1500);
        }
      } else {
        setError('Payment verification failed. Please try again.');
      }
    } catch (error: any) {
      setError(
        error.response?.data?.message ||
          'Failed to verify payment. Please try again.',
      );
    } finally {
      setVerifying(false);
    }
  };

  // Render the modal content based on the current state
  const renderContent = () => {
    if (success) {
      return (
        <Result
          status="success"
          title="Deposit Successful"
          subTitle="Your funds have been deposited to your wallet"
          extra={
            <Button type="primary" onClick={handleClose}>
              Done
            </Button>
          }
        />
      );
    }

    if (paymentUrl && reference) {
      return (
        <div className="text-center">
          <Alert
            message="Payment in Progress"
            description="Complete the payment process in the opened window to deposit funds."
            type="info"
            showIcon
            className="mb-4"
          />

          {error && (
            <Alert
              message="Error"
              description={error}
              type="error"
              showIcon
              className="mb-4"
            />
          )}

          <div className="mb-4">
            <Typography.Paragraph>
              {verifying ? (
                <Spin
                  indicator={<LoadingOutlined style={{ fontSize: 24 }} spin />}
                />
              ) : (
                'Click the button below when you have completed the payment process'
              )}
            </Typography.Paragraph>
          </div>

          <Space>
            <Button onClick={handleClose}>Cancel</Button>
            <Button
              type="primary"
              onClick={handleVerifyPayment}
              loading={verifying}
              disabled={verifying}
            >
              {verifying ? 'Verifying...' : "I've Completed Payment"}
            </Button>
          </Space>

          <div className="mt-4">
            <Typography.Text type="secondary">
              If you accidentally closed the payment window,{' '}
              <Button type="link" href={paymentUrl} target="_blank">
                click here to reopen it
              </Button>
            </Typography.Text>
          </div>
        </div>
      );
    }

    return (
      <Form
        form={form}
        layout="vertical"
        onFinish={handleSubmit}
        initialValues={{
          wallet_name: defaultWallet,
        }}
      >
        {error && (
          <Alert
            message="Error"
            description={error}
            type="error"
            showIcon
            className="mb-4"
          />
        )}

        <Form.Item
          name="wallet_name"
          label="Select Wallet"
          rules={[{ required: true, message: 'Please select a wallet' }]}
        >
          <Select>
            <Option value="naira">Naira Wallet</Option>
            <Option value="dollar">Dollar Wallet</Option>
          </Select>
        </Form.Item>

        <Form.Item
          name="amount"
          label="Amount"
          rules={[
            { required: true, message: 'Please enter an amount' },
            {
              type: 'number',
              min: 100,
              message: 'Minimum deposit amount is ₦100',
            },
          ]}
        >
          <InputNumber
            prefix="₦"
            style={{ width: '100%' }}
            placeholder="Enter amount"
            formatter={(value) =>
              `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')
            }
            parser={(value) => value!.replace(/₦\s?|(,*)/g, '')}
          />
        </Form.Item>

        <Form.Item className="mb-0">
          <div className="flex justify-end mt-4">
            <Space>
              <Button onClick={handleClose}>Cancel</Button>
              <Button
                type="primary"
                htmlType="submit"
                loading={loading}
                disabled={loading}
              >
                {loading ? 'Processing...' : 'Proceed to Payment'}
              </Button>
            </Space>
          </div>
        </Form.Item>
      </Form>
    );
  };

  return (
    <Modal
      open={visible}
      onCancel={handleClose}
      footer={null}
      destroyOnClose
      title={
        success
          ? null
          : paymentUrl && reference
            ? 'Complete Payment'
            : 'Deposit Funds'
      }
      width={500}
    >
      {renderContent()}
    </Modal>
  );
};

export default DepositFundsModal;
