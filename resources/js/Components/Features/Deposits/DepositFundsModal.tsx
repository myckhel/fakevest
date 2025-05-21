import Paystack from '@paystack/inline-js';
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

interface PaystackTransaction {
  reference: string;
  [key: string]: unknown;
}

/**
 * Modal component for depositing funds to wallet using the enhanced flow with Paystack InlineJS:
 * 1. Initiate payment with POST /payments
 * 2. User completes payment in Paystack inline popup
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
  const [reference, setReference] = useState<string | null>(null);
  const [verifying, setVerifying] = useState(false);
  const [paystackPublicKey, setPaystackPublicKey] = useState<string>('');

  const { showToast } = useUIStore();

  // Reset form when modal becomes visible and fetch Paystack public key
  useEffect(() => {
    if (visible) {
      form.setFieldsValue({
        wallet_name: defaultWallet,
      });

      // Fetch Paystack public key when modal opens
      const fetchPaystackConfig = async () => {
        try {
          const config = await API.paystack.getConfig();
          setPaystackPublicKey(config.publicKey);
        } catch (error) {
          console.error('Failed to fetch Paystack configuration:', error);
          setError('Failed to load payment configuration. Please try again.');
        }
      };

      fetchPaystackConfig();
    }
  }, [visible, defaultWallet, form]);

  // Handle form submission
  const handleSubmit = async (values: Record<string, unknown>) => {
    try {
      setLoading(true);
      setError(null);

      // Step 1: Initiate the deposit to get reference
      const depositData: DepositData = {
        amount: values.amount as number,
        wallet_name: values.wallet_name as string,
      };

      const response = await API.wallet.initiateDeposit(depositData);

      // Store the reference for verification later
      setReference(response.reference);

      // Initialize Paystack inline payment
      const popup = new Paystack();
      popup.newTransaction({
        key: paystackPublicKey,
        email: response.email || '',
        amount: depositData.amount * 100, // Convert to kobo/cents
        ref: response.reference,
        currency: response.currency || 'NGN',
        onSuccess: (transaction: PaystackTransaction) => {
          // Verify the payment once completed
          handleVerifyPayment(transaction.reference);
        },
        onCancel: () => {
          setError('Payment was cancelled. Please try again.');
          setLoading(false);
        },
        channels: [
          'card',
          'bank',
          'ussd',
          'qr',
          'mobile_money',
          'bank_transfer',
        ],
      });
    } catch (error: unknown) {
      let errorMessage = 'Failed to initiate payment. Please try again.';

      if (error && typeof error === 'object' && 'response' in error) {
        const response = error.response as Record<string, unknown>;
        if (response.data && typeof response.data === 'object') {
          const data = response.data as Record<string, unknown>;
          if (data.message && typeof data.message === 'string') {
            errorMessage = data.message;
          }
        }
      }

      setError(errorMessage);
      setLoading(false);
    }
  };

  const handleClose = () => {
    form.resetFields();
    setError(null);
    setSuccess(false);
    setReference(null);
    onClose();
  };

  // Verify payment after user completes the Paystack checkout
  const handleVerifyPayment = async (paymentReference?: string) => {
    const ref = paymentReference || reference;
    if (!ref) return;

    try {
      setVerifying(true);
      setError(null);

      const result = await API.paymentOptions.verifyPayment(ref);

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
    } catch (error: unknown) {
      let errorMessage = 'Failed to verify payment. Please try again.';

      if (error && typeof error === 'object' && 'response' in error) {
        const response = error.response as Record<string, unknown>;
        if (response.data && typeof response.data === 'object') {
          const data = response.data as Record<string, unknown>;
          if (data.message && typeof data.message === 'string') {
            errorMessage = data.message;
          }
        }
      }

      setError(errorMessage);
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

    if (verifying) {
      return (
        <div className="text-center p-8">
          <Spin indicator={<LoadingOutlined style={{ fontSize: 36 }} spin />} />
          <Typography.Title level={4} className="mt-4">
            Verifying Payment
          </Typography.Title>
          <Typography.Paragraph>
            Please wait while we confirm your payment...
          </Typography.Paragraph>
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
      title={success ? null : verifying ? 'Verifying Payment' : 'Deposit Funds'}
      width={500}
    >
      {renderContent()}
    </Modal>
  );
};

export default DepositFundsModal;
